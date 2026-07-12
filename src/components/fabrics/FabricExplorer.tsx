// src/components/fabrics/FabricExplorer.tsx
// Eksplorator katalogu tkanin (client) — filtry + siatka kafli.
// Zrodlo danych: src/content/fabrics.ts (134 produkty / 34 kategorie).
//
// v4 — mechanika mobile:
//  - DESKTOP (lg+): panel filtrow nad siatka, wszystko widoczne (jak v3),
//  - MOBILE (<lg): na gorze tylko szukajka + pasek "Filtry (n) | X/134";
//    filtry otwieraja sie w pelnoekranowym panelu (portal do body, wzorem
//    MobileNav), sekcje zwijane (wzorem CertArchive), na dole przyklejony
//    przycisk "Pokaz X tkanin" z licznikiem na zywo.
// Stan filtrow wspolny dla obu ukladow. Wszystkie facety data-driven.

'use client';

import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowRight, Search, SlidersHorizontal, X } from 'lucide-react';
import { Link, type Locale } from '@/i18n/routing';
import {
  FABRICS,
  FABRIC_CATEGORIES,
  FABRIC_FAMILIES,
  FABRIC_PROPERTY_LABELS,
  FABRIC_FIBER_LABELS,
  FABRIC_WEAVE_LABELS,
  getCategoryById,
  getFamilyBySlug,
  type FabricDef,
  type FabricProperty,
  type FabricFiber,
  type FabricWeaveType,
} from '@/content/fabrics';
import PL_RAW from '@/content/fabrics-pl.json';

// Tlumaczenia PL — do szukajki wchodza krotkie pola per produkt
// (descriptor + spec). Szukanie jest UNIWERSALNE: niezaleznie od jezyka
// strony przeszukujemy PL i EN jednoczesnie.
const PL_PRODUCTS = (PL_RAW as {
  products: Record<string, { descriptor?: string; spec?: string }>;
}).products;

// Etykiety interfejsu — wzorzec CERT_UI z certificates.ts
const UI = {
  searchPlaceholder: {
    pl: 'Szukaj: nazwa, skład, norma, zastosowanie…',
    en: 'Search: name, composition, standard, use…',
  },
  family: { pl: 'Rodzina', en: 'Family' },
  allCategories: { pl: 'Wszystkie kategorie', en: 'All categories' },
  category: { pl: 'Kategoria', en: 'Category' },
  allFamilies: { pl: 'Wszystkie rodziny', en: 'All families' },
  properties: { pl: 'Właściwości', en: 'Properties' },
  norms: { pl: 'Normy', en: 'Standards' },
  fibers: { pl: 'Włókna', en: 'Fibres' },
  weaves: { pl: 'Splot', en: 'Weave' },
  filters: { pl: 'Filtry', en: 'Filters' },
  showResults: { pl: 'Pokaż', en: 'Show' },
  clear: { pl: 'Wyczyść filtry', en: 'Clear filters' },
  clearQuery: { pl: 'Wyczyść szukanie', en: 'Clear search' },
  close: { pl: 'Zamknij', en: 'Close' },
  activeFilters: { pl: 'Aktywne filtry', en: 'Active filters' },
  activeWord: { pl: 'Aktywne', en: 'Active' },
  results: { pl: 'tkanin', en: 'fabrics' },
  noResults: {
    pl: 'Brak tkanin spełniających wybrane kryteria.',
    en: 'No fabrics match the selected criteria.',
  },
} as const;

const PROPERTY_ORDER: FabricProperty[] = [
  'hi-vis',
  'fr',
  'inherent-fr',
  'antistatic',
  'arc',
  'chemical',
  'molten-metal',
  'emi',
  'cut-resistant',
  'antibacterial',
  'antiviral',
  'waterproof',
  'water-repellent',
  'breathable',
  'stretch',
  'uv-protection',
  'wash-100',
];

