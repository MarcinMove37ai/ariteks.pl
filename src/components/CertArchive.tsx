'use client';

import { useState } from 'react';
import type { CertTarget } from '@/content/certificates';

/**
 * Rozwijacz starszych roczników certyfikatu.
 * Domyślnie zwinięty — po kliknięciu pokazuje listę lat jako linki.
 */
export default function CertArchive({
  archive,
  toggleLabel,
}: {
  archive: CertTarget[];
  toggleLabel: string;
}) {
  const [open, setOpen] = useState(false);

  if (archive.length === 0) {
    return null;
  }

  return (
    <div className="border-t border-carbon-100 pt-3">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex min-h-10 w-full items-center justify-between gap-4 text-left font-mono text-[10px] uppercase leading-relaxed tracking-wider text-steel transition-colors hover:text-red"
      >
        <span className="min-w-0">
          {toggleLabel} ({archive.length})
        </span>

        <span
          aria-hidden
          className={`flex h-6 w-6 shrink-0 items-center justify-center transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
        >
          &#8964;
        </span>
      </button>

      {open && (
        <ul className="grid grid-cols-3 gap-2 pt-3">
          {archive.map((target) => (
            <li key={`${target.year ?? 'unknown'}-${target.url}`}>
              <a
                href={target.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-8 w-full items-center justify-center rounded border border-carbon-100 px-2 py-1 text-center font-mono text-xs text-ink transition-colors hover:border-red hover:text-red"
              >
                {target.year ?? '—'}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}