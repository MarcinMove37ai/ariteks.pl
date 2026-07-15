// src/components/privacy/CookieSettingsButton.tsx

'use client';

import { useLocale } from 'next-intl';
import type { Locale } from '@/i18n/routing';
import { openCookieSettings } from '@/lib/privacy/consent';

const LABEL: Record<Locale, string> = {
  pl: 'Ustawienia cookies',
  en: 'Cookie settings',
};

export default function CookieSettingsButton({
  className,
}: {
  className?: string;
}) {
  const locale = useLocale() as Locale;

  return (
    <button
      type="button"
      onClick={openCookieSettings}
      className={className}
    >
      {LABEL[locale]}
    </button>
  );
}
