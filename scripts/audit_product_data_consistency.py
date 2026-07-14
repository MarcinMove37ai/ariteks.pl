#!/usr/bin/env python3
"""
Audyt spójności danych produktów Ariteks.

Porównuje:
- src/content/fabrics.ts,
- public/.../fabric-complete-record.json.

Nie modyfikuje źródeł. Zapisuje raporty do:
  _audit/product-data-consistency/

Uruchomienie:
  python scripts/audit_product_data_consistency.py
"""

from __future__ import annotations

import argparse
import ast
import csv
import json
import re
from collections import Counter
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Iterable


PRODUCTS_MARKER = "export const FABRICS: FabricDef[] = ["

FIBER_ALIASES: list[tuple[str, re.Pattern[str]]] = [
    ("pbo", re.compile(r"\bpbo\b|polyphenylene", re.I)),
    ("pa66", re.compile(r"\bpa\s*6[.,]6\b|polyamide\s*6[.,]6", re.I)),
    ("pa6", re.compile(r"\bpa\s*6\b|polyamide\s*6\b", re.I)),
    ("p-ar", re.compile(r"\bp[-\s]?ar(?:amid)?\b|para[-\s]?aramid", re.I)),
    ("m-ar", re.compile(r"\bm[-\s]?ar(?:amid)?\b|meta[-\s]?aramid", re.I)),
    ("pes", re.compile(r"\bpes\b|polyester", re.I)),
    ("co", re.compile(r"\bco\b|cotton", re.I)),
    ("cf", re.compile(r"\bcf\b|carbon|^\s*c\s*$", re.I)),
    ("pu", re.compile(r"\bpu\b|polyurethane", re.I)),
    ("cv", re.compile(r"\bcv\b|viscose", re.I)),
    ("mac", re.compile(r"\bmac\b|modacrylic", re.I)),
    ("el", re.compile(r"\bel\b|elast(?:ane|hane)", re.I)),
    ("wo", re.compile(r"\bwo\b|wool", re.I)),
    ("hppe", re.compile(r"\bhppe\b", re.I)),
    ("aripam", re.compile(r"\baripam\b", re.I)),
    ("pan", re.compile(r"\bpan\b|acrylic", re.I)),
    ("mtf", re.compile(r"\bmtf\b|stainless\s+steel", re.I)),
    ("ag", re.compile(r"\bag\b|silver", re.I)),
    ("pa", re.compile(r"\bpa\b|polyamide", re.I)),
]

BOOLEAN_PARAMETER_NAMES = {
    "antistatic",
    "antiviral",
    "antibacterial",
    "arc protection",
    "breathable",
    "chemical resistant",
    "firefighters",
    "flame retardant",
    "high visibility",
    "waterproof",
    "water repellent",
}

EXCLUDED_PRODUCT_PARAMETER_NAMES = {
    "application",
    "composition",
    "fiber",
    "quality management",
    "weave",
    "weight",
}

SOURCE_TYPO_PATTERNS: list[tuple[str, re.Pattern[str]]] = [
    ("Miltary", re.compile(r"\bmiltary\b", re.I)),
    ("Equippments", re.compile(r"\bequippments\b", re.I)),
    ("systhetic", re.compile(r"\bsysthetic\b", re.I)),
    ("firefighters's", re.compile(r"\bfirefighters's\b", re.I)),
    ("Brillant", re.compile(r"\bbrillant\b", re.I)),
    ("Antisatic", re.compile(r"\bantisatic\b", re.I)),
]


@dataclass(frozen=True)
class CompositionPart:
    percent: float
    fiber: str | None
    raw: str


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--root",
        type=Path,
        default=Path.cwd(),
        help="Katalog główny projektu. Domyślnie bieżący katalog.",
    )
    parser.add_argument(
        "--out",
        type=Path,
        default=None,
        help="Katalog raportu. Domyślnie <root>/_audit/product-data-consistency.",
    )
    return parser.parse_args()


