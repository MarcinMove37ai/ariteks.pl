# Ariteks — serwis PL/EN

Strona tkanin technicznych Ariteks na rynek polski i europejski.

- **Stack:** Next.js 15 (App Router, SSG), TypeScript, next-intl, Tailwind
- **Domeny:** `ariteks.pl` (PL), `ariteks.eu` (EN)
- **Deploy:** GitHub → Railway (Node 20+)
- **Trasy:** `/{locale}/…`, locale = `pl` | `en`

```bash
npm ci
npm run dev      # localhost:3000
npm run build
npx tsc --noEmit # sama kontrola typow, bez budowania
```

> **Stan produkcji:** serwis jest tymczasowo wygaszony — wszystkie trasy zwracają 404.
> To osobny mechanizm, niezwiązany z flagą marek opisaną niżej.

---

## Flaga SHOW_CORDURA — ukrycie marki CORDURA® / INVISTA

### Po co

Marka CORDURA® (znak towarowy INVISTA) i jej właściciel są **ukryte w całym UI**.
Powód: używanie znaku towarowego wymaga aktywnej umowy licencyjnej (TMLA) oraz
certyfikacji brandowej każdej tkaniny. Dopóki to nie jest potwierdzone na piśmie,
strona nie powołuje się na markę. W miejscu nazwy występuje neutralne, zgodne
z prawdą oznaczenie surowca: **PA 6.6 HT** (poliamid 6.6 o wysokiej wytrzymałości).

### Gdzie siedzi przełącznik

**`src/lib/brands.ts`** — jedyne miejsce sterujące.

```ts
export const SHOW_CORDURA: boolean = false;   // false = marka ukryta
export function pickBrand<T>(branded: T, neutral: T): T { … }
```

Adnotacja `: boolean` jest konieczna — bez niej TypeScript zawęzi typ do literału
`false` i przestawienie flagi wywali build.

Zmiana wartości wymaga commita i pusha (Railway przebuduje stronę). Flagi nie da się
przestawić z panelu, bo to stała w kodzie — taka była świadoma decyzja.

---

## Co się zmienia przy `SHOW_CORDURA = false`

| Plik | Miejsce | Efekt |
|---|---|---|
| `src/components/layout/Footer.tsx` | lista `TRADEMARKS` | para „CORDURA® / INVISTA" wypada — 8 znaków zamiast 9 |
| `src/content/partners.ts` | wpis `id: 'cordura'` | kafel znika z sekcji „Licencje i partnerzy surowcowi" (7 marek zamiast 8) |
| `src/content/applications.ts` | branża `motorcycle` | opis skrócony, badge, lead i kafel USP w wersji z `PA 6.6 HT` |
| `src/lib/applicationHighlights.ts` | `TECHNOLOGY_PATTERNS` | wzorzec przestaje łapać „cordura" w danych tkanin — badge znika |
| `src/app/[locale]/fabrics/[family]/[slug]/page.tsx` | `partnerLogos` | sekcja „Partnerzy technologiczni" znika z 14 kart tkanin ArDura |
| `src/app/[locale]/fabrics/[family]/[slug]/page.tsx` | `certDocs` | z listy certyfikatów wypada pozycja z „Cordura" w etykiecie, tytule lub URL-u |

Dwie uwagi do tabeli:

**Badge nie zmienia nazwy — znika.** Neutralny wzorzec `/\bPA 6\.6 HT\b/i` nigdy się nie
dopasuje, bo w danych tkanin nie ma takiego ciągu (jest „Cordura" albo „PA 6.6" bez HT).
Wzorzec zostaje w kodzie wyłącznie po to, żeby przestawienie flagi przywróciło stan sprzed zmian.

**Filtr logotypów jest hurtowy.** Wycina całą grupę `technology_partners`, nie tylko Cordurę.
Praktycznie nie ma to znaczenia, bo w tej grupie leży wyłącznie logo Cordury powielone
po katalogach ArDura. Gdyby przy innych rodzinach pojawiły się inne logotypy — trzeba
będzie zawęzić filtr do nazwy pliku.

---

## Odwrócenie zmian

### Krok 1 — flaga (przywraca 6 z 7 plików)

W `src/lib/brands.ts`:

```ts
export const SHOW_CORDURA: boolean = true;
```

### Krok 2 — dwa słowniki (trzeba ręcznie)

**Te dwie linie nie słuchają flagi** — JSON nie ma miejsca na warunek. Zostały podmienione
na stałe i przy powrocie do marki trzeba je cofnąć ręcznie.

`messages/pl.json` → `home.partners.line`

```
// obecnie:
Tkaniny Ariteks powstają na włóknach i technologiach światowych marek — od włókien PA 6.6 HT i licencjonowanej produkcji Twaron® po partnerstwa surowcowe z liderami włókien ochronnych.

// wersja oryginalna:
Tkaniny Ariteks powstają na włóknach i technologiach światowych marek — od licencjonowanej produkcji CORDURA® i Twaron® po partnerstwa surowcowe z liderami włókien ochronnych.
```

`messages/en.json` → `home.partners.line`

```
// obecnie:
Ariteks fabrics are built on fibres and technologies from global brands — from PA 6.6 HT fibres and licensed Twaron® manufacturing to material partnerships with leaders in protective fibres.

// wersja oryginalna:
Ariteks fabrics are built on fibres and technologies from global brands — from licensed CORDURA® and Twaron® manufacturing to material partnerships with leaders in protective fibres.
```

### Krok 3 — brakujący logotyp

Kafel partnera wskazuje na `public/images/partners/cordura.png`, **którego nie ma na dysku**.
Przed przywróceniem marki trzeba pobrać oficjalny plik z portalu licencjodawcy (MyCORDURA) —
logotypów marek nie wolno generować ani odtwarzać samodzielnie.

### Weryfikacja po zmianie

```powershell
npx tsc --noEmit
```

Skan kontrolny — każde trafienie powinno siedzieć wewnątrz `pickBrand(…)` albo `SHOW_CORDURA`:

```powershell
$r = (Get-Location).Path + '\'
Get-ChildItem -Recurse -File -Include *.ts,*.tsx src |
  Select-String -Pattern 'cordura' |
  ForEach-Object { '{0}:{1}: {2}' -f $_.Path.Replace($r,''), $_.LineNumber, $_.Line.Trim() }
```

---

## Czego flaga NIE ukrywa

Świadoma decyzja: pliki statyczne w `public/` zostają nietknięte. Nie są linkowane
z żadnej strony, ale **są dostępne pod bezpośrednim adresem** i indeksowalne.

- `public/ariteks/fabrics/*/images/cordura*.jpg` — 24 pliki (logo + zdjęcia produktowe)
- `public/ariteks/fabrics/*/data/*.json` — zescrapowane rekordy z „Cordura" w polach `alt`, `title`, `label`, `context_text`
- `public/ariteks/fabrics/data/all-fabrics-manifest.json` — `"technology_partners": "Cordura"` przy 14 tkaninach (+ kopie `.pre-merge`, `.pre-herofix`)
- `public/data/applications.json` — kopia tekstów branży moto, dostępna pod `/data/applications.json`
- `public/ariteks/fabrics/*/docs/product-template-roadmap.md`
- **PDF-y certyfikatów** — zostają na serwerze pod swoimi adresami; usunięty jest wyłącznie odnośnik z karty tkaniny

Katalogi `reports/` i `_analysis_reports/` leżą poza `public/` i nie są serwowane.

Jeśli kiedyś trzeba będzie zamknąć i tę furtkę: usunąć pliki z repo albo przenieść
poza `public/`. Sama flaga tego nie załatwi.