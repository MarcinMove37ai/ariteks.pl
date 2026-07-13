// src/app/[locale]/layout.tsx
// Layout jezykowy — Header + Footer w drzewie, bazowe metadane SEO per jezyk.
// Canonical i hreflang sa definiowane na poziomie konkretnych tras.

import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { Bodoni_Moda, Instrument_Sans, IBM_Plex_Mono } from 'next/font/google';
import { routing, type Locale } from '@/i18n/routing';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import RfqModal from '@/components/RfqModal';
import '../globals.css';

const display = Bodoni_Moda({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-display',
  display: 'swap',
});

const sans = Instrument_Sans({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-sans',
  display: 'swap',
});

const mono = IBM_Plex_Mono({
  weight: ['400', '500'],
  subsets: ['latin', 'latin-ext'],
  variable: '--font-mono',
  display: 'swap',
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const SEO: Record<Locale, { title: string; description: string }> = {
  pl: {
    title: 'Ariteks — Tkaniny specjalnego przeznaczenia | Producent od 1975',
    description:
      'Światowy lider w produkcji tkanin specjalnego przeznaczenia: ochronne, trudnopalne, hi-vis, medyczne i sportowe. Normy EN ISO, 12 laboratoriów, oficjalne przedstawicielstwo w Polsce.',
  },
  en: {
    title: 'Ariteks — Special-Purpose Fabrics | Manufacturer since 1975',
    description:
      'A world leader in special-purpose fabric manufacturing: protective, flame-retardant, hi-vis, medical and sports fabrics. EN ISO standards, 12 laboratories, official EU representative office.',
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const loc = (routing.locales.includes(locale as Locale)
    ? locale
    : routing.defaultLocale) as Locale;

  return {
    title: {
      default: SEO[loc].title,
      template: '%s — Ariteks',
    },
    description: SEO[loc].description,
    openGraph: {
      title: SEO[loc].title,
      description: SEO[loc].description,
      type: 'website',
      locale: loc === 'pl' ? 'pl_PL' : 'en_GB',
      siteName: 'Ariteks',
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
    >
      <body suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          <Header />
          {children}
          <Footer />
          <RfqModal />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}