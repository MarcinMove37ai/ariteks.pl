// src/app/[locale]/fabrics/[family]/[slug]/page.tsx
// KARTA PRODUKTU — jeden szablon dla 134 tkanin (trasa: rodzina/produkt,
// breadcrumb: Catalogue · Rodzina · Produkt; KROK 6 przebudowy 2026-07-11).
// Zrodla danych:
//  - src/content/fabrics.ts (slug, subFamily, normy kurowane, rodzina),
//  - public/.../fabric-complete-record.json (pelny rekord: parametry,
//    kolory, dokumenty, galerie) — czytany z dysku w czasie budowania (SSG).
// ZASADA: renderujemy WYLACZNIE sekcje, ktore maja dane — zero pustych.
// Obecnosc sekcji wg inwentaryzacji 134 rekordow (inventory_records_report):
//  zawsze: opis, parametry, karta PDF, hero, ikony funkcji, 5 piktogramow;
//  warunkowo: kolory (126/134), galeria aplikacyjna (88/134),
//  certyfikaty, probka tkaniny (3/134), partnerzy technologiczni,
//  grafika splotu (z category_row, nie z product_page).

import { promises as fs } from 'fs';
import path from 'path';
import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link, routing, type Locale } from '@/i18n/routing';
import RfqButton from '@/components/RfqButton';
import FabricGallery from '@/components/fabrics/FabricGallery';
import { getFabricApplicationAssignment } from '@/lib/fabricApplications';
import {
  FABRICS,
  getFabricBySlug,
  getFamilyBySlug,
  getFabricsBySubFamily,
} from '@/content/fabrics';
import PL_RAW from '@/content/fabrics-pl.json';
import COLOR_PATCH_RAW from '@/content/fabrics-colors-patch.json';

// Tabele kolorow odzyskane skryptem recover_colors.py dla produktow,
// ktorym scraper nie wypelnil colors_and_articles (8 szt.), mimo ze
// strona zrodlowa tabele ma.
const COLOR_PATCH = COLOR_PATCH_RAW as Record<string, ColorRow[]>;

// Tlumaczenia PL wygenerowane skryptem translate_catalog.py.
// Fallback: brak tlumaczenia => oryginal EN (strona nigdy sie nie psuje).
type PlData = {
  dictionary: Record<'params' | 'colors' | 'finishes' | 'care' | 'groups',
    Record<string, string>>;
  products: Record<string,
    { descriptor?: string; spec?: string; description?: string[] }>;
};
const PL = PL_RAW as PlData;

// ------------------------- typy pelnego rekordu ---------------------------

type ImgAsset = { public_url?: string; alt?: string; title?: string };
type TechParam = { name?: string; value?: string; standard?: string };
type TechDoc = {
  label?: string;
  title?: string;
  public_url?: string;
  document_kind?: string;
};
type ColorRow = {
  color?: string;
  code_or_pind?: string;
  finish?: string;
  article_number?: string;
};
type Swatch = { color_value?: string; label?: string };

type FabricRecord = {
  product_page?: {
    commercial_name?: string;
    display_name?: string;
    title_descriptor?: string;
    spec_line?: string;
    description_blocks?: string[];
    technical_parameters?: TechParam[];
    technical_documents?: TechDoc[];
    colors_and_articles?: ColorRow[];
    image_groups?: {
      hero_images?: ImgAsset[];
      application_images?: ImgAsset[];
      fabric_photos?: ImgAsset[];
      function_icons?: ImgAsset[];
      care_instructions?: ImgAsset[];
      technology_partners?: ImgAsset[];
    };
  };
  category_row?: {
    structure?: { name?: string; images?: ImgAsset[] };
    color_swatches?: Swatch[];
    group?: { documents?: TechDoc[] };
    row_documents?: TechDoc[];
  };
};

/** Scraper czesc tabel kolorow rozcial: wiersz A = kolor+kod, wiersz B =
 *  "- STANDART -" w polu koloru + numer artykulu (seria arneo-color...,
 *  screeny 2026-07-11). Sklejamy pary z powrotem w jeden logiczny wiersz.
 *  Wiersze poprawne przechodza nietkniete. */
