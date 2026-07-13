// src/components/layout/Header.tsx
// Naglowek strony: logo (jeden plik dla obu jezykow), nawigacja desktop,
// przelacznik jezyka + CTA, menu mobilne (MobileNav). Sticky.
// CTA (decyzja 2026-07-11): przycisk DYNAMICZNY (HeaderCta, client) —
// poza katalogiem "Product catalog" -> /fabrics; wewnatrz katalogu
// zmienia sie w "Request a quote" (modal RFQ). Menu mobilne: RFQ zostaje.
// Uklad prawej strony: [EN] | [CTA] [menu].

import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import Nav from './Nav';
import MobileNav from './MobileNav';
import LangSwitch from './LangSwitch';
import HeaderCta from './HeaderCta';

const NAV_ITEMS = [
  { key: 'why', href: '/#why' },
  { key: 'applications', href: '/#industries' },
  { key: 'technologies', href: '/#technologies' },
  { key: 'partners', href: '/#partners' },
  { key: 'certificates', href: '/certificates' },
  { key: 'about', href: '/about' },
] as const;

const CATALOGUE_LABEL = { pl: 'Katalog produktów', en: 'Product catalog' } as const;

export default function Header() {
  const t = useTranslations('nav');
  const locale = useLocale() as keyof typeof CATALOGUE_LABEL;
  const catalogueLabel = CATALOGUE_LABEL[locale] ?? CATALOGUE_LABEL.en;

  const items = NAV_ITEMS.map(({ key, href }) => ({
    href,
    label: t(key),
  }));

  // menu mobilne: katalog NIE jest pozycja listy — ma wlasny czerwony
  // przycisk na dole nakladki (MobileNav.catalogLabel);
  // + Kontakt -> kotwica stopki BIEZACEJ strony (mobile only — na desktopie
  // stopka jest na wyciagniecie scrolla, nav i tak ciasny)
  const CONTACT_LABEL = { pl: 'Kontakt', en: 'Contact' } as const;
  const mobileItems = [
    ...items,
    { href: '#contact', label: CONTACT_LABEL[locale] ?? CONTACT_LABEL.en },
  ];

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

        {/* Prawa grupa: przelacznik jezyka | KATALOG (CTA) | menu */}
        <div className="flex items-center gap-4">
          {/* Przelacznik jezyka — desktop. Separator jest CZESCIA LangSwitch,
              wiec znika razem z ukrytym przelacznikiem (brak wiszacej kreski). */}
          <div className="hidden lg:block">
            <LangSwitch variant="desktop" />
          </div>

          {/* Stałe CTA prowadzące do katalogu produktów */}
          <HeaderCta catalogLabel={catalogueLabel} />

          <MobileNav items={mobileItems} catalogLabel={catalogueLabel} />
        </div>
      </div>
    </header>
  );
}