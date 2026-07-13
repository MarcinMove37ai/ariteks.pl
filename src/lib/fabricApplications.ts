// src/lib/fabricApplications.ts
// Warstwa odczytu powiązań produkt <-> aplikacja.
// Łączy zamrożoną mapę AI z ręcznymi korektami.
// Nie modyfikuje katalogu FABRICS ani definicji APPLICATIONS.

import {
  FABRICS,
  type FabricDef,
} from '@/content/fabrics';
import MAP_RAW from '@/content/fabric-applications.json';
import {
  APPLICATION_IDS,
  FABRIC_APPLICATION_OVERRIDES,
  type ApplicationId,
  type FabricApplicationOverride,
} from '@/content/fabric-application-overrides';

type RawAssignment = {
  primaryApplication: string | null;
  secondaryApplication: string | null;
  primaryConfidence: number;
  secondaryConfidence: number;
};

type RawMap = {
  schemaVersion: number;
  productionReady: boolean;
  source: {
    stage: number;
    generatedAt: string;
  };
  applications: string[];
  products: Record<string, RawAssignment>;
};

export type FabricApplicationAssignment = {
  primaryApplication: ApplicationId;
  secondaryApplication: ApplicationId | null;
  /** null oznacza ręcznie zmienione przypisanie, którego confidence AI już nie opisuje */
  primaryConfidence: number | null;
  /** null oznacza ręcznie zmienione przypisanie, którego confidence AI już nie opisuje */
  secondaryConfidence: number | null;
  hasOverride: boolean;
};

export type FabricApplicationsForProduct = {
  primary: ApplicationId;
  secondary: ApplicationId | null;
};

const RAW_MAP = MAP_RAW as RawMap;
const VALID_APPLICATION_IDS = new Set<string>(APPLICATION_IDS);

function isApplicationId(value: unknown): value is ApplicationId {
  return typeof value === 'string' && VALID_APPLICATION_IDS.has(value);
}

function resolveAssignment(
  slug: string,
  raw: RawAssignment,
): FabricApplicationAssignment {
  if (!isApplicationId(raw.primaryApplication)) {
    throw new Error(
      `[fabricApplications] Produkt "${slug}" nie ma prawidłowego primaryApplication.`,
    );
  }

  const override: FabricApplicationOverride | undefined =
    FABRIC_APPLICATION_OVERRIDES[
      slug as keyof typeof FABRIC_APPLICATION_OVERRIDES
    ];

  const primaryApplication =
    override?.primaryApplication ?? raw.primaryApplication;

  const secondaryApplication =
    override && 'secondaryApplication' in override
      ? override.secondaryApplication ?? null
      : isApplicationId(raw.secondaryApplication)
        ? raw.secondaryApplication
        : null;

  if (secondaryApplication === primaryApplication) {
    throw new Error(
      `[fabricApplications] Produkt "${slug}" ma identyczne primary i secondary: "${primaryApplication}".`,
    );
  }

  const primaryChanged =
    override?.primaryApplication !== undefined &&
    override.primaryApplication !== raw.primaryApplication;

  const secondaryChanged =
    Boolean(override && 'secondaryApplication' in override) &&
    secondaryApplication !== raw.secondaryApplication;

  return {
    primaryApplication,
    secondaryApplication,
    primaryConfidence: primaryChanged
      ? null
      : raw.primaryConfidence,
    secondaryConfidence: secondaryChanged
      ? null
      : secondaryApplication
        ? raw.secondaryConfidence
        : 0,
    hasOverride: Boolean(override),
  };
}

const ASSIGNMENTS = new Map<string, FabricApplicationAssignment>(
  Object.entries(RAW_MAP.products).map(([slug, raw]) => [
    slug,
    resolveAssignment(slug, raw),
  ]),
);

export function getFabricApplicationAssignment(
  fabricSlug: string,
): FabricApplicationAssignment | undefined {
  return ASSIGNMENTS.get(fabricSlug);
}

export function getApplicationsForFabric(
  fabricSlug: string,
): FabricApplicationsForProduct | undefined {
  const assignment = getFabricApplicationAssignment(fabricSlug);

  if (!assignment) return undefined;

  return {
    primary: assignment.primaryApplication,
    secondary: assignment.secondaryApplication,
  };
}

