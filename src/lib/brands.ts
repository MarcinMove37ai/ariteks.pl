// src/lib/brands.ts
// Jedno miejsce sterujace widocznoscia marek licencyjnych w UI.
// false -> nazwy CORDURA(R) / INVISTA nie pojawiaja sie nigdzie na stronie,
//          teksty uzywaja neutralnego oznaczenia PA 6.6 HT.
// true  -> wersja oryginalna, z nazwa marki i nota znakow towarowych w stopce.
// Zmiana wartosci = commit + push (Railway przebuduje strone).

export const SHOW_CORDURA: boolean = false;

// Wybiera wariant tresci zaleznie od flagi: pickBrand(zMarka, bezMarki)
export function pickBrand<T>(branded: T, neutral: T): T {
  return SHOW_CORDURA ? branded : neutral;
}