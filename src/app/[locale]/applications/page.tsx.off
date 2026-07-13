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
import {
  APPLICATIONS,
  getApplicationBySlug,
} from '@/content/applications';

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
  const app = getApplicationBySlug(locale as Locale, slug);
  if (!app) return {};
  return {
    title: app.name[locale as Locale],
    description: app.short[locale as Locale],
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

  const content = app.content;

  return (
    <main>
      {/* ==================== HERO ==================== */}
      <section className="mesh-dark relative overflow-hidden">
        <div className="container-site grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:py-0">
          <div className="lg:py-24">
            <p className="eyebrow eyebrow-dark">
              {nav('applications')} · {app.name[loc]}
            </p>

            <h1 className="mt-6 font-display text-display-xl font-bold text-white text-balance">
              {content ? content.heroTitle[loc] : app.name[loc]}
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-carbon-200 text-pretty">
              {content ? content.heroLead[loc] : app.short[loc]}
            </p>

            {app.badges.length > 0 && (
              <div className="mt-10 flex flex-wrap gap-2.5">
                {app.badges.map((badge) => (
                  <span key={badge} className="norm-badge norm-badge-dark">
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

      {/* ==================== RODZINY TKANIN (tresc bogata) ==================== */}
      {content && content.families.length > 0 && (
        <section className="bg-paper border-y border-steel-line">
          <div className="container-site py-16 sm:py-20">
            <h2 className="font-display text-display-lg font-bold text-ink text-balance">
              {content.familiesHeading[loc]}
            </h2>

            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {content.families.map((family) => (
                <article
                  key={family.name}
                  className="rounded-lg border border-steel-line bg-surface p-6 shadow-card"
                >
                  <h3 className="font-display text-2xl font-bold tracking-tight text-ink">
                    {family.name}
                  </h3>
                  <p className="mt-2 font-mono text-xs uppercase tracking-wider text-steel">
                    {family.spec}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-ink-soft">
                    {family.desc[loc]}
                  </p>
                  {family.badges && family.badges.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {family.badges.map((badge) => (
                        <span key={badge} className="norm-badge">
                          {badge}
                        </span>
                      ))}
                    </div>
                  )}
                </article>
              ))}
            </div>

            {/* Pas norm badawczych tej branzy */}
            {content.norms.length > 0 && (
              <div className="mt-12 border-t border-steel-line pt-8">
                <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-steel">
                  {content.normsHeading[loc]}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-2.5">
                  {content.norms.map((norm) => (
                    <span key={norm} className="norm-badge">
                      {norm}
                    </span>
                  ))}
                </div>
              </div>
            )}
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

                className="inline-flex items-center rounded bg-red-500 px-8 py-4 text-sm font-semibold uppercase tracking-wide text-white transition-colors duration-200 hover:bg-red-600"
              >
                {cta('button')}
              </RfqButton>
              <Link
                href="/applications"
                className="inline-flex items-center rounded border border-carbon-500 px-8 py-4 text-sm font-semibold uppercase tracking-wide text-white transition-colors duration-200 hover:border-red-400 hover:text-red-300"
              >
                {common('seeAll')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}