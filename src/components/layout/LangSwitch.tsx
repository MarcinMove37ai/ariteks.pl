// src/components/layout/LangSwitch.tsx
// Przelacznik jezyka (client) — minimalistyczny toggle. Pokazuje TYLKO
// jezyk, na ktory mozna przelaczyc (nieaktywny), jako dyskretny element
// z cienka podkreslona kreska w kolorze sygnatury (czerwien na hover).
// Uzywany w Nav (desktop) i MobileNav (mobile).
//
// Regula widocznosci (wg wytycznych): przelacznik pojawia sie tylko, gdy
// SENSOWNE jest przelaczenie:
//   - przegladarka zna polski  -> mozna przelaczac PL<->EN (pokazujemy toggle),
//   - przegladarka NIE zna polskiego i jestesmy na EN -> ukrywamy calkowicie
//     (nie ma po co proponowac polskiego komus, kto go nie zna).
// Przelaczenie zachowuje biezaca sciezke i zapisuje wybor w cookie
// NEXT_LOCALE (uszanuje go middleware przy kolejnych wejsciach).

'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import type { Locale } from '@/i18n/routing';

type Variant = 'desktop' | 'mobile';

export default function LangSwitch({ variant = 'desktop' }: { variant?: Variant }) {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();

  // Czy przegladarka zna polski? Decyduje o tym, czy w ogole proponujemy
  // przejscie na polski. Na serwerze zakladamy "tak" (bezpieczniej pokazac),
  // po zamontowaniu korygujemy realna wartoscia.
  const [knowsPolish, setKnowsPolish] = useState(true);

  useEffect(() => {
    const langs =
      (navigator.languages && navigator.languages.length
        ? navigator.languages
        : [navigator.language]) || [];
    setKnowsPolish(langs.some((l) => l.toLowerCase().startsWith('pl')));
  }, []);

  // Jezyk docelowy = ten drugi.
  const target: Locale = locale === 'pl' ? 'en' : 'pl';

  // Ukrycie: gdy przegladarka nie zna polskiego, nie proponujemy PL.
  // (Jesli jestesmy na EN i target=PL, a polskiego brak — chowamy calosc.)
  if (target === 'pl' && !knowsPolish) return null;

  const switchTo = () => {
    document.cookie = `NEXT_LOCALE=${target};path=/;max-age=31536000;samesite=lax`;
    router.replace(pathname, { locale: target });
  };

  const label = target.toUpperCase(); // "EN" albo "PL"

  // MOBILE: prosty jasny tekst na ciemnym tle (bez ramki).
  if (variant === 'mobile') {
    return (
      <button
        type="button"
        onClick={switchTo}
        aria-label={target === 'en' ? 'Switch to English' : 'Przełącz na polski'}
        className="font-mono text-sm font-medium uppercase tracking-wide text-carbon-300 transition-colors hover:text-white"
      >
        {label}
      </button>
    );
  }

  // DESKTOP: subtelna pigulka — cienka ramka w spoczynku, delikatne
  // wypelnienie i czerwony akcent na hover. Odroznia "EN" od pozycji menu
  // jako kontrolke, nie link, bez krzyku.
  return (
    <button
      type="button"
      onClick={switchTo}
      aria-label={target === 'en' ? 'Switch to English' : 'Przełącz na polski'}
      className="rounded border border-steel-line px-2.5 py-1 font-mono text-xs font-medium uppercase tracking-wide text-ink-soft transition-colors duration-150 hover:border-red-500 hover:bg-red-50 hover:text-red-600"
    >
      {label}
    </button>
  );
}