def extract_balanced_objects(source: str, marker: str) -> list[str]:
    marker_pos = source.find(marker)
    if marker_pos < 0:
        raise ValueError(f"Nie znaleziono znacznika: {marker}")

    array_start = source.find("[", marker_pos + len(marker) - 1)
    if array_start < 0:
        raise ValueError("Nie znaleziono początku tablicy FABRICS.")

    objects: list[str] = []
    depth = 0
    start: int | None = None
    in_string = False
    quote = ""
    escaped = False

    for index in range(array_start + 1, len(source)):
        char = source[index]

        if in_string:
            if escaped:
                escaped = False
            elif char == "\\":
                escaped = True
            elif char == quote:
                in_string = False
            continue

        if char in {"'", '"', "`"}:
            in_string = True
            quote = char
            continue

        if char == "{":
            if depth == 0:
                start = index
            depth += 1
        elif char == "}":
            depth -= 1
            if depth == 0 and start is not None:
                objects.append(source[start : index + 1])
                start = None
        elif char == "]" and depth == 0:
            break

    return objects


def parse_ts_string(block: str, field: str) -> str | None:
    pattern = re.compile(
        rf"^\s*{re.escape(field)}:\s*('(?:\\.|[^'\\])*')\s*,",
        re.M,
    )
    match = pattern.search(block)
    if not match:
        return None
    return str(ast.literal_eval(match.group(1)))


def parse_ts_number(block: str, field: str) -> int | float | None:
    match = re.search(
        rf"^\s*{re.escape(field)}:\s*(-?\d+(?:\.\d+)?)\s*,",
        block,
        re.M,
    )
    if not match:
        return None
    value = float(match.group(1))
    return int(value) if value.is_integer() else value


def parse_ts_string_array(block: str, field: str) -> list[str]:
    match = re.search(
        rf"^\s*{re.escape(field)}:\s*(\[(?:\\.|[^\]])*\])\s*,",
        block,
        re.M,
    )
    if not match:
        return []
    try:
        value = ast.literal_eval(match.group(1))
    except (SyntaxError, ValueError):
        return []
    return [str(item) for item in value] if isinstance(value, list) else []


def parse_catalogue_products(fabrics_path: Path) -> list[dict[str, Any]]:
    source = fabrics_path.read_text(encoding="utf-8")
    blocks = extract_balanced_objects(source, PRODUCTS_MARKER)
    products: list[dict[str, Any]] = []

    for block in blocks:
        slug = parse_ts_string(block, "slug")
        record_url = parse_ts_string(block, "recordUrl")
        if not slug or not record_url:
            continue

        products.append(
            {
                "slug": slug,
                "name": parse_ts_string(block, "name") or "",
                "family": parse_ts_string(block, "family") or "",
                "sub_family": parse_ts_string(block, "subFamily") or "",
                "category_id": parse_ts_string(block, "categoryId") or "",
                "weight": parse_ts_string(block, "weight") or "",
                "weight_gsm": parse_ts_number(block, "weightGsm"),
                "composition": parse_ts_string(block, "composition") or "",
                "weave": parse_ts_string(block, "weave") or "",
                "spec_line": parse_ts_string(block, "specLine") or "",
                "norms": parse_ts_string_array(block, "norms"),
                "properties": parse_ts_string_array(block, "properties"),
                "fibers": parse_ts_string_array(block, "fibers"),
                "parameters_count": parse_ts_number(block, "parametersCount"),
                "colors_count": parse_ts_number(block, "colorsCount"),
                "record_url": record_url,
            }
        )

    return products


def load_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8-sig"))


def clean_text(value: Any) -> str:
    return re.sub(r"\s+", " ", str(value or "")).strip()


def extract_weight_gsm(value: str) -> float | None:
    match = re.search(
        r"(\d+(?:[.,]\d+)?)(?:\s*±\s*\d+(?:[.,]\d+)?)?\s*(?:g|gr)\s*/\s*m(?:²|2|'?2)?|\b(\d+(?:[.,]\d+)?)\s*gsm\b",
        value,
        re.I,
    )
    if not match:
        return None
    raw = match.group(1) or match.group(2)
    return float(raw.replace(",", "."))


def identify_fiber(segment: str) -> str | None:
    for code, pattern in FIBER_ALIASES:
        if pattern.search(segment):
            return code
    return None


def parse_composition(value: str) -> list[CompositionPart]:
    text = clean_text(value)
    matches = list(re.finditer(r"(\d+(?:[.,]\d+)?)\s*%", text))
    parts: list[CompositionPart] = []

    for index, match in enumerate(matches):
        end = matches[index + 1].start() if index + 1 < len(matches) else len(text)
        segment = text[match.end() : end]
        segment = re.split(r"[,;]", segment, maxsplit=1)[0].strip()
        parts.append(
            CompositionPart(
                percent=float(match.group(1).replace(",", ".")),
                fiber=identify_fiber(segment),
                raw=segment,
            )
        )

    return parts


