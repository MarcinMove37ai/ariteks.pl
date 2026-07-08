// src/i18n/routing.ts
// Serce dwujezycznosci: definicja jezykow + mapowanie domen.
// Produkcja:  ariteks.pl -> PL (bez prefiksu), ariteks.eu -> EN (bez prefiksu)
// Lokalnie:   localhost:3000 -> PL, localhost:3000/en -> EN

import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['pl', 'en'],
  defaultLocale: 'pl',

  // 'as-needed': domyslny jezyk bez prefiksu w URL, drugi z prefiksem.
  // Na produkcji prefiksy znikaja calkowicie, bo kazda domena ma jeden jezyk.
  localePrefix: 'as-needed',

  domains: [
    {
      domain: 'ariteks.pl',
      defaultLocale: 'pl',
      locales: ['pl'],
    },
    {
      domain: 'ariteks.eu',
      defaultLocale: 'en',
      locales: ['en'],
    },
  ],
});

export type Locale = (typeof routing.locales)[number];

// Nawigacja swiadoma jezyka — uzywamy TYCH komponentow zamiast next/link
// i next/navigation w calej aplikacji:
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);