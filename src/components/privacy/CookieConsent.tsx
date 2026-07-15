// src/components/privacy/CookieConsent.tsx
// Minimalistyczny baner oraz panel ustawień cookies.
// Kategorie odpowiadają rzeczywiście używanym technologiom:
// niezbędne oraz marketingowe Meta.

'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { X } from 'lucide-react';
import { Link, type Locale } from '@/i18n/routing';
import {
  OPEN_CONSENT_SETTINGS_EVENT,
  readCookieConsent,
  saveCookieConsent,
} from '@/lib/privacy/consent';

type View = 'banner' | 'settings' | null;

const COPY = {
  pl: {
    bannerTitle: 'Szanujemy Twoją prywatność',
    bannerText:
      'Używamy niezbędnych technologii do działania strony. Za Twoją zgodą możemy również używać narzędzi Meta do pomiaru skuteczności reklam.',
    acceptAll: 'Akceptuj wszystkie',
    rejectOptional: 'Odrzuć opcjonalne',
    settings: 'Ustawienia',
    policy: 'Informacje o cookies',
    settingsTitle: 'Ustawienia cookies',
    settingsLead:
      'Możesz zdecydować o opcjonalnym pomiarze marketingowym. Brak zgody nie ogranicza działania strony ani formularza zapytania.',
    necessaryTitle: 'Niezbędne',
    necessaryText:
      'Zapamiętują wybór dotyczący cookies i zapewniają podstawowe działanie strony.',
    alwaysActive: 'Zawsze aktywne',
    marketingTitle: 'Marketingowe',
    marketingText:
      'Meta Pixel i Conversions API pomagają mierzyć skuteczność reklam oraz przypisywać zapytania do kampanii.',
    save: 'Zapisz wybór',
    close: 'Zamknij ustawienia',
  },
  en: {
    bannerTitle: 'We respect your privacy',
    bannerText:
      'We use essential technologies to operate the website. With your consent, we may also use Meta tools to measure advertising effectiveness.',
    acceptAll: 'Accept all',
    rejectOptional: 'Reject optional',
    settings: 'Settings',
    policy: 'Cookie information',
    settingsTitle: 'Cookie settings',
    settingsLead:
      'You can decide whether to allow optional marketing measurement. Refusing does not limit the website or enquiry form.',
    necessaryTitle: 'Essential',
    necessaryText:
      'These remember your cookie choice and provide the website’s basic operation.',
    alwaysActive: 'Always active',
    marketingTitle: 'Marketing',
    marketingText:
      'Meta Pixel and Conversions API help measure advertising effectiveness and attribute enquiries to campaigns.',
    save: 'Save selection',
    close: 'Close settings',
  },
} as const;

