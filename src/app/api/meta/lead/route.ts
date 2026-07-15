// src/app/api/meta/lead/route.ts
// Lead do Meta Conversions API.
// Uruchamiany wyłącznie po zgodzie marketingowej i po sukcesie RFQ.

import { createHash } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { CONSENT_COOKIE_NAME } from '@/lib/privacy/consent';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const REQUEST_TIMEOUT_MS = 6_000;
const MAX_BODY_BYTES = 12_000;

const ALLOWED_ORIGINS = new Set([
  'https://ariteks.pl',
  'https://www.ariteks.pl',
]);

type LeadBody = {
  eventId?: unknown;
  eventSourceUrl?: unknown;
  email?: unknown;
  phone?: unknown;
  industry?: unknown;
  locale?: unknown;
  fbp?: unknown;
  fbc?: unknown;
};

function json(body: Record<string, unknown>, status: number) {
  return NextResponse.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store',
    },
  });
}

function cleanString(value: unknown, maxLength: number): string {
  return typeof value === 'string'
    ? value.trim().slice(0, maxLength)
    : '';
}

function isAllowedOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin');

  if (!origin) return false;
  if (ALLOWED_ORIGINS.has(origin)) return true;

  if (process.env.NODE_ENV !== 'production') {
    try {
      const url = new URL(origin);
      return (
        url.protocol === 'http:' &&
        (url.hostname === 'localhost' ||
          url.hostname === '127.0.0.1')
      );
    } catch {
      return false;
    }
  }

  return false;
}

function isAllowedSourceUrl(value: string): boolean {
  try {
    const url = new URL(value);

    if (
      url.protocol === 'https:' &&
      (url.hostname === 'ariteks.pl' ||
        url.hostname === 'www.ariteks.pl')
    ) {
      return true;
    }

    return (
      process.env.NODE_ENV !== 'production' &&
      url.protocol === 'http:' &&
      (url.hostname === 'localhost' ||
        url.hostname === '127.0.0.1')
    );
  } catch {
    return false;
  }
}

function sha256(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

function normalizePhone(value: string): string {
  return value.replace(/\D/g, '');
}

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers
    .get('x-forwarded-for')
    ?.split(',')[0]
    ?.trim();

  return (
    forwarded ||
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-real-ip') ||
    ''
  );
}

export async function POST(request: NextRequest) {
  if (!isAllowedOrigin(request)) {
    return json({ ok: false, error: 'forbidden' }, 403);
  }

  if (
    request.cookies.get(CONSENT_COOKIE_NAME)?.value !== 'all'
  ) {
    return json({ ok: false, error: 'consent_required' }, 403);
  }

  const contentLength = Number(
    request.headers.get('content-length') ?? '0',
  );

  if (
    Number.isFinite(contentLength) &&
    contentLength > MAX_BODY_BYTES
  ) {
    return json({ ok: false, error: 'payload_too_large' }, 413);
  }

  let body: LeadBody;

  try {
    body = (await request.json()) as LeadBody;
  } catch {
    return json({ ok: false, error: 'invalid_json' }, 400);
  }

  const eventId = cleanString(body.eventId, 128);
  const eventSourceUrl = cleanString(body.eventSourceUrl, 1000);
  const email = normalizeEmail(cleanString(body.email, 254));
  const phone = normalizePhone(cleanString(body.phone, 40));
  const industry = cleanString(body.industry, 160);
  const locale = body.locale === 'en' ? 'en' : 'pl';
  const fbp = cleanString(body.fbp, 255);
  const fbc = cleanString(body.fbc, 255);

  if (
    !/^[A-Za-z0-9._:-]{8,128}$/.test(eventId) ||
    !isAllowedSourceUrl(eventSourceUrl) ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    phone.length < 7
  ) {
    return json({ ok: false, error: 'invalid_fields' }, 400);
  }

  const datasetId = process.env.META_DATASET_ID;
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN;
  const graphVersion =
    process.env.META_GRAPH_API_VERSION || 'v25.0';

  if (!datasetId || !accessToken) {
    console.error('Meta CAPI: missing server configuration');
    return json({ ok: false, error: 'service_unavailable' }, 503);
  }

  const userData: Record<string, unknown> = {
    em: [sha256(email)],
    ph: [sha256(phone)],
    client_ip_address: getClientIp(request),
    client_user_agent: request.headers.get('user-agent') || '',
  };

  if (fbp) userData.fbp = fbp;
  if (fbc) userData.fbc = fbc;

  const payload: Record<string, unknown> = {
    data: [
      {
        event_name: 'Lead',
        event_time: Math.floor(Date.now() / 1000),
        event_source_url: eventSourceUrl,
        event_id: eventId,
        action_source: 'website',
        user_data: userData,
        custom_data: {
          content_name: 'RFQ',
          content_category: industry,
          lead_type: 'rfq',
          locale,
        },
      },
    ],
  };

  const testEventCode = process.env.META_TEST_EVENT_CODE?.trim();
  if (testEventCode) payload.test_event_code = testEventCode;

  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    REQUEST_TIMEOUT_MS,
  );

  try {
    const endpoint =
      `https://graph.facebook.com/${encodeURIComponent(graphVersion)}/` +
      `${encodeURIComponent(datasetId)}/events?access_token=` +
      encodeURIComponent(accessToken);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
      cache: 'no-store',
    });

    const result = (await response.json().catch(() => null)) as
      | {
          events_received?: number;
          error?: {
            code?: number;
            error_subcode?: number;
          };
        }
      | null;

    if (!response.ok || result?.error) {
      console.error(
        'Meta CAPI: request rejected',
        JSON.stringify({
          status: response.status,
          code: result?.error?.code,
          subcode: result?.error?.error_subcode,
        }),
      );
      return json({ ok: false, error: 'meta_error' }, 502);
    }

    return json(
      {
        ok: true,
        eventsReceived: result?.events_received ?? 0,
      },
      200,
    );
  } catch (error) {
    const reason =
      error instanceof Error ? error.name : 'unknown';
    console.error(`Meta CAPI: request failed (${reason})`);
    return json({ ok: false, error: 'meta_unavailable' }, 502);
  } finally {
    clearTimeout(timeout);
  }
}
