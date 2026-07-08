// src/i18n/request.ts
// Konfiguracja per-request: ustala jezyk i laduje odpowiedni plik tlumaczen.
// Wskazany w next.config.mjs przez createNextIntlPlugin.

import { getRequestConfig } from 'next-intl/server';
import { routing, type Locale } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;

  // Walidacja: nieznany jezyk -> bezpieczny fallback na domyslny (pl)
  const locale: Locale =
    requested && routing.locales.includes(requested as Locale)
      ? (requested as Locale)
      : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});