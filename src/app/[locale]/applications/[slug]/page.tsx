// src/app/[locale]/applications/[slug]/page.tsx
// SZABLON STRONY BRANZOWEJ — jeden kod dla 9 branz z applications.ts.
// v2 po audycie: sekcja USP z naglowkiem i tytulami, nazwane sekcje rodzin i norm.
// Renderuje pelna wersje gdy branza ma `content`,
// a elegancki fallback (nazwa + opis + badge) gdy go jeszcze nie ma.

import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link, routing, type Locale } from '@/i18n/routing';
import RfqButton from '@/components/RfqButton';
import ApplicationProductSections from '@/components/applications/ApplicationProductSections';
import type { ApplicationId } from '@/content/fabric-application-overrides';
import type { FabricDef } from '@/content/fabrics';
import { getApplicationHighlights } from '@/lib/applicationHighlights';
import {
  getFabricApplicationAssignment,
  getPrimaryFabricsForApplication,
  getSecondaryFabricsForApplication,
} from '@/lib/fabricApplications';
import {
  APPLICATIONS,
  getApplicationBySlug,
} from '@/content/applications';
import { getApplicationMarketingContent } from '@/content/application-page-content';
const BASE_URL = 'https://ariteks.pl';

type RelationKind = 'primary' | 'secondary';

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

function relationConfidence(
  fabric: FabricDef,
  relation: RelationKind,
): number {
  const assignment =
    getFabricApplicationAssignment(fabric.slug);

  const confidence =
    relation === 'primary'
      ? assignment?.primaryConfidence
      : assignment?.secondaryConfidence;

  return confidence === null ? 101 : confidence ?? 0;
}

function sortApplicationFabrics(
  fabrics: FabricDef[],
  relation: RelationKind,
): FabricDef[] {
  return [...fabrics].sort((a, b) => {
    const confidenceDifference =
      relationConfidence(b, relation) -
      relationConfidence(a, relation);

    if (confidenceDifference !== 0) {
      return confidenceDifference;
    }

    const imageDifference =
      Number(Boolean(b.heroImage)) -
      Number(Boolean(a.heroImage));

    if (imageDifference !== 0) {
      return imageDifference;
    }

    const documentationDifference =
      b.dataSheets.length +
      b.certificates.length -
      (a.dataSheets.length + a.certificates.length);

    if (documentationDifference !== 0) {
      return documentationDifference;
    }

    const normsDifference =
      b.norms.length - a.norms.length;

    if (normsDifference !== 0) {
      return normsDifference;
    }

    return a.name.localeCompare(b.name, 'en');
  });
}
const T = {
  home: {
    pl: 'Strona główna',
    en: 'Home',
  },
  breadcrumbLabel: {
    pl: 'Okruszki nawigacyjne',
    en: 'Breadcrumb navigation',
  },
  products: {
    pl: 'Tkaniny dla tego zastosowania',
    en: 'Fabrics for this application',
  },
} as const;
// Statyczne generowanie: wszystkie branze x wszystkie jezyki
export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    APPLICATIONS.map((app) => ({ locale, slug: app.slug[locale] }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const loc = locale as Locale;

  const app = getApplicationBySlug(loc, slug);
  if (!app) return {};

  const plUrl = `${BASE_URL}/applications/${app.slug.pl}`;
  const enUrl = `${BASE_URL}/en/applications/${app.slug.en}`;
  const canonical = loc === 'en' ? enUrl : plUrl;

  return {
    title: app.name[loc],
    description: app.short[loc],
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

export default async function ApplicationPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const loc = locale as Locale;

  const app = getApplicationBySlug(loc, slug);
  if (!app) notFound();

  setRequestLocale(locale);

  const nav = await getTranslations('nav');
  const common = await getTranslations('common');
  const cta = await getTranslations('home.cta');

  const content =
    app.content ??
    getApplicationMarketingContent(
      app.id as ApplicationId,
    );
  const highlights = getApplicationHighlights(
    app.id as ApplicationId,
  );

  const primaryFabrics = sortApplicationFabrics(
    getPrimaryFabricsForApplication(app.id as ApplicationId),
    'primary',
  );

  const secondaryFabrics = sortApplicationFabrics(
    getSecondaryFabricsForApplication(app.id as ApplicationId),
    'secondary',
  );

  const seenFabricSlugs = new Set<string>();
  const applicationFabrics = [
    ...primaryFabrics,
    ...secondaryFabrics,
  ].filter((fabric) => {
    if (seenFabricSlugs.has(fabric.slug)) {
      return false;
    }

    seenFabricSlugs.add(fabric.slug);
    return true;
  });

const localeBaseUrl = loc === 'en' ? `${BASE_URL}/en` : BASE_URL;
const applicationsUrl = `${localeBaseUrl}/#industries`;
const applicationUrl =
  `${localeBaseUrl}/applications/${app.slug[loc]}`;

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  '@id': `${applicationUrl}#breadcrumb`,
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
      name: nav('applications'),
      item: applicationsUrl,
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: app.name[loc],
      item: applicationUrl,
    },
  ],
};