const FINISH_MARKER = /^[-–\s]*STANDAR[TD][-–\s]*$/i;

/** Scraper policzyl elementy stopki strony (kontakt, copyright) i chipy
 *  specyfikacji jako swatche kolorow (check_colors_report, 2026-07-11).
 *  Odfiltrowujemy po etykiecie; swatche bez etykiety zostaja. */
const JUNK_SWATCH =
  /copyright|©|headquarters|phone|e-?mail|www\.|address|g\/m²|g\/m2/i;

function isRealSwatch(label?: string): boolean {
  const l = (label || '').trim();
  if (!l) return true;
  return !JUNK_SWATCH.test(l) && l.length <= 40;
}

function normalizeColors(rows: ColorRow[]): ColorRow[] {
  const out: ColorRow[] = [];
  for (const raw of rows) {
    const row = { ...raw };
    const color = (row.color || '').trim();
    const prev = out[out.length - 1];
    const prevIncomplete =
      prev !== undefined &&
      (!(prev.article_number || '').trim() ||
        !(prev.code_or_pind || '').trim());
    const isContinuation =
      prevIncomplete &&
      (FINISH_MARKER.test(color) ||
        (!color && (row.article_number || '').trim() !== ''));
    if (isContinuation && prev) {
      if (!(prev.finish || '').trim() && color) prev.finish = color;
      if ((row.code_or_pind || '').trim() && !(prev.code_or_pind || '').trim())
        prev.code_or_pind = row.code_or_pind;
      if ((row.article_number || '').trim()) {
        // White | — | PTO-10275 + wiersz B z artykulem:
        // stary "artykul" bez kodu to w istocie kod -> ratujemy go
        if (
          (prev.article_number || '').trim() &&
          !(prev.code_or_pind || '').trim()
        ) {
          prev.code_or_pind = prev.article_number;
        }
        prev.article_number = row.article_number;
      }
      continue;
    }
    out.push(row);
  }
  return out;
}

