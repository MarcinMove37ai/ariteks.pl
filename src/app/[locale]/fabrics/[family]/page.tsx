// src/app/[locale]/fabrics/[family]/page.tsx
// PODSTRONA RODZINY (podlinii) — 50 stron x 2 jezyki (KROK 5).
// 1 rodzina = 1 URL = 1 karta PDF = 1 grafika hero (z KROKU 3).
// Dane: FABRIC_FAMILIES + produkty po subFamily (fabrics.ts),
// hero/pdf: src/content/families-assets.json.
// Tresc dwujezyczna: nazwa = brand (wspolna), deskryptor Record<Locale>.

import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link, routing, type Locale } from '@/i18n/routing';
import RfqButton from '@/components/RfqButton';
import {
  FABRIC_PROPERTY_LABELS,
  getFamilyBySlug,
  getFamilySlugs,
  getFabricsBySubFamily,
  type FabricProperty,
} from '@/content/fabrics';
import ASSETS_RAW from '@/content/families-assets.json';

const ASSETS = ASSETS_RAW as Record<
  string,
  { hero?: string; heroWidth?: number; heroHeight?: number; pdf?: string }
>;
const BASE_URL = 'https://ariteks.pl';

const FAMILY_SEO_TYPE = {
  pl: 'tkaniny techniczne',
  en: 'technical fabrics',
} as const;

const FAMILY_TITLE_SUFFIX_LENGTH = ' — Ariteks'.length;
const FAMILY_TITLE_MAX_FINAL_LENGTH = 65;
const FAMILY_TITLE_MAX_LOCAL_LENGTH =
  FAMILY_TITLE_MAX_FINAL_LENGTH - FAMILY_TITLE_SUFFIX_LENGTH;

function buildFamilyMetadataTitle(
  familyName: string,
  descriptor: string,
  locale: Locale,
): string {
  const candidates = [
    `${familyName} — ${descriptor}`,
    `${familyName} — ${FAMILY_SEO_TYPE[locale]}`,
    familyName,
  ];

  return (
    candidates.find(
      (candidate) =>
        candidate.length <= FAMILY_TITLE_MAX_LOCAL_LENGTH,
    ) ?? familyName
  );
}

function absoluteUrl(value?: string | null): string | null {
  const clean = (value || '').trim();

  if (!clean) {
    return null;
  }

  if (/^https?:\/\//i.test(clean)) {
    return clean;
  }

  return `${BASE_URL}${clean.startsWith('/') ? clean : `/${clean}`}`;
}
const T = {
  home: { pl: 'Strona główna', en: 'Home' },
  catalogue: { pl: 'Katalog tkanin', en: 'Fabric catalogue' },
  breadcrumbLabel: {
    pl: 'Okruszki nawigacyjne',
    en: 'Breadcrumb navigation',
  },
  variants: { pl: 'Warianty w rodzinie', en: 'Variants in this family' },
  variantsCount: { pl: 'wariantów', en: 'variants' },
  norms: { pl: 'Normy w rodzinie', en: 'Family standards' },
  properties: { pl: 'Właściwości', en: 'Properties' },
  lineSheet: { pl: 'Karta rodziny (PDF)', en: 'Family data sheet (PDF)' },
  weightRange: { pl: 'Gramatury', en: 'Weight range' },
} as const;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getFamilySlugs().map((family) => ({ locale, family }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; family: string }>;
}): Promise<Metadata> {
  const { locale, family } = await params;
  const fam = getFamilyBySlug(family);

  if (!fam) return {};

  const loc = locale as Locale;
  const count = getFabricsBySubFamily(family).length;

  const plUrl = `${BASE_URL}/fabrics/${family}`;
  const enUrl = `${BASE_URL}/en/fabrics/${family}`;
  const canonical = loc === 'en' ? enUrl : plUrl;

  return {
    title: buildFamilyMetadataTitle(
      fam.name,
      fam.descriptor[loc],
      loc,
    ),
    description:
      loc === 'pl'
        ? `${fam.name}: ${fam.descriptor.pl}. ${count} wariantów tkanin w linii.`
        : `${fam.name}: ${fam.descriptor.en}. ${count} fabric variants in the line.`,
    alternates: {
      canonical,
      languages: {
        pl: plUrl,
        en: enUrl,
        'x-default': plUrl,
      },
    },
  };
}

