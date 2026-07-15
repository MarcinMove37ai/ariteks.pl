// src/lib/privacy/consent.ts
// Wersjonowane ustawienia cookies. Jedno źródło prawdy dla Pixela i CAPI.

export const CONSENT_VERSION = 1 as const;
export const CONSENT_STORAGE_KEY = 'ariteks_cookie_consent_v1';
export const CONSENT_COOKIE_NAME = 'ariteks_consent_v1';
export const CONSENT_CHANGED_EVENT = 'ariteks:cookie-consent-changed';
export const OPEN_CONSENT_SETTINGS_EVENT =
  'ariteks:open-cookie-settings';

const CONSENT_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

export type CookieConsentPreferences = {
  version: typeof CONSENT_VERSION;
  necessary: true;
  marketing: boolean;
  updatedAt: string;
};

function isValidPreferences(
  value: unknown,
): value is CookieConsentPreferences {
  if (!value || typeof value !== 'object') return false;

  const candidate = value as Partial<CookieConsentPreferences>;

  return (
    candidate.version === CONSENT_VERSION &&
    candidate.necessary === true &&
    typeof candidate.marketing === 'boolean' &&
    typeof candidate.updatedAt === 'string'
  );
}

function readConsentCookie(): CookieConsentPreferences | null {
  if (typeof document === 'undefined') return null;

  const raw = document.cookie
    .split('; ')
    .find((item) =>
      item.startsWith(`${CONSENT_COOKIE_NAME}=`)
    )
    ?.split('=')[1];

  if (raw !== 'all' && raw !== 'necessary') return null;

  return {
    version: CONSENT_VERSION,
    necessary: true,
    marketing: raw === 'all',
    updatedAt: new Date(0).toISOString(),
  };
}

export function readCookieConsent():
  | CookieConsentPreferences
  | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(
      CONSENT_STORAGE_KEY,
    );

    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      if (isValidPreferences(parsed)) return parsed;
    }
  } catch {
    // Uszkodzony albo niedostępny localStorage: używamy cookie.
  }

  return readConsentCookie();
}

export function saveCookieConsent(marketing: boolean) {
  if (typeof window === 'undefined') return;

  const preferences: CookieConsentPreferences = {
    version: CONSENT_VERSION,
    necessary: true,
    marketing,
    updatedAt: new Date().toISOString(),
  };

  try {
    window.localStorage.setItem(
      CONSENT_STORAGE_KEY,
      JSON.stringify(preferences),
    );
  } catch {
    // Cookie pozostaje mechanizmem zapasowym.
  }

  const secure =
    window.location.protocol === 'https:' ? '; Secure' : '';

  document.cookie = [
    `${CONSENT_COOKIE_NAME}=${
      marketing ? 'all' : 'necessary'
    }`,
    'Path=/',
    `Max-Age=${CONSENT_MAX_AGE_SECONDS}`,
    'SameSite=Lax',
  ].join('; ') + secure;

  window.dispatchEvent(
    new CustomEvent<CookieConsentPreferences>(
      CONSENT_CHANGED_EVENT,
      { detail: preferences },
    ),
  );

  return preferences;
}

export function hasMarketingConsent() {
  return readCookieConsent()?.marketing === true;
}

export function openCookieSettings() {
  if (typeof window === 'undefined') return;

  window.dispatchEvent(
    new Event(OPEN_CONSENT_SETTINGS_EVENT),
  );
}
