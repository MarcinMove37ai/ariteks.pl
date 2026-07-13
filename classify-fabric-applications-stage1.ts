/**
 * classify-fabric-applications-stage1.ts
 *
 * ETAP 1: precyzyjna, wieloetykietowa klasyfikacja wszystkich tkanin
 * do aktywnych aplikacji oraz dwóch pewnych nowych aplikacji:
 *   - architecture-building
 *   - transport
 *
 * Stara aplikacja `ceilings` jest celowo pomijana. Produkty sufitowe
 * klasyfikujemy do `architecture-building`.
 *
 * Skrypt:
 *   - NIE modyfikuje fabrics.ts, applications.ts ani komponentów strony,
 *   - czyta FABRICS oraz APPLICATIONS bezpośrednio z projektu,
 *   - uzupełnia dane produktu z public/.../fabric-complete-record.json,
 *   - wysyła jeden produkt na jedno wywołanie Claude API,
 *   - zapisuje cache po każdym produkcie, więc można bezpiecznie wznowić pracę,
 *   - generuje mapę propozycji oraz osobne raporty matched/review/unmatched.
 *
 * Uruchomienie z katalogu głównego projektu:
 *
 *   npm i -D @anthropic-ai/sdk tsx
 *   npx tsx .\classify-fabric-applications-stage1.ts
 *
 * Opcje:
 *
 *   --force                    przelicz także poprawny cache
 *   --limit=10                 przetwórz tylko pierwsze N produktów
 *   --slug=arneo,ardilight     przetwórz wskazane slugi
 *   --concurrency=2            liczba równoległych wywołań API
 *   --min-confidence=90        próg wejścia do mapy etapu 1
 *   --model=claude-sonnet-5    model Anthropic
 *
 * Klucz:
 *   .env.local -> ANTHROPIC_API_KEY=...
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import Anthropic from '@anthropic-ai/sdk';

import {
  FABRICS,
  getCategoryById,
  getFamilyBySlug,
  type FabricDef,
} from './src/content/fabrics';
import {
  APPLICATIONS,
  type ApplicationDef,
} from './src/content/applications';

// -----------------------------------------------------------------------------
// Konfiguracja
// -----------------------------------------------------------------------------

const ROOT = process.cwd();
const ENV_PATH = path.join(ROOT, '.env.local');

const REPORT_DIR = path.join(
  ROOT,
  'reports',
  'fabric-applications-stage1',
);
const CACHE_DIR = path.join(REPORT_DIR, 'cache');
const ERROR_DIR = path.join(REPORT_DIR, 'errors');

const PROMPT_VERSION = 1;
const DEFAULT_MODEL = 'claude-sonnet-5';
const DEFAULT_MIN_CONFIDENCE = 90;
const DEFAULT_CONCURRENCY = 2;
const DEFAULT_MAX_TOKENS = 4_000;

const CERTAIN_NEW_APPLICATIONS = [
  {
    id: 'architecture-building',
    slug: {
      pl: 'tkaniny-architektoniczne-i-budowlane',
      en: 'architectural-and-building-fabrics',
    },
    name: {
      pl: 'Tkaniny architektoniczne i budowlane',
      en: 'Architectural and building fabrics',
    },
    short: {
      pl: 'Membrany architektoniczne, sufity napinane, tekstylne elementy wnętrz oraz materiały przeznaczone bezpośrednio do budownictwa.',
      en: 'Architectural membranes, stretch ceilings, textile interior systems and fabrics explicitly intended for building applications.',
    },
  },
  {
    id: 'transport',
    slug: {
      pl: 'tkaniny-dla-transportu',
      en: 'transport-fabrics',
    },
    name: {
      pl: 'Tkaniny dla transportu',
      en: 'Transport fabrics',
    },
    short: {
      pl: 'Tkaniny do samochodów, kolei, transportu publicznego, jednostek pływających oraz wyposażenia i tapicerki pojazdów.',
      en: 'Fabrics for automotive, rail, public transport, marine vessels, vehicle equipment, interiors and upholstery.',
    },
  },
] as const;

type ExistingApplicationId =
  | 'military'
  | 'firefighting'
  | 'energy'
  | 'welding'
  | 'motorcycle'
  | 'hivis'
  | 'medical'
  | 'sport';

type NewApplicationId =
  | 'architecture-building'
  | 'transport';

type ApplicationId = ExistingApplicationId | NewApplicationId;

type ClassificationRule = {
  include: string;
  exclude: string;
  overlap?: string;
};

const APPLICATION_RULES: Record<ApplicationId, ClassificationRule> = {
  military: {
    include:
      'Military, police, uniformed services, tactical uniforms, bomb-disposal suits, camouflage or service equipment explicitly stated in the product data.',
    exclude:
      'Do not match generic durable workwear, generic PA 6.6, ripstop or cut resistance unless military, police, tactical or uniformed-service use is explicitly stated.',
  },
  firefighting: {
    include:
      'Structural firefighting, turnout gear, firefighter suits or fabrics explicitly described for fire brigades and firefighting protective clothing.',
    exclude:
      'Do not match merely because a fabric is flame-retardant, heat-resistant or aramid. Generic FR workwear belongs elsewhere unless firefighter use is explicit.',
  },
  energy: {
    include:
      'Electrical utilities, electric-arc protection, high-voltage work, electrical installations or EMI shielding explicitly connected with electrical/electronic environments.',
    exclude:
      'Antistatic or flame-retardant properties alone are insufficient. Do not infer the energy sector from EN 1149 or FR performance alone.',
  },
  welding: {
    include:
      'Welding, foundry, metallurgy, molten-metal splash, metalworking or explicitly stated heat/flame hazards in industrial metal processing.',
    exclude:
      'Generic FR workwear is insufficient unless welding, foundry, metallurgy, molten metal or closely related metal-processing use is explicit.',
  },
  motorcycle: {
    include:
      'Motorcycle protective apparel, motorcyclist garments or materials explicitly developed for motorcycle abrasion, impact-zone or riding apparel.',
    exclude:
      'Do not match automotive upholstery, vehicle interiors or generic abrasion-resistant clothing without explicit motorcycle use.',
  },
  hivis: {
    include:
      'Certified high-visibility warning clothing, fluorescent safety garments or explicit EN ISO 20471 / safety-jacket use.',
    exclude:
      'Bright colour, neon colour or reflective appearance alone is insufficient without explicit high-visibility safety use.',
  },
  medical: {
    include:
      'Medical, healthcare, hospital, protective medical garments, medical barriers, or antibacterial/antiviral products explicitly positioned for medical use.',
    exclude:
      'Antibacterial, antiviral, waterproof or easy-clean properties alone are insufficient if the source does not state a medical or healthcare use.',
  },
  sport: {
    include:
      'Sportswear, athletic garments, training apparel or explicitly stated performance-sport use.',
    exclude:
      'Stretch, breathability, mesh or moisture management alone are insufficient without explicit sport or athletic use.',
  },
  ceilings: {
    include:
      'Stretch-ceiling fabric and textile ceiling systems explicitly stated in the product data.',
    exclude:
      'Do not match generic interior decoration, membranes or architectural textiles unless a ceiling system is explicit.',
    overlap:
      'A precise stretch-ceiling product may also match architecture-building because multiple applications are allowed.',
  },
  'architecture-building': {
    include:
      'Architectural membranes, tensile structures, stretch ceilings, textile building systems, interior tension panels, light-diffusing architectural textiles or products explicitly intended as part of a building.',
    exclude:
      'Do not match ordinary apparel, generic outdoor fabric, furniture fabric, flags, cleaning textiles or print media. Tents and awnings qualify only when the source explicitly frames them as architectural/building systems.',
    overlap:
      'Stretch-ceiling products belong to architecture-building when the product data explicitly states a ceiling or architectural building-system use.',
  },
  transport: {
    include:
      'Automotive, rail, public transport, marine/boat, aircraft, vehicle seating, vehicle interiors, transport upholstery or technical equipment explicitly intended for vehicles or vessels.',
    exclude:
      'Do not match ordinary footwear, furniture upholstery or generic outdoor fabric. Motorcycle protective clothing stays under motorcycle and does not automatically inherit transport.',
    overlap:
      'A product may match motorcycle and transport only when the supplied data independently states both uses.',
  },
};

// -----------------------------------------------------------------------------
// Typy danych i schemat odpowiedzi
// -----------------------------------------------------------------------------

type ApplicationDefinition = {
  id: ApplicationId;
  namePl: string;
  nameEn: string;
  shortPl: string;
  shortEn: string;
  include: string;
  exclude: string;
  overlap: string;
  source: 'existing' | 'certain-new';
};

type ProductRecord = {
  product_page?: {
    commercial_name?: string;
    display_name?: string;
    title_descriptor?: string;
    spec_line?: string;
    description_blocks?: string[];
    technical_parameters?: Array<{
      name?: string;
      value?: string;
      standard?: string;
    }>;
    technical_documents?: Array<{
      label?: string;
      title?: string;
      document_kind?: string;
    }>;
    image_groups?: {
      application_images?: Array<{
        alt?: string;
        title?: string;
      }>;
      function_icons?: Array<{
        alt?: string;
        title?: string;
      }>;
    };
  };
  category_row?: {
    structure?: {
      name?: string;
    };
  };
};

type ProductEvidence = {
  slug: string;
  name: string;
  family: string;
  subFamily: string;
  familyDescriptorPl: string;
  familyDescriptorEn: string;
  categoryId: string;
  categoryNamePl: string;
  categoryNameEn: string;
  categorySourceGroup: string;
  weight: string;
  composition: string;
  weave: string;
  titleDescriptor: string;
  specLine: string;
  properties: string[];
  norms: string[];
  descriptions: string[];
  technicalParameters: string[];
  applicationImageLabels: string[];
  functionIconLabels: string[];
  structure: string;
  recordUrl: string;
  recordLoaded: boolean;
};

type RawMatch = {
  applicationId: ApplicationId;
  confidence: number;
  evidence: string[];
  rationale: string;
};

type RawPossibleMatch = {
  applicationId: ApplicationId;
  reason: string;
};

type RawModelResult = {
  fabricSlug: string;
  matches: RawMatch[];
  possibleButNotAccepted: RawPossibleMatch[];
  noMatchReason: string;
};

type NormalizedResult = {
  fabricSlug: string;
  status: 'matched' | 'matched-with-review' | 'review' | 'unmatched';
  acceptedMatches: RawMatch[];
  possibleButNotAccepted: RawPossibleMatch[];
  noMatchReason: string;
  needsReview: boolean;
};

type CachedResult = {
  meta: {
    promptVersion: number;
    taxonomyHash: string;
    model: string;
    minConfidence: number;
    generatedAt: string;
    requestId: string | null;
    stopReason: string | null;
    usage: {
      inputTokens: number;
      outputTokens: number;
    };
  };
  product: ProductEvidence;
  modelOutput: RawModelResult;
  normalized: NormalizedResult;
};

const APPLICATION_IDS = [
  'military',
  'firefighting',
  'energy',
  'welding',
  'motorcycle',
  'hivis',
  'medical',
  'sport',
  'architecture-building',
  'transport',
] as const satisfies readonly ApplicationId[];

const RESULT_SCHEMA = {
  type: 'object',
  properties: {
    fabricSlug: {
      type: 'string',
      description: 'The exact input fabric slug.',
    },
    matches: {
      type: 'array',
      description:
        'Only precise application matches directly supported by supplied product evidence. Empty is valid.',
      items: {
        type: 'object',
        properties: {
          applicationId: {
            type: 'string',
            enum: [...APPLICATION_IDS],
          },
          confidence: {
            type: 'integer',
            description:
              'Integer 0-100. Use 90+ only for direct, explicit and independently defensible evidence.',
          },
          evidence: {
            type: 'array',
            description:
              'Short evidence snippets or field-based statements taken only from supplied product data.',
            items: { type: 'string' },
          },
          rationale: {
            type: 'string',
            description:
              'Concise explanation of why the product directly belongs to this application.',
          },
        },
        required: [
          'applicationId',
          'confidence',
          'evidence',
          'rationale',
        ],
        additionalProperties: false,
      },
    },
    possibleButNotAccepted: {
      type: 'array',
      description:
        'Plausible but insufficiently evidenced applications. Do not place these in precise matches.',
      items: {
        type: 'object',
        properties: {
          applicationId: {
            type: 'string',
            enum: [...APPLICATION_IDS],
          },
          reason: {
            type: 'string',
            description:
              'Why the relation is plausible but not sufficiently explicit.',
          },
        },
        required: ['applicationId', 'reason'],
        additionalProperties: false,
      },
    },
    noMatchReason: {
      type: 'string',
      description:
        'When there is no precise match, summarize the product’s explicit use. Do not invent or name a new application taxonomy. Use an empty string when precise matches exist.',
    },
  },
  required: [
    'fabricSlug',
    'matches',
    'possibleButNotAccepted',
    'noMatchReason',
  ],
  additionalProperties: false,
} as const;

// -----------------------------------------------------------------------------
// Narzędzia
// -----------------------------------------------------------------------------

function loadEnvFile(filePath: string): void {
  if (!fs.existsSync(filePath)) return;

  const text = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;

    const match = line.match(/^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!match) continue;

    const key = match[1];
    let value = match[2].trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      const quote = value[0];
      value = value.slice(1, -1);
      if (quote === '"') {
        value = value
          .replace(/\\n/g, '\n')
          .replace(/\\r/g, '\r')
          .replace(/\\t/g, '\t')
          .replace(/\\"/g, '"')
          .replace(/\\\\/g, '\\');
      }
    } else {
      value = value.replace(/\s+#.*$/, '').trim();
    }

    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

function getArg(name: string): string | undefined {
  const prefix = `--${name}=`;
  const direct = process.argv.find((arg) => arg.startsWith(prefix));
  if (direct) return direct.slice(prefix.length);

  const index = process.argv.indexOf(`--${name}`);
  if (index >= 0) return process.argv[index + 1];

  return undefined;
}

function hasFlag(name: string): boolean {
  return process.argv.includes(`--${name}`);
}

function positiveInt(
  raw: string | undefined,
  fallback: number,
  name: string,
): number {
  if (raw === undefined) return fallback;
  const value = Number.parseInt(raw, 10);
  if (!Number.isFinite(value) || value < 1) {
    throw new Error(`Nieprawidłowa wartość --${name}: ${raw}`);
  }
  return value;
}

function boundedInt(
  raw: string | undefined,
  fallback: number,
  min: number,
  max: number,
  name: string,
): number {
  if (raw === undefined) return fallback;
  const value = Number.parseInt(raw, 10);
  if (!Number.isFinite(value) || value < min || value > max) {
    throw new Error(
      `Nieprawidłowa wartość --${name}: ${raw}. Zakres: ${min}-${max}.`,
    );
  }
  return value;
}

function printHelp(): void {
  console.log(`
ETAP 1 — klasyfikacja tkanin do aplikacji

Uruchomienie:
  npx tsx .\\classify-fabric-applications-stage1.ts

Opcje:
  --force
  --limit=10
  --slug=arneo,ardilight
  --concurrency=2
  --min-confidence=90
  --model=claude-sonnet-5
  --help
`.trim());
}

function ensureDirectories(): void {
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.mkdirSync(CACHE_DIR, { recursive: true });
  fs.mkdirSync(ERROR_DIR, { recursive: true });
}

function cleanText(value: unknown, maxLength = 900): string {
  if (typeof value !== 'string') return '';
  return value.replace(/\s+/g, ' ').trim().slice(0, maxLength);
}

function uniqueNonEmpty(
  values: Array<string | undefined | null>,
  maxItems = 40,
): string[] {
  const seen = new Set<string>();
  const out: string[] = [];

  for (const raw of values) {
    const value = cleanText(raw);
    if (!value) continue;
    const key = value.toLocaleLowerCase('en');
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(value);
    if (out.length >= maxItems) break;
  }

  return out;
}

function readJsonFile<T>(filePath: string): T | null {
  try {
    const raw = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function writeJson(filePath: string, data: unknown): void {
  fs.writeFileSync(
    filePath,
    `${JSON.stringify(data, null, 2)}\n`,
    'utf8',
  );
}

function csvEscape(value: unknown): string {
  const text =
    value === null || value === undefined
      ? ''
      : typeof value === 'string'
        ? value
        : JSON.stringify(value);

  return `"${text.replace(/"/g, '""')}"`;
}

function writeCsv(
  filePath: string,
  columns: string[],
  rows: Array<Record<string, unknown>>,
): void {
  const lines = [
    columns.map(csvEscape).join(';'),
    ...rows.map((row) =>
      columns.map((column) => csvEscape(row[column])).join(';'),
    ),
  ];

  fs.writeFileSync(filePath, `\uFEFF${lines.join('\r\n')}\r\n`, 'utf8');
}

function sha256(value: unknown): string {
  return crypto
    .createHash('sha256')
    .update(JSON.stringify(value))
    .digest('hex');
}

function appIdIsValid(value: string): value is ApplicationId {
  return (APPLICATION_IDS as readonly string[]).includes(value);
}

function clampConfidence(value: unknown): number {
  const numeric =
    typeof value === 'number'
      ? value
      : Number.parseInt(String(value), 10);

  if (!Number.isFinite(numeric)) return 0;
  return Math.max(0, Math.min(100, Math.round(numeric)));
}

function applicationLabel(
  applicationId: ApplicationId,
  definitions: ApplicationDefinition[],
): string {
  const app = definitions.find((item) => item.id === applicationId);
  return app ? `${app.namePl} [${app.id}]` : applicationId;
}

function buildApplicationDefinitions(): ApplicationDefinition[] {
  // applications.ts może nadal zawierać historyczne `ceilings`, ale etap 1
  // celowo go ignoruje. Produkty sufitowe trafiają do architecture-building.
  const existingById = new Map(
    APPLICATIONS.map((app) => [app.id, app] as const),
  );

  const expectedExistingIds: ExistingApplicationId[] = [
    'military',
    'firefighting',
    'energy',
    'welding',
    'motorcycle',
    'hivis',
    'medical',
    'sport',
  ];

  const missing = expectedExistingIds.filter(
    (id) => !existingById.has(id),
  );

  if (missing.length > 0) {
    throw new Error(
      `Brakuje oczekiwanych aplikacji w applications.ts: ${missing.join(', ')}`,
    );
  }

  const existingDefinitions = expectedExistingIds.map((id) => {
    const app = existingById.get(id) as ApplicationDef;
    const rule = APPLICATION_RULES[id];

    return {
      id,
      namePl: app.name.pl,
      nameEn: app.name.en,
      shortPl: app.short.pl,
      shortEn: app.short.en,
      include: rule.include,
      exclude: rule.exclude,
      overlap: rule.overlap ?? '',
      source: 'existing' as const,
    };
  });

  const newDefinitions = CERTAIN_NEW_APPLICATIONS.map((app) => {
    const id = app.id as NewApplicationId;
    const rule = APPLICATION_RULES[id];

    return {
      id,
      namePl: app.name.pl,
      nameEn: app.name.en,
      shortPl: app.short.pl,
      shortEn: app.short.en,
      include: rule.include,
      exclude: rule.exclude,
      overlap: rule.overlap ?? '',
      source: 'certain-new' as const,
    };
  });

  return [...existingDefinitions, ...newDefinitions];
}

function buildProductEvidence(fabric: FabricDef): ProductEvidence {
  const category = getCategoryById(fabric.categoryId);
  const family = getFamilyBySlug(fabric.subFamily);

  const recordPath = path.join(
    ROOT,
    'public',
    fabric.recordUrl.replace(/^[/\\]+/, ''),
  );
  const record = readJsonFile<ProductRecord>(recordPath);
  const pp = record?.product_page;

  const descriptions = uniqueNonEmpty(
    [
      ...(pp?.description_blocks ?? []),
      pp?.title_descriptor,
      pp?.spec_line,
    ],
    10,
  ).map((text) => cleanText(text, 1_200));

  const technicalParameters = uniqueNonEmpty(
    (pp?.technical_parameters ?? []).map((param) =>
      [param.name, param.value, param.standard]
        .map((part) => cleanText(part, 250))
        .filter(Boolean)
        .join(' | '),
    ),
    35,
  );

  const technicalDocuments = uniqueNonEmpty(
    (pp?.technical_documents ?? []).flatMap((doc) => [
      doc.label,
      doc.title,
      doc.document_kind,
    ]),
    20,
  );

  const applicationImageLabels = uniqueNonEmpty(
    (pp?.image_groups?.application_images ?? []).flatMap((image) => [
      image.alt,
      image.title,
    ]),
    20,
  );

  const functionIconLabels = uniqueNonEmpty(
    [
      ...(pp?.image_groups?.function_icons ?? []).flatMap((image) => [
        image.alt,
        image.title,
      ]),
      ...technicalDocuments,
    ],
    30,
  );

  return {
    slug: fabric.slug,
    name: fabric.name,
    family: fabric.family,
    subFamily: fabric.subFamily,
    familyDescriptorPl: family?.descriptor.pl ?? '',
    familyDescriptorEn: family?.descriptor.en ?? '',
    categoryId: fabric.categoryId,
    categoryNamePl: category?.name.pl ?? '',
    categoryNameEn: category?.name.en ?? '',
    categorySourceGroup: category?.sourceGroup ?? '',
    weight: fabric.weight,
    composition: fabric.composition,
    weave: fabric.weave,
    titleDescriptor: fabric.titleDescriptor,
    specLine: fabric.specLine,
    properties: [...fabric.properties],
    norms: [...fabric.norms],
    descriptions,
    technicalParameters,
    applicationImageLabels,
    functionIconLabels,
    structure: cleanText(record?.category_row?.structure?.name),
    recordUrl: fabric.recordUrl,
    recordLoaded: record !== null,
  };
}

function buildSystemPrompt(): string {
  return `
You are a conservative B2B technical-textile product classifier.

Your task is to map one fabric product to zero, one or several application IDs from a closed taxonomy.

STRICT PRECISION RULES:

1. Use only the supplied product data. Never use outside knowledge.
2. A product may have multiple applications, but every application must be independently and directly supported.
3. Do not classify from theoretical possibility. Classify only from explicit intended use, source-group wording, product description, application image labels or equally direct evidence.
4. Properties, fibres, weave, weight and standards may support a match, but normally cannot establish an industry application on their own.
5. A shared safety standard does not prove a sector. Example: flame retardancy alone does not prove firefighting or welding; antistatic alone does not prove energy.
6. Prefer an empty matches array over a broad or speculative assignment.
7. Put plausible but insufficient relations in possibleButNotAccepted, not in matches.
8. Confidence 90-100 is reserved for explicit, direct and independently defensible evidence.
9. Do not invent or propose new application categories in this stage.
10. In noMatchReason, summarize the product's explicit use without designing a new taxonomy.
11. Keep evidence short and traceable to fields supplied in the input.
12. Preserve the exact input fabric slug.

MULTI-LABEL BOUNDARIES:

- stretch-ceiling systems belong to architecture-building when that use is explicit.
- motorcycle does not automatically imply transport.
- generic workwear must not automatically inherit military, firefighting, energy or welding.
- generic upholstery must not automatically inherit transport unless vehicle/vessel use is explicit.
`.trim();
}

function buildUserPayload(
  product: ProductEvidence,
  applications: ApplicationDefinition[],
): string {
  return JSON.stringify(
    {
      task:
        'Classify this product using the closed application taxonomy. Return only schema-compliant data.',
      product,
      applications,
    },
    null,
    2,
  );
}

function normalizeModelResult(
  raw: RawModelResult,
  fabricSlug: string,
  minConfidence: number,
): NormalizedResult {
  const acceptedById = new Map<ApplicationId, RawMatch>();
  const possibleById = new Map<ApplicationId, RawPossibleMatch>();

  for (const item of Array.isArray(raw.matches) ? raw.matches : []) {
    if (!appIdIsValid(String(item.applicationId))) continue;

    const applicationId = item.applicationId;
    const normalizedMatch: RawMatch = {
      applicationId,
      confidence: clampConfidence(item.confidence),
      evidence: uniqueNonEmpty(
        Array.isArray(item.evidence) ? item.evidence : [],
        6,
      ),
      rationale: cleanText(item.rationale, 1_000),
    };

    if (normalizedMatch.confidence >= minConfidence) {
      const previous = acceptedById.get(applicationId);
      if (
        !previous ||
        normalizedMatch.confidence > previous.confidence
      ) {
        acceptedById.set(applicationId, normalizedMatch);
      }
    } else {
      possibleById.set(applicationId, {
        applicationId,
        reason:
          normalizedMatch.rationale ||
          `Model confidence ${normalizedMatch.confidence} is below threshold ${minConfidence}.`,
      });
    }
  }

  for (
    const item of Array.isArray(raw.possibleButNotAccepted)
      ? raw.possibleButNotAccepted
      : []
  ) {
    if (!appIdIsValid(String(item.applicationId))) continue;
    if (acceptedById.has(item.applicationId)) continue;

    possibleById.set(item.applicationId, {
      applicationId: item.applicationId,
      reason: cleanText(item.reason, 1_000),
    });
  }

  const acceptedMatches = [...acceptedById.values()].sort(
    (a, b) =>
      b.confidence - a.confidence ||
      a.applicationId.localeCompare(b.applicationId),
  );
  const possibleButNotAccepted = [...possibleById.values()].sort(
    (a, b) => a.applicationId.localeCompare(b.applicationId),
  );

  const hasAccepted = acceptedMatches.length > 0;
  const hasPossible = possibleButNotAccepted.length > 0;

  const status: NormalizedResult['status'] = hasAccepted
    ? hasPossible
      ? 'matched-with-review'
      : 'matched'
    : hasPossible
      ? 'review'
      : 'unmatched';

  return {
    fabricSlug,
    status,
    acceptedMatches,
    possibleButNotAccepted,
    noMatchReason: cleanText(raw.noMatchReason, 1_500),
    needsReview: hasPossible,
  };
}

function cachePathFor(slug: string): string {
  return path.join(CACHE_DIR, `${slug}.json`);
}

function cacheIsValid(
  cache: CachedResult | null,
  options: {
    taxonomyHash: string;
    model: string;
    minConfidence: number;
  },
): cache is CachedResult {
  return Boolean(
    cache &&
      cache.meta.promptVersion === PROMPT_VERSION &&
      cache.meta.taxonomyHash === options.taxonomyHash &&
      cache.meta.model === options.model &&
      cache.meta.minConfidence === options.minConfidence,
  );
}

function extractTextResponse(response: {
  content: Array<{ type: string; text?: string }>;
}): string {
  return response.content
    .filter((block) => block.type === 'text')
    .map((block) => block.text ?? '')
    .join('\n')
    .trim();
}

async function classifyProduct(args: {
  client: Anthropic;
  fabric: FabricDef;
  applications: ApplicationDefinition[];
  taxonomyHash: string;
  model: string;
  minConfidence: number;
  force: boolean;
}): Promise<{ result: CachedResult; cached: boolean }> {
  const {
    client,
    fabric,
    applications,
    taxonomyHash,
    model,
    minConfidence,
    force,
  } = args;

  const product = buildProductEvidence(fabric);
  const cacheFile = cachePathFor(fabric.slug);
  const cached = readJsonFile<CachedResult>(cacheFile);

  if (
    !force &&
    cacheIsValid(cached, {
      taxonomyHash,
      model,
      minConfidence,
    })
  ) {
    return { result: cached, cached: true };
  }

  const response = await client.messages.create({
    model,
    max_tokens: DEFAULT_MAX_TOKENS,
    thinking: { type: 'adaptive' },
    system: buildSystemPrompt(),
    messages: [
      {
        role: 'user',
        content: buildUserPayload(product, applications),
      },
    ],
    output_config: {
      effort: 'medium',
      format: {
        type: 'json_schema',
        schema: RESULT_SCHEMA,
      },
    },
  });

  if (response.stop_reason === 'refusal') {
    throw new Error('Claude zwrócił refusal.');
  }

  if (response.stop_reason === 'max_tokens') {
    throw new Error(
      'Odpowiedź została ucięta przez max_tokens. Zwiększ DEFAULT_MAX_TOKENS.',
    );
  }

  const text = extractTextResponse(response);
  if (!text) {
    throw new Error('Brak bloku tekstowego w odpowiedzi Claude.');
  }

  const raw = JSON.parse(text) as RawModelResult;

  if (cleanText(raw.fabricSlug) !== fabric.slug) {
    throw new Error(
      `Model zwrócił nieprawidłowy slug: "${raw.fabricSlug}", oczekiwano "${fabric.slug}".`,
    );
  }

  const normalized = normalizeModelResult(
    raw,
    fabric.slug,
    minConfidence,
  );

  const result: CachedResult = {
    meta: {
      promptVersion: PROMPT_VERSION,
      taxonomyHash,
      model,
      minConfidence,
      generatedAt: new Date().toISOString(),
      requestId:
        typeof (response as { _request_id?: unknown })._request_id ===
        'string'
          ? ((response as { _request_id: string })._request_id)
          : null,
      stopReason: response.stop_reason ?? null,
      usage: {
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens,
      },
    },
    product,
    modelOutput: raw,
    normalized,
  };

  writeJson(cacheFile, result);
  return { result, cached: false };
}

// -----------------------------------------------------------------------------
// Raportowanie
// -----------------------------------------------------------------------------

function buildReports(args: {
  results: CachedResult[];
  failures: Array<{
    slug: string;
    name: string;
    error: string;
  }>;
  applications: ApplicationDefinition[];
  taxonomyHash: string;
  model: string;
  minConfidence: number;
  totalCatalogProducts: number;
}): void {
  const {
    results,
    failures,
    applications,
    taxonomyHash,
    model,
    minConfidence,
    totalCatalogProducts,
  } = args;

  const order = new Map(
    FABRICS.map((fabric, index) => [fabric.slug, index]),
  );

  const sorted = [...results].sort(
    (a, b) =>
      (order.get(a.product.slug) ?? Number.MAX_SAFE_INTEGER) -
      (order.get(b.product.slug) ?? Number.MAX_SAFE_INTEGER),
  );

  const generatedAt = new Date().toISOString();

  const map: Record<string, ApplicationId[]> = {};
  for (const item of sorted) {
    map[item.product.slug] = item.normalized.acceptedMatches.map(
      (match) => match.applicationId,
    );
  }

  const countsByApplication = Object.fromEntries(
    applications.map((app) => [
      app.id,
      sorted.filter((item) =>
        item.normalized.acceptedMatches.some(
          (match) => match.applicationId === app.id,
        ),
      ).length,
    ]),
  );

  const countsByStatus = {
    matched: sorted.filter(
      (item) => item.normalized.status === 'matched',
    ).length,
    matchedWithReview: sorted.filter(
      (item) => item.normalized.status === 'matched-with-review',
    ).length,
    review: sorted.filter(
      (item) => item.normalized.status === 'review',
    ).length,
    unmatched: sorted.filter(
      (item) => item.normalized.status === 'unmatched',
    ).length,
  };

  const usage = sorted.reduce(
    (acc, item) => {
      acc.inputTokens += item.meta.usage.inputTokens;
      acc.outputTokens += item.meta.usage.outputTokens;
      return acc;
    },
    { inputTokens: 0, outputTokens: 0 },
  );

  const summary = {
    stage: 1,
    productionReady: false,
    note:
      'To są propozycje klasyfikatora etapu 1. Nie podłączaj mapy do strony przed etapem weryfikacji.',
    generatedAt,
    model,
    promptVersion: PROMPT_VERSION,
    taxonomyHash,
    minConfidence,
    totalCatalogProducts,
    processedProducts: sorted.length,
    failedProducts: failures.length,
    countsByStatus,
    countsByApplication,
    usage,
    applicationIds: applications.map((app) => app.id),
  };

  writeJson(path.join(REPORT_DIR, 'stage1-summary.json'), summary);

  writeJson(
    path.join(REPORT_DIR, 'stage1-proposed-map.json'),
    {
      stage: 1,
      productionReady: false,
      generatedAt,
      model,
      minConfidence,
      applications: applications.map((app) => ({
        id: app.id,
        name: {
          pl: app.namePl,
          en: app.nameEn,
        },
        source: app.source,
      })),
      products: map,
    },
  );

  writeJson(
    path.join(REPORT_DIR, 'stage1-full-audit.json'),
    {
      summary,
      applications,
      results: sorted,
      failures,
    },
  );

  writeJson(
    path.join(REPORT_DIR, 'stage1-failures.json'),
    failures,
  );

  writeCsv(
    path.join(REPORT_DIR, 'stage1-matched.csv'),
    [
      'slug',
      'name',
      'family',
      'subFamily',
      'categoryId',
      'status',
      'applications',
      'confidences',
      'evidence',
      'possibleExtraApplications',
      'recordLoaded',
      'recordUrl',
    ],
    sorted
      .filter(
        (item) => item.normalized.acceptedMatches.length > 0,
      )
      .map((item) => ({
        slug: item.product.slug,
        name: item.product.name,
        family: item.product.family,
        subFamily: item.product.subFamily,
        categoryId: item.product.categoryId,
        status: item.normalized.status,
        applications: item.normalized.acceptedMatches
          .map((match) =>
            applicationLabel(match.applicationId, applications),
          )
          .join(' | '),
        confidences: item.normalized.acceptedMatches
          .map(
            (match) =>
              `${match.applicationId}:${match.confidence}`,
          )
          .join(' | '),
        evidence: item.normalized.acceptedMatches
          .map(
            (match) =>
              `${match.applicationId}: ${match.evidence.join(
                ' / ',
              )}`,
          )
          .join(' || '),
        possibleExtraApplications:
          item.normalized.possibleButNotAccepted
            .map((candidate) => candidate.applicationId)
            .join(' | '),
        recordLoaded: item.product.recordLoaded,
        recordUrl: item.product.recordUrl,
      })),
  );

  writeCsv(
    path.join(REPORT_DIR, 'stage1-review.csv'),
    [
      'slug',
      'name',
      'family',
      'subFamily',
      'categoryId',
      'acceptedApplications',
      'possibleApplications',
      'reviewReasons',
      'explicitUseSummary',
      'titleDescriptor',
      'specLine',
      'categorySourceGroup',
      'recordLoaded',
      'recordUrl',
    ],
    sorted
      .filter((item) => item.normalized.needsReview)
      .map((item) => ({
        slug: item.product.slug,
        name: item.product.name,
        family: item.product.family,
        subFamily: item.product.subFamily,
        categoryId: item.product.categoryId,
        acceptedApplications: item.normalized.acceptedMatches
          .map((match) => match.applicationId)
          .join(' | '),
        possibleApplications:
          item.normalized.possibleButNotAccepted
            .map((candidate) => candidate.applicationId)
            .join(' | '),
        reviewReasons:
          item.normalized.possibleButNotAccepted
            .map(
              (candidate) =>
                `${candidate.applicationId}: ${candidate.reason}`,
            )
            .join(' || '),
        explicitUseSummary: item.normalized.noMatchReason,
        titleDescriptor: item.product.titleDescriptor,
        specLine: item.product.specLine,
        categorySourceGroup:
          item.product.categorySourceGroup,
        recordLoaded: item.product.recordLoaded,
        recordUrl: item.product.recordUrl,
      })),
  );

  writeCsv(
    path.join(REPORT_DIR, 'stage1-unmatched.csv'),
    [
      'slug',
      'name',
      'family',
      'subFamily',
      'categoryId',
      'categoryName',
      'explicitUseSummary',
      'titleDescriptor',
      'specLine',
      'categorySourceGroup',
      'descriptions',
      'recordLoaded',
      'recordUrl',
    ],
    sorted
      .filter(
        (item) =>
          item.normalized.acceptedMatches.length === 0 &&
          item.normalized.possibleButNotAccepted.length === 0,
      )
      .map((item) => ({
        slug: item.product.slug,
        name: item.product.name,
        family: item.product.family,
        subFamily: item.product.subFamily,
        categoryId: item.product.categoryId,
        categoryName: item.product.categoryNamePl,
        explicitUseSummary: item.normalized.noMatchReason,
        titleDescriptor: item.product.titleDescriptor,
        specLine: item.product.specLine,
        categorySourceGroup:
          item.product.categorySourceGroup,
        descriptions: item.product.descriptions.join(' || '),
        recordLoaded: item.product.recordLoaded,
        recordUrl: item.product.recordUrl,
      })),
  );
}

// -----------------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------------

async function main(): Promise<void> {
  if (hasFlag('help')) {
    printHelp();
    return;
  }

  if (!fs.existsSync(path.join(ROOT, 'src', 'content', 'fabrics.ts'))) {
    throw new Error(
      'Uruchom skrypt z katalogu głównego D:\\Ariteks\\ariteks_www.',
    );
  }

  loadEnvFile(ENV_PATH);

  const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
  if (!apiKey) {
    throw new Error(
      `Brak ANTHROPIC_API_KEY w ${ENV_PATH}`,
    );
  }

  const model =
    getArg('model')?.trim() ||
    process.env.ANTHROPIC_MODEL?.trim() ||
    DEFAULT_MODEL;

  const minConfidence = boundedInt(
    getArg('min-confidence'),
    DEFAULT_MIN_CONFIDENCE,
    0,
    100,
    'min-confidence',
  );

  const concurrency = boundedInt(
    getArg('concurrency'),
    DEFAULT_CONCURRENCY,
    1,
    8,
    'concurrency',
  );

  const limit = getArg('limit')
    ? positiveInt(getArg('limit'), 1, 'limit')
    : undefined;

  const force = hasFlag('force');

  const selectedSlugs = new Set(
    (getArg('slug') ?? '')
      .split(',')
      .map((slug) => slug.trim())
      .filter(Boolean),
  );

  const unknownSlugs = [...selectedSlugs].filter(
    (slug) => !FABRICS.some((fabric) => fabric.slug === slug),
  );

  if (unknownSlugs.length > 0) {
    throw new Error(
      `Nieznane slugi: ${unknownSlugs.join(', ')}`,
    );
  }

  let selected = selectedSlugs.size
    ? FABRICS.filter((fabric) => selectedSlugs.has(fabric.slug))
    : [...FABRICS];

  if (limit !== undefined) {
    selected = selected.slice(0, limit);
  }

  if (selected.length === 0) {
    throw new Error('Brak produktów do przetworzenia.');
  }

  ensureDirectories();

  const applications = buildApplicationDefinitions();
  const taxonomyHash = sha256({
    promptVersion: PROMPT_VERSION,
    applications,
    systemPrompt: buildSystemPrompt(),
    schema: RESULT_SCHEMA,
  });

  writeJson(
    path.join(REPORT_DIR, 'stage1-taxonomy.json'),
    {
      promptVersion: PROMPT_VERSION,
      taxonomyHash,
      applications,
    },
  );

  const client = new Anthropic({
    apiKey,
    maxRetries: 5,
    timeout: 180_000,
  });

  console.log('');
  console.log('=== ARITEKS — KLASYFIKACJA APLIKACJI, ETAP 1 ===');
  console.log(`Produkty w katalogu: ${FABRICS.length}`);
  console.log(`Produkty w tym przebiegu: ${selected.length}`);
  console.log(`Aplikacje: ${applications.length}`);
  console.log(`Model: ${model}`);
  console.log(`Próg: ${minConfidence}`);
  console.log(`Równoległość: ${concurrency}`);
  console.log(`Cache: ${force ? 'ignorowany (--force)' : 'aktywny'}`);
  console.log('');

  const results: CachedResult[] = [];
  const failures: Array<{
    slug: string;
    name: string;
    error: string;
  }> = [];

  let cursor = 0;
  let completed = 0;

  async function worker(): Promise<void> {
    while (true) {
      const index = cursor++;
      if (index >= selected.length) return;

      const fabric = selected[index];

      try {
        const { result, cached } = await classifyProduct({
          client,
          fabric,
          applications,
          taxonomyHash,
          model,
          minConfidence,
          force,
        });

        results.push(result);
        completed += 1;

        const accepted = result.normalized.acceptedMatches
          .map(
            (match) =>
              `${match.applicationId}:${match.confidence}`,
          )
          .join(', ');

        const possible =
          result.normalized.possibleButNotAccepted
            .map((match) => match.applicationId)
            .join(', ');

        console.log(
          `[${completed}/${selected.length}] ${
            cached ? 'CACHE' : 'API  '
          } ${fabric.slug} -> ${result.normalized.status}` +
            `${accepted ? ` | ${accepted}` : ''}` +
            `${possible ? ` | review: ${possible}` : ''}`,
        );
      } catch (error) {
        completed += 1;
        const message =
          error instanceof Error
            ? error.stack || error.message
            : String(error);

        const failure = {
          slug: fabric.slug,
          name: fabric.name,
          error: message,
        };
        failures.push(failure);

        writeJson(
          path.join(ERROR_DIR, `${fabric.slug}.json`),
          {
            ...failure,
            generatedAt: new Date().toISOString(),
          },
        );

        console.error(
          `[${completed}/${selected.length}] BŁĄD ${fabric.slug}: ${
            error instanceof Error ? error.message : String(error)
          }`,
        );
      }
    }
  }

  await Promise.all(
    Array.from(
      { length: Math.min(concurrency, selected.length) },
      () => worker(),
    ),
  );

  buildReports({
    results,
    failures,
    applications,
    taxonomyHash,
    model,
    minConfidence,
    totalCatalogProducts: FABRICS.length,
  });

  console.log('');
  console.log('GOTOWE — ETAP 1');
  console.log(`Wyniki: ${REPORT_DIR}`);
  console.log(
    `Przetworzone: ${results.length}, błędy: ${failures.length}`,
  );
  console.log(
    'Najważniejsze pliki: stage1-proposed-map.json, stage1-unmatched.csv, stage1-review.csv, stage1-full-audit.json',
  );

  if (failures.length > 0) {
    process.exitCode = 2;
  }
}

main().catch((error) => {
  console.error('');
  console.error('BŁĄD KRYTYCZNY:');
  console.error(error instanceof Error ? error.stack : error);
  process.exitCode = 1;
});
