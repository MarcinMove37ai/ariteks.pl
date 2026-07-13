// src/lib/applicationHighlights.ts
// Jedno źródło marketingowych badge'y dla grida i hero aplikacji.
//
// Zasada:
// - wyłącznie produkty przypisane jako primary,
// - maksymalnie 5 identycznych badge'y w gridzie i hero,
// - najpierw technologie/partnerstwa (maks. 2),
// - potem istotne normy użytkowe,
// - na końcu tylko wybrane, marketingowo istotne metody badań,
// - pozostałe wartości trafiają do dolnego pasa strony.

import fs from 'node:fs';
import path from 'node:path';

import type { FabricDef } from '@/content/fabrics';
import type { ApplicationId } from '@/content/fabric-application-overrides';
import { getPrimaryFabricsForApplication } from '@/lib/fabricApplications';

type JsonObject = Record<string, unknown>;

type TechParam = {
  standard?: string;
};

type FabricRecord = {
  product_page?: {
    description_blocks?: string[];
    technical_parameters?: TechParam[];
    technical_documents?: unknown[];
    image_groups?: {
      technology_partners?: unknown[];
      function_icons?: unknown[];
    };
  };
  category_row?: JsonObject;
} & JsonObject;

type RankedItem = {
  label: string;
  key: string;
  count: number;
  certificateScore: number;
  priority: number;
  kind: 'technology' | 'standard' | 'test';
};

export type ApplicationHighlights = {
  featured: string[];
  remaining: string[];
};

const RECORD_CACHE = new Map<string, FabricRecord | null>();

const OEKO_TEX_NORM = 'OEKO-TEX 100';

const OEKO_TEX_MARKETING_APPLICATIONS = new Set<ApplicationId>([
  'medical',
  'sport',
  'hivis',
  'workwear-industrial',
  'outdoor-functional',
  'upholstery-interiors',
  'transport',
]);

/**
 * Tylko normy mające bezpośrednią wartość marketingową
 * dla danej aplikacji. Nieznane oznaczenia nie trafiają do featured.
 */
const STANDARD_APPLICATION_ALLOWLIST: Readonly<
  Record<string, readonly ApplicationId[]>
> = {
  'EN ISO 20471': ['hivis'],
  'EN ISO 14116': [
    'military',
    'firefighting',
    'energy',
    'welding',
    'hivis',
    'workwear-industrial',
  ],
  'EN 1149': [
    'military',
    'firefighting',
    'energy',
    'welding',
    'hivis',
    'workwear-industrial',
  ],
  'EN 13034': ['hivis', 'workwear-industrial'],
  'EN 343': [
    'military',
    'motorcycle',
    'hivis',
    'workwear-industrial',
    'outdoor-functional',
  ],
  'EN 61482': [
    'energy',
    'welding',
    'hivis',
    'workwear-industrial',
  ],
  'EN ISO 11612': [
    'firefighting',
    'energy',
    'welding',
    'hivis',
    'workwear-industrial',
  ],
  'EN ISO 11611': ['welding', 'workwear-industrial'],
  'EN 61340': ['energy', 'workwear-industrial'],
  'EN 388': ['military', 'motorcycle', 'workwear-industrial'],
  'EN 17092': ['motorcycle'],
  'EN 469': ['firefighting'],
  'EN 14126': ['medical'],
  'EN 14683': ['medical'],
  'EN 13795': ['medical'],
  'ISO 18184': ['medical'],
  'ISO 20743': ['medical'],
  'EN 13758': ['sport', 'outdoor-functional'],
  'IEC 60895': ['energy'],
};

const TECHNOLOGY_PATTERNS: ReadonlyArray<{
  label: string;
  pattern: RegExp;
  priority: number;
}> = [
  { label: 'CORDURA®', pattern: /\bcordura\b/i, priority: 600 },
  { label: 'PBO', pattern: /\bpbo\b/i, priority: 590 },
  { label: 'Pyrovatex®', pattern: /\bpyrovatex\b/i, priority: 580 },
  { label: 'Protal®', pattern: /\bprotal\b/i, priority: 570 },
  {
    label: 'Bekinox®',
    pattern: /\b(?:bekinox|bekaeat|bekaert)\b/i,
    priority: 560,
  },
  {
    label: 'CONEX®',
    pattern: /\b(?:conex|teijin conex)\b/i,
    priority: 550,
  },
  {
    label: 'Lenzing™ FR',
    pattern: /\blenzing(?:\s+fr)?\b/i,
    priority: 540,
  },
  { label: 'HPPE', pattern: /\bhppe\b/i, priority: 530 },
  {
    label: 'EMI shielding',
    pattern: /\bemi\s+shield(?:ing|ed)?\b/i,
    priority: 520,
  },
];

