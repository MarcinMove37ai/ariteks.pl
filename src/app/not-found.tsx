// src/app/not-found.tsx
// Globalna strona 404. Renderuje sie POZA kontekstem [locale]
// (np. /favicon.ico, smieciowe URL-e), wiec ma wlasny <html> i tresc
// w obu jezykach. Wersja 404 wewnatrz locale (z tlumaczeniami) dojdzie pozniej.

import Link from 'next/link';
import './globals.css';

export default function NotFound() {
  return (
    <html lang="pl">
      <body>
        <main className="mesh-dark flex min-h-screen items-center">
          <div className="container-site py-24">
            <div className="flex items-center gap-4">
              <span className="selvedge" aria-hidden="true" />
              <p className="eyebrow !text-indigo-300">404</p>
            </div>

            <h1 className="mt-6 font-display text-display-lg font-bold text-white">
              Nie znaleziono strony
              <span className="mt-1 block text-indigo-300">Page not found</span>
            </h1>

            <p className="mt-6 max-w-xl text-indigo-100">
              Strona, której szukasz, nie istnieje lub została przeniesiona.
              <br />
              The page you are looking for does not exist or has been moved.
            </p>

            <Link
              href="/"
              className="mt-10 inline-flex items-center rounded bg-fluo px-6 py-3.5 font-display text-sm font-semibold uppercase tracking-wide text-indigo-950 transition-colors duration-200 hover:bg-fluo-soft"
            >
              ariteks.pl
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}