export default async function FamilyPage({
  params,
}: {
  params: Promise<{ locale: string; family: string }>;
}) {
  const { locale, family } = await params;
  const fam = getFamilyBySlug(family);
  if (!fam) notFound();

  setRequestLocale(locale);
  const loc = locale as Locale;
  const cta = await getTranslations('home.cta');

  const fabrics = getFabricsBySubFamily(family);
  const assets = ASSETS[family] ?? {};

  // agregaty linii — tylko z danych czlonkow (zero pustych sekcji)
  const norms = [...new Set(fabrics.flatMap((f) => f.norms))];
  const props = [
    ...new Set(fabrics.flatMap((f) => f.properties)),
  ] as FabricProperty[];
  const weights = fabrics
    .map((f) => f.weightGsm)
    .filter((w): w is number => w !== null);
  const wMin = weights.length ? Math.min(...weights) : null;
const wMax = weights.length ? Math.max(...weights) : null;

const localeBaseUrl = loc === 'en' ? `${BASE_URL}/en` : BASE_URL;
const catalogueUrl = `${localeBaseUrl}/fabrics`;
const familyUrl = `${catalogueUrl}/${family}`;

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  '@id': `${familyUrl}#breadcrumb`,
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: T.home[loc],
      item: localeBaseUrl,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: T.catalogue[loc],
      item: catalogueUrl,
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: fam.name,
      item: familyUrl,
    },
  ],
};

const familyDescription =
  loc === 'pl'
    ? `${fam.name}: ${fam.descriptor.pl}. ${fabrics.length} wariantów tkanin w linii.`
    : `${fam.name}: ${fam.descriptor.en}. ${fabrics.length} fabric variants in the line.`;

const itemListId = `${familyUrl}#product-list`;

const itemListJsonLd = {
  '@type': 'ItemList',
  '@id': itemListId,
  name: T.variants[loc],
  numberOfItems: fabrics.length,
  itemListOrder: 'https://schema.org/ItemListOrderAscending',
  itemListElement: fabrics.map((fabric, index) => {
    const productUrl = `${familyUrl}/${fabric.slug}`;
    const image = absoluteUrl(fabric.heroImage);

    return {
      '@type': 'ListItem',
      position: index + 1,
      name: fabric.name,
      url: productUrl,
      item: {
        '@type': 'WebPage',
        '@id': productUrl,
        url: productUrl,
        name: fabric.name,
        about: {
          '@id': `${productUrl}#product`,
        },
        ...(image
          ? {
              primaryImageOfPage: {
                '@type': 'ImageObject',
                url: image,
              },
            }
          : {}),
      },
    };
  }),
};

const collectionPageJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'CollectionPage',
      '@id': `${familyUrl}#collection`,
      url: familyUrl,
      name: fam.name,
      description: familyDescription,
      inLanguage: loc === 'pl' ? 'pl-PL' : 'en',
      breadcrumb: {
        '@id': `${familyUrl}#breadcrumb`,
      },
      mainEntity: {
        '@id': itemListId,
      },
      ...(assets.hero
        ? {
            primaryImageOfPage: {
              '@type': 'ImageObject',
              url: absoluteUrl(assets.hero),
            },
          }
        : {}),
    },
    itemListJsonLd,
  ],
};

