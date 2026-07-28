// src/i18n/routing.ts
// Serce dwujezycznosci: definicja jezykow.
//
// Model adresow:
//   ariteks.pl/      -> PL, domyslny jezyk bez prefiksu
//   ariteks.pl/en/   -> EN, jezyk angielski z prefiksem
//
// Jezyk wynika wylacznie z adresu URL.
// Nie przekierowujemy uzytkownika ani robota wyszukiwarki
// na podstawie Accept-Language lub ciasteczka.
//
// ariteks.eu -> przekierowanie 301 na ariteks.pl
// realizowane poza aplikacja, w Cloudflare.

import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['pl', 'en'],
  defaultLocale: 'pl',

  // Polski bez prefiksu, angielski pod /en.
  localePrefix: 'as-needed',

  // URL jest jedynym zrodlem informacji o jezyku:
  // /...    -> PL
  // /en/... -> EN
  //
  // Bez automatycznego przekierowania na podstawie:
  // - Accept-Language,
  // - NEXT_LOCALE,
  // - poprzedniego wyboru jezyka.
  localeDetection: false,

  // Hreflangi sa generowane recznie w metadata stron
  // oraz w sitemap.xml.
  alternateLinks: false,
});

export type Locale = (typeof routing.locales)[number];

// Nawigacja swiadoma jezyka.
// Uzywamy tych komponentow zamiast bezposrednio:
// - next/link,
// - next/navigation.
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);