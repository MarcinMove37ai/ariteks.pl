import type { Metadata } from 'next';
import { Link, routing, type Locale } from '@/i18n/routing';
import {
  CERT_UI,
  CERT_BLOCKS,
  NORM_GROUPS,
} from '@/content/certificates';
import CertArchive from '@/components/CertArchive';
import { FABRICS } from '@/content/fabrics';
import STANDARDS_USAGE_RAW from '@/content/standards-usage.generated.json';

const BASE_URL = 'https://ariteks.pl';

const PRODUCT_COUNT = 159;
const PRODUCT_STANDARD_REFERENCES = 3058;
const RAW_STANDARD_DESIGNATIONS = 75;

type StandardUsageItem = {
  standard: string;
  aliases: string[];
  productCount: number;
  products: string[];
  icon: string | null;
};

type StandardsUsageData = {
  standards: StandardUsageItem[];
  icons: Record<
    string,
    {
      url: string;
      productCount: number;
      labels: string[];
    }
  >;
};

type StandardTableItem = {
  anchor: string;
  test: Record<Locale, string>;
  usage: StandardUsageItem;
  sourceStandard: string | null;
};

type StandardTableGroup = {
  id: string;
  category: Record<Locale, string>;
  items: StandardTableItem[];
};

const STANDARDS_USAGE =
  STANDARDS_USAGE_RAW as StandardsUsageData;

const FABRIC_BY_SLUG = new Map(
  FABRICS.map((fabric) => [fabric.slug, fabric] as const)
);

function standardKey(value: string): string {
  return value
    .trim()
    .replace(/\s+/g, ' ')
    .toUpperCase();
}

const STANDARD_USAGE_BY_KEY =
  new Map<string, StandardUsageItem>();

for (const item of STANDARDS_USAGE.standards) {
  for (const name of [item.standard, ...item.aliases]) {
    STANDARD_USAGE_BY_KEY.set(standardKey(name), item);
  }
}

/**
 * Łączy uproszczone oznaczenia z listy certyfikatów z kanonicznymi
 * oznaczeniami odzyskanymi z 3058 rekordów parametrów technicznych.
 *
 * Mapujemy tylko warianty zapisu lub ogólne oznaczenie rodziny normy.
 * Nie łączymy różnych części norm tylko dlatego, że opisują podobne badanie.
 */
const CERTIFICATE_STANDARD_TARGETS: Record<string, string> = {
  [standardKey('ISO 2060')]: 'EN ISO 2060',
  [standardKey('ISO 105 B02')]: 'EN ISO 105 B02',
  [standardKey('ISO 105 X12')]: 'EN ISO 105 X12',
  [standardKey('ISO 105 E04')]: 'EN ISO 105 E04',
  [standardKey('ISO 105 C06')]: 'EN ISO 105 C06',
  [standardKey('ISO 105 N01')]: 'EN ISO 105 N01',
  [standardKey('ISO 105 N02')]: 'EN ISO 105 N02',
  [standardKey('ISO 105 X11')]: 'EN ISO 105 X11',
  [standardKey('ISO 105 D01')]: 'EN ISO 105 D01',
  [standardKey('ISO 13934-1')]: 'EN ISO 13934-1',
  [standardKey('ISO 13938-1')]: 'EN ISO 13938-1',
  [standardKey('ISO 14362-1')]: 'EN ISO 14362-1',
  [standardKey('ISO 1833-1')]: 'EN ISO 1833',
  [standardKey('EN 11611')]: 'EN ISO 11611',
  [standardKey('EN 11612')]: 'EN ISO 11612',
  [standardKey('EN 61482')]: 'EN ISO 61482-1-2',
  [standardKey('EN 343')]: 'EN ISO 343',
  [standardKey('EN 20471')]: 'EN ISO 20471',
  [standardKey('EN 1149')]: 'EN ISO 1149-5',
  [standardKey('EN 13034')]: 'EN ISO 13034',
  [standardKey('EN 469')]: 'EN ISO 469',
  [standardKey('EN 14126')]: 'EN ISO 14126',
  [standardKey('DIN 4102 B1')]: 'DIN 4102-1',
};

const CERTIFICATE_ICON_STEMS: Record<string, string> = {
  [standardKey('EN 1149')]: 'en-1149-3',
  [standardKey('EN 11611')]: 'en-11611',
  [standardKey('EN 11612')]: 'en-11612',
  [standardKey('EN 61482')]: 'en-61482-1-2',
  [standardKey('EN 343')]: 'en-343',
  [standardKey('EN 20471')]: 'en-20471',
  [standardKey('EN 13034')]: 'en-13034',
  [standardKey('EN 14116')]: 'en-14116',
  [standardKey('EN 469')]: 'en-469',
  [standardKey('EN 14126')]: 'en-14126',
  [standardKey('EN 14683')]: 'en-14683',
  [standardKey('ISO 18184')]: 'iso-18184',
};

const STANDARD_TEST_FALLBACKS: Record<
  string,
  Record<Locale, string>
