// src/app/[locale]/data/catalog/page.tsx
// Publiczna strona opisująca maszynowo czytelne eksporty katalogu Ariteks.

import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { APPLICATIONS } from '@/content/applications';
import {
  FABRIC_CATEGORIES,
  FABRIC_FAMILIES,
  FABRICS,
} from '@/content/fabrics';
import { Link, type Locale } from '@/i18n/routing';

const BASE_URL = 'https://ariteks.pl';

const COPY = {
  pl: {
    title: 'Katalog danych tkanin technicznych',
    description:
      'Publiczne eksporty katalogu Ariteks: produkty, rodziny tkanin, kategorie, zastosowania, parametry techniczne, normy i dokumenty.',
    eyebrow: 'Dane katalogowe',
    heading: 'Katalog Ariteks w formacie JSON i CSV',
    lead:
      'Maszynowo czytelny zbiór danych o tkaninach technicznych Ariteks, przygotowany dla integracji, analiz, wyszukiwarek i systemów AI.',
    stats: {
      products: 'Produkty',
      families: 'Rodziny',
      categories: 'Kategorie',
      applications: 'Zastosowania',
    },
    downloadsHeading: 'Pliki do pobrania',
    downloadsLead:
      'Pliki są generowane automatycznie z tego samego źródła danych, z którego powstają strony katalogowe.',
    format: 'Format',
    download: 'Otwórz plik',
    notesHeading: 'Jak interpretować dane',
    notes: [
      'fabrics.json jest głównym, kompletnym eksportem produktów i ich relacji.',
      'Adresy page.url.pl oraz page.url.en wskazują kanoniczne strony produktów.',
      'Pola assets zawierają publiczne obrazy, karty danych, certyfikaty i rekordy źródłowe.',
      'Ceny nie są publikowane — dobór tkaniny i oferta wymagają zapytania technicznego.',
    ],
    browseCatalog: 'Przejdź do katalogu tkanin',
    certificates: 'Certyfikaty i normy',
    home: 'Strona główna',
    current: 'Katalog danych',
  },
  en: {
    title: 'Technical fabric data catalog',
    description:
      'Public Ariteks catalog exports covering products, fabric families, categories, applications, technical parameters, standards and documents.',
    eyebrow: 'Catalog data',
    heading: 'The Ariteks catalog in JSON and CSV',
    lead:
      'A machine-readable dataset describing Ariteks technical fabrics, prepared for integrations, analysis, search engines and AI systems.',
    stats: {
      products: 'Products',
      families: 'Families',
      categories: 'Categories',
      applications: 'Applications',
    },
    downloadsHeading: 'Download files',
    downloadsLead:
      'The files are generated automatically from the same source data used to build the public catalog pages.',
    format: 'Format',
    download: 'Open file',
    notesHeading: 'How to interpret the data',
    notes: [
      'fabrics.json is the primary complete export of products and their relationships.',
      'The page.url.pl and page.url.en fields contain canonical product page addresses.',
      'The assets fields contain public images, data sheets, certificates and source records.',
      'Prices are not published — fabric selection and quotations require a technical enquiry.',
    ],
    browseCatalog: 'Browse the fabric catalog',
    certificates: 'Certificates and standards',
    home: 'Home',
    current: 'Data catalog',
  },
} as const;

