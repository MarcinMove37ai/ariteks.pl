// src/content/applications.ts
// JEDNO ZRODLO PRAWDY dla branz — v3: rozszerzenie o warstwe tresci bogatej.
// Pole `content` jest OPCJONALNE: szablon strony branzowej renderuje pelna
// wersje gdy jest, a elegancki fallback (nazwa + opis + badge) gdy go brak.
// Tresci bogate wchodza cyklami po JEDNEJ branzy.
// Pełna treść bogata: 9 aplikacji. Pozostałe korzystają z eleganckiego fallbacku.

import type { Locale } from '@/i18n/routing';

/** Rodzina tkanin prezentowana na stronie branzowej */
export type FabricFamily = {
  /** Nazwa handlowa, np. "ArBo" */
  name: string;
  /** Linia spec (mono), neutralna jezykowo: sklad · gramatura · splot */
  spec: string;
  /** Jedno zdanie zastosowania/przewagi */
  desc: Record<Locale, string>;
  /** Normy tej rodziny */
  badges?: string[];
};

/** Tresc bogata strony branzowej */
export type ApplicationContent = {
  /** H1-obietnica zamiast nazwy branzy */
  heroTitle: Record<Locale, string>;
  /** Lead: dla kogo i co dostarczamy */
  heroLead: Record<Locale, string>;
  /** Sekcja USP: nazwane wyrozniki tej grupy towarowej (nie edukacja o normach!) */
  usp: {
    heading: Record<Locale, string>;
    items: Array<{ title: Record<Locale, string>; text: Record<Locale, string> }>;
  };
  /** Naglowek sekcji rodzin tkanin */
  familiesHeading: Record<Locale, string>;
  /** Rodziny tkanin z realnymi danymi katalogowymi */
  families: FabricFamily[];
  /** Etykieta pasa norm */
  normsHeading: Record<Locale, string>;
  /** Normy, wedlug ktorych badamy tkaniny tej branzy */
  norms: string[];
};

export type ApplicationDef = {
  id: string;
  slug: Record<Locale, string>;
  name: Record<Locale, string>;
  short: Record<Locale, string>;
  badges: string[];
  image: string;
  content?: ApplicationContent;
};