const STANDARD_PRIORITY: Readonly<Record<string, number>> = {
  'EN 469': 500,
  'EN ISO 20471': 490,
  'EN 61482': 480,
  'EN ISO 11611': 470,
  'EN ISO 11612': 460,
  'EN 14126': 455,
  'ISO 18184': 450,
  'ISO 20743': 445,
  'EN 1149': 440,
  'IEC 60895': 435,
  'EN 13795': 430,
  'EN 343': 420,
  'EN 13034': 410,
  'EN 61340': 400,
  'EN 17092': 390,
  'EN 388': 380,
  'EN 14683': 370,
  'EN 13758': 360,
  [OEKO_TEX_NORM]: 250,
};

/**
 * Metody, które mogą wejść do featured dopiero po technologiach i normach.
 * Kolejność w tablicy jest kolejnością marketingowego znaczenia.
 */
const FEATURED_TEST_PREFIXES: Readonly<
  Partial<Record<ApplicationId, readonly string[]>>
> = {
  military: [
    'EN ISO 12947',
    'ISO 12947',
    'EN ISO 13934',
    'ISO 13934',
    'EN ISO 13937',
    'ISO 13937',
  ],
  motorcycle: [
    'EN ISO 12947',
    'ISO 12947',
    'EN ISO 13934',
    'ISO 13934',
    'EN ISO 13937',
    'ISO 13937',
    'EN ISO 105 B02',
    'ISO 105 B02',
  ],
  sport: [
    'EN ISO 13938',
    'ISO 13938',
    'EN ISO 5077',
    'ISO 5077',
  ],
  'architecture-building': [
    'DIN 4102',
    'AATCC 183',
    'EN ISO 13938',
    'ISO 13938',
  ],
  transport: [
    'EN 530',
    'EN ISO 12947',
    'ISO 12947',
    'EN ISO 13938',
    'ISO 13938',
    'EN ISO 5077',
    'ISO 5077',
  ],
  'outdoor-functional': [
    'EN ISO 13934',
    'ISO 13934',
    'EN ISO 13937',
    'ISO 13937',
    'EN ISO 13938',
    'ISO 13938',
  ],
  'upholstery-interiors': [
    'EN 530',
    'EN ISO 12947',
    'ISO 12947',
    'EN ISO 13938',
    'ISO 13938',
    'EN ISO 5077',
    'ISO 5077',
  ],
  'print-signage': [
    'EN ISO 105 B02',
    'ISO 105 B02',
    'EN ISO 5077',
    'ISO 5077',
  ],
  'professional-cleaning': [
    'EN ISO 13938',
    'ISO 13938',
    'EN ISO 5077',
    'ISO 5077',
  ],
};

/**
 * Dolny pas pokazuje tylko realnie użyteczne testy materiałowe.
 * Odrzucamy m.in. ISO 9001, metody identyfikacji włókien,
 * pH, numer przędzy i szerokość próbki.
 */
const ALLOWED_TEST_PREFIXES = [
  'EN ISO 12947',
  'ISO 12947',
  'EN ISO 13934',
  'ISO 13934',
  'EN ISO 13937',
  'ISO 13937',
  'EN ISO 13938',
  'ISO 13938',
  'EN ISO 5077',
  'ISO 5077',
  'EN ISO 105 B02',
  'ISO 105 B02',
  'EN ISO 105 B04',
  'ISO 105 B04',
  'EN ISO 105 B07',
  'ISO 105 B07',
  'EN ISO 105 C01',
  'ISO 105 C01',
  'EN ISO 105 C06',
  'ISO 105 C06',
  'EN ISO 105 D01',
  'ISO 105 D01',
  'EN ISO 105 E04',
  'ISO 105 E04',
  'EN ISO 105 N01',
  'ISO 105 N01',
  'EN ISO 105 N02',
  'ISO 105 N02',
  'EN ISO 105 X11',
  'ISO 105 X11',
  'EN ISO 105 X12',
  'ISO 105 X12',
  'DIN 4102',
  'AATCC 183',
  'EN 530',
];

const STANDARD_CODE_RE =
  /\b(?:EN\s+ISO|EN|ISO|IEC|DIN|ASTM(?:E)?|AATCC)\s+\d+(?:-\d+)*(?::\d{4})?(?:\s+[A-Z]\d+)?\b/gi;

