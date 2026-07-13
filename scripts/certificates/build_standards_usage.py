#!/usr/bin/env python3
"""
Buduje znormalizowany indeks norm i metod z 159 pełnych rekordów produktów.

Wejście:
  public/ariteks/fabrics/**/data/fabric-complete-record.json

Wyjście:
  src/content/standards-usage.generated.json

Uruchomienie z katalogu projektu:
  python .\scripts\certificates\build_standards_usage.py
"""

from __future__ import annotations

import json
import re
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
RECORDS_ROOT = ROOT / "public" / "ariteks" / "fabrics"
OUTPUT_FILE = ROOT / "src" / "content" / "standards-usage.generated.json"


# Kanoniczne nazwy wynikają z dominujących oznaczeń w rekordach źródłowych.
# Scala się wyłącznie warianty zapisu, krajowe przedrostki i oczywiste literówki.
ALIASES: dict[str, str] = {
    # ISO 105 — warianty bez prefiksu EN oraz literówka DO1.
    "ISO 105 B02": "EN ISO 105 B02",
    "ISO 105 B04": "EN ISO 105 B04",
    "ISO 105 D01": "EN ISO 105 D01",
    "ISO 105 DO1": "EN ISO 105 D01",
    "ISO 105 E04": "EN ISO 105 E04",
    "ISO 105 X12": "EN ISO 105 X12",

    # Tureckie wdrożenia norm europejskich/międzynarodowych.
    "TS EN ISO 3071": "EN ISO 3071",
    "TS EN ISO 5077": "EN ISO 5077",
    "TS EN ISO 1833": "EN ISO 1833",
    "TS EN 13938-1": "EN ISO 13938-1",
    "TS EN 12945-2": "EN ISO 12945-2",
    "TS EN 1773": "EN 1773",
    "TS EN 12127": "EN 12127",
    "TS EN 530": "EN 530",

    # Alternatywne oznaczenia tej samej pozycji w danych katalogowych.
    "EN 20471": "EN ISO 20471",
    "EN 1149-5": "EN ISO 1149-5",
    "EN 343": "EN ISO 343",
    "EN 4920": "EN ISO 4920",
    "EN 13034": "EN ISO 13034",
    "ISO 13034": "EN ISO 13034",
    "EN ISO 1149-5 (EN 1149-3)": "EN ISO 1149-5",
    "TS 257 EN 20811": "EN ISO 20811",

    # Zachowanie czytelnej pisowni pozycji unikalnej.
    "TS 3596:1981 /MADDE 2.3.5": "TS 3596:1981 /Madde 2.3.5",
}


# Prawdziwe piktogramy odzyskane z rekordów produktowych.
# Wartość wskazuje semantyczny rdzeń nazwy pliku przed "__hash".
ICON_STEM_BY_STANDARD: dict[str, str] = {
    "EN ISO 1149-5": "en-1149-3",
    "EN ISO 11611": "en-11611",
    "EN ISO 11612": "en-11612",
    "EN ISO 13034": "en-13034",
    "EN ISO 15614": "en-15614",
    "EN ISO 20471": "en-20471",
    "EN ISO 343": "en-343",
    "EN ISO 469": "en-469",
    "EN ISO 4920": "en-4920",
    "EN ISO 61482-1-1": "en-61482-1-2",
    "EN ISO 61482-1-2": "en-61482-1-2",
    "EN 388": "en-388",
    "EN 14116": "en-14116",
    "EN 14126": "en-14126",
    "EN 14683": "en-14683",
    "EN 17092": "en-17092",
    "EN 61340": "en-61340",
    "IEC 60895": "iec-60895",
    "ISO 18184": "iso-18184",
    "OEKO-TEX STANDARD 100": "oekoteks-standard-100-s",
}


def compact(value: str) -> str:
    """Normalizuje spacje, NBSP i warianty myślników bez zmiany treści."""
    return (
        value.replace("\u00a0", " ")
        .replace("\u2010", "-")
        .replace("\u2011", "-")
        .replace("\u2012", "-")
        .replace("\u2013", "-")
        .replace("\u2014", "-")
        .strip()
    )


def canonicalize_standard(value: str) -> str:
    normalized = re.sub(r"\s+", " ", compact(value))
    upper = normalized.upper()
    return ALIASES.get(upper, upper)


def icon_stem(public_url: str) -> str:
    name = Path(public_url).name.lower()
    name = re.sub(
        r"__[0-9a-f]{8,}\.(?:jpg|jpeg|png|webp|gif|svg)$",
        "",
        name,
        flags=re.IGNORECASE,
    )
    return re.sub(
        r"\.(?:jpg|jpeg|png|webp|gif|svg)$",
        "",
        name,
        flags=re.IGNORECASE,
    )


def read_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8-sig"))


def as_list(value: Any) -> list[Any]:
    return value if isinstance(value, list) else []


