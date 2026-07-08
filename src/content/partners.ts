// src/content/partners.ts
// Licencje i partnerzy surowcowi — v2: 8 zweryfikowanych marek.
// Zrodlo: ariteks.net/referances.asp + potwierdzenie Ariteks + weryfikacja wlascicieli.
// Sekcja renderowana na stronie glownej (kotwica #partners) — bez osobnej podstrony.
// Logotypy: public/images/partners/{id}.png (przezroczyste PNG, min. 400 px szerokosci).

import type { Locale } from '@/i18n/routing';

export type PartnerDef = {
  id: string;
  /** Nazwa marki z symbolem */
  name: string;
  /** Wlasciciel i kraj */
  origin: Record<Locale, string>;
  /** Jedno zdanie: czym jest i co robi w tkaninach Ariteks */
  blurb: Record<Locale, string>;
  logo: string;
};

export const PARTNERS: PartnerDef[] = [
  {
    id: 'cordura',
    name: 'CORDURA®',
    origin: { pl: 'INVISTA, USA', en: 'INVISTA, USA' },
    blurb: {
      pl: 'Wysokowytrzymały poliamid 6.6 o wyjątkowej odporności na ścieranie i rozdarcie. W tkaninach Ariteks: odzież motocyklowa i wyposażenie o podwyższonej trwałości.',
      en: 'High-tenacity nylon 6.6 with exceptional abrasion and tear resistance. In Ariteks fabrics: motorcycle apparel and heavy-duty gear.',
    },
    logo: '/images/partners/cordura.png',
  },
  {
    id: 'twaron',
    name: 'Twaron®',
    origin: {
      pl: 'Teijin Aramid, Grupa Teijin (Japonia)',
      en: 'Teijin Aramid, Teijin Group (Japan)',
    },
    blurb: {
      pl: 'Para-aramid o bardzo wysokiej wytrzymałości na rozciąganie i odporności termicznej. W tkaninach Ariteks: ochrona przed przecięciem, żarem i płomieniem.',
      en: 'A para-aramid with very high tensile strength and thermal resistance. In Ariteks fabrics: cut, heat and flame protection.',
    },
    logo: '/images/partners/twaron.png',
  },
  {
    id: 'pbo',
    name: 'PBO',
    origin: { pl: 'włókno PBO, Japonia', en: 'PBO fibre, Japan' },
    blurb: {
      pl: 'Polifenylenobenzobisoksazol — włókno o najwyższej wytrzymałości i odporności termicznej wśród włókien syntetycznych. Rdzeń tkaniny ArBo na ubrania bojowe straży.',
      en: 'Poly(p-phenylene benzobisoxazole) — the strongest and most heat-resistant of synthetic fibres. The core of the ArBo fabric for firefighter turnout gear.',
    },
    logo: '/images/partners/pbo.png',
  },
  {
    id: 'trevira-cs',
    name: 'Trevira CS®',
    origin: { pl: 'Trevira GmbH, Niemcy', en: 'Trevira GmbH, Germany' },
    blurb: {
      pl: 'Trwale trudnopalny poliester — ognioodporność wbudowana w polimer, niewypłukiwalna. Zastosowania kontraktowe i transportowe.',
      en: 'Inherently flame-retardant polyester — fire resistance built into the polymer, impossible to wash out. Contract and transport applications.',
    },
    logo: '/images/partners/trevira-cs.png',
  },
  {
    id: 'protal',
    name: 'Protal®',
    origin: {
      pl: 'Waxman Group, Wielka Brytania — na włóknach Protex® (Kaneka, Japonia)',
      en: 'Waxman Group, United Kingdom — based on Protex® fibres (Kaneka, Japan)',
    },
    blurb: {
      pl: 'Trwale trudnopalne mieszanki modakrylowe o wysokiej skuteczności w ochronie przed łukiem elektrycznym i ogniem błyskawicznym.',
      en: 'Inherently flame-retardant modacrylic blends with proven performance in electric-arc and flash-fire protection.',
    },
    logo: '/images/partners/protal.png',
  },
  {
    id: 'lenzing-fr',
    name: 'LENZING™ FR',
    origin: { pl: 'Lenzing AG, Austria', en: 'Lenzing AG, Austria' },
    blurb: {
      pl: 'Trudnopalne włókno celulozowe — ochrona przed żarem i łukiem połączona z komfortem i zarządzaniem wilgocią naturalnej celulozy.',
      en: 'A flame-resistant cellulosic fibre — heat and arc protection combined with the comfort and moisture management of natural cellulose.',
    },
    logo: '/images/partners/lenzing-fr.png',
  },
  {
    id: 'bekaert',
    name: 'Bekaert',
    origin: { pl: 'Bekaert, Belgia', en: 'Bekaert, Belgium' },
    blurb: {
      pl: 'Włókna ze stali nierdzewnej do zastosowań tekstylnych — przewodność dla tkanin antystatycznych i ekranujących pola elektromagnetyczne (ArWoWear EMK).',
      en: 'Stainless-steel fibres for textile use — conductivity for antistatic and EMI-shielding fabrics (ArWoWear EMK).',
    },
    logo: '/images/partners/bekaert.png',
  },
  {
    id: 'pyrovatex',
    name: 'PYROVATEX®',
    origin: { pl: 'Huntsman, Szwajcaria', en: 'Huntsman, Switzerland' },
    blurb: {
      pl: 'Trwałe wykończenie trudnopalne dla bawełny — ochrona utrzymująca się w praniu przemysłowym, standard odzieży roboczej FR.',
      en: 'A durable flame-retardant finish for cotton — protection that survives industrial laundering, a standard in FR workwear.',
    },
    logo: '/images/partners/pyrovatex.png',
  },
];