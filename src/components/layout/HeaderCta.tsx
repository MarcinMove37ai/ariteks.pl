// src/components/layout/HeaderCta.tsx
// Stałe CTA nagłówka:
// zawsze pokazuje „Product catalog” i prowadzi do katalogu.
//
// Komponent pozostaje wydzielony, aby można było później
// zmienić jego zachowanie bez przebudowy Header.tsx.

import { Link } from '@/i18n/routing';

const BTN =
  'hidden items-center rounded bg-red-600 px-5 py-2.5 text-sm ' +
  'font-semibold text-white transition-colors duration-200 ' +
  'hover:bg-carbon-900 sm:inline-flex';

export default function HeaderCta({
  catalogLabel,
}: {
  catalogLabel: string;
}) {
  return (
    <Link href="/fabrics" className={BTN}>
      {catalogLabel}
    </Link>
  );
}