const DOWNLOADS = [
  {
    href: '/data/fabrics.json',
    format: 'JSON',
    content: {
      pl: '159 produktów wraz z parametrami, normami, treścią PL/EN, zastosowaniami, assetami i adresami kanonicznymi.',
      en: '159 products with technical parameters, standards, PL/EN content, applications, assets and canonical URLs.',
    },
  },
  {
    href: '/data/fabrics.csv',
    format: 'CSV',
    content: {
      pl: 'Płaski eksport produktów do arkuszy, analiz, systemów PIM, CRM i narzędzi integracyjnych.',
      en: 'A flat product export for spreadsheets, analysis, PIM and CRM systems, and integration tools.',
    },
  },
  {
    href: '/data/fabric-families.json',
    format: 'JSON',
    content: {
      pl: '50 rodzin tkanin z opisami, produktami, kategoriami, zastosowaniami i dokumentami rodzinnymi.',
      en: '50 fabric families with descriptions, products, categories, applications and family documents.',
    },
  },
  {
    href: '/data/applications.json',
    format: 'JSON',
    content: {
      pl: '15 obszarów zastosowań wraz z powiązanymi produktami, treścią branżową i normami.',
      en: '15 application areas with related products, industry content and standards.',
    },
  },
] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const loc = locale as Locale;
  const copy = COPY[loc];

  const plUrl = `${BASE_URL}/data/catalog`;
  const enUrl = `${BASE_URL}/en/data/catalog`;
  const canonical = loc === 'en' ? enUrl : plUrl;

  return {
    title: copy.title,
    description: copy.description,
    alternates: {
      canonical,
      languages: {
        pl: plUrl,
        en: enUrl,
        'x-default': plUrl,
      },
    },
    openGraph: {
      type: 'website',
      url: canonical,
      siteName: 'Ariteks',
      locale: loc === 'pl' ? 'pl_PL' : 'en_GB',
      alternateLocale: loc === 'pl' ? ['en_GB'] : ['pl_PL'],
      title: copy.title,
      description: copy.description,
    },
    twitter: {
      card: 'summary',
      title: copy.title,
      description: copy.description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function DataCatalogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const loc = locale as Locale;
  const copy = COPY[loc];
  const localeBaseUrl = loc === 'en' ? `${BASE_URL}/en` : BASE_URL;
  const pageUrl = `${localeBaseUrl}/data/catalog`;

  const stats = [
    { value: FABRICS.length, label: copy.stats.products },
    { value: FABRIC_FAMILIES.length, label: copy.stats.families },
    { value: FABRIC_CATEGORIES.length, label: copy.stats.categories },
    { value: APPLICATIONS.length, label: copy.stats.applications },
  ];

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `${pageUrl}#breadcrumb`,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: copy.home,
        item: localeBaseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: copy.current,
        item: pageUrl,
      },
    ],
  };

  const datasetJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    '@id': `${pageUrl}#dataset`,
    name: copy.title,
    description: copy.description,
    url: pageUrl,
    mainEntityOfPage: pageUrl,
    inLanguage: ['pl-PL', 'en'],
    isAccessibleForFree: true,
    version: '1',
    creator: {
      '@type': 'Organization',
      '@id': `${BASE_URL}/#organization`,
      name: 'Ariteks',
      url: BASE_URL,
    },
    publisher: {
      '@id': `${BASE_URL}/#organization`,
    },
    includedInDataCatalog: {
      '@type': 'DataCatalog',
      name: 'Ariteks Technical Fabric Catalog',
      url: pageUrl,
    },
    keywords: [
      'technical fabrics',
      'protective textiles',
      'fabric catalog',
      'flame-retardant fabrics',
      'high-visibility fabrics',
      'industrial textiles',
    ],
    distribution: DOWNLOADS.map((item) => ({
      '@type': 'DataDownload',
      name: item.href.split('/').at(-1),
      encodingFormat: item.format === 'CSV' ? 'text/csv' : 'application/json',
      contentUrl: `${BASE_URL}${item.href}`,
    })),
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
          __html: JSON.stringify(datasetJsonLd).replace(/</g, '\\u003c'),
        }}
      />

      <main>
        <section className="mesh-dark">
          <div className="container-site py-20 sm:py-24">
            <p className="eyebrow eyebrow-dark">{copy.eyebrow}</p>
            <h1 className="mt-6 max-w-4xl font-display text-display-xl font-bold text-white text-balance">
              {copy.heading}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-carbon-200 text-pretty">
              {copy.lead}
            </p>

            <dl className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-lg border border-carbon-700 bg-carbon-900/60 px-6 py-5"
                >
                  <dd className="font-display text-4xl font-bold text-white">
                    {stat.value}
                  </dd>
                  <dt className="mt-2 font-mono text-xs uppercase tracking-[0.16em] text-carbon-400">
                    {stat.label}
                  </dt>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="bg-surface">
          <div className="container-site py-20 sm:py-24">
            <h2 className="font-display text-display-lg font-bold text-ink">
              {copy.downloadsHeading}
            </h2>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-ink-soft">
              {copy.downloadsLead}
            </p>

            <div className="mt-10 overflow-hidden rounded-lg border border-steel-line bg-white shadow-card">
              {DOWNLOADS.map((item, index) => (
                <article
                  key={item.href}
                  className={`grid gap-5 p-6 sm:grid-cols-[minmax(0,1fr)_8rem_auto] sm:items-center ${
                    index > 0 ? 'border-t border-steel-line' : ''
                  }`}
                >
                  <div>
                    <h3 className="font-mono text-sm font-medium text-ink">
                      {item.href}
                    </h3>
                    <p className="mt-2 leading-relaxed text-ink-soft">
                      {item.content[loc]}
                    </p>
                  </div>

                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-steel">
                      {copy.format}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-ink">
                      {item.format}
                    </p>
                  </div>

                  <a
                    href={item.href}
                    className="inline-flex w-fit items-center rounded bg-red-500 px-5 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-red-600"
                  >
                    {copy.download}
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mesh-light border-y border-steel-line">
          <div className="container-site grid gap-10 py-20 sm:py-24 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <h2 className="font-display text-display-lg font-bold text-ink">
              {copy.notesHeading}
            </h2>

            <div>
              <ul className="space-y-4 text-lg leading-relaxed text-ink-soft">
                {copy.notes.map((note) => (
                  <li key={note} className="border-l-2 border-red-500 pl-5">
                    {note}
                  </li>
                ))}
              </ul>

              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/fabrics"
                  className="inline-flex items-center rounded bg-ink px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-carbon-700"
                >
                  {copy.browseCatalog}
                </Link>
                <Link
                  href="/certificates"
                  className="inline-flex items-center rounded border border-steel-line bg-white px-6 py-3 text-sm font-semibold text-ink transition-colors duration-200 hover:border-red-400 hover:text-red-600"
                >
                  {copy.certificates}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