// ---------------------------------------------------------------------------
// Szukajka: normalizacja + tolerancja literowek
// ---------------------------------------------------------------------------

/** Sklada znaki diakrytyczne i sprowadza do lowercase ("prań" -> "pran"). */
function fold(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ł/g, 'l');
}

/** Odleglosc Levenshteina z progiem 1 (wczesne wyjscie). */
function withinOneEdit(a: string, b: string): boolean {
  const la = a.length;
  const lb = b.length;
  if (Math.abs(la - lb) > 1) return false;
  let prev = new Array<number>(lb + 1);
  let curr = new Array<number>(lb + 1);
  for (let j = 0; j <= lb; j++) prev[j] = j;
  for (let i = 1; i <= la; i++) {
    curr[0] = i;
    let rowMin = curr[0];
    for (let j = 1; j <= lb; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
      if (curr[j] < rowMin) rowMin = curr[j];
    }
    if (rowMin > 1) return false;
    [prev, curr] = [curr, prev];
  }
  return prev[lb] <= 1;
}

/** Slowo pasuje do tokenu: podciag albo literowka (dla slow >= 4 znakow).
 *  Tolerancja literowek NIE dotyczy liczb — kod normy (11612) musi pasowac
 *  dokladnie, inaczej 11612 lapalby 11611. */
function wordMatches(word: string, tokens: readonly string[]): boolean {
  // Slowa <=2 znaki (kody: fr, co, en) wymagaja DOKLADNEGO tokenu —
  // dopasowanie podciagiem lapaloby szum ('fr' w 'from').
  if (word.length <= 2) {
    return tokens.includes(word);
  }
  const fuzzyOk = word.length >= 4 && !/^\d+$/.test(word);
  for (const t of tokens) {
    if (t.includes(word)) return true;
    if (fuzzyOk && withinOneEdit(word, t)) return true;
  }
  return false;
}

/** Pelny tekst przeszukiwalny tkaniny — oba jezyki, zeby szukajka wybaczala. */
function buildHaystack(f: FabricDef): string[] {
  const cat = getCategoryById(f.categoryId);
  const pl = PL_PRODUCTS[f.slug];
  const parts = [
    f.name,
    // slug — nazwy bywaja segmentowane inaczej niz slug ('Ar3 Iplik' vs
    // 'ar3iplik-...'); bez sluga zapytania w formie sluga nie trafiaja
    f.slug,
    pl?.descriptor ?? '',
    pl?.spec ?? '',
    f.family,
    f.composition,
    f.specLine,
    f.weave,
    f.weight,
    f.titleDescriptor,
    ...f.norms,
    ...f.properties.flatMap((p) => [
      FABRIC_PROPERTY_LABELS[p].pl,
      FABRIC_PROPERTY_LABELS[p].en,
    ]),
    ...f.fibers.flatMap((fb) => [
      FABRIC_FIBER_LABELS[fb].pl,
      FABRIC_FIBER_LABELS[fb].en,
    ]),
    FABRIC_WEAVE_LABELS[f.weaveType].pl,
    FABRIC_WEAVE_LABELS[f.weaveType].en,
  ];
  if (cat) parts.push(cat.name.pl, cat.name.en, cat.sourceGroup);
  return fold(parts.join(' ')).split(/[^a-z0-9]+/).filter(Boolean);
}

// ---------------------------------------------------------------------------

function matches(
  f: FabricDef,
  tokens: readonly string[],
  queryWords: readonly string[],
  categoryId: string,
  family: string,
  props: ReadonlySet<FabricProperty>,
  norms: ReadonlySet<string>,
  fibers: ReadonlySet<FabricFiber>,
  weaves: ReadonlySet<FabricWeaveType>
): boolean {
  if (categoryId && f.categoryId !== categoryId) return false;
  if (family && f.subFamily !== family) return false;
  for (const p of props) {
    if (!f.properties.includes(p)) return false;
  }
  for (const n of norms) {
    if (!f.norms.includes(n)) return false;
  }
  for (const fb of fibers) {
    if (!f.fibers.includes(fb)) return false;
  }
  for (const w of weaves) {
    if (f.weaveType !== w) return false;
  }
  for (const w of queryWords) {
    if (!wordMatches(w, tokens)) return false;
  }
  return true;
}

