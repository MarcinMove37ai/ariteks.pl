// src/app/robots.ts
// Reguly dla robotow wyszukiwarek. Next.js generuje /robots.txt z tego pliku.
// Wskazuje sitemap. Domena glowna: ariteks.pl (PL) — wersja EN na ariteks.eu.

import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const base = 'https://ariteks.pl';
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${base}/sitemap.xml`,
  };
}