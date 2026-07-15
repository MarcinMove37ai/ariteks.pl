// src/app/robots.ts
// Reguły dla robotów wyszukiwarek, systemów AI i pobrań inicjowanych przez użytkownika.
// Domena kanoniczna: ariteks.pl. Wersja angielska działa pod /en.

import type { MetadataRoute } from 'next';

const AI_USER_AGENTS = [
  'OAI-SearchBot',
  'GPTBot',
  'ChatGPT-User',
  'Claude-SearchBot',
  'ClaudeBot',
  'Claude-User',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
] as const;

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://ariteks.pl';

  return {
    rules: [
      {
        userAgent: [...AI_USER_AGENTS],
        allow: '/',
      },
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
