// src/app/[locale]/about/page.tsx
// O ARITEKS: hero -> historia -> dwa zaklady (z grafikami) -> zaplecze R&D
// -> Turcja-Europa (narracja przeniesiona ze strony glownej) -> certyfikaty -> CTA.

import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link, type Locale } from '@/i18n/routing';
import RfqButton from '@/components/RfqButton';

const CERTS = [
  'ISO 9001',
  'ISO 14001',
  'ISO 45001',
  'OEKO-TEX Standard 100',
  'RCS',
  'OCS',
  'BCI',
] as const;
const BASE_URL = 'https://ariteks.pl';

const T = {
  home: {
    pl: 'Strona główna',
    en: 'Home',
  },
  about: {
    pl: 'O Ariteks',
    en: 'About Ariteks',
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const loc = locale as Locale;
  const t = await getTranslations({ locale, namespace: 'about' });

  const plUrl = `${BASE_URL}/about`;
  const enUrl = `${BASE_URL}/en/about`;
  const canonical = loc === 'en' ? enUrl : plUrl;
  const title = t('meta.title');
  const description = t('hero.lead');

  return {
    title,
    description,
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
      locale: loc === 'pl' ? 'pl_PL' : 'en_US',
      alternateLocale: loc === 'pl' ? ['en_US'] : ['pl_PL'],
      title,
      description,
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const loc = locale as Locale;
  const t = await getTranslations('about');

  const localeBaseUrl = loc === 'en' ? `${BASE_URL}/en` : BASE_URL;
  const pageUrl = `${localeBaseUrl}/about`;
  const description = t('hero.lead');

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `${pageUrl}#breadcrumb`,
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
        name: T.about[loc],
        item: pageUrl,
      },
    ],
  };

  const aboutPageJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${BASE_URL}/#organization`,
        name: 'Ariteks',
        url: BASE_URL,
      },
      {
        '@type': 'WebSite',
        '@id': `${BASE_URL}/#website`,
        name: 'Ariteks',
        url: BASE_URL,
        publisher: {
          '@id': `${BASE_URL}/#organization`,
        },
        inLanguage: ['pl-PL', 'en'],
      },
      {
        '@type': 'AboutPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: t('meta.title'),
        description,
        inLanguage: loc === 'pl' ? 'pl-PL' : 'en',
        isPartOf: {
          '@id': `${BASE_URL}/#website`,
        },
        about: {
          '@id': `${BASE_URL}/#organization`,
        },
        mainEntity: {
          '@id': `${BASE_URL}/#organization`,
        },
        breadcrumb: {
          '@id': `${pageUrl}#breadcrumb`,
        },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: `${BASE_URL}/images/factory/istanbul.png`,
        },
      },
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
          __html: JSON.stringify(aboutPageJsonLd).replace(
            /</g,
            '\\u003c'
          ),
        }}
      />

      <main>
      {/* ==================== HERO ==================== */}
      <section className="mesh-dark">
        <div className="container-site py-20 sm:py-24">
          <p className="eyebrow eyebrow-dark">
            {t('hero.eyebrow')}
          </p>
          <h1 className="mt-6 max-w-4xl font-display text-display-xl font-bold text-white text-balance">
            {t('hero.title')}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-carbon-200 text-pretty">
            {t('hero.lead')}
          </p>
        </div>
      </section>

      {/* ==================== HISTORIA ==================== */}
      <section className="bg-surface">
        <div className="container-site grid gap-10 py-20 sm:py-24 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <h2 className="font-display text-display-lg font-bold text-ink text-balance">
            {t('story.heading')}
          </h2>
          <div className="space-y-6 text-lg leading-relaxed text-ink-soft">
            <p>{t('story.p1')}</p>
            <p>{t('story.p2')}</p>
          </div>
        </div>
      </section>

      {/* ==================== DWA ZAKLADY ==================== */}
      <section className="mesh-light border-y border-steel-line">
        <div className="container-site py-20 sm:py-24">
          <h2 className="font-display text-display-lg font-bold text-ink">
            {t('facilities.heading')}
          </h2>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {(['istanbul', 'corlu'] as const).map((plant) => (
              <article
                key={plant}
                className="overflow-hidden rounded-lg border border-steel-line bg-surface shadow-card"
              >
                <div className="relative h-56 bg-carbon-900 sm:h-64">
                  <Image
                    src={`/images/factory/${plant}.png`}
                    alt={t(`facilities.${plant}.imageAlt`)}
                    fill
                    sizes="(min-width: 1024px) 45vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-7">
                  <h3 className="text-xl font-semibold tracking-tight text-ink">
                    {t(`facilities.${plant}.title`)}
                  </h3>
                  <p className="mt-3 leading-relaxed text-ink-soft">
                    {t(`facilities.${plant}.text`)}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== ZAPLECZE R&D ==================== */}
      <section className="bg-surface">
        <div className="container-site py-20 sm:py-24">
          <h2 className="font-display text-display-lg font-bold text-ink">
            {t('rnd.heading')}
          </h2>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-ink-soft text-pretty">
            {t('rnd.lead')}
          </p>
          <p className="mt-6 max-w-3xl font-mono text-sm leading-loose text-steel">
            {t('rnd.labs')}
          </p>
        </div>
      </section>

      {/* ==================== TURCJA-EUROPA ==================== */}
      <section className="mesh-dark">
        <div className="container-site py-20 sm:py-24">
          <h2 className="font-display text-display-lg font-bold text-white text-balance">
            {t('europe.heading')}
          </h2>

          <div className="mt-12 grid gap-10 sm:grid-cols-3 sm:gap-8">
            {(['customs', 'standards', 'origin'] as const).map((key) => (
              <article key={key} className="border-t-2 border-red-500 pt-6">
                <h3 className="text-lg font-semibold tracking-tight text-white">
                  {t(`europe.items.${key}.title`)}
                </h3>
                <p className="mt-3 leading-relaxed text-carbon-200">
                  {t(`europe.items.${key}.text`)}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CERTYFIKATY ==================== */}
      <section className="bg-surface">
        <div className="container-site py-20 sm:py-24">
          <h2 className="font-display text-display-lg font-bold text-ink">
            {t('certs.heading')}
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-ink-soft">{t('certs.lead')}</p>
          <div className="mt-8 flex flex-wrap gap-2.5">
            {CERTS.map((cert) => (
              <span key={cert} className="norm-badge">
                {cert}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CTA ==================== */}
      <section className="bg-paper">
        <div className="container-site py-20 sm:py-24">
          <div className="mesh-dark overflow-hidden rounded-lg px-6 py-16 text-center shadow-card sm:px-16 sm:py-20">
            <span
              className="mx-auto block h-1 w-14 rounded-full bg-red-500"
              aria-hidden="true"
            />
            <h2 className="mx-auto mt-8 max-w-2xl font-display text-display-lg font-bold text-white text-balance">
              {t('cta.title')}
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-carbon-200">
              {t('cta.lead')}
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/#industries"
                className="inline-flex items-center rounded bg-red-500 px-8 py-4 text-sm font-semibold uppercase tracking-wide text-white transition-colors duration-200 hover:bg-red-600"
              >
                {t('cta.primary')}
              </Link>
              <RfqButton

                className="inline-flex items-center rounded border border-carbon-500 px-8 py-4 text-sm font-semibold uppercase tracking-wide text-white transition-colors duration-200 hover:border-red-400 hover:text-red-300"
              >
                {t('cta.secondary')}
              </RfqButton>
            </div>
          </div>
        </div>
      </section>
      </main>
    </>
  );
}