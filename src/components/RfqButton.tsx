// src/components/RfqButton.tsx
// Kliencki przycisk otwierajacy modal RFQ — zamiennik <Link href="/contact">
// w komponentach serwerowych (strona glowna, podstrony branzowe).
// Przyjmuje className i children 1:1, wiec podmiana jest mechaniczna:
//   <Link href="/contact" className="...">X</Link>
//   -> <RfqButton className="...">X</RfqButton>

'use client';

import type { ReactNode } from 'react';
import { openRfq } from './RfqModal';

export default function RfqButton({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <button type="button" onClick={openRfq} className={className}>
      {children}
    </button>
  );
}