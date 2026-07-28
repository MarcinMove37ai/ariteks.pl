// next.config.mjs
// Konfiguracja Next.js dla Ariteks WWW
// - plugin next-intl wskazuje na src/i18n/request.ts,
// - obrazy serwowane w AVIF/WebP,
// - stare, bledne adresy zasobow przekierowywane
//   na prawidlowe pliki.

import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin(
  './src/i18n/request.ts',
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [
      640,
      750,
      828,
      1080,
      1200,
      1920,
      2560,
    ],
  },

  // Stare, blednie utworzone adresy obrazow
  // wykryte przez Google Search Console.
  async redirects() {
    return [
      {
        source:
          '/ariteks/fabrics/ardolu/images/en-343__0f8d3740e4.jpg-1',
        destination:
          '/ariteks/fabrics/ardolu/images/en-343__0f8d3740e4.jpg',
        permanent: true,
      },
      {
        source:
          '/ariteks/fabrics/arshirt-moda-pro/images/en-1149-3__5b6403ea41.jpg-2',
        destination:
          '/ariteks/fabrics/arshirt-moda-pro/images/en-1149-3__5b6403ea41.jpg',
        permanent: true,
      },
    ];
  },

  // Railway: kompresja i naglowki bezpieczenstwa.
  compress: true,
  poweredByHeader: false,

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      {
        // Grafiki i fonty: cache na rok
        // dla plikow wersjonowanych w nazwie.
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value:
              'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);