export const APPLICATIONS: ApplicationDef[] = [
  {
    id: 'military',
    slug: { pl: 'wojsko-i-sluzby', en: 'military-and-services' },
    name: {
      pl: 'Wojsko i służby mundurowe',
      en: 'Military and uniformed services',
    },
    short: {
      pl: 'Tkaniny mundurowe ArDura (PA 6.6) dla wojska i policji, kombinezony pirotechniczne, siatki maskujące, dzianiny 3D.',
      en: 'ArDura (PA 6.6) uniform fabrics for military and police, bomb-disposal suits, camouflage mesh, 3D warp knits.',
    },
    badges: ['EN 1149'],
    image: '/images/applications/military.png',
    content: {
      heroTitle: {
        pl: 'Wytrzymałość klasy wojskowej',
        en: 'Military-grade durability',
      },
      heroLead: {
        pl: 'Mundur i wyposażenie służb pracują w warunkach ekstremalnych — tam, gdzie od materiału zależy bezpieczeństwo człowieka i powodzenie zadania. Przetarcie, rozdarcie czy wypłowiały kamuflaż to nie defekt kosmetyczny, lecz realne zagrożenie życia. Dlatego produkujemy tkaniny o najwyższej wytrzymałości mechanicznej — na mundury, kombinezony pirotechniczne i wyposażenie, które ma przetrwać każdą służbę.',
        en: 'Uniforms and service equipment operate in extreme conditions — where the material determines a person’s safety and the success of the mission. Abrasion, a tear or faded camouflage is not a cosmetic defect but a real threat to life. That is why we manufacture fabrics of the highest mechanical strength — for uniforms, bomb-disposal suits and equipment built to outlast every deployment.',
      },
      usp: {
        heading: {
          pl: 'Co wyróżnia nasze tkaniny dla wojska i służb',
          en: 'What sets our military and service fabrics apart',
        },
        items: [
          {
            title: { pl: 'Kompletne umundurowanie z jednej rodziny tkanin', en: 'A complete uniform system from one fabric family' },
            text: {
              pl: 'ArDura pokrywa gramatury 215–350 g/m² i sploty plain, twill, ripstop oraz jodełkę — od munduru polowego po oporządzenie. Jedna kwalifikacja dostawcy, spójne parametry w całym zestawie, jedna logistyka.',
              en: 'ArDura covers weights of 215–350 g/m² and plain, twill, ripstop and herringbone weaves — from field uniform to load-bearing gear. One supplier qualification, consistent parameters across the kit, one logistics chain.',
            },
          },
          {
            title: { pl: 'Splot dobrany do zagrożenia', en: 'A weave matched to the threat' },
            text: {
              pl: 'Warianty Rb w splocie ripstop zatrzymują propagację rozdarcia; ArDura 500 CG w jodełce 350 g/m² to tkanina kombinezonów pirotechnicznych, odporna na przebicia.',
              en: 'Rb variants in ripstop weave arrest tear propagation; ArDura 500 CG in a 350 g/m² herringbone is the fabric of bomb-disposal suits, resistant to puncture.',
            },
          },
          {
            title: { pl: 'Dzianina odporna na przecięcie', en: 'A cut-resistant knit' },
            text: {
              pl: 'ArGiyim Knit Knife Pro: 100% p-aramidu w splocie jersey, 250 g/m² — ochrona antyprzecięciowa dla służb w formie dzianiny, nie sztywnego panelu.',
              en: 'ArGiyim Knit Knife Pro: 100% para-aramid in a jersey knit at 250 g/m² — cut protection for uniformed services in the form of a knit, not a rigid panel.',
            },
          },
          {
            title: { pl: 'HPPE — włókno o skrajnej wytrzymałości', en: 'HPPE — a fibre of extreme strength' },
            text: {
              pl: 'Linia Kursun: denim z 50% udziałem wysokowytrzymałego polietylenu, 290 g/m² w splocie twill i 620 g/m² w splocie podwójnym — tam, gdzie kończą się możliwości zwykłych tkanin.',
              en: 'The Kursun line: denim with a 50% share of high-performance polyethylene, 290 g/m² in twill and 620 g/m² in a double weave — for where ordinary fabrics reach their limit.',
            },
          },
          {
            title: { pl: 'Wersja trudnopalna bez zmiany konstrukcji', en: 'A flame-retardant version without changing the construction' },
            text: {
              pl: 'ArDura 500 FR i 1000 FR to trudnopalne odpowiedniki tkanin bazowych w tych samych gramaturach i splotach. Rozszerzasz ofertę o wyrób FR bez zmiany krojów, dostawcy i logistyki — jedna baza materiałowa obsługuje oba warianty przetargu.',
              en: 'ArDura 500 FR and 1000 FR are flame-retardant counterparts of the base fabrics in the same weights and weaves. You extend your range with an FR product without changing patterns, supplier or logistics — one material base serves both tender variants.',
            },
          },
          {
            title: { pl: 'Kolor, który nie płowieje na służbie', en: 'Colour that does not fade in service' },
            text: {
              pl: 'Poliamid 6.6 barwimy kwasowo: odporność na światło do 6–7 według ISO 105 B02. Receptury archiwizowane — odcień munduru powtarzalny między partiami i latami dostaw.',
              en: 'We acid-dye polyamide 6.6: light fastness of up to 6–7 to ISO 105 B02. Recipes are archived — the uniform shade stays repeatable between batches and across years of supply.',
            },
          },
        ],
      },
      familiesHeading: { pl: 'Rodziny tkanin dla wojska i służb', en: 'Fabric families for military and services' },
      normsHeading: { pl: 'Badamy według norm', en: 'Tested to standards' },
      families: [
        {
          name: 'ArDura 500 C',
          spec: '100% PA 6.6 · 215 g/m² · Plain / Ripstop / Twill',
          desc: {
            pl: 'Bazowa tkanina mundurowa w trzech splotach: plain (C), ripstop (C Rb) i twill (Kirik Dimi). Fundament umundurowania polowego.',
            en: 'The base uniform fabric in three weaves: plain (C), ripstop (C Rb) and twill (Kirik Dimi). The foundation of field uniforms.',
          },
        },
        {
          name: 'ArDura 1000 C',
          spec: '100% PA 6.6 · 300 g/m² · Plain / Ripstop',
          desc: {
            pl: 'Ciężka odmiana linii — na oporządzenie, pokrowce i elementy wyposażenia o najwyższym obciążeniu ścieraniem.',
            en: 'The heavy variant of the line — for load-bearing gear, covers and equipment under the highest abrasion loads.',
          },
        },
        {
          name: 'ArDura FR',
          spec: '95% PA 6.6 · 5% PU · 240–350 g/m² · Plain',
          desc: {
            pl: 'Trudnopalne wersje ArDura 500 i 1000 — te same gramatury i sploty co w tkaninach bazowych.',
            en: 'Flame-retardant versions of ArDura 500 and 1000 — the same weights and weaves as the base fabrics.',
          },
        },
        {
          name: 'ArDura 500 CG',
          spec: '100% PA 6.6 · 350 g/m² · Herringbone',
          desc: {
            pl: 'Tkanina kombinezonów pirotechnicznych — splot jodełkowy o podwyższonej odporności na przebicia.',
            en: 'The bomb-disposal suit fabric — a herringbone weave with increased puncture resistance.',
          },
        },
        {
          name: 'ArGiyim Knit Knife Pro',
          spec: '100% p-AR · 250 g/m² · Jersey',
          desc: {
            pl: 'Dzianina odporna na przecięcie — ochrona dłoni, przedramion i newralgicznych stref odzieży służb.',
            en: 'A cut-resistant knit — protection for hands, forearms and critical zones of service apparel.',
          },
        },
        {
          name: 'ArGiyim Denim Kursun',
          spec: '50% HPPE · 50% PES · 290 g/m² · Twill',
          desc: {
            pl: 'Denim z włóknem HPPE o skrajnej odporności na ścieranie i przecięcie. Wariant CK: 620 g/m² w splocie podwójnym.',
            en: 'A denim with HPPE fibre offering extreme abrasion and cut resistance. The CK variant: 620 g/m² in a double weave.',
          },
        },
      ],
      norms: ['EN ISO 13934-1', 'EN ISO 12947-1', 'EN ISO 105 B02', 'EN ISO 5077'],
    },
  },
  {
    id: 'firefighting',
    slug: { pl: 'straz-pozarna', en: 'firefighting' },
    name: { pl: 'Straż pożarna', en: 'Firefighting' },
    short: {
      pl: 'Ubrania bojowe: tkanina ArBo z włóknem PBO — najwytrzymalsza syntetyczna tkanina świata, badana według EN 469.',
      en: 'Turnout gear: ArBo fabric with PBO fibre — the world’s strongest synthetic fabric, tested to EN 469.',
    },
    badges: ['EN 469', 'EN ISO 11612'],
    image: '/images/applications/firefighting.png',
    content: {
      heroTitle: { pl: 'Tkaniny, które wchodzą w ogień', en: 'Fabrics that walk into fire' },
      heroLead: {
        pl: 'Każde ubranie bojowe, które opuszcza Twoją produkcję, ma jedno zadanie: przyprowadzić człowieka z powrotem. Wykonanie tego zadania spoczywa na tkaninie. Dlatego dostarczamy materiał spełniający najwyższe normy z dużym zapasem — by chronić ludzkie życie jeszcze lepiej.',
        en: 'Every set of turnout gear that leaves your production line has one job: to bring a person back. That job rests on the fabric. This is why we supply material that meets the highest standards with a wide margin — to protect human life even better.',
      },
      usp: {
        heading: { pl: 'Co wyróżnia nasze tkaniny bojowe', en: 'What sets our turnout fabrics apart' },
        items: [
          {
            title: { pl: '5 500 N przy 220 g/m²', en: '5,500 N at 220 g/m²' },
            text: {
              pl: 'Wytrzymałość na rozciąganie 5 500 N w osnowie i 5 000 N w wątku, na rozdarcie 270/310 N — przy gramaturze 220 g/m². Skład ArBo: 58% para-aramidu, 40% PBO i 2% włókna węglowego, z antystatyką potwierdzoną według EN 1149-5.',
              en: 'Tensile strength of 5,500 N in warp and 5,000 N in weft, tear strength of 270/310 N — at 220 g/m². The ArBo composition: 58% para-aramid, 40% PBO and 2% carbon fibre, with antistatic performance confirmed to EN 1149-5.',
            },
          },
          {
            title: { pl: 'Cały zestaw w jednej chemii włókna', en: 'The full kit in one fibre chemistry' },
            text: {
              pl: 'Od tkaniny wierzchniej, przez tkaniny odzieżowe 150–260 g/m², po dzianiny na mundury i odzież służbową: jersey, pique i polar FR. Kompletny system warstw ubioru strażaka od jednego producenta, na tej samej bazie aramidowej.',
              en: 'From the outer shell, through 150–260 g/m² garment fabrics, to station-wear knits: jersey, pique and FR fleece. The complete layer system of a firefighter’s kit from a single manufacturer, on the same aramid base.',
            },
          },
          {
            title: { pl: 'Antystatyka wpleciona, nie nakładana', en: 'Antistatic woven in, not applied' },
            text: {
              pl: '2% włókna węglowego w składzie każdej konstrukcji linii. Właściwości antystatyczne według EN 1149-5 są strukturą tkaniny — nie wykończeniem, które znika w praniu.',
              en: '2% carbon fibre in the composition of every construction in the line. Antistatic performance to EN 1149-5 is the structure of the fabric — not a finish that disappears in laundering.',
            },
          },
          {
            title: { pl: 'Odporność 4–5 w dziesięciu testach', en: 'Rated 4–5 in ten fastness tests' },
            text: {
              pl: 'Komplet odporności wybarwień ISO 105 na poziomie 4–5: pranie, tarcie, pot, światło, warunki atmosferyczne oraz podchloryn i nadtlenek — środki prania przemysłowego. Tkanina zachowuje właściwości i wygląd po agresywnym czyszczeniu poakcyjnym.',
              en: 'The complete ISO 105 colour-fastness battery at 4–5: laundering, rubbing, perspiration, light, weathering, plus hypochlorite and peroxide — the agents of industrial laundering. The fabric keeps its properties and appearance after aggressive post-incident cleaning.',
            },
          },
          {
            title: { pl: 'Stabilność wymiarowa ±3%', en: 'Dimensional stability of ±3%' },
            text: {
              pl: 'Zmiana wymiarów w praniu ograniczona do ±3% według EN ISO 5077 — dwukrotnie ciaśniej niż typowe ±5%. Dla krojowni: powtarzalna konfekcja. Do tego pH 4,0–7,0 i brak barwników azowych (EN ISO 14362-1) — bezpieczeństwo w wielogodzinnym kontakcie ze skórą.',
              en: 'Dimensional change in laundering limited to ±3% per EN ISO 5077 — twice as tight as the typical ±5%. For the cutting room: repeatable garment making. Plus pH 4.0–7.0 and no azo colorants (EN ISO 14362-1) — safe in hours-long skin contact.',
            },
          },
          {
            title: { pl: 'Raport z badań przy każdej partii', en: 'A test report with every batch' },
            text: {
              pl: 'Wytrzymałość (EN ISO 13934-1, EN ISO 13937-2) i komplet badań odporności wybarwień ISO 105 wykonywane we własnych laboratoriach. Dokument towarzyszy dostawie — gotowy do dokumentacji certyfikacyjnej Twojego wyrobu.',
              en: 'Strength (EN ISO 13934-1, EN ISO 13937-2) and the full ISO 105 battery tested in our own laboratories. The document travels with the delivery — ready for the certification file of your product.',
            },
          },
        ],
      },
      familiesHeading: { pl: 'Rodziny tkanin dla straży pożarnej', en: 'Fabric families for firefighting' },
      normsHeading: { pl: 'Badamy według norm', en: 'Tested to standards' },
      families: [
        {
          name: 'ArBo Plain',
          spec: '58% p-AR · 40% PBO · 2% CF · 220 g/m² · Plain',
          desc: {
            pl: 'Tkanina wierzchnia ubrań bojowych. Wytrzymałość na rozciąganie 5 500 / 5 000 N i rozdarcie 270 / 310 N przy 220 g/m² — najlepszy stosunek ochrony do wagi w kategorii. Wariant Dark w tym samym składzie.',
            en: 'The turnout-gear outer shell. Tensile strength of 5,500 / 5,000 N and tear strength of 270 / 310 N at 220 g/m² — the best protection-to-weight ratio in its class. A Dark variant shares the same composition.',
          },
          badges: ['EN 469', 'EN 1149-5'],
        },
        {
          name: 'ArBo Knit Pique',
          spec: '58% p-AR · 40% PBO · 2% CF · 250 g/m² · Pique',
          desc: {
            pl: 'Chemia włókien ArBo w formie dzianiny pique — na warstwy noszone bliżej ciała i odzież służbową, bez kompromisu w ognioodporności.',
            en: 'ArBo fibre chemistry in a pique knit — for next-to-skin layers and station wear, with no compromise on flame resistance.',
          },
          badges: ['EN ISO 11612'],
        },
        {
          name: 'Aramid D5 180 Rb',
          spec: '46% m-AR · 50% p-AR · 2% PBO · 2% CF · 180 g/m² · 2:2 Twill Ripstop',
          desc: {
            pl: 'Lekka tkanina wierzchnia w splocie ripstop blokującym propagację rozdarć — do lżejszych konstrukcji ubrań specjalnych i kominiarek.',
            en: 'A lightweight outer fabric in a ripstop weave that arrests tear propagation — for lighter protective garment constructions and hoods.',
          },
          badges: ['EN ISO 11612'],
        },
        {
          name: 'Aramid D50 Pique',
          spec: '93% m-AR · 5% p-AR · 2% CF · 220 g/m² · Pique',
          desc: {
            pl: 'Dzianina na koszulki i ubrania koszarowe: trwała trudnopalność meta-aramidu połączona z komfortem i oddychalnością dzianiny.',
            en: 'A knit for T-shirts and station wear: the inherent flame resistance of meta-aramid combined with knit comfort and breathability.',
          },
          badges: ['EN ISO 11612'],
        },
      ],
      norms: ['EN 469', 'EN ISO 11612', 'EN 1149-5', 'EN ISO 13934-1', 'EN ISO 13937-2'],
    },
  },
  {
    id: 'energy',
    slug: { pl: 'energetyka', en: 'energy' },
    name: { pl: 'Energetyka', en: 'Energy sector' },
    short: {
      pl: 'Ochrona przed łukiem elektrycznym i tkaniny antystatyczne. Rodzina ArWoWear EMK: ekranowanie EMI, ochrona przy wysokim napięciu.',
      en: 'Electric-arc protection and antistatic fabrics. The ArWoWear EMK family: EMI shielding and high-voltage protection.',
    },
    badges: ['EN 61482', 'EN 1149'],
    image: '/images/applications/energy.png',
    content: {
      heroTitle: { pl: 'Tkaniny do pracy pod napięciem', en: 'Fabrics for live-line work' },
      heroLead: {
        pl: 'Łuk elektryczny trwa ułamek sekundy i nie daje drugiej szansy. Odzież ochronna energetyka jest ostatnią barierą między człowiekiem a jego energią — i musi zadziałać za każdym razem, przez lata służby i setki prań. Produkujemy tkaniny, które tę odpowiedzialność udźwigną: trudnopalne, antystatyczne i ekranujące pola elektromagnetyczne.',
        en: 'An electric arc lasts a fraction of a second and offers no second chance. A power worker’s protective clothing is the last barrier between a person and its energy — and it must perform every single time, through years of service and hundreds of washes. We manufacture fabrics that carry that responsibility: flame retardant, antistatic and electromagnetic-shielding.',
      },
      usp: {
        heading: { pl: 'Co wyróżnia nasze tkaniny dla energetyki', en: 'What sets our energy-sector fabrics apart' },
        items: [
          {
            title: { pl: 'Odporność do 100 prań przemysłowych', en: 'Resistant to up to 100 industrial washes' },
            text: {
              pl: 'Linia Flame Arc Pro: bawełna barwiona kadziowo z deklarowaną odpornością do stu cykli prania. Koszt odzieży roboczej liczy się liczbą prań, które przetrwa — nie ceną metra.',
              en: 'The Flame Arc Pro line: vat-dyed cotton with a declared resistance of up to one hundred wash cycles. The cost of workwear is measured in the washes it survives — not in the price per metre.',
            },
          },
          {
            title: { pl: 'Ochrona przed łukiem w ośmiu gramaturach', en: 'Arc protection in eight weights' },
            text: {
              pl: 'Flame Arc Pro od 150 g/m² (splot plain na lato) po 360 g/m² (zima) — dobór tkaniny pod klasę ochrony i sezon, w składzie 99% bawełny z 1% włókna węglowego: komfort naturalnego włókna, antystatyka w strukturze.',
              en: 'Flame Arc Pro from 150 g/m² (a plain weave for summer) to 360 g/m² (winter) — fabric selection by protection class and season, in a 99% cotton / 1% carbon-fibre composition: natural-fibre comfort with antistatic built into the structure.',
            },
          },
          {
            title: { pl: 'Ekranowanie pól elektromagnetycznych', en: 'Electromagnetic field shielding' },
            text: {
              pl: 'ArWoWear T4 EMK i ArShirt EMK Pique: 20% włókna ze stali nierdzewnej wplecionego w tkaninę daje ekranowanie EMI, zastosowania antyradarowe i ochronę przy pracach pod wysokim napięciem — także w formie dzianiny na koszulki.',
              en: 'ArWoWear T4 EMK and ArShirt EMK Pique: 20% stainless-steel fibre woven into the fabric provides EMI shielding, anti-radar applications and protection for high-voltage work — including a knit version for shirts.',
            },
          },
          {
            title: { pl: 'Antystatyka w strukturze, nie w powłoce', en: 'Antistatic in the structure, not the coating' },
            text: {
              pl: 'Linia Static Pro: 1% włókna węglowego wplecionego w sześciu gramaturach od 200 do 360 g/m². Właściwości antystatycznych nie da się wyprać ani zetrzeć — są konstrukcją tkaniny.',
              en: 'The Static Pro line: 1% carbon fibre woven in, across six weights from 200 to 360 g/m². The antistatic properties cannot be washed or worn off — they are the construction of the fabric.',
            },
          },
          {
            title: { pl: 'Kompletny ubiór energetyka z jednego źródła', en: 'The complete power-worker outfit from one source' },
            text: {
              pl: 'Ubranie robocze (Flame Arc Pro), koszulka ekranująca (ArShirt EMK), ocieplenie trudnopalne (polar Moda Pro) i wariant chemoodporny (Chem Pro) — cały system warstw od jednego dostawcy, w spójnych reżimach ochrony.',
              en: 'Workwear (Flame Arc Pro), a shielding shirt (ArShirt EMK), flame-retardant insulation (Moda Pro fleece) and a chemical-resistant variant (Chem Pro) — the entire layer system from one supplier, under consistent protection regimes.',
            },
          },
          {
            title: { pl: 'Kolor odporny na chlor i słońce', en: 'Colour resistant to chlorine and sunlight' },
            text: {
              pl: 'Barwienie kadziowe — najodporniejsza metoda barwienia bawełny — utrzymuje kolor mimo prania przemysłowego ze środkami chlorowymi i pracy w pełnym słońcu. Odzież wygląda firmowo przez cały okres eksploatacji, nie tylko w dniu wydania.',
              en: 'Vat dyeing — the most durable method of dyeing cotton — holds the colour through industrial laundering with chlorine agents and work in full sunlight. The garment looks corporate throughout its service life, not just on issue day.',
            },
          },
        ],
      },
      familiesHeading: { pl: 'Rodziny tkanin dla energetyki', en: 'Fabric families for the energy sector' },
      normsHeading: { pl: 'Badamy według norm', en: 'Tested to standards' },
      families: [
        {
          name: 'ArWoWear Flame Arc Pro',
          spec: '99% CO · 1% CF · 150–360 g/m² · Plain / Twill',
          desc: {
            pl: 'Osiem wariantów trudnopalnej, antystatycznej bawełny barwionej kadziowo — od letniego splotu plain po ciężkie tkaniny zimowe. Odporność do 100 prań.',
            en: 'Eight variants of flame-retardant, antistatic vat-dyed cotton — from a summer plain weave to heavy winter fabrics. Resistant to up to 100 washes.',
          },
          badges: ['EN 61482', 'EN 1149'],
        },
        {
          name: 'ArWoWear T4 EMK',
          spec: '55% PES · 25% CO · 20% MTF · 200 g/m² · 2:1S Twill',
          desc: {
            pl: 'Tkanina ekranująca z włóknem ze stali nierdzewnej — ochrona przed polami elektromagnetycznymi i przy pracach pod wysokim napięciem.',
            en: 'A shielding fabric with stainless-steel fibre — protection against electromagnetic fields and for high-voltage work.',
          },
        },
        {
          name: 'ArShirt EMK Pique',
          spec: '80% PES · 20% MTF · 220 g/m² · Pique',
          desc: {
            pl: 'Dzianina ekranująca w splocie pique — koszulki i polo chroniące przed polami elektromagnetycznymi, noszone pod ubraniem roboczym.',
            en: 'A shielding pique knit — T-shirts and polos protecting against electromagnetic fields, worn under workwear.',
          },
        },
        {
          name: 'ArWoWear Static Pro',
          spec: '1% CF · 200–360 g/m² · 2:1S / 3:1S Twill',
          desc: {
            pl: 'Sześć antystatycznych tkanin roboczych z włóknem węglowym w strukturze — mieszanki bawełny i poliestru pod różne reżimy użytkowania.',
            en: 'Six antistatic workwear fabrics with carbon fibre in the structure — cotton and polyester blends for different service regimes.',
          },
          badges: ['EN 1149'],
        },
        {
          name: 'ArWoWear Chem Pro',
          spec: 'CO / PES · 200–360 g/m² · 2:1S / 3:1S Twill',
          desc: {
            pl: 'Tkaniny barwione kadziowo, odporne na chemikalia przemysłowe — sześć gramatur dla stanowisk łączących energetykę z chemią.',
            en: 'Vat-dyed fabrics resistant to industrial chemicals — six weights for workplaces where energy meets chemistry.',
          },
        },
        {
          name: 'Ar3iplik Moda Pro Fleece',
          spec: '60% MAC · 38% CO · 2% CF · 300 g/m² · Fleece',
          desc: {
            pl: 'Trudnopalny polar modakrylowy z włóknem węglowym — warstwa ocieplająca zgodna z reżimem FR całego ubioru.',
            en: 'A flame-retardant modacrylic fleece with carbon fibre — an insulation layer consistent with the FR regime of the full outfit.',
          },
        },
      ],
      norms: ['EN 61482', 'EN 1149', 'EN ISO 11612', 'EN ISO 13934-1'],
    },
  },
  {
    id: 'welding',
    slug: { pl: 'hutnictwo-i-spawalnictwo', en: 'metallurgy-and-welding' },
    name: { pl: 'Hutnictwo i spawalnictwo', en: 'Metallurgy and welding' },
    short: {
      pl: 'Tkaniny chroniące przed rozbryzgiem metalu, ciepłem i płomieniem: bawełna FR, mieszanki antystatyczne.',
      en: 'Fabrics protecting against metal splash, heat and flame: FR cotton and antistatic blends.',
    },
    badges: ['EN ISO 11611', 'EN ISO 11612'],
    image: '/images/applications/welding.png',
    content: {
      heroTitle: { pl: 'Zatrzymać płynny metal', en: 'Stopping molten metal' },
      heroLead: {
        pl: 'Zatrzymanie płynnego metalu to jedno z najtrudniejszych zadań, jakie można postawić tkaninie. W hucie i spawalni rozbryzg ciekłego metalu, iskry i promieniowanie cieplne to codzienne środowisko pracy. Dlatego skonstruowaliśmy materiały, które biorą to na siebie — od ciężkich satyn spawalniczych po pięciowłóknową tkaninę stworzoną na rozbryzg stopionego metalu — by chronić zdrowie ludzi pracujących najbliżej ognia.',
        en: 'Stopping molten metal is one of the hardest tasks a fabric can be given. In a steel mill or a welding shop, molten-metal splash, sparks and radiant heat are the everyday working environment. So we engineered materials that take it on — from heavy welding satins to a five-fibre fabric built for molten-metal splash — to protect the health of the people who work closest to fire.',
      },
      usp: {
        heading: { pl: 'Co wyróżnia nasze tkaniny dla hutnictwa i spawalnictwa', en: 'What sets our metallurgy and welding fabrics apart' },
        items: [
          {
            title: { pl: 'Zbudowana, żeby zatrzymać rozbryzg', en: 'Built to stop the splash' },
            text: {
              pl: 'ArD3E3: konstrukcja z pięciu włókien — wiskoza FR, poliamid 6.6, wełna, p-aramid i włókno węglowe — w splocie satynowym 350 g/m². Wełna i gładkie lico satyny zrzucają ciekły metal, zanim odda ciepło w głąb materiału.',
              en: 'ArD3E3: a five-fibre construction — FR viscose, polyamide 6.6, wool, para-aramid and carbon fibre — in a 350 g/m² satin weave. Wool and the smooth satin face shed liquid metal before it can drive heat into the material.',
            },
          },
          {
            title: { pl: 'Waga ciężka wśród tkanin spawalniczych', en: 'The heavyweight class of welding fabrics' },
            text: {
              pl: 'Flame Pro T12 (450 g/m², satyna 4:1) i T13 (520 g/m², satyna 5:2): trudnopalna bawełna o gładkim licu, po którym iskry i żużel się ześlizgują — na stanowiska o najwyższej ekspozycji.',
              en: 'Flame Pro T12 (450 g/m², 4:1 satin) and T13 (520 g/m², 5:2 satin): flame-retardant cotton with a smooth face that lets sparks and slag slide off — for the highest-exposure workstations.',
            },
          },
          {
            title: { pl: 'Do 100 prań z utrzymaniem odporności', en: 'Up to 100 washes with protection retained' },
            text: {
              pl: 'Dziewięć wariantów linii Flame Pro barwionych kadziowo: gramatura dobrana pod stanowisko, od 220 do 520 g/m² — a deklarowana odporność do stu cykli prania ustawia koszt eksploatacji, nie cenę metra.',
              en: 'Nine variants of the vat-dyed Flame Pro line: the weight matched to the workstation, from 220 to 520 g/m² — and a declared resistance of up to one hundred wash cycles that sets the cost of ownership, not the price per metre.',
            },
          },
          {
            title: { pl: 'Brak topliwości w najtrudniejszych warunkach', en: 'No melting in the harshest conditions' },
            text: {
              pl: 'Aramid D0–D3, 150–260 g/m²: włókno aramidowe w kontakcie z ogniem zwęgla się powierzchniowo, zachowując ciągłość materiału — bez ryzyka wtórnych poparzeń stopionym tworzywem, typowego dla zwykłych syntetyków. Wariant D3 z udziałem p-aramidu podwyższonym do 23%.',
              en: 'Aramid D0–D3, 150–260 g/m²: on contact with fire, aramid fibre chars at the surface while the material keeps its integrity — none of the secondary burns from molten polymer typical of ordinary synthetics. The D3 variant raises the para-aramid share to 23%.',
            },
          },
          {
            title: { pl: 'Pełna ochrona z zachowaniem oddychalności', en: 'Full protection that still breathes' },
            text: {
              pl: 'Aramid Vis: 53% wiskozy FR w tkaninach 150 i 250 g/m² oraz dzianinach jersey, pique i polar. Wiskoza odprowadza wilgoć przy pracy w wysokiej temperaturze — warstwa spodnia w tym samym reżimie FR co ubranie wierzchnie.',
              en: 'Aramid Vis: 53% FR viscose in 150 and 250 g/m² wovens and in jersey, pique and fleece knits. Viscose wicks moisture during work in high temperatures — a base layer under the same FR regime as the outer garment.',
            },
          },
          {
            title: { pl: 'Odporność mechaniczna bez kompromisów', en: 'Mechanical durability without compromise' },
            text: {
              pl: 'Warianty T30 i T31: domieszka 10% poliamidu 6.6 w trudnopalnej bawełnie podnosi odporność na ścieranie w strefach kontaktu z konstrukcją — kolana, przedramiona, uda — bez zmiany reżimu trudnopalności.',
              en: 'The T30 and T31 variants: a 10% polyamide 6.6 share in flame-retardant cotton raises abrasion resistance in the zones that contact the structure — knees, forearms, thighs — without changing the flame-retardant regime.',
            },
          },
        ],
      },
      familiesHeading: { pl: 'Rodziny tkanin dla hutnictwa i spawalnictwa', en: 'Fabric families for metallurgy and welding' },
      normsHeading: { pl: 'Badamy według norm', en: 'Tested to standards' },
      families: [
        {
          name: 'ArD3E3',
          spec: '54% CV FR · 20% PA 6.6 · 20% WO · 5% p-AR · 1% CF · 350 g/m² · Satin',
          desc: {
            pl: 'Jedyna w ofercie tkanina dedykowana ochronie przed rozbryzgiem stopionego metalu — pięć włókien i satynowe lico, które zrzuca ciekły metal.',
            en: 'The only fabric in the range dedicated to molten-metal splash protection — five fibres and a satin face that sheds liquid metal.',
          },
        },
        {
          name: 'ArWoWear Flame Pro Satin',
          spec: '100% CO · 450–520 g/m² · 4:1 / 5:2 Satin',
          desc: {
            pl: 'Ciężkie satyny spawalnicze T12 i T13 — gładkie lico zrzuca iskry i żużel; najwyższa klasa gramatur w linii.',
            en: 'Heavy welding satins T12 and T13 — a smooth face that sheds sparks and slag; the heaviest weights in the line.',
          },
        },
        {
          name: 'ArWoWear Flame Pro Twill',
          spec: '100% CO / CO-PES / CO-PA · 220–360 g/m² · 2:1S / 3:1S Twill',
          desc: {
            pl: 'Trzon linii spawalniczej: warianty czysto bawełniane oraz mieszanki z poliestrem i poliamidem — wszystkie barwione kadziowo, do 100 prań.',
            en: 'The core of the welding line: pure-cotton variants and blends with polyester and polyamide — all vat dyed, resistant to up to 100 washes.',
          },
        },
        {
          name: 'Aramid D0–D3',
          spec: '93% m-AR · 5% p-AR · 2% CF · 150–260 g/m² · Plain / Twill',
          desc: {
            pl: 'Trwale trudnopalne tkaniny aramidowe — nie topią się w kontakcie z żarem. Wariant D3: 75% m-AR / 23% p-AR przy 200 g/m².',
            en: 'Inherently flame-retardant aramid fabrics — they do not melt on contact with heat. The D3 variant: 75% m-AR / 23% p-AR at 200 g/m².',
          },
        },
        {
          name: 'Aramid Vis',
          spec: '53% CV FR · 40% m-AR · 5% p-AR · 2% CF · 150 / 250 g/m² · Plain / Twill',
          desc: {
            pl: 'Tkaniny z wiskozą FR — oddychająca ochrona na warstwy pod ubraniem ciężkim i na lżejsze stanowiska gorące.',
            en: 'FR-viscose fabrics — breathable protection for layers under heavy garments and for lighter hot-work stations.',
          },
        },
        {
          name: 'Aramid Vis Knit',
          spec: '53% CV FR · 40% m-AR · 5% p-AR · 2% CF · 220–300 g/m² · Jersey / Pique / Fleece',
          desc: {
            pl: 'Jersey (ArSuprem), pique (ArShirt) i polar (Ar3iplik) w chemii Aramid Vis — komplet warstw spodnich w jednym reżimie FR.',
            en: 'Jersey (ArSuprem), pique (ArShirt) and fleece (Ar3iplik) in Aramid Vis chemistry — the full set of base layers under one FR regime.',
          },
        },
      ],
      norms: ['EN ISO 11611', 'EN ISO 11612', 'EN ISO 13934-1', 'EN ISO 105 C06'],
    },
  },
  {
    id: 'motorcycle',
    slug: { pl: 'odziez-motocyklowa', en: 'motorcycle-apparel' },
    name: { pl: 'Odzież motocyklowa', en: 'Motorcycle apparel' },
    short: {
      pl: 'Tkaniny ArDura (PA 6.6) i denim odporny na ścieranie. Produkcja na bazie włókien CORDURA®.',
      en: 'ArDura (PA 6.6) fabrics and abrasion-resistant denim. Manufactured with CORDURA® fibres.',
    },
    badges: ['CORDURA®'],
    image: '/images/applications/motorcycle.png',
    content: {
      heroTitle: { pl: 'Druga skóra motocyklisty', en: 'A motorcyclist’s second skin' },
      heroLead: {
        pl: 'Przy upadku z motocykla między ciałem człowieka a asfaltem zostaje tylko tkanina. Sekundy ślizgu decydują, czy kierowca wstanie — i to one wyznaczają nasz standard. Produkujemy materiały o ekstremalnej odporności na ścieranie: od tkanin z poliamidu 6.6 wysokiej wytrzymałości, przez motocyklowy denim, po dzianiny elastyczne — także na licencji CORDURA®.',
        en: 'In a motorcycle crash, all that remains between a person’s body and the asphalt is fabric. The seconds of a slide decide whether the rider gets up — and they set our standard. We manufacture materials of extreme abrasion resistance: from high-tenacity polyamide 6.6 wovens, through motorcycle denim, to stretch knits — including fabrics made under CORDURA® license.',
      },
      usp: {
        heading: { pl: 'Co wyróżnia nasze tkaniny motocyklowe', en: 'What sets our motorcycle fabrics apart' },
        items: [
          {
            title: { pl: 'Wojskowe technologie w cywilnym zastosowaniu', en: 'Military technology in civilian use' },
            text: {
              pl: 'ArDura to ta sama linia, którą katalogujemy do mundurów policyjnych i kombinezonów pirotechnicznych: wysokowytrzymały poliamid 6.6, gramatury 215–350 g/m², sploty plain, twill, ripstop i jodełka. Motocyklista dostaje surowiec sprawdzony tam, gdzie stawka jest najwyższa.',
              en: 'ArDura is the same line we catalogue for police uniforms and bomb-disposal suits: high-tenacity polyamide 6.6 in weights of 215–350 g/m² and plain, twill, ripstop and herringbone weaves. The rider gets a material proven where the stakes are highest.',
            },
          },
          {
            title: { pl: 'Najwyższa odporność w estetyce jeansu', en: 'The highest resistance in a denim look' },
            text: {
              pl: 'ArGiyim Dura: 50% poliamidu 6.6 wplecione w klasyczny dżinsowy twill 245 g/m². Odzież, która na mieście wygląda jak jeansy — a na asfalcie zachowuje się jak tkanina techniczna.',
              en: 'ArGiyim Dura: a 50% share of polyamide 6.6 woven into a classic denim twill at 245 g/m². Garments that look like jeans in the city — and behave like a technical fabric on the asphalt.',
            },
          },
          {
            title: { pl: 'Licencjonowana produkcja CORDURA®', en: 'Licensed CORDURA® manufacturing' },
            text: {
              pl: 'Tkaniny na oryginalnych włóknach CORDURA® (INVISTA) produkowane na podstawie licencji właściciela znaku — marka, którą Twój klient zna z metki najlepszej odzieży motocyklowej, nie zamiennik „w typie”.',
              en: 'Fabrics built on original CORDURA® fibres (INVISTA), manufactured under license from the trademark owner — the brand your customer knows from the labels of the best motorcycle apparel, not a look-alike substitute.',
            },
          },
          {
            title: { pl: 'Elastyczność, która nie jest kompromisem', en: 'Stretch that is not a compromise' },
            text: {
              pl: 'ArMoto Dura: dzianina osnowowa w 100% z poliamidu 6.6, 240 g/m². Strefy wymagające ruchu — plecy, ramiona, kroki — zostają w tej samej klasie odporności co reszta kombinezonu.',
              en: 'ArMoto Dura: a warp knit in 100% polyamide 6.6 at 240 g/m². The zones that need movement — back, shoulders, crotch — stay in the same resistance class as the rest of the suit.',
            },
          },
          {
            title: { pl: 'Rozdarcie zatrzymane w miejscu', en: 'A tear stopped in its tracks' },
            text: {
              pl: 'Warianty Rb linii ArDura w splocie ripstop: siatka wzmocnień zatrzymuje propagację rozdarcia — punktowe przebicie nie rozpruwa całej nogawki w ślizgu.',
              en: 'The Rb variants of the ArDura line in a ripstop weave: the reinforcement grid arrests tear propagation — a point puncture does not unzip the whole trouser leg in a slide.',
            },
          },
          {
            title: { pl: 'HPPE, gdy poliamid to za mało', en: 'HPPE, for when polyamide is not enough' },
            text: {
              pl: 'Linia Kursun: denim z 50% udziałem wysokowytrzymałego polietylenu, 290 g/m², a w splocie podwójnym 620 g/m² — półka odporności dla odzieży klasy premium.',
              en: 'The Kursun line: denim with a 50% share of high-performance polyethylene at 290 g/m², and 620 g/m² in a double weave — the resistance tier for premium apparel.',
            },
          },
        ],
      },
      familiesHeading: { pl: 'Rodziny tkanin motocyklowych', en: 'Motorcycle fabric families' },
      normsHeading: { pl: 'Badamy według norm', en: 'Tested to standards' },
      families: [
        {
          name: 'ArDura 500 C',
          spec: '100% PA 6.6 · 215 g/m² · Plain / Ripstop / Twill',
          desc: {
            pl: 'Bazowa tkanina odzieży motocyklowej — trzy sploty do wyboru, w tym ripstop zatrzymujący rozdarcia.',
            en: 'The base motorcycle-apparel fabric — three weaves to choose from, including a tear-arresting ripstop.',
          },
        },
        {
          name: 'ArDura 1000 C',
          spec: '100% PA 6.6 · 300 g/m² · Plain / Ripstop',
          desc: {
            pl: 'Cięższa odmiana linii — strefy ślizgu i elementy odzieży o najwyższej ekspozycji na ścieranie.',
            en: 'The heavier variant of the line — slide zones and garment areas with the highest abrasion exposure.',
          },
        },
        {
          name: 'ArDura FR',
          spec: '95% PA 6.6 · 5% PU · 240–350 g/m² · Plain',
          desc: {
            pl: 'Trudnopalne wersje tkanin bazowych — dla odzieży łączącej odporność mechaniczną z ochroną przed płomieniem.',
            en: 'Flame-retardant versions of the base fabrics — for apparel combining mechanical resistance with flame protection.',
          },
        },
        {
          name: 'ArGiyim Dura Denim',
          spec: '50% PA 6.6 · 50% CO · 245 g/m² · Twill',
          desc: {
            pl: 'Motocyklowy denim: wygląd klasycznych jeansów, odporność na ścieranie tkaniny technicznej.',
            en: 'Motorcycle denim: the look of classic jeans, the abrasion resistance of a technical fabric.',
          },
        },
        {
          name: 'ArMoto Dura',
          spec: '100% PA 6.6 · 240 g/m² · Warp Knit',
          desc: {
            pl: 'Dzianina osnowowa z poliamidu 6.6 — elastyczne panele kombinezonów bez zejścia z klasy odporności.',
            en: 'A polyamide 6.6 warp knit — stretch suit panels without stepping down in resistance class.',
          },
        },
        {
          name: 'ArGiyim Denim Kursun',
          spec: '50% HPPE · 50% PES · 290 g/m² · Twill',
          desc: {
            pl: 'Denim z włóknem HPPE — najwyższa półka odporności na ścieranie. Wariant CK: 620 g/m² w splocie podwójnym.',
            en: 'A denim with HPPE fibre — the top tier of abrasion resistance. The CK variant: 620 g/m² in a double weave.',
          },
        },
      ],
      norms: ['EN ISO 12947-1', 'EN ISO 13934-1', 'EN ISO 13937-2', 'EN ISO 105 B02'],
    },
  },
  {
    id: 'hivis',
    slug: { pl: 'odziez-ostrzegawcza', en: 'high-visibility' },
    name: { pl: 'Odzież ostrzegawcza hi-vis', en: 'High-visibility apparel' },
    short: {
      pl: 'Rodzina dzianin ArNeo — ponad 15 wariantów tkanin fluorescencyjnych, także w wersji trudnopalnej.',
      en: 'The ArNeo family — over 15 fluorescent warp knit variants, including flame-retardant versions.',
    },
    badges: ['EN ISO 20471', 'EN ISO 14116'],
    image: '/images/applications/hivis.png',
    content: {
      heroTitle: { pl: 'Widoczność bez kompromisów', en: 'Visibility without compromise' },
      heroLead: {
        pl: 'Odzież ostrzegawcza ma jedno zadanie: sprawić, żeby człowiek został zauważony, zanim będzie za późno. Sekunda, o którą kierowca wcześniej dostrzeże pracownika przy drodze, robi całą różnicę. Dlatego produkujemy dzianiny fluorescencyjne z certyfikatem EN ISO 20471 — o kolorze, który nie gaśnie w praniu i słońcu.',
        en: 'High-visibility clothing has one job: to get a person noticed before it is too late. The second by which a driver spots a road worker earlier makes all the difference. That is why we manufacture fluorescent warp knits certified to EN ISO 20471 — in colours that do not fade in laundering or sunlight.',
      },
      usp: {
        heading: { pl: 'Co wyróżnia nasze dzianiny ostrzegawcze', en: 'What sets our high-visibility knits apart' },
        items: [
          {
            title: { pl: 'Piętnaście wariantów, 70–150 g/m²', en: 'Fifteen variants, 70–150 g/m²' },
            text: {
              pl: 'Rodzina ArNeo: dzianiny osnowowe plain i siatki 5:1, od 70 g/m² na lekkie kamizelki po 150 g/m² na kurtki. Jedna linia zamyka pełen przekrój odzieży ostrzegawczej.',
              en: 'The ArNeo family: plain warp knits and 5:1 mesh, from 70 g/m² for light vests to 150 g/m² for jackets. One line covers the full spectrum of high-visibility apparel.',
            },
          },
          {
            title: { pl: 'Kolor zgodny z normą — za każdym razem', en: 'Colour within the standard — every time' },
            text: {
              pl: 'Żółty, pomarańczowy i czerwony (w linii Eco także zielony) barwione według archiwizowanych receptur. Chromatyczność pozostaje w widełkach EN ISO 20471 w każdej kolejnej partii — doskonała powtarzalność między zamówieniami, bez ryzyka odcienia poza normą.',
              en: 'Yellow, orange and red (plus green in the Eco line) dyed to archived recipes. Chromaticity stays within the EN ISO 20471 window in every subsequent batch — exact repeatability between orders, with no risk of an off-standard shade.',
            },
          },
          {
            title: { pl: 'Fluorescencja plus trudnopalność', en: 'Fluorescence plus flame retardancy' },
            text: {
              pl: 'ArNeo Pro łączy EN ISO 20471 z trudnopalnością według EN ISO 14116, odporną na 10 cykli prania — standard odzieży obsługi płyt lotniskowych. Wariant Flame Static Pro dokłada 1% włókna węglowego dla antystatyki.',
              en: 'ArNeo Pro combines EN ISO 20471 with flame retardancy to EN ISO 14116, resistant to 10 wash cycles — the standard for airport apron crews. The Flame Static Pro variant adds 1% carbon fibre for antistatic performance.',
            },
          },
          {
            title: { pl: 'Fluorescencja na 100% bawełnie', en: 'Fluorescence on 100% cotton' },
            text: {
              pl: 'Własna metoda barwienia fluorescencyjnego dzianin i tkanin z bawełny i wiskozy: koszulki polo hi-vis w komforcie naturalnego włókna (ArShirt Neo Pique, 220 g/m²).',
              en: 'A proprietary fluorescent dyeing method for cotton and viscose knits and wovens: hi-vis polo shirts with the comfort of a natural fibre (ArShirt Neo Pique, 220 g/m²).',
            },
          },
          {
            title: { pl: 'Kolor odporny na eksploatację', en: 'Colour that survives service' },
            text: {
              pl: 'Odporności wybarwień 4–5 według ISO 105: pranie, tarcie, pot, podchloryn. Do tego pH 6,2 i brak barwników azowych (EN ISO 14362-1) — przy odzieży noszonej na gołe ciało latem.',
              en: 'Colour fastness of 4–5 to ISO 105: laundering, rubbing, perspiration, hypochlorite. Plus pH 6.2 and no azo colorants (EN ISO 14362-1) — for garments worn next to skin in summer.',
            },
          },
          {
            title: { pl: 'Dokumentacja do oceny zgodności wyrobu', en: 'Documentation for conformity assessment' },
            text: {
              pl: 'Kartę techniczną tkaniny, certyfikat TS EN ISO 20471 i raport z badań otrzymujesz przed złożeniem zamówienia — komplet, którego jednostka notyfikowana wymaga przy badaniu typu UE odzieży ostrzegawczej.',
              en: 'The fabric’s technical data sheet, its TS EN ISO 20471 certificate and the test report are provided before you place an order — the set a notified body requires for EU type-examination of high-visibility apparel.',
            },
          },
        ],
      },
      familiesHeading: { pl: 'Rodziny dzianin ostrzegawczych', en: 'High-visibility knit families' },
      normsHeading: { pl: 'Badamy według norm', en: 'Tested to standards' },
      families: [
        {
          name: 'ArNeo Eco',
          spec: '100% PES · 120 g/m² · Warp Knit Plain',
          desc: {
            pl: 'Najpopularniejsza dzianina na kamizelki ostrzegawcze. Wytrzymałość na przepuklenie min. 1 000 kPa, cztery certyfikowane kolory: żółty, zielony, pomarańczowy i czerwony.',
            en: 'The most popular knit for safety vests. Bursting strength of min. 1,000 kPa and four certified colours: yellow, green, orange and red.',
          },
          badges: ['EN ISO 20471'],
        },
        {
          name: 'ArNeo Pro',
          spec: '100% PES · 150 g/m² · Warp Knit Plain',
          desc: {
            pl: 'Fluorescencja połączona z trudnopalnością odporną na 10 cykli prania — wybór producentów odzieży dla obsługi płyt lotniskowych. Kolory: żółty, pomarańczowy, czerwony.',
            en: 'Fluorescence combined with flame retardancy resistant to 10 wash cycles — the choice for airport apron crew apparel. Colours: yellow, orange, red.',
          },
          badges: ['EN ISO 20471', 'EN ISO 14116'],
        },
        {
          name: 'ArNeo Flame Static Pro',
          spec: '99% PES · 1% CF · 150 g/m² · Warp Knit Plain',
          desc: {
            pl: 'Wariant trudnopalny z włóknem węglowym w strukturze dzianiny — dla stanowisk, gdzie widoczność spotyka się z wymogiem antystatyki.',
            en: 'A flame-retardant variant with carbon fibre in the knit structure — for workplaces where visibility meets an antistatic requirement.',
          },
          badges: ['EN ISO 20471', 'EN ISO 14116'],
        },
        {
          name: 'ArNeo File 5:1',
          spec: '100% PES · 120 g/m² · Mesh 5:1',
          desc: {
            pl: 'Siatka ostrzegawcza — wentylowane kamizelki nakładane na odzież roboczą latem i zimą, bez przegrzewania użytkownika.',
            en: 'A high-visibility mesh — ventilated vests worn over workwear in summer and winter without overheating the wearer.',
          },
          badges: ['EN ISO 20471'],
        },
        {
          name: 'ArNeo Light',
          spec: '100% PES · 70 g/m² · Warp Knit Plain',
          desc: {
            pl: 'Najlżejsza dzianina rodziny — kamizelki podstawowe i odzież ostrzegawcza produkowana wysokonakładowo, przy minimalnym zużyciu surowca.',
            en: 'The lightest knit in the family — basic vests and high-volume high-visibility apparel with minimal material use.',
          },
          badges: ['EN ISO 20471'],
        },
        {
          name: 'ArShirt Neo Pique',
          spec: '100% CO · 220 g/m² · Pique',
          desc: {
            pl: 'Fluorescencyjna bawełna barwiona własną metodą — koszulki polo hi-vis w komforcie naturalnego włókna.',
            en: 'Fluorescent cotton dyed with a proprietary method — hi-vis polo shirts with the comfort of a natural fibre.',
          },
        },
      ],
      norms: ['EN ISO 20471', 'EN ISO 14116', 'EN ISO 13938-1', 'EN ISO 5077', 'EN ISO 14362-1'],
    },
  },
  {
    id: 'medical',
    slug: { pl: 'medycyna', en: 'medical' },
    name: { pl: 'Medycyna', en: 'Medical' },
    short: {
      pl: 'Tkaniny antywirusowe i antybakteryjne na odzież medyczną wielokrotnego użytku oraz tkaniny barierowe.',
      en: 'Antiviral and antibacterial fabrics for reusable medical wear, plus barrier fabrics.',
    },
    badges: ['ISO 18184', 'EN 14126'],
    image: '/images/applications/medical.png',
    content: {
      heroTitle: {
        pl: 'Bariera dla zakażeń, komfort dla personelu',
        en: 'A barrier to infection, comfort for staff',
      },
      heroLead: {
        pl: 'Odzież i wyroby medyczne stoją między czynnikiem zakaźnym a człowiekiem — personelem i pacjentem zarazem. Materiał musi zatrzymać drobnoustroje, wytrzymać dziesiątki cykli dezynfekcji i pozostać wygodny przez dwunastogodzinny dyżur. Produkujemy tkaniny, które łączą te wymagania: antywirusowe i chroniące przed zakażeniem, wytrzymałe na pranie przemysłowe, wygodne i schludne przez cały okres używania — na odzież wielorazową, która obniża koszt i ślad środowiskowy szpitala.',
        en: 'Medical clothing and products stand between an infectious agent and a person — both staff and patient. The material has to stop microbes, withstand dozens of disinfection cycles and stay comfortable through a twelve-hour shift. We manufacture fabrics that combine these demands: antiviral and infection-protective, durable through industrial laundering, comfortable and neat throughout their service life — for reusable clothing that lowers a hospital’s cost and environmental footprint.',
      },
      usp: {
        heading: {
          pl: 'Co wyróżnia nasze tkaniny medyczne',
          en: 'What sets our medical fabrics apart',
        },
        items: [
          {
            title: {
              pl: 'Antywirusowość z jedenastu lat badań',
              en: 'Antiviral performance from eleven years of research',
            },
            text: {
              pl: 'Tkaniny antywirusowe Ariteks to efekt jedenastu lat prac badawczo-rozwojowych, wprowadzony na rynek w 2020 roku. Skuteczność potwierdzana według ISO 18184 — norma mierzy realną redukcję wirusa na powierzchni materiału, nie samą obecność substancji czynnej.',
              en: 'Ariteks antiviral fabrics are the result of eleven years of research and development, brought to market in 2020. Effectiveness is confirmed to ISO 18184 — a standard that measures the actual reduction of virus on the material surface, not merely the presence of an active substance.',
            },
          },
          {
            title: {
              pl: 'Srebro wprzędzone, nie naniesione',
              en: 'Silver spun in, not applied',
            },
            text: {
              pl: 'ArShirt Antiviral Pique i linia ArMedi zawierają włókno srebra (Ag) w przędzy — działanie antywirusowe i antybakteryjne jest częścią struktury dzianiny, więc nie słabnie z każdym praniem, jak wykończenie powierzchniowe.',
              en: 'ArShirt Antiviral Pique and the ArMedi line contain silver fibre (Ag) in the yarn — the antiviral and antibacterial action is part of the knit structure, so it does not weaken with every wash, unlike a surface finish.',
            },
          },
          {
            title: {
              pl: 'Bariera dla czynników zakaźnych',
              en: 'A barrier to infectious agents',
            },
            text: {
              pl: 'Tkaniny wodoodporne Arox WR WP (75% PES / 25% PU) tworzą barierę przed przenikaniem drobnoustrojów wraz z płynami ustrojowymi — na fartuchy izolacyjne i odzież ochronną personelu, badane według EN 14126.',
              en: 'Water-repellent Arox WR WP fabrics (75% PES / 25% PU) form a barrier against microbes penetrating with body fluids — for isolation gowns and staff protective clothing, tested to EN 14126.',
            },
          },
          {
            title: {
              pl: 'Elastyczność na ortezy i maski',
              en: 'Stretch for orthoses and masks',
            },
            text: {
              pl: 'ArPower Knit: dzianiny interlock 350–400 g/m² z elastanem — ultraelastyczna baza pod ortezy, gorsety i maski wielorazowe, które muszą przylegać, nie uciskając.',
              en: 'ArPower Knit: interlock knits of 350–400 g/m² with elastane — an ultra-elastic base for orthoses, corsets and reusable masks that must fit closely without constricting.',
            },
          },
          {
            title: {
              pl: 'Komfort na dwunastogodzinny dyżur',
              en: 'Comfort for a twelve-hour shift',
            },
            text: {
              pl: 'Tkaniny na bluzy i koszule medyczne (ArWoWear Soft, 80% bawełny) łączą oddychalność naturalnego włókna z wytrzymałością na pranie przemysłowe — odzież noszona przez całą zmianę bez dyskomfortu.',
              en: 'Fabrics for scrubs and medical shirts (ArWoWear Soft, 80% cotton) combine the breathability of a natural fibre with resistance to industrial laundering — clothing worn through the whole shift without discomfort.',
            },
          },
          {
            title: {
              pl: 'Wielorazowość policzona w raportach',
              en: 'Reusability quantified in reports',
            },
            text: {
              pl: 'Ariteks udokumentował analizy porównawcze fartuchów izolacyjnych i masek wielorazowych względem jednorazowych — koszt i wpływ środowiskowy po stronie tkaniny wielokrotnego użytku. Dostawca, który dostarcza nie tylko materiał, ale i argument za nim.',
              en: 'Ariteks has documented comparative analyses of reusable isolation gowns and masks against single-use ones — cost and environmental impact favouring the reusable fabric. A supplier that delivers not only the material, but the argument for it.',
            },
          },
        ],
      },
      familiesHeading: {
        pl: 'Rodziny tkanin medycznych',
        en: 'Medical fabric families',
      },
      normsHeading: {
        pl: 'Badamy według norm',
        en: 'Tested to standards',
      },
      families: [
        {
          name: 'ArShirt Antiviral Pique',
          spec: '99% CO · 1% Ag · 220 g/m² · Pique',
          desc: {
            pl: 'Dzianina antywirusowa ze srebrem w przędzy — na bluzy i koszule medyczne wielokrotnego użytku.',
            en: 'An antiviral knit with silver in the yarn — for reusable scrubs and medical shirts.',
          },
          badges: ['ISO 18184'],
        },
        {
          name: 'ArMedi 1',
          spec: '75% PES · 25% CV · 180 g/m² · Plain',
          desc: {
            pl: 'Antybakteryjna tkanina ze srebrem — lekka baza na odzież medyczną i pościel szpitalną.',
            en: 'An antibacterial fabric with silver — a lightweight base for medical wear and hospital linen.',
          },
          badges: ['ISO 20743'],
        },
        {
          name: 'Arox WR WP',
          spec: '75% PES · 25% PU · 70–120 g/m² · Plain',
          desc: {
            pl: 'Wodoodporna tkanina barierowa — ochrona przed przenikaniem czynników zakaźnych na fartuchy izolacyjne.',
            en: 'A water-repellent barrier fabric — protection against infectious-agent penetration for isolation gowns.',
          },
          badges: ['EN 14126'],
        },
        {
          name: 'ArWoWear T4 Antibac',
          spec: '63% PES · 34% CO · 3% Ag · 200 g/m² · Twill',
          desc: {
            pl: 'Antybakteryjny twill ze srebrem — na odzież personelu o podwyższonej higienie.',
            en: 'An antibacterial silver twill — for staff clothing with heightened hygiene requirements.',
          },
          badges: ['ISO 20743'],
        },
        {
          name: 'ArPower Knit',
          spec: 'PES / PA6 / EL · 350–400 g/m² · Interlock',
          desc: {
            pl: 'Ultraelastyczna dzianina interlock — na ortezy, gorsety i maski wielorazowe wymagające przylegania.',
            en: 'An ultra-elastic interlock knit — for orthoses, corsets and reusable masks that need a close fit.',
          },
        },
        {
          name: 'ArWoWear T0 Soft',
          spec: '80% CO · 20% PES · 130 g/m² · Twill',
          desc: {
            pl: 'Miękka tkanina bawełniana na bluzy i koszule medyczne — komfort na całą zmianę, odporność na pranie przemysłowe.',
            en: 'A soft cotton fabric for scrubs and medical shirts — all-shift comfort with resistance to industrial laundering.',
          },
        },
      ],
      norms: ['ISO 18184', 'ISO 20743', 'EN 14126', 'EN 14683'],
    },
  },
  {
    id: 'sport',
    slug: { pl: 'sport', en: 'sport' },
    name: { pl: 'Sport', en: 'Sport' },
    short: {
      pl: 'Dzianiny funkcyjne: oddychające, szybkoschnące, z ochroną UV i wykończeniem antybakteryjnym.',
      en: 'Functional knits: breathable, quick-drying, with UV protection and antibacterial finishes.',
    },
    badges: ['OEKO-TEX'],
    image: '/images/applications/sport.png',
    content: {
      heroTitle: {
        pl: 'Zbudowane do ruchu',
        en: 'Built for movement',
      },
      heroLead: {
        pl: 'Odzież sportowa pracuje razem z ciałem — odprowadza pot, oddycha podczas wysiłku i rozciąga się w każdym ruchu, nie tracąc kształtu. My dostarczamy tkaninę, która to udźwignie przez setki treningów i prań: dzianiny funkcyjne, siatki wentylujące i lekkie interlocki, z wykończeniami dobieranymi pod dyscyplinę.',
        en: 'Sportswear works together with the body — it wicks sweat, breathes under exertion and stretches with every movement without losing shape. We supply the fabric that carries all of it through hundreds of workouts and washes: functional knits, ventilating mesh and lightweight interlocks, with finishes matched to the discipline.',
      },
      usp: {
        heading: {
          pl: 'Co wyróżnia nasze tkaniny sportowe',
          en: 'What sets our sports fabrics apart',
        },
        items: [
          {
            title: {
              pl: 'Jedna dzianina, wiele zastosowań',
              en: 'One knit, many uses',
            },
            text: {
              pl: 'Koszulka, spodenki, bluza i wentylowane wstawki z jednej, spójnej palety dzianin poliestrowych — te same parametry, ten sam odcień i ta sama kurczliwość w całym komplecie, od interlocku 140 g/m² po siatkę 3D.',
              en: 'A shirt, shorts, a hoodie and ventilating panels from one consistent palette of polyester knits — the same parameters, the same shade and the same shrinkage across the whole set, from a 140 g/m² interlock to a 3D mesh.',
            },
          },
          {
            title: {
              pl: '50 000 cykli w teście ścieralności',
              en: '50,000 cycles in the abrasion test',
            },
            text: {
              pl: 'Siatka AroF przechodzi 50 000 obrotów Martindale (EN 530) — trwałość, która utrzymuje odzież sportową w formie mimo intensywnego użytkowania i częstego prania.',
              en: 'The AroF mesh passes 50,000 Martindale rubs (EN 530) — durability that keeps sportswear in shape despite intense use and frequent laundering.',
            },
          },
          {
            title: {
              pl: 'Przewiew tam, gdzie ciało grzeje się najmocniej',
              en: 'Airflow where the body runs hottest',
            },
            text: {
              pl: 'Rodzina siatek od 55 do 420 g/m²: lekkie AroF pod pachy i plecy, ciężkie ArHard Mesh 3D na strefy wymagające struktury i wentylacji — przepuszczalność powietrza dobrana do mapy ciepła sylwetki.',
              en: 'A mesh family from 55 to 420 g/m²: light AroF for underarms and back, heavy ArHard Mesh 3D for zones that need structure and ventilation — air permeability matched to the body’s heat map.',
            },
          },
          {
            title: {
              pl: 'Skuteczne odprowadzanie potu',
              en: 'Effective sweat wicking',
            },
            text: {
              pl: 'ArSport Dry Interlock: splot transportuje wilgoć na zewnętrzną stronę dzianiny, gdzie szybciej odparowuje. Skóra pozostaje sucha, ciężar mokrej odzieży nie narasta w trakcie treningu.',
              en: 'ArSport Dry Interlock: the knit moves moisture to the outer face of the fabric, where it evaporates faster. The skin stays dry and the weight of wet clothing does not build up during a workout.',
            },
          },
          {
            title: {
              pl: 'Rozciąga się w każdym kierunku, nie odkształca',
              en: 'Stretches in every direction, holds its shape',
            },
            text: {
              pl: 'ArSport El Interlock z 8% elastanu: pełen zakres ruchu bez oporu materiału, a po zdjęciu dzianina wraca do wymiaru — bez trwałych wypchań na kolanach i łokciach.',
              en: 'ArSport El Interlock with 8% elastane: a full range of movement with no material resistance, and after removal the knit returns to size — with no permanent bagging at knees and elbows.',
            },
          },
          {
            title: {
              pl: 'UV, antybakteryjność, trudnopalność do wyboru',
              en: 'UV, antibacterial, flame retardancy on demand',
            },
            text: {
              pl: 'Ochrona UV na sport na wolnym powietrzu, wykończenie antybakteryjne przeciw zapachowi, wodoodporność, a nawet wariant trudnopalny (ArSport WP Flame Pro) — właściwość nakładamy pod to, do czego odzież ma służyć.',
              en: 'UV protection for outdoor sport, an antibacterial finish against odour, water repellency and even a flame-retardant variant (ArSport WP Flame Pro) — we apply the property to match what the garment is for.',
            },
          },
        ],
      },
      familiesHeading: {
        pl: 'Rodziny tkanin sportowych',
        en: 'Sports fabric families',
      },
      normsHeading: {
        pl: 'Badamy według norm',
        en: 'Tested to standards',
      },
      families: [
        {
          name: 'ArSport Interlock',
          spec: '100% PES · 140 g/m² · Interlock',
          desc: {
            pl: 'Bazowa dzianina interlock na koszulki sportowe — gładkie lico pod nadruk i haft, stabilny wymiar.',
            en: 'The base interlock knit for sports shirts — a smooth face for print and embroidery, stable dimensions.',
          },
        },
        {
          name: 'ArSport Dry Interlock',
          spec: '100% PES · 140 g/m² · Interlock',
          desc: {
            pl: 'Interlock odprowadzający wilgoć — warstwa bazowa i koszulki treningowe utrzymujące suchość skóry.',
            en: 'A moisture-wicking interlock — a base layer and training shirts that keep the skin dry.',
          },
        },
        {
          name: 'ArSport El Interlock',
          spec: '92% PES · 8% EL · 240 g/m² · Interlock',
          desc: {
            pl: 'Dzianina rozciągliwa z elastanem — na legginsy, odzież dopasowaną i wstawki wymagające ruchu.',
            en: 'A stretch knit with elastane — for leggings, close-fit apparel and panels that need movement.',
          },
        },
        {
          name: 'AroF Mesh',
          spec: '100% PES · 55–220 g/m² · Mesh 3:1 / 2:2',
          desc: {
            pl: 'Lekkie i średnie siatki wentylujące — wstawki przewiewne, podszewki i strefy odprowadzające ciepło. 50 000 cykli ścieralności.',
            en: 'Light and medium ventilating mesh — breathable panels, linings and heat-releasing zones. 50,000 abrasion cycles.',
          },
        },
        {
          name: 'ArHard Mesh',
          spec: '100% PES · 300–420 g/m² · Heavy Mesh 3D',
          desc: {
            pl: 'Ciężkie siatki 3D — strefy wymagające struktury, przestrzenności i intensywnego przewiewu.',
            en: 'Heavy 3D mesh — zones that need structure, loft and intensive airflow.',
          },
        },
        {
          name: 'ArSport WP Flame Pro',
          spec: '75% PES · 25% PU · 160 g/m² · Interlock',
          desc: {
            pl: 'Wariant wodoodporny i trudnopalny — dla odzieży sportowej łączącej funkcję z ochroną.',
            en: 'A water-repellent, flame-retardant variant — for sportswear combining function with protection.',
          },
        },
      ],
      norms: ['EN 530', 'EN ISO 13938-1', 'EN ISO 5077', 'AATCC 183'],
    },
  },
  {
    id: 'architecture-building',
    slug: {
      pl: 'tkaniny-architektoniczne-i-budowlane',
      en: 'architectural-and-building-fabrics',
    },
    name: {
      pl: 'Tkaniny architektoniczne i budowlane',
      en: 'Architectural and building fabrics',
    },
    short: {
      pl: 'Membrany ArFlexMembrane, sufity świetlne ArDiLight oraz tkaniny ArInter do napinanych systemów architektonicznych i osłon zewnętrznych.',
      en: 'ArFlexMembrane membranes, ArDiLight luminous ceilings and ArInter fabrics for tensile architectural systems and exterior shading.',
    },
    badges: ['DIN 4102 B1'],
    image: '/images/applications/ceilings.png',
    content: {
      heroTitle: {
        pl: 'Sufit jako źródło światła',
        en: 'The ceiling as a light source',
      },
      heroLead: {
        pl: 'Sufit napinany to powierzchnia, na którą patrzy się codziennie — każda nierówność świecenia i każda zmarszczka rzuca się w oczy. ArDiLight to elastyczna tkanina PVC, która rozprasza światło jednorodnie na całej płaszczyźnie, montuje się bez podgrzewania i nie kurczy z upływem lat. Dla firm instalacyjnych i producentów systemów napinanych, którym zależy na powtarzalnym, bezusterkowym efekcie.',
        en: 'A stretch ceiling is a surface people look at every day — every unevenness in the light and every wrinkle stands out. ArDiLight is a flexible PVC fabric that diffuses light uniformly across the whole plane, installs without heating and does not shrink over the years. For installation companies and manufacturers of stretch systems who need a repeatable, defect-free result.',
      },
      usp: {
        heading: {
          pl: 'Co wyróżnia ArDiLight',
          en: 'What sets ArDiLight apart',
        },
        items: [
          {
            title: {
              pl: 'Światło rozłożone jednorodnie',
              en: 'Light spread uniformly',
            },
            text: {
              pl: 'Struktura tkaniny rozprasza źródło światła równomiernie na całej płaszczyźnie sufitu — bez gorących plam nad oprawami i ciemniejszych stref przy krawędziach. Podświetlenie wygląda jak jednolita tafla, nie rząd punktów.',
              en: 'The fabric structure diffuses the light source evenly across the entire ceiling plane — with no hot spots above the fittings and no darker zones at the edges. The backlighting reads as a single sheet, not a row of points.',
            },
          },
          {
            title: {
              pl: 'Montaż bez podgrzewania',
              en: 'Installation without heating',
            },
            text: {
              pl: 'ArDiLight nie wymaga nagrzewania podczas montażu ani specjalnych profili — instalacja jest szybka i nie zależy od wygrzania folii. Krótszy czas pracy ekipy na obiekcie, mniej sprzętu na budowie.',
              en: 'ArDiLight needs no heating during installation and no special profiles — fitting is fast and does not depend on warming the membrane. Shorter crew time on site, less equipment on the job.',
            },
          },
          {
            title: {
              pl: 'Nie kurczy się z upływem lat',
              en: 'No shrinkage over the years',
            },
            text: {
              pl: 'Tkanina jest stabilizowana termicznie: brak skurczu, który z czasem naciąga folię i odkształca płaszczyznę. Napięty sufit zostaje napięty — przez cały okres eksploatacji instalacji.',
              en: 'The fabric is heat-stabilized: no shrinkage that would tension the membrane over time and distort the plane. A tensioned ceiling stays tensioned — for the whole service life of the installation.',
            },
          },
          {
            title: {
              pl: 'Powierzchnia pod druk cyfrowy',
              en: 'A surface for digital printing',
            },
            text: {
              pl: 'Lico ArDiLight nadaje się do druku cyfrowego — jednolite podświetlone grafiki, logo i motywy dekoracyjne na całej płaszczyźnie sufitu, w rozdzielczości fotograficznej.',
              en: 'The ArDiLight face is suitable for digital printing — uniform backlit graphics, logos and decorative motifs across the whole ceiling plane, at photographic resolution.',
            },
          },
          {
            title: {
              pl: 'Klasa B1 i szeroki zakres temperatur',
              en: 'B1 class and a wide temperature range',
            },
            text: {
              pl: 'Trudnopalność B1 według DIN 4102-1 oraz zakres pracy od −30 do +70°C — sufit dopuszczony do wnętrz użyteczności publicznej, sprawdza się od chłodni po przeszklone atria.',
              en: 'Flame retardancy to B1 per DIN 4102-1 and a working range of −30 to +70°C — a ceiling approved for public interiors, at home from cold stores to glazed atria.',
            },
          },
          {
            title: {
              pl: 'Bez owadów pod powierzchnią',
              en: 'No insects beneath the surface',
            },
            text: {
              pl: 'Szczelna struktura systemu nie pozwala na gromadzenie się owadów między tkaniną a stropem — problem znany z sufitów perforowanych tu nie występuje, powierzchnia zostaje czysta.',
              en: 'The sealed structure of the system prevents insects from accumulating between the fabric and the slab — a problem known from perforated ceilings does not occur here, and the surface stays clean.',
            },
          },
        ],
      },
      familiesHeading: {
        pl: 'Specyfikacja produktu',
        en: 'Product specification',
      },
      normsHeading: {
        pl: 'Badamy według norm',
        en: 'Tested to standards',
      },
      families: [
        {
          name: 'ArDiLight',
          spec: '46% PES · 4% EL · 50% PVC · 350 g/m² · szer. 1800 mm',
          desc: {
            pl: 'Elastyczna tkanina PVC do sufitów napinanych. Wytrzymałość na przepuklenie 1500 kPa, przepuszczalność UV poniżej 1%, klasa trudnopalności B1 (DIN 4102-1), zakres pracy −30 do +70°C. Kolor biały, artykuł ArDiLight-4224.',
            en: 'A flexible PVC fabric for stretch ceilings. Bursting strength of 1500 kPa, UV permeability below 1%, flame class B1 (DIN 4102-1), working range −30 to +70°C. White, article ArDiLight-4224.',
          },
          badges: ['DIN 4102 B1', 'ISO 9001'],
        },
      ],
      norms: ['DIN 4102-1', 'EN ISO 13938-1', 'EN ISO 5077', 'AATCC 183'],
    },
  },
  {
    id: 'transport',
    slug: {
      pl: 'tkaniny-dla-transportu',
      en: 'transport-fabrics',
    },
    name: {
      pl: 'Tkaniny dla transportu',
      en: 'Transport fabrics',
    },
    short: {
      pl: 'Dzianiny ArSeat na tapicerkę foteli i wnętrza pojazdów oraz tkaniny ArBayrak do sygnalizacji i wyposażenia bezpieczeństwa transportu.',
      en: 'ArSeat knits for vehicle seating and interiors, plus ArBayrak fabrics for transport signalling and safety equipment.',
    },
    badges: [],
    image: '/images/applications/transport.png',
  },
  {
    id: 'workwear-industrial',
    slug: {
      pl: 'odziez-robocza-i-przemyslowa',
      en: 'workwear-and-industrial-apparel',
    },
    name: {
      pl: 'Odzież robocza i przemysłowa',
      en: 'Workwear and industrial apparel',
    },
    short: {
      pl: 'Rodziny ArWoWear, Arox i ArGiyim na odzież roboczą — od miękkich mieszanek po warianty antystatyczne, trudnopalne i chemoodporne.',
      en: 'ArWoWear, Arox and ArGiyim workwear fabrics — from soft blends to antistatic, flame-retardant and chemical-resistant variants.',
    },
    badges: [],
    image: '/images/applications/workwear-industrial.png',
  },
  {
    id: 'outdoor-functional',
    slug: {
      pl: 'outdoor-i-odziez-funkcjonalna',
      en: 'outdoor-and-functional-apparel',
    },
    name: {
      pl: 'Outdoor i odzież funkcjonalna',
      en: 'Outdoor and functional apparel',
    },
    short: {
      pl: 'Tkaniny AriRipstop, dzianiny funkcjonalne i siatki ArAir Mesh na odzież outdoorową, lekkie wyposażenie oraz techniczne komponenty obuwia.',
      en: 'AriRipstop fabrics, functional knits and ArAir Mesh structures for outdoor apparel, lightweight equipment and technical footwear components.',
    },
    badges: [],
    image: '/images/applications/outdoor-functional.png',
  },
  {
    id: 'upholstery-interiors',
    slug: {
      pl: 'tapicerka-i-wyposazenie-wnetrz',
      en: 'upholstery-and-interior-furnishings',
    },
    name: {
      pl: 'Tapicerka i wyposażenie wnętrz',
      en: 'Upholstery and interior furnishings',
    },
    short: {
      pl: 'Dzianiny ArSeat i siatki ArHard Mesh do tapicerki meblowej, siedzisk oraz paneli wnętrzarskich — od miękkich powierzchni po przestrzenne konstrukcje 3D.',
      en: 'ArSeat knits and ArHard Mesh fabrics for furniture upholstery, seating and interior panels — from soft surfaces to structured 3D constructions.',
    },
    badges: [],
    image: '/images/applications/upholstery-interiors.png',
  },
  {
    id: 'print-signage',
    slug: {
      pl: 'druk-reklama-i-oznakowanie',
      en: 'printing-advertising-and-signage',
    },
    name: {
      pl: 'Druk, reklama i oznakowanie',
      en: 'Printing, advertising and signage',
    },
    short: {
      pl: 'Tkaniny do druku cyfrowego oraz rodzina ArBayrak na flagi, ekspozycje i oznakowanie — lekkie podłoża poliestrowe do czystej, powtarzalnej reprodukcji.',
      en: 'Digital-print fabrics and the ArBayrak family for flags, displays and signage — lightweight polyester substrates for clean, repeatable reproduction.',
    },
    badges: [],
    image: '/images/applications/print-signage.png',
  },
  {
    id: 'professional-cleaning',
    slug: {
      pl: 'czyszczenie-profesjonalne',
      en: 'professional-cleaning',
    },
    name: {
      pl: 'Czyszczenie profesjonalne',
      en: 'Professional cleaning',
    },
    short: {
      pl: 'Mikrofibra ArClean do profesjonalnego i przemysłowego czyszczenia — gęste dzianiny poliestrowo-poliamidowe na trwałe wyroby wielokrotnego użytku.',
      en: 'ArClean microfibre for professional and industrial cleaning — dense polyester-polyamide knits for durable, reusable cleaning products.',
    },
    badges: [],
    image: '/images/applications/professional-cleaning.png',
  },
];

/** Znajdz branze po slugu w danym jezyku */
export function getApplicationBySlug(
  locale: Locale,
  slug: string
): ApplicationDef | undefined {
  return APPLICATIONS.find((app) => app.slug[locale] === slug);
}

/** Slugi do generateStaticParams dla danego jezyka */
export function getApplicationSlugs(locale: Locale): string[] {
  return APPLICATIONS.map((app) => app.slug[locale]);
}