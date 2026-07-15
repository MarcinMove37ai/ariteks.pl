import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import {
  FABRICS,
  FABRIC_CATEGORIES,
  FABRIC_FAMILIES,
  FABRIC_FIBER_LABELS,
  FABRIC_PROPERTY_LABELS,
  FABRIC_WEAVE_LABELS,
} from '../src/content/fabrics';
import { APPLICATIONS } from '../src/content/applications';

type Locale = 'pl' | 'en';
type Localized<T> = Record<Locale, T>;

type PolishProductContent = {
  descriptor: string;
  spec: string;
  description: string[];
};

type PolishContentFile = {
  dictionary: Record<string, unknown>;
  products: Record<string, PolishProductContent>;
};

type ProductApplicationAssignment = {
  primaryApplication: string;
  secondaryApplication: string | null;
  primaryConfidence: number;
  secondaryConfidence: number;
};

type ProductApplicationsFile = {
  schemaVersion: number;
  productionReady: boolean;
  source?: Record<string, unknown>;
  applications: string[];
  products: Record<string, ProductApplicationAssignment>;
};

type FamilyAsset = {
  hero?: string;
  heroWidth?: number;
  heroHeight?: number;
  pdf?: string;
};

type FamilyAssetsFile = Record<string, FamilyAsset>;

type PublicAsset = {
  path: string;
  url: string;
};

const ROOT = process.cwd();
const BASE_URL = 'https://ariteks.pl';
const OUTPUT_DIR = path.join(ROOT, 'public', 'data');

const SOURCE_FILES = [
  'src/content/fabrics.ts',
  'src/content/fabrics-pl.json',
  'src/content/applications.ts',
  'src/content/fabric-applications.json',
  'src/content/families-assets.json',
] as const;

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function readJson<T>(relativePath: string): T {
  const absolutePath = path.join(ROOT, relativePath);
  return JSON.parse(readFileSync(absolutePath, 'utf8')) as T;
}

function localizedPath(relativePath: string, locale: Locale): string {
  return locale === 'pl' ? relativePath : `/en${relativePath}`;
}

function absoluteUrl(relativePath: string): string {
  return new URL(relativePath, `${BASE_URL}/`).toString();
}

function publicAsset(relativePath: string | null | undefined): PublicAsset | null {
  if (!relativePath) return null;
  return {
    path: relativePath,
    url: absoluteUrl(relativePath),
  };
}

function localizedPage(relativePath: Localized<string>) {
  return {
    path: relativePath,
    url: {
      pl: absoluteUrl(relativePath.pl),
      en: absoluteUrl(relativePath.en),
    } satisfies Localized<string>,
  };
}

function calculateSourceHash(): string {
  const hash = createHash('sha256');

  for (const relativePath of [...SOURCE_FILES].sort()) {
    hash.update(relativePath);
    hash.update('\0');
    hash.update(readFileSync(path.join(ROOT, relativePath)));
    hash.update('\0');
  }

  return hash.digest('hex');
}

function duplicateValues(values: string[]): string[] {
  const counts = new Map<string, number>();
  for (const value of values) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return [...counts.entries()]
    .filter(([, count]) => count > 1)
    .map(([value]) => value);
}