/** Sekcja facetu — AKORDEON (jedna grupa naraz, desktop i mobile; stan
 *  trzyma rodzic). Zwinieta sekcja pokazuje wybrane wartosci po prawej
 *  ("Aktywne: ..."), wiec osobny panel aktywnych filtrow jest zbedny.
 *  Semantyki nie trzeba tlumaczyc: kazde zaznaczenie zaweza wynik, a opcje
 *  o liczniku 0 znikaja z list — pustej kombinacji nie da sie zbudowac. */
/** Jeden symbol strzalki dla selectow (tlo) i przyciskow facetow (inline) */
function ChevronIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

const SELECT_CLASS =
  'w-full appearance-none rounded border border-carbon-200 bg-white ' +
  'bg-[right_0.9rem_center] bg-no-repeat px-3 py-2.5 pr-10 text-sm ' +
  'text-ink outline-none transition-colors focus:border-carbon-900';
const SELECT_ARROW = {
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' " +
    "width='14' height='14' viewBox='0 0 24 24' fill='none' " +
    "stroke='%2352525b' stroke-width='2' stroke-linecap='round' " +
    "stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
} as const;

function FacetSection({
  title,
  count,
  collapsible,
  open = true,
  onToggle,
  activeWord,
  activeLabels = [],
  children,
}: {
  title: string;
  count: number;
  collapsible: boolean;
  open?: boolean;
  onToggle?: () => void;
  activeWord?: string;
  activeLabels?: string[];
  children: React.ReactNode;
}) {
  const heading = (
    <>
      {title}
      {count > 0 && <span className="ml-2 text-red-600">({count})</span>}
    </>
  );
  if (!collapsible) {
    return (
      <div className="mt-4 border-t border-carbon-100 pt-4">
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-steel">
          {heading}
        </p>
        <div className="mt-3">{children}</div>
      </div>
    );
  }
  return (
    <div className="border-b border-carbon-100 py-3">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="group/facet flex w-full items-center gap-3 text-left font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-steel transition-colors hover:text-red"
      >
        <span className="shrink-0">{heading}</span>
        {!open && activeLabels.length > 0 && (
          <span className="flex min-w-0 items-center gap-1.5 overflow-hidden font-normal normal-case tracking-normal">
            <span className="shrink-0 text-steel">{activeWord}:</span>
            {activeLabels.map((l) => (
              <span
                key={l}
                className="shrink-0 whitespace-nowrap rounded-sm bg-carbon-900 px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-paper"
              >
                {l}
              </span>
            ))}
          </span>
        )}
        <span
          className={`ml-auto flex h-7 w-7 shrink-0 items-center justify-center rounded border border-carbon-300 bg-white text-carbon-700 transition-all duration-200 group-hover/facet:border-red-600 group-hover/facet:text-red-600 ${open ? 'rotate-180' : ''}`}
          aria-hidden
        >
          <ChevronIcon />
        </span>
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  );
}