function clean(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

function keyOf(value: string): string {
  return clean(value).toUpperCase();
}

function readRecord(fabric: FabricDef): FabricRecord | null {
  const cached = RECORD_CACHE.get(fabric.slug);
  if (cached !== undefined) return cached;

  const recordPath = path.join(
    process.cwd(),
    'public',
    fabric.recordUrl.replace(/^[/\\]+/, ''),
  );

  try {
    const parsed = JSON.parse(
      fs.readFileSync(recordPath, 'utf8'),
    ) as FabricRecord;

    RECORD_CACHE.set(fabric.slug, parsed);
    return parsed;
  } catch {
    RECORD_CACHE.set(fabric.slug, null);
    return null;
  }
}

function collectStrings(
  value: unknown,
  output: string[] = [],
): string[] {
  if (typeof value === 'string') {
    output.push(value);
    return output;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      collectStrings(item, output);
    }

    return output;
  }

  if (value && typeof value === 'object') {
    for (const item of Object.values(value)) {
      collectStrings(item, output);
    }
  }

  return output;
}

function canonicalStandard(raw: string): string {
  const value = clean(raw)
    .replace(/:\d{4}\b/g, '')
    .replace(/\s+/g, ' ');

  const upper = value.toUpperCase();

  if (/OEKO[\s-]*TEX/.test(upper)) return OEKO_TEX_NORM;
  if (/^(?:EN\s+ISO|EN)\s+20471\b/.test(upper)) {
    return 'EN ISO 20471';
  }
  if (/^(?:EN\s+ISO|EN)\s+14116\b/.test(upper)) {
    return 'EN ISO 14116';
  }
  if (/^(?:EN\s+ISO|EN)\s+11612\b/.test(upper)) {
    return 'EN ISO 11612';
  }
  if (/^(?:EN\s+ISO|EN)\s+11611\b/.test(upper)) {
    return 'EN ISO 11611';
  }
  if (/^EN\s+1149(?:-\d+)?\b/.test(upper)) return 'EN 1149';
  if (/^EN\s+61482(?:-\d+)*\b/.test(upper)) return 'EN 61482';

  return value;
}

function getTechnologies(fabric: FabricDef): string[] {
  const record = readRecord(fabric);
  const productPage = record?.product_page;

  // Celowo nie skanujemy application_images:
  // obraz może pokazywać element wykonany z innej technologii niż sam produkt.
  const searchableText = [
    fabric.name,
    fabric.family,
    fabric.titleDescriptor,
    fabric.specLine,
    ...(productPage?.description_blocks ?? []),
    ...collectStrings(productPage?.technical_documents),
    ...collectStrings(
      productPage?.image_groups?.technology_partners,
    ),
    ...collectStrings(
      productPage?.image_groups?.function_icons,
    ),
    ...collectStrings(record?.category_row),
    ...fabric.certificates,
    ...fabric.dataSheets,
  ].join(' ');

  const technologies = new Set<string>();

  for (const technology of TECHNOLOGY_PATTERNS) {
    if (technology.pattern.test(searchableText)) {
      technologies.add(technology.label);
    }
  }

  return [...technologies];
}

function extractTestMethods(fabric: FabricDef): string[] {
  const record = readRecord(fabric);
  const methods = new Set<string>();

  const sources = [
    ...(record?.product_page?.technical_parameters ?? []).map(
      (parameter) => parameter.standard ?? '',
    ),
    ...fabric.certificates,
    ...fabric.dataSheets,
  ];

  for (const source of sources) {
    const value = clean(source);
    if (!value) continue;

    for (const match of value.matchAll(STANDARD_CODE_RE)) {
      const label = canonicalStandard(match[0]);
      if (label) methods.add(label);
    }
  }

  return [...methods];
}

function isMarketingStandard(
  norm: string,
  applicationId: ApplicationId,
): boolean {
  const label = canonicalStandard(norm);
  const key = keyOf(label);

  if (key === OEKO_TEX_NORM) {
    return OEKO_TEX_MARKETING_APPLICATIONS.has(applicationId);
  }

  const allowedApplications =
    STANDARD_APPLICATION_ALLOWLIST[key];

  return (
    allowedApplications !== undefined &&
    allowedApplications.includes(applicationId)
  );
}

function isAllowedTestMethod(label: string): boolean {
  const key = keyOf(label);

  return ALLOWED_TEST_PREFIXES.some((prefix) =>
    key.startsWith(prefix),
  );
}

function testFeaturedOrder(
  applicationId: ApplicationId,
  label: string,
): number {
  const prefixes =
    FEATURED_TEST_PREFIXES[applicationId] ?? [];

  const key = keyOf(label);
  const index = prefixes.findIndex((prefix) =>
    key.startsWith(prefix),
  );

  return index;
}

function technologyPriority(label: string): number {
  return (
    TECHNOLOGY_PATTERNS.find(
      (technology) => technology.label === label,
    )?.priority ?? 500
  );
}

