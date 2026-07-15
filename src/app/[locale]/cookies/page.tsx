// src/app/[locale]/cookies/page.tsx
// Informacja o cookies i możliwość ponownego otwarcia ustawień.

import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { Link, type Locale } from '@/i18n/routing';
import CookieSettingsButton from '@/components/privacy/CookieSettingsButton';

const BASE_URL = 'https://ariteks.pl';

const COPY = {
  pl: {
    title: 'Cookies i ustawienia prywatności',
    description:
      'Informacje o technologiach używanych przez ariteks.pl oraz sposób zmiany zgód na opcjonalne narzędzia marketingowe Meta.',
    eyebrow: 'Prywatność',
    heading: 'Cookies i podobne technologie',
    lead:
      'Strona korzysta z technologii niezbędnych do zapamiętania ustawień. Opcjonalny pomiar marketingowy Meta uruchamiamy wyłącznie po Twojej zgodzie.',
    necessaryHeading: 'Technologie niezbędne',
    necessaryText:
      'Są wymagane do zapamiętania wyboru dotyczącego cookies. Nie służą do profilowania reklamowego i nie można ich wyłączyć w panelu ustawień.',
    marketingHeading: 'Technologie marketingowe Meta',
    marketingText:
      'Po wyrażeniu zgody Meta Pixel może zapisywać identyfikatory _fbp i _fbc. Conversions API może otrzymać dane zdarzeń ze strony w celu pomiaru kampanii i deduplikacji zdarzeń przeglądarkowych oraz serwerowych.',
    noConsent:
      'Przed wyrażeniem zgody Pixel Meta nie jest ładowany, a zdarzenia marketingowe nie są wysyłane przez Conversions API.',
    tableName: 'Nazwa',
    tableType: 'Typ',
    tablePurpose: 'Cel',
    tableDuration: 'Okres',
    necessary: 'Niezbędne',
    marketing: 'Marketingowe',
    year: '12 miesięcy',
    days90: 'Do 90 dni',
    consentPurpose:
      'Zapamiętanie wyboru: wszystkie cookies albo wyłącznie niezbędne.',
    fbpPurpose:
      'Identyfikacja przeglądarki na potrzeby pomiaru reklam Meta.',
    fbcPurpose:
      'Zapis informacji o kliknięciu reklamy Meta, gdy adres zawiera parametr fbclid.',
    changeHeading: 'Zmiana lub cofnięcie zgody',
    changeText:
      'Możesz w dowolnym momencie ponownie otworzyć ustawienia i zmienić decyzję. Odmowa nie wpływa na dostęp do katalogu ani formularza zapytania.',
    openSettings: 'Otwórz ustawienia cookies',
    contactHeading: 'Kontakt w sprawach strony',
    contactText:
      'Operatorem serwisu jest Aquatrek Solutions P.S.A., ul. Romana 20A, 93-370 Łódź. Pytania dotyczące ustawień prywatności możesz wysłać na office@ariteks.pl.',
    metaPolicy: 'Polityka prywatności Meta',
    home: 'Strona główna',
    current: 'Cookies',
  },
  en: {
    title: 'Cookies and privacy settings',
    description:
      'Information about technologies used by ariteks.pl and how to change consent for optional Meta marketing tools.',
    eyebrow: 'Privacy',
    heading: 'Cookies and similar technologies',
    lead:
      'The website uses essential technologies to remember settings. Optional Meta marketing measurement is activated only after your consent.',
    necessaryHeading: 'Essential technologies',
    necessaryText:
      'These are required to remember your cookie choice. They are not used for advertising profiling and cannot be disabled in the settings panel.',
    marketingHeading: 'Meta marketing technologies',
    marketingText:
      'After consent, Meta Pixel may store the _fbp and _fbc identifiers. Conversions API may receive website event data to measure campaigns and deduplicate browser and server events.',
    noConsent:
      'Before consent, Meta Pixel is not loaded and marketing events are not sent through Conversions API.',
    tableName: 'Name',
    tableType: 'Type',
    tablePurpose: 'Purpose',
    tableDuration: 'Duration',
    necessary: 'Essential',
    marketing: 'Marketing',
    year: '12 months',
    days90: 'Up to 90 days',
    consentPurpose:
      'Remembering the choice between all cookies and essential cookies only.',
    fbpPurpose:
      'Browser identification for Meta advertising measurement.',
    fbcPurpose:
      'Recording a Meta ad click when the address contains the fbclid parameter.',
    changeHeading: 'Changing or withdrawing consent',
    changeText:
      'You can reopen the settings and change your decision at any time. Refusing does not affect access to the catalog or enquiry form.',
    openSettings: 'Open cookie settings',
    contactHeading: 'Website contact',
    contactText:
      'The website is operated by Aquatrek Solutions P.S.A., ul. Romana 20A, 93-370 Łódź, Poland. Privacy-setting questions can be sent to office@ariteks.pl.',
    metaPolicy: 'Meta Privacy Policy',
    home: 'Home',
    current: 'Cookies',
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const loc = locale as Locale;
  const copy = COPY[loc];

  const plUrl = `${BASE_URL}/cookies`;
  const enUrl = `${BASE_URL}/en/cookies`;
  const canonical = loc === 'en' ? enUrl : plUrl;

  return {
    title: copy.title,
    description: copy.description,
    alternates: {
      canonical,
      languages: {
        pl: plUrl,
        en: enUrl,
        'x-default': plUrl,
      },
    },
    openGraph: {
      type: 'website',
      url: canonical,
      siteName: 'Ariteks',
      locale: loc === 'pl' ? 'pl_PL' : 'en_GB',
      alternateLocale: loc === 'pl' ? ['en_GB'] : ['pl_PL'],
      title: copy.title,
      description: copy.description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function CookiesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const loc = locale as Locale;
  const copy = COPY[loc];
  const localeBaseUrl =
    loc === 'en' ? `${BASE_URL}/en` : BASE_URL;
  const pageUrl = `${localeBaseUrl}/cookies`;

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `${pageUrl}#breadcrumb`,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: copy.home,
        item: localeBaseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: copy.current,
        item: pageUrl,
      },
    ],
  };

  const rows = [
    {
      name: 'ariteks_consent_v1',
      type: copy.necessary,
      purpose: copy.consentPurpose,
      duration: copy.year,
    },
    {
      name: '_fbp',
      type: copy.marketing,
      purpose: copy.fbpPurpose,
      duration: copy.days90,
    },
    {
      name: '_fbc',
      type: copy.marketing,
      purpose: copy.fbcPurpose,
      duration: copy.days90,
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd).replace(
            /</g,
            '\\u003c',
          ),
        }}
      />

      <main>
        <section className="mesh-dark">
          <div className="container-site py-20 sm:py-24">
            <p className="eyebrow eyebrow-dark">
              {copy.eyebrow}
            </p>
            <h1 className="mt-6 max-w-4xl font-display text-display-xl font-bold text-white text-balance">
              {copy.heading}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-carbon-200 text-pretty">
              {copy.lead}
            </p>
          </div>
        </section>

        <section className="bg-surface">
          <div className="container-site grid gap-12 py-20 sm:py-24 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            <div>
              <h2 className="font-display text-display-md font-bold text-ink">
                {copy.necessaryHeading}
              </h2>
              <p className="mt-5 leading-relaxed text-ink-soft">
                {copy.necessaryText}
              </p>

              <h2 className="mt-12 font-display text-display-md font-bold text-ink">
                {copy.marketingHeading}
              </h2>
              <p className="mt-5 leading-relaxed text-ink-soft">
                {copy.marketingText}
              </p>
              <p className="mt-4 border-l-2 border-red-500 pl-5 leading-relaxed text-ink-soft">
                {copy.noConsent}
              </p>
              <a
                href="https://www.facebook.com/privacy/policy/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex text-sm font-semibold text-red-600 underline decoration-red-300 underline-offset-4 hover:text-red-700"
              >
                {copy.metaPolicy}
              </a>
            </div>

            <div className="min-w-0">
              <div className="overflow-x-auto rounded-lg border border-steel-line bg-white shadow-card">
                <table className="w-full min-w-[680px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-carbon-100 bg-paper">
                      {[
                        copy.tableName,
                        copy.tableType,
                        copy.tablePurpose,
                        copy.tableDuration,
                      ].map((heading) => (
                        <th
                          key={heading}
                          className="px-5 py-3 font-mono text-[11px] uppercase tracking-wider text-steel"
                        >
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr
                        key={row.name}
                        className="border-b border-carbon-100 last:border-0"
                      >
                        <td className="px-5 py-4 font-mono text-xs font-medium text-carbon-950">
                          {row.name}
                        </td>
                        <td className="px-5 py-4 text-ink">
                          {row.type}
                        </td>
                        <td className="px-5 py-4 leading-relaxed text-ink-soft">
                          {row.purpose}
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-ink-soft">
                          {row.duration}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-10 rounded-lg border border-steel-line bg-paper p-6 shadow-card">
                <h2 className="font-display text-2xl font-bold text-ink">
                  {copy.changeHeading}
                </h2>
                <p className="mt-3 leading-relaxed text-ink-soft">
                  {copy.changeText}
                </p>
                <CookieSettingsButton className="mt-6 inline-flex items-center rounded bg-carbon-950 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-600" />
              </div>

              <div className="mt-8">
                <h2 className="font-display text-2xl font-bold text-ink">
                  {copy.contactHeading}
                </h2>
                <p className="mt-3 leading-relaxed text-ink-soft">
                  {copy.contactText}
                </p>
                <a
                  href="mailto:office@ariteks.pl"
                  className="mt-4 inline-flex font-medium text-red-600 hover:text-red-700"
                >
                  office@ariteks.pl
                </a>
              </div>

              <Link
                href="/"
                className="mt-10 inline-flex text-sm font-semibold text-steel underline decoration-carbon-300 underline-offset-4 hover:text-red-600"
              >
                ← {copy.home}
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
