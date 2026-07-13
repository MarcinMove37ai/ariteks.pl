// src/components/layout/MobileNav.tsx
// >>> TEN PLIK MUSI SIE NAZYWAC MobileNav.tsx <<<
// (jesli w pierwszej linii widzisz "Nav.tsx" — to ZLY plik, nie zapisuj)
//
// Menu mobilne: hamburger + pelnoekranowa nakladka.
// v7: nakladka przez createPortal do document.body — header ma backdrop-blur,
// ktory tworzy containing block i WIEZIL fixed nakladke w 80px headera.
// Portal wyrywa ja poza header: fixed znow liczy sie od viewportu.
// v6: min-h-0 na <nav> — bez tego flex-1 z min-height:auto rozpychal nav
// na wysokosc tresci POZA ekran (fixed rodzic sie nie przewija) i linki
// byly niedostepne pod dolna krawedzia. min-h-0 = nav miesci sie w ekranie
// i przewija. Usuniety selvedge (rezygnacja z komponentu). Tlo inline. — solidny kolor inline + wlasna kratka
// rysowana inline (repeating-linear-gradient). Zero zaleznosci od .mesh-dark,
// wiec nic nie przeswieci niezaleznie od warstw CSS. Przycisk RFQ (openRfq).

'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Menu, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import LangSwitch from './LangSwitch';

type NavItem = { href: string; label: string };

// Kryjace tlo: solidny antracyt + subtelna kratka warp-knit, wszystko inline.
const OVERLAY_BG: React.CSSProperties = {
  backgroundColor: '#161719',
  backgroundImage:
    'repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0 1px, transparent 1px 28px),' +
    'repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0 1px, transparent 1px 28px)',
};

export default function MobileNav({
  items,
  catalogLabel,
}: {
  items: NavItem[];
  catalogLabel: string;
}) {
  // Stan otwarcia czytany SYNCHRONICZNIE przy montowaniu (inicjalizator
  // useState) — po nawigacji jezykowej nakladka jest otwarta juz w pierwszym
  // renderze, bez klatki "zamkniete->otwarte". Flagi NIE zdejmujemy w
  // inicjalizatorze (StrictMode woła go 2x w dev) — sprzatamy w efekcie.
  const [open, setOpen] = useState(
    () =>
      typeof window !== 'undefined' &&
      sessionStorage.getItem('mobileNavOpen') === '1',
  );

  useEffect(() => {
    sessionStorage.removeItem('mobileNavOpen');
  }, []);

  // Zamkniecie nakladki DOPIERO po zmianie trasy — nakladka przykrywa
  // przejscie miedzy stronami (bez blysku starej strony). usePathname
  // z i18n zwraca sciezke bez prefiksu jezyka, wiec zmiana samego
  // jezyka NIE zamyka nakladki (wspolgra z flaga mobileNavOpen).
  const pathname = usePathname();
  useEffect(() => {
    setOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);
  const t = useTranslations('common');

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t('menu')}
        aria-expanded={open}
        className="inline-flex h-11 w-11 items-center justify-center rounded text-ink transition-colors hover:text-red-600"
      >
        <Menu size={26} strokeWidth={1.75} />
      </button>

      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-[60] flex flex-col"
            style={OVERLAY_BG}
            role="dialog"
            aria-modal="true"
          >
          <div className="mx-auto flex h-20 w-full max-w-xs items-center px-1">
            <LangSwitch variant="mobile" />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t('close')}
              className="ml-auto inline-flex h-11 w-11 items-center justify-center rounded text-white transition-colors hover:text-red-400"
            >
              <X size={28} strokeWidth={1.75} />
            </button>
          </div>

          {/* Przewijanie na <nav>, centrowanie przez my-auto na wrapperze.
              NIGDY justify-center + overflow na tym samym elemencie:
              przycina gorna czesc tresci bez mozliwosci doscrollowania. */}
          <nav
            className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 sm:px-8"
            aria-label="Mobile"
          >
            <div className="mx-auto my-auto flex w-full max-w-xs flex-col gap-2 py-8">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    // kotwice i link do biezacej strony: trasa sie nie
                    // zmieni, wiec zamykamy od razu; resztę zamknie
                    // efekt po zmianie pathname
                    if (
                      item.href.startsWith('/#') ||
                      item.href.startsWith('#') ||
                      item.href === pathname
                    ) {
                      setOpen(false);
                    }
                  }}
                  className="border-b border-carbon-700 py-3 font-display text-2xl font-bold text-white transition-colors hover:text-red-400 sm:py-4 sm:text-3xl"
                >
                  {item.label}
                </Link>
              ))}

              <Link
                href="/fabrics"
                onClick={() => {
                  if (pathname === '/fabrics') setOpen(false);
                }}
                className="mt-6 flex w-full items-center justify-center rounded bg-red-600 px-6 py-4 text-base font-semibold text-white transition-colors hover:bg-carbon-900"
              >
                {catalogLabel}
              </Link>
            </div>
            </nav>
          </div>,
          document.body
        )}
    </div>
  );
}