function validateSources(
  polishContent: PolishContentFile,
  productApplications: ProductApplicationsFile,
  familyAssets: FamilyAssetsFile,
): void {
  const productSlugs = FABRICS.map((fabric) => fabric.slug);
  const familySlugs = FABRIC_FAMILIES.map((family) => family.slug);
  const categoryIds = FABRIC_CATEGORIES.map((category) => category.id);
  const applicationIds = APPLICATIONS.map((application) => application.id);

  assert(duplicateValues(productSlugs).length === 0, 'FABRICS contains duplicate product slugs.');
  assert(duplicateValues(familySlugs).length === 0, 'FABRIC_FAMILIES contains duplicate family slugs.');
  assert(duplicateValues(categoryIds).length === 0, 'FABRIC_CATEGORIES contains duplicate category IDs.');
  assert(duplicateValues(applicationIds).length === 0, 'APPLICATIONS contains duplicate application IDs.');

  for (const locale of ['pl', 'en'] as const) {
    assert(
      duplicateValues(APPLICATIONS.map((application) => application.slug[locale])).length === 0,
      `APPLICATIONS contains duplicate ${locale.toUpperCase()} slugs.`,
    );
  }

  const productSlugSet = new Set(productSlugs);
  const familySlugSet = new Set(familySlugs);
  const categoryIdSet = new Set(categoryIds);
  const applicationIdSet = new Set(applicationIds);

  for (const fabric of FABRICS) {
    assert(familySlugSet.has(fabric.subFamily), `Unknown family "${fabric.subFamily}" in product "${fabric.slug}".`);
    assert(
      fabric.categoryId === '' || categoryIdSet.has(fabric.categoryId),
      `Unknown category "${fabric.categoryId}" in product "${fabric.slug}".`,
    );
    assert(polishContent.products[fabric.slug], `Missing Polish content for product "${fabric.slug}".`);

    const assignment = productApplications.products[fabric.slug];
    assert(assignment, `Missing application assignment for product "${fabric.slug}".`);
    assert(
      applicationIdSet.has(assignment.primaryApplication),
      `Unknown primary application "${assignment.primaryApplication}" for product "${fabric.slug}".`,
    );
    assert(
      assignment.secondaryApplication === null || applicationIdSet.has(assignment.secondaryApplication),
      `Unknown secondary application "${assignment.secondaryApplication}" for product "${fabric.slug}".`,
    );
  }

  const extraPolishProducts = Object.keys(polishContent.products).filter((slug) => !productSlugSet.has(slug));
  const extraAssignments = Object.keys(productApplications.products).filter((slug) => !productSlugSet.has(slug));
  const extraFamilyAssets = Object.keys(familyAssets).filter((slug) => !familySlugSet.has(slug));
  const missingFamilyAssets = familySlugs.filter((slug) => !(slug in familyAssets));
  const mappingApplicationIds = new Set(productApplications.applications);

  assert(extraPolishProducts.length === 0, `Polish content contains unknown products: ${extraPolishProducts.join(', ')}`);
  assert(extraAssignments.length === 0, `Application mapping contains unknown products: ${extraAssignments.join(', ')}`);
  assert(extraFamilyAssets.length === 0, `Family assets contain unknown families: ${extraFamilyAssets.join(', ')}`);
  assert(missingFamilyAssets.length === 0, `Family assets are missing families: ${missingFamilyAssets.join(', ')}`);
  assert(
    applicationIds.every((id) => mappingApplicationIds.has(id)) &&
      productApplications.applications.every((id) => applicationIdSet.has(id)),
    'Application IDs differ between applications.ts and fabric-applications.json.',
  );
}

