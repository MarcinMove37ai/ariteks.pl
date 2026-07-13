// src/components/RfqButton.tsx
// Kliencki przycisk otwierajacy modal RFQ.
// Moze przekazac domyslna aplikacje do selecta formularza.

'use client';

import type { ReactNode } from 'react';
import type { ApplicationId } from '@/content/fabric-application-overrides';
import { openRfq } from './RfqModal';

export default function RfqButton({
  className,
  children,
  applicationId,
}: {
  className?: string;
  children: ReactNode;
  applicationId?: ApplicationId;
}) {
  return (
    <button
      type="button"
      onClick={() => openRfq(applicationId)}
      className={className}
    >
      {children}
    </button>
  );
}