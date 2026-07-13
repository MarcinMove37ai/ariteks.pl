/**
 * classify-fabric-applications-stage2.ts
 *
 * ETAP 2:
 * - czyta pełny audyt etapu 1,
 * - rozszerza taksonomię do 16 aplikacji,
 * - wybiera jedną aplikację główną,
 * - opcjonalnie wybiera jedną aplikację dodatkową,
 * - NIE modyfikuje kodu strony ani plików content.
 *
 * Wymagany plik:
 *   reports/fabric-applications-stage1/stage1-full-audit.json
 *
 * Uruchomienie:
 *   npx tsx .\classify-fabric-applications-stage2.ts
 *
 * Test:
 *   npx tsx .\classify-fabric-applications-stage2.ts --limit=5 --concurrency=1
 *
 * Opcje:
 *   --force
 *   --limit=10
 *   --slug=arbayrak,arseat
 *   --concurrency=2
 *   --min-primary-confidence=80
 *   --min-secondary-confidence=70
 *   --model=claude-sonnet-5
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import Anthropic from '@anthropic-ai/sdk';

const ROOT = process.cwd();
const ENV_PATH = path.join(ROOT, '.env.local');

const STAGE1_AUDIT_PATH = path.join(
  ROOT,
  'reports',
  'fabric-applications-stage1',
  'stage1-full-audit.json',
);

const REPORT_DIR = path.join(
  ROOT,
  'reports',
  'fabric-applications-stage2',
);
const CACHE_DIR = path.join(REPORT_DIR, 'cache');
const ERROR_DIR = path.join(REPORT_DIR, 'errors');

const PROMPT_VERSION = 1;
const DEFAULT_MODEL = 'claude-sonnet-5';
const DEFAULT_CONCURRENCY = 2;
const DEFAULT_MIN_PRIMARY_CONFIDENCE = 80;
const DEFAULT_MIN_SECONDARY_CONFIDENCE = 70;
const DEFAULT_MAX_TOKENS = 3_500;

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
  'workwear-industrial',
  'outdoor-functional',
  'footwear-components',
  'upholstery-interiors',
  'print-signage',
  'professional-cleaning',
] as const;

type ApplicationId = (typeof APPLICATION_IDS)[number];
type PrimaryApplicationId = ApplicationId | 'unresolved';
type SecondaryApplicationId = ApplicationId | 'none';

type ApplicationDefinition = {
  id: ApplicationId;
  namePl: string;
  nameEn: string;
  shortPl: string;
  shortEn: string;
  include: string;
  exclude: string;
  priorityGuidance: string;
  source: 'existing' | 'stage1-new' | 'stage2-new';
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

type Stage1Match = {
  applicationId: ApplicationId;
  confidence: number;
  evidence: string[];
  rationale: string;
};

type Stage1Possible = {
  applicationId: ApplicationId;
  reason: string;
};

type Stage1Result = {
  product: ProductEvidence;
  normalized: {
    acceptedMatches: Stage1Match[];
    possibleButNotAccepted: Stage1Possible[];
    noMatchReason: string;
  };
};

type Stage1Audit = {
  summary: {
    processedProducts: number;
  };
  applications: Array<{
    id: string;
    namePl: string;
    nameEn: string;
    shortPl: string;
    shortEn: string;
    include: string;
    exclude: string;
    overlap?: string;
    source: string;
  }>;
  results: Stage1Result[];
};

type ModelAssignment = {
  applicationId: PrimaryApplicationId | SecondaryApplicationId;
  confidence: number;
  evidence: string[];
  rationale: string;
};

type RawModelResult = {
  fabricSlug: string;
  primary: ModelAssignment;
  secondary: ModelAssignment;
  alternativesConsidered: Array<{
    applicationId: ApplicationId;
    reasonNotSelected: string;
  }>;
  needsHumanReview: boolean;
  reviewReason: string;
};

type NormalizedAssignment = {
  fabricSlug: string;
  status: 'resolved' | 'resolved-review' | 'unresolved';
  primaryApplication: ApplicationId | null;
  secondaryApplication: ApplicationId | null;
  primaryConfidence: number;
  secondaryConfidence: number;
  primaryEvidence: string[];
  secondaryEvidence: string[];
  primaryRationale: string;
  secondaryRationale: string;
  alternativesConsidered: Array<{
    applicationId: ApplicationId;
    reasonNotSelected: string;
  }>;
  needsHumanReview: boolean;
  reviewReason: string;
};

type CachedResult = {
  meta: {
    promptVersion: number;
    taxonomyHash: string;
    model: string;
    minPrimaryConfidence: number;
    minSecondaryConfidence: number;
    generatedAt: string;
    requestId: string | null;
    stopReason: string | null;
    usage: {
      inputTokens: number;
      outputTokens: number;
    };
  };
  product: ProductEvidence;
  stage1: {
    acceptedMatches: Stage1Match[];
    possibleButNotAccepted: Stage1Possible[];
    noMatchReason: string;
  };
  modelOutput: RawModelResult;
  normalized: NormalizedAssignment;
};

const NEW_APPLICATIONS: ApplicationDefinition[] = [
  {
    id: 'workwear-industrial',
    namePl: 'Odzież robocza i przemysłowa',
    nameEn: 'Workwear and industrial apparel',
    shortPl:
      'Tkaniny na ogólną odzież roboczą i ochronną dla przemysłu, produkcji, serwisu, logistyki, branży chemicznej oraz oil & gas.',
    shortEn:
      'Fabrics for general workwear and protective industrial apparel used in manufacturing, service, logistics, chemical and oil & gas environments.',
    include:
      'General workwear, industrial uniforms, coveralls, workshop garments, chemical-resistant workwear, generic FR or antistatic workwear, oil-and-gas work clothing and durable occupational apparel.',
    exclude:
      'Use a more specific application as primary when the product is explicitly for military, firefighting, electrical utilities, welding/metallurgy, medical, motorcycle or certified high-visibility clothing.',
    priorityGuidance:
      'Choose as primary when the product is fundamentally general workwear or industrial protective apparel rather than a narrower named sector.',
    source: 'stage2-new',
  },
  {
    id: 'outdoor-functional',
    namePl: 'Outdoor i odzież funkcjonalna',
    nameEn: 'Outdoor and functional apparel',
    shortPl:
      'Tkaniny na kurtki, płaszcze, odzież outdoorową, przeciwdeszczową i funkcjonalną oraz tekstylia turystyczne i rekreacyjne.',
    shortEn:
      'Fabrics for jackets, rainwear, outdoor and functional garments, plus tourism, camping and recreational textile products.',
    include:
      'Outdoor clothing, jackets, raincoats, bodywarmers, functional apparel, leisure garments, camping textiles, non-architectural tents and weather-protective textile products.',
    exclude:
      'Do not use for structural architectural membranes, vehicle upholstery, technical footwear components, sportswear explicitly positioned for athletics, or ordinary industrial workwear.',
    priorityGuidance:
      'Choose as primary when outdoor, leisure, rainwear, camping or general functional garment use is the clearest commercial purpose.',
    source: 'stage2-new',
  },
  {
    id: 'footwear-components',
    namePl: 'Obuwie i komponenty techniczne',
    nameEn: 'Footwear and technical components',
    shortPl:
      'Tkaniny i dzianiny do obuwia, cholewek, podszewek, wkładek, amortyzacji, siatek dystansowych i ochronnych komponentów technicznych.',
    shortEn:
      'Fabrics and knits for footwear, uppers, linings, insoles, cushioning, spacer meshes and protective technical components.',
    include:
      'Shoe fabrics, footwear uppers, linings, insoles, spacer meshes, cushioning, breathable shoe structures and protective footwear components.',
    exclude:
      'Do not use merely because an image shows a person wearing shoes. Vehicle seating belongs to transport; ordinary furniture upholstery belongs to upholstery-interiors.',
    priorityGuidance:
      'Choose as primary when footwear or a shoe component is the product’s clearest direct use. A sector such as military or sport may be secondary when independently stated.',
    source: 'stage2-new',
  },
  {
    id: 'upholstery-interiors',
    namePl: 'Tapicerka i wyposażenie wnętrz',
    nameEn: 'Upholstery and interior furnishings',
    shortPl:
      'Tkaniny do mebli, foteli biurowych, siedzisk, dekoracji wnętrz, paneli i innych nietransportowych zastosowań tapicerskich.',
    shortEn:
      'Fabrics for furniture, office seating, non-vehicle seats, interior decoration, panels and other non-transport upholstery.',
    include:
      'Furniture upholstery, office chairs, interior furnishings, non-vehicle seating, decorative interior textiles and soft interior components.',
    exclude:
      'Vehicle, rail, aircraft or marine interiors belong primarily to transport. Architectural tension systems belong to architecture-building.',
    priorityGuidance:
      'Choose as primary when furniture, office seating or ordinary interior furnishing is the clearest product use.',
    source: 'stage2-new',
  },
  {
    id: 'print-signage',
    namePl: 'Druk, reklama i oznakowanie',
    nameEn: 'Printing, advertising and signage',
    shortPl:
      'Tkaniny do druku cyfrowego, flag, banerów, oznakowania, reklamy, ekspozycji i tekstylnych elementów sygnalizacyjnych.',
    shortEn:
      'Fabrics for digital printing, flags, banners, signage, advertising, displays and textile warning or signalling elements.',
    include:
      'Digital-print fabrics, flags, banners, advertising textiles, display materials, signs, warning tripods and textile signalling products.',
    exclude:
      'Certified high-visibility garments belong to hivis. Structural architectural membranes belong to architecture-building.',
    priorityGuidance:
      'Choose as primary when the fabric’s final product is printed, displayed, used as a flag, sign or signalling object.',
    source: 'stage2-new',
  },
  {
    id: 'professional-cleaning',
    namePl: 'Czyszczenie profesjonalne',
    nameEn: 'Professional cleaning',
    shortPl:
      'Mikrofibry i tekstylia do czyszczenia przemysłowego, profesjonalnego i specjalistycznego.',
    shortEn:
      'Microfibres and textiles for industrial, professional and specialist cleaning.',
    include:
      'Cleaning cloths, industrial microfibre, wiping, polishing and professional surface-cleaning textiles.',
    exclude:
      'Do not use for medical barrier fabrics or ordinary apparel merely because they are washable or easy to clean.',
    priorityGuidance:
      'Choose as primary when cleaning or wiping is the direct intended use.',
    source: 'stage2-new',
  },
];

const RESULT_SCHEMA = {
  type: 'object',
  properties: {
    fabricSlug: {
      type: 'string',
      description: 'Exact input slug.',
    },
    primary: {
      type: 'object',
      properties: {
        applicationId: {
          type: 'string',
          enum: [...APPLICATION_IDS, 'unresolved'],
        },
        confidence: {
          type: 'integer',
          description: 'Integer 0-100.',
        },
        evidence: {
          type: 'array',
          items: { type: 'string' },
        },
        rationale: {
          type: 'string',
        },
      },
      required: ['applicationId', 'confidence', 'evidence', 'rationale'],
      additionalProperties: false,
    },
    secondary: {
      type: 'object',
      properties: {
        applicationId: {
          type: 'string',
          enum: [...APPLICATION_IDS, 'none'],
        },
        confidence: {
          type: 'integer',
          description: 'Integer 0-100. Use 0 when applicationId is none.',
        },
        evidence: {
          type: 'array',
          items: { type: 'string' },
        },
        rationale: {
          type: 'string',
        },
      },
      required: ['applicationId', 'confidence', 'evidence', 'rationale'],
      additionalProperties: false,
    },
    alternativesConsidered: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          applicationId: {
            type: 'string',
            enum: [...APPLICATION_IDS],
          },
          reasonNotSelected: {
            type: 'string',
          },
        },
        required: ['applicationId', 'reasonNotSelected'],
        additionalProperties: false,
      },
    },
    needsHumanReview: {
      type: 'boolean',
    },
    reviewReason: {
      type: 'string',
    },
  },
  required: [
    'fabricSlug',
    'primary',
    'secondary',
    'alternativesConsidered',
    'needsHumanReview',
    'reviewReason',
  ],
  additionalProperties: false,
} as const;

function loadEnvFile(filePath: string): void {
  if (!fs.existsSync(filePath)) return;

  const text = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;

    const match = line.match(
      /^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/,
    );
    if (!match) continue;

    const key = match[1];
    let value = match[2].trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
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
      `Nieprawidłowe --${name}=${raw}. Dozwolony zakres: ${min}-${max}.`,
    );
  }

  return value;
}

function cleanText(value: unknown, maxLength = 1_000): string {
  if (typeof value !== 'string') return '';
  return value.replace(/\s+/g, ' ').trim().slice(0, maxLength);
}

function uniqueNonEmpty(
  values: Array<string | undefined | null>,
  maxItems = 20,
): string[] {
  const result: string[] = [];
  const seen = new Set<string>();

  for (const raw of values) {
    const value = cleanText(raw);
    if (!value) continue;

    const key = value.toLocaleLowerCase('en');
    if (seen.has(key)) continue;

    seen.add(key);
    result.push(value);

    if (result.length >= maxItems) break;
  }

  return result;
}

function readJson<T>(filePath: string): T {
  const raw = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
  return JSON.parse(raw) as T;
}

function readJsonOrNull<T>(filePath: string): T | null {
  try {
    return readJson<T>(filePath);
  } catch {
    return null;
  }
}

function writeJson(filePath: string, value: unknown): void {
  fs.writeFileSync(
    filePath,
    `${JSON.stringify(value, null, 2)}\n`,
    'utf8',
  );
}

function csvEscape(value: unknown): string {
  const text =
    value === undefined || value === null
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

  fs.writeFileSync(
    filePath,
    `\uFEFF${lines.join('\r\n')}\r\n`,
    'utf8',
  );
}

function sha256(value: unknown): string {
  return crypto
    .createHash('sha256')
    .update(JSON.stringify(value))
    .digest('hex');
}

function clampConfidence(value: unknown): number {
  const number =
    typeof value === 'number'
      ? value
      : Number.parseInt(String(value), 10);

  if (!Number.isFinite(number)) return 0;
  return Math.max(0, Math.min(100, Math.round(number)));
}

function isApplicationId(value: unknown): value is ApplicationId {
  return (
    typeof value === 'string' &&
    (APPLICATION_IDS as readonly string[]).includes(value)
  );
}

function ensureDirectories(): void {
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.mkdirSync(CACHE_DIR, { recursive: true });
  fs.mkdirSync(ERROR_DIR, { recursive: true });
}

function buildApplications(
  stage1: Stage1Audit,
): ApplicationDefinition[] {
  const stage1Apps = stage1.applications
    .filter((application) =>
      (APPLICATION_IDS as readonly string[]).includes(application.id),
    )
    .map((application): ApplicationDefinition => ({
      id: application.id as ApplicationId,
      namePl: application.namePl,
      nameEn: application.nameEn,
      shortPl: application.shortPl,
      shortEn: application.shortEn,
      include: application.include,
      exclude: application.exclude,
      priorityGuidance:
        application.overlap ||
        'Choose this as primary when it is the most direct and commercially central end use stated by the product data.',
      source:
        application.source === 'existing'
          ? 'existing'
          : 'stage1-new',
    }));

  const byId = new Map<ApplicationId, ApplicationDefinition>();

  for (const application of [...stage1Apps, ...NEW_APPLICATIONS]) {
    byId.set(application.id, application);
  }

  const result = APPLICATION_IDS.map((id) => byId.get(id)).filter(
    (application): application is ApplicationDefinition =>
      application !== undefined,
  );

  if (result.length !== APPLICATION_IDS.length) {
    const missing = APPLICATION_IDS.filter((id) => !byId.has(id));
    throw new Error(
      `Brak definicji aplikacji: ${missing.join(', ')}`,
    );
  }

  return result;
}

function buildSystemPrompt(): string {
  return `
You are classifying technical textile products for a B2B catalogue.

Select:
- exactly one PRIMARY application when a defensible application exists,
- zero or one SECONDARY application,
- unresolved only when the supplied evidence genuinely does not support any application in the taxonomy.

PRIMARY means the product's clearest, most central commercial end use.
SECONDARY means another real and independently supported end use. It is not merely a shared property, standard, hazard or theoretical possibility.

RULES:

1. Use only supplied product evidence.
2. Prefer explicit Application fields, descriptions, category source groups and application image labels.
3. Standards, fibres and properties may support a decision but should not create an industry by themselves.
4. Choose the most specific direct application as primary.
5. Use a broader application as secondary only when the source independently supports it.
6. Do not assign more than one secondary application.
7. Primary and secondary must be different.
8. Do not classify a product as energy merely because it is antistatic.
9. Do not classify a product as firefighting or welding merely because it is flame-retardant.
10. Do not classify ordinary airport workwear as transport.
11. Motorcycle apparel is not automatically transport.
12. Vehicle upholstery is transport; ordinary furniture upholstery is upholstery-interiors.
13. Footwear fabrics belong to footwear-components unless another sector is clearly the product's dominant intended use.
14. Certified warning garments belong to hivis; warning objects, flags and signs belong to print-signage.
15. General industrial protective garments belong to workwear-industrial when no narrower named sector dominates.
16. Stretch ceilings and structural textile membranes belong to architecture-building.
17. If the evidence supports two uses, primary is the more direct/dominant use and secondary is the other.
18. Do not omit a clear secondary application merely because the primary use is dominant.
19. When separate explicit end uses belong to different applications, preserve both. Example: car upholstery plus shoes means transport as primary and footwear-components as secondary when both uses are directly stated.
20. Set needsHumanReview=true only for a meaningful ambiguity, weak evidence, or unresolved result.
21. Stage 1 suggestions are advisory evidence, not ground truth. Re-evaluate them.
`.trim();
}

function buildUserPayload(
  result: Stage1Result,
  applications: ApplicationDefinition[],
): string {
  return JSON.stringify(
    {
      task:
        'Choose the primary and optional secondary application for this product.',
      product: result.product,
      stage1Advisory: {
        acceptedMatches: result.normalized.acceptedMatches,
        possibleButNotAccepted:
          result.normalized.possibleButNotAccepted,
        noMatchReason: result.normalized.noMatchReason,
      },
      applications,
    },
    null,
    2,
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

function normalizeResult(args: {
  raw: RawModelResult;
  slug: string;
  minPrimaryConfidence: number;
  minSecondaryConfidence: number;
}): NormalizedAssignment {
  const {
    raw,
    slug,
    minPrimaryConfidence,
    minSecondaryConfidence,
  } = args;

  const rawPrimaryId = raw.primary?.applicationId;
  const rawPrimaryConfidence = clampConfidence(
    raw.primary?.confidence,
  );

  // Jeżeli model wskazał prawidłową aplikację, zachowujemy ją nawet
  // poniżej progu. Próg primary służy wyłącznie do oznaczenia REVIEW.
  // `unresolved` pozostaje możliwe tylko wtedy, gdy model wybrał je jawnie.
  const primaryApplication = isApplicationId(rawPrimaryId)
    ? rawPrimaryId
    : null;

  const rawSecondaryId = raw.secondary?.applicationId;
  const rawSecondaryConfidence = clampConfidence(
    raw.secondary?.confidence,
  );

  // Secondary pozostaje bardziej konserwatywne: trafia do mapy dopiero
  // po przekroczeniu progu i musi różnić się od primary.
  const secondaryApplication =
    primaryApplication &&
    isApplicationId(rawSecondaryId) &&
    rawSecondaryId !== primaryApplication &&
    rawSecondaryConfidence >= minSecondaryConfidence
      ? rawSecondaryId
      : null;

  const modelRequestedReview = Boolean(raw.needsHumanReview);
  const unresolved = primaryApplication === null;
  const primaryBelowThreshold =
    primaryApplication !== null &&
    rawPrimaryConfidence < minPrimaryConfidence;
  const secondaryBelowThreshold =
    isApplicationId(rawSecondaryId) &&
    rawSecondaryId !== primaryApplication &&
    rawSecondaryConfidence < minSecondaryConfidence;

  const needsHumanReview =
    unresolved ||
    modelRequestedReview ||
    primaryBelowThreshold ||
    secondaryBelowThreshold;

  return {
    fabricSlug: slug,
    status: unresolved
      ? 'unresolved'
      : needsHumanReview
        ? 'resolved-review'
        : 'resolved',
    primaryApplication,
    secondaryApplication,
    primaryConfidence: rawPrimaryConfidence,
    secondaryConfidence: secondaryApplication
      ? rawSecondaryConfidence
      : 0,
    primaryEvidence: uniqueNonEmpty(
      raw.primary?.evidence ?? [],
      8,
    ),
    secondaryEvidence: secondaryApplication
      ? uniqueNonEmpty(raw.secondary?.evidence ?? [], 8)
      : [],
    primaryRationale: cleanText(
      raw.primary?.rationale,
      1_200,
    ),
    secondaryRationale: secondaryApplication
      ? cleanText(raw.secondary?.rationale, 1_200)
      : '',
    alternativesConsidered: Array.isArray(
      raw.alternativesConsidered,
    )
      ? raw.alternativesConsidered
          .filter((item) => isApplicationId(item.applicationId))
          .slice(0, 4)
          .map((item) => ({
            applicationId: item.applicationId,
            reasonNotSelected: cleanText(
              item.reasonNotSelected,
              1_000,
            ),
          }))
      : [],
    needsHumanReview,
    reviewReason: cleanText(
      raw.reviewReason ||
        (unresolved
          ? 'Model explicitly returned unresolved.'
          : primaryBelowThreshold
            ? `Primary application retained, but confidence ${rawPrimaryConfidence} is below review threshold ${minPrimaryConfidence}.`
            : secondaryBelowThreshold
              ? `Secondary candidate did not pass confidence threshold ${minSecondaryConfidence}.`
              : ''),
      1_500,
    ),
  };
}

function cachePath(slug: string): string {
  return path.join(CACHE_DIR, `${slug}.json`);
}

function cacheIsValid(
  cached: CachedResult | null,
  options: {
    taxonomyHash: string;
    model: string;
    minPrimaryConfidence: number;
    minSecondaryConfidence: number;
  },
): cached is CachedResult {
  return Boolean(
    cached &&
      cached.meta.promptVersion === PROMPT_VERSION &&
      cached.meta.taxonomyHash === options.taxonomyHash &&
      cached.meta.model === options.model &&
      cached.meta.minPrimaryConfidence ===
        options.minPrimaryConfidence &&
      cached.meta.minSecondaryConfidence ===
        options.minSecondaryConfidence,
  );
}

async function classifyOne(args: {
  client: Anthropic;
  stage1Result: Stage1Result;
  applications: ApplicationDefinition[];
  taxonomyHash: string;
  model: string;
  minPrimaryConfidence: number;
  minSecondaryConfidence: number;
  force: boolean;
}): Promise<{ result: CachedResult; cached: boolean }> {
  const {
    client,
    stage1Result,
    applications,
    taxonomyHash,
    model,
    minPrimaryConfidence,
    minSecondaryConfidence,
    force,
  } = args;

  const slug = stage1Result.product.slug;
  const filePath = cachePath(slug);
  const cached = readJsonOrNull<CachedResult>(filePath);

  if (
    !force &&
    cacheIsValid(cached, {
      taxonomyHash,
      model,
      minPrimaryConfidence,
      minSecondaryConfidence,
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
        content: buildUserPayload(stage1Result, applications),
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
    throw new Error('Odpowiedź została ucięta przez max_tokens.');
  }

  const text = extractTextResponse(response);
  if (!text) {
    throw new Error('Brak tekstowej odpowiedzi Claude.');
  }

  const raw = JSON.parse(text) as RawModelResult;

  if (cleanText(raw.fabricSlug) !== slug) {
    throw new Error(
      `Model zwrócił slug "${raw.fabricSlug}", oczekiwano "${slug}".`,
    );
  }

  const normalized = normalizeResult({
    raw,
    slug,
    minPrimaryConfidence,
    minSecondaryConfidence,
  });

  const result: CachedResult = {
    meta: {
      promptVersion: PROMPT_VERSION,
      taxonomyHash,
      model,
      minPrimaryConfidence,
      minSecondaryConfidence,
      generatedAt: new Date().toISOString(),
      requestId:
        typeof (response as { _request_id?: unknown })._request_id ===
        'string'
          ? (response as { _request_id: string })._request_id
          : null,
      stopReason: response.stop_reason ?? null,
      usage: {
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens,
      },
    },
    product: stage1Result.product,
    stage1: {
      acceptedMatches:
        stage1Result.normalized.acceptedMatches,
      possibleButNotAccepted:
        stage1Result.normalized.possibleButNotAccepted,
      noMatchReason:
        stage1Result.normalized.noMatchReason,
    },
    modelOutput: raw,
    normalized,
  };

  writeJson(filePath, result);
  return { result, cached: false };
}

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
  minPrimaryConfidence: number;
  minSecondaryConfidence: number;
  totalProducts: number;
}): void {
  const {
    results,
    failures,
    applications,
    taxonomyHash,
    model,
    minPrimaryConfidence,
    minSecondaryConfidence,
    totalProducts,
  } = args;

  const order = new Map(
    results.map((result, index) => [
      result.product.slug,
      index,
    ]),
  );

  const sorted = [...results].sort(
    (a, b) =>
      (order.get(a.product.slug) ?? 0) -
      (order.get(b.product.slug) ?? 0),
  );

  const generatedAt = new Date().toISOString();

  const products: Record<
    string,
    {
      primaryApplication: ApplicationId | null;
      secondaryApplication: ApplicationId | null;
      primaryConfidence: number;
      secondaryConfidence: number;
    }
  > = {};

  for (const result of sorted) {
    products[result.product.slug] = {
      primaryApplication:
        result.normalized.primaryApplication,
      secondaryApplication:
        result.normalized.secondaryApplication,
      primaryConfidence:
        result.normalized.primaryConfidence,
      secondaryConfidence:
        result.normalized.secondaryConfidence,
    };
  }

  const countsByStatus = {
    resolved: sorted.filter(
      (result) => result.normalized.status === 'resolved',
    ).length,
    resolvedReview: sorted.filter(
      (result) =>
        result.normalized.status === 'resolved-review',
    ).length,
    unresolved: sorted.filter(
      (result) =>
        result.normalized.status === 'unresolved',
    ).length,
  };

  const primaryCounts = Object.fromEntries(
    applications.map((application) => [
      application.id,
      sorted.filter(
        (result) =>
          result.normalized.primaryApplication ===
          application.id,
      ).length,
    ]),
  );

  const secondaryCounts = Object.fromEntries(
    applications.map((application) => [
      application.id,
      sorted.filter(
        (result) =>
          result.normalized.secondaryApplication ===
          application.id,
      ).length,
    ]),
  );

  const usage = sorted.reduce(
    (acc, result) => {
      acc.inputTokens += result.meta.usage.inputTokens;
      acc.outputTokens += result.meta.usage.outputTokens;
      return acc;
    },
    { inputTokens: 0, outputTokens: 0 },
  );

  const summary = {
    stage: 2,
    productionReady: false,
    generatedAt,
    model,
    promptVersion: PROMPT_VERSION,
    taxonomyHash,
    minPrimaryConfidence,
    minSecondaryConfidence,
    totalProducts,
    processedProducts: sorted.length,
    failedProducts: failures.length,
    countsByStatus,
    primaryCounts,
    secondaryCounts,
    usage,
  };

  writeJson(
    path.join(REPORT_DIR, 'stage2-summary.json'),
    summary,
  );

  writeJson(
    path.join(REPORT_DIR, 'stage2-proposed-map.json'),
    {
      stage: 2,
      productionReady: false,
      generatedAt,
      applications: applications.map((application) => ({
        id: application.id,
        name: {
          pl: application.namePl,
          en: application.nameEn,
        },
        source: application.source,
      })),
      products,
    },
  );

  writeJson(
    path.join(REPORT_DIR, 'stage2-full-audit.json'),
    {
      summary,
      applications,
      results: sorted,
      failures,
    },
  );

  writeJson(
    path.join(REPORT_DIR, 'stage2-failures.json'),
    failures,
  );

  writeCsv(
    path.join(REPORT_DIR, 'stage2-review.csv'),
    [
      'slug',
      'name',
      'primaryApplication',
      'primaryConfidence',
      'secondaryApplication',
      'secondaryConfidence',
      'reviewReason',
      'alternativesConsidered',
      'primaryEvidence',
      'secondaryEvidence',
      'recordUrl',
    ],
    sorted
      .filter(
        (result) => result.normalized.needsHumanReview,
      )
      .map((result) => ({
        slug: result.product.slug,
        name: result.product.name,
        primaryApplication:
          result.normalized.primaryApplication,
        primaryConfidence:
          result.normalized.primaryConfidence,
        secondaryApplication:
          result.normalized.secondaryApplication,
        secondaryConfidence:
          result.normalized.secondaryConfidence,
        reviewReason: result.normalized.reviewReason,
        alternativesConsidered:
          result.normalized.alternativesConsidered
            .map(
              (item) =>
                `${item.applicationId}: ${item.reasonNotSelected}`,
            )
            .join(' || '),
        primaryEvidence:
          result.normalized.primaryEvidence.join(' || '),
        secondaryEvidence:
          result.normalized.secondaryEvidence.join(' || '),
        recordUrl: result.product.recordUrl,
      })),
  );

  writeCsv(
    path.join(REPORT_DIR, 'stage2-unresolved.csv'),
    [
      'slug',
      'name',
      'family',
      'subFamily',
      'categoryId',
      'titleDescriptor',
      'specLine',
      'reviewReason',
      'stage1Accepted',
      'stage1Possible',
      'recordUrl',
    ],
    sorted
      .filter(
        (result) =>
          result.normalized.primaryApplication === null,
      )
      .map((result) => ({
        slug: result.product.slug,
        name: result.product.name,
        family: result.product.family,
        subFamily: result.product.subFamily,
        categoryId: result.product.categoryId,
        titleDescriptor:
          result.product.titleDescriptor,
        specLine: result.product.specLine,
        reviewReason: result.normalized.reviewReason,
        stage1Accepted: result.stage1.acceptedMatches
          .map(
            (match) =>
              `${match.applicationId}:${match.confidence}`,
          )
          .join(' | '),
        stage1Possible:
          result.stage1.possibleButNotAccepted
            .map((match) => match.applicationId)
            .join(' | '),
        recordUrl: result.product.recordUrl,
      })),
  );

  writeCsv(
    path.join(REPORT_DIR, 'stage2-assignments.csv'),
    [
      'slug',
      'name',
      'family',
      'subFamily',
      'primaryApplication',
      'primaryConfidence',
      'secondaryApplication',
      'secondaryConfidence',
      'status',
      'primaryRationale',
      'secondaryRationale',
      'recordUrl',
    ],
    sorted.map((result) => ({
      slug: result.product.slug,
      name: result.product.name,
      family: result.product.family,
      subFamily: result.product.subFamily,
      primaryApplication:
        result.normalized.primaryApplication,
      primaryConfidence:
        result.normalized.primaryConfidence,
      secondaryApplication:
        result.normalized.secondaryApplication,
      secondaryConfidence:
        result.normalized.secondaryConfidence,
      status: result.normalized.status,
      primaryRationale:
        result.normalized.primaryRationale,
      secondaryRationale:
        result.normalized.secondaryRationale,
      recordUrl: result.product.recordUrl,
    })),
  );
}

async function main(): Promise<void> {
  if (!fs.existsSync(STAGE1_AUDIT_PATH)) {
    throw new Error(
      `Brak pliku etapu 1:\n${STAGE1_AUDIT_PATH}`,
    );
  }

  loadEnvFile(ENV_PATH);

  const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
  if (!apiKey) {
    throw new Error(
      `Brak ANTHROPIC_API_KEY w ${ENV_PATH}`,
    );
  }

  const stage1 = readJson<Stage1Audit>(
    STAGE1_AUDIT_PATH,
  );

  const model =
    getArg('model')?.trim() ||
    process.env.ANTHROPIC_MODEL?.trim() ||
    DEFAULT_MODEL;

  const concurrency = boundedInt(
    getArg('concurrency'),
    DEFAULT_CONCURRENCY,
    1,
    8,
    'concurrency',
  );

  const minPrimaryConfidence = boundedInt(
    getArg('min-primary-confidence'),
    DEFAULT_MIN_PRIMARY_CONFIDENCE,
    0,
    100,
    'min-primary-confidence',
  );

  const minSecondaryConfidence = boundedInt(
    getArg('min-secondary-confidence'),
    DEFAULT_MIN_SECONDARY_CONFIDENCE,
    0,
    100,
    'min-secondary-confidence',
  );

  const limitRaw = getArg('limit');
  const limit = limitRaw
    ? boundedInt(
        limitRaw,
        stage1.results.length,
        1,
        stage1.results.length,
        'limit',
      )
    : undefined;

  const selectedSlugs = new Set(
    (getArg('slug') ?? '')
      .split(',')
      .map((slug) => slug.trim())
      .filter(Boolean),
  );

  const knownSlugs = new Set(
    stage1.results.map((result) => result.product.slug),
  );

  const unknownSlugs = [...selectedSlugs].filter(
    (slug) => !knownSlugs.has(slug),
  );

  if (unknownSlugs.length > 0) {
    throw new Error(
      `Nieznane slugi: ${unknownSlugs.join(', ')}`,
    );
  }

  let selected = selectedSlugs.size
    ? stage1.results.filter((result) =>
        selectedSlugs.has(result.product.slug),
      )
    : [...stage1.results];

  if (limit !== undefined) {
    selected = selected.slice(0, limit);
  }

  if (selected.length === 0) {
    throw new Error('Brak produktów do przetworzenia.');
  }

  ensureDirectories();

  const applications = buildApplications(stage1);

  const taxonomyHash = sha256({
    promptVersion: PROMPT_VERSION,
    applications,
    systemPrompt: buildSystemPrompt(),
    schema: RESULT_SCHEMA,
  });

  writeJson(
    path.join(REPORT_DIR, 'stage2-taxonomy.json'),
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

  const force = hasFlag('force');

  console.log('');
  console.log(
    '=== ARITEKS — KLASYFIKACJA APLIKACJI, ETAP 2 ===',
  );
  console.log(
    `Produkty w audycie etapu 1: ${stage1.results.length}`,
  );
  console.log(
    `Produkty w tym przebiegu: ${selected.length}`,
  );
  console.log(`Aplikacje: ${applications.length}`);
  console.log(`Model: ${model}`);
  console.log(
    `Próg primary: ${minPrimaryConfidence}`,
  );
  console.log(
    `Próg secondary: ${minSecondaryConfidence}`,
  );
  console.log(`Równoległość: ${concurrency}`);
  console.log(
    `Cache: ${force ? 'ignorowany (--force)' : 'aktywny'}`,
  );
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

      const stage1Result = selected[index];
      const slug = stage1Result.product.slug;

      try {
        const { result, cached } = await classifyOne({
          client,
          stage1Result,
          applications,
          taxonomyHash,
          model,
          minPrimaryConfidence,
          minSecondaryConfidence,
          force,
        });

        results.push(result);
        completed += 1;

        const primary =
          result.normalized.primaryApplication ?? 'UNRESOLVED';
        const secondary =
          result.normalized.secondaryApplication
            ? ` | secondary: ${result.normalized.secondaryApplication}:${result.normalized.secondaryConfidence}`
            : '';

        console.log(
          `[${completed}/${selected.length}] ${
            cached ? 'CACHE' : 'API  '
          } ${slug} -> ${primary}:${result.normalized.primaryConfidence}${secondary}` +
            `${
              result.normalized.needsHumanReview
                ? ' | REVIEW'
                : ''
            }`,
        );
      } catch (error) {
        completed += 1;

        const message =
          error instanceof Error
            ? error.stack || error.message
            : String(error);

        const failure = {
          slug,
          name: stage1Result.product.name,
          error: message,
        };

        failures.push(failure);

        writeJson(
          path.join(ERROR_DIR, `${slug}.json`),
          {
            ...failure,
            generatedAt: new Date().toISOString(),
          },
        );

        console.error(
          `[${completed}/${selected.length}] BŁĄD ${slug}: ${
            error instanceof Error
              ? error.message
              : String(error)
          }`,
        );
      }
    }
  }

  await Promise.all(
    Array.from(
      {
        length: Math.min(
          concurrency,
          selected.length,
        ),
      },
      () => worker(),
    ),
  );

  buildReports({
    results,
    failures,
    applications,
    taxonomyHash,
    model,
    minPrimaryConfidence,
    minSecondaryConfidence,
    totalProducts: stage1.results.length,
  });

  console.log('');
  console.log('GOTOWE — ETAP 2');
  console.log(`Wyniki: ${REPORT_DIR}`);
  console.log(
    `Przetworzone: ${results.length}, błędy: ${failures.length}`,
  );
  console.log(
    'Najważniejsze pliki: stage2-proposed-map.json, stage2-unresolved.csv, stage2-review.csv, stage2-assignments.csv',
  );

  if (failures.length > 0) {
    process.exitCode = 2;
  }
}

main().catch((error) => {
  console.error('');
  console.error('BŁĄD KRYTYCZNY:');
  console.error(
    error instanceof Error ? error.stack : error,
  );
  process.exitCode = 1;
});
