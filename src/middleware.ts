// src/middleware.ts
// Middleware routingu jezykowego next-intl.
//
// Model adresow:
//   /...    -> PL
//   /en/... -> EN
//
// Jezyk wynika wylacznie z adresu URL.
// Automatyczna detekcja przez Accept-Language i NEXT_LOCALE
// jest wylaczona w src/i18n/routing.ts.

import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Middleware dziala na wszystkich trasach aplikacji poza:
  // - /api,
  // - /_next,
  // - plikami statycznymi zawierajacymi rozszerzenie,
  //   np. .png, .jpg, .svg, .css, .js, .pdf, .xml.
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};