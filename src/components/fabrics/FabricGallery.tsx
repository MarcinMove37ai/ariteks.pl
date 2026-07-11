'use client';

// src/components/fabrics/FabricGallery.tsx
// Galeria zastosowan na karcie produktu: siatka miniatur + LIGHTBOX.
// Modal: obraz skalowany do 90% wysokosci ekranu, strzalki <- ->,
// Esc / klik w tlo zamyka, blokada scrolla body na czas otwarcia.

import { useCallback, useEffect, useState } from 'react';

export type GalleryImage = { src: string; alt: string };

export default function FabricGallery({ images }: { images: GalleryImage[] }) {
  const [open, setOpen] = useState<number | null>(null);

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback(
    (dir: 1 | -1) =>
      setOpen((cur) =>
        cur === null ? cur : (cur + dir + images.length) % images.length
      ),
    [images.length]
  );

  // klawiatura + blokada scrolla, tylko gdy modal otwarty
  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, close, step]);

  const current = open === null ? null : images[open];

  return (
    <>
      {/* siatka miniatur */}
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((img, i) => (
          <figure
            key={i}
            className="overflow-hidden rounded-lg border border-steel-line bg-white shadow-card"
          >
            <button
              type="button"
              onClick={() => setOpen(i)}
              className="group block w-full cursor-zoom-in"
              aria-label={img.alt}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                className="h-48 w-full object-contain p-2 transition-transform duration-300 group-hover:scale-[1.03]"
              />
            </button>
            {img.alt && (
              <figcaption className="border-t border-carbon-100 px-3 py-2 text-xs text-steel">
                {img.alt}
              </figcaption>
            )}
          </figure>
        ))}
      </div>

      {/* lightbox */}
      {current && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-carbon-950/90 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={current.alt}
          onClick={close}
        >
          {/* zamknij */}
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full text-2xl text-carbon-300 transition-colors hover:bg-white/10 hover:text-white"
          >
            ×
          </button>

          {/* poprzedni / nastepny */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  step(-1);
                }}
                aria-label="Previous"
                className="absolute left-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full text-3xl text-carbon-300 transition-colors hover:bg-white/10 hover:text-white sm:left-5"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  step(1);
                }}
                aria-label="Next"
                className="absolute right-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full text-3xl text-carbon-300 transition-colors hover:bg-white/10 hover:text-white sm:right-5"
              >
                ›
              </button>
            </>
          )}

          {/* obraz: 90% wysokosci ekranu */}
          <div
            className="flex max-h-[90vh] max-w-[92vw] flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={current.src}
              alt={current.alt}
              className="max-h-[calc(90vh-3rem)] w-auto max-w-full rounded bg-white object-contain shadow-card"
            />
            <p className="mt-3 flex items-baseline gap-3 font-mono text-xs text-carbon-300">
              {open !== null && images.length > 1 && (
                <span>
                  {open + 1} / {images.length}
                </span>
              )}
              {current.alt && <span className="text-white">{current.alt}</span>}
            </p>
          </div>
        </div>
      )}
    </>
  );
}