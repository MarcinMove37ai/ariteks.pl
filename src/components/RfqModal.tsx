// src/components/RfqModal.tsx
// Globalny modal "Zapytanie ofertowe". Osadzony RAZ w layoucie.
// Otwierany zdarzeniem: window.dispatchEvent(new Event('open-rfq'))
// — dowolny przycisk CTA moze go wywolac helperem openRfq() (patrz eksport).
//
// Wysylka: formularz trafia najpierw do /api/rfq. Backend waliduje dane
// i dopiero potem przekazuje je do Web3Forms z uzyciem prywatnego klucza
// WEB3FORMS_ACCESS_KEY. Klucz nie jest dostepny w przegladarce.

'use client';

import { useEffect, useRef, useState } from 'react';
import { useLocale } from 'next-intl';
import { X } from 'lucide-react';
import type { Locale } from '@/i18n/routing';
import type { ApplicationId } from '@/content/fabric-application-overrides';
import { RFQ, RFQ_INDUSTRIES } from '@/content/rfq';

type OpenRfqDetail = {
  applicationId?: ApplicationId;
};

// Helper do wywolania z dowolnego miejsca.
// Opcjonalnie przekazuje aplikacje, ktora ma byc zaznaczona w formularzu.
export function openRfq(applicationId?: ApplicationId) {
  window.dispatchEvent(
    new CustomEvent<OpenRfqDetail>('open-rfq', {
      detail: {
        applicationId,
      },
    }),
  );
}

type Status = 'idle' | 'sending' | 'success' | 'error';
type FieldErrors = { name?: boolean; phone?: boolean; email?: boolean };

type IndustryId =
  (typeof RFQ_INDUSTRIES)[number]['id'];