function csvCell(value: unknown): string {
  if (value === null || value === undefined) return '';
  const text = String(value);
  if (/[",\r\n]/.test(text)) {
    return `"${text.replaceAll('"', '""')}"`;
  }
  return text;
}

function makeCsv(headers: string[], rows: Array<Record<string, unknown>>): string {
  const lines = [
    headers.map(csvCell).join(','),
    ...rows.map((row) => headers.map((header) => csvCell(row[header])).join(',')),
  ];

  return `\uFEFF${lines.join('\r\n')}\r\n`;
}

function writeIfChanged(filename: string, content: string): 'updated' | 'unchanged' {
  const outputPath = path.join(OUTPUT_DIR, filename);
  if (existsSync(outputPath) && readFileSync(outputPath, 'utf8') === content) {
    return 'unchanged';
  }
  writeFileSync(outputPath, content, 'utf8');
  return 'updated';
}

const polishContent = readJson<PolishContentFile>('src/content/fabrics-pl.json');
const productApplications = readJson<ProductApplicationsFile>('src/content/fabric-applications.json');
const familyAssets = readJson<FamilyAssetsFile>('src/content/families-assets.json');

validateSources(polishContent, productApplications, familyAssets);
mkdirSync(OUTPUT_DIR, { recursive: true });

const sourceHash = calculateSourceHash();
const categoryById = new Map(FABRIC_CATEGORIES.map((category) => [category.id, category]));
const familyBySlug = new Map(FABRIC_FAMILIES.map((family) => [family.slug, family]));
const applicationById = new Map(APPLICATIONS.map((application) => [application.id, application]));

const publicProducts = FABRICS.map((fabric) => {
  const family = familyBySlug.get(fabric.subFamily)!;
  const category = fabric.categoryId ? categoryById.get(fabric.categoryId)! : null;
  const polish = polishContent.products[fabric.slug];
  const assignment = productApplications.products[fabric.slug];
  const primaryApplication = applicationById.get(assignment.primaryApplication)!;
  const secondaryApplication = assignment.secondaryApplication
    ? applicationById.get(assignment.secondaryApplication)!
    : null;

  const productPage = localizedPage({
    pl: localizedPath(`/fabrics/${fabric.subFamily}/${fabric.slug}`, 'pl'),
    en: localizedPath(`/fabrics/${fabric.subFamily}/${fabric.slug}`, 'en'),
  });
  const familyPage = localizedPage({
    pl: localizedPath(`/fabrics/${fabric.subFamily}`, 'pl'),
    en: localizedPath(`/fabrics/${fabric.subFamily}`, 'en'),
  });

  return {
    slug: fabric.slug,
    name: fabric.name,
    family: {
      slug: family.slug,
      name: family.name,
      descriptor: family.descriptor,
      page: familyPage,
    },
    category: category
      ? {
          id: category.id,
          slug: category.slug,
          name: category.name,
          sourceGroup: category.sourceGroup,
        }
      : null,
    technical: {
      weight: fabric.weight,
      weightGsm: fabric.weightGsm,
      composition: fabric.composition,
      weave: fabric.weave,
      weaveType: {
        id: fabric.weaveType,
        label: FABRIC_WEAVE_LABELS[fabric.weaveType],
      },
      fibers: fabric.fibers.map((id) => ({
        id,
        label: FABRIC_FIBER_LABELS[id],
      })),
      properties: fabric.properties.map((id) => ({
        id,
        label: FABRIC_PROPERTY_LABELS[id],
      })),
      norms: fabric.norms,
      colorsCount: fabric.colorsCount,
      parametersCount: fabric.parametersCount,
    },
    content: {
      pl: {
        descriptor: polish.descriptor,
        specification: polish.spec,
        description: polish.description,
      },
      en: {
        descriptor: fabric.titleDescriptor,
        specification: fabric.specLine,
        description: [] as string[],
      },
    },
    applications: {
      primary: {
        id: primaryApplication.id,
        name: primaryApplication.name,
        confidence: assignment.primaryConfidence,
      },
      secondary: secondaryApplication
        ? {
            id: secondaryApplication.id,
            name: secondaryApplication.name,
            confidence: assignment.secondaryConfidence,
          }
        : null,
    },
    assets: {
      heroImage: publicAsset(fabric.heroImage),
      dataSheets: fabric.dataSheets.map((assetPath) => publicAsset(assetPath)!),
      certificates: fabric.certificates.map((assetPath) => publicAsset(assetPath)!),
      sourceRecord: publicAsset(fabric.recordUrl),
    },
    page: productPage,
  };
});

const publicCategories = FABRIC_CATEGORIES.map((category) => ({
  id: category.id,
  slug: category.slug,
  name: category.name,
  sourceGroup: category.sourceGroup,
  productCount: FABRICS.filter((fabric) => fabric.categoryId === category.id).length,
  productSlugs: FABRICS.filter((fabric) => fabric.categoryId === category.id).map((fabric) => fabric.slug),
}));

const publicFamilies = FABRIC_FAMILIES.map((family) => {
  const products = FABRICS.filter((fabric) => fabric.subFamily === family.slug);
  const assets = familyAssets[family.slug];
  const familyPage = localizedPage({
    pl: localizedPath(`/fabrics/${family.slug}`, 'pl'),
    en: localizedPath(`/fabrics/${family.slug}`, 'en'),
  });

  const categories = [...new Set(products.map((product) => product.categoryId).filter(Boolean))].map((id) => {
    const category = categoryById.get(id)!;
    return { id, name: category.name };
  });

  const applicationStats = APPLICATIONS.map((application) => {
    const primaryCount = products.filter(
      (product) => productApplications.products[product.slug].primaryApplication === application.id,
    ).length;
    const secondaryCount = products.filter(
      (product) => productApplications.products[product.slug].secondaryApplication === application.id,
    ).length;
    return {
      id: application.id,
      name: application.name,
      primaryCount,
      secondaryCount,
      totalCount: primaryCount + secondaryCount,
    };
  }).filter((item) => item.totalCount > 0);

  return {
    slug: family.slug,
    name: family.name,
    descriptor: family.descriptor,
    page: familyPage,
    assets: {
      heroImage: assets.hero
        ? {
            ...publicAsset(assets.hero)!,
            width: assets.heroWidth ?? null,
            height: assets.heroHeight ?? null,
          }
        : null,
      dataSheet: publicAsset(assets.pdf),
    },
    productCount: products.length,
    productSlugs: products.map((product) => product.slug),
    categories,
    applications: applicationStats,
  };
});

const publicApplications = APPLICATIONS.map((application) => {
  const primaryProducts = FABRICS.filter(
    (fabric) => productApplications.products[fabric.slug].primaryApplication === application.id,
  ).map((fabric) => fabric.slug);
  const secondaryProducts = FABRICS.filter(
    (fabric) => productApplications.products[fabric.slug].secondaryApplication === application.id,
  ).map((fabric) => fabric.slug);
  const allProducts = [...new Set([...primaryProducts, ...secondaryProducts])];
  const page = localizedPage({
    pl: localizedPath(`/applications/${application.slug.pl}`, 'pl'),
    en: localizedPath(`/applications/${application.slug.en}`, 'en'),
  });

  return {
    id: application.id,
    slug: application.slug,
    name: application.name,
    short: application.short,
    badges: application.badges,
    image: publicAsset(application.image),
    page,
    productCounts: {
      primary: primaryProducts.length,
      secondary: secondaryProducts.length,
      totalUnique: allProducts.length,
    },
    products: {
      primary: primaryProducts,
      secondary: secondaryProducts,
      all: allProducts,
    },
    content: application.content ?? null,
  };
});

const fabricsJson = {
  schemaVersion: 1,
  sourceHash,
  baseUrl: BASE_URL,
  counts: {
    products: publicProducts.length,
    families: publicFamilies.length,
    categories: publicCategories.length,
    applications: publicApplications.length,
    uncategorizedProducts: FABRICS.filter((fabric) => !fabric.categoryId).length,
  },
  applicationMapping: {
    schemaVersion: productApplications.schemaVersion,
    productionReady: productApplications.productionReady,
  },
  categories: publicCategories,
  products: publicProducts,
};

const familiesJson = {
  schemaVersion: 1,
  sourceHash,
  baseUrl: BASE_URL,
  count: publicFamilies.length,
  families: publicFamilies,
};

const applicationsJson = {
  schemaVersion: 1,
  sourceHash,
  baseUrl: BASE_URL,
  count: publicApplications.length,
  applications: publicApplications,
};

const csvHeaders = [
  'slug',
  'name',
  'family',
  'family_slug',
  'category_id',
  'category_name_pl',
  'category_name_en',
  'weight',
  'weight_gsm',
  'composition',
  'weave',
  'weave_type',
  'fibers',
  'properties',
  'norms',
  'descriptor_pl',
  'descriptor_en',
  'specification_pl',
  'specification_en',
  'description_pl',
  'primary_application_id',
  'primary_application_pl',
  'primary_application_en',
  'primary_application_confidence',
  'secondary_application_id',
  'secondary_application_pl',
  'secondary_application_en',
  'secondary_application_confidence',
  'hero_image_url',
  'product_url_pl',
  'product_url_en',
  'family_url_pl',
  'family_url_en',
  'data_sheet_urls',
  'certificate_urls',
  'source_record_url',
  'colors_count',
  'parameters_count',
];

const csvRows = publicProducts.map((product) => ({
  slug: product.slug,
  name: product.name,
  family: product.family.name,
  family_slug: product.family.slug,
  category_id: product.category?.id ?? '',
  category_name_pl: product.category?.name.pl ?? '',
  category_name_en: product.category?.name.en ?? '',
  weight: product.technical.weight,
  weight_gsm: product.technical.weightGsm,
  composition: product.technical.composition,
  weave: product.technical.weave,
  weave_type: product.technical.weaveType.id,
  fibers: product.technical.fibers.map((fiber) => fiber.id).join('|'),
  properties: product.technical.properties.map((property) => property.id).join('|'),
  norms: product.technical.norms.join('|'),
  descriptor_pl: product.content.pl.descriptor,
  descriptor_en: product.content.en.descriptor,
  specification_pl: product.content.pl.specification,
  specification_en: product.content.en.specification,
  description_pl: product.content.pl.description.join(' || '),
  primary_application_id: product.applications.primary.id,
  primary_application_pl: product.applications.primary.name.pl,
  primary_application_en: product.applications.primary.name.en,
  primary_application_confidence: product.applications.primary.confidence,
  secondary_application_id: product.applications.secondary?.id ?? '',
  secondary_application_pl: product.applications.secondary?.name.pl ?? '',
  secondary_application_en: product.applications.secondary?.name.en ?? '',
  secondary_application_confidence: product.applications.secondary?.confidence ?? '',
  hero_image_url: product.assets.heroImage?.url ?? '',
  product_url_pl: product.page.url.pl,
  product_url_en: product.page.url.en,
  family_url_pl: product.family.page.url.pl,
  family_url_en: product.family.page.url.en,
  data_sheet_urls: product.assets.dataSheets.map((asset) => asset.url).join('|'),
  certificate_urls: product.assets.certificates.map((asset) => asset.url).join('|'),
  source_record_url: product.assets.sourceRecord?.url ?? '',
  colors_count: product.technical.colorsCount,
  parameters_count: product.technical.parametersCount,
}));

const outputs: Array<[string, string]> = [
  ['fabrics.json', `${JSON.stringify(fabricsJson, null, 2)}\n`],
  ['fabrics.csv', makeCsv(csvHeaders, csvRows)],
  ['fabric-families.json', `${JSON.stringify(familiesJson, null, 2)}\n`],
  ['applications.json', `${JSON.stringify(applicationsJson, null, 2)}\n`],
];

console.log('Public catalog export');
console.log(`Source hash: ${sourceHash}`);
console.log(`Products: ${publicProducts.length}`);
console.log(`Families: ${publicFamilies.length}`);
console.log(`Categories: ${publicCategories.length}`);
console.log(`Applications: ${publicApplications.length}`);

for (const [filename, content] of outputs) {
  const status = writeIfChanged(filename, content);
  console.log(`${status === 'updated' ? 'UPDATED' : 'UNCHANGED'} public/data/${filename}`);
}