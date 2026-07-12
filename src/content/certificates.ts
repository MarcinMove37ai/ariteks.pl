// src/content/certificates.ts
// Dane strony /certificates — 39 certyfikatow (13 kart w 4 blokach) + 50 norm.
// W pelni dwujezyczny (wzorzec applications.ts). Normy z kotwicami do /fabrics/[slug].
// logoOnly=true: karta to logotyp/czlonkostwo, nie dokument — nieklikalna.

import type { Locale } from '@/i18n/routing';

export type CertTarget = { year: string | null; url: string; type: 'document' | 'image' };
export type CertCard = { name: string; sub: Record<Locale, string>; icon: string; latest: CertTarget; archive: CertTarget[]; logoOnly?: boolean };
export type CertBlock = { id: string; heading: Record<Locale, string>; sub: Record<Locale, string>; cards: CertCard[] };
export type NormItem = { test: Record<Locale, string>; standard: string; anchor: string };
export type NormGroup = { id: string; category: Record<Locale, string>; items: NormItem[] };

export const CERT_HERO = {
  title: { pl: 'Certyfikaty i badania', en: 'Certificates and testing' },
  lead: {
    pl: 'Każdy certyfikat na tej stronie to dokument wydany przez niezależną jednostkę — potwierdzenie, że materiały, procesy i deklarowane właściwości są zgodne z normą, a nie tylko opisane w katalogu. System zarządzania audytujemy co roku, OEKO-TEX utrzymujemy nieprzerwanie od 2009 roku, a każdą tkaninę badamy według norm przypisanych do jej zastosowania.',
    en: 'Every certificate on this page is a document issued by an independent body — confirmation that the materials, processes and declared properties conform to a standard, not merely a catalogue claim. Our management system is audited every year, we have held OEKO-TEX continuously since 2009, and we test every fabric against the standards assigned to its application.',
  },
};

export const CERT_STATS: { value: string; label: Record<Locale, string> }[] = [
  { value: '39', label: { pl: 'dokumentów', en: 'documents' } },
  { value: '60', label: { pl: 'norm badawczych', en: 'testing standards' } },
  { value: '2009', label: { pl: 'OEKO-TEX od', en: 'OEKO-TEX since' } },
  { value: 'ISO', label: { pl: 'potrójne 9001/14001/45001', en: 'triple 9001/14001/45001' } },
];

export const CERT_UI = {
  openDoc: { pl: 'Otwórz certyfikat', en: 'Open certificate' },
  viewImg: { pl: 'Zobacz certyfikat', en: 'View certificate' },
  archiveToggle: { pl: 'Wcześniejsze wydania', en: 'Earlier editions' },
  normsHeading: { pl: 'Normy i badania według zastosowań', en: 'Standards and testing by application' },
  normsLead: { pl: 'Metody, którymi badamy tkaniny w naszych laboratoriach. Karty produktów odsyłają wprost do właściwej normy.', en: 'The methods we use to test fabrics in our own laboratories. Product pages link directly to the relevant standard.' },
  colTest: { pl: 'Badanie / właściwość', en: 'Test / property' },
  colStandard: { pl: 'Norma', en: 'Standard' },
};

