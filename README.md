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

> **Stan produkcji:** serwis jest tymczasowo wygaszony — wszystkie trasy zwracają 404
> (flaga `SITE_OFFLINE`). To osobny mechanizm, niezwiązany z flagą marek opisaną niżej.

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
| `page.tsx` (karta tkaniny) | `partnerLogos` | sekcja „Partnerzy technologiczni" znika z 14 kart tkanin ArDura |
| `page.tsx` (karta tkaniny) | `certDocs` | z listy certyfikatów wypada pozycja z „Cordura" w etykiecie, tytule lub URL-u |
| `page.tsx` (karta tkaniny) | `appImages` / `stripBrand` | marka wycięta z podpisów zdjęć, `aria-label` i `alt` w galerii |

Pełna ścieżka karty tkaniny: `src/app/[locale]/fabrics/[family]/[slug]/page.tsx`.

Trzy uwagi do tabeli:

**Badge nie zmienia nazwy — znika.** Neutralny wzorzec `/\bPA 6\.6 HT\b/i` nigdy się nie
dopasuje, bo w danych tkanin nie ma takiego ciągu (jest „Cordura" albo „PA 6.6" bez HT).
Wzorzec zostaje w kodzie wyłącznie po to, żeby przestawienie flagi przywróciło stan sprzed zmian.

**Filtr logotypów jest hurtowy.** Wycina całą grupę `technology_partners`, nie tylko Cordurę.
Praktycznie nie ma to znaczenia, bo w tej grupie leży wyłącznie logo Cordury powielone
po katalogach ArDura. Gdyby przy innych rodzinach pojawiły się inne logotypy — trzeba
będzie zawęzić filtr do nazwy pliku.

**`stripBrand` czyści tylko `alt` i `title`, nie `public_url`.** Nazwy plików obrazków
(`cordura-motorcyclist-cloth-m__74428940f8.jpg` i podobne) zostają w adresach — świadoma
decyzja, bo dla odwiedzającego są niewidoczne. Przy fladze `true` funkcja zwraca tekst bez
zmian, więc podpisy wracają w oryginale i nic nie trzeba odkręcać.

---

## Odwrócenie zmian

### Krok 1 — flaga (przywraca wszystko poza słownikami)

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

---

## Kontrola — jak sprawdzić, że jest czysto

Klikanie po stronie **nie wystarczy**: marka potrafi siedzieć w `aria-label`, w podpisach
zdjęć albo na karcie tkaniny, której nikt nie otwiera. Pewna metoda to przeszukanie
zbudowanego HTML-a — build generuje statyczne pliki dla wszystkich tras w obu językach.

```powershell
cd D:\Ariteks\ariteks_www
npx tsc --noEmit
npm run build

Get-ChildItem -Recurse -File -Path ".next\server\app" -Include *.html |
  Select-String -Pattern 'cordura','invista' |
  Group-Object { $_.Path.Split('\')[-1] } |
  ForEach-Object { '{0} — trafien: {1}' -f $_.Name, $_.Count }
```

### Wynik oczekiwany (stan prawidłowy)

```
ardura-1000-fr.html   — trafien: 2
ardura-500-c-neo.html — trafien: 2
ardura-500-c.html     — trafien: 2
```

**To nie jest usterka.** Po dwa trafienia na plik (wersja PL i EN) pochodzą wyłącznie
z nazw plików obrazków w atrybucie `src` — pięć zdjęć ma markę w nazwie pliku i zgodnie
z decyzją zostają. Wszystkie `alt`, `aria-label` i podpisy obok nich są czyste.

Jeśli trafień jest więcej albo pojawiają się w innych plikach — coś przeciekło. Podgląd
kontekstu wokół każdego trafienia:

```powershell
Get-ChildItem -Recurse -File -Path ".next\server\app" -Include *.html |
  Select-String -Pattern 'cordura','invista' |
  Select-Object -ExpandProperty Path -Unique |
  ForEach-Object {
    $n = Split-Path $_ -Leaf
    [regex]::Matches((Get-Content -LiteralPath $_ -Raw), '.{60}cordura.{60}', 'IgnoreCase') |
      ForEach-Object { Write-Host "`n--- $n ---"; Write-Host $_.Value }
  }
```

### Skan kodu źródłowego

Każde trafienie powinno siedzieć wewnątrz `pickBrand(…)` albo `SHOW_CORDURA`:

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

---

## Historia zmian

| Commit | Zakres |
|---|---|
| `a62bf04` | Ukrycie marki za flagą `SHOW_CORDURA` — 7 plików + nowy `src/lib/brands.ts` |
| `9ebff6a` | README: dokumentacja flagi |
| — | Usunięcie marki z podpisów zdjęć w galerii tkanin (`stripBrand`) |