def main() -> None:
    if not RECORDS_ROOT.exists():
        raise SystemExit(f"Brak katalogu rekordów: {RECORDS_ROOT}")

    record_files = sorted(
        RECORDS_ROOT.rglob("data/fabric-complete-record.json")
    )

    if not record_files:
        raise SystemExit(
            f"Nie znaleziono plików fabric-complete-record.json w {RECORDS_ROOT}"
        )

    products_by_standard: dict[str, set[str]] = defaultdict(set)
    aliases_by_standard: dict[str, set[str]] = defaultdict(set)
    references_by_standard: dict[str, int] = defaultdict(int)

    icon_urls_by_stem: dict[str, set[str]] = defaultdict(set)
    icon_products_by_stem: dict[str, set[str]] = defaultdict(set)
    icon_labels_by_stem: dict[str, set[str]] = defaultdict(set)

    errors: list[str] = []

    for record_file in record_files:
        # .../<slug>/data/fabric-complete-record.json
        product_slug = record_file.parents[1].name

        try:
            record = read_json(record_file)
        except (OSError, json.JSONDecodeError) as exc:
            errors.append(f"{record_file}: {exc}")
            continue

        page = record.get("product_page") or {}

        for parameter in as_list(page.get("technical_parameters")):
            if not isinstance(parameter, dict):
                continue

            raw_standard = parameter.get("standard")
            if not isinstance(raw_standard, str) or not raw_standard.strip():
                continue

            raw_compact = re.sub(r"\s+", " ", compact(raw_standard))
            canonical = canonicalize_standard(raw_compact)

            products_by_standard[canonical].add(product_slug)
            aliases_by_standard[canonical].add(raw_compact)
            references_by_standard[canonical] += 1

        image_groups = page.get("image_groups") or {}
        for icon in as_list(image_groups.get("function_icons")):
            if not isinstance(icon, dict):
                continue

            public_url = icon.get("public_url")
            if not isinstance(public_url, str) or not public_url.strip():
                continue

            url = public_url.strip()
            stem = icon_stem(url)

            icon_urls_by_stem[stem].add(url)
            icon_products_by_stem[stem].add(product_slug)

            for label_key in ("alt", "title"):
                label = icon.get(label_key)
                if isinstance(label, str) and label.strip():
                    icon_labels_by_stem[stem].add(label.strip())

    icons: dict[str, dict[str, Any]] = {}
    for stem in sorted(icon_urls_by_stem):
        urls = sorted(icon_urls_by_stem[stem])
        labels = sorted(icon_labels_by_stem[stem])

        icons[stem] = {
            "url": urls[0],
            "productCount": len(icon_products_by_stem[stem]),
            "labels": labels,
        }

    standards: list[dict[str, Any]] = []
    for standard, products in products_by_standard.items():
        requested_stem = ICON_STEM_BY_STANDARD.get(standard)
        icon = icons.get(requested_stem) if requested_stem else None

        standards.append(
            {
                "standard": standard,
                "aliases": sorted(
                    aliases_by_standard[standard],
                    key=lambda value: value.upper(),
                ),
                "references": references_by_standard[standard],
                "productCount": len(products),
                "products": sorted(products),
                "iconStem": requested_stem,
                "icon": icon["url"] if icon else None,
            }
        )

    standards.sort(
        key=lambda item: (
            -int(item["productCount"]),
            str(item["standard"]),
        )
    )

    raw_designations = {
        alias
        for aliases in aliases_by_standard.values()
        for alias in aliases
    }

    filterable = [
        item
        for item in standards
        if 2 <= int(item["productCount"]) < len(record_files)
    ]

    output = {
        "generatedAt": datetime.now(timezone.utc)
        .replace(microsecond=0)
        .isoformat()
        .replace("+00:00", "Z"),
        "recordsFound": len(record_files),
        "recordsRead": len(record_files) - len(errors),
        "parameterStandardReferences": sum(references_by_standard.values()),
        "rawStandardDesignations": len(raw_designations),
        "canonicalStandards": len(standards),
        "technicalStandardsWithOneProduct": sum(
            1 for item in standards if item["productCount"] == 1
        ),
        "technicalStandardsWithTwoOrMoreProducts": sum(
            1 for item in standards if item["productCount"] >= 2
        ),
        "technicalFilterableStandards": len(filterable),
        "icons": icons,
        "standards": standards,
        "errors": errors,
    }

    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_FILE.write_text(
        json.dumps(output, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    print("=== STANDARDS USAGE ===")
    print(f"Rekordy znalezione:              {len(record_files)}")
    print(f"Rekordy odczytane:               {len(record_files) - len(errors)}")
    print(f"Powiązania parametr -> norma:    {sum(references_by_standard.values())}")
    print(f"Surowe oznaczenia:               {len(raw_designations)}")
    print(f"Normy po normalizacji:           {len(standards)}")
    print(
        "Normy techniczne z 1 produktem: "
        f"{sum(1 for item in standards if item['productCount'] == 1)}"
    )
    print(
        "Normy techniczne z 2+ produktami: "
        f"{sum(1 for item in standards if item['productCount'] >= 2)}"
    )
    print(
        "Normy techniczne filtrowalne 2..158: "
        f"{len(filterable)}"
    )
    print(f"Semantyczne typy ikon:           {len(icons)}")
    print(f"Błędy odczytu:                   {len(errors)}")
    print(f"Zapisano:                        {OUTPUT_FILE}")

    if errors:
        print("\n=== BŁĘDY ===")
        for error in errors:
            print(error)


if __name__ == "__main__":
    main()