// src/middleware.ts
// Middleware routingu jezykowego next-intl.
//
// Model adresow:
//   /...    -> PL
//   /en/... -> EN

import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { routing } from './i18n/routing';

// ─── TYMCZASOWE WYGASZENIE SERWISU ────────────────────────────────
// true  -> kazdy adres zwraca 404 ze strona zastepcza
// false -> normalne dzialanie serwisu
const SITE_OFFLINE = false;
// ──────────────────────────────────────────────────────────────────

const intlMiddleware = createMiddleware(routing);

const COPY = {
  pl: {
    lang: 'pl',
    eyebrow: '404 — nie znaleziono strony',
    title: 'Ta strona nie istnieje',
    lead: 'Podany adres jest nieprawidłowy, strona została przeniesiona albo nie jest już dostępna.',
    caption: 'nie znaleziono strony',
  },
  en: {
    lang: 'en',
    eyebrow: '404 — page not found',
    title: 'This page does not exist',
    lead: 'The address is invalid, the page has been moved or is no longer available.',
    caption: 'page not found',
  },
} as const;

function offlineHtml(locale: 'pl' | 'en') {
  const t = COPY[locale];

  return `<!doctype html>
<html lang="${t.lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>404 — Ariteks</title>
<style>
  :root { --accent:#d33a30; --bg:#1e1e1e; --muted:#a8a8a8; }
  * { box-sizing:border-box; margin:0; padding:0; }
  html,body { height:100%; }
  body {
    display:flex; align-items:center; justify-content:center;
    padding:2rem;
    background-color:var(--bg);
    background-image:
      linear-gradient(rgba(255,255,255,.028) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,.028) 1px, transparent 1px);
    background-size:48px 48px;
    color:#fff;
    font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
    -webkit-font-smoothing:antialiased;
  }
  .wrap {
    width:100%; max-width:1100px;
    display:flex; flex-wrap:wrap; align-items:center; gap:3rem;
  }
  .col { flex:1 1 380px; }
  .eyebrow {
    font-family:ui-monospace,SFMono-Regular,Menlo,monospace;
    font-size:.75rem; letter-spacing:.18em; text-transform:uppercase;
    color:var(--muted);
  }
  h1 {
    margin-top:1.5rem;
    font-family:Georgia,"Times New Roman",serif;
    font-size:clamp(2.25rem,6vw,3.75rem); font-weight:700;
    line-height:1.1; text-wrap:balance;
  }
  p { margin-top:1.5rem; max-width:34rem; font-size:1.075rem; line-height:1.65; color:#c9c9c9; }
  .num { flex:0 1 320px; display:flex; align-items:center; gap:1.75rem; }
  .rule { width:2px; align-self:stretch; min-height:130px; background:var(--accent); }
  .big {
    font-family:ui-monospace,SFMono-Regular,Menlo,monospace;
    font-size:clamp(4rem,11vw,7.5rem); font-weight:600;
    line-height:1; letter-spacing:-.02em;
  }
  .caption {
    margin-top:.75rem;
    font-family:ui-monospace,SFMono-Regular,Menlo,monospace;
    font-size:.7rem; letter-spacing:.18em; text-transform:uppercase; color:var(--muted);
  }
</style>
</head>
<body>
  <div class="wrap">
    <div class="col">
      <p class="eyebrow">${t.eyebrow}</p>
      <h1>${t.title}</h1>
      <p>${t.lead}</p>
    </div>
    <div class="num">
      <span class="rule"></span>
      <div>
        <div class="big">404</div>
        <div class="caption">${t.caption}</div>
      </div>
    </div>
  </div>
</body>
</html>`;
}

export default function middleware(request: NextRequest) {
  if (SITE_OFFLINE) {
    const { pathname } = request.nextUrl;
    const isEn = pathname === '/en' || pathname.startsWith('/en/');

    return new NextResponse(offlineHtml(isEn ? 'en' : 'pl'), {
      status: 404,
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'no-store',
        'x-robots-tag': 'noindex, nofollow',
      },
    });
  }

  return intlMiddleware(request);
}

export const config = {
  // Middleware dziala na wszystkich trasach aplikacji poza:
  // - /api,
  // - /_next,
  // - plikami statycznymi zawierajacymi rozszerzenie.
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};