export const CERT_BLOCKS: CertBlock[] = [
  {
    id: "management",
    heading: { pl: "System zarządzania", en: "Management systems" },
    sub: { pl: "Zgodność procesu produkcji, audytowana corocznie przez niezależne jednostki.", en: "Production-process conformity, audited annually by independent bodies." },
    cards: [
      {
        name: "ISO 9001",
        sub: { pl: "Zarządzanie jakością", en: "Quality management" },
        icon: "/ariteks/certificates/images/iso-9001__86072b9a0f.png",
        latest: { year: "2024", url: "/ariteks/certificates/documents/iso-9001-certificate-2024__f18ea7e07b.pdf", type: "document" },
        archive: [
          { year: "2022", url: "/ariteks/certificates/documents/iso-9001-certificate-2022__bbf519a301.pdf", type: "document" },
          { year: "2020", url: "/ariteks/certificates/documents/iso-9001-certificate__a64f95d916.pdf", type: "document" },
          { year: "2018", url: "/ariteks/certificates/documents/iso-9001-certificate__854810168d.pdf", type: "document" },
          { year: "2013", url: "/ariteks/certificates/images/iso-9001-certificate-for-corlu-fabric-treatment-plant-2013__642fcfd5d5.jpg", type: "image" },
        ],
      },
      {
        name: "ISO 14001",
        sub: { pl: "Zarządzanie środowiskowe", en: "Environmental management" },
        icon: "/ariteks/certificates/images/iso-14001__b1ac088de9.png",
        latest: { year: "2024", url: "/ariteks/certificates/documents/iso-14001-certificate-2024__286f3f5b52.pdf", type: "document" },
        archive: [
          { year: "2022", url: "/ariteks/certificates/documents/iso-14001-certificate-2022__93d696f1c6.pdf", type: "document" },
          { year: "2018", url: "/ariteks/certificates/documents/iso-14001-certificate__adf712dd59.pdf", type: "document" },
        ],
      },
      {
        name: "ISO 45001",
        sub: { pl: "Bezpieczeństwo i higiena pracy", en: "Occupational health & safety" },
        icon: "/ariteks/certificates/images/iso-18001__fcee21e8fd.png",
        latest: { year: "2024", url: "/ariteks/certificates/documents/iso-45001-certificate-2024__176462b6d0.pdf", type: "document" },
        archive: [
          { year: "2022", url: "/ariteks/certificates/documents/iso-45001-certificate-2022__8adfea0f56.pdf", type: "document" },
          { year: "2018", url: "/ariteks/certificates/documents/iso-18001-certificate__3627cddaea.pdf", type: "document" },
        ],
      },
    ],
  },
  {
    id: "sustainability",
    heading: { pl: "Zrównoważony rozwój i pochodzenie surowców", en: "Sustainability and material origin" },
    sub: { pl: "Od bezpieczeństwa chemicznego wyrobu po identyfikowalność włókna w łańcuchu dostaw.", en: "From product chemical safety to fibre traceability across the supply chain." },
    cards: [
      {
        name: "OEKO-TEX Standard 100",
        sub: { pl: "Bezpieczeństwo chemiczne wyrobu", en: "Product chemical safety" },
        icon: "/ariteks/certificates/images/oekotex-100__cf2640970f.png",
        latest: { year: "2025", url: "/ariteks/certificates/documents/oeko-tex-certificate-2025-cotton-viscose-polyester-fabric__965a080232.pdf", type: "document" },
        archive: [
          { year: "2025", url: "/ariteks/certificates/documents/oeko-tex-certificate-2025-cotton-viscose-polyester__9b13439013.pdf", type: "document" },
          { year: "2024", url: "/ariteks/certificates/documents/oeko-tex-certificate-2024-cotton-viscose-polyester__a22be4203f.pdf", type: "document" },
          { year: "2023", url: "/ariteks/certificates/documents/oeko-tex-certificate-2023-cotton-viscose-polyester__5ab10b57eb.pdf", type: "document" },
          { year: "2022", url: "/ariteks/certificates/documents/oeko-tex-certificate-2022-cotton-viscose-elastane__a817d1b710.pdf", type: "document" },
          { year: "2021", url: "/ariteks/certificates/documents/oeko-tex-certificate-2021-polyester-elastane__8f3149c069.pdf", type: "document" },
          { year: "2021", url: "/ariteks/certificates/documents/oeko-tex-certificate-2021-cotton-viscose-elastane__65e1f11f18.pdf", type: "document" },
          { year: "2020", url: "/ariteks/certificates/documents/oeko-tex-certificate-2020__b792142038.pdf", type: "document" },
          { year: "2019", url: "/ariteks/certificates/documents/oeko-tex-certificate-2019__9ca59618fa.pdf", type: "document" },
          { year: "2018", url: "/ariteks/certificates/documents/oeko-tex-certificate-2018__ab3b435863.pdf", type: "document" },
          { year: "2017", url: "/ariteks/certificates/documents/oeko-tex-certificate-2017__2e3d29b2a8.pdf", type: "document" },
          { year: "2014", url: "/ariteks/certificates/documents/fabric-oeko-tex-certificate-2014__55c0c73c33.pdf", type: "document" },
          { year: "2009", url: "/ariteks/certificates/images/yarn-oeko-tex-certificate-2009__2691fd2ecd.jpg", type: "image" },
        ],
      },
      {
        name: "Recycled Claim Standard",
        sub: { pl: "Identyfikowalność surowca z recyklingu", en: "Recycled material traceability" },
        icon: "/ariteks/certificates/images/recycled-claim__b49b450a0c.png",
        latest: { year: "2025", url: "/ariteks/certificates/documents/recycled-claim-standard-2025__99279bb9fc.pdf", type: "document" },
        archive: [
          { year: "2024", url: "/ariteks/certificates/documents/recycled-claim-standard-2024__871acf5601.pdf", type: "document" },
          { year: "2022", url: "/ariteks/certificates/documents/recycled-claim-standard-2022__d3435150a2.pdf", type: "document" },
          { year: "2021", url: "/ariteks/certificates/documents/recycled-claim-standard-2021__cff9963559.pdf", type: "document" },
          { year: "2019", url: "/ariteks/certificates/documents/recycled-claim-standard__5de76c422c.pdf", type: "document" },
        ],
      },
      {
        name: "Organic Content Standard",
        sub: { pl: "Zawartość włókien organicznych", en: "Organic fibre content" },
        icon: "/ariteks/certificates/images/organic-content__af9dc0bcea.png",
        latest: { year: "2025", url: "/ariteks/certificates/documents/recycled-claim-standard-2025__99279bb9fc.pdf", type: "document" },
        archive: [
          { year: "2024", url: "/ariteks/certificates/documents/recycled-claim-standard-2024__871acf5601.pdf", type: "document" },
          { year: "2022", url: "/ariteks/certificates/documents/organic-content-standard-2022__5bb288ec63.pdf", type: "document" },
          { year: "2021", url: "/ariteks/certificates/documents/organic-content-standard-2021__e2de670357.pdf", type: "document" },
          { year: "2019", url: "/ariteks/certificates/documents/organic-content-standard__141077767f.pdf", type: "document" },
        ],
      },
      {
        name: "Produkcja organiczna",
        sub: { pl: "Textile Organic Production", en: "Textile Organic Production" },
        icon: "/ariteks/certificates/images/organic-certificate__136e87e27f.png",
        latest: { year: null, url: "/ariteks/certificates/documents/textile-organic-production-certificate__3b9e606c95.pdf", type: "document" },
        archive: [],
      },
    ],
  },
  {
    id: "environment",
    heading: { pl: "Środowisko i właściwości wyrobu", en: "Environment and product properties" },
    sub: { pl: "Pozwolenia środowiskowe i potwierdzenia właściwości technicznych.", en: "Environmental permits and confirmations of technical properties." },
    cards: [
      {
        name: "Pozwolenie środowiskowe",
        sub: { pl: "Çevre İzin Belgesi", en: "Environmental permit" },
        icon: "/ariteks/certificates/images/cevre-izin-belgesi__e795e0d446.jpg",
        latest: { year: null, url: "/ariteks/certificates/documents/cevre-izin-belgesi__2b307fbc54.pdf", type: "document" },
        archive: [],
      },
      {
        name: "Redukcja emisji CO₂",
        sub: { pl: "Potwierdzenie ograniczenia emisji", en: "Emission-reduction confirmation" },
        icon: "/ariteks/certificates/images/c02-emission-reduction__c42b33b849.png",
        latest: { year: null, url: "/ariteks/certificates/images/c02-emission-reduction__15e4c8f129.jpg", type: "image" },
        archive: [],
      },
    ],
  },
  {
    id: "other",
    heading: { pl: "Pozostałe", en: "Other" },
    sub: { pl: "Członkostwa i przynależności branżowe.", en: "Industry memberships and affiliations." },
    cards: [
      {
        name: "Better Cotton Initiative",
        sub: { pl: "Zrównoważona bawełna (BCI)", en: "Sustainable cotton (BCI)" },
        icon: "/ariteks/certificates/images/bci-better-cotton-initiative__4009e5f2f4.jpg",
        latest: { year: null, url: "/ariteks/certificates/images/bci-better-cotton-initiative__4009e5f2f4.jpg", type: "image" },
        archive: [],
        logoOnly: true,
      },
      {
        name: "Wyroby antymikrobowe",
        sub: { pl: "Potwierdzenie właściwości", en: "Property confirmation" },
        icon: "/ariteks/certificates/images/antimicrobial-products__52364c2ce9.jpg",
        latest: { year: null, url: "/ariteks/certificates/images/antimicrobial-products__52364c2ce9.jpg", type: "image" },
        archive: [],
        logoOnly: true,
      },
    ],
  },
];

