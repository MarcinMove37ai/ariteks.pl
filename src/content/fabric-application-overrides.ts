// src/content/fabric-application-overrides.ts
// Ręczne korekty zatwierdzone po klasyfikacji AI.
// Ten plik zawiera wyłącznie różnice względem fabric-applications.json.

export const APPLICATION_IDS = [
  'military',
  'firefighting',
  'energy',
  'welding',
  'motorcycle',
  'hivis',
  'medical',
  'sport',
  'architecture-building',
  'transport',
  'workwear-industrial',
  'outdoor-functional',
  'upholstery-interiors',
  'print-signage',
  'professional-cleaning',
] as const;

export type ApplicationId = (typeof APPLICATION_IDS)[number];

export type FabricApplicationOverride = {
  primaryApplication?: ApplicationId;
  secondaryApplication?: ApplicationId | null;
};

export const FABRIC_APPLICATION_OVERRIDES = {
  'arof-mesh-2-2': {
    secondaryApplication: 'transport',
  },
  'argun-260': {
    primaryApplication: 'architecture-building',
    secondaryApplication: 'transport',
  },
  'ar-air-mesh-bb': {
    secondaryApplication: 'upholstery-interiors',
  },
  'ar-air-mesh-bond': {
    secondaryApplication: 'outdoor-functional',
  },
  arseat: {
    secondaryApplication: 'outdoor-functional',
  },
} satisfies Record<string, FabricApplicationOverride>;