export default function CookieConsent() {
  const locale = useLocale() as Locale;
  const copy = COPY[locale];

  const [view, setView] = useState<View>(null);
  const [hasSavedDecision, setHasSavedDecision] =
    useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const current = readCookieConsent();

    if (current) {
      setHasSavedDecision(true);
      setMarketing(current.marketing);
      setView(null);
    } else {
      setView('banner');
    }

    const onOpenSettings = () => {
      const latest = readCookieConsent();
      setHasSavedDecision(Boolean(latest));
      setMarketing(latest?.marketing ?? false);
      setView('settings');
    };

    window.addEventListener(
      OPEN_CONSENT_SETTINGS_EVENT,
      onOpenSettings,
    );

    return () =>
      window.removeEventListener(
        OPEN_CONSENT_SETTINGS_EVENT,
        onOpenSettings,
      );
  }, []);

  useEffect(() => {
    if (view !== 'settings') return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setView(hasSavedDecision ? null : 'banner');
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [hasSavedDecision, view]);

  const choose = (allowMarketing: boolean) => {
    saveCookieConsent(allowMarketing);
    setMarketing(allowMarketing);
    setHasSavedDecision(true);
    setView(null);
  };

  if (view === null) return null;

  if (view === 'banner') {
    return (
      <div className="fixed inset-0 z-[120] flex items-end justify-center bg-carbon-950/15 p-4 backdrop-blur-[2px]">
        <section
          aria-label={copy.bannerTitle}
          className="w-full max-w-5xl rounded-xl border border-white/50 bg-paper/95 p-5 shadow-2xl backdrop-blur-md sm:p-6"
        >
          <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <h2 className="text-base font-semibold text-carbon-950">
              {copy.bannerTitle}
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ink-soft">
              {copy.bannerText}{' '}
              <Link
                href="/cookies"
                className="font-medium text-carbon-950 underline decoration-carbon-300 underline-offset-4 hover:text-red-600"
              >
                {copy.policy}
              </Link>
            </p>
          </div>

          <div className="flex flex-wrap gap-3 lg:justify-end">
            <button
              type="button"
              onClick={() => choose(false)}
              className="inline-flex items-center justify-center rounded border border-carbon-300 bg-white px-4 py-2.5 text-sm font-semibold text-carbon-900 transition-colors hover:border-carbon-500"
            >
              {copy.rejectOptional}
            </button>
            <button
              type="button"
              onClick={() => setView('settings')}
              className="inline-flex items-center justify-center rounded border border-carbon-300 bg-white px-4 py-2.5 text-sm font-semibold text-carbon-900 transition-colors hover:border-carbon-500"
            >
              {copy.settings}
            </button>
            <button
              type="button"
              onClick={() => choose(true)}
              className="inline-flex items-center justify-center rounded bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-600"
            >
              {copy.acceptAll}
            </button>
          </div>
        </div>
        </section>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-[130] flex items-end justify-center overflow-y-auto bg-carbon-950/35 p-4 backdrop-blur-[3px] sm:items-center"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target !== event.currentTarget) return;
        setView(hasSavedDecision ? null : 'banner');
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-settings-title"
        className="relative my-4 w-full max-w-2xl rounded-xl border border-white/50 bg-paper/95 p-6 shadow-2xl backdrop-blur-md sm:p-8"
      >
        <button
          type="button"
          onClick={() =>
            setView(hasSavedDecision ? null : 'banner')
          }
          aria-label={copy.close}
          className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded text-steel transition-colors hover:text-red-600"
        >
          <X size={22} strokeWidth={1.75} />
        </button>

        <h2
          id="cookie-settings-title"
          className="pr-10 font-display text-2xl font-bold text-carbon-950 sm:text-3xl"
        >
          {copy.settingsTitle}
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-soft">
          {copy.settingsLead}
        </p>

        <div className="mt-7 space-y-3">
          <article className="rounded-lg border border-steel-line bg-white p-5">
            <div className="flex items-start justify-between gap-5">
              <div>
                <h3 className="font-semibold text-carbon-950">
                  {copy.necessaryTitle}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {copy.necessaryText}
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-carbon-100 px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-wider text-carbon-700">
                {copy.alwaysActive}
              </span>
            </div>
          </article>

          <article className="rounded-lg border border-steel-line bg-white p-5">
            <div className="flex items-start justify-between gap-5">
              <div>
                <h3 className="font-semibold text-carbon-950">
                  {copy.marketingTitle}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {copy.marketingText}
                </p>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={marketing}
                onClick={() => setMarketing((value) => !value)}
                className={`relative mt-0.5 h-7 w-12 shrink-0 rounded-full transition-colors ${
                  marketing ? 'bg-red-500' : 'bg-carbon-300'
                }`}
              >
                <span
                  className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                    marketing
                      ? 'translate-x-6'
                      : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </article>
        </div>

        <div className="mt-7 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => choose(false)}
            className="inline-flex items-center justify-center rounded border border-carbon-300 bg-white px-4 py-2.5 text-sm font-semibold text-carbon-900 transition-colors hover:border-carbon-500"
          >
            {copy.rejectOptional}
          </button>
          <button
            type="button"
            onClick={() => choose(marketing)}
            className="inline-flex items-center justify-center rounded bg-carbon-950 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-600"
          >
            {copy.save}
          </button>
          <button
            type="button"
            onClick={() => choose(true)}
            className="inline-flex items-center justify-center rounded bg-red-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-600"
          >
            {copy.acceptAll}
          </button>
        </div>

        <Link
          href="/cookies"
          onClick={() => setView(null)}
          className="mt-6 inline-flex text-sm font-medium text-steel underline decoration-carbon-300 underline-offset-4 hover:text-red-600"
        >
          {copy.policy}
        </Link>
      </section>
    </div>
  );
}