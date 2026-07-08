import type { Metadata } from 'next';
import { routing, type Locale } from '@/i18n/routing';
import {
  CERT_HERO,
  CERT_STATS,
  CERT_UI,
  CERT_BLOCKS,
  NORM_GROUPS,
} from '@/content/certificates';
import CertArchive from '@/components/CertArchive';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const title = CERT_HERO.title[locale];
  const description =
    locale === 'pl'
      ? 'Certyfikaty ISO, OEKO-TEX, RCS, OCS oraz normy badawcze tkanin Ariteks — dokumenty wydane przez niezależne jednostki.'
      : 'ISO, OEKO-TEX, RCS and OCS certificates plus fabric testing standards for Ariteks — documents issued by independent bodies.';
  return { title, description };
}

export default async function CertificatesPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  return (
    <>
      {/* ==================== HERO ==================== */}
      <section className="mesh-light border-b border-carbon-100">
        <div className="container-site py-16 sm:py-24">
          <p className="eyebrow mb-4">Ariteks</p>
          <h1 className="max-w-4xl font-display text-4xl leading-tight text-carbon-950 sm:text-5xl lg:text-6xl">
            {CERT_HERO.title[locale]}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-ink">
            {CERT_HERO.lead[locale]}
          </p>

          {/* Pas liczb */}
          <dl className="mt-12 grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-4">
            {CERT_STATS.map((s, i) => (
              <div key={i} className="border-l-2 border-red pl-4">
                <dt className="font-display text-3xl text-carbon-950 sm:text-4xl">
                  {s.value}
                </dt>
                <dd className="mt-1 font-mono text-[11px] uppercase tracking-wider text-steel">
                  {s.label[locale]}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ==================== BLOKI CERTYFIKATOW ==================== */}
      {CERT_BLOCKS.map((block) => (
        <section key={block.id} className="border-b border-carbon-100 bg-paper">
          <div className="container-site py-16 sm:py-20">
            <div className="max-w-3xl">
              <h2 className="font-display text-2xl text-carbon-950 sm:text-3xl">
                {block.heading[locale]}
              </h2>
              <p className="mt-3 text-ink">{block.sub[locale]}</p>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {block.cards.map((card) => {
                const label =
                  card.latest.type === 'document'
                    ? CERT_UI.openDoc[locale]
                    : CERT_UI.viewImg[locale];
                return (
                  <div
                    key={card.name}
                    className="flex flex-col rounded-lg bg-white p-6 shadow-card"
                  >
                    <div className="flex items-start gap-5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={card.icon}
                        alt={card.name}
                        className="h-24 w-24 flex-shrink-0 object-contain"
                      />
                      <div className="min-w-0 pt-1">
                        <h3 className="font-display text-lg leading-tight text-carbon-950">
                          {card.name}
                        </h3>
                        <p className="mt-1 text-sm text-steel">
                          {card.sub[locale]}
                        </p>
                      </div>
                    </div>

                    {!card.logoOnly && (
                      <div className="mt-5 flex items-center gap-3">
                        <a
                          href={card.latest.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded bg-carbon-950 px-4 py-2 text-sm font-medium text-paper transition-colors hover:bg-red"
                        >
                          {label}
                          {card.latest.year && (
                            <span className="font-mono text-xs opacity-70">
                              {card.latest.year}
                            </span>
                          )}
                        </a>
                      </div>
                    )}

                    <CertArchive
                      archive={card.archive}
                      toggleLabel={CERT_UI.archiveToggle[locale]}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      ))}

      {/* ==================== NORMY ==================== */}
      <section className="mesh-light">
        <div className="container-site py-16 sm:py-20">
          <div className="max-w-3xl">
            <h2 className="font-display text-2xl text-carbon-950 sm:text-3xl">
              {CERT_UI.normsHeading[locale]}
            </h2>
            <p className="mt-3 text-ink">{CERT_UI.normsLead[locale]}</p>
          </div>

          <div className="mt-10 space-y-12">
            {NORM_GROUPS.map((group) => (
              <div key={group.id}>
                <h3 className="mb-4 flex items-baseline gap-3 font-display text-xl text-carbon-950">
                  {group.category[locale]}
                  <span className="font-mono text-sm text-steel">
                    {group.items.length}
                  </span>
                </h3>
                <div className="overflow-hidden rounded-lg bg-white shadow-card">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-carbon-100 bg-paper">
                        <th className="px-5 py-3 font-mono text-[11px] uppercase tracking-wider text-steel">
                          {CERT_UI.colTest[locale]}
                        </th>
                        <th className="px-5 py-3 text-right font-mono text-[11px] uppercase tracking-wider text-steel">
                          {CERT_UI.colStandard[locale]}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.items.map((item) => (
                        <tr
                          key={item.anchor}
                          id={item.anchor}
                          className="border-b border-carbon-100 last:border-0 scroll-mt-24 target:bg-paper"
                        >
                          <td className="px-5 py-3 text-ink">
                            {item.test[locale]}
                          </td>
                          <td className="whitespace-nowrap px-5 py-3 text-right font-mono text-xs text-carbon-950">
                            {item.standard}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}