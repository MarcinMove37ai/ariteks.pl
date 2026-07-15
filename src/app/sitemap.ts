// src/app/sitemap.ts
// Mapa strony dla wyszukiwarek.
//
// Model adresów:
//   https://ariteks.pl/     -> PL
//   https://ariteks.pl/en   -> EN
//
// ariteks.eu przekierowuje na ariteks.pl i nie powinien występować
// w sitemapie ani w hreflangach.

import type { MetadataRoute } from 'next';
import { APPLICATIONS } from '@/content/applications';
import {
  FABRICS,
  getFamilySlugs,
} from '@/content/fabrics';

const BASE_URL = 'https://ariteks.pl';

type RoutePair = {
  plPath: string;
  enPath: string;
};

function createLanguagePair(
  plPath: string,
  enPath: string
) {
  const plUrl = plPath
    ? `${BASE_URL}${plPath}`
    : `${BASE_URL}/`;

  const enUrl = enPath
    ? `${BASE_URL}/en${enPath}`
    : `${BASE_URL}/en`;

  return {
    plUrl,
    enUrl,
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: RoutePair[] = [
    {
      plPath: '',
      enPath: '',
    },
    {
      plPath: '/about',
      enPath: '/about',
    },
    {
      plPath: '/fabrics',
      enPath: '/fabrics',
    },
    {
      plPath: '/certificates',
      enPath: '/certificates',
    },
    {
      plPath: '/data/catalog',
      enPath: '/data/catalog',
    },

    ...APPLICATIONS.map((application) => ({
      plPath: `/applications/${application.slug.pl}`,
      enPath: `/applications/${application.slug.en}`,
    })),

    ...getFamilySlugs().map((family) => ({
      plPath: `/fabrics/${family}`,
      enPath: `/fabrics/${family}`,
    })),

    ...FABRICS.map((fabric) => ({
      plPath: `/fabrics/${fabric.subFamily}/${fabric.slug}`,
      enPath: `/fabrics/${fabric.subFamily}/${fabric.slug}`,
    })),
  ];

  return routes.flatMap(({ plPath, enPath }) => {
    const { plUrl, enUrl } = createLanguagePair(
      plPath,
      enPath
    );

    const languages = {
      pl: plUrl,
      en: enUrl,
    };

    return [
      {
        url: plUrl,
        alternates: {
          languages,
        },
      },
      {
        url: enUrl,
        alternates: {
          languages,
        },
      },
    ];
  });
}