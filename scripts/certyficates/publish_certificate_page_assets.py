import argparse
import csv
import json
import shutil
from datetime import datetime
from pathlib import Path
from urllib.parse import quote


DOCUMENT_EXTENSIONS = {".pdf", ".doc", ".docx", ".xls", ".xlsx", ".zip", ".rar"}
IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"}


def load_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path: Path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        json.dumps(data, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )


def write_csv(path: Path, rows: list[dict], fields: list[str]):
    path.parent.mkdir(parents=True, exist_ok=True)

    with open(path, "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.DictWriter(f, fieldnames=fields, delimiter=";", extrasaction="ignore")
        writer.writeheader()
        writer.writerows(rows)


def clean_url_path(value: str) -> str:
    """
    Zamienia nazwę pliku na bezpieczny fragment URL.
    Zachowuje czytelność, ale koduje spacje i znaki specjalne.
    """
    return quote(value.replace("\\", "/"))


def public_url(public_base_url: str, subdir: str, filename: str) -> str:
    return f"{public_base_url.rstrip('/')}/{subdir.strip('/')}/{clean_url_path(filename)}"


def file_kind(path: Path, content_type: str = "", declared_type: str = "") -> str:
    ext = path.suffix.lower()
    ct = (content_type or "").lower()
    declared = (declared_type or "").lower()

    if declared == "document":
        return "document"

    if declared == "image":
        return "image"

    if ext in DOCUMENT_EXTENSIONS or "pdf" in ct:
        return "document"

    if ext in IMAGE_EXTENSIONS or ct.startswith("image/"):
        return "image"

    return "asset"


def destination_subdir(kind: str) -> str:
    if kind == "document":
        return "documents"
    if kind == "image":
        return "images"
    return "assets"


def ensure_unique_destination(dst_dir: Path, filename: str, source_path: Path) -> Path:
    """
    Gdyby nazwa się powtórzyła, nie nadpisuje innego pliku.
    Obecne pliki mają hash w nazwach, więc zwykle nie będzie konfliktów.
    """
    dst = dst_dir / filename

    if not dst.exists():
        return dst

    try:
        if dst.samefile(source_path):
            return dst
    except Exception:
        pass

    stem = Path(filename).stem
    suffix = Path(filename).suffix

    counter = 2
    while True:
        candidate = dst_dir / f"{stem}__copy{counter}{suffix}"
        if not candidate.exists():
            return candidate
        counter += 1


def copy_file_to_public(
    source_local_path: str,
    kind_hint: str,
    content_type: str,
    public_dir: Path,
    public_base_url: str,
    copied_by_source: dict,
):
    if not source_local_path:
        return None

    src = Path(source_local_path)

    if not src.exists():
        return {
            "ok": False,
            "source_local_path": source_local_path,
            "error": "SOURCE_FILE_NOT_FOUND",
        }

    source_key = str(src.resolve()).lower()

    if source_key in copied_by_source:
        return copied_by_source[source_key]

    kind = file_kind(src, content_type=content_type, declared_type=kind_hint)
    subdir = destination_subdir(kind)

    dst_dir = public_dir / subdir
    dst_dir.mkdir(parents=True, exist_ok=True)

    dst = ensure_unique_destination(dst_dir, src.name, src)

    if not dst.exists():
        shutil.copy2(src, dst)

    result = {
        "ok": True,
        "kind": kind,
        "source_local_path": str(src),
        "public_local_path": str(dst),
        "public_url": public_url(public_base_url, subdir, dst.name),
        "filename": dst.name,
        "subdir": subdir,
        "size_bytes": dst.stat().st_size,
    }

    copied_by_source[source_key] = result
    return result


def target_action_for_certificate(cert: dict) -> dict:
    target = cert.get("target", {})
    target_type = target.get("type", "")
    content_type = (target.get("content_type") or "").lower()
    url = target.get("url", "")

    is_pdf = "pdf" in content_type or url.lower().endswith(".pdf") or target_type == "document"

    if is_pdf:
        return {
            "primary_action": "open_new_tab",
            "secondary_action": "download",
            "display_mode_pl": "Karta certyfikatu z ikoną; przycisk otwiera PDF w nowej karcie; dodatkowo można dać przycisk Pobierz.",
            "button_label_pl": "Otwórz certyfikat",
            "download_label_pl": "Pobierz PDF",
            "html_target": "_blank",
            "rel": "noopener noreferrer",
        }

    return {
        "primary_action": "open_new_tab",
        "secondary_action": "optional_download",
        "display_mode_pl": "Karta certyfikatu z ikoną; przycisk pokazuje większą grafikę/certyfikat w nowej karcie albo w lightboxie.",
        "button_label_pl": "Zobacz certyfikat",
        "download_label_pl": "Pobierz grafikę",
        "html_target": "_blank",
        "rel": "noopener noreferrer",
    }


def build_public_certificates(manifest: dict, public_dir: Path, public_base_url: str):
    copied_by_source = {}
    public_certificates = []
    missing_files = []

    for cert in manifest.get("certificates", []):
        primary = cert.get("primary_image", {})
        target = cert.get("target", {})

        primary_copy = copy_file_to_public(
            source_local_path=primary.get("local_path", ""),
            kind_hint="image",
            content_type="",
            public_dir=public_dir,
            public_base_url=public_base_url,
            copied_by_source=copied_by_source,
        )

        target_copy = copy_file_to_public(
            source_local_path=target.get("local_path", ""),
            kind_hint=target.get("type", ""),
            content_type=target.get("content_type", ""),
            public_dir=public_dir,
            public_base_url=public_base_url,
            copied_by_source=copied_by_source,
        )

        if primary_copy and not primary_copy.get("ok"):
            missing_files.append(primary_copy)

        if target_copy and not target_copy.get("ok"):
            missing_files.append(target_copy)

        action = target_action_for_certificate(cert)

        label_pl = cert.get("label_pl") or ""
        label_en = cert.get("label_en") or ""

        public_certificates.append({
            "order": cert.get("order"),
            "section": cert.get("section", ""),
            "label_pl": label_pl,
            "label_en": label_en,
            "label_display": label_pl or label_en,
            "context_text": cert.get("context_text", ""),

            "card_image": {
                "source_url": primary.get("url", ""),
                "source_local_path": primary.get("local_path", ""),
                "public_local_path": primary_copy.get("public_local_path", "") if primary_copy and primary_copy.get("ok") else "",
                "public_url": primary_copy.get("public_url", "") if primary_copy and primary_copy.get("ok") else "",
                "alt": primary.get("alt", "") or label_en,
            },

            "target": {
                "type": target.get("type", ""),
                "source_url": target.get("url", ""),
                "source_local_path": target.get("local_path", ""),
                "public_local_path": target_copy.get("public_local_path", "") if target_copy and target_copy.get("ok") else "",
                "public_url": target_copy.get("public_url", "") if target_copy and target_copy.get("ok") else "",
                "content_type": target.get("content_type", ""),
                "size_bytes": target.get("size_bytes", ""),
                "sha1": target.get("sha1", ""),
            },

            "ui": action,
        })

    copied_files = list(copied_by_source.values())

    return public_certificates, copied_files, missing_files


def build_public_standards(manifest: dict):
    result = []

    for item in manifest.get("standards", []):
        category_pl = item.get("category_pl") or ""
        category_en = item.get("category_en") or ""
        test_name_pl = item.get("test_name_pl") or ""
        test_name_en = item.get("test_name_en") or ""

        result.append({
            "order": item.get("order"),
            "category_pl": category_pl,
            "category_en": category_en,
            "category_display": category_pl or category_en,
            "test_name_pl": test_name_pl,
            "test_name_en": test_name_en,
            "test_name_display": test_name_pl or test_name_en,
            "standard": item.get("standard", ""),
        })

    return result


def grouped_standards(standards: list[dict]) -> dict[str, list[dict]]:
    groups = {}

    for item in standards:
        key = item.get("category_display") or "Other"
        groups.setdefault(key, []).append(item)

    return groups


def write_roadmap_md(path: Path, public_manifest: dict):
    certificates = public_manifest["certificates"]
    standards = public_manifest["standards"]
    standards_groups = grouped_standards(standards)

    document_targets = [
        item for item in certificates
        if item["target"]["content_type"] == "application/pdf"
        or item["target"]["type"] == "document"
        or item["target"]["public_url"].lower().endswith(".pdf")
    ]

    image_targets = [
        item for item in certificates
        if item not in document_targets
    ]

    lines = []

    lines.append("# Mapa drogowa alternatywnej strony certyfikatów Ariteks")
    lines.append("")
    lines.append(f"Wygenerowano: {public_manifest['generated_at']}")
    lines.append("")
    lines.append("## Cel dokumentu")
    lines.append("")
    lines.append(
        "Ten dokument opisuje, jak odtworzyć alternatywną stronę certyfikatów "
        "na podstawie pobranej treści, grafik i dokumentów. "
        "Ma być jasne, co wyświetlać na stronie, co otwierać w nowej karcie "
        "i co udostępniać do pobrania."
    )
    lines.append("")

    lines.append("## Źródła danych")
    lines.append("")
    lines.append(f"- Źródłowa strona: {public_manifest['source']['base_url']}")
    lines.append(f"- Publiczny katalog strony: `{public_manifest['public']['public_dir']}`")
    lines.append(f"- Publiczny URL bazowy: `{public_manifest['public']['public_base_url']}`")
    lines.append(f"- Manifest publiczny JSON: `{public_manifest['public']['manifest_public_url']}`")
    lines.append("")

    lines.append("## Podsumowanie")
    lines.append("")
    lines.append(f"- Liczba pozycji certyfikatów / plików: **{len(certificates)}**")
    lines.append(f"- Liczba norm i testów: **{len(standards)}**")
    lines.append(f"- Liczba skopiowanych plików publicznych: **{len(public_manifest['copied_files'])}**")
    lines.append(f"- Liczba brakujących plików: **{len(public_manifest['missing_files'])}**")
    lines.append("")

    lines.append("## Zalecana struktura nowej strony")
    lines.append("")
    lines.append("### 1. Nagłówek strony")
    lines.append("")
    lines.append("- Tytuł PL: `Certyfikaty i testy`")
    lines.append("- Podtytuł: krótka informacja, że dokumenty potwierdzają zgodność materiałów, procesów i wybranych właściwości technicznych.")
    lines.append("- Nie trzeba odtwarzać starego układu tabelkowego; lepiej użyć czytelnej siatki kart.")
    lines.append("")

    lines.append("### 2. Sekcja certyfikatów")
    lines.append("")
    lines.append("Każdy certyfikat powinien być kartą:")
    lines.append("")
    lines.append("- ikona/grafika certyfikatu z `card_image.public_url`,")
    lines.append("- nazwa certyfikatu z `label_display`,")
    lines.append("- przycisk główny według `ui.button_label_pl`,")
    lines.append("- opcjonalny przycisk pobierania według `ui.download_label_pl`,")
    lines.append("- kliknięcie powinno używać `target.public_url`.")
    lines.append("")

    lines.append("### 3. Zachowanie kliknięć")
    lines.append("")
    lines.append("| Typ celu | Co robić | Dlaczego |")
    lines.append("|---|---|---|")
    lines.append("| PDF / dokument | Otwierać w nowej karcie (`target=\"_blank\"`) i opcjonalnie dać `Pobierz PDF` | Użytkownik może obejrzeć certyfikat bez opuszczania strony |")
    lines.append("| JPG/PNG / duża grafika | Otwierać w nowej karcie albo lightboxie | To są certyfikaty lub potwierdzenia w formie obrazu |")
    lines.append("| Ikona karty | Tylko wyświetlać na karcie | Ikona nie musi być osobno pobierana |")
    lines.append("")

    lines.append("### 4. Sekcja norm i testów")
    lines.append("")
    lines.append("Normy nie są plikami do pobrania. Powinny być wyświetlone jako tabele pogrupowane według kategorii:")
    lines.append("")
    for category, items in standards_groups.items():
        lines.append(f"- **{category}** — {len(items)} pozycji")
    lines.append("")

    lines.append("---")
    lines.append("")
    lines.append("## Lista certyfikatów — co wyświetlać i co otwierać")
    lines.append("")
    lines.append("| # | Nazwa na stronie | Ikona/karta | Cel kliknięcia | Akcja |")
    lines.append("|---:|---|---|---|---|")

    for item in certificates:
        label = item["label_display"].replace("|", "\\|")
        card = item["card_image"]["public_url"]
        target = item["target"]["public_url"]
        action = item["ui"]["primary_action"]

        lines.append(
            f"| {item['order']} | {label} | `{card}` | `{target}` | `{action}` |"
        )

    lines.append("")
    lines.append("---")
    lines.append("")
    lines.append("## Dokumenty PDF / pliki do otwierania w nowej karcie")
    lines.append("")

    for item in document_targets:
        lines.append(f"### {item['order']}. {item['label_display']}")
        lines.append("")
        lines.append(f"- Wyświetlana ikona: `{item['card_image']['public_url']}`")
        lines.append(f"- Dokument: `{item['target']['public_url']}`")
        lines.append("- Akcja główna: otwórz w nowej karcie")
        lines.append("- Akcja dodatkowa: pobierz PDF")
        lines.append("")

    lines.append("---")
    lines.append("")
    lines.append("## Certyfikaty / potwierdzenia w formie obrazu")
    lines.append("")

    for item in image_targets:
        lines.append(f"### {item['order']}. {item['label_display']}")
        lines.append("")
        lines.append(f"- Wyświetlana ikona: `{item['card_image']['public_url']}`")
        lines.append(f"- Obraz docelowy: `{item['target']['public_url']}`")
        lines.append("- Akcja główna: pokaż w nowej karcie albo lightboxie")
        lines.append("- Akcja dodatkowa: opcjonalnie pobierz grafikę")
        lines.append("")

    lines.append("---")
    lines.append("")
    lines.append("## Normy i testy do wyświetlenia na stronie")
    lines.append("")

    for category, items in standards_groups.items():
        lines.append(f"### {category}")
        lines.append("")
        lines.append("| Badanie / właściwość | Norma |")
        lines.append("|---|---|")

        for item in items:
            test_name = item["test_name_display"].replace("|", "\\|")
            standard = item["standard"].replace("|", "\\|")
            lines.append(f"| {test_name} | {standard} |")

        lines.append("")

    lines.append("---")
    lines.append("")
    lines.append("## Minimalna implementacja w nowej stronie")
    lines.append("")
    lines.append("1. Wczytać JSON:")
    lines.append("")
    lines.append("```ts")
    lines.append("const data = await fetch('/ariteks/certificates/data/certificate-page-public-manifest.json').then(r => r.json())")
    lines.append("```")
    lines.append("")
    lines.append("2. Zbudować grid z `data.certificates`.")
    lines.append("")
    lines.append("3. W karcie użyć:")
    lines.append("")
    lines.append("```tsx")
    lines.append("<img src={item.card_image.public_url} alt={item.card_image.alt} />")
    lines.append("<h3>{item.label_display}</h3>")
    lines.append("<a href={item.target.public_url} target=\"_blank\" rel=\"noopener noreferrer\">")
    lines.append("  {item.ui.button_label_pl}")
    lines.append("</a>")
    lines.append("```")
    lines.append("")
    lines.append("4. Zbudować tabele z `data.standards`, grupując po `category_display`.")
    lines.append("")
    lines.append("5. Nie linkować ikon kart jako pobierania. Pobieranie dotyczy tylko `target.public_url`.")
    lines.append("")

    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text("\n".join(lines), encoding="utf-8")


def main():
    parser = argparse.ArgumentParser(
        description="Publikuje certyfikaty Ariteks do public i generuje mapę drogową alternatywnej strony."
    )

    parser.add_argument(
        "--project-root",
        default=r"D:\Ariteks\ariteks_www",
        help="Katalog główny projektu Next.js / strony.",
    )

    parser.add_argument(
        "--scraped-dir",
        default=r"D:\Ariteks\ariteks_www\_scraped\certificates_raw",
        help="Folder z wynikami scrapera i finalnym manifestem.",
    )

    parser.add_argument(
        "--manifest",
        default="",
        help="Opcjonalna pełna ścieżka do certificate_page_manifest.json.",
    )

    parser.add_argument(
        "--public-subdir",
        default=r"ariteks\certificates",
        help="Podfolder w public, np. ariteks\\certificates.",
    )

    parser.add_argument(
        "--public-base-url",
        default="/ariteks/certificates",
        help="URL bazowy widoczny z przeglądarki.",
    )

    parser.add_argument(
        "--clean",
        action="store_true",
        help="Czyści docelowy folder public przed kopiowaniem.",
    )

    args = parser.parse_args()

    project_root = Path(args.project_root)
    scraped_dir = Path(args.scraped_dir)

    manifest_path = Path(args.manifest) if args.manifest else (
        scraped_dir / "_final_manifest" / "certificate_page_manifest.json"
    )

    if not manifest_path.exists():
        raise FileNotFoundError(f"Nie znaleziono manifestu: {manifest_path}")

    public_dir = project_root / "public" / args.public_subdir

    if args.clean and public_dir.exists():
        shutil.rmtree(public_dir)

    public_dir.mkdir(parents=True, exist_ok=True)

    manifest = load_json(manifest_path)

    public_certificates, copied_files, missing_files = build_public_certificates(
        manifest=manifest,
        public_dir=public_dir,
        public_base_url=args.public_base_url,
    )

    public_standards = build_public_standards(manifest)

    data_dir = public_dir / "data"
    docs_dir = public_dir / "docs"

    public_manifest_url = public_url(
        args.public_base_url,
        "data",
        "certificate-page-public-manifest.json",
    )

    public_manifest = {
        "generated_at": datetime.now().isoformat(timespec="seconds"),
        "source": manifest.get("source", {}),
        "title_pl": manifest.get("title_pl") or "Certyfikaty i testy",
        "title_en": manifest.get("title_en") or "Certificates and Tests",

        "public": {
            "project_root": str(project_root),
            "public_dir": str(public_dir),
            "public_base_url": args.public_base_url,
            "manifest_public_url": public_manifest_url,
        },

        "certificates_count": len(public_certificates),
        "standards_count": len(public_standards),

        "certificates": public_certificates,
        "standards": public_standards,
        "copied_files": copied_files,
        "missing_files": missing_files,
    }

    write_json(data_dir / "certificate-page-public-manifest.json", public_manifest)
    write_json(data_dir / "certificates.json", public_certificates)
    write_json(data_dir / "standards.json", public_standards)
    write_json(data_dir / "copied-files.json", copied_files)
    write_json(data_dir / "missing-files.json", missing_files)

    certificate_rows = []

    for item in public_certificates:
        certificate_rows.append({
            "order": item["order"],
            "label_display": item["label_display"],
            "label_en": item["label_en"],
            "label_pl": item["label_pl"],
            "card_image_public_url": item["card_image"]["public_url"],
            "target_public_url": item["target"]["public_url"],
            "target_type": item["target"]["type"],
            "target_content_type": item["target"]["content_type"],
            "primary_action": item["ui"]["primary_action"],
            "secondary_action": item["ui"]["secondary_action"],
            "button_label_pl": item["ui"]["button_label_pl"],
            "download_label_pl": item["ui"]["download_label_pl"],
        })

    write_csv(
        data_dir / "certificates-public-map.csv",
        certificate_rows,
        [
            "order",
            "label_display",
            "label_en",
            "label_pl",
            "card_image_public_url",
            "target_public_url",
            "target_type",
            "target_content_type",
            "primary_action",
            "secondary_action",
            "button_label_pl",
            "download_label_pl",
        ],
    )

    standard_rows = []

    for item in public_standards:
        standard_rows.append({
            "order": item["order"],
            "category_display": item["category_display"],
            "category_en": item["category_en"],
            "category_pl": item["category_pl"],
            "test_name_display": item["test_name_display"],
            "test_name_en": item["test_name_en"],
            "test_name_pl": item["test_name_pl"],
            "standard": item["standard"],
        })

    write_csv(
        data_dir / "standards-public-map.csv",
        standard_rows,
        [
            "order",
            "category_display",
            "category_en",
            "category_pl",
            "test_name_display",
            "test_name_en",
            "test_name_pl",
            "standard",
        ],
    )

    roadmap_path = docs_dir / "certificate-page-roadmap.md"
    write_roadmap_md(roadmap_path, public_manifest)

    # Kopia roadmapy również w data, żeby łatwo ją podejrzeć przez URL.
    shutil.copy2(
        roadmap_path,
        data_dir / "certificate-page-roadmap.md",
    )

    print("")
    print("GOTOWE — publikacja certyfikatów do public zakończona")
    print("")
    print(f"Manifest źródłowy: {manifest_path}")
    print(f"Folder public:      {public_dir}")
    print("")
    print(f"Certyfikaty:        {len(public_certificates)}")
    print(f"Normy/testy:        {len(public_standards)}")
    print(f"Skopiowane pliki:   {len(copied_files)}")
    print(f"Brakujące pliki:    {len(missing_files)}")
    print("")
    print("Najważniejsze pliki wynikowe:")
    print(public_dir / "data" / "certificate-page-public-manifest.json")
    print(public_dir / "data" / "certificates.json")
    print(public_dir / "data" / "standards.json")
    print(public_dir / "data" / "certificates-public-map.csv")
    print(public_dir / "data" / "standards-public-map.csv")
    print(public_dir / "docs" / "certificate-page-roadmap.md")
    print("")
    print("URL-e w aplikacji:")
    print(args.public_base_url + "/data/certificate-page-public-manifest.json")
    print(args.public_base_url + "/data/certificate-page-roadmap.md")
    print("")


if __name__ == "__main__":
    main()