const itemListId = `${applicationUrl}#product-list`;
const applicationImage = absoluteUrl(app.image);
const pageDescription =
  content ? content.heroLead[loc] : app.short[loc];

const itemListJsonLd = {
  '@type': 'ItemList',
  '@id': itemListId,
  name: T.products[loc],
  numberOfItems: applicationFabrics.length,
  itemListElement: applicationFabrics.map((fabric, index) => {
    const productUrl =
      `${localeBaseUrl}/fabrics/${fabric.subFamily}/${fabric.slug}`;
    const productImage = absoluteUrl(fabric.heroImage);

    return {
      '@type': 'ListItem',
      position: index + 1,
      url: productUrl,
      item: {
        '@type': 'Product',
        '@id': `${productUrl}#product`,
        url: productUrl,
        name: fabric.name,
        category: fabric.family,
        material: fabric.composition,
        ...(productImage ? { image: productImage } : {}),
      },
    };
  }),
};

const collectionPageJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'CollectionPage',
      '@id': `${applicationUrl}#collection`,
      url: applicationUrl,
      name: app.name[loc],
      description: pageDescription,
      inLanguage: loc === 'pl' ? 'pl-PL' : 'en',
      breadcrumb: {
        '@id': `${applicationUrl}#breadcrumb`,
      },
      mainEntity: {
        '@id': itemListId,
      },
      about: {
        '@type': 'Thing',
        name: app.name[loc],
      },
      ...(applicationImage
        ? {
            primaryImageOfPage: {
              '@type': 'ImageObject',
              url: applicationImage,
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
        __html: JSON.stringify(breadcrumbJsonLd).replace(
          /</g,
          '\\u003c'
        ),
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
        <div className="container-site grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:py-0">
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
                    href="/#industries"
                    className="transition-colors hover:text-red-400"
                  >
                    {nav('applications')}
                  </Link>
                </li>

                <li aria-hidden="true" className="text-carbon-500">
                  ›
                </li>

                <li
                  aria-current="page"
                  className="max-w-[300px] truncate text-carbon-300 sm:max-w-md"
                  title={app.name[loc]}
                >
                  {app.name[loc]}
                </li>
              </ol>
            </nav>

            <h1 className="mt-6 font-display text-display-xl font-bold text-white text-balance">
              {content ? content.heroTitle[loc] : app.name[loc]}
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-carbon-200 text-pretty">
              {content ? content.heroLead[loc] : app.short[loc]}
            </p>

            {highlights.featured.length > 0 && (
              <div className="mt-10 flex flex-wrap gap-2.5">
                {highlights.featured.map((badge) => (
                  <span
                    key={badge}
                    className="norm-badge norm-badge-dark"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="relative -mx-5 h-64 sm:-mx-8 sm:h-80 lg:mx-0 lg:h-full lg:min-h-[520px]">
            <Image
              src={app.image}
              alt={app.name[loc]}
              fill
              priority
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
            <div
              className="absolute inset-0 lg:bg-gradient-to-r lg:from-carbon-900/60 lg:via-transparent lg:to-transparent"
              aria-hidden="true"
            />
          </div>
        </div>
      </section>

      {/* ==================== USP GRUPY TOWAROWEJ (tresc bogata) ==================== */}
      {content && content.usp.items.length > 0 && (
        <section className="bg-surface">
          <div className="container-site py-16 sm:py-20">
            <h2 className="font-display text-display-lg font-bold text-ink text-balance">
              {content.usp.heading[loc]}
            </h2>

            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {content.usp.items.map((item, i) => (
                <article key={i} className="border-t border-steel-line pt-5">
                  <span
                    className="font-mono text-sm font-medium text-red-600"
                    aria-hidden="true"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-2.5 text-lg font-semibold tracking-tight text-ink">
                    {item.title[loc]}
                  </h3>
                  <p className="mt-3 leading-relaxed text-ink-soft">
                    {item.text[loc]}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ==================== PRODUKTY APLIKACJI ==================== */}
      <ApplicationProductSections
        applicationId={app.id as ApplicationId}
        locale={loc}
      />

      {/* ==================== POZOSTALE DOWODY TECHNICZNE ==================== */}
      {highlights.remaining.length > 0 && (
        <section className="border-b border-steel-line bg-paper">
          <div className="container-site py-10 sm:py-12">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-steel">
              {loc === 'pl'
                ? 'Pozostałe technologie, normy i metody badań'
                : 'Additional technologies, standards and test methods'}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-2.5">
              {highlights.remaining.map((badge) => (
                <span key={badge} className="norm-badge">
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ==================== CTA ==================== */}
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
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <RfqButton
                applicationId={app.id as ApplicationId}
                className="inline-flex items-center rounded bg-red-500 px-8 py-4 text-sm font-semibold uppercase tracking-wide text-white transition-colors duration-200 hover:bg-red-600"
              >
                {cta('button')}
              </RfqButton>
              <Link
                href="/#industries"
                className="inline-flex items-center rounded border border-carbon-500 px-8 py-4 text-sm font-semibold uppercase tracking-wide text-white transition-colors duration-200 hover:border-red-400 hover:text-red-300"
              >
                {common('seeAll')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  </>
);
}