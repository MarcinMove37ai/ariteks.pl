import { getLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import type { Locale } from '@/i18n/routing';

const COPY = {
  pl: {
    eyebrow: 'Nie znaleziono strony',
    title: 'Ta strona nie istnieje',
    description:
      'Podany adres jest nieprawidłowy, strona została przeniesiona albo nie jest już dostępna.',
    home: 'Przejdź na stronę główną',
    catalogue: 'Otwórz katalog tkanin',
  },
  en: {
    eyebrow: 'Page not found',
    title: 'This page does not exist',
    description:
      'The address may be incorrect, the page may have been moved, or it may no longer be available.',
    home: 'Go to the homepage',
    catalogue: 'Open the fabric catalogue',
  },
} as const;

export default async function LocaleNotFound() {
  const locale = await getLocale();
  const loc: Locale = locale === 'en' ? 'en' : 'pl';
  const copy = COPY[loc];

  return (
    <main className="mesh-dark flex min-h-[72vh] items-center border-y border-white/10">
      <div className="container-site py-20 sm:py-28">
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-20">
          <div className="max-w-3xl">
            <div className="flex items-center gap-4">
              <span className="h-px w-12 bg-red" aria-hidden="true" />

              <p className="font-mono text-xs uppercase tracking-[0.2em] text-carbon-300">
                404 · {copy.eyebrow}
              </p>
            </div>

            <h1 className="mt-7 font-display text-4xl leading-tight text-white sm:text-5xl lg:text-6xl">
              {copy.title}
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-carbon-200">
              {copy.description}
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded bg-red px-5 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
              >
                {copy.home}
                <span aria-hidden>→</span>
              </Link>

              <Link
                href="/fabrics"
                className="inline-flex items-center justify-center gap-2 rounded border border-white/20 bg-white/5 px-5 py-3 text-sm font-medium text-white transition-colors hover:border-red hover:text-red"
              >
                {copy.catalogue}
                <span aria-hidden>→</span>
              </Link>
            </div>
          </div>

          <aside className="border-l-2 border-red pl-6">
            <p className="font-mono text-7xl font-medium leading-none tracking-tight text-white sm:text-8xl">
              404
            </p>

            <p className="mt-5 font-mono text-[11px] uppercase leading-relaxed tracking-[0.18em] text-carbon-300">
              {copy.eyebrow}
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}