function standardPriority(label: string): number {
  return STANDARD_PRIORITY[keyOf(label)] ?? 300;
}

function aggregate(
  fabrics: FabricDef[],
  kind: RankedItem['kind'],
  getValues: (fabric: FabricDef) => string[],
  getPriority: (label: string) => number,
): RankedItem[] {
  const items = new Map<
    string,
    {
      label: string;
      count: number;
      certificateScore: number;
    }
  >();

  for (const fabric of fabrics) {
    const unique = new Map<string, string>();

    for (const raw of getValues(fabric)) {
      const label =
        kind === 'standard' || kind === 'test'
          ? canonicalStandard(raw)
          : clean(raw);

      if (!label) continue;
      unique.set(keyOf(label), label);
    }

    for (const [key, label] of unique) {
      const current = items.get(key);

      items.set(key, {
        label: current?.label ?? label,
        count: (current?.count ?? 0) + 1,
        certificateScore:
          (current?.certificateScore ?? 0) +
          (fabric.certificates.length > 0 ? 1 : 0),
      });
    }
  }

  return [...items.values()]
    .map(
      ({
        label,
        count,
        certificateScore,
      }): RankedItem => ({
        label,
        key: keyOf(label),
        count,
        certificateScore,
        priority: getPriority(label),
        kind,
      }),
    )
    .sort(
      (a, b) =>
        b.priority - a.priority ||
        b.certificateScore - a.certificateScore ||
        b.count - a.count ||
        a.label.localeCompare(b.label, 'en'),
    );
}

function dedupe(items: RankedItem[]): RankedItem[] {
  const unique = new Map<string, RankedItem>();

  for (const item of items) {
    if (!unique.has(item.key)) {
      unique.set(item.key, item);
    }
  }

  return [...unique.values()];
}

export function getApplicationHighlights(
  applicationId: ApplicationId,
  featuredLimit = 5,
  remainingLimit = 12,
): ApplicationHighlights {
  const fabrics =
    getPrimaryFabricsForApplication(applicationId);

  if (fabrics.length === 0) {
    return { featured: [], remaining: [] };
  }

  const standardMinimum =
    applicationId === 'military' || fabrics.length <= 2
      ? 1
      : 2;

  const testMinimum = fabrics.length <= 2 ? 1 : 2;

  const technologies = aggregate(
    fabrics,
    'technology',
    getTechnologies,
    technologyPriority,
  );

  const standards = aggregate(
    fabrics,
    'standard',
    (fabric) => fabric.norms,
    standardPriority,
  ).filter(
    (item) =>
      item.count >= standardMinimum &&
      isMarketingStandard(item.label, applicationId),
  );

  const standardKeys = new Set(
    aggregate(
      fabrics,
      'standard',
      (fabric) => fabric.norms,
      standardPriority,
    ).map((item) => item.key),
  );

  const testMethods = aggregate(
    fabrics,
    'test',
    extractTestMethods,
    () => 200,
  ).filter(
    (item) =>
      !standardKeys.has(item.key) &&
      item.count >= testMinimum &&
      isAllowedTestMethod(item.label),
  );

  const featuredTechnologies =
    technologies.slice(0, 2);

  const spaceAfterTechnologies = Math.max(
    0,
    featuredLimit - featuredTechnologies.length,
  );

  const featuredStandards =
    standards.slice(0, spaceAfterTechnologies);

  const spaceAfterStandards = Math.max(
    0,
    featuredLimit -
      featuredTechnologies.length -
      featuredStandards.length,
  );

  const featuredTests = testMethods
    .filter(
      (item) =>
        testFeaturedOrder(
          applicationId,
          item.label,
        ) >= 0,
    )
    .sort(
      (a, b) =>
        testFeaturedOrder(applicationId, a.label) -
          testFeaturedOrder(applicationId, b.label) ||
        b.certificateScore - a.certificateScore ||
        b.count - a.count ||
        a.label.localeCompare(b.label, 'en'),
    )
    .slice(0, spaceAfterStandards);

  const featuredItems = dedupe([
    ...featuredTechnologies,
    ...featuredStandards,
    ...featuredTests,
  ]).slice(0, featuredLimit);

  const featuredKeys = new Set(
    featuredItems.map((item) => item.key),
  );

  const remaining = dedupe([
    ...technologies,
    ...standards,
    ...testMethods,
  ])
    .filter((item) => !featuredKeys.has(item.key))
    .slice(0, remainingLimit)
    .map((item) => item.label);

  return {
    featured: featuredItems.map((item) => item.label),
    remaining,
  };
}