export function getPrimaryFabricsForApplication(
  applicationId: ApplicationId,
): FabricDef[] {
  return FABRICS.filter(
    (fabric) =>
      ASSIGNMENTS.get(fabric.slug)?.primaryApplication ===
      applicationId,
  );
}

export function getSecondaryFabricsForApplication(
  applicationId: ApplicationId,
): FabricDef[] {
  return FABRICS.filter(
    (fabric) =>
      ASSIGNMENTS.get(fabric.slug)?.secondaryApplication ===
      applicationId,
  );
}

export function getAllFabricsForApplication(
  applicationId: ApplicationId,
): FabricDef[] {
  return FABRICS.filter((fabric) => {
    const assignment = ASSIGNMENTS.get(fabric.slug);

    return (
      assignment?.primaryApplication === applicationId ||
      assignment?.secondaryApplication === applicationId
    );
  });
}

export type ApplicationNorm = {
  norm: string;
  productCount: number;
};

/**
 * Zwraca normy występujące w produktach przypisanych do aplikacji jako primary.
 * Normy są sortowane:
 * 1. według liczby produktów,
 * 2. alfabetycznie.
 */
export function getPrimaryNormsForApplication(
  applicationId: ApplicationId,
): ApplicationNorm[] {
  const counts = new Map<
    string,
    {
      norm: string;
      productCount: number;
    }
  >();

  const fabrics =
    getPrimaryFabricsForApplication(applicationId);

  for (const fabric of fabrics) {
    const rawNorms =
      'norms' in fabric && Array.isArray(fabric.norms)
        ? fabric.norms
        : [];

    // Ta sama norma w jednym produkcie liczy się tylko raz.
    const uniqueFabricNorms = new Map<string, string>();

    for (const rawNorm of rawNorms) {
      if (typeof rawNorm !== 'string') continue;

      const norm = rawNorm.replace(/\s+/g, ' ').trim();
      if (!norm) continue;

      const key = norm.toLocaleUpperCase('en');
      uniqueFabricNorms.set(key, norm);
    }

    for (const [key, norm] of uniqueFabricNorms) {
      const current = counts.get(key);

      counts.set(key, {
        norm: current?.norm ?? norm,
        productCount: (current?.productCount ?? 0) + 1,
      });
    }
  }

  return [...counts.values()].sort(
    (a, b) =>
      b.productCount - a.productCount ||
      a.norm.localeCompare(b.norm, 'en'),
  );
}

const OEKO_TEX_NORM = 'OEKO-TEX 100';

const OEKO_TEX_MARKETING_APPLICATIONS =
  new Set<ApplicationId>([
    'medical',
    'sport',
    'hivis',
    'workwear-industrial',
    'outdoor-functional',
    'upholstery-interiors',
    'transport',
  ]);

const GENERIC_APPLICATION_NORMS = new Set([
  OEKO_TEX_NORM,
]);

/**
 * Niektóre normy mają sens tylko dla określonych zastosowań.
 * Pełne normy nadal pozostają przy produktach — filtr dotyczy wyłącznie
 * badge'y prezentowanych na poziomie aplikacji.
 */
const NORM_APPLICATION_ALLOWLIST: Readonly<
  Record<string, readonly ApplicationId[]>
