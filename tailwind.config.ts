// tailwind.config.ts
// Design system Ariteks WWW — v2 (pivot pod logotyp)
// Paleta: czerwien Ariteks + antracyt + laboratoryjna biel
// Typografia: Bodoni Moda (display, jak logotyp) / Instrument Sans / IBM Plex Mono

import type { Config } from 'tailwindcss';

// Antracyt — skala neutralna (kolor monogramu z logo)
const carbon = {
  50: '#F5F5F6',
  100: '#E9E9EB',
  200: '#D2D3D6',
  300: '#ABADB2',
  400: '#7E8087',
  500: '#5C5E65',
  600: '#45474D',
  700: '#36383D',
  800: '#2A2C30',
  900: '#212327',
  950: '#161719',
};

// Czerwien Ariteks — skala akcentowa (kolor logotypu)
const red = {
  50: '#FBEEED',
  100: '#F6D9D7',
  200: '#ECAFAB',
  300: '#E2837C',
  400: '#D75A51',
  500: '#CD3E34',
  600: '#B0332B',
  700: '#8F2A23',
  800: '#6F201B',
  900: '#521713',
  950: '#380E0B',
};

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        carbon,
        red,
        paper: '#F7F7F8',
        surface: '#FFFFFF',
        ink: {
          DEFAULT: '#1B1C1E',
          soft: '#3F4145',
        },
        steel: {
          DEFAULT: '#6E7076',
          light: '#9C9EA4',
          line: '#E5E5E7',
        },

        // --- ALIASY PRZEJSCIOWE ---
        // Utrzymuja render biezacej strony glownej do czasu jej aktualizacji.
        // DO USUNIECIA w partii z nowym page.tsx.
        indigo: carbon,
        fluo: {
          DEFAULT: red[500],
          soft: red[300],
          deep: red[700],
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        // Didona potrzebuje wiekszej interlinii i neutralnego trackingu
        'display-xl': ['clamp(2.5rem, 5.5vw, 4.5rem)', { lineHeight: '1.08', letterSpacing: '-0.005em' }],
        'display-lg': ['clamp(2rem, 4vw, 3.125rem)', { lineHeight: '1.12', letterSpacing: '-0.005em' }],
        'display-md': ['clamp(1.5rem, 2.5vw, 2rem)', { lineHeight: '1.2', letterSpacing: '0' }],
        eyebrow: ['0.8125rem', { lineHeight: '1.2', letterSpacing: '0.14em' }],
      },
      maxWidth: {
        site: '80rem',
      },
      borderRadius: {
        sm: '0.1875rem',
        DEFAULT: '0.375rem',
        lg: '0.625rem',
      },
      boxShadow: {
        card: '0 1px 2px rgba(22, 23, 25, 0.06), 0 4px 16px rgba(22, 23, 25, 0.06)',
        'card-hover': '0 2px 4px rgba(22, 23, 25, 0.08), 0 12px 32px rgba(22, 23, 25, 0.12)',
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};

export default config;