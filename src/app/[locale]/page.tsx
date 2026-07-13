// src/app/[locale]/page.tsx
// STRONA GLOWNA — v15: CTA jako wpuszczony ciemny panel na jasnym tle
// (rytm zamkniecia: partnerzy/biel -> panel -> stopka).

import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link, type Locale } from '@/i18n/routing';
import RfqButton from '@/components/RfqButton';
import IndustryGrid from '@/components/home/IndustryGrid';
import { PARTNERS } from '@/content/partners';

const QUALIFICATION_KEYS = [
  'testing',
  'system',
  'norms',
  'repeatability',
  'logistics',
  'support',
] as const;

const BASE_URL = 'https://ariteks.pl';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const plUrl = `${BASE_URL}/`;
  const enUrl = `${BASE_URL}/en`;
  const canonical = locale === 'en' ? enUrl : plUrl;

  return {
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

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('home');
  const loc = locale as Locale;

  return (
    <main>
      {/* ==================== 1 · HERO ==================== */}
      <section className="mesh-dark relative overflow-hidden">
        <div className="container-site grid items-center gap-12 py-8 sm:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:py-0">
          <div className="lg:pt-10 lg:pb-28">
            <p className="eyebrow eyebrow-dark">{t('hero.eyebrow')}</p>

            <h1 className="mt-6 font-display text-display-xl font-bold text-white text-balance">
              {t('hero.title')}
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-carbon-200 text-pretty">
              {t('hero.lead')}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/#industries"
                className="inline-flex items-center rounded bg-red-500 px-6 py-3.5 text-sm font-semibold uppercase tracking-wide text-white transition-colors duration-200 hover:bg-red-600"
              >
                {t('hero.ctaPrimary')}
              </Link>
              <RfqButton

                className="inline-flex items-center rounded border border-carbon-500 px-6 py-3.5 text-sm font-semibold uppercase tracking-wide text-white transition-colors duration-200 hover:border-red-400 hover:text-red-300"
              >
                {t('hero.ctaSecondary')}
              </RfqButton>
            </div>

            <div className="mt-14 flex flex-wrap gap-2.5">
              {PARTNERS.map((partner) => (
                <span
                  key={partner.id}
                  className="norm-badge norm-badge-dark"
                >
                  {partner.name}
                </span>
              ))}
            </div>
          </div>

          <div className="relative -mx-5 h-72 sm:-mx-8 sm:h-96 lg:mx-0 lg:h-full lg:min-h-[640px]">
            <Image
              src="/images/hero/hero-fabric-macro.png"
              alt={t('hero.imageAlt')}
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

      {/* ==================== 2 · PASEK LICZB ==================== */}
      <section className="border-b border-steel-line bg-surface">
        <div className="container-site grid grid-cols-2 gap-x-6 gap-y-8 py-10 sm:py-12 lg:grid-cols-4">
          {(['experience', 'area', 'labs', 'rd'] as const).map((key) => (
            <div key={key}>
              <p className="font-mono text-3xl font-medium tracking-tight text-ink sm:text-4xl">
                {t(`stats.items.${key}.value`)}
              </p>
              <p className="mt-1.5 text-sm text-steel">
                {t(`stats.items.${key}.label`)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== 3 · KWALIFIKACJA DOSTAWCY (kotwica #why) ==================== */}
      <section id="why" className="scroll-mt-10 bg-paper">
        <div className="container-site py-20 sm:py-24">
          <h2 className="max-w-4xl font-display text-display-lg font-bold text-ink text-balance">
            {t('qualification.heading')}
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-ink-soft text-pretty">
            {t('qualification.lead')}
          </p>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {QUALIFICATION_KEYS.map((key, i) => (
              <article
                key={key}
                className="relative overflow-hidden rounded-lg border border-steel-line bg-surface p-7 pt-8 shadow-card"
              >
                <span
                  className="pointer-events-none absolute -top-2 right-5 select-none font-mono text-7xl font-medium leading-none tracking-tighter text-carbon-100"
                  aria-hidden="true"
                >
                  {String(i + 1).padStart(2, '0')}
                </span>

                <h3 className="relative pr-14 text-lg font-semibold leading-snug tracking-tight text-ink">
                  {t(`qualification.items.${key}.title`)}
                </h3>
                <p className="relative mt-3 leading-relaxed text-ink-soft">
                  {t(`qualification.items.${key}.text`)}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== 4 · BRANZE (kotwica #industries) ==================== */}
      <section id="industries" className="mesh-light scroll-mt-8 border-y border-steel-line">
        <div className="container-site py-20 sm:py-24">
          <h2 className="font-display text-display-lg font-bold text-ink">
            {t('industries.heading')}
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-ink-soft">
            {t('industries.lead')}
          </p>

          <div className="mt-12">
            <IndustryGrid locale={loc} />
          </div>
        </div>
      </section>

      {/* ==================== 5 · TECHNOLOGIE (kotwica #technologies) ==================== */}
      <section id="technologies" className="mesh-dark scroll-mt-8">
        <div className="container-site py-20 sm:py-24">
          <p className="eyebrow eyebrow-dark">{t('technologies.eyebrow')}</p>
          <h2 className="mt-4 font-display text-display-lg font-bold text-white">
            {t('technologies.heading')}
          </h2>

          <div className="mt-12 grid gap-10 sm:grid-cols-2 sm:gap-x-12 lg:grid-cols-3 lg:gap-x-10">
            {(['arbo', 'antiviral', 'emk', 'fluocotton', 'chromic', 'solar'] as const).map((key) => (
              <article key={key} className="border-t-2 border-red-500 pt-6">
                <h3 className="text-lg font-semibold tracking-tight text-white">
                  {t(`technologies.items.${key}.title`)}
                </h3>
                <p className="mt-3 leading-relaxed text-carbon-200">
                  {t(`technologies.items.${key}.text`)}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== 6 · LICENCJE I PARTNERZY (kotwica #partners) ==================== */}
      <section id="partners" className="scroll-mt-8 bg-surface">
        <div className="container-site py-20 sm:py-24">
          <h2 className="font-display text-display-lg font-bold text-ink">
            {t('partners.heading')}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-ink-soft text-pretty">
            {t('partners.line')}
          </p>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {PARTNERS.map((partner) => (
              <article
                key={partner.id}
                className="rounded-lg border border-steel-line bg-surface p-6 shadow-card"
              >
                <h3 className="font-display text-2xl font-bold tracking-tight text-ink">
                  {partner.name}
                </h3>
                <p className="mt-1 font-mono text-xs uppercase tracking-wider text-steel">
                  {partner.origin[loc]}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                  {partner.blurb[loc]}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== 7 · CTA / RFQ — panel zamykajacy ==================== */}
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
            <RfqButton

              className="mt-10 inline-flex items-center rounded bg-red-500 px-8 py-4 text-sm font-semibold uppercase tracking-wide text-white transition-colors duration-200 hover:bg-red-600"
            >
              {t('cta.button')}
            </RfqButton>
          </div>
        </div>
      </section>
    </main>
  );
}