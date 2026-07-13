import type { Locale } from '@/i18n/routing';

type ApplicationSlugs = Record<Locale, string>;

export const APPLICATION_SLUGS: ApplicationSlugs[] = [
  {
    pl: 'wojsko-i-sluzby',
    en: 'military-and-services',
  },
  {
    pl: 'straz-pozarna',
    en: 'firefighting',
  },
  {
    pl: 'energetyka',
    en: 'energy',
  },
  {
    pl: 'hutnictwo-i-spawalnictwo',
    en: 'metallurgy-and-welding',
  },
  {
    pl: 'odziez-motocyklowa',
    en: 'motorcycle-apparel',
  },
  {
    pl: 'odziez-ostrzegawcza',
    en: 'high-visibility',
  },
  {
    pl: 'medycyna',
    en: 'medical',
  },
  {
    pl: 'sport',
    en: 'sport',
  },
  {
    pl: 'tkaniny-architektoniczne-i-budowlane',
    en: 'architectural-and-building-fabrics',
  },
  {
    pl: 'tkaniny-dla-transportu',
    en: 'transport-fabrics',
  },
  {
    pl: 'odziez-robocza-i-przemyslowa',
    en: 'workwear-and-industrial-apparel',
  },
  {
    pl: 'outdoor-i-odziez-funkcjonalna',
    en: 'outdoor-and-functional-apparel',
  },
  {
    pl: 'tapicerka-i-wyposazenie-wnetrz',
    en: 'upholstery-and-interior-furnishings',
  },
  {
    pl: 'druk-reklama-i-oznakowanie',
    en: 'printing-advertising-and-signage',
  },
  {
    pl: 'czyszczenie-profesjonalne',
    en: 'professional-cleaning',
  },
];

export function getLocalizedApplicationPath(
  pathname: string,
  targetLocale: Locale,
): string {
  const match = pathname.match(
    /^\/applications\/([^/]+)\/?$/,
  );

  if (!match) return pathname;

  const currentSlug = decodeURIComponent(match[1]);

  const application = APPLICATION_SLUGS.find(
    (slugs) =>
      slugs.pl === currentSlug ||
      slugs.en === currentSlug,
  );

  if (!application) return pathname;

  return `/applications/${application[targetLocale]}`;
}