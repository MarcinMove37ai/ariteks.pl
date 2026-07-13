// src/components/fabrics/FabricCard.tsx
// Wspólna karta produktu używana w katalogu i na stronach aplikacji.

import { ArrowRight } from 'lucide-react';

import { Link } from '@/i18n/routing';

export type FabricCardData = {
  slug: string;
  href: string;
  name: string;
  heroImage: string | null;
  weave: string;
  weight: string;
  composition: string;
  categoryLabel: string | null;
  norms: string[];
};

export default function FabricCard({
  fabric,
}: {
  fabric: FabricCardData;
}) {
  return (
    <Link
      href={fabric.href}
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-steel-line bg-surface shadow-card transition-shadow duration-300 hover:shadow-card-hover"
    >
      <div className="relative h-44 overflow-hidden bg-carbon-900">
        {fabric.heroImage ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={fabric.heroImage}
            alt={fabric.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="mesh-dark flex h-full items-center justify-center">
            <span className="font-mono text-xs uppercase tracking-wider text-carbon-400">
              {fabric.weave}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-xl font-bold tracking-tight text-ink transition-colors group-hover:text-red-600">
            {fabric.name}
          </h3>

          <ArrowRight
            size={18}
            strokeWidth={2}
            className="mt-1 shrink-0 text-steel transition-all duration-200 group-hover:translate-x-1 group-hover:text-red-600"
            aria-hidden="true"
          />
        </div>

        <p className="mt-2 font-mono text-xs uppercase tracking-wider text-steel">
          {fabric.weight} · {fabric.composition} · {fabric.weave}
        </p>

        {fabric.categoryLabel && (
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            {fabric.categoryLabel}
          </p>
        )}

        {fabric.norms.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2 pt-1">
            {fabric.norms.slice(0, 3).map((norm) => (
              <span key={norm} className="norm-badge">
                {norm}
              </span>
            ))}

            {fabric.norms.length > 3 && (
              <span className="font-mono text-xs text-steel">
                +{fabric.norms.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}