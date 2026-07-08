// src/middleware.ts
// Middleware next-intl + detekcja jezyka wg Accept-Language.
//
// Reguly detekcji (tylko przy wejsciu na korzen, gdy uzytkownik nie wybral
// jeszcze jezyka jawnie — brak ciasteczka NEXT_LOCALE):
//   1. polski PIERWSZY w Accept-Language        -> PL  (korzen "/")
//   2. polski obecny, ale NIE pierwszy          -> EN  ("/en")
//   3. polskiego BRAK                            -> EN  ("/en")
// Regula 1 jest niestandardowa (domyslny detektor next-intl wybralby PL,
// gdyby polski byl gdziekolwiek na liscie) — dlatego liczymy sami.
//
// Po jawnym wyborze jezyka (klik w przelacznik) next-intl zapisuje cookie
// NEXT_LOCALE; wtedy detekcji NIE stosujemy — uszanowany zostaje wybor.

import createMiddleware from 'next-intl/middleware';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

// Czy w Accept-Language polski jest PIERWSZYM preferowanym jezykiem?
// Parsujemy naglowek: "pl-PL,pl;q=0.9,en;q=0.8" -> lista wg malejacego q.
function polishIsFirst(acceptLanguage: string | null): boolean {
  if (!acceptLanguage) return false;
  const langs = acceptLanguage
    .split(',')
    .map((part) => {
      const [tag, ...params] = part.trim().split(';');
      const qParam = params.find((p) => p.trim().startsWith('q='));
      const q = qParam ? parseFloat(qParam.split('=')[1]) : 1;
      return { tag: tag.trim().toLowerCase(), q: isNaN(q) ? 1 : q };
    })
    .filter((l) => l.tag.length > 0)
    .sort((a, b) => b.q - a.q);
  if (langs.length === 0) return false;
  return langs[0].tag.startsWith('pl');
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Detekcje stosujemy tylko na "czystym" wejsciu na korzen bez prefiksu
  // jezyka i bez wczesniejszego wyboru (cookie). Inne sciezki -> next-intl.
  const hasLocaleCookie = request.cookies.has('NEXT_LOCALE');
  const isRootEntry = pathname === '/';

  if (isRootEntry && !hasLocaleCookie) {
    const first = polishIsFirst(request.headers.get('accept-language'));
    if (!first) {
      // regula 2 i 3: polski nie-pierwszy lub brak -> EN
      const url = request.nextUrl.clone();
      url.pathname = '/en';
      return NextResponse.redirect(url);
    }
    // regula 1: polski pierwszy -> zostajemy na korzeniu (PL), oddajemy next-intl
  }

  return intlMiddleware(request);
}

export const config = {
  // Middleware dziala na wszystkich sciezkach POZA:
  // - api (endpointy)
  // - _next (pliki wewnetrzne Next.js)
  // - plikami statycznymi (wszystko z kropka: .png, .css, .ico itd.)
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};