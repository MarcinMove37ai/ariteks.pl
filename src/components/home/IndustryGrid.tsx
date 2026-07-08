// src/components/home/IndustryGrid.tsx
// Kafle branz na stronie glownej. Zrodlo danych: src/content/applications.ts
// (te same dane zasilaja menu i podstrony /applications/[slug]).

import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { APPLICATIONS } from '@/content/applications';
import { Link, type Locale } from '@/i18n/routing';

export default function IndustryGrid({ locale }: { locale: Locale }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {APPLICATIONS.map((app) => (
        <Link
          key={app.id}
          href={`/applications/${app.slug[locale]}`}
          className="group overflow-hidden rounded-lg border border-steel-line bg-surface shadow-card transition-shadow duration-300 hover:shadow-card-hover"
        >
          {/* Grafika branzy */}
          <div className="relative h-48 overflow-hidden bg-carbon-900">
            <Image
              src={app.image}
              alt={app.name[locale]}
              fill
              sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            />
          </div>

          {/* Tresc kafla */}
          <div className="p-6">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-semibold tracking-tight text-ink">
                {app.name[locale]}
              </h3>
              <ArrowRight
                size={18}
                strokeWidth={2}
                className="shrink-0 text-steel transition-all duration-200 group-hover:translate-x-1 group-hover:text-red-600"
                aria-hidden="true"
              />
            </div>

            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              {app.short[locale]}
            </p>

            {app.badges.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {app.badges.map((badge) => (
                  <span key={badge} className="norm-badge">
                    {badge}
                  </span>
                ))}
              </div>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}