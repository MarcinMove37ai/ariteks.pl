// src/components/layout/Nav.tsx
// Nawigacja desktop (client). Wyroznia i blokuje biezaca pozycje.
//  - podstrony (/about, /certificates): wg usePathname,
//  - kotwice strony glownej (/#why ...): wg pozycji scrolla.
//
// Aktywna sekcja = OSTATNIA, ktorej gorna krawedz przekroczyla "linie
// czytania" tuz pod sticky-headerem. Liczymy z realnych pozycji WSZYSTKICH
// sekcji przy kazdym scrollu (rAF-throttled) — deterministycznie, bez
// polegania na tym, ktora sekcja "zmienila widocznosc" (bledny wzorzec
// IntersectionObserver: callback dostaje tylko zmienione wpisy).
// Powyzej pierwszej sekcji (hero) aktywna = null → nic nie podswietlone.

'use client';

import { useEffect, useState } from 'react';
import { Link, usePathname } from '@/i18n/routing';

type NavItem = { href: string; label: string };

// "/#why" -> "why"; inaczej null.
function anchorId(href: string): string | null {
  const m = href.match(/^\/#(.+)$/);
  return m ? m[1] : null;
}

export default function Nav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  const onHome = pathname === '/';
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    if (!onHome) {
      setActiveSection(null);
      return;
    }

    const ids = items
      .map((it) => anchorId(it.href))
      .filter((v): v is string => v !== null);

    const READING_LINE = 100;

    let raf = 0;
    const compute = () => {
      raf = 0;
      let current: string | null = null;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top <= READING_LINE) {
          current = id;
        } else {
          break;
        }
      }
      setActiveSection(current);
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(compute);
    };

    compute();
    const settle = window.setTimeout(compute, 120);

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    window.addEventListener('hashchange', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.removeEventListener('hashchange', onScroll);
      if (raf) cancelAnimationFrame(raf);
      window.clearTimeout(settle);
    };
  }, [onHome, items]);

  const isActive = (href: string) => {
    const id = anchorId(href);
    if (id) return onHome && activeSection === id;
    if (href === '/') return false;
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <nav className="hidden items-center gap-7 lg:flex" aria-label="Main">
      {items.map((item) => {
        const active = isActive(item.href);

        if (active) {
          return (
            <span
              key={item.href}
              aria-current="page"
              className="text-sm font-semibold text-red-600"
            >
              {item.label}
            </span>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className="text-sm font-medium text-ink-soft transition-colors duration-150 hover:text-red-600"
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}