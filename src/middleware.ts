// src/middleware.ts
// Middleware next-intl: rozpoznaje domene (ariteks.pl / ariteks.eu)
// i serwuje wlasciwa wersje jezykowa. Dba tez o naglowki hreflang-friendly
// przekierowania (np. /en/... na ariteks.pl -> ariteks.eu).

import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Middleware dziala na wszystkich sciezkach POZA:
  // - api (endpointy)
  // - _next (pliki wewnetrzne Next.js)
  // - plikami statycznymi (wszystko z kropka: .png, .css, .ico itd.)
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};