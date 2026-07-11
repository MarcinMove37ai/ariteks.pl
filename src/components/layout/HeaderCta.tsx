'use client';

// src/components/layout/HeaderCta.tsx
// Dynamiczne CTA nagłówka (decyzja 2026-07-11):
//  - poza katalogiem: czarny przycisk "Product catalog" -> /fabrics,
//  - WEWNATRZ katalogu (/fabrics...): przycisk zmienia sie w
//    "Request a quote" (otwiera modal RFQ) — katalog ma wtedy swoje
//    naturalne CTA, a link do samego siebie bylby pusty.

import { Link, usePathname } from '@/i18n/routing';
import { openRfq } from '../RfqModal';

const BTN =
  'hidden items-center rounded bg-carbon-900 px-5 py-2.5 text-sm ' +
  'font-semibold text-white transition-colors duration-200 ' +
  'hover:bg-red-600 sm:inline-flex';

export default function HeaderCta({
  catalogLabel,
  rfqLabel,
}: {
  catalogLabel: string;
  rfqLabel: string;
}) {
  const pathname = usePathname();
  const inCatalog = pathname === '/fabrics' || pathname.startsWith('/fabrics/');

  if (inCatalog) {
    return (
      <button type="button" onClick={openRfq} className={BTN}>
        {rfqLabel}
      </button>
    );
  }
  return (
    <Link href="/fabrics" className={BTN}>
      {catalogLabel}
    </Link>
  );
}