> = {
  [standardKey('EN ISO 3071')]: {
    pl: 'Oznaczanie pH',
    en: 'Determination of pH',
  },
  [standardKey('EN ISO 5077')]: {
    pl: 'Zmiana wymiarów po praniu i suszeniu',
    en: 'Dimensional change after washing and drying',
  },
  [standardKey('EN ISO 3081')]: {
    pl: 'Masa materiału',
    en: 'Material weight',
  },
  [standardKey('EN ISO 3932')]: {
    pl: 'Szerokość materiału',
    en: 'Fabric width',
  },
  [standardKey('EN ISO 13937-2')]: {
    pl: 'Wytrzymałość na rozdzieranie',
    en: 'Tear strength',
  },
  [standardKey('EN ISO 105 B07')]: {
    pl: 'Odporność wybarwień na światło i pot',
    en: 'Colour fastness to light and perspiration',
  },
  [standardKey('EN ISO 61482-1-1')]: {
    pl: 'Odporność na łuk elektryczny — ATPV',
    en: 'Arc protection — ATPV',
  },
  [standardKey('EN 530')]: {
    pl: 'Odporność na ścieranie',
    en: 'Abrasion resistance',
  },
  [standardKey('EN 12127')]: {
    pl: 'Masa powierzchniowa',
    en: 'Mass per unit area',
  },
  [standardKey('EN ISO 105 C01')]: {
    pl: 'Odporność wybarwień na pranie',
    en: 'Colour fastness to washing',
  },
  [standardKey('EN ISO 105 B04')]: {
    pl: 'Odporność na sztuczne warunki atmosferyczne',
    en: 'Colour fastness to artificial weathering',
  },
  [standardKey('EN ISO 24920')]: {
    pl: 'Test zraszania',
    en: 'Spray test',
  },
  [standardKey('EN ISO 4920')]: {
    pl: 'Odporność powierzchni na zwilżanie',
    en: 'Resistance to surface wetting',
  },
  [standardKey('EN ISO 12947-2')]: {
    pl: 'Odporność na ścieranie metodą Martindale’a',
    en: 'Martindale abrasion resistance',
  },
  [standardKey('EN ISO 13937-4')]: {
    pl: 'Wytrzymałość na rozdzieranie',
    en: 'Tear strength',
  },
  [standardKey('EN 388')]: {
    pl: 'Odporność na przecięcie',
    en: 'Cut resistance',
  },
  [standardKey('EN ISO 15614')]: {
    pl: 'Odzież dla strażaków leśnych',
    en: 'Wildland firefighter clothing',
  },
  [standardKey('EN ISO 20811')]: {
    pl: 'Odporność na przenikanie wody',
    en: 'Resistance to water penetration',
  },
  [standardKey('EN 13795')]: {
    pl: 'Odzież do środowisk kontrolowanych',
    en: 'Controlled-environment clothing',
  },
  [standardKey('EN 17092')]: {
    pl: 'Odzież ochronna dla motocyklistów',
    en: 'Protective garments for motorcyclists',
  },
  [standardKey('EN 61340')]: {
    pl: 'Ochrona elektrostatyczna ESD',
    en: 'Electrostatic protection — ESD',
  },
  [standardKey('EN ISO 12945-2')]: {
    pl: 'Odporność na mechacenie',
    en: 'Pilling resistance',
  },
  [standardKey('IEC 60895')]: {
    pl: 'Odzież przewodząca do prac pod napięciem',
    en: 'Conductive clothing for live working',
  },
  [standardKey('EN ISO 22313')]: {
    pl: 'Powrót po zagnieceniu',
    en: 'Recovery from creasing',
  },
  [standardKey('EN ISO 9237')]: {
    pl: 'Przepuszczalność powietrza',
    en: 'Air permeability',
  },
  [standardKey('TS 3596:1981 /Madde 2.3.5')]: {
    pl: 'Oznaczanie zawartości siarki',
    en: 'Determination of sulphur content',
  },
};

const PROTECTIVE_STANDARD_KEYS = new Set([
  'AATCC 183',
  'EN 388',
  'EN 530',
  'EN 61340',
  'EN 17092',
  'EN ISO 343',
  'EN ISO 469',
  'EN ISO 1149-5',
  'EN ISO 11611',
  'EN ISO 11612',
  'EN ISO 13034',
  'EN ISO 15614',
  'EN ISO 20471',
  'EN ISO 61482-1-1',
  'EN ISO 61482-1-2',
  'IEC 60895',
].map(standardKey));

const MEDICAL_STANDARD_KEYS = new Set([
  'EN 13795',
  'EN 14683',
  'EN ISO 14126',
  'ISO 18184',
].map(standardKey));

const BUILDING_STANDARD_KEYS = new Set([
  'DIN 4102-1',
].map(standardKey));

const SPECIAL_STANDARD_KEYS = new Set([
  'ISO 11721-1',
  'TS 3596:1981 /Madde 2.3.5',
].map(standardKey));

const EXCLUDED_TECHNICAL_STANDARD_KEYS = new Set([
  standardKey('ISO 9001'),
]);

function resolveStandardUsage(
  displayStandard: string
): StandardUsageItem | null {
  const displayKey = standardKey(displayStandard);
  const target =
    CERTIFICATE_STANDARD_TARGETS[displayKey] ??
    displayStandard;

  return (
    STANDARD_USAGE_BY_KEY.get(standardKey(target)) ??
    STANDARD_USAGE_BY_KEY.get(displayKey) ??
    null
  );
}

function standardGroupId(standard: string): string {
  const key = standardKey(standard);

  if (PROTECTIVE_STANDARD_KEYS.has(key)) {
    return 'protection';
  }

  if (MEDICAL_STANDARD_KEYS.has(key)) {
    return 'medical';
  }

  if (BUILDING_STANDARD_KEYS.has(key)) {
    return 'building';
  }

  if (SPECIAL_STANDARD_KEYS.has(key)) {
    return 'new-lines';
  }

  return 'apparel';
}

function standardAnchor(standard: string): string {
  return `norm-${standard
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')}`;
}

function getStandardIcon(
  usage: StandardUsageItem,
  sourceStandard: string | null
): string | null {
  if (usage.icon) {
    return usage.icon;
  }

  const sourceKey = sourceStandard
    ? standardKey(sourceStandard)
    : standardKey(usage.standard);

  const iconStem =
    CERTIFICATE_ICON_STEMS[sourceKey] ??
    CERTIFICATE_ICON_STEMS[standardKey(usage.standard)];

  return iconStem
    ? STANDARDS_USAGE.icons[iconStem]?.url ?? null
    : null;
}

