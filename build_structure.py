# build_structure.py
# Ariteks WWW — scaffold struktury projektu Next.js (App Router, src/, next-intl)
# Uruchomienie: python build_structure.py (z katalogu D:\Ariteks\ariteks_www)
# Skrypt tworzy katalogi i PUSTE pliki o docelowych nazwach.
# Istniejacych plikow nie nadpisuje — mozna uruchamiac wielokrotnie.

from pathlib import Path

ROOT = Path(__file__).parent

DIRS = [
    # --- zasoby publiczne (tu trafia wygenerowane grafiki) ---
    "public/images/hero",          # grafiki hero (strona glowna, podstrony)
    "public/images/categories",    # kafle 6 grup produktowych
    "public/images/products",      # zdjecia/wizualizacje tkanin do kart produktow
    "public/images/applications",  # grafiki stron zastosowan
    "public/images/factory",       # fabryki, laboratoria, historia
    "public/images/partners",      # loga Cordura/Twaron (oficjalne pliki od licencjodawcow!)
    "public/images/og",            # obrazy Open Graph do social media
    "public/fonts",                # fonty self-hosted (woff2)

    # --- narzedzia pomocnicze ---
    "scripts",                     # parser PDF -> JSON (poza aplikacja Next)

    # --- tlumaczenia interfejsu ---
    "messages",                    # pl.json / en.json dla next-intl

    # --- aplikacja ---
    "src/i18n",                    # konfiguracja jezykow i routingu domenowego
    "src/app/[locale]",            # strony w ramach locale (pl/en)
    "src/app/[locale]/fabrics/[category]/[slug]",   # katalog: grupa -> karta produktu
    "src/app/[locale]/applications/[slug]",         # strony zastosowan (sprzedazowe)
    "src/app/[locale]/technologies",                # barwienie, wykonczenia, uslugi
    "src/app/[locale]/partners",                    # Cordura / Twaron
    "src/app/[locale]/about",                       # historia, fabryki, R&D, certyfikaty
    "src/app/[locale]/contact",                     # kontakt + formularz RFQ
    "src/components/layout",       # Header, Footer, nawigacja mobilna
    "src/components/home",         # sekcje strony glownej
    "src/components/product",      # karta produktu, tabela parametrow, badge norm
    "src/components/shared",       # przyciski, sekcje, animacje, breadcrumbs
    "src/components/forms",        # formularz zapytania ofertowego
    "src/content/products",        # JSON-y produktow (wynik parsera)
    "src/lib",                     # utils, SEO helpers
]

FILES = [
    # --- konfiguracja projektu ---
    "package.json",
    "next.config.mjs",
    "tsconfig.json",
    "tailwind.config.ts",
    "postcss.config.mjs",
    ".gitignore",
    ".env.example",
    "README.md",

    # --- narzedzia ---
    "scripts/parse_catalog.py",    # parser PDF-ow Ariteks -> src/content/products/*.json

    # --- tlumaczenia ---
    "messages/pl.json",
    "messages/en.json",

    # --- i18n / routing domenowy (.pl -> PL, .eu -> EN) ---
    "src/middleware.ts",
    "src/i18n/routing.ts",
    "src/i18n/request.ts",

    # --- app: fundament ---
    "src/app/layout.tsx",              # root layout (html, fonty)
    "src/app/globals.css",             # design system: zmienne, typografia
    "src/app/sitemap.ts",
    "src/app/robots.ts",
    "src/app/not-found.tsx",

    # --- app: strony ---
    "src/app/[locale]/layout.tsx",     # layout locale: Header + Footer + provider i18n
    "src/app/[locale]/page.tsx",       # STRONA GLOWNA
    "src/app/[locale]/fabrics/page.tsx",                       # hub katalogu
    "src/app/[locale]/fabrics/[category]/page.tsx",            # strona grupy (np. FR)
    "src/app/[locale]/fabrics/[category]/[slug]/page.tsx",     # karta produktu
    "src/app/[locale]/applications/page.tsx",                  # hub zastosowan
    "src/app/[locale]/applications/[slug]/page.tsx",           # strona zastosowania
    "src/app/[locale]/technologies/page.tsx",
    "src/app/[locale]/partners/page.tsx",
    "src/app/[locale]/about/page.tsx",
    "src/app/[locale]/contact/page.tsx",

    # --- komponenty: layout ---
    "src/components/layout/Header.tsx",
    "src/components/layout/Footer.tsx",
    "src/components/layout/MobileNav.tsx",

    # --- komponenty: strona glowna ---
    "src/components/home/Hero.tsx",
    "src/components/home/CategoryGrid.tsx",
    "src/components/home/WhyAriteks.tsx",       # os komunikacji: normy EU / efektywnosc / partner PL
    "src/components/home/PartnersStrip.tsx",    # pasek Cordura / Twaron
    "src/components/home/TrustSection.tsx",     # R&D, certyfikaty, 50 lat, liczby
    "src/components/home/CtaBanner.tsx",

    # --- komponenty: produkt ---
    "src/components/product/ProductCard.tsx",
    "src/components/product/SpecTable.tsx",
    "src/components/product/CertBadges.tsx",
    "src/components/product/ColorSwatches.tsx",

    # --- komponenty: wspolne ---
    "src/components/shared/Section.tsx",
    "src/components/shared/Button.tsx",
    "src/components/shared/Reveal.tsx",          # animacje wejscia (scroll reveal)
    "src/components/shared/Breadcrumbs.tsx",

    # --- komponenty: formularze ---
    "src/components/forms/RfqForm.tsx",

    # --- dane i logika ---
    "src/content/categories.ts",     # definicje 6 grup produktowych (PL/EN)
    "src/content/applications.ts",   # definicje stron zastosowan (PL/EN)
    "src/lib/utils.ts",
    "src/lib/seo.ts",                # metadata, hreflang pl<->eu
]


def main() -> None:
    created_dirs = 0
    created_files = 0
    skipped = 0

    for d in DIRS:
        path = ROOT / d
        if not path.exists():
            path.mkdir(parents=True, exist_ok=True)
            created_dirs += 1

    for f in FILES:
        path = ROOT / f
        path.parent.mkdir(parents=True, exist_ok=True)
        if path.exists():
            skipped += 1
            continue
        path.touch()
        created_files += 1

    # .gitkeep w pustych katalogach na grafiki, zeby git je widzial
    for d in DIRS:
        path = ROOT / d
        if path.is_dir() and not any(path.iterdir()):
            (path / ".gitkeep").touch()

    print(f"Utworzono katalogow: {created_dirs}")
    print(f"Utworzono plikow:    {created_files}")
    print(f"Pominieto (istnialy): {skipped}")
    print("\nDrzewo projektu:")
    print_tree(ROOT)


def print_tree(root: Path, prefix: str = "") -> None:
    ignore = {".git", ".idea", "__pycache__", "node_modules", ".venv"}
    entries = sorted(
        [e for e in root.iterdir() if e.name not in ignore],
        key=lambda e: (e.is_file(), e.name.lower()),
    )
    for i, entry in enumerate(entries):
        connector = "└── " if i == len(entries) - 1 else "├── "
        print(prefix + connector + entry.name)
        if entry.is_dir():
            extension = "    " if i == len(entries) - 1 else "│   "
            print_tree(entry, prefix + extension)


if __name__ == "__main__":
    main()