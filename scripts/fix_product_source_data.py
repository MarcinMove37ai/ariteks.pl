#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
fix_product_source_data.py

Kontrolowana korekta jednoznacznych błędów danych produktowych Ariteks.

Modyfikuje wyłącznie:
1. public/ariteks/fabrics/data/all-fabrics-manifest.json
2. wskazane public/ariteks/fabrics/<slug>/data/fabric-complete-record.json

Zasady bezpieczeństwa:
- domyślnie działa jako dry-run;
- zapis następuje dopiero z flagą --apply;
- każda zmiana wymaga dokładnej zgodności starej wartości;
- wartość już poprawiona jest traktowana jako OK;
- nieoczekiwana wartość przerywa operację przed zapisem;
- przed pierwszym zapisem tworzone są kopie *.pre-product-data-fix.json.

Uruchomienie:
    python scripts/fix_product_source_data.py
    python scripts/fix_product_source_data.py --apply
"""

from __future__ import annotations

import argparse
import json
import shutil
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import Any


@dataclass(frozen=True)
class ExactPatch:
    path: tuple[str, ...]
    old: str
    new: str


@dataclass(frozen=True)
class FiberPatch:
    old: str
    new: str


PATCHES: dict[str, dict[str, Any]] = {
    "aramid-d1-210-denim": {
        "manifest": [
            ExactPatch(
                ("category_composition",),
                "5% p-AR 2% CF",
                "93% m-AR 5% p-AR 2% CF",
            ),
        ],
        "record": [
            ExactPatch(
                ("category_row", "summary", "composition"),
                "5% p-AR 2% CF",
                "93% m-AR 5% p-AR 2% CF",
            ),
        ],
    },
    "aramid-d2-260-el": {
        "manifest": [
            ExactPatch(
                ("category_composition",),
                "5% p-AR 2% CF 5% El",
                "88% m-AR 5% p-AR 2% CF 5% EL",
            ),
        ],
        "record": [
            ExactPatch(
                ("category_row", "summary", "composition"),
                "5% p-AR 2% CF 5% El",
                "88% m-AR 5% p-AR 2% CF 5% EL",
            ),
        ],
    },
    "ard3e3": {
        "manifest": [
            ExactPatch(
                ("category_composition",),
                "54% CV 20% PA6.6 20% WO 5% p-AR",
                "54% CV 20% PA6.6 20% WO 5% p-AR 1% CF",
            ),
        ],
        "record": [
            ExactPatch(
                ("category_row", "summary", "composition"),
                "54% CV 20% PA6.6 20% WO 5% p-AR",
                "54% CV 20% PA6.6 20% WO 5% p-AR 1% CF",
            ),
        ],
    },
    "arwowear-t4-static-pro": {
        "manifest": [
            ExactPatch(
                ("category_composition",),
                "64% PES 1% CF",
                "64% PES 35% CO 1% CF",
            ),
        ],
        "record": [
            ExactPatch(
                ("category_row", "summary", "composition"),
                "64% PES 1% CF",
                "64% PES 35% CO 1% CF",
            ),
        ],
    },
    "armoto-dura": {
        "manifest": [
            ExactPatch(
                ("category_composition",),
                "100% PA",
                "100% PA6.6",
            ),
        ],
        "record": [
            ExactPatch(
                ("category_row", "summary", "composition"),
                "100% PA",
                "100% PA6.6",
            ),
        ],
    },
    "arpower-knit": {
        "manifest": [
            ExactPatch(
                ("spec_line",),
                (
                    "400 g/m², 45% Polyester 35% Viscose 22% Polyamide "
                    "8% Elastane, Water Repellent, Antibacterial, "
                    "Elastic Knit Fabric"
                ),
                (
                    "400 g/m², 40% Polyester 30% Viscose 22% Polyamide "
                    "8% Elastane, Water Repellent, Antibacterial, "
                    "Elastic Knit Fabric"
                ),
            ),
        ],
        "record": [
            ExactPatch(
                ("product_page", "spec_line"),
                (
                    "400 g/m², 45% Polyester 35% Viscose 22% Polyamide "
                    "8% Elastane, Water Repellent, Antibacterial, "
                    "Elastic Knit Fabric"
                ),
                (
                    "400 g/m², 40% Polyester 30% Viscose 22% Polyamide "
                    "8% Elastane, Water Repellent, Antibacterial, "
                    "Elastic Knit Fabric"
                ),
            ),
        ],
        "fiber": FiberPatch(
            (
                "40% Polyester (PES) 30% Viscose (CV) "
                "22% Polyamide (PU) 8% Elastane (EL)"
            ),
            (
                "40% Polyester (PES) 30% Viscose (CV) "
                "22% Polyamide 6 (PA6) 8% Elastane (EL)"
            ),
        ),
    },
    "ardolu": {
        "manifest": [
            ExactPatch(
                ("spec_line",),
                (
                    "210 g/m², 95% Polyester 5% Elastane, "
                    "3 layer laminated, Bonded Fabric"
                ),
                (
                    "210 g/m², 95% Polyester 5% Polyurethane, "
                    "3 layer laminated, Bonded Fabric"
                ),
            ),
        ],
        "record": [
            ExactPatch(
                ("product_page", "spec_line"),
                (
                    "210 g/m², 95% Polyester 5% Elastane, "
                    "3 layer laminated, Bonded Fabric"
                ),
                (
                    "210 g/m², 95% Polyester 5% Polyurethane, "
                    "3 layer laminated, Bonded Fabric"
                ),
            ),
        ],
    },
    "arshirt-emk": {
        "fiber": FiberPatch(
            "80% Polyester (CO) 20% Stainless Steel (MTF)",
            "80% Polyester (PES) 20% Stainless Steel (MTF)",
        ),
    },
    "arpower-knit-p": {
        "fiber": FiberPatch(
            "70% Polyester (PES) 22% Polyamide (PU) 8% Elastane (EL)",
            "70% Polyester (PES) 22% Polyamide 6 (PA6) 8% Elastane (EL)",
        ),
    },
    "arsport-el": {
        "fiber": FiberPatch(
            "92% Polyester 8% Elastane (PES)",
            "92% Polyester (PES) 8% Elastane (EL)",
        ),
    },
    "arflexmembrane": {
        "fiber": FiberPatch(
            "28% Polyester (PES) 2% Elastane (EL) %70 Polyurethane (PU)",
            "28% Polyester (PES) 2% Elastane (EL) 70% Polyurethane (PU)",
        ),
    },
}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--root",
        type=Path,
        default=Path.cwd(),
        help="Katalog główny projektu.",
    )
    parser.add_argument(
        "--apply",
        action="store_true",
        help="Zapisz zmiany. Bez tej flagi wykonywany jest tylko dry-run.",
    )
    return parser.parse_args()


def load_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8-sig"))


def write_json(path: Path, data: dict[str, Any]) -> None:
    path.write_text(
        json.dumps(data, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )


def get_nested(data: dict[str, Any], path: tuple[str, ...]) -> Any:
    current: Any = data
    for key in path:
        if not isinstance(current, dict) or key not in current:
            raise KeyError(".".join(path))
        current = current[key]
    return current


def set_nested(
    data: dict[str, Any],
    path: tuple[str, ...],
    value: Any,
) -> None:
    current: Any = data
    for key in path[:-1]:
        current = current[key]
    current[path[-1]] = value


def check_exact_patch(
    *,
    data: dict[str, Any],
    patch: ExactPatch,
    slug: str,
    target: str,
    apply: bool,
    report: list[dict[str, str]],
    errors: list[str],
) -> None:
    path_label = ".".join(patch.path)

    try:
        current = get_nested(data, patch.path)
    except KeyError:
        errors.append(f"{slug} [{target}] brak ścieżki: {path_label}")
        return

    if current == patch.new:
        status = "already_correct"
    elif current == patch.old:
        status = "updated" if apply else "would_update"
        if apply:
            set_nested(data, patch.path, patch.new)
    else:
        status = "unexpected_value"
        errors.append(
            f"{slug} [{target}] {path_label}: "
            f"oczekiwano {patch.old!r} albo {patch.new!r}, "
            f"otrzymano {current!r}"
        )

    report.append(
        {
            "slug": slug,
            "target": target,
            "path": path_label,
            "status": status,
            "old": patch.old,
            "new": patch.new,
            "current_before": str(current),
        }
    )


def check_fiber_patch(
    *,
    record: dict[str, Any],
    patch: FiberPatch,
    slug: str,
    apply: bool,
    report: list[dict[str, str]],
    errors: list[str],
) -> None:
    parameters = (
        (record.get("product_page") or {}).get("technical_parameters") or []
    )

    matches = [
        parameter
        for parameter in parameters
        if str(parameter.get("name") or "").strip().lower()
        in {"fiber", "fibre", "composition", "content"}
    ]

    if len(matches) != 1:
        errors.append(
            f"{slug} [record] oczekiwano jednego parametru Fiber, "
            f"znaleziono: {len(matches)}"
        )
        return

    parameter = matches[0]
    current = str(parameter.get("value") or "")

    if current == patch.new:
        status = "already_correct"
    elif current == patch.old:
        status = "updated" if apply else "would_update"
        if apply:
            parameter["value"] = patch.new
    else:
        status = "unexpected_value"
        errors.append(
            f"{slug} [record] product_page.technical_parameters[...].value: "
            f"oczekiwano {patch.old!r} albo {patch.new!r}, "
            f"otrzymano {current!r}"
        )

    report.append(
        {
            "slug": slug,
            "target": "record",
            "path": "product_page.technical_parameters[parameter=Fiber].value",
            "status": status,
            "old": patch.old,
            "new": patch.new,
            "current_before": current,
        }
    )


def backup_once(path: Path, backup_name: str) -> Path:
    backup = path.with_name(backup_name)
    if not backup.exists():
        shutil.copy2(path, backup)
    return backup


def main() -> None:
    args = parse_args()
    root = args.root.resolve()
    fabrics_root = root / "public" / "ariteks" / "fabrics"
    manifest_path = fabrics_root / "data" / "all-fabrics-manifest.json"
    report_dir = root / "_audit" / "product-data-fix"

    if not manifest_path.is_file():
        raise SystemExit(f"Brak manifestu: {manifest_path}")

    manifest = load_json(manifest_path)
    products = manifest.get("products") or []
    manifest_by_slug = {
        str(product.get("slug") or ""): product
        for product in products
    }

    record_data: dict[str, dict[str, Any]] = {}
    record_paths: dict[str, Path] = {}
    report: list[dict[str, str]] = []
    errors: list[str] = []

    for slug, patch_group in PATCHES.items():
        manifest_row = manifest_by_slug.get(slug)
        if manifest_row is None:
            errors.append(f"{slug} [manifest] brak produktu")
            continue

        record_path = (
            fabrics_root
            / slug
            / "data"
            / "fabric-complete-record.json"
        )
        if not record_path.is_file():
            errors.append(f"{slug} [record] brak pliku: {record_path}")
            continue

        record = load_json(record_path)
        record_data[slug] = record
        record_paths[slug] = record_path

        for patch in patch_group.get("manifest", []):
            check_exact_patch(
                data=manifest_row,
                patch=patch,
                slug=slug,
                target="manifest",
                apply=args.apply,
                report=report,
                errors=errors,
            )

        for patch in patch_group.get("record", []):
            check_exact_patch(
                data=record,
                patch=patch,
                slug=slug,
                target="record",
                apply=args.apply,
                report=report,
                errors=errors,
            )

        fiber_patch = patch_group.get("fiber")
        if fiber_patch is not None:
            check_fiber_patch(
                record=record,
                patch=fiber_patch,
                slug=slug,
                apply=args.apply,
                report=report,
                errors=errors,
            )

    if errors:
        print("PRZERWANO — wykryto nieoczekiwane dane:")
        for error in errors:
            print(f"  - {error}")
        raise SystemExit(1)

    if args.apply:
        backup_once(
            manifest_path,
            "all-fabrics-manifest.pre-product-data-fix.json",
        )

        for slug, record_path in record_paths.items():
            backup_once(
                record_path,
                "fabric-complete-record.pre-product-data-fix.json",
            )
            write_json(record_path, record_data[slug])

        manifest["product_data_fixed_at"] = datetime.now().isoformat(
            timespec="seconds"
        )
        manifest["product_data_fix_note"] = (
            "Kontrolowane korekty składu, spec_line i parametru Fiber; "
            "fix_product_source_data.py"
        )
        write_json(manifest_path, manifest)

    report_dir.mkdir(parents=True, exist_ok=True)
    report_payload = {
        "mode": "apply" if args.apply else "dry-run",
        "generated_at": datetime.now().isoformat(timespec="seconds"),
        "patches": report,
    }
    write_json(report_dir / "report.json", report_payload)

    counts: dict[str, int] = {}
    for item in report:
        counts[item["status"]] = counts.get(item["status"], 0) + 1

    print(f"Tryb: {'APPLY' if args.apply else 'DRY-RUN'}")
    print(f"Produkty objęte korektą: {len(PATCHES)}")
    print(f"Operacje: {len(report)}")
    for status, count in sorted(counts.items()):
        print(f"  {status}: {count}")
    print(f"Raport: {report_dir / 'report.json'}")

    if not args.apply:
        print(
            "\nBrak zapisu. Po sprawdzeniu uruchom ponownie z flagą --apply."
        )


if __name__ == "__main__":
    main()