function buildStandardTableGroups(): StandardTableGroup[] {
  const sourcePresentationByUsage =
    new Map<
      string,
      {
        anchor: string;
        test: Record<Locale, string>;
        sourceStandard: string;
      }
    >();

  for (const group of NORM_GROUPS) {
    for (const item of group.items) {
      const usage = resolveStandardUsage(item.standard);

      if (!usage) {
        continue;
      }

      const usageKey = standardKey(usage.standard);

      if (EXCLUDED_TECHNICAL_STANDARD_KEYS.has(usageKey)) {
        continue;
      }

      if (!sourcePresentationByUsage.has(usageKey)) {
        sourcePresentationByUsage.set(usageKey, {
          anchor: item.anchor,
          test: item.test,
          sourceStandard: item.standard,
        });
      }
    }
  }

  const groupMeta = new Map(
    NORM_GROUPS.map((group) => [
      group.id,
      {
        id: group.id,
        category: group.category,
      },
    ] as const)
  );

  const grouped = new Map<string, StandardTableItem[]>();

  for (const usage of STANDARDS_USAGE.standards) {
    const usageKey = standardKey(usage.standard);

    if (EXCLUDED_TECHNICAL_STANDARD_KEYS.has(usageKey)) {
      continue;
    }

    const source =
      sourcePresentationByUsage.get(usageKey);

    const groupId = standardGroupId(usage.standard);
    const items = grouped.get(groupId) ?? [];

    items.push({
      anchor:
        source?.anchor ??
        standardAnchor(usage.standard),
      test:
        source?.test ??
        STANDARD_TEST_FALLBACKS[usageKey] ?? {
          pl: 'Norma lub metoda badawcza stosowana w kartach produktowych',
          en: 'Standard or test method used in product records',
        },
      usage,
      sourceStandard:
        source?.sourceStandard ?? null,
    });

    grouped.set(groupId, items);
  }

  const order = [
      'protection',
      'medical',
      'building',
      'apparel',
      'new-lines',
  ];

  return order.flatMap((groupId) => {
    const items = grouped.get(groupId) ?? [];
    const meta = groupMeta.get(groupId);

    if (!meta || items.length === 0) {
      return [];
    }

    return [
      {
        ...meta,
        items: items.sort(
          (a, b) =>
            b.usage.productCount -
              a.usage.productCount ||
            a.usage.standard.localeCompare(
              b.usage.standard
            )
        ),
      },
    ];
  });
}

const STANDARD_TABLE_GROUPS =
  buildStandardTableGroups();

function fabricCountLabel(
  count: number,
  locale: Locale
): string {
  if (locale === 'en') {
    return `${count} ${count === 1 ? 'fabric' : 'fabrics'}`;
  }

  if (count === 1) {
    return '1 tkanina';
  }

  const mod10 = count % 10;
  const mod100 = count % 100;

  if (
    mod10 >= 2 &&
    mod10 <= 4 &&
    (mod100 < 12 || mod100 > 14)
  ) {
    return `${count} tkaniny`;
  }

  return `${count} tkanin`;
}

function StandardFallbackIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-7 w-7"
      aria-hidden="true"
    >
      <path d="M9 3h6" />
      <path d="M10 3v5l-5 9a2.7 2.7 0 0 0 2.35 4h9.3A2.7 2.7 0 0 0 19 17l-5-9V3" />
      <path d="M7.5 15h9" />
    </svg>
  );
}

