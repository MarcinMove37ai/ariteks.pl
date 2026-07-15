// src/app/api/rfq/route.ts
// Serwerowy endpoint formularza RFQ.
// Waliduje dane i przekazuje zgłoszenie do Web3Forms bez ujawniania klucza.

import { NextRequest, NextResponse } from 'next/server';
import { RFQ_INDUSTRIES } from '@/content/rfq';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const WEB3FORMS_URL = 'https://api.web3forms.com/submit';
const REQUEST_TIMEOUT_MS = 10_000;
const MAX_BODY_BYTES = 20_000;

const ALLOWED_ORIGINS = new Set([
  'https://ariteks.pl',
  'https://www.ariteks.pl',
]);

type RfqBody = {
  name?: unknown;
  phone?: unknown;
  email?: unknown;
  industryId?: unknown;
  details?: unknown;
  companyWebsite?: unknown;
  formStartedAt?: unknown;
  locale?: unknown;
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

function isValidEmail(value: string): boolean {
  return (
    value.length <= 254 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  );
}

function isValidPhone(value: string): boolean {
  return (
    value.length >= 5 &&
    value.length <= 40 &&
    /^[0-9+().\s-]+$/.test(value)
  );
}

export async function POST(request: NextRequest) {
  if (!isAllowedOrigin(request)) {
    return json({ ok: false, error: 'forbidden' }, 403);
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

  let body: RfqBody;

  try {
    body = (await request.json()) as RfqBody;
  } catch {
    return json({ ok: false, error: 'invalid_json' }, 400);
  }

  const name = cleanString(body.name, 120);
  const phone = cleanString(body.phone, 40);
  const email = cleanString(body.email, 254).toLowerCase();
  const industryId = cleanString(body.industryId, 80);
  const details = cleanString(body.details, 5000);
  const companyWebsite = cleanString(
    body.companyWebsite,
    200,
  );
  const formStartedAt =
    typeof body.formStartedAt === 'number'
      ? body.formStartedAt
      : Number(body.formStartedAt);
  const locale = body.locale === 'en' ? 'en' : 'pl';

  const formAgeMs = Date.now() - formStartedAt;
  const suspiciousTiming =
    !Number.isFinite(formStartedAt) ||
    formAgeMs < 500 ||
    formAgeMs > 2 * 60 * 60 * 1000;

  if (companyWebsite || suspiciousTiming) {
    return json({ ok: true }, 200);
  }

  if (
    name.length < 2 ||
    !isValidPhone(phone) ||
    !isValidEmail(email)
  ) {
    return json({ ok: false, error: 'invalid_fields' }, 400);
  }

  const industry = RFQ_INDUSTRIES.find(
    (item) => item.id === industryId,
  );

  if (industryId && !industry) {
    return json({ ok: false, error: 'invalid_industry' }, 400);
  }

  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;

  if (!accessKey) {
    console.error('RFQ: missing WEB3FORMS_ACCESS_KEY');
    return json({ ok: false, error: 'service_unavailable' }, 503);
  }

  const industryLabel = industry?.label.en ?? '—';
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    REQUEST_TIMEOUT_MS,
  );

  try {
    const response = await fetch(WEB3FORMS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        access_key: accessKey,
        subject: `Ariteks — zapytanie ofertowe (${industryLabel})`,
        from_name: 'Ariteks — formularz',
        name,
        phone,
        email,
        replyto: email,
        industry: industryLabel,
        details: details || '—',
        locale,
      }),
      signal: controller.signal,
      cache: 'no-store',
    });

    let providerResult: { success?: boolean } | null = null;

    try {
      providerResult =
        (await response.json()) as { success?: boolean };
    } catch {
      providerResult = null;
    }

    if (
      !response.ok ||
      providerResult?.success === false
    ) {
      console.error(
        `RFQ: Web3Forms rejected request (${response.status})`,
      );
      return json({ ok: false, error: 'provider_error' }, 502);
    }

    return json({ ok: true }, 200);
  } catch (error) {
    const reason =
      error instanceof Error ? error.name : 'unknown';

    console.error(`RFQ: Web3Forms request failed (${reason})`);
    return json({ ok: false, error: 'provider_unavailable' }, 502);
  } finally {
    clearTimeout(timeout);
  }
}
