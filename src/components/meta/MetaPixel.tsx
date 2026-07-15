// src/components/meta/MetaPixel.tsx
// Pixel Meta ładuje się dopiero po zgodzie marketingowej.
// Na tym etapie przygotowuje PageView; kolejne zdarzenia dołożymy osobno.

'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  CONSENT_CHANGED_EVENT,
  readCookieConsent,
  type CookieConsentPreferences,
} from '@/lib/privacy/consent';
import {
  clearMetaSession,
  trackActiveSession,
} from '@/lib/meta/client';

type Fbq = {
  (...args: unknown[]): void;
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[][];
  loaded: boolean;
  version: string;
};

declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
    __ariteksMetaPixelInitialized?: boolean;
  }
}

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? '';

function removeMetaCookie(name: string) {
  const secure =
    window.location.protocol === 'https:' ? '; Secure' : '';

  document.cookie =
    `${name}=; Path=/; Max-Age=0; SameSite=Lax${secure}`;

  document.cookie =
    `${name}=; Path=/; Domain=.ariteks.pl; Max-Age=0; SameSite=Lax${secure}`;
}

function ensurePixel(pixelId: string) {
  if (!window.fbq) {
    const fbq = function (...args: unknown[]) {
      if (fbq.callMethod) {
        fbq.callMethod(...args);
      } else {
        fbq.queue.push(args);
      }
    } as Fbq;

    fbq.queue = [];
    fbq.loaded = true;
    fbq.version = '2.0';

    window.fbq = fbq;
    window._fbq = fbq;

    const script = document.createElement('script');
    script.async = true;
    script.src =
      'https://connect.facebook.net/en_US/fbevents.js';
    script.dataset.ariteksMetaPixel = 'true';
    document.head.appendChild(script);
  }

  window.fbq('consent', 'grant');

  if (!window.__ariteksMetaPixelInitialized) {
    window.fbq('init', pixelId);
    window.__ariteksMetaPixelInitialized = true;
  }
}

export default function MetaPixel() {
  const pathname = usePathname();
  const [marketing, setMarketing] = useState(false);
  const lastPageRef = useRef('');

  useEffect(() => {
    setMarketing(
      readCookieConsent()?.marketing === true,
    );

    const onConsentChange = (event: Event) => {
      const preferences =
        event instanceof CustomEvent
          ? (event.detail as CookieConsentPreferences)
          : readCookieConsent();

      setMarketing(preferences?.marketing === true);
    };

    window.addEventListener(
      CONSENT_CHANGED_EVENT,
      onConsentChange,
    );

    return () =>
      window.removeEventListener(
        CONSENT_CHANGED_EVENT,
        onConsentChange,
      );
  }, []);

  useEffect(() => {
    if (!marketing) {
      window.fbq?.('consent', 'revoke');
      removeMetaCookie('_fbp');
      removeMetaCookie('_fbc');
      clearMetaSession();
      lastPageRef.current = '';
      return;
    }

    if (!PIXEL_ID) return;

    ensurePixel(PIXEL_ID);
  }, [marketing]);

  useEffect(() => {
    if (
      !marketing ||
      !PIXEL_ID ||
      !window.fbq
    ) {
      return;
    }

    const pageKey = `${pathname}${window.location.search}`;

    if (lastPageRef.current === pageKey) return;

    window.fbq('track', 'PageView');
    trackActiveSession();
    lastPageRef.current = pageKey;
  }, [marketing, pathname]);

  return null;
}
