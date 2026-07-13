// src/components/applications/ApplicationProductSections.tsx
// Produkty primary i secondary dla strony aplikacji.
// Nagłówki są spersonalizowane dla konkretnej aplikacji.
// Dane pozostają po stronie serwera; do klienta trafia tylko lekki model kart.

import ExpandableFabricRow from '@/components/applications/ExpandableFabricRow';
import type { FabricCardData } from '@/components/fabrics/FabricCard';
import type { ApplicationId } from '@/content/fabric-application-overrides';
import { getApplicationProductCopy } from '@/content/application-page-content';
import {
  getCategoryById,
  type FabricDef,
} from '@/content/fabrics';
import {
  getFabricApplicationAssignment,
  getPrimaryFabricsForApplication,
  getSecondaryFabricsForApplication,
} from '@/lib/fabricApplications';
import type { Locale } from '@/i18n/routing';

type RelationKind = 'primary' | 'secondary';

function relationConfidence(
  fabric: FabricDef,
  relation: RelationKind,
): number {
  const assignment =
    getFabricApplicationAssignment(fabric.slug);

  const confidence =
    relation === 'primary'
      ? assignment?.primaryConfidence
      : assignment?.secondaryConfidence;

  // Ręczna korekta ma pierwszeństwo przed wynikiem modelu.
  return confidence === null ? 101 : confidence ?? 0;
}

function sortFabrics(
  fabrics: FabricDef[],
  relation: RelationKind,
): FabricDef[] {
  return [...fabrics].sort((a, b) => {
    const confidenceDifference =
      relationConfidence(b, relation) -
      relationConfidence(a, relation);

    if (confidenceDifference !== 0) {
      return confidenceDifference;
    }

    const imageDifference =
      Number(Boolean(b.heroImage)) -
      Number(Boolean(a.heroImage));

    if (imageDifference !== 0) return imageDifference;

    const documentationDifference =
      b.dataSheets.length +
      b.certificates.length -
      (a.dataSheets.length + a.certificates.length);

    if (documentationDifference !== 0) {
      return documentationDifference;
    }

    const normsDifference =
      b.norms.length - a.norms.length;

    if (normsDifference !== 0) return normsDifference;

    return a.name.localeCompare(b.name, 'en');
  });
}

function toCardData(
  fabric: FabricDef,
  locale: Locale,
): FabricCardData {
  const category = getCategoryById(fabric.categoryId);

  return {
    slug: fabric.slug,
    href: `/fabrics/${fabric.subFamily}/${fabric.slug}`,
    name: fabric.name,
    heroImage: fabric.heroImage || null,
    weave: fabric.weave,
    weight: fabric.weight,
    composition: fabric.composition,
    categoryLabel: category?.name[locale] ?? null,
    norms: [...fabric.norms],
  };
}

function ProductSection({
  title,
  lead,
  fabrics,
  locale,
  surface,
}: {
  title: string;
  lead: string;
  fabrics: FabricCardData[];
  locale: Locale;
  surface: 'paper' | 'surface';
}) {
  if (fabrics.length === 0) return null;

  return (
    <section
      className={`border-b border-steel-line ${
        surface === 'paper' ? 'bg-paper' : 'bg-surface'
      }`}
    >
      <div className="container-site py-16 sm:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-display-md font-bold text-ink text-balance">
              {title}
            </h2>

            <p className="mt-3 max-w-2xl leading-relaxed text-ink-soft">
              {lead}
            </p>
          </div>

          <span className="font-mono text-sm text-steel">
            {fabrics.length}
          </span>
        </div>

        <ExpandableFabricRow
          fabrics={fabrics}
          locale={locale}
        />
      </div>
    </section>
  );
}

export default function ApplicationProductSections({
  applicationId,
  locale,
}: {
  applicationId: ApplicationId;
  locale: Locale;
}) {
  const copy = getApplicationProductCopy(applicationId);

  const primary = sortFabrics(
    getPrimaryFabricsForApplication(applicationId),
    'primary',
  ).map((fabric) => toCardData(fabric, locale));

  const secondary = sortFabrics(
    getSecondaryFabricsForApplication(applicationId),
    'secondary',
  ).map((fabric) => toCardData(fabric, locale));

  return (
    <>
      <ProductSection
        title={copy.primaryHeading[locale]}
        lead={copy.primaryLead[locale]}
        fabrics={primary}
        locale={locale}
        surface="paper"
      />

      <ProductSection
        title={copy.secondaryHeading[locale]}
        lead={copy.secondaryLead[locale]}
        fabrics={secondary}
        locale={locale}
        surface="surface"
      />
    </>
  );
}
