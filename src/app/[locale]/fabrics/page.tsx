// src/app/[locale]/fabrics/page.tsx
// KATALOG TKANIN — strona indeksowa /fabrics.
// Hero w rytmie strony glownej (mesh-dark) + pas liczb + FabricExplorer
// (filtry i siatka, client). Dane: src/content/fabrics.ts (SSG, oba jezyki).

import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { routing, type Locale } from '@/i18n/routing';
import FabricExplorer from '@/components/fabrics/FabricExplorer';
import { FABRICS, FABRIC_FAMILIES } from '@/content/fabrics';
import STATS_RAW from '@/content/catalog-stats.json';

// Pelna liczba standardow (normy + metody badawcze, dedupe cytowan) —
// generowana skryptem count_standards.py ze 134 rekordow. Fallback:
// unikatowe normy kanonu z fabrics.ts (gdy plik jeszcze niewypelniony).
const CATALOG_STATS = STATS_RAW as { standardsCovered: number | null };

const PAGE = {
  eyebrow: { pl: 'Ariteks · Katalog', en: 'Ariteks · Catalogue' },
  title: {
    pl: 'Katalog tkanin technicznych',
    en: 'Technical fabrics catalogue',
  },
  lead: {
    pl: 'Pełna oferta tkanin specjalnego przeznaczenia — ostrzegawcze hi-vis, trudnopalne, antystatyczne, aramidowe, mundurowe i medyczne. Filtruj po właściwościach, normach, składzie i gramaturze, aby znaleźć tkaninę dopasowaną do wymagań Twojego wyrobu.',
    en: 'The complete range of special-purpose fabrics — hi-vis, flame-retardant, antistatic, aramid, uniform and medical. Filter by properties, standards, composition and weight to find the fabric that matches your product requirements.',
  },
  stats: {
    fabrics: { pl: 'tkanin w katalogu', en: 'fabrics in the catalogue' },
    families: { pl: 'rodzin produktowych', en: 'product families' },
    norms: { pl: 'norm i standardów', en: 'standards covered' },
    docs: { pl: 'kart i certyfikatów PDF', en: 'data sheets & certificates' },
  },
} as const;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: PAGE.title[locale],
    description:
      locale === 'pl'
        ? `Katalog ${FABRICS.length} tkanin technicznych Ariteks: hi-vis, trudnopalne, antystatyczne, aramidowe. Filtrowanie po właściwościach, normach EN i gramaturze.`
        : `Catalogue of ${FABRICS.length} Ariteks technical fabrics: hi-vis, flame-retardant, antistatic, aramid. Filter by properties, EN standards and weight.`,
  };
}

export default async function FabricsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;

  const docsCount = FABRICS.reduce(
    (n, f) => n + f.dataSheets.length + f.certificates.length,
    0
  );
  const normsCount =
    CATALOG_STATS.standardsCovered ??
    new Set(FABRICS.flatMap((f) => f.norms)).size;

  const stats: Array<[string, string]> = [
    [String(FABRICS.length), PAGE.stats.fabrics[loc]],
    [String(FABRIC_FAMILIES.length), PAGE.stats.families[loc]],
    [String(normsCount), PAGE.stats.norms[loc]],
    [String(docsCount), PAGE.stats.docs[loc]],
  ];

  return (
    <main>
      {/* ==================== HERO ==================== */}
      <section className="mesh-dark">
        <div className="container-site py-16 sm:py-20">
          <p className="eyebrow eyebrow-dark">{PAGE.eyebrow[loc]}</p>

          <h1 className="mt-6 max-w-4xl font-display text-display-xl font-bold text-white text-balance">
            {PAGE.title[loc]}
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-carbon-200 text-pretty">
            {PAGE.lead[loc]}
          </p>

          {/* Pas liczb */}
          <dl className="mt-12 grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-4">
            {stats.map(([value, label]) => (
              <div key={label} className="border-l-2 border-red-500 pl-4">
                <dt className="font-mono text-3xl font-medium tracking-tight text-white sm:text-4xl">
                  {value}
                </dt>
                <dd className="mt-1 font-mono text-[11px] uppercase tracking-wider text-carbon-300">
                  {label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ==================== EKSPLORATOR ==================== */}
      <section className="mesh-light border-t border-steel-line">
        <div className="container-site py-12 sm:py-16">
          <FabricExplorer locale={loc} />
        </div>
      </section>
    </main>
  );
}