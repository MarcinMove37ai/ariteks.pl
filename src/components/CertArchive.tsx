'use client';

import { useState } from 'react';
import type { CertTarget } from '@/content/certificates';

/**
 * Rozwijacz starszych roczników certyfikatu.
 * Domyslnie zwiniety — po klik pokazuje liste lat jako linki (nowa karta).
 */
export default function CertArchive({
  archive,
  toggleLabel,
}: {
  archive: CertTarget[];
  toggleLabel: string;
}) {
  const [open, setOpen] = useState(false);

  if (archive.length === 0) return null;

  return (
    <div className="mt-4 border-t border-carbon-100 pt-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between font-mono text-[11px] uppercase tracking-wider text-steel transition-colors hover:text-red"
      >
        <span>
          {toggleLabel} ({archive.length})
        </span>
        <span
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          aria-hidden
        >
          &#8964;
        </span>
      </button>

      {open && (
        <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-2">
          {archive.map((t, i) => (
            <li key={i}>
              <a
                href={t.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded border border-carbon-100 px-2.5 py-1 font-mono text-xs text-ink transition-colors hover:border-red hover:text-red"
              >
                {t.year ?? '—'}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}