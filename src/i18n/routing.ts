// src/i18n/routing.ts
// Serce dwujezycznosci: definicja jezykow.
// Model: JEDNA domena glowna (ariteks.pl) obsluguje OBA jezyki.
//   ariteks.pl/      -> PL (domyslny, bez prefiksu)
//   ariteks.pl/en/   -> EN (z prefiksem)
// Detekcje jezyka przy wejsciu robi middleware (Accept-Language).
// Przelacznik jezyka przechodzi / <-> /en.
// ariteks.eu -> przekierowanie 301 na ariteks.pl (regula w Cloudflare, poza kodem).
//
// USUNIETO blok `domains` (domain-based routing next-intl): wymuszal jeden
// jezyk na domene i blokowal /en na ariteks.pl oraz kolidowal z detekcja.

import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['pl', 'en'],
  defaultLocale: 'pl',

  // Polski bez prefiksu, angielski pod /en.
  localePrefix: 'as-needed',

  // Dynamiczne slugi aplikacji różnią się między PL i EN.
  // Poprawne hreflang generują metadata stron oraz sitemap.xml.
  alternateLinks: false,
});

export type Locale = (typeof routing.locales)[number];

// Nawigacja swiadoma jezyka — uzywamy TYCH komponentow zamiast next/link
// i next/navigation w calej aplikacji:
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);