const COPY = {
  meta: {
    title: {
      pl: 'Certyfikaty tkanin technicznych i normy badań | Ariteks',
      en: 'Technical textile certificates and testing standards | Ariteks',
    },
    description: {
      pl: 'Certyfikaty ISO, OEKO-TEX, RCS i OCS, dokumentacja środowiskowa oraz normy i metody badawcze stosowane w katalogu 159 tkanin technicznych Ariteks.',
      en: 'ISO, OEKO-TEX, RCS and OCS certificates, environmental documentation, and testing standards used across the Ariteks catalogue of 159 technical fabrics.',
    },
  },

  hero: {
    eyebrow: {
      pl: 'Zgodność · badania · dokumentacja',
      en: 'Compliance · testing · documentation',
    },
    title: {
      pl: 'Certyfikaty tkanin technicznych, normy i badania',
      en: 'Technical textile certificates, standards and testing',
    },
    lead: {
      pl: 'Dokumentujemy zgodność procesów, pochodzenie surowców oraz właściwości techniczne materiałów. Aktualne certyfikaty i ich wcześniejsze wydania zestawiamy z normami i metodami występującymi w katalogu 159 tkanin Ariteks.',
      en: 'We document process conformity, material origin and technical performance. Current certificates and earlier editions are presented alongside the standards and test methods found across the catalogue of 159 Ariteks fabrics.',
    },
    evidence: {
      pl: 'Dokumentacja zamiast ogólnych deklaracji',
      en: 'Documentation instead of general claims',
    },
    evidenceText: {
      pl: 'Na jednej stronie udostępniamy aktualne dokumenty, archiwalne wydania oraz uporządkowany indeks badań i norm związanych z ofertą.',
      en: 'One page provides current documents, archived editions and a structured index of standards and test methods connected with the product range.',
    },
    browse: {
      pl: 'Przeglądaj 159 tkanin',
      en: 'Browse 159 fabrics',
    },
    standards: {
      pl: 'Zobacz normy i badania',
      en: 'View standards and testing',
    },
  },

  stats: {
    heading: {
      pl: 'Skala udokumentowana w danych katalogowych',
      en: 'Scale documented in catalogue data',
    },
    productCount: {
      pl: 'tkanin w aktualnym katalogu',
      en: 'fabrics in the current catalogue',
    },
    references: {
      pl: 'powiązań parametrów z normami i metodami',
      en: 'parameter-to-standard references',
    },
    rawStandards: {
      pl: 'źródłowych oznaczeń norm i metod',
      en: 'source standard and method designations',
    },
    oeko: {
      pl: 'historia dokumentacji OEKO-TEX od',
      en: 'OEKO-TEX documentation since',
    },
  },

  trust: {
    heading: {
      pl: 'Co dokumentujemy',
      en: 'What we document',
    },
    lead: {
      pl: 'Strona łączy dokumentację przedsiębiorstwa z informacjami technicznymi występującymi w kartach produktowych.',
      en: 'This page connects company-level documentation with technical information found in product records.',
    },
    items: {
      pl: [
        {
          title: 'Systemy zarządzania',
          text: 'ISO 9001, ISO 14001 i ISO 45001 dokumentują zarządzanie jakością, środowiskiem oraz bezpieczeństwem pracy.',
        },
        {
          title: 'Bezpieczeństwo i pochodzenie materiałów',
          text: 'OEKO-TEX, Recycled Claim Standard i Organic Content Standard wspierają ocenę bezpieczeństwa chemicznego oraz pochodzenia surowców.',
        },
        {
          title: 'Właściwości techniczne tkanin',
          text: 'Normy ochronne, mechaniczne, użytkowe, medyczne i środowiskowe są zestawione w czytelnym indeksie tematycznym.',
        },
      ],
      en: [
        {
          title: 'Management systems',
          text: 'ISO 9001, ISO 14001 and ISO 45001 document quality, environmental and occupational safety management.',
        },
        {
          title: 'Material safety and origin',
          text: 'OEKO-TEX, Recycled Claim Standard and Organic Content Standard support the assessment of chemical safety and material origin.',
        },
        {
          title: 'Technical fabric performance',
          text: 'Protective, mechanical, performance, medical and environmental standards are presented in a structured thematic index.',
        },
      ],
    },
  },

  documents: {
    eyebrow: {
      pl: 'Dokumenty do weryfikacji',
      en: 'Documents for verification',
    },
    heading: {
      pl: 'Aktualne certyfikaty i wcześniejsze wydania',
      en: 'Current certificates and earlier editions',
    },
    lead: {
      pl: 'Każda karta prowadzi bezpośrednio do dokumentu PDF lub obrazu potwierdzenia. Wcześniejsze wydania pozostają dostępne w archiwum.',
      en: 'Each card links directly to a PDF document or confirmation image. Earlier editions remain available in the archive.',
    },
    latest: {
      pl: 'Aktualny dokument',
      en: 'Current document',
    },
    affiliation: {
      pl: 'Członkostwo lub technologia partnerska',
      en: 'Membership or partner technology',
    },
  },

  standards: {
    eyebrow: {
      pl: 'Indeks techniczny',
      en: 'Technical index',
    },
    heading: {
      pl: 'Normy i metody badawcze według zastosowania',
      en: 'Standards and test methods by application',
    },
    lead: {
      pl: 'Poniżej prezentujemy normy i metody badawcze występujące w kartach produktów Ariteks, uporządkowane według zastosowania.',
      en: 'Below are the standards and test methods found in Ariteks product records, organised by application.',
    },
    additionalGroup: {
      pl: 'Dodatkowe metody występujące w aktualnym katalogu',
      en: 'Additional methods found in the current catalogue',
    },
    entries: {
      pl: 'pozycji',
      en: 'entries',
    },
    relatedFabrics: {
      pl: 'Powiązane tkaniny',
      en: 'Related fabrics',
    },
    viewAll: {
      pl: 'Pokaż wszystkie',
      en: 'View all',
    },
    catalogue: {
      pl: 'Otwórz katalog',
      en: 'Open catalogue',
    },
  },

  faq: {
    eyebrow: {
      pl: 'Najczęstsze pytania',
      en: 'Frequently asked questions',
    },
    heading: {
      pl: 'Certyfikaty i badania Ariteks',
      en: 'Ariteks certificates and testing',
    },
    items: {
      pl: [
        {
          question: 'Jakie dokumenty są dostępne na stronie?',
          answer:
            'Udostępniamy dokumenty dotyczące systemów zarządzania ISO, OEKO-TEX, RCS, OCS, zagadnień środowiskowych oraz wybranych właściwości i technologii materiałowych. Przy kartach dostępne są także wcześniejsze wydania.',
        },
        {
          question: 'Co oznacza 75 oznaczeń norm i metod?',
          answer:
            'Jest to liczba różnych zapisów znalezionych w danych 159 produktów. Obejmuje między innymi przedrostki EN, ISO i TS, części norm oraz alternatywne sposoby zapisu. Na stronie są one porządkowane i deduplikowane.',
        },
        {
          question: 'Czy certyfikaty można otworzyć i zweryfikować?',
          answer:
            'Tak. Przy każdej karcie dokumentu znajduje się bezpośredni link do pliku PDF lub obrazu. Dokument otwiera się w nowej karcie przeglądarki.',
        },
      ],
      en: [
        {
          question: 'Which documents are available on this page?',
          answer:
            'The page includes ISO management-system documentation, OEKO-TEX, RCS, OCS, environmental documents and selected material-property or technology confirmations. Earlier editions are also available.',
        },
        {
          question: 'What do 75 standard and method designations mean?',
          answer:
            'This is the number of different notations found in data for 159 products. It includes EN, ISO and TS prefixes, individual standard parts and alternative notation. They are organised and deduplicated on this page.',
        },
        {
          question: 'Can the certificates be opened and verified?',
          answer:
            'Yes. Each document card contains a direct link to a PDF file or confirmation image, opened in a new browser tab.',
        },
      ],
    },
  },

  cta: {
    heading: {
      pl: 'Znajdź tkaninę według normy, właściwości lub zastosowania',
      en: 'Find a fabric by standard, property or application',
    },
    text: {
      pl: 'Katalog Ariteks obejmuje 159 tkanin technicznych i ochronnych z parametrami, dokumentami oraz informacjami o zastosowaniu.',
      en: 'The Ariteks catalogue contains 159 technical and protective fabrics with performance data, documents and application information.',
    },
    button: {
      pl: 'Otwórz katalog tkanin',
      en: 'Open the fabric catalogue',
    },
  },
} as const;

