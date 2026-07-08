// src/app/sitemap.ts
// Mapa strony dla wyszukiwarek. Next.js generuje /sitemap.xml z tego pliku.
// Sciezki branz brane programowo z APPLICATIONS (zawsze pokrywa wszystkie).
// Struktura URL zgodna z trasami projektu: /{locale}/applications/{slug}
// oraz /{locale}/about, /{locale}/certificates. Domeny: PL ariteks.pl, EN ariteks.eu.
// Segment "applications" nie jest tlumaczony (folder [slug]); zmienia sie tylko slug.

import type { MetadataRoute } from 'next';
import { APPLICATIONS } from '@/content/applications';

const PL = 'https://ariteks.pl';
const EN = 'https://ariteks.eu';

// Buduje pare URL (pl, en) dla danej sciezki wzglednej per jezyk.
function pair(plPath: string, enPath: string) {
  const plUrl = `${PL}/pl${plPath}`.replace(/\/$/, '');
  const enUrl = `${EN}/en${enPath}`.replace(/\/$/, '');
  return { plUrl, enUrl };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const routes: { plPath: string; enPath: string }[] = [
    { plPath: '', enPath: '' }, // strona glowna
    { plPath: '/about', enPath: '/about' },
    { plPath: '/certificates', enPath: '/certificates' },
    ...APPLICATIONS.map((app) => ({
      plPath: `/applications/${app.slug.pl}`,
      enPath: `/applications/${app.slug.en}`,
    })),
  ];

  return routes.map(({ plPath, enPath }) => {
    const { plUrl, enUrl } = pair(plPath, enPath);
    return {
      url: plUrl,
      lastModified: now,
      alternates: {
        languages: { pl: plUrl, en: enUrl },
      },
    };
  });
}