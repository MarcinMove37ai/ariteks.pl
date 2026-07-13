// src/components/layout/Footer.tsx
// Stopka — v8: JEDNA SIATKA dla wszystkich pieter.
// Kazde pietro (kolumny / znaki / operator) uzywa tego samego szablonu
// [1.3fr_0.8fr_1fr_1fr]. Tlo: kratka mesh-deep (wymaga klasy .mesh-deep).
// Zmiany v8: e-mail office@ariteks.pl; sekcja Operator przeniesiona POD
// znaki towarowe i odchudzona (mniejsze odstepy — mniejsza waga wizualna).

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import RfqButton from '../RfqButton';

const GRID = 'grid gap-x-10 gap-y-10 lg:grid-cols-[1.3fr_0.8fr_1fr_1fr]';

const FOOTER_NAV = [
  { key: 'why', href: '/#why' },
  { key: 'applications', href: '/#industries' },
  { key: 'technologies', href: '/#technologies' },
  { key: 'partners', href: '/#partners' },
  { key: 'about', href: '/about' },
] as const;

// 9 znakow — siatka 3x3 wyrownana do kolumn 2-4
const TRADEMARKS: ReadonlyArray<readonly [string, string]> = [
  ['ARITEKS', 'Ariteks A.Ş.'],
  ['CORDURA®', 'INVISTA'],
  ['Twaron®', 'Teijin Aramid'],
  ['Trevira CS®', 'Trevira GmbH'],
  ['Protal®', 'Protal Ltd / Waxman Group'],
  ['Protex®', 'Kaneka Corporation'],
  ['LENZING™', 'Lenzing AG'],
  ['PYROVATEX®', 'Huntsman'],
  ['Bekaert', 'NV Bekaert SA'],
];

const REGISTRY: ReadonlyArray<readonly [string, string]> = [
  ['KRS', '0001044483'],
  ['NIP', '7292750466'],
  ['REGON', '525692626'],
];

function ColumnHeading({ children }: { children: string }) {
  return (
    <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-carbon-400">
      {children}
    </p>
  );
}

export default function Footer() {
  const t = useTranslations('footer');
  const nav = useTranslations('nav');
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="scroll-mt-10 mesh-deep border-t-2 border-red-500 text-carbon-300">
      {/* ============ PIETRO 1: MARKA / NAWIGACJA / KONTAKTY ============ */}
      <div className={`container-site ${GRID} py-16 sm:py-20`}>
        <div>
          <p className="font-display text-[1.75rem] font-bold leading-none tracking-tight text-white">
            ARITEKS
          </p>
          <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-carbon-400">
            Functional technical fabrics
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-carbon-500">
            since 1975
          </p>
          <p className="mt-7 max-w-sm text-[15px] leading-relaxed">
            {t('tagline')}
          </p>
        </div>

        {/* mobile: subtelna linia miedzy marka a Representative */}
        <div className="border-t border-carbon-800 pt-8 lg:border-none lg:pt-0">
          <ColumnHeading>{t('repHeading')}</ColumnHeading>
          <div className="mt-6 space-y-3.5 text-[15px]">
            <p className="font-medium text-white">Aquatrek Solutions P.S.A.</p>
            <p className="leading-relaxed text-carbon-400">
              ul. Romana 20A
              <br />
              93-370 Łódź
            </p>
            <p>
              <a
                href="mailto:office@ariteks.pl"
                className="transition-colors duration-150 hover:text-white"
              >
                office@ariteks.pl
              </a>
            </p>
            <p>
              <a
                href="tel:+48534874104"
                className="transition-colors duration-150 hover:text-white"
              >
                +48 534 874 104
              </a>
            </p>
          </div>
        </div>

        {/* mobile: subtelna linia miedzy Representative a Manufacturer */}
        <div className="border-t border-carbon-800 pt-8 lg:border-none lg:pt-0">
          <ColumnHeading>{t('hqHeading')}</ColumnHeading>
          <div className="mt-6 space-y-3.5 text-[15px]">
            <p className="font-medium text-white">Ariteks A.Ş.</p>
            <p className="leading-relaxed text-carbon-400">
              Otakçılar Cad. No: 80
              <br />
              34050 Eyüpsultan, Istanbul
            </p>
            <p>
              <a
                href="https://www.ariteks.net"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors duration-150 hover:text-white"
              >
                www.ariteks.net
              </a>
            </p>
          </div>
        </div>

        {/* mobile: subtelna linia miedzy Manufacturer a Navigation */}
        <nav
          aria-label="Footer"
          className="border-t border-carbon-800 pt-8 lg:border-none lg:pt-0"
        >
          <ColumnHeading>{t('navHeading')}</ColumnHeading>
          <ul className="mt-6 space-y-3.5 text-[15px]">
            {FOOTER_NAV.map((item) => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  className="transition-colors duration-150 hover:text-white"
                >
                  {nav(item.key)}
                </Link>
              </li>
            ))}
            <li>
              <RfqButton className="transition-colors duration-150 hover:text-white">
                {nav('rfq')}
              </RfqButton>
            </li>
          </ul>
        </nav>
      </div>

      {/* ============ PIETRO 2: ZNAKI TOWAROWE (ta sama siatka) ============ */}
      <div className="border-t border-carbon-800">
        <div className={`container-site ${GRID} py-10`}>
          <div>
            <ColumnHeading>{t('tmHeading')}</ColumnHeading>
            <p className="mt-3 max-w-[16rem] text-[12px] leading-relaxed text-carbon-500">
              {t('tmNote')}
            </p>
          </div>

          {/* Kolumny 2-4: 9 znakow w rzedach po 3, krawedzie = kolumny wyzej */}
          <ul className="grid gap-y-4 text-[13px] sm:grid-cols-3 sm:gap-x-10 lg:col-span-3">
            {TRADEMARKS.map(([mark, owner]) => (
              <li key={mark} className="leading-snug">
                <span className="text-carbon-300">{mark}</span>
                <br />
                <span className="text-carbon-500">{owner}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ============ PIETRO 3: OPERATOR (odchudzony, pod znakami) ============ */}
      <div className="border-t border-carbon-800">
        <div className={`container-site ${GRID} py-8`}>
          <ColumnHeading>{t('operatorHeading')}</ColumnHeading>

          {/* Kolumny 2-3: firma, rola, sad — zageszczone linie */}
          <div className="lg:col-span-2">
            <p className="text-[13px] font-medium leading-snug text-carbon-300">
              {t('operatorName')}
            </p>
            <p className="mt-1 text-[12px] leading-snug text-carbon-500">
              {t('operatorRole')}
            </p>
            <p className="mt-1 text-[11px] leading-snug text-carbon-600">
              {t('court')}
            </p>
          </div>

          {/* Kolumna 4: karta rejestrowa — zageszczona */}
          <dl className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-0.5 self-start font-mono text-[12px]">
            {REGISTRY.map(([label, value]) => (
              <div key={label} className="contents">
                <dt className="text-carbon-600">{label}</dt>
                <dd className="text-carbon-400">{value}</dd>
              </div>
            ))}
            <div className="contents">
              <dt className="text-carbon-600">{t('capitalLabel')}</dt>
              <dd className="text-carbon-400">50 000 PLN</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* ============ PIETRO 4: COPYRIGHT ============ */}
      <div className="border-t border-carbon-800">
        <div className="container-site py-8 text-center text-[13px] text-carbon-400">
          © {year} Aquatrek Solutions P.S.A. {t('rights')}
        </div>
      </div>
    </footer>
  );
}