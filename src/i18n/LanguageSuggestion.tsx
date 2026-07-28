// src/components/i18n/LanguageSuggestion.tsx
// Sugestia przejscia na angielska wersje strony.
//
// Kolejnosc:
// 1. uzytkownik podejmuje decyzje dotyczaca cookies,
// 2. baner cookies znika,
// 3. po 500 ms pojawia sie sugestia jezyka.
//
// Zasady:
// - dziala tylko na polskiej wersji,
// - nie wykonuje automatycznego przekierowania,
// - pojawia sie, gdy glowny jezyk przegladarki nie jest polski,
// - nie wyswietla sie razem z banerem cookies,
// - zachowuje aktualna podstrone, parametry i kotwice,
// - zapamietuje decyzje uzytkownika w localStorage,
// - wizualnie odpowiada banerowi cookies.

'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import {
  usePathname,
  useRouter,
  type Locale,
} from '@/i18n/routing';
import { getLocalizedApplicationPath } from '@/content/application-slugs';
import {
  CONSENT_CHANGED_EVENT,
  readCookieConsent,
} from '@/lib/privacy/consent';

const STORAGE_KEY = 'ariteks_language_suggestion_v1';

// Odstep pomiedzy zamknieciem banera cookies
// a wyswietleniem sugestii jezyka.
const SHOW_DELAY_MS = 500;

type LanguageDecision = 'english' | 'polish';

function readDecision(): LanguageDecision | null {
  if (typeof window === 'undefined') return null;

  try {
    const value = window.localStorage.getItem(STORAGE_KEY);

    return value === 'english' || value === 'polish'
      ? value
      : null;
  } catch {
    return null;
  }
}

function saveDecision(decision: LanguageDecision) {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(STORAGE_KEY, decision);
  } catch {
    // Niedostepny localStorage nie moze blokowac zmiany jezyka.
  }
}

function browserPrefersPolish(): boolean {
  const languages =
    navigator.languages && navigator.languages.length > 0
      ? navigator.languages
      : [navigator.language];

  const primaryLanguage = languages[0] ?? '';

  return primaryLanguage.toLowerCase().startsWith('pl');
}

export default function LanguageSuggestion() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(false);

    if (locale !== 'pl') {
      return;
    }

    // Tryb testowy:
    // http://localhost:3000/?language-suggestion=1
    //
    // Dziala tylko podczas `npm run dev`.
    // Wymusza sugestie niezaleznie od jezyka przegladarki
    // i poprzedniej decyzji, ale nadal czeka na zamkniecie
    // banera cookies.
    const forceInDevelopment =
      process.env.NODE_ENV !== 'production' &&
      new URLSearchParams(window.location.search).get(
        'language-suggestion',
      ) === '1';

    if (
      !forceInDevelopment &&
      (readDecision() !== null || browserPrefersPolish())
    ) {
      return;
    }

    let timer: number | undefined;

    const clearTimer = () => {
      if (timer === undefined) return;

      window.clearTimeout(timer);
      timer = undefined;
    };

    const scheduleSuggestion = () => {
      // Sugestia nigdy nie pojawia sie przed decyzja cookies.
      if (!readCookieConsent()) {
        return;
      }

      // W normalnym trybie respektujemy poprzednia decyzje
      // dotyczaca jezyka.
      if (!forceInDevelopment && readDecision() !== null) {
        return;
      }

      clearTimer();

      timer = window.setTimeout(() => {
        setVisible(true);
      }, SHOW_DELAY_MS);
    };

    // Gdy decyzja cookies zostala zapisana podczas poprzedniej wizyty,
    // odliczanie rozpoczyna sie po zaladowaniu strony.
    scheduleSuggestion();

    // Gdy baner cookies jest aktualnie widoczny, zaczynamy odliczanie
    // dopiero po zapisaniu decyzji przez uzytkownika.
    window.addEventListener(
      CONSENT_CHANGED_EVENT,
      scheduleSuggestion,
    );

    return () => {
      clearTimer();

      window.removeEventListener(
        CONSENT_CHANGED_EVENT,
        scheduleSuggestion,
      );
    };
  }, [locale]);

  const stayInPolish = () => {
    saveDecision('polish');
    setVisible(false);
  };

  const openEnglishVersion = () => {
    saveDecision('english');
    setVisible(false);

    const targetPathname = getLocalizedApplicationPath(
      pathname,
      'en',
    );

    // Zachowujemy prawdziwe parametry URL oraz kotwice,
    // ale usuwamy developerski parametr testowy.
    const searchParams = new URLSearchParams(
      window.location.search,
    );

    searchParams.delete('language-suggestion');

    const query = searchParams.toString();
    const hash = window.location.hash;

    const targetUrl =
      `${targetPathname}${query ? `?${query}` : ''}${hash}`;

    router.replace(targetUrl, {
      locale: 'en',
      scroll: false,
    });
  };

  if (!visible || locale !== 'pl') {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-[110] flex items-end justify-center bg-carbon-950/15 p-4 backdrop-blur-[2px]">
      <section
        aria-labelledby="language-suggestion-title"
        aria-describedby="language-suggestion-description"
        className="pointer-events-auto w-full max-w-5xl rounded-xl border border-white/50 bg-paper/95 p-5 shadow-2xl backdrop-blur-md sm:p-6"
      >
        <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-red-600">
              Language preference
            </p>

            <h2
              id="language-suggestion-title"
              className="mt-1 text-base font-semibold text-carbon-950"
            >
              English version available
            </h2>

            <p
              id="language-suggestion-description"
              className="mt-2 max-w-3xl text-sm leading-relaxed text-ink-soft"
            >
              Would you like to view this website in English?
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:flex lg:flex-wrap lg:justify-end">
            <button
              type="button"
              onClick={stayInPolish}
              className="inline-flex min-w-0 w-full items-center justify-center whitespace-nowrap rounded border border-carbon-300 bg-white px-2 py-2.5 text-xs font-semibold text-carbon-900 transition-colors hover:border-carbon-500 sm:px-4 sm:text-sm lg:w-auto"
            >
              Continue in Polish
            </button>

            <button
              type="button"
              onClick={openEnglishVersion}
              className="inline-flex min-w-0 w-full items-center justify-center whitespace-nowrap rounded bg-red-500 px-2 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-red-600 sm:px-4 sm:text-sm lg:w-auto"
            >
              View in English
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}