export default function FabricExplorer({ locale }: { locale: Locale }) {
  const [query, setQuery] = useState('');
  // Desktop: sekcje facetow ZWIJANE, AKORDEON jak na mobile — jedna grupa
  // otwarta naraz, domyslnie wszystkie zamkniete; zwinieta sekcja pokazuje
  // wybory po prawej ("Aktywne: ...") — decyzje UX 2026-07-11.
  const [desktopOpen, setDesktopOpen] = useState<string | null>(null);
  const toggleDesktop = (key: string) =>
    setDesktopOpen((cur) => (cur === key ? null : key));

  const [categoryId, setCategoryId] = useState('');
  const [family, setFamily] = useState('');
  const [props, setProps] = useState<ReadonlySet<FabricProperty>>(new Set());
  const [norms, setNorms] = useState<ReadonlySet<string>>(new Set());
  const [fibers, setFibers] = useState<ReadonlySet<FabricFiber>>(new Set());
  const [weaves, setWeaves] = useState<ReadonlySet<FabricWeaveType>>(new Set());
  const [mobileOpen, setMobileOpen] = useState(false);
  // akordeon mobile: jedna grupa otwarta w jednym czasie
  const [openSection, setOpenSection] = useState<string | null>('norms');
  const toggleSection = (id: string) =>
    setOpenSection((prev) => (prev === id ? null : id));


  const haystacks = useMemo(() => {
    const m = new Map<string, string[]>();
    for (const f of FABRICS) m.set(f.slug, buildHaystack(f));
    return m;
  }, []);

  // KOLEJNOSC chipow: stala, wg globalnej licznosci (chipy nie skacza przy
  // filtrowaniu). LICZNIKI: dynamiczne — zawsze z aktualnego wyniku.
  const orders = useMemo(() => {
    const count = <T,>(get: (f: FabricDef) => readonly T[]) => {
      const m = new Map<T, number>();
      for (const f of FABRICS) {
        for (const v of get(f)) m.set(v, (m.get(v) ?? 0) + 1);
      }
      return [...m.entries()]
        .sort((a, b) => b[1] - a[1] || String(a[0]).localeCompare(String(b[0])))
        .map(([v]) => v);
    };
    return {
      norms: count((f) => f.norms),
      fibers: count((f) => f.fibers),
      weaves: count((f) => [f.weaveType]),
    };
  }, []);

  const queryWords = useMemo(
    () => fold(query).split(/[^a-z0-9]+/).filter((w) => w.length >= 2),
    [query]
  );

  const filtered = useMemo(
    () =>
      FABRICS.filter((f) =>
        matches(
          f,
          haystacks.get(f.slug) ?? [],
          queryWords,
          categoryId,
          family,
          props,
          norms,
          fibers,
          weaves
        )
      ),
    [haystacks, queryWords, categoryId, family, props, norms, fibers, weaves]
  );

  // Dynamiczne liczniki: ile tkanin ZOSTANIE po dolozeniu danej wartosci.
  // Przy czystym zawezaniu (AND) to dokladnie licznosc wartosci w `filtered`.
  const dyn = useMemo(() => {
    const norms = new Map<string, number>();
    const fibers = new Map<FabricFiber, number>();
    const weaves = new Map<FabricWeaveType, number>();
    const props = new Map<FabricProperty, number>();
    const cats = new Map<string, number>();
    const fams = new Map<string, number>();
    for (const f of filtered) {
      for (const n of f.norms) norms.set(n, (norms.get(n) ?? 0) + 1);
      for (const fb of f.fibers) fibers.set(fb, (fibers.get(fb) ?? 0) + 1);
      for (const p of f.properties) props.set(p, (props.get(p) ?? 0) + 1);
      weaves.set(f.weaveType, (weaves.get(f.weaveType) ?? 0) + 1);
      cats.set(f.categoryId, (cats.get(f.categoryId) ?? 0) + 1);
      fams.set(f.subFamily, (fams.get(f.subFamily) ?? 0) + 1);
    }
    return { norms, fibers, weaves, props, cats, fams };
  }, [filtered]);

  // liczba aktywnych FILTROW (bez szukajki — ta ma wlasny wskaznik w polu)
  const activeCount =
    (categoryId ? 1 : 0) +
    (family ? 1 : 0) +
    props.size +
    norms.size +
    fibers.size +
    weaves.size;
  const anyFilter = query !== '' || activeCount > 0;

  // panel mobilny: blokada scrolla tla + Escape (wzorem RfqModal/MobileNav)
  useEffect(() => {
    if (!mobileOpen) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [mobileOpen]);

  const toggleIn = <T,>(set: ReadonlySet<T>, v: T): ReadonlySet<T> => {
    const next = new Set(set);
    if (next.has(v)) next.delete(v);
    else next.add(v);
    return next;
  };

  const clearAll = () => {
    setQuery('');
    setDesktopOpen(null);
    setOpenSection(null);
    setCategoryId('');
    setFamily('');
    setProps(new Set());
    setNorms(new Set());
    setFibers(new Set());
    setWeaves(new Set());
  };

  // Pasek aktywnych filtrow: kazda pigulka usuwalna; separator "+" = AND;
  // wybory splotu (OR) sklejone w JEDNA pigulke "lub" — semantyka widoczna.
  type Pill = { key: string; label: string; onRemove: () => void };
  const pills: Pill[] = [];
  const activeNormLabels = [...norms];
  const activeFiberLabels = [...fibers].map(
    (fb) => FABRIC_FIBER_LABELS[fb][locale]
  );
  const activeWeaveLabels = [...weaves].map(
    (w) => FABRIC_WEAVE_LABELS[w][locale]
  );
  const activePropLabels = [...props].map(
    (p) => FABRIC_PROPERTY_LABELS[p][locale]
  );

  if (categoryId) {
    const c = getCategoryById(categoryId);
    pills.push({
      key: 'cat',
      label: c ? c.name[locale] : categoryId,
      onRemove: () => setCategoryId(''),
    });
  }
  if (family) {
    pills.push({
      key: 'fam',
      label: getFamilyBySlug(family)?.name ?? family,
      onRemove: () => setFamily(''),
    });
  }
  for (const n of norms) {
    pills.push({ key: `n-${n}`, label: n, onRemove: () => setNorms((p) => toggleIn(p, n)) });
  }
  for (const fb of fibers) {
    pills.push({
      key: `f-${fb}`,
      label: FABRIC_FIBER_LABELS[fb][locale],
      onRemove: () => setFibers((p) => toggleIn(p, fb)),
    });
  }
  for (const pr of props) {
    pills.push({
      key: `p-${pr}`,
      label: FABRIC_PROPERTY_LABELS[pr][locale],
      onRemove: () => setProps((p) => toggleIn(p, pr)),
    });
  }
  for (const w of weaves) {
    pills.push({
      key: `w-${w}`,
      label: FABRIC_WEAVE_LABELS[w][locale],
      onRemove: () => setWeaves((p) => toggleIn(p, w)),
    });
  }

  const pillsRow =
    pills.length === 0 ? null : (
      <div className="flex flex-wrap items-center gap-y-2">
        {pills.map((p, i) => (
          <span key={p.key} className="flex items-center">
            {i > 0 && (
              <span className="mx-1.5 font-mono text-xs text-steel" aria-hidden>
                +
              </span>
            )}
            <button
              type="button"
              onClick={p.onRemove}
              className="inline-flex items-center gap-1.5 rounded-sm border border-carbon-900 bg-carbon-900 px-2.5 py-1 font-mono text-xs uppercase tracking-wider text-paper transition-colors hover:border-red-600 hover:bg-red-600"
            >
              {p.label}
              <X size={12} strokeWidth={2.5} aria-hidden="true" />
            </button>
          </span>
        ))}
      </div>
    );

  const chipClass = (active: boolean) =>
    `inline-flex items-center gap-1.5 rounded-sm border px-2.5 py-1 font-mono text-xs uppercase tracking-wider transition-colors ${
      active
        ? 'border-carbon-900 bg-carbon-900 text-paper'
        : 'border-carbon-200 bg-surface text-carbon-700 hover:border-red hover:text-red'
    }`;

  // --- wspolne fragmenty (uzywane w panelu desktop i overlay mobile) -------

  const selectsRow = (
    <div className="grid gap-4 lg:grid-cols-2">
      <select
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        aria-label={UI.category[locale]}
        className={SELECT_CLASS}
        style={SELECT_ARROW}
      >
        <option value="">{UI.allCategories[locale]}</option>
        {FABRIC_CATEGORIES.map((c) => {
          const n = dyn.cats.get(c.id) ?? 0;
          if (n === 0 && categoryId !== c.id) return null;
          return (
            <option key={c.id} value={c.id}>
              {c.name[locale]} ({n})
            </option>
          );
        })}
      </select>

    <select
      value={family}
      onChange={(e) => setFamily(e.target.value)}
      aria-label={UI.family[locale]}
      className={SELECT_CLASS}
        style={SELECT_ARROW}
    >
      <option value="">{UI.allFamilies[locale]}</option>
      {FABRIC_FAMILIES.map((fd) => {
        const n = dyn.fams.get(fd.slug) ?? 0;
        if (n === 0 && family !== fd.slug) return null;
        return (
          <option key={fd.slug} value={fd.slug}>
            {fd.name} ({n})
          </option>
        );
      })}
    </select>
    </div>
  );

  const normChips = (
    <div className="flex flex-wrap gap-2">
      {orders.norms.map((n) => {
        const active = norms.has(n);
        const count = dyn.norms.get(n) ?? 0;
        if (count === 0 && !active) return null;
        return (
          <button
            key={n}
            type="button"
            onClick={() => setNorms((prev) => toggleIn(prev, n))}
            aria-pressed={active}
            className={chipClass(active)}
          >
            {n}
            <span className={active ? 'opacity-70' : 'text-steel'}>{count}</span>
          </button>
        );
      })}
    </div>
  );

  const fiberChips = (
    <div className="flex flex-wrap gap-2">
      {orders.fibers.map((fb) => {
        const active = fibers.has(fb);
        const count = dyn.fibers.get(fb) ?? 0;
        if (count === 0 && !active) return null;
        return (
          <button
            key={fb}
            type="button"
            onClick={() => setFibers((prev) => toggleIn(prev, fb))}
            aria-pressed={active}
            className={chipClass(active)}
          >
            {FABRIC_FIBER_LABELS[fb][locale]}
            <span className={active ? 'opacity-70' : 'text-steel'}>{count}</span>
          </button>
        );
      })}
    </div>
  );

  const weaveChips = (
    <div className="flex flex-wrap gap-2">
      {orders.weaves.map((w) => {
        const active = weaves.has(w);
        const count = dyn.weaves.get(w) ?? 0;
        if (count === 0 && !active) return null;
        return (
          <button
            key={w}
            type="button"
            onClick={() => setWeaves((prev) => toggleIn(prev, w))}
            aria-pressed={active}
            className={chipClass(active)}
          >
            {FABRIC_WEAVE_LABELS[w][locale]}
            <span className={active ? 'opacity-70' : 'text-steel'}>{count}</span>
          </button>
        );
      })}
    </div>
  );

  const propChips = (
    <div className="flex flex-wrap gap-2">
      {PROPERTY_ORDER.map((p) => {
        const active = props.has(p);
        const count = dyn.props.get(p) ?? 0;
        if (count === 0 && !active) return null;
        return (
          <button
            key={p}
            type="button"
            onClick={() => setProps((prev) => toggleIn(prev, p))}
            aria-pressed={active}
            className={chipClass(active)}
          >
            {FABRIC_PROPERTY_LABELS[p][locale]}
            <span className={active ? 'opacity-70' : 'text-steel'}>
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );

  const searchField = (
    <label className="relative block">
      <Search
        size={18}
        strokeWidth={2}
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-steel"
        aria-hidden="true"
      />
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={UI.searchPlaceholder[locale]}
        className="w-full rounded border border-carbon-200 bg-white py-3 pl-11 pr-24 text-base text-ink outline-none transition-colors focus:border-carbon-900 [&::-webkit-search-cancel-button]:hidden"
      />
      {query !== '' && (
        <span className="absolute right-11 top-1/2 -translate-y-1/2 font-mono text-xs text-steel">
          {filtered.length}
        </span>
      )}
      {query !== '' && (
        <button
          type="button"
          onClick={() => setQuery('')}
          aria-label={UI.clearQuery[locale]}
          className="absolute right-3 top-1/2 inline-flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded text-steel transition-colors hover:text-red-600"
        >
          <X size={16} strokeWidth={2} aria-hidden="true" />
        </button>
      )}
    </label>
  );

  return (
    <div>
      {/* ============ SZUKAJKA — zawsze widoczna, oba uklady ============ */}
      <div className="rounded-lg border border-steel-line bg-surface p-4 shadow-card sm:p-5">
        {searchField}

        {/* ---- MOBILE: pasek "Filtry (n) | X/134" ---- */}
        <div className="mt-3 flex items-center justify-between lg:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="inline-flex items-center gap-2 rounded bg-carbon-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-600"
          >
            <SlidersHorizontal size={16} strokeWidth={2} aria-hidden="true" />
            {UI.filters[locale]}
            {activeCount > 0 && (
              <span className="rounded-sm bg-red-500 px-1.5 font-mono text-xs">
                {activeCount}
              </span>
            )}
          </button>
          <p className="font-mono text-sm text-carbon-950">
            {filtered.length}
            <span className="text-steel"> / {FABRICS.length}</span>
          </p>
        </div>

        {pillsRow && (
          <div className="mt-3 rounded border-l-2 border-red-500 bg-paper px-3 py-3 lg:hidden">
            {pillsRow}
          </div>
        )}

        {/* ---- DESKTOP: pelny panel filtrow ---- */}
        <div className="hidden lg:block">
          <div className="mt-4 border-b border-steel-line pb-5">
            {selectsRow}
          </div>
          <FacetSection title={UI.norms[locale]} count={norms.size} collapsible open={desktopOpen === 'norms'} onToggle={() => toggleDesktop('norms')} activeWord={UI.activeWord[locale]} activeLabels={activeNormLabels}>
            {normChips}
          </FacetSection>
          <FacetSection title={UI.fibers[locale]} count={fibers.size} collapsible open={desktopOpen === 'fibers'} onToggle={() => toggleDesktop('fibers')} activeWord={UI.activeWord[locale]} activeLabels={activeFiberLabels}>
            {fiberChips}
          </FacetSection>
          <FacetSection title={UI.weaves[locale]} count={weaves.size} collapsible open={desktopOpen === 'weaves'} onToggle={() => toggleDesktop('weaves')} activeWord={UI.activeWord[locale]} activeLabels={activeWeaveLabels}>
            {weaveChips}
          </FacetSection>
          <FacetSection title={UI.properties[locale]} count={props.size} collapsible open={desktopOpen === 'props'} onToggle={() => toggleDesktop('props')} activeWord={UI.activeWord[locale]} activeLabels={activePropLabels}>
            {propChips}
          </FacetSection>


          <div className="mt-4 flex items-center justify-between border-t border-carbon-100 pt-4">
            <p className="font-mono text-sm text-carbon-950">
              {filtered.length}{' '}
              <span className="text-steel">
                / {FABRICS.length} {UI.results[locale]}
              </span>
            </p>
            {anyFilter && (
              <button
                type="button"
                onClick={clearAll}
                className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-steel transition-colors hover:text-red"
              >
                <X size={13} strokeWidth={2} aria-hidden="true" />
                {UI.clear[locale]}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ============ MOBILE: pelnoekranowy panel filtrow (portal) ============ */}
      {mobileOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[70] flex flex-col bg-paper lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label={UI.filters[locale]}
          >
            {/* Naglowek panelu */}
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-steel-line bg-surface px-5">
              <p className="font-display text-xl font-bold text-carbon-950">
                {UI.filters[locale]}
              </p>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label={UI.close[locale]}
                className="inline-flex h-11 w-11 items-center justify-center rounded text-ink transition-colors hover:text-red-600"
              >
                <X size={26} strokeWidth={1.75} aria-hidden="true" />
              </button>
            </div>

            {/* Tresc przewijalna — min-h-0 KONIECZNE (patrz MobileNav) */}
            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
              <div className="mb-4">{selectsRow}</div>
              <FacetSection
                title={UI.norms[locale]}
                count={norms.size}
                collapsible
                open={openSection === 'norms'}
                onToggle={() => toggleSection('norms')}
              >
                {normChips}
              </FacetSection>
              <FacetSection
                title={UI.fibers[locale]}
                count={fibers.size}
                collapsible
                open={openSection === 'fibers'}
                onToggle={() => toggleSection('fibers')}
              >
                {fiberChips}
              </FacetSection>
              <FacetSection
                title={UI.weaves[locale]}
                count={weaves.size}
                collapsible
                open={openSection === 'weaves'}
                onToggle={() => toggleSection('weaves')}
              >
                {weaveChips}
              </FacetSection>
              <FacetSection
                title={UI.properties[locale]}
                count={props.size}
                collapsible
                open={openSection === 'props'}
                onToggle={() => toggleSection('props')}
              >
                {propChips}
              </FacetSection>
            </div>

            {/* Stopka: wynik na zywo + czyszczenie */}
            <div className="shrink-0 border-t border-steel-line bg-surface p-4">
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="flex w-full items-center justify-center rounded bg-red-600 px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-red-500"
              >
                {UI.showResults[locale]} {filtered.length} {UI.results[locale]}
              </button>
              {anyFilter && (
                <button
                  type="button"
                  onClick={clearAll}
                  className="mt-2 flex w-full items-center justify-center gap-1.5 py-2 font-mono text-[11px] uppercase tracking-wider text-steel transition-colors hover:text-red"
                >
                  <X size={13} strokeWidth={2} aria-hidden="true" />
                  {UI.clear[locale]}
                </button>
              )}
            </div>
          </div>,
          document.body
        )}

      {/* ==================== SIATKA PRODUKTOW ==================== */}
      {filtered.length === 0 ? (
        <p className="mt-12 text-center text-ink-soft">{UI.noResults[locale]}</p>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {filtered.map((f) => {
            const href = `/fabrics/${f.subFamily}/${f.slug}`;
            return (
              <Link
                key={f.slug}
                href={href}
                className="group flex flex-col overflow-hidden rounded-lg border border-steel-line bg-surface shadow-card transition-shadow duration-300 hover:shadow-card-hover"
              >
                <div className="relative h-44 overflow-hidden bg-carbon-900">
                  {f.heroImage ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={f.heroImage}
                      alt={f.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                    />
                  ) : (
                    <div className="mesh-dark flex h-full items-center justify-center">
                      <span className="font-mono text-xs uppercase tracking-wider text-carbon-400">
                        {f.weave}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display text-xl font-bold tracking-tight text-ink">
                      {f.name}
                    </h3>
                    <ArrowRight
                      size={18}
                      strokeWidth={2}
                      className="mt-1 shrink-0 text-steel transition-all duration-200 group-hover:translate-x-1 group-hover:text-red-600"
                      aria-hidden="true"
                    />
                  </div>

                  <p className="mt-2 font-mono text-xs uppercase tracking-wider text-steel">
                    {f.weight} · {f.composition} · {f.weave}
                  </p>

                  <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                    {getFamilyBySlug(f.subFamily)?.descriptor[locale]}
                  </p>

                  {f.norms.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2 pt-1">
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
            );
          })}
        </div>
      )}
    </div>
  );
}