async function loadRecord(recordUrl: string): Promise<FabricRecord | null> {
  try {
    const p = path.join(process.cwd(), 'public', recordUrl.replace(/^\//, ''));
    const raw = await fs.readFile(p, 'utf-8');
    return JSON.parse(raw.replace(/^\uFEFF/, '')) as FabricRecord;
  } catch {
    return null;
  }
}

// ------------------------------ etykiety UI -------------------------------

const T = {
  home: { pl: 'Strona główna', en: 'Home' },
  catalogue: { pl: 'Katalog tkanin', en: 'Fabric catalogue' },
  breadcrumbLabel: {
    pl: 'Okruszki nawigacyjne',
    en: 'Breadcrumb navigation',
  },
  description: { pl: 'Opis', en: 'Description' },
  quickFacts: { pl: 'Specyfikacja', en: 'Specification' },
  weight: { pl: 'Gramatura', en: 'Weight' },
  composition: { pl: 'Skład', en: 'Composition' },
  weave: { pl: 'Splot', en: 'Weave' },
  family: { pl: 'Rodzina', en: 'Family' },
  documents: { pl: 'Dokumenty', en: 'Documents' },
  dataSheet: { pl: 'Karta techniczna (PDF)', en: 'Data sheet (PDF)' },

  certificates: { pl: 'Certyfikaty i raporty z badań', en: 'Certificates & test reports' },
  functions: { pl: 'Normy i funkcje', en: 'Standards & functions' },
  care: { pl: 'Konserwacja', en: 'Care instructions' },
  parameters: { pl: 'Parametry techniczne', en: 'Technical parameters' },
  colParam: { pl: 'Parametr', en: 'Parameter' },
  colValue: { pl: 'Wartość', en: 'Value' },
  colStandard: { pl: 'Metoda / norma', en: 'Method / standard' },
  colors: { pl: 'Kolory i numery artykułów', en: 'Colours & article numbers' },
  colColor: { pl: 'Kolor', en: 'Colour' },
  colCode: { pl: 'Kod / PIND', en: 'Code / PIND' },
  colFinish: { pl: 'Wykończenie', en: 'Finish' },
  colArticle: { pl: 'Nr artykułu', en: 'Article no.' },
  gallery: { pl: 'Zastosowania', en: 'Applications' },
  fabricPhoto: { pl: 'Próbka tkaniny', en: 'Fabric sample' },
  partners: { pl: 'Technologie partnerów', en: 'Partner technologies' },
  variants: { pl: 'Inne warianty rodziny', en: 'Other variants in this family' },
  openDoc: { pl: 'Otwórz', en: 'Open' },
} as const;
const BASE_URL = 'https://ariteks.pl';
// ------------------------------- SSG / SEO --------------------------------

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    FABRICS.map((f) => ({ locale, family: f.subFamily, slug: f.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    locale: string;
    family: string;
    slug: string;
  }>;
}): Promise<Metadata> {
  const { locale, family, slug } = await params;
  const loc = locale as Locale;

  const f = getFabricBySlug(slug);

  if (!f || f.subFamily !== family) {
    return {};
  }

  const plUrl = `${BASE_URL}/fabrics/${family}/${slug}`;
  const enUrl = `${BASE_URL}/en/fabrics/${family}/${slug}`;
  const canonical = loc === 'en' ? enUrl : plUrl;

  return {
    title: `${f.name} — ${f.specLine || f.titleDescriptor}`.slice(0, 70),
    description: `${f.titleDescriptor}. ${f.specLine}`.slice(0, 160),
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

// --------------------------------- strona ---------------------------------

export default async function FabricPage({
  params,
}: {
  params: Promise<{ locale: string; family: string; slug: string }>;
}) {
  const { locale, family, slug } = await params;
  const loc = locale as Locale;

  const f = getFabricBySlug(slug);
  if (!f) notFound();

  const applicationAssignment =
    getFabricApplicationAssignment(f.slug);
  const fam = getFamilyBySlug(family);
  if (!fam || f.subFamily !== family) notFound();

  setRequestLocale(locale);
  const cta = await getTranslations('home.cta');

  const rec = await loadRecord(f.recordUrl);
  const pp = rec?.product_page ?? {};
  const groups = pp.image_groups ?? {};

  const plProd = loc === 'pl' ? PL.products[f.slug] : undefined;
  const dict = (bucket: keyof PlData['dictionary'], s: string) =>
    (loc === 'pl' && (PL.dictionary[bucket]?.[s] || '').trim()) || s;

  const name = (pp.display_name || pp.commercial_name || f.name).trim();
  const descriptor =
    (plProd?.descriptor || '').trim() ||
    (pp.title_descriptor || f.titleDescriptor).trim();
  const specLine =
    (plProd?.spec || '').trim() || (pp.spec_line || f.specLine).trim();
  const descriptionEn = (pp.description_blocks ?? []).filter((b) => b.trim());
  const description =
    plProd?.description && plProd.description.length > 0
      ? plProd.description
      : descriptionEn;
  const parameters = (pp.technical_parameters ?? []).filter(
    (p) => (p.name || '').trim()
  );
  const docs = pp.technical_documents ?? [];
  const dataSheets = docs.filter(
    (d) => d.document_kind === 'data_sheet' && d.public_url
  );
  const certDocs = docs.filter(
    (d) => d.document_kind !== 'data_sheet' && d.public_url
  );

  const colorsFromRecord = (pp.colors_and_articles ?? []).filter(
    (c) => (c.color || c.article_number || '').trim()
  );
  const colors = normalizeColors(
    colorsFromRecord.length > 0
      ? colorsFromRecord
      : COLOR_PATCH[f.slug] ?? []
  );
  const swatches = (rec?.category_row?.color_swatches ?? []).filter(
    (s) => s.color_value && isRealSwatch(s.label)
  );
  // Rowna licznosc (126/126 wg check_colors) => swatch wchodzi do wiersza
  // tabeli jak w zrodle; osobny pasek kwadratow zostaje tylko fallbackiem.
  const paired = colors.length > 0 && swatches.length === colors.length;

  // Zrodlo ma rozne komplety kolumn (raz kod bez artykulu, raz odwrotnie).
  // Kolumna pusta we WSZYSTKICH wierszach nie renderuje sie — zadnych
  // slupkow myslnikow (compare_products, 2026-07-10).
  const cleanFinish = (s?: string) => (s || '').replace(/^-\s*|\s*-$/g, '').trim();
  const colHasData = {
    code: colors.some((c) => (c.code_or_pind || '').trim()),
    finish: colors.some((c) => cleanFinish(c.finish)),
    article: colors.some((c) => (c.article_number || '').trim()),
  };
  const appImages = (groups.application_images ?? []).filter(
    (i) => i.public_url
  );

  const fabricPhotos = (groups.fabric_photos ?? []).filter(
    (i) => i.public_url
  );

  const functionIcons = (groups.function_icons ?? []).filter(
    (i) => i.public_url
  );

  const careIcons = (groups.care_instructions ?? []).filter(
    (i) => i.public_url
  );
  const partnerLogos = (groups.technology_partners ?? []).filter(
    (i) => i.public_url
  );
  const structure = rec?.category_row?.structure;
  const structureImg = (structure?.images ?? []).find((i) => i.public_url);
  const galleryImages = [...appImages, ...fabricPhotos];

  const variants = getFabricsBySubFamily(family).filter(
    (x) => x.slug !== f.slug
  );

  const docLabel = (d: TechDoc) =>
  (d.label || d.title || '').replace(/^>+\s*/, '').trim() || T.openDoc[loc];

    const localeBaseUrl = loc === 'en' ? `${BASE_URL}/en` : BASE_URL;
    const catalogueUrl = `${localeBaseUrl}/fabrics`;
    const familyUrl = `${catalogueUrl}/${family}`;
    const productUrl = `${familyUrl}/${slug}`;

    const breadcrumbJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      '@id': `${productUrl}#breadcrumb`,
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
        {
          '@type': 'ListItem',
          position: 4,
          name,
          item: productUrl,
        },
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
                    href="/fabrics"
                    className="transition-colors hover:text-red-400"
                  >
                    {T.catalogue[loc]}
                  </Link>
                </li>

                <li aria-hidden="true" className="text-carbon-500">
                  ›
                </li>

                <li>
                  <Link
                    href={`/fabrics/${family}`}
                    className="transition-colors hover:text-red-400"
                  >
                    {fam.name}
                  </Link>
                </li>

                <li aria-hidden="true" className="text-carbon-500">
                  ›
                </li>

                <li
                  aria-current="page"
                  className="max-w-[260px] truncate text-carbon-300 sm:max-w-md"
                  title={name}
                >
                  {name}
                </li>
              </ol>
            </nav>

            <h1 className="mt-6 font-display text-display-xl font-bold text-white text-balance">
              {name}
            </h1>

            <p className="mt-4 text-lg leading-relaxed text-carbon-200 text-pretty">
              {descriptor}
            </p>

            <p className="mt-6 font-mono text-sm uppercase tracking-wider text-carbon-300">
              {specLine}
            </p>

            {f.norms.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2.5">
                {f.norms.map((n) => (
                  <span key={n} className="norm-badge norm-badge-dark">
                    {n}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="relative -mx-5 h-64 sm:-mx-8 sm:h-80 lg:mx-0 lg:h-full lg:min-h-[480px]">
            {f.heroImage ? (
              <Image
                src={f.heroImage}
                alt={name}
                fill
                priority
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
            ) : (
              /* czesc nowych linii (integracja 159) nie ma zdjec hero
                 w zrodle — panel ze splotem, spojnie z kaflami katalogu */
              <div className="mesh-dark flex h-full w-full items-center justify-center">
                <span className="font-mono text-sm uppercase tracking-[0.3em] text-carbon-400">
                  {f.weave}
                </span>
              </div>
            )}
            <div
              className="absolute inset-0 lg:bg-gradient-to-r lg:from-carbon-900/60 lg:via-transparent lg:to-transparent"
              aria-hidden="true"
            />
          </div>
        </div>
      </section>

      {/* ==================== OPIS + PANEL BOCZNY ==================== */}
      <section className="bg-surface">
        <div className="container-site grid gap-10 py-16 sm:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
          {/* Opis */}
          <div className="min-w-0">
            <h2 className="font-display text-display-md font-bold text-ink">
              {T.description[loc]}
            </h2>
            <div className="mt-6 space-y-4">
              {description.map((block, i) => (
                <p key={i} className="leading-relaxed text-ink-soft text-pretty">
                  {block}
                </p>
              ))}
            </div>
            {/* Graficzne ikony norm i funkcji produktu */}
            {functionIcons.length > 0 && (
              <div className="mt-10 border-t border-steel-line pt-6">
                <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-steel">
                  {T.functions[loc]}
                </p>

                <div className="mt-4 flex flex-wrap gap-4">
                  {functionIcons.map((icon, i) => {
                    const label = icon.alt || icon.title || '';

                    return (
                      <figure
                        key={`${icon.public_url}-${i}`}
                        className="w-28"
                      >
                        <div className="flex h-24 w-28 items-center justify-center rounded border border-steel-line bg-white p-2 shadow-card">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={icon.public_url!}
                            alt={label}
                            title={label}
                            loading="lazy"
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>

                        {label && (
                          <figcaption className="mt-2 text-center font-mono text-[10px] leading-snug text-steel">
                            {label}
                          </figcaption>
                        )}
                      </figure>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Piktogramy konserwacji — zawsze 5 */}
            {careIcons.length > 0 && (
              <div className="mt-10 border-t border-steel-line pt-6">
                <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-steel">
                  {T.care[loc]}
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {careIcons.map((icon, i) => (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      key={i}
                      src={icon.public_url}
                      alt={dict('care', icon.alt || icon.title || '')}
                      title={dict('care', icon.alt || icon.title || '')}
                      className="h-12 w-12 rounded border border-steel-line bg-white object-contain p-1"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Panel boczny: specyfikacja + dokumenty */}
          <aside className="min-w-0 space-y-6">
            <div className="rounded-lg border border-steel-line bg-paper p-6 shadow-card">
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-steel">
                {T.quickFacts[loc]}
              </p>
              <dl className="mt-4 space-y-3">
                {[
                  [T.weight[loc], f.weight],
                  [T.composition[loc], f.composition],
                ]
                  .filter(([, v]) => v)
                  .map(([k, v]) => (
                    <div
                      key={k}
                      className="flex items-baseline justify-between gap-4 border-b border-carbon-100 pb-2.5"
                    >
                      <dt className="text-sm text-steel">{k}</dt>
                      <dd className="text-right font-mono text-sm text-carbon-950">
                        {v}
                      </dd>
                    </div>
                  ))}

                {/* Splot: miniatura struktury w wierszu, spojnie z rytmem listy */}
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-sm text-steel">{T.weave[loc]}</dt>
                  <dd className="flex items-center justify-end gap-3 text-right font-mono text-sm text-carbon-950">
                    {structure?.name || f.weave}
                    {structureImg && (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={structureImg.public_url}
                        alt={structure?.name || f.weave}
                        className="h-10 w-10 shrink-0 rounded border border-steel-line bg-white object-contain p-0.5"
                      />
                    )}
                  </dd>
                </div>

              </dl>

              {/* Strona linii (z karta PDF linii) — nowa karta przegladarki;
                  nawigacja, nie dokument, wiec mieszka przy specyfikacji
                  (decyzja 2026-07-11) */}
              <Link
                href={`/fabrics/${family}`}
                target="_blank"
                className="mt-5 flex w-full items-center justify-center gap-2 rounded border border-carbon-300 bg-white px-4 py-3 text-sm font-medium text-carbon-900 transition-colors hover:border-red-600 hover:text-red-600"
              >
                {loc === 'pl'
                  ? `Zobacz kartę rodziny ${fam.name}`
                  : `Go to ${fam.name} family page`}
                <span aria-hidden>↗</span>
              </Link>
            </div>

            {/* Dokumenty: karta tylko gdy jest CO pokazac — czesc nowych
                linii (np. arflexmembrane) nie ma dokumentow u zrodla */}
            {dataSheets.length + certDocs.length > 0 && (
            <div className="rounded-lg border border-steel-line bg-paper p-6 shadow-card">
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-steel">
                {T.documents[loc]}
              </p>

              {dataSheets.map((d, i) => (
                <a
                  key={i}
                  href={d.public_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex w-full items-center justify-center rounded bg-carbon-950 px-4 py-3 text-sm font-medium text-paper transition-colors hover:bg-red-600"
                >
                  {T.dataSheet[loc]}
                </a>
              ))}


              {certDocs.length > 0 && (
                <>
                  <p className="mt-5 text-sm font-medium text-carbon-900">
                    {T.certificates[loc]}
                  </p>
                  <ul className="mt-3 space-y-2">
                    {certDocs.map((d, i) => (
                      <li key={i}>
                        <a
                          href={d.public_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-center justify-between gap-3 rounded border border-carbon-200 bg-white px-3.5 py-2.5 text-sm font-medium text-ink transition-colors hover:border-red-600 hover:text-red-600"
                        >
                          <span className="min-w-0 truncate">{docLabel(d)}</span>
                          <span className="inline-flex shrink-0 items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-steel transition-colors group-hover:text-red-600">
                            PDF
                            <span aria-hidden>↗</span>
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
            )}
          </aside>
        </div>
      </section>

      {/* ==================== PARAMETRY TECHNICZNE ==================== */}
      {parameters.length > 0 && (
        <section className="mesh-light border-y border-steel-line">
          <div className="container-site py-16 sm:py-20">
            <h2 className="flex items-baseline gap-3 font-display text-display-md font-bold text-ink">
              {T.parameters[loc]}
              <span className="font-mono text-sm font-normal text-steel">
                {parameters.length}
              </span>
            </h2>

            <div className="mt-8 overflow-x-auto rounded-lg bg-white shadow-card">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead>
                  <tr className="border-b border-carbon-100 bg-paper">
                    <th className="px-5 py-3 font-mono text-[11px] uppercase tracking-wider text-steel">
                      {T.colParam[loc]}
                    </th>
                    <th className="px-5 py-3 font-mono text-[11px] uppercase tracking-wider text-steel">
                      {T.colValue[loc]}
                    </th>
                    <th className="px-5 py-3 text-right font-mono text-[11px] uppercase tracking-wider text-steel">
                      {T.colStandard[loc]}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {parameters.map((p, i) => (
                    <tr
                      key={i}
                      className="border-b border-carbon-100 last:border-0"
                    >
                      <td className="px-5 py-3 text-ink">{dict('params', p.name ?? '')}</td>
                      <td className="px-5 py-3 text-ink-soft">{p.value}</td>
                      <td className="whitespace-nowrap px-5 py-3 text-right font-mono text-xs text-carbon-950">
                        {p.standard || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* ==================== KOLORY I NUMERY ARTYKUŁÓW ==================== */}
      {(colors.length > 0 || swatches.length > 0) && (
        <section className="bg-surface">
          <div className="container-site py-16 sm:py-20">
            <h2 className="font-display text-display-md font-bold text-ink">
              {T.colors[loc]}
            </h2>

            {swatches.length > 0 && !paired && (
              <div className="mt-6 flex flex-wrap gap-2.5">
                {swatches.map((s, i) => (
                  <span
                    key={i}
                    title={s.label || s.color_value}
                    className="h-9 w-9 rounded border border-steel-line shadow-card"
                    style={{ backgroundColor: s.color_value }}
                  />
                ))}
              </div>
            )}

            {colors.length > 0 && (
              <div className="mt-8 overflow-x-auto rounded-lg bg-white shadow-card">
                <table className="w-full min-w-[560px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-carbon-100 bg-paper">
                      {[
                        [T.colColor, true] as const,
                        [T.colCode, colHasData.code] as const,
                        [T.colFinish, colHasData.finish] as const,
                        [T.colArticle, colHasData.article] as const,
                      ]
                        .filter(([, show]) => show)
                        .map(([h]) => (
                          <th
                            key={h.pl}
                            className="px-5 py-3 font-mono text-[11px] uppercase tracking-wider text-steel"
                          >
                            {h[loc]}
                          </th>
                        ))}
                    </tr>
                  </thead>
                  <tbody>
                    {colors.map((c, i) => (
                      <tr
                        key={i}
                        className="border-b border-carbon-100 last:border-0"
                      >
                        <td className="px-5 py-3 font-medium text-ink">
                          <span className="flex items-center gap-2.5">
                            {paired && (
                              <span
                                className="h-5 w-5 shrink-0 rounded-sm border border-steel-line"
                                style={{
                                  backgroundColor: swatches[i]?.color_value,
                                }}
                                aria-hidden="true"
                              />
                            )}
                            {c.color ? dict('colors', c.color) : '—'}
                          </span>
                        </td>
                        {colHasData.code && (
                          <td className="px-5 py-3 font-mono text-xs text-ink-soft">
                            {c.code_or_pind || '—'}
                          </td>
                        )}
                        {colHasData.finish && (
                          <td className="px-5 py-3 text-ink-soft">
                            {(() => {
                              const fin = cleanFinish(c.finish);
                              return fin ? dict('finishes', fin) : '—';
                            })()}
                          </td>
                        )}
                        {colHasData.article && (
                          <td className="px-5 py-3 font-mono text-xs text-carbon-950">
                            {c.article_number || '—'}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ==================== GALERIA ZASTOSOWAŃ ==================== */}
      {galleryImages.length > 0 && (
        <section className="mesh-light border-y border-steel-line">
          <div className="container-site py-16 sm:py-20">
            <h2 className="font-display text-display-md font-bold text-ink">
              {T.gallery[loc]}
            </h2>
            <FabricGallery
              images={galleryImages.map((img) => ({
                src: img.public_url!,
                alt: img.alt || img.title || name,
              }))}
            />
          </div>
        </section>
      )}

      {/* ==================== TECHNOLOGIE PARTNERÓW ==================== */}
      {partnerLogos.length > 0 && (
        <section className="bg-surface">
          <div className="container-site py-12 sm:py-14">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-steel">
              {T.partners[loc]}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-6">
              {partnerLogos.map((logo, i) => (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  key={i}
                  src={logo.public_url}
                  alt={logo.alt || logo.title || ''}
                  title={logo.alt || logo.title || ''}
                  className="h-10 w-auto object-contain"
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ==================== WARIANTY RODZINY ==================== */}
      {variants.length > 0 && (
        <section className="bg-paper border-t border-steel-line">
          <div className="container-site py-16 sm:py-20">
            <h2 className="flex items-baseline gap-3 font-display text-display-md font-bold text-ink">
              {T.variants[loc]}
              <span className="font-mono text-sm font-normal text-steel">
                {fam.name} · {variants.length}
              </span>
            </h2>

            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {variants.map((v) => (
                <Link
                  key={v.slug}
                  href={`/fabrics/${family}/${v.slug}`}
                  className="group flex flex-col overflow-hidden rounded-lg border border-steel-line bg-surface shadow-card transition-shadow duration-300 hover:shadow-card-hover"
                >
                  <div className="relative h-28 overflow-hidden bg-carbon-900">
                    {v.heroImage && (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={v.heroImage}
                        alt={v.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                      />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-display text-base font-bold tracking-tight text-ink transition-colors group-hover:text-red-600">
                      {v.name}
                    </h3>
                    <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-steel">
                      {v.weight} · {v.composition}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

          </div>
        </section>
      )}

      {/* ==================== CTA / RFQ ==================== */}
      <section className="bg-paper">
        <div className="container-site pb-16 pt-4 sm:pb-20">
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
            <RfqButton
              applicationId={
                applicationAssignment?.primaryApplication
              }
              className="mt-10 inline-flex items-center rounded bg-red-500 px-8 py-4 text-sm font-semibold uppercase tracking-wide text-white transition-colors duration-200 hover:bg-red-600"
            >
              {cta('button')}
            </RfqButton>
          </div>
        </div>
      </section>
        </main>
  </>
);
}