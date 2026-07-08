// src/components/layout/Header.tsx
// Naglowek strony: logo (jeden plik dla obu jezykow), nawigacja desktop,
// CTA zapytania, menu mobilne (MobileNav). Sticky, na bialym tle —
// logo Ariteks (czerwien/antracyt) potrzebuje jasnego podkladu.

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import Nav from './Nav';
import MobileNav from './MobileNav';
import { openRfq } from '../RfqModal';

const NAV_ITEMS = [
  { key: 'why', href: '/#why' },
  { key: 'applications', href: '/#industries' },
  { key: 'technologies', href: '/#technologies' },
  { key: 'partners', href: '/#partners' },
  { key: 'certificates', href: '/certificates' },
  { key: 'about', href: '/about' },
] as const;

export default function Header() {
  const t = useTranslations('nav');

  const items = NAV_ITEMS.map(({ key, href }) => ({
    href,
    label: t(key),
  }));

  return (
    <header className="sticky top-0 z-50 border-b border-steel-line bg-surface/95 backdrop-blur">
      <div className="container-site flex h-20 items-center justify-between gap-8">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center" aria-label="Ariteks">
          <Image
            src="/images/logo/ariteks-logo.png"
            alt="Ariteks — Functional Technical Fabrics"
            width={200}
            height={52}
            priority
            className="h-11 w-auto sm:h-12"
          />
        </Link>

        {/* Nawigacja desktop (client — wyroznia biezaca strone) */}
        <Nav items={items} />

        {/* CTA + menu mobilne */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={openRfq}
            className="hidden items-center rounded bg-carbon-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-red-600 sm:inline-flex"
          >
            {t('rfq')}
          </button>
          <MobileNav items={items} rfqLabel={t('rfq')} />
        </div>
      </div>
    </header>
  );
}