export const NORM_GROUPS: NormGroup[] = [
  {
    id: "apparel",
    category: { pl: "Tekstylia odzieżowe", en: "Apparel textiles" },
    items: [
      { test: { pl: "Wyznaczanie masy liniowej", en: "Determination of linear density" }, standard: "ISO 2060", anchor: "norm-iso-2060" },
      { test: { pl: "Wyznaczanie masy powierzchniowej", en: "Determination of mass per unit area" }, standard: "ISO 3801", anchor: "norm-iso-3801" },
      { test: { pl: "Wyznaczanie szerokości i długości", en: "Determination of width and length" }, standard: "EN 1773", anchor: "norm-en-1773" },
      { test: { pl: "Wyznaczanie zmiany wymiarów", en: "Determination of dimensional change" }, standard: "ISO 3759", anchor: "norm-iso-3759" },
      { test: { pl: "Odporność wybarwień na światło sztuczne", en: "Colour fastness to artificial light" }, standard: "ISO 105 B02", anchor: "norm-iso-105-b02" },
      { test: { pl: "Odporność wybarwień na tarcie", en: "Colour fastness to rubbing" }, standard: "ISO 105 X12", anchor: "norm-iso-105-x12" },
      { test: { pl: "Odporność wybarwień na wodę", en: "Colour fastness to water" }, standard: "ISO 105 E01", anchor: "norm-iso-105-e01" },
      { test: { pl: "Odporność wybarwień na wodę morską", en: "Colour fastness to sea water" }, standard: "ISO 105 E02", anchor: "norm-iso-105-e02" },
      { test: { pl: "Odporność wybarwień na wodę chlorowaną", en: "Colour fastness to chlorinated water" }, standard: "ISO 105 E03", anchor: "norm-iso-105-e03" },
      { test: { pl: "Odporność wybarwień na pot", en: "Colour fastness to perspiration" }, standard: "ISO 105 E04", anchor: "norm-iso-105-e04" },
      { test: { pl: "Odporność wybarwień na plamienie: kwas", en: "Colour fastness to spotting: acid" }, standard: "ISO 105 E05", anchor: "norm-iso-105-e05" },
      { test: { pl: "Odporność wybarwień na plamienie: zasada", en: "Colour fastness to spotting: alkali" }, standard: "ISO 105 E06", anchor: "norm-iso-105-e06" },
      { test: { pl: "Odporność wybarwień na pranie", en: "Colour fastness to laundering" }, standard: "ISO 105 C06", anchor: "norm-iso-105-c06" },
      { test: { pl: "Odporność wybarwień na merceryzację", en: "Colour fastness to mercerizing" }, standard: "ISO 105 X04", anchor: "norm-iso-105-x04" },
      { test: { pl: "Odporność wybarwień na wybielanie: podchloryn", en: "Colour fastness to bleaching: hypochlorite" }, standard: "ISO 105 N01", anchor: "norm-iso-105-n01" },
      { test: { pl: "Odporność wybarwień na wybielanie: nadtlenek", en: "Colour fastness to bleaching: peroxide" }, standard: "ISO 105 N02", anchor: "norm-iso-105-n02" },
      { test: { pl: "Odporność wybarwień na suche ciepło", en: "Colour fastness to dry heat" }, standard: "ISO 105 P01", anchor: "norm-iso-105-p01" },
      { test: { pl: "Odporność wybarwień na powlekanie PVC", en: "Colour fastness to PVC coating" }, standard: "ISO 105 X10", anchor: "norm-iso-105-x10" },
      { test: { pl: "Odporność wybarwień na prasowanie na gorąco", en: "Colour fastness to hot pressing" }, standard: "ISO 105 X11", anchor: "norm-iso-105-x11" },
      { test: { pl: "Odporność wybarwień na czyszczenie chemiczne", en: "Colour fastness to dry cleaning" }, standard: "ISO 105 D01", anchor: "norm-iso-105-d01" },
      { test: { pl: "Wyznaczanie odporności na ścieranie", en: "Determination of abrasion resistance" }, standard: "ISO 12947-1", anchor: "norm-iso-12947-1" },
      { test: { pl: "Właściwości przy rozciąganiu — część 1", en: "Tensile properties of fabrics — Part 1" }, standard: "ISO 13934-1", anchor: "norm-iso-13934-1" },
      { test: { pl: "Właściwości przy przepychaniu — część 1", en: "Bursting properties of fabrics — Part 1" }, standard: "ISO 13938-1", anchor: "norm-iso-13938-1" },
      { test: { pl: "Powrót elastyczny", en: "Stretch recovery" }, standard: "EN 14704-1", anchor: "norm-en-14704-1" },
      { test: { pl: "Ilościowa analiza chemiczna składu", en: "Quantitative chemical analysis" }, standard: "ISO 1833-1", anchor: "norm-iso-1833-1" },
      { test: { pl: "Oznaczanie formaldehydu", en: "Determination of formaldehyde" }, standard: "ISO 14184-1", anchor: "norm-iso-14184-1" },
      { test: { pl: "Aminy aromatyczne z barwników azowych", en: "Aromatic amines from azo colorants" }, standard: "ISO 14362-1", anchor: "norm-iso-14362-1" },
    ],
  },
  {
    id: "protection",
    category: { pl: "Tekstylia ochronne", en: "Protective textiles" },
    items: [
      { test: { pl: "Ochrona przy spawaniu", en: "Welding protection" }, standard: "EN 11611", anchor: "norm-en-11611" },
      { test: { pl: "Ochrona przed ciepłem i płomieniem", en: "Heat and flame protection" }, standard: "EN 11612", anchor: "norm-en-11612" },
      { test: { pl: "Ochrona przed łukiem elektrycznym", en: "Arc protection" }, standard: "EN 61482", anchor: "norm-en-61482" },
      { test: { pl: "Ochrona przed deszczem", en: "Rain protection" }, standard: "EN 343", anchor: "norm-en-343" },
      { test: { pl: "Wysoka widzialność", en: "High visibility" }, standard: "EN 20471", anchor: "norm-en-20471" },
      { test: { pl: "Rezystywność powierzchniowa", en: "Surface resistivity" }, standard: "EN 1149", anchor: "norm-en-1149" },
      { test: { pl: "Ochrona przed chemikaliami", en: "Chemical protection" }, standard: "EN 13034", anchor: "norm-en-13034" },
      { test: { pl: "Ochrona przed ciepłem i płomieniem (ograniczone rozprzestrzenianie)", en: "Heat and flame protection (limited flame spread)" }, standard: "EN 14116", anchor: "norm-en-14116" },
      { test: { pl: "Odporność na oleje", en: "Oil repellency" }, standard: "EN 14419", anchor: "norm-en-14419" },
      { test: { pl: "Przepuszczalność promieniowania UV", en: "UV permeability" }, standard: "AATCC 183", anchor: "norm-aatcc-183" },
      { test: { pl: "Wymagania dla straży pożarnej", en: "Firefighting requirement" }, standard: "EN 469", anchor: "norm-en-469" },
    ],
  },
  {
    id: "medical",
    category: { pl: "Tekstylia medyczne", en: "Medical textiles" },
    items: [
      { test: { pl: "Aktywność antybakteryjna", en: "Antibacterial activity" }, standard: "AATCC 147", anchor: "norm-aatcc-147" },
      { test: { pl: "Aktywność antybakteryjna (ilościowa)", en: "Antibacterial activity (quantitative)" }, standard: "AATCC 100", anchor: "norm-aatcc-100" },
      { test: { pl: "Aktywność antymikrobowa", en: "Antimicrobial activity" }, standard: "ASTM E2149", anchor: "norm-astm-e2149" },
      { test: { pl: "Aktywność przeciwwirusowa tekstyliów", en: "Antiviral textiles" }, standard: "ISO 18184", anchor: "norm-iso-18184" },
      { test: { pl: "Ochrona przed czynnikami zakaźnymi", en: "Protection against infectious agents" }, standard: "EN 14126", anchor: "norm-en-14126" },
      { test: { pl: "Filtracja bakteryjna", en: "Bacterial filtration" }, standard: "EN 14683", anchor: "norm-en-14683" },
    ],
  },
  {
    id: "building",
    category: { pl: "Tekstylia budowlane", en: "Building textiles" },
    items: [
      { test: { pl: "Wytrzymałość na rozciąganie i wydłużenie", en: "Tensile strength and elongation" }, standard: "ISO 1421", anchor: "norm-iso-1421" },
      { test: { pl: "Przyczepność powłoki", en: "Coating adhesion" }, standard: "ISO 2411", anchor: "norm-iso-2411" },
      { test: { pl: "Ocena izolacyjności akustycznej", en: "Rating of sound insulation" }, standard: "ISO 717-1", anchor: "norm-iso-717-1" },
      { test: { pl: "Trudnopalność", en: "Flame retardancy" }, standard: "DIN 4102 B1", anchor: "norm-din-4102-b1" },
    ],
  },
  {
    id: "geo",
    category: { pl: "Geotekstylia", en: "Geotextiles" },
    items: [
      { test: { pl: "Wytrzymałość na rozciąganie (szeroka próbka)", en: "Wide-width tensile test" }, standard: "ISO 10319", anchor: "norm-iso-10319" },
      { test: { pl: "Masa powierzchniowa geotekstyliów", en: "Mass per unit area of geotextiles" }, standard: "ISO 9864", anchor: "norm-iso-9864" },
    ],
  },
  {
    id: 'new-lines',
    category: { pl: 'Badania specjalne — nowe linie', en: 'Special testing — new lines' },
    items: [
      { test: { pl: 'Liczba nitek na jednostkę długości (splot)', en: 'Number of threads per unit length (weave)' }, standard: 'EN 1049-2', anchor: 'norm-en-1049-2' },
      { test: { pl: 'Nazewnictwo rodzajowe włókien', en: 'Generic names of fibres' }, standard: 'EN ISO 2076', anchor: 'norm-en-iso-2076' },
      { test: { pl: 'Zwilżalność / absorpcja wody', en: 'Absorbency of textiles' }, standard: 'AATCC 79', anchor: 'norm-aatcc-79' },
      { test: { pl: 'Aktywność antybakteryjna — metoda smug', en: 'Antibacterial activity — parallel streak' }, standard: 'AATCC 147', anchor: 'norm-aatcc-147' },
      { test: { pl: 'Współczynnik ochrony UV (UPF)', en: 'UV protection factor (UPF)' }, standard: 'AATCC 183', anchor: 'norm-aatcc-183' },
      { test: { pl: 'Aktywność antywirusowa wyrobów włókienniczych', en: 'Antiviral activity of textile products' }, standard: 'ISO 18184', anchor: 'norm-iso-18184' },
      { test: { pl: 'Identyfikacja barwników', en: 'Identification of colorants' }, standard: 'ISO 16373-2', anchor: 'norm-iso-16373-2' },
      { test: { pl: 'Odporność mikrobiologiczna — próba gruntowa', en: 'Microbial resistance — soil burial test' }, standard: 'ISO 11721-1', anchor: 'norm-iso-11721-1' },
      { test: { pl: 'Materiały retrorefleksyjne', en: 'Retroreflective materials' }, standard: 'ISO 14814-2', anchor: 'norm-iso-14814-2' },
      { test: { pl: 'Reakcja na ogień materiałów budowlanych', en: 'Fire behaviour of building materials' }, standard: 'DIN 4102-1', anchor: 'norm-din-4102-1' },
    ],
  },
];