def composition_key(parts: Iterable[CompositionPart]) -> tuple[tuple[str, float], ...] | None:
    values = list(parts)
    if not values or any(part.fiber is None for part in values):
        return None
    return tuple(sorted((part.fiber or "", part.percent) for part in values))


def composition_display(parts: Iterable[CompositionPart]) -> str:
    return " | ".join(
        f"{part.percent:g}% {part.fiber or '?'} [{part.raw}]"
        for part in parts
    )


def classify_composition(
    catalogue: list[CompositionPart],
    spec: list[CompositionPart],
    parameter: list[CompositionPart],
) -> tuple[str, str]:
    sources = {
        "catalogue": composition_key(catalogue),
        "spec_line": composition_key(spec),
        "record_fiber": composition_key(parameter),
    }
    usable = {name: key for name, key in sources.items() if key is not None}

    if len(usable) < 2:
        return "UNRESOLVED", "Za mało poprawnie rozpoznanych źródeł."

    unique = set(usable.values())
    if len(unique) == 1:
        return "OK", "Rozpoznane źródła są zgodne."

    keys = list(unique)
    all_fibers = {
        name: {fiber for fiber, _ in key}
        for name, key in usable.items()
    }
    contains_pu = any("pu" in fibers for fibers in all_fibers.values())
    without_pu = any("pu" not in fibers for fibers in all_fibers.values())

    if contains_pu and without_pu:
        return (
            "REVIEW_COATING",
            "Jedno źródło uwzględnia PU/powłokę, inne opisuje samo włókno bazowe.",
        )

    return "CONFLICT", "Rozpoznane składy różnią się udziałami lub włóknami."


def normalize_standard(value: str) -> str:
    return (
        clean_text(value)
        .upper()
        .replace("–", "-")
        .replace("—", "-")
    )


def normalized_standard_key(value: str) -> str:
    return re.sub(r"[^A-Z0-9]", "", normalize_standard(value))


def first_parameter(
    parameters: list[dict[str, Any]],
    names: set[str],
) -> dict[str, Any] | None:
    for parameter in parameters:
        name = clean_text(parameter.get("name")).lower()
        if name in names:
            return parameter
    return None


def flatten_texts(record: dict[str, Any]) -> list[tuple[str, str]]:
    pp = record.get("product_page") or {}
    values: list[tuple[str, str]] = []

    for field in (
        "commercial_name",
        "product_name",
        "title_descriptor",
        "spec_line",
        "page_title",
    ):
        value = clean_text(pp.get(field))
        if value:
            values.append((field, value))

    for index, value in enumerate(pp.get("description_blocks") or []):
        text = clean_text(value)
        if text:
            values.append((f"description_blocks[{index}]", text))

    for index, parameter in enumerate(pp.get("technical_parameters") or []):
        for field in ("name", "value", "standard"):
            value = clean_text(parameter.get(field))
            if value:
                values.append((f"technical_parameters[{index}].{field}", value))

    return values