export default function RfqModal() {
  const locale = useLocale() as Locale;
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [industry, setIndustry] =
    useState<IndustryId | ''>('');
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const formOpenedAtRef = useRef(Date.now());

  // Otwarcie przez globalne zdarzenie.
  // Event moze zawierac aplikacje strony, z ktorej otwarto formularz.
  useEffect(() => {
    const onOpen = (event: Event) => {
      const detail =
        event instanceof CustomEvent
          ? (event.detail as OpenRfqDetail | undefined)
          : undefined;

      const requestedApplication =
        detail?.applicationId;

      const validApplication =
        requestedApplication &&
        RFQ_INDUSTRIES.some(
          (item) => item.id === requestedApplication,
        )
          ? requestedApplication
          : '';

      formOpenedAtRef.current = Date.now();
      setIndustry(validApplication);
      setStatus('idle');
      setErrors({});
      setOpen(true);
    };

    window.addEventListener('open-rfq', onOpen);

    return () =>
      window.removeEventListener('open-rfq', onOpen);
  }, []);

  // Blokada scrolla tla + Escape + fokus na pierwsze pole
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    const tid = window.setTimeout(() => firstFieldRef.current?.focus(), 50);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
      window.clearTimeout(tid);
    };
  }, [open]);

  if (!open) return null;

  const validate = (form: HTMLFormElement): FieldErrors => {
    const data = new FormData(form);
    const name = String(data.get('name') ?? '').trim();
    const phone = String(data.get('phone') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const e: FieldErrors = {};
    if (!name) e.name = true;
    if (!phone) e.phone = true;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = true;
    return e;
  };

  const onSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const form = ev.currentTarget;
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setStatus('sending');

    try {
      const data = new FormData(form);

      const payload = {
        name: String(data.get('name') ?? '').trim(),
        phone: String(data.get('phone') ?? '').trim(),
        email: String(data.get('email') ?? '').trim(),
        industryId: String(data.get('industry') ?? '').trim(),
        details: String(data.get('details') ?? '').trim(),
        companyWebsite: String(
          data.get('company_website_confirm') ?? '',
        ).trim(),
        formStartedAt: formOpenedAtRef.current,
        locale,
      };

      const res = await fetch('/api/rfq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
        cache: 'no-store',
      });

      if (res.ok) {
        setStatus('success');
        form.reset();
        setIndustry('');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const err = (b?: boolean) =>
    b ? 'border-red-500 focus:border-red-500' : 'border-carbon-200 focus:border-carbon-900';

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-carbon-950/70 p-4 backdrop-blur-sm sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label={RFQ.header[locale]}
      onMouseDown={(e) => {
        // klik w tlo (nie w panel) zamyka
        if (e.target === e.currentTarget) setOpen(false);
      }}
    >
      <div
        ref={dialogRef}
        className="relative my-8 w-full max-w-lg rounded-xl bg-paper p-6 shadow-xl sm:p-8"
      >
        {/* Zamkniecie */}
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label={RFQ.close[locale]}
          className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded text-steel transition-colors hover:text-red-600"
        >
          <X size={22} strokeWidth={1.75} />
        </button>

        {status === 'success' ? (
          <div className="py-8 text-center">
            <div className="mx-auto mb-5 h-1 w-14 bg-red-500" aria-hidden />
            <p className="font-display text-2xl text-carbon-950">
              {RFQ.header[locale]}
            </p>
            <p className="mt-4 text-ink">{RFQ.success[locale]}</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-8 inline-flex items-center rounded bg-carbon-900 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-600"
            >
              {RFQ.close[locale]}
            </button>
          </div>
        ) : (
          <>
            <h2 className="font-display text-2xl text-carbon-950 sm:text-3xl">
              {RFQ.header[locale]}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink">
              {RFQ.subtitle[locale]}
            </p>

            <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
              {/* Honeypot: ukryty natywnie, aby autofill go pomijał. */}
              <input
                name="company_website_confirm"
                type="text"
                tabIndex={-1}
                autoComplete="new-password"
                aria-hidden="true"
                hidden
              />

              {/* Imie */}
              <div>
                <label className="mb-1 block text-sm font-medium text-carbon-900">
                  {RFQ.fields.name.label[locale]}{' '}
                  <span className="text-red-600">*</span>
                </label>
                <input
                  ref={firstFieldRef}
                  name="name"
                  type="text"
                  placeholder={RFQ.fields.name.placeholder[locale]}
                  className={`w-full rounded border bg-white px-3 py-2.5 text-sm text-ink outline-none transition-colors ${err(errors.name)}`}
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-600">
                    {RFQ.errors.required[locale]}
                  </p>
                )}
              </div>

              {/* Telefon + e-mail w rzedzie na sm+ */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-carbon-900">
                    {RFQ.fields.phone.label[locale]}{' '}
                    <span className="text-red-600">*</span>
                  </label>
                  <input
                    name="phone"
                    type="tel"
                    placeholder={RFQ.fields.phone.placeholder[locale]}
                    className={`w-full rounded border bg-white px-3 py-2.5 text-sm text-ink outline-none transition-colors ${err(errors.phone)}`}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-xs text-red-600">
                      {RFQ.errors.required[locale]}
                    </p>
                  )}
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-carbon-900">
                    {RFQ.fields.email.label[locale]}{' '}
                    <span className="text-red-600">*</span>
                  </label>
                  <input
                    name="email"
                    type="email"
                    placeholder={RFQ.fields.email.placeholder[locale]}
                    className={`w-full rounded border bg-white px-3 py-2.5 text-sm text-ink outline-none transition-colors ${err(errors.email)}`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-600">
                      {RFQ.errors.email[locale]}
                    </p>
                  )}
                </div>
              </div>

              {/* Branza */}
              <div>
                <label className="mb-1 block text-sm font-medium text-carbon-900">
                  {RFQ.fields.industry.label[locale]}
                </label>
                <select
                  name="industry"
                  value={industry}
                  onChange={(event) =>
                    setIndustry(
                      event.target.value as IndustryId | '',
                    )
                  }
                  className="w-full rounded border border-carbon-200 bg-white px-3 py-2.5 text-sm text-ink outline-none transition-colors focus:border-carbon-900"
                >
                  <option value="" disabled>
                    {RFQ.fields.industry.placeholder[locale]}
                  </option>
                  {RFQ_INDUSTRIES.map((ind) => (
                    <option key={ind.id} value={ind.id}>
                      {ind.label[locale]}
                    </option>
                  ))}
                </select>
              </div>

              {/* Szczegoly */}
              <div>
                <label className="mb-1 block text-sm font-medium text-carbon-900">
                  {RFQ.fields.details.label[locale]}{' '}
                  <span className="font-normal text-steel">
                    ({RFQ.fields.details.optional[locale]})
                  </span>
                </label>
                <textarea
                  name="details"
                  rows={4}
                  placeholder={RFQ.fields.details.placeholder[locale]}
                  className="w-full resize-none rounded border border-carbon-200 bg-white px-3 py-2.5 text-sm text-ink outline-none transition-colors focus:border-carbon-900"
                />
              </div>

              {status === 'error' && (
                <p className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {RFQ.errors.send[locale]}
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="inline-flex w-full items-center justify-center rounded bg-carbon-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === 'sending'
                  ? RFQ.sending[locale]
                  : RFQ.submit[locale]}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}