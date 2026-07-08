// src/app/layout.tsx
// Root layout — wymagany przez Next.js. Tag <html> renderuje layout [locale],
// bo to tam znamy jezyk strony (atrybut lang). Ten plik tylko przekazuje dzieci.

import type { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}