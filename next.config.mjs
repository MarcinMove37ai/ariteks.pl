// next.config.mjs
// Konfiguracja Next.js dla Ariteks WWW
// - plugin next-intl wskazuje na src/i18n/request.ts (konfiguracja jezykow)
// - obrazy serwowane w AVIF/WebP (mniejsze pliki, lepszy Core Web Vitals)

import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2560],
  },

  // Railway: kompresja i naglowki bezpieczenstwa
  compress: true,
  poweredByHeader: false,

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
      {
        // grafiki i fonty: cache na rok (pliki wersjonowane nazwa)
        source: '/images/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