def write_csv(path: Path, rows: list[dict[str, Any]], fieldnames: list[str]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8-sig", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(rows)


def join_values(values: Iterable[str]) -> str:
    return " | ".join(value for value in values if value)


def audit(root: Path, out_dir: Path) -> None:
    fabrics_path = root / "src" / "content" / "fabrics.ts"
    if not fabrics_path.is_file():
        raise FileNotFoundError(f"Brak pliku: {fabrics_path}")

    products = parse_catalogue_products(fabrics_path)
    product_rows: list[dict[str, Any]] = []
    composition_rows: list[dict[str, Any]] = []
    weight_rows: list[dict[str, Any]] = []
    count_rows: list[dict[str, Any]] = []
    suspicious_rows: list[dict[str, Any]] = []
    standards_rows: list[dict[str, Any]] = []
    text_issue_rows: list[dict[str, Any]] = []
    missing_rows: list[dict[str, Any]] = []

    for product in products:
        slug = product["slug"]
        record_path = root / "public" / product["record_url"].lstrip("/")

        base_row = {
            "slug": slug,
            "name": product["name"],
            "family": product["family"],
            "record_path": str(record_path),
        }

        if not record_path.is_file():
            missing_rows.append(
                {
                    **base_row,
                    "record_url": product["record_url"],
                    "issue": "Brak fabric-complete-record.json",
                }
            )
            product_rows.append(
                {
                    **base_row,
                    "status": "MISSING_RECORD",
                    "composition_status": "",
                    "weight_status": "",
                    "catalogue_composition": product["composition"],
                    "record_fiber": "",
                    "catalogue_weight": product["weight"],
                    "record_weight": "",
                    "catalogue_parameters_count": product["parameters_count"],
                    "record_parameters_count": "",
                    "catalogue_colors_count": product["colors_count"],
                    "record_colors_count": "",
                    "iso9001_present": "",
                    "suspicious_parameter_count": "",
                    "text_issue_count": "",
                }
            )
            continue

        record = load_json(record_path)
        pp = record.get("product_page") or {}
        parameters = list(pp.get("technical_parameters") or [])
        colors = list(pp.get("colors_and_articles") or [])
        documents = list(pp.get("technical_documents") or [])

        fiber_param = first_parameter(
            parameters,
            {"fiber", "composition", "content", "fibre"},
        )
        weight_param = first_parameter(parameters, {"weight", "grammage"})

        raw_record_fiber = clean_text((fiber_param or {}).get("value"))
        raw_record_weight = clean_text((weight_param or {}).get("value"))
        raw_record_spec = clean_text(pp.get("spec_line"))

        catalogue_comp = parse_composition(product["composition"])
        spec_comp = parse_composition(raw_record_spec or product["spec_line"])
        parameter_comp = parse_composition(raw_record_fiber)

        composition_status, composition_reason = classify_composition(
            catalogue_comp,
            spec_comp,
            parameter_comp,
        )

        catalogue_weight = extract_weight_gsm(product["weight"])
        spec_weight = extract_weight_gsm(raw_record_spec or product["spec_line"])
        parameter_weight = extract_weight_gsm(raw_record_weight)

        available_weights = [
            value
            for value in (catalogue_weight, spec_weight, parameter_weight)
            if value is not None
        ]
        weight_status = (
            "OK"
            if len(available_weights) >= 2
            and max(available_weights) - min(available_weights) <= 0.01
            else "CONFLICT"
            if len(available_weights) >= 2
            else "UNRESOLVED"
        )

        if composition_status != "OK":
            composition_rows.append(
                {
                    **base_row,
                    "status": composition_status,
                    "reason": composition_reason,
                    "catalogue_raw": product["composition"],
                    "catalogue_parsed": composition_display(catalogue_comp),
                    "spec_line_raw": raw_record_spec or product["spec_line"],
                    "spec_line_parsed": composition_display(spec_comp),
                    "record_fiber_raw": raw_record_fiber,
                    "record_fiber_parsed": composition_display(parameter_comp),
                }
            )

        if weight_status != "OK":
            weight_rows.append(
                {
                    **base_row,
                    "status": weight_status,
                    "catalogue_raw": product["weight"],
                    "catalogue_gsm": catalogue_weight,
                    "spec_line_raw": raw_record_spec or product["spec_line"],
                    "spec_line_gsm": spec_weight,
                    "record_weight_raw": raw_record_weight,
                    "record_weight_gsm": parameter_weight,
                }
            )

        actual_parameter_count = len(parameters)
        actual_color_count = len(colors)
        parameter_count_match = product["parameters_count"] == actual_parameter_count
        color_count_match = product["colors_count"] == actual_color_count

        if not parameter_count_match or not color_count_match:
            count_rows.append(
                {
                    **base_row,
                    "catalogue_parameters_count": product["parameters_count"],
                    "record_parameters_count": actual_parameter_count,
                    "parameters_match": parameter_count_match,
                    "catalogue_colors_count": product["colors_count"],
                    "record_colors_count": actual_color_count,
                    "colors_match": color_count_match,
                }
            )

        product_suspicious_count = 0
        all_record_standards: list[str] = []

        for index, parameter in enumerate(parameters):
            parameter_name = clean_text(parameter.get("name"))
            parameter_value = clean_text(parameter.get("value"))
            parameter_standard = clean_text(parameter.get("standard"))
            normalized_name = parameter_name.lower()
            all_record_standards.append(parameter_standard)

            reasons: list[str] = []
            if normalized_name in EXCLUDED_PRODUCT_PARAMETER_NAMES:
                reasons.append("pole wyłączane z Product JSON-LD")
            if normalize_standard(parameter_standard) == "ISO 9001":
                reasons.append("norma systemu zarządzania, nie cecha produktu")
            if parameter_value.lower() == "done":
                reasons.append("wartość ogólna „Done”")
            if parameter_value.lower() in {"yes", "no"}:
                reasons.append("wartość binarna bez wyniku badania/klasy")
            if parameter_value.startswith("@"):
                reasons.append("wartość zaczyna się od @")
            if re.search(r"\bH\s+2\s+[O0]\b", parameter_value, re.I):
                reasons.append("nietypowy zapis H 2 O/H 2 0")
            if normalized_name in BOOLEAN_PARAMETER_NAMES and not parameter_standard:
                reasons.append("cecha ochronna bez normy")

            if reasons:
                product_suspicious_count += 1
                suspicious_rows.append(
                    {
                        **base_row,
                        "parameter_index": index,
                        "parameter_name": parameter_name,
                        "parameter_value": parameter_value,
                        "parameter_standard": parameter_standard,
                        "reasons": "; ".join(reasons),
                    }
                )

        catalogue_norms = [clean_text(value) for value in product["norms"]]
        record_standards = sorted(
            {
                clean_text(value)
                for value in all_record_standards
                if clean_text(value)
            }
        )
        record_keys = {normalized_standard_key(value) for value in record_standards}
        catalogue_keys = {normalized_standard_key(value) for value in catalogue_norms}

        standards_rows.append(
            {
                **base_row,
                "catalogue_norms": join_values(catalogue_norms),
                "catalogue_norms_not_seen_in_record": join_values(
                    norm
                    for norm in catalogue_norms
                    if normalized_standard_key(norm) not in record_keys
                ),
                "record_standards": join_values(record_standards),
                "record_standards_not_in_catalogue": join_values(
                    standard
                    for standard in record_standards
                    if normalized_standard_key(standard) not in catalogue_keys
                ),
                "iso9001_present": any(
                    normalize_standard(value) == "ISO 9001"
                    for value in record_standards
                ),
            }
        )

        text_issue_count = 0
        for location, value in flatten_texts(record):
            for label, pattern in SOURCE_TYPO_PATTERNS:
                if pattern.search(value):
                    text_issue_count += 1
                    text_issue_rows.append(
                        {
                            **base_row,
                            "location": location,
                            "pattern": label,
                            "value": value,
                        }
                    )

        overall_status = "OK"
        if composition_status == "CONFLICT" or weight_status == "CONFLICT":
            overall_status = "CONFLICT"
        elif composition_status in {"REVIEW_COATING", "UNRESOLVED"}:
            overall_status = "REVIEW"

        product_rows.append(
            {
                **base_row,
                "status": overall_status,
                "composition_status": composition_status,
                "weight_status": weight_status,
                "catalogue_composition": product["composition"],
                "record_fiber": raw_record_fiber,
                "catalogue_weight": product["weight"],
                "record_weight": raw_record_weight,
                "catalogue_parameters_count": product["parameters_count"],
                "record_parameters_count": actual_parameter_count,
                "catalogue_colors_count": product["colors_count"],
                "record_colors_count": actual_color_count,
                "document_count": len(documents),
                "iso9001_present": any(
                    normalize_standard(value) == "ISO 9001"
                    for value in record_standards
                ),
                "suspicious_parameter_count": product_suspicious_count,
                "text_issue_count": text_issue_count,
            }
        )

    out_dir.mkdir(parents=True, exist_ok=True)

    write_csv(
        out_dir / "products.csv",
        product_rows,
        [
            "slug",
            "name",
            "family",
            "status",
            "composition_status",
            "weight_status",
            "catalogue_composition",
            "record_fiber",
            "catalogue_weight",
            "record_weight",
            "catalogue_parameters_count",
            "record_parameters_count",
            "catalogue_colors_count",
            "record_colors_count",
            "document_count",
            "iso9001_present",
            "suspicious_parameter_count",
            "text_issue_count",
            "record_path",
        ],
    )
    write_csv(
        out_dir / "composition_conflicts.csv",
        composition_rows,
        [
            "slug",
            "name",
            "family",
            "status",
            "reason",
            "catalogue_raw",
            "catalogue_parsed",
            "spec_line_raw",
            "spec_line_parsed",
            "record_fiber_raw",
            "record_fiber_parsed",
            "record_path",
        ],
    )
    write_csv(
        out_dir / "weight_conflicts.csv",
        weight_rows,
        [
            "slug",
            "name",
            "family",
            "status",
            "catalogue_raw",
            "catalogue_gsm",
            "spec_line_raw",
            "spec_line_gsm",
            "record_weight_raw",
            "record_weight_gsm",
            "record_path",
        ],
    )
    write_csv(
        out_dir / "count_conflicts.csv",
        count_rows,
        [
            "slug",
            "name",
            "family",
            "catalogue_parameters_count",
            "record_parameters_count",
            "parameters_match",
            "catalogue_colors_count",
            "record_colors_count",
            "colors_match",
            "record_path",
        ],
    )
    write_csv(
        out_dir / "suspicious_parameters.csv",
        suspicious_rows,
        [
            "slug",
            "name",
            "family",
            "parameter_index",
            "parameter_name",
            "parameter_value",
            "parameter_standard",
            "reasons",
            "record_path",
        ],
    )
    write_csv(
        out_dir / "standards_audit.csv",
        standards_rows,
        [
            "slug",
            "name",
            "family",
            "catalogue_norms",
            "catalogue_norms_not_seen_in_record",
            "record_standards",
            "record_standards_not_in_catalogue",
            "iso9001_present",
            "record_path",
        ],
    )
    write_csv(
        out_dir / "source_text_issues.csv",
        text_issue_rows,
        [
            "slug",
            "name",
            "family",
            "location",
            "pattern",
            "value",
            "record_path",
        ],
    )
    write_csv(
        out_dir / "missing_records.csv",
        missing_rows,
        ["slug", "name", "family", "record_url", "issue", "record_path"],
    )

    status_counts = Counter(row["status"] for row in product_rows)
    composition_counts = Counter(
        row["composition_status"] for row in product_rows
        if row["composition_status"]
    )
    weight_counts = Counter(
        row["weight_status"] for row in product_rows
        if row["weight_status"]
    )

    summary = {
        "catalogue_products": len(products),
        "records_found": len(products) - len(missing_rows),
        "records_missing": len(missing_rows),
        "overall_status_counts": dict(sorted(status_counts.items())),
        "composition_status_counts": dict(sorted(composition_counts.items())),
        "weight_status_counts": dict(sorted(weight_counts.items())),
        "count_conflicts": len(count_rows),
        "suspicious_parameters": len(suspicious_rows),
        "standards_rows": len(standards_rows),
        "source_text_issues": len(text_issue_rows),
        "output_directory": str(out_dir),
    }

    (out_dir / "summary.json").write_text(
        json.dumps(summary, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )

    report_lines = [
        "# Audyt spójności danych produktów",
        "",
        f"- Produkty w `fabrics.ts`: **{summary['catalogue_products']}**",
        f"- Rekordy znalezione: **{summary['records_found']}**",
        f"- Rekordy brakujące: **{summary['records_missing']}**",
        f"- Konflikty liczników: **{summary['count_conflicts']}**",
        f"- Podejrzane parametry: **{summary['suspicious_parameters']}**",
        f"- Problemy tekstowe: **{summary['source_text_issues']}**",
        "",
        "## Status ogólny",
        "",
    ]
    for status, count in sorted(status_counts.items()):
        report_lines.append(f"- {status}: **{count}**")

    report_lines.extend(["", "## Spójność składu", ""])
    for status, count in sorted(composition_counts.items()):
        report_lines.append(f"- {status}: **{count}**")

    report_lines.extend(["", "## Spójność gramatury", ""])
    for status, count in sorted(weight_counts.items()):
        report_lines.append(f"- {status}: **{count}**")

    report_lines.extend(
        [
            "",
            "## Pliki",
            "",
            "- `products.csv` — jeden wiersz na produkt",
            "- `composition_conflicts.csv` — różnice składu",
            "- `weight_conflicts.csv` — różnice gramatury",
            "- `count_conflicts.csv` — rozbieżności liczników",
            "- `suspicious_parameters.csv` — wartości wymagające kontroli",
            "- `standards_audit.csv` — zestawienie norm",
            "- `source_text_issues.csv` — wykryte błędy tekstowe",
            "- `missing_records.csv` — brakujące rekordy",
            "- `summary.json` — podsumowanie maszynowe",
            "",
        ]
    )
    (out_dir / "report.md").write_text(
        "\n".join(report_lines),
        encoding="utf-8",
    )

    print(json.dumps(summary, ensure_ascii=False, indent=2))


def main() -> None:
    args = parse_args()
    root = args.root.resolve()
    out_dir = (
        args.out.resolve()
        if args.out is not None
        else root / "_audit" / "product-data-consistency"
    )
    audit(root, out_dir)


if __name__ == "__main__":
    main()