> = {
  'EN ISO 20471': ['hivis'],
  'EN ISO 14116': [
    'hivis',
    'firefighting',
    'energy',
    'welding',
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
    'hivis',
    'outdoor-functional',
    'workwear-industrial',
    'motorcycle',
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
  'EN 388': [
    'military',
    'motorcycle',
    'workwear-industrial',
  ],
  'EN 17092': ['motorcycle'],
  'EN 14683': ['medical'],
  'EN 469': ['firefighting'],
};

function normalizeApplicationNorm(norm: string): string {
  return norm.replace(/\s+/g, ' ').trim().toUpperCase();
}

function isNormRelevantForApplication(
  norm: string,
  applicationId: ApplicationId,
): boolean {
  const normalizedNorm =
    normalizeApplicationNorm(norm);

  if (
    normalizedNorm === OEKO_TEX_NORM &&
    !OEKO_TEX_MARKETING_APPLICATIONS.has(applicationId)
  ) {
    return false;
  }

  const allowedApplications =
    NORM_APPLICATION_ALLOWLIST[normalizedNorm];

  return (
    allowedApplications === undefined ||
    allowedApplications.includes(applicationId)
  );
}

/**
 * Badge'e widoczne na kaflu aplikacji:
 * - pochodzą wyłącznie z produktów primary,
 * - muszą występować w reprezentatywnej części grupy,
 * - normy branżowe mają pierwszeństwo przed OEKO-TEX,
 * - maksymalnie 3 oznaczenia.
 */
export function getPrimaryBadgesForApplication(
  applicationId: ApplicationId,
  limit = 3,
): string[] {
  if (limit <= 0) return [];

  const fabrics =
    getPrimaryFabricsForApplication(applicationId);

  if (fabrics.length === 0) return [];

  const minimumProductCount = 2;

  const relevantNorms =
    getPrimaryNormsForApplication(applicationId).filter(
      ({ norm }) =>
        isNormRelevantForApplication(norm, applicationId),
    );

  const repeatedNorms = relevantNorms.filter(
    ({ productCount }) =>
      productCount >= minimumProductCount,
  );

  // Preferujemy normy potwierdzone przez minimum 2 produkty primary.
  // Gdy cała aplikacja nie ma takiej normy, pokazujemy najczęstsze
  // pojedyncze wystąpienia zamiast pozostawiać pusty kafel.
  const eligibleNorms =
    repeatedNorms.length > 0
      ? repeatedNorms
      : relevantNorms;

  const specificNorms = eligibleNorms.filter(
    ({ norm }) =>
      !GENERIC_APPLICATION_NORMS.has(
        normalizeApplicationNorm(norm),
      ),
  );

  const genericNorms = eligibleNorms.filter(({ norm }) =>
    GENERIC_APPLICATION_NORMS.has(
      normalizeApplicationNorm(norm),
    ),
  );

  const selected = specificNorms
    .slice(0, limit)
    .map(({ norm }) => norm);

  if (selected.length < limit) {
    selected.push(
      ...genericNorms
        .slice(0, limit - selected.length)
        .map(({ norm }) => norm),
    );
  }

  return selected.slice(0, limit);
}

export type FabricApplicationValidation = {
  valid: boolean;
  catalogueProducts: number;
  mappedProducts: number;
  missingProducts: string[];
  unknownProducts: string[];
  invalidApplicationIds: string[];
  duplicatePrimarySecondary: string[];
};

export function validateFabricApplicationMap(): FabricApplicationValidation {
  const catalogueSlugs = new Set(
    FABRICS.map((fabric) => fabric.slug),
  );
  const mappedSlugs = new Set(Object.keys(RAW_MAP.products));

  const missingProducts = [...catalogueSlugs].filter(
    (slug) => !mappedSlugs.has(slug),
  );

  const unknownProducts = [...mappedSlugs].filter(
    (slug) => !catalogueSlugs.has(slug),
  );

  const invalidApplicationIds = [
    ...new Set(
      Object.values(RAW_MAP.products)
        .flatMap((assignment) => [
          assignment.primaryApplication,
          assignment.secondaryApplication,
        ])
        .filter(
          (id): id is string =>
            id !== null && !isApplicationId(id),
        ),
    ),
  ];

  const duplicatePrimarySecondary = Object.entries(
    RAW_MAP.products,
  )
    .filter(([slug, raw]) => {
      const resolved = ASSIGNMENTS.get(slug);
      return (
        resolved !== undefined &&
        resolved.secondaryApplication ===
          resolved.primaryApplication
      );
    })
    .map(([slug]) => slug);

  return {
    valid:
      missingProducts.length === 0 &&
      unknownProducts.length === 0 &&
      invalidApplicationIds.length === 0 &&
      duplicatePrimarySecondary.length === 0,
    catalogueProducts: catalogueSlugs.size,
    mappedProducts: mappedSlugs.size,
    missingProducts,
    unknownProducts,
    invalidApplicationIds,
    duplicatePrimarySecondary,
  };
}
