// src/components/applications/ExpandableFabricRow.tsx
// Jeden responsywny wiersz kart: 1 mobile, 2 tablet, 3 desktop.
// Przycisk More rozwija wszystkie pozostałe produkty.

'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

import FabricCard, {
  type FabricCardData,
} from '@/components/fabrics/FabricCard';
import type { Locale } from '@/i18n/routing';

const LABELS = {
  more: {
    pl: 'Więcej',
    en: 'More',
  },
  less: {
    pl: 'Mniej',
    en: 'Show less',
  },
} as const;

function collapsedVisibility(index: number): string {
  if (index === 0) return 'block';
  if (index === 1) return 'hidden sm:block';
  if (index === 2) return 'hidden lg:block';
  return 'hidden';
}

function buttonVisibility(count: number): string {
  if (count <= 1) return 'hidden';
  if (count === 2) return 'inline-flex sm:hidden';
  if (count === 3) return 'inline-flex lg:hidden';
  return 'inline-flex';
}

export default function ExpandableFabricRow({
  fabrics,
  locale,
}: {
  fabrics: FabricCardData[];
  locale: Locale;
}) {
  const [expanded, setExpanded] = useState(false);

  if (fabrics.length === 0) return null;

  return (
    <>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {fabrics.map((fabric, index) => (
          <div
            key={fabric.slug}
            className={expanded ? 'block' : collapsedVisibility(index)}
          >
            <FabricCard fabric={fabric} />
          </div>
        ))}
      </div>

      <div className="mt-7 flex justify-center">
        <button
          type="button"
          onClick={() => setExpanded((current) => !current)}
          aria-expanded={expanded}
          className={`${buttonVisibility(
            fabrics.length,
          )} items-center gap-2 rounded border border-carbon-300 bg-surface px-5 py-2.5 font-mono text-xs font-medium uppercase tracking-[0.16em] text-carbon-800 transition-colors hover:border-red-600 hover:text-red-600`}
        >
          {expanded ? LABELS.less[locale] : LABELS.more[locale]}

          <ChevronDown
            size={15}
            strokeWidth={2}
            className={`transition-transform duration-200 ${
              expanded ? 'rotate-180' : ''
            }`}
            aria-hidden="true"
          />
        </button>
      </div>
    </>
  );
}