function absoluteUrl(path: string) {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  return `${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

function formatLargeNumber(value: number, locale: Locale) {
  if (value === 3058) {
    return locale === 'pl' ? '3 058' : '3,058';
  }

  return String(value);
}

function certificateGridClass(cardCount: number) {
  if (cardCount <= 1) {
    return 'grid max-w-xl gap-6';
  }

  if (cardCount === 2) {
    return 'grid gap-6 md:grid-cols-2';
  }

  if (cardCount === 3) {
    return 'grid gap-6 md:grid-cols-2 xl:grid-cols-3';
  }

  if (cardCount === 4) {
    return 'grid gap-6 md:grid-cols-2';
  }

  return 'grid gap-6 md:grid-cols-2 xl:grid-cols-3';
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const title = COPY.meta.title[locale];
  const description = COPY.meta.description[locale];

  const plUrl = `${BASE_URL}/certificates`;
  const enUrl = `${BASE_URL}/en/certificates`;
  const canonical = locale === 'en' ? enUrl : plUrl;

  return {
    title,
    description,
    keywords:
      locale === 'pl'
        ? [
            'certyfikaty tkanin technicznych',
            'certyfikaty tkanin ochronnych',
            'normy badań tkanin',
            'OEKO-TEX tkaniny',
            'ISO 9001',
            'ISO 14001',
            'ISO 45001',
            'RCS',
            'OCS',
            'EN ISO 11612',
            'EN ISO 20471',
            'Ariteks',
          ]
        : [
            'technical textile certificates',
            'protective fabric certificates',
            'fabric testing standards',
            'OEKO-TEX fabrics',
            'ISO 9001',
            'ISO 14001',
            'ISO 45001',
            'RCS',
            'OCS',
            'EN ISO 11612',
            'EN ISO 20471',
            'Ariteks',
          ],
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
      locale: locale === 'pl' ? 'pl_PL' : 'en_US',
      alternateLocale: locale === 'pl' ? ['en_US'] : ['pl_PL'],
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

export default async function CertificatesPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  const pageUrl =
    locale === 'en'
      ? `${BASE_URL}/en/certificates`
      : `${BASE_URL}/certificates`;

  const homeUrl =
    locale === 'en'
      ? `${BASE_URL}/en`
      : BASE_URL;

  const faqItems = COPY.faq.items[locale];

  const jsonLd = {
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
        '@type': 'CollectionPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: COPY.meta.title[locale],
        description: COPY.meta.description[locale],
        inLanguage: locale === 'pl' ? 'pl-PL' : 'en',
        isPartOf: {
          '@id': `${BASE_URL}/#website`,
        },
        publisher: {
          '@id': `${BASE_URL}/#organization`,
        },
        about: [
          'Technical textiles',
          'Protective fabrics',
          'Textile certificates',
          'Fabric testing standards',
          'ISO management systems',
          'OEKO-TEX Standard 100',
          'Recycled Claim Standard',
          'Organic Content Standard',
        ],
        mainEntity: {
          '@id': `${pageUrl}#certificate-list`,
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${pageUrl}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: locale === 'pl' ? 'Strona główna' : 'Home',
            item: homeUrl,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name:
              locale === 'pl'
                ? 'Certyfikaty i badania'
                : 'Certificates and testing',
            item: pageUrl,
          },
        ],
      },
      {
        '@type': 'ItemList',
        '@id': `${pageUrl}#certificate-list`,
        name:
          locale === 'pl'
            ? 'Certyfikaty i dokumenty Ariteks'
            : 'Ariteks certificates and documents',
        numberOfItems: CERT_BLOCKS.reduce(
          (sum, block) => sum + block.cards.length,
          0
        ),
        itemListElement: CERT_BLOCKS.flatMap((block) => block.cards).map(
          (card, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
              '@type': 'CreativeWork',
              name: card.name,
              description: card.sub[locale],
              url: absoluteUrl(card.latest.url),
              publisher: {
                '@id': `${BASE_URL}/#organization`,
              },
            },
          })
        ),
      },
      {
        '@type': 'FAQPage',
        '@id': `${pageUrl}#faq`,
        mainEntity: faqItems.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      },
    ],
  };

  const stats = [
    {
      value: String(PRODUCT_COUNT),
      label: COPY.stats.productCount[locale],
    },
    {
      value: formatLargeNumber(PRODUCT_STANDARD_REFERENCES, locale),
      label: COPY.stats.references[locale],
    },
    {
      value: String(RAW_STANDARD_DESIGNATIONS),
      label: COPY.stats.rawStandards[locale],
    },
    {
      value: '2009',
      label: COPY.stats.oeko[locale],
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />

      {/* ==================== HERO ==================== */}
      <section className="mesh-light border-b border-carbon-100">
        <div className="container-site py-16 sm:py-24">
          <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.65fr)] lg:gap-16">
            <div>
              <p className="eyebrow mb-4">
                {COPY.hero.eyebrow[locale]}
              </p>

              <h1 className="max-w-5xl font-display text-4xl leading-tight text-carbon-950 sm:text-5xl lg:text-6xl">
                {COPY.hero.title[locale]}
              </h1>

              <p className="mt-6 max-w-3xl text-lg leading-relaxed text-ink sm:text-xl">
                {COPY.hero.lead[locale]}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/fabrics"
                  className="inline-flex items-center justify-center gap-2 rounded bg-carbon-950 px-5 py-3 text-sm font-medium text-paper transition-colors hover:bg-red"
                >
                  {COPY.hero.browse[locale]}
                  <span aria-hidden>→</span>
                </Link>

                <a
                  href="#standards"
                  className="inline-flex items-center justify-center gap-2 rounded border border-carbon-300 bg-white px-5 py-3 text-sm font-medium text-carbon-950 transition-colors hover:border-red hover:text-red"
                >
                  {COPY.hero.standards[locale]}
                  <span aria-hidden>↓</span>
                </a>
              </div>
            </div>

            <aside className="rounded-lg bg-carbon-950 p-7 text-paper shadow-card sm:p-8">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-carbon-300">
                {COPY.hero.evidence[locale]}
              </p>

              <p className="mt-5 font-display text-2xl leading-snug">
                ISO 9001 · ISO 14001 · ISO 45001
              </p>

              <div className="mt-6 h-px bg-white/15" />

              <p className="mt-6 leading-relaxed text-carbon-200">
                {COPY.hero.evidenceText[locale]}
              </p>

              <div className="mt-7 flex flex-wrap gap-2">
                {['OEKO-TEX', 'RCS', 'OCS', 'EN', 'ISO', 'AATCC'].map(
                  (item) => (
                    <span
                      key={item}
                      className="rounded border border-white/20 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-carbon-200"
                    >
                      {item}
                    </span>
                  )
                )}
              </div>
            </aside>
          </div>

          <div className="mt-14 border-t border-carbon-200 pt-8">
            <h2 className="sr-only">
              {COPY.stats.heading[locale]}
            </h2>

            <dl className="grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="border-l-2 border-red pl-4"
                >
                  <dt className="font-display text-3xl leading-none text-carbon-950 sm:text-4xl">
                    {stat.value}
                  </dt>
                  <dd className="mt-2 max-w-[180px] font-mono text-[10px] uppercase leading-relaxed tracking-wider text-steel">
                    {stat.label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ==================== ZAKRES DOKUMENTACJI ==================== */}
      <section className="border-b border-carbon-100 bg-paper">
        <div className="container-site py-16 sm:py-20">
          <div className="max-w-3xl">
            <p className="eyebrow mb-3">Ariteks</p>

            <h2 className="font-display text-3xl text-carbon-950 sm:text-4xl">
              {COPY.trust.heading[locale]}
            </h2>

            <p className="mt-4 text-lg leading-relaxed text-ink">
              {COPY.trust.lead[locale]}
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {COPY.trust.items[locale].map((item, index) => (
              <article
                key={item.title}
                className="rounded-lg border border-carbon-100 bg-white p-6 shadow-card"
              >
                <span className="font-mono text-xs text-red">
                  0{index + 1}
                </span>

                <h3 className="mt-4 font-display text-xl text-carbon-950">
                  {item.title}
                </h3>

                <p className="mt-3 leading-relaxed text-ink">
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== NAWIGACJA PO DOKUMENTACH ==================== */}
      <nav
        aria-label={
          locale === 'pl'
            ? 'Sekcje certyfikatów'
            : 'Certificate sections'
        }
        className="border-b border-carbon-100 bg-white"
      >
        <div className="container-site flex flex-wrap gap-2 py-5">
          {CERT_BLOCKS.map((block) => (
            <a
              key={block.id}
              href={`#certificate-${block.id}`}
              className="rounded border border-carbon-200 bg-paper px-3 py-2 text-sm text-carbon-950 transition-colors hover:border-red hover:text-red"
            >
              {block.heading[locale]}
            </a>
          ))}

          <a
            href="#standards"
            className="rounded border border-carbon-200 bg-paper px-3 py-2 text-sm text-carbon-950 transition-colors hover:border-red hover:text-red"
          >
            {COPY.standards.heading[locale]}
          </a>
        </div>
      </nav>

      {/* ==================== CERTYFIKATY ==================== */}
      <section className="border-b border-carbon-100 bg-white">
        <div className="container-site py-16 sm:py-20">
          <div className="max-w-3xl">
            <p className="eyebrow mb-3">
              {COPY.documents.eyebrow[locale]}
            </p>

            <h2 className="font-display text-3xl text-carbon-950 sm:text-4xl">
              {COPY.documents.heading[locale]}
            </h2>

            <p className="mt-4 text-lg leading-relaxed text-ink">
              {COPY.documents.lead[locale]}
            </p>
          </div>
        </div>
      </section>

      {CERT_BLOCKS.map((block, blockIndex) => (
          <section
            key={block.id}
            id={`certificate-${block.id}`}
            className={`scroll-mt-24 border-b border-carbon-100 ${
              blockIndex % 2 === 0 ? 'bg-paper' : 'bg-white'
            }`}
          >
            <div className="container-site py-16 sm:py-20">
              <div className="grid items-start gap-10 lg:grid-cols-[minmax(260px,0.36fr)_minmax(0,1fr)] lg:gap-12 xl:gap-16">
                <header className="max-w-md">
                  <span className="font-mono text-xs text-red">
                    {String(blockIndex + 1).padStart(2, '0')}
                  </span>

                  <h2 className="mt-3 font-display text-2xl leading-tight text-carbon-950 sm:text-3xl">
                    {block.heading[locale]}
                  </h2>

                  <p className="mt-4 max-w-sm leading-relaxed text-ink">
                    {block.sub[locale]}
                  </p>

                  <p className="mt-6 font-mono text-[11px] uppercase tracking-wider text-steel">
                    {block.cards.length}{' '}
                    {locale === 'pl' ? 'obszarów' : 'entries'}
                  </p>
                </header>

                <div className={certificateGridClass(block.cards.length)}>
                  {block.cards.map((card) => {
                    const actionLabel =
                      card.latest.type === 'document'
                        ? CERT_UI.openDoc[locale]
                        : CERT_UI.viewImg[locale];

                    return (
                      <article
                        key={card.name}
                        className="flex h-full min-w-0 flex-col rounded-lg border border-carbon-100 bg-white p-6 shadow-card"
                      >
                        <div className="grid min-h-[138px] grid-cols-[80px_minmax(0,1fr)] items-start gap-4 sm:grid-cols-[96px_minmax(0,1fr)] sm:gap-5">
                          <div className="flex h-20 w-20 items-center justify-center sm:h-24 sm:w-24">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={card.icon}
                              alt={`${card.name} — ${card.sub[locale]}`}
                              width={96}
                              height={96}
                              loading="lazy"
                              decoding="async"
                              className="max-h-full max-w-full object-contain"
                            />
                          </div>

                          <div className="min-w-0 pt-1">
                            <h3 className="font-display text-lg leading-tight text-carbon-950 sm:text-xl">
                              {card.name}
                            </h3>

                            <p className="mt-2 text-sm leading-relaxed text-steel">
                              {card.sub[locale]}
                            </p>
                          </div>
                        </div>

                        <div className="mt-6 border-t border-carbon-100 pt-5">
                          {!card.logoOnly ? (
                            <>
                              <p className="mb-3 font-mono text-[10px] uppercase tracking-wider text-steel">
                                {COPY.documents.latest[locale]}
                              </p>

                              <a
                                href={card.latest.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`${actionLabel}: ${card.name}`}
                                className="flex min-h-12 w-full items-center justify-between gap-4 rounded bg-carbon-950 px-4 py-2.5 text-left text-sm font-medium text-paper transition-colors hover:bg-red"
                              >
                                <span>{actionLabel}</span>

                                <span className="flex shrink-0 items-center gap-3">
                                  {card.latest.year && (
                                    <span className="font-mono text-xs opacity-70">
                                      {card.latest.year}
                                    </span>
                                  )}

                                  <span aria-hidden>↗</span>
                                </span>
                              </a>
                            </>
                          ) : (
                            <div className="flex min-h-12 items-center">
                              <p className="font-mono text-[10px] uppercase leading-relaxed tracking-wider text-steel">
                                {COPY.documents.affiliation[locale]}
                              </p>
                            </div>
                          )}
                        </div>

                        {card.archive.length > 0 && (
                          <div className="mt-auto pt-4">
                            <CertArchive
                              archive={card.archive}
                              toggleLabel={CERT_UI.archiveToggle[locale]}
                            />
                          </div>
                        )}
                      </article>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
      ))}

      {/* ==================== NORMY ==================== */}
      <section
        id="standards"
        className="mesh-light scroll-mt-24 border-b border-carbon-100"
      >
        <div className="container-site py-16 sm:py-24">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start lg:gap-14">
            <div className="max-w-4xl">
              <p className="eyebrow mb-3">
                {COPY.standards.eyebrow[locale]}
              </p>

              <h2 className="font-display text-3xl text-carbon-950 sm:text-4xl">
                {COPY.standards.heading[locale]}
              </h2>

              <p className="mt-4 text-lg leading-relaxed text-ink">
                {COPY.standards.lead[locale]}
              </p>
            </div>

            <aside className="rounded-lg bg-carbon-950 p-6 text-paper shadow-card">
              <p className="font-display text-4xl">
                {RAW_STANDARD_DESIGNATIONS}
              </p>

              <p className="mt-2 max-w-[220px] font-mono text-[10px] uppercase leading-relaxed tracking-wider text-carbon-300">
                {COPY.stats.rawStandards[locale]}
              </p>
            </aside>
          </div>

          <div className="mt-12 space-y-12">
            {STANDARD_TABLE_GROUPS.map((group) => {
              const groupName =
                group.id === 'new-lines'
                  ? COPY.standards.additionalGroup[locale]
                  : group.category[locale];

              return (
                <section
                  key={group.id}
                  aria-labelledby={`standard-group-${group.id}`}
                >
                  <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
                    <h3
                      id={`standard-group-${group.id}`}
                      className="font-display text-xl text-carbon-950 sm:text-2xl"
                    >
                      {groupName}
                    </h3>

                    <span className="font-mono text-xs uppercase tracking-wider text-steel">
                      {group.items.length}{' '}
                      {COPY.standards.entries[locale]}
                    </span>
                  </div>

                  <div className="overflow-x-auto rounded-lg border border-carbon-100 bg-white shadow-card">
                    <table className="w-full min-w-[980px] text-left text-sm">
                      <thead>
                        <tr className="border-b border-carbon-100 bg-paper">
                          <th
                            scope="col"
                            className="w-[84px] px-5 py-3"
                          >
                            <span className="sr-only">
                              {locale === 'pl' ? 'Ikona' : 'Icon'}
                            </span>
                          </th>

                          <th
                            scope="col"
                            className="px-5 py-3 font-mono text-[11px] uppercase tracking-wider text-steel"
                          >
                            {CERT_UI.colTest[locale]}
                          </th>

                          <th
                            scope="col"
                            className="w-[190px] px-5 py-3 font-mono text-[11px] uppercase tracking-wider text-steel"
                          >
                            {CERT_UI.colStandard[locale]}
                          </th>

                          <th
                            scope="col"
                            className="min-w-[330px] px-5 py-3 font-mono text-[11px] uppercase tracking-wider text-steel"
                          >
                            {COPY.standards.relatedFabrics[locale]}
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {group.items.map((item) => {
                          const usage = item.usage;

                          const products =
                            usage.products.flatMap(
                              (slug) => {
                                const fabric =
                                  FABRIC_BY_SLUG.get(slug);

                                return fabric ? [fabric] : [];
                              }
                            );

                          const sampleProducts =
                            products.slice(0, 3);

                          const filterHref =
                            products.length >= 2 &&
                            products.length < FABRICS.length
                              ? `/fabrics?standard=${encodeURIComponent(
                                  usage.standard
                                )}`
                              : null;

                          const catalogueHref =
                            products.length === FABRICS.length
                              ? '/fabrics'
                              : null;

                          const icon = getStandardIcon(
                            usage,
                            item.sourceStandard
                          );

                          return (
                            <tr
                              key={item.anchor}
                              id={item.anchor}
                              className="scroll-mt-24 border-b border-carbon-100 align-top last:border-0 target:bg-paper"
                            >
                              <td className="w-[84px] px-5 py-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded border border-carbon-100 bg-paper text-steel">
                                  {icon ? (
                                    /* eslint-disable-next-line @next/next/no-img-element */
                                    <img
                                      src={icon}
                                      alt=""
                                      width={48}
                                      height={48}
                                      loading="lazy"
                                      decoding="async"
                                      className="h-10 w-10 object-contain"
                                      aria-hidden="true"
                                    />
                                  ) : (
                                    <StandardFallbackIcon />
                                  )}
                                </div>
                              </td>

                              <td className="px-5 py-4 leading-relaxed text-ink">
                                {item.test[locale]}
                              </td>

                              <td className="whitespace-nowrap px-5 py-4 font-mono text-xs font-medium text-carbon-950">
                                {usage.standard}
                              </td>

                              <td className="min-w-[330px] px-5 py-4">
                                <div>
                                  <div className="flex flex-wrap gap-x-3 gap-y-1.5">
                                    {sampleProducts.map(
                                      (fabric) => (
                                        <Link
                                          key={fabric.slug}
                                          href={`/fabrics/${fabric.subFamily}/${fabric.slug}`}
                                          className="font-medium text-carbon-950 underline decoration-carbon-300 underline-offset-4 transition-colors hover:text-red hover:decoration-red"
                                        >
                                          {fabric.name}
                                        </Link>
                                      )
                                    )}
                                  </div>

                                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                                    <span className="font-mono text-[10px] uppercase tracking-wider text-steel">
                                      {fabricCountLabel(
                                        products.length,
                                        locale
                                      )}
                                    </span>

                                    {filterHref && (
                                      <Link
                                        href={filterHref}
                                        className="font-mono text-[10px] font-medium uppercase tracking-wider text-red transition-colors hover:text-carbon-950"
                                      >
                                        {
                                          COPY.standards
                                            .viewAll[locale]
                                        }{' '}
                                        <span aria-hidden>→</span>
                                      </Link>
                                    )}

                                    {catalogueHref && (
                                      <Link
                                        href={catalogueHref}
                                        className="font-mono text-[10px] font-medium uppercase tracking-wider text-red transition-colors hover:text-carbon-950"
                                      >
                                        {
                                          COPY.standards
                                            .catalogue[locale]
                                        }{' '}
                                        <span aria-hidden>→</span>
                                      </Link>
                                    )}
                                  </div>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== FAQ ==================== */}
        <section className="border-b border-carbon-100 bg-paper">
          <div className="container-site grid items-start gap-10 py-16 sm:py-20 lg:grid-cols-[minmax(260px,0.36fr)_minmax(0,1fr)] lg:gap-12 xl:gap-16">
            <header className="max-w-md">
              <p className="eyebrow mb-3">
                {COPY.faq.eyebrow[locale]}
              </p>

              <h2 className="font-display text-3xl leading-tight text-carbon-950 sm:text-4xl">
                {COPY.faq.heading[locale]}
              </h2>
            </header>

            <div className="min-w-0 space-y-3">
              {faqItems.map((item) => (
                <details
                  key={item.question}
                  className="group overflow-hidden rounded-lg border border-carbon-100 bg-white shadow-card"
                >
                  <summary className="flex min-h-[72px] cursor-pointer list-none items-center justify-between gap-6 px-6 py-5 font-display text-lg leading-snug text-carbon-950">
                    <span>{item.question}</span>

                    <span
                      aria-hidden
                      className="flex h-8 w-8 shrink-0 items-center justify-center text-2xl font-normal text-red transition-transform group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>

                  <div className="border-t border-carbon-100 px-6 py-5">
                    <p className="max-w-3xl leading-relaxed text-ink">
                      {item.answer}
                    </p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

      {/* ==================== CTA ==================== */}
      <section className="bg-carbon-950 text-paper">
        <div className="container-site py-16 sm:py-20">
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
            <div className="max-w-3xl">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-carbon-300">
                Ariteks
              </p>

              <h2 className="mt-4 font-display text-3xl leading-tight sm:text-4xl">
                {COPY.cta.heading[locale]}
              </h2>

              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-carbon-200">
                {COPY.cta.text[locale]}
              </p>
            </div>

            <Link
              href="/fabrics"
              className="inline-flex flex-shrink-0 items-center justify-center gap-2 rounded bg-red px-6 py-3.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              {COPY.cta.button[locale]}
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}