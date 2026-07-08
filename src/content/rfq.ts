// src/content/rfq.ts
// Tresc modalu "Zapytanie ofertowe" — dwujezyczna (wzorzec applications.ts).
// Zatwierdzone teksty PL/EN. Lista branz = 9 zastosowan + "Inne".

import type { Locale } from '@/i18n/routing';

export const RFQ = {
  header: { pl: 'Zapytanie ofertowe', en: 'Request a quote' },
  subtitle: {
    pl: 'Odpowiadamy ofertą, kartą techniczną i wynikami badań. Im więcej szczegółów podasz, tym trafniej dobierzemy tkaninę.',
    en: 'We respond with an offer, a technical data sheet and test results. The more detail you provide, the better we can match the fabric.',
  },
  fields: {
    name: {
      label: { pl: 'Imię i nazwisko', en: 'Full name' },
      placeholder: { pl: 'Jan Kowalski', en: 'John Smith' },
    },
    phone: {
      label: { pl: 'Telefon', en: 'Phone' },
      placeholder: { pl: '+48 600 000 000', en: '+48 600 000 000' },
    },
    email: {
      label: { pl: 'E-mail', en: 'Email' },
      placeholder: { pl: 'jan.kowalski@firma.pl', en: 'john.smith@company.com' },
    },
    industry: {
      label: { pl: 'Branża', en: 'Industry' },
      placeholder: { pl: 'Wybierz branżę…', en: 'Select an industry…' },
    },
    details: {
      label: { pl: 'Szczegóły zapytania', en: 'Enquiry details' },
      optional: { pl: 'opcjonalnie', en: 'optional' },
      placeholder: {
        pl: 'Gramatura, skład, ilość, wymagane normy — im więcej podasz, tym trafniej dobierzemy tkaninę.',
        en: 'Weight, composition, quantity, required standards — the more you share, the better we match the fabric.',
      },
    },
  },
  submit: { pl: 'Wyślij zapytanie', en: 'Send enquiry' },
  sending: { pl: 'Wysyłanie…', en: 'Sending…' },
  success: {
    pl: 'Dziękujemy — zapytanie do nas dotarło. Odezwiemy się najszybciej, jak to możliwe.',
    en: 'Thank you — your enquiry has reached us. We will get back to you as soon as possible.',
  },
  errors: {
    required: { pl: 'To pole jest wymagane', en: 'This field is required' },
    email: { pl: 'Sprawdź poprawność adresu e-mail', en: 'Please check your email address' },
    send: {
      pl: 'Coś poszło nie tak. Spróbuj ponownie lub napisz na office@ariteks.pl',
      en: 'Something went wrong. Please try again or email office@ariteks.pl',
    },
  },
  close: { pl: 'Zamknij', en: 'Close' },
} as const;

// Branze do listy rozwijanej — id spojne z applications.ts + wariant "other".
// Etykieta wysylana w mailu jako czytelny tekst (EN, neutralny dla odbiorcy).
export const RFQ_INDUSTRIES: ReadonlyArray<{
  id: string;
  label: Record<Locale, string>;
}> = [
  { id: 'firefighting', label: { pl: 'Straż pożarna', en: 'Firefighting' } },
  { id: 'military', label: { pl: 'Wojsko i służby', en: 'Military & services' } },
  { id: 'energy', label: { pl: 'Energetyka', en: 'Energy' } },
  { id: 'welding', label: { pl: 'Hutnictwo i spawalnictwo', en: 'Metallurgy & welding' } },
  { id: 'motorcycle', label: { pl: 'Odzież motocyklowa', en: 'Motorcycle apparel' } },
  { id: 'hivis', label: { pl: 'Odzież ostrzegawcza', en: 'High-visibility apparel' } },
  { id: 'medical', label: { pl: 'Medycyna', en: 'Medical' } },
  { id: 'sport', label: { pl: 'Sport', en: 'Sport' } },
  { id: 'ceilings', label: { pl: 'Sufity napinane', en: 'Stretch ceilings' } },
  { id: 'other', label: { pl: 'Inne / nie wiem jeszcze', en: 'Other / not sure yet' } },
];