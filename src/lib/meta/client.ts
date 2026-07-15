// src/lib/meta/client.ts
// Klient Meta: ActiveSession oraz Lead z deduplikacją Pixel + CAPI.

import { hasMarketingConsent } from '@/lib/privacy/consent';

const META_SESSION_KEY = 'ariteks_meta_session_v1';
const META_SESSION_TIMEOUT_MS = 30 * 60 * 1000;

type MetaLeadInput = {
  email: string;
  phone: string;
  industry: string;
  locale: 'pl' | 'en';
};

function createEventId(prefix: string): string {
  const random =
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;

  return `${prefix}-${random}`;
}

function readCookie(name: string): string {
  if (typeof document === 'undefined') return '';

  const prefix = `${name}=`;
  const item = document.cookie
    .split('; ')
    .find((value) => value.startsWith(prefix));

  return item ? decodeURIComponent(item.slice(prefix.length)) : '';
}

export function clearMetaSession() {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.removeItem(META_SESSION_KEY);
  } catch {
    // Brak dostępu do localStorage nie może blokować strony.
  }
}

export function trackActiveSession() {
  if (
    typeof window === 'undefined' ||
    !hasMarketingConsent() ||
    !window.fbq
  ) {
    return;
  }

  const now = Date.now();
  let previous = 0;

  try {
    previous = Number(
      window.localStorage.getItem(META_SESSION_KEY) ?? '0',
    );
  } catch {
    previous = 0;
  }

  const isNewSession =
    !Number.isFinite(previous) ||
    previous <= 0 ||
    now - previous > META_SESSION_TIMEOUT_MS;

  try {
    window.localStorage.setItem(META_SESSION_KEY, String(now));
  } catch {
    // Sam pomiar sesji jest opcjonalny.
  }

  if (!isNewSession) return;

  window.fbq('trackCustom', 'ActiveSession', {
    session_timeout_minutes: 30,
  });
}

export async function sendMetaLead({
  email,
  phone,
  industry,
  locale,
}: MetaLeadInput) {
  if (
    typeof window === 'undefined' ||
    !hasMarketingConsent()
  ) {
    return;
  }

  const eventId = createEventId('lead');
  const eventSourceUrl = window.location.href;
  const fbp = readCookie('_fbp');
  const fbc = readCookie('_fbc');

  window.fbq?.(
    'track',
    'Lead',
    {
      content_name: 'RFQ',
      content_category: industry,
      lead_type: 'rfq',
      locale,
    },
    {
      eventID: eventId,
    },
  );

  try {
    await fetch('/api/meta/lead', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        eventId,
        eventSourceUrl,
        email,
        phone,
        industry,
        locale,
        fbp,
        fbc,
      }),
      cache: 'no-store',
      keepalive: true,
    });
  } catch {
    // Awaria Meta nie może zmienić statusu poprawnie wysłanego RFQ.
  }
}