return (
  <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, '\\u003c'),
      }}
    />

    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(collectionPageJsonLd).replace(
          /</g,
          '\\u003c'
        ),
      }}
    />

    <main>
      {/* ==================== HERO ==================== */}
      <section className="mesh-dark relative overflow-hidden">
        <div className="container-site grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-0">
          <div className="lg:py-24">
            <nav
              aria-label={T.breadcrumbLabel[loc]}
              className="eyebrow eyebrow-dark"
            >
              <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <li>
                  <Link
                    href="/"
                    className="transition-colors hover:text-red-400"
                  >
                    {T.home[loc]}
                  </Link>
                </li>

                <li aria-hidden="true" className="text-carbon-500">
                  ›
                </li>

                <li>
                  <Link
                    href="/fabrics"
                    className="transition-colors hover:text-red-400"
                  >
                    {T.catalogue[loc]}
                  </Link>
                </li>

                <li aria-hidden="true" className="text-carbon-500">
                  ›
                </li>

                <li
                  aria-current="page"
                  className="max-w-[320px] truncate text-carbon-300 sm:max-w-md"
                  title={fam.name}
                >
                  {fam.name}
                </li>
              </ol>
            </nav>

            <h1 className="mt-6 font-display text-display-xl font-bold text-white text-balance">
              {fam.name}
            </h1>

            <p className="mt-5 max-w-xl text-lg leading-relaxed text-carbon-200 text-pretty">
              {fam.descriptor[loc]}
            </p>

            {/* pas liczb linii */}
            <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-5">
              <div className="border-l-2 border-red-500 pl-4">
                <dt className="font-mono text-3xl font-medium text-white">
                  {fabrics.length}
                </dt>
                <dd className="mt-1 font-mono text-[11px] uppercase tracking-wider text-carbon-300">
                  {T.variantsCount[loc]}
                </dd>
              </div>
              {wMin !== null && wMax !== null && (
                <div className="border-l-2 border-red-500 pl-4">
                  <dt className="font-mono text-3xl font-medium text-white">
                    {wMin === wMax ? wMin : `${wMin}–${wMax}`}
                  </dt>
                  <dd className="mt-1 font-mono text-[11px] uppercase tracking-wider text-carbon-300">
                    {T.weightRange[loc]} g/m²
                  </dd>
                </div>
              )}
            </dl>

            {norms.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2.5">
                {norms.map((n) => (
                  <span key={n} className="norm-badge norm-badge-dark">
                    {n}
                  </span>
                ))}
              </div>
            )}

            {assets.pdf && (
              <a
                href={assets.pdf}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-10 inline-flex items-center rounded bg-red-500 px-7 py-3.5 text-sm font-semibold uppercase tracking-wide text-white transition-colors duration-200 hover:bg-red-600"
              >
                {T.lineSheet[loc]}
              </a>
            )}
          </div>

          {/* grafika linii z PDF (KROK 3, stopka odcieta) */}
          {assets.hero && (
            <div className="relative -mx-5 sm:-mx-8 lg:mx-0 lg:py-10">
              <Image
                src={assets.hero}
                alt={fam.name}
                width={assets.heroWidth ?? 1191}
                height={assets.heroHeight ?? 1481}
                priority
                sizes="(min-width: 1024px) 42vw, 100vw"
                className="mx-auto max-h-[560px] w-auto rounded-lg shadow-card lg:max-h-[620px]"
              />
            </div>
          )}
        </div>
      </section>

      {/* ==================== WARIANTY ==================== */}
      <section className="mesh-light border-t border-steel-line">
        <div className="container-site py-16 sm:py-20">
          <h2 className="flex items-baseline gap-3 font-display text-display-md font-bold text-ink">
            {T.variants[loc]}
            <span className="font-mono text-sm font-normal text-steel">
              {fabrics.length}
            </span>
          </h2>

          {/* wlasciwosci linii — chipy informacyjne */}
          {props.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {props.map((p) => (
                <span
                  key={p}
                  className="rounded-sm border border-carbon-200 bg-surface px-2.5 py-1 font-mono text-xs uppercase tracking-wider text-carbon-700"
                >
                  {FABRIC_PROPERTY_LABELS[p][loc]}
                </span>
              ))}
            </div>
          )}

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {fabrics.map((f) => (
              <Link
                key={f.slug}
                href={`/fabrics/${family}/${f.slug}`}
                className="group flex flex-col overflow-hidden rounded-lg border border-steel-line bg-surface shadow-card transition-shadow duration-300 hover:shadow-card-hover"
              >
                <div className="relative h-40 overflow-hidden bg-carbon-900">
                  {f.heroImage && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={f.heroImage}
                      alt={f.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                    />
                  )}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display text-lg font-bold tracking-tight text-ink transition-colors group-hover:text-red-600">
                    {f.name}
                  </h3>
                  <p className="mt-1.5 font-mono text-xs uppercase tracking-wider text-steel">
                    {f.weight} · {f.composition}
                  </p>
                  {f.norms.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {f.norms.slice(0, 3).map((n) => (
                        <span key={n} className="norm-badge">
                          {n}
                        </span>
                      ))}
                      {f.norms.length > 3 && (
                        <span className="font-mono text-xs text-steel">
                          +{f.norms.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CTA / RFQ ==================== */}
      <section className="bg-paper">
        <div className="container-site py-16 sm:py-20">
          <div className="mesh-dark overflow-hidden rounded-lg px-6 py-14 text-center shadow-card sm:px-16 sm:py-16">
            <span
              className="mx-auto block h-1 w-14 rounded-full bg-red-500"
              aria-hidden="true"
            />
            <h2 className="mx-auto mt-8 max-w-2xl font-display text-display-lg font-bold text-white text-balance">
              {cta('title')}
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-carbon-200">
              {cta('lead')}
            </p>
            <RfqButton className="mt-10 inline-flex items-center rounded bg-red-500 px-8 py-4 text-sm font-semibold uppercase tracking-wide text-white transition-colors duration-200 hover:bg-red-600">
              {cta('button')}
            </RfqButton>
          </div>
        </div>
      </section>
    </main>
  </>
);
}