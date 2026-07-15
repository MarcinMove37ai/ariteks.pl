#!/usr/bin/env python3
"""
Pełny audyt produkcyjny serwisu Ariteks — wersja 2.0.

Zakres:
- robots.txt i rekurencyjne mapy witryny,
- statusy HTTP, przekierowania i czasy odpowiedzi,
- canonical, hreflang i wzajemność wersji językowych,
- title, description, H1, lang i robots meta,
- poprawność oraz typy JSON-LD,
- wymagane schematy dla katalogów, rodzin, zastosowań, produktów,
  strony About i strony Certificates,
- wykrywanie Product zagnieżdżonego w ItemList,
- duplikaty metadanych,
- niedziałające linki wewnętrzne, obrazy, skrypty, CSS i dokumenty,
- strony osierocone względem linkowania wewnętrznego,
- błędne kodowanie/mojibake w widocznym tekście,
- izolację locale bez przenoszenia NEXT_LOCALE między żądaniami,
- zgodność adresów sitemap z canonicalami.

Wyniki:
  audit-output/<timestamp>/
    summary.json
    report.md
    pages.csv
    issues.csv
    references.csv

Wymagania:
  python -m pip install requests beautifulsoup4
"""

from __future__ import annotations

import argparse
import csv
import gzip
import json
import re
import sys
import threading
import time
import xml.etree.ElementTree as ET
from collections import Counter, defaultdict
from concurrent.futures import ThreadPoolExecutor, as_completed
from dataclasses import asdict, dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Iterable
from urllib.parse import parse_qsl, urlencode, urljoin, urlsplit, urlunsplit
from urllib.robotparser import RobotFileParser

try:
    import requests
    from bs4 import BeautifulSoup
    from requests.adapters import HTTPAdapter
    from urllib3.util.retry import Retry
except ImportError as exc:
    print(
        "Brakuje zależności. Uruchom:\n"
        "  python -m pip install requests beautifulsoup4",
        file=sys.stderr,
    )
    raise SystemExit(2) from exc


DEFAULT_BASE_URL = "https://ariteks.pl"
DEFAULT_SITEMAP_URL = "https://ariteks.pl/sitemap.xml"
AUDIT_VERSION = "2.0"
USER_AGENT = "AriteksProductionAudit/2.0 (+https://ariteks.pl)"
HTML_TYPES = ("text/html", "application/xhtml+xml")
RESOURCE_EXTENSIONS = {
    ".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".ico",
    ".css", ".js", ".mjs", ".pdf", ".zip", ".xml", ".json",
    ".woff", ".woff2", ".ttf", ".otf", ".mp4", ".webm",
}
TRACKING_QUERY_KEYS = {
    "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content",
    "gclid", "fbclid", "msclkid",
}
SEVERITY_ORDER = {"CRITICAL": 0, "HIGH": 1, "MEDIUM": 2, "LOW": 3, "INFO": 4}

MOJIBAKE_PATTERNS = (
    "â€", "â†", "â€“", "â€”", "â€š", "â€ž",
    "Â·", "Â©", "Â®", "Â°", "Â²",
    "Ä…", "Ä‡", "Ä™", "Ä…",
    "Å‚", "Å„", "Å›", "Åº", "Å¼",
    "Ăł", "Ă“", "�",
)

SCRIPT_LIKE_TAGS = {"script", "style", "noscript", "template"}


@dataclass(slots=True)
class Issue:
    severity: str
    code: str
    url: str
    details: str
    related_url: str = ""


@dataclass(slots=True)
class Reference:
    source_url: str
    target_url: str
    kind: str
    status_code: int | None = None
    final_url: str = ""
    content_type: str = ""
    error: str = ""


@dataclass(slots=True)
class PageResult:
    url: str
    status_code: int | None = None
    final_url: str = ""
    redirect_count: int = 0
    elapsed_ms: int | None = None
    content_type: str = ""
    content_length: int | None = None
    declared_charset: str = ""
    meta_charset: str = ""
    error: str = ""
    title: str = ""
    description: str = ""
    canonical: str = ""
    html_lang: str = ""
    h1_count: int = 0
    h1_text: str = ""
    robots_meta: str = ""
    x_robots_tag: str = ""
    og_url: str = ""
    body_text_chars: int = 0
    hreflang: dict[str, str] = field(default_factory=dict)
    jsonld_types: list[str] = field(default_factory=list)
    jsonld_errors: list[str] = field(default_factory=list)
    mojibake_hits: list[str] = field(default_factory=list)
    nested_product_in_itemlist: int = 0
    internal_page_links: list[str] = field(default_factory=list)
    internal_resources: list[str] = field(default_factory=list)
    robots_allowed: bool | None = None


_thread_local = threading.local()


def session() -> requests.Session:
    current = getattr(_thread_local, "session", None)
    if current is None:
        retry = Retry(
            total=3,
            connect=3,
            read=3,
            status=3,
            backoff_factor=0.6,
            status_forcelist=(429, 500, 502, 503, 504),
            allowed_methods=frozenset({"GET"}),
            raise_on_status=False,
        )
        adapter = HTTPAdapter(
            max_retries=retry, pool_connections=50, pool_maxsize=50
        )
        current = requests.Session()
        current.headers.update({
            "User-Agent": USER_AGENT,
        })
        current.mount("https://", adapter)
        current.mount("http://", adapter)
        _thread_local.session = current
    return current


def request_language(url: str) -> str:
    path = urlsplit(url).path
    return "en" if path == "/en" or path.startswith("/en/") else "pl"


def clean_get(
    url: str,
    *,
    timeout: float,
    allow_redirects: bool = True,
    stream: bool = False,
    accept: str | None = None,
) -> requests.Response:
    """GET bez dziedziczenia cookies między kolejnymi adresami.

    next-intl może ustawiać NEXT_LOCALE. Audyt każdej strony musi zaczynać
    się jako niezależna wizyta, inaczej wersja EN zanieczyszcza test PL.
    """
    current = session()
    current.cookies.clear()
    language = request_language(url)
    headers = {
        "Cookie": "",
        "Accept-Language": (
            "en-US,en;q=0.9,pl;q=0.6"
            if language == "en"
            else "pl-PL,pl;q=0.9,en;q=0.6"
        ),
        "Accept": accept or (
            "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
        ),
    }
    try:
        return current.get(
            url,
            timeout=timeout,
            allow_redirects=allow_redirects,
            stream=stream,
            headers=headers,
        )
    finally:
        # Czyścimy także cookies ustawione podczas przekierowań tej wizyty.
        current.cookies.clear()


def normalize_url(url: str, *, keep_query: bool = True) -> str:
    parts = urlsplit(url.strip())
    scheme = parts.scheme.lower()
    host = (parts.hostname or "").lower()
    port = parts.port
    if (scheme == "https" and port == 443) or (scheme == "http" and port == 80):
        port = None
    netloc = host if port is None else f"{host}:{port}"

    path = re.sub(r"/{2,}", "/", parts.path or "/")
    if path != "/" and path.endswith("/"):
        path = path[:-1]

    query = parts.query if keep_query else ""
    if query:
        pairs = [
            (key, value)
            for key, value in parse_qsl(query, keep_blank_values=True)
            if key.lower() not in TRACKING_QUERY_KEYS
        ]
        query = urlencode(sorted(pairs))

    return urlunsplit((scheme, netloc, path, query, ""))


def same_document(a: str, b: str) -> bool:
    return normalize_url(a) == normalize_url(b)


def is_internal(url: str, allowed_hosts: set[str]) -> bool:
    return (urlsplit(url).hostname or "").lower() in allowed_hosts


def classify_reference(url: str, tag: str, attr: str) -> str:
    path = urlsplit(url).path.lower()
    suffix = Path(path).suffix
    if tag == "a" and suffix not in RESOURCE_EXTENSIONS:
        return "page"
    if suffix == ".pdf":
        return "document"
    if tag in {"img", "source", "video", "audio"}:
        return "media"
    if tag == "script":
        return "script"
    if tag == "link":
        return "stylesheet-or-link"
    if tag == "iframe":
        return "iframe"
    return "resource"


def resolve_reference(raw: str, source_url: str) -> str | None:
    raw = raw.strip()
    if not raw or raw.startswith(("#", "mailto:", "tel:", "javascript:", "data:", "blob:")):
        return None
    return normalize_url(urljoin(source_url, raw))


def extract_srcset(value: str) -> list[str]:
    result = []
    for item in value.split(","):
        candidate = item.strip().split()[0] if item.strip() else ""
        if candidate:
            result.append(candidate)
    return result



def parse_declared_charset(content_type_header: str) -> str:
    match = re.search(r"charset\s*=\s*[\"']?([^;\s\"']+)", content_type_header, re.I)
    return match.group(1).strip().lower() if match else ""


def extract_meta_charset(soup: BeautifulSoup) -> str:
    direct = soup.find("meta", attrs={"charset": True})
    if direct:
        return str(direct.get("charset", "")).strip().lower()

    http_equiv = soup.find(
        "meta",
        attrs={"http-equiv": lambda value: value and str(value).lower() == "content-type"},
    )
    if http_equiv:
        return parse_declared_charset(str(http_equiv.get("content", "")))
    return ""


def visible_text(soup: BeautifulSoup) -> str:
    parts: list[str] = []
    for value in soup.stripped_strings:
        parent = getattr(value, "parent", None)
        if parent is not None and getattr(parent, "name", None) in SCRIPT_LIKE_TAGS:
            continue
        parts.append(str(value))
    return " ".join(parts)


def detect_mojibake(*values: str) -> list[str]:
    combined = " ".join(value for value in values if value)
    return sorted({pattern for pattern in MOJIBAKE_PATTERNS if pattern in combined})

def fetch_sitemap(url: str, timeout: float) -> bytes:
    response = clean_get(url, timeout=timeout)
    response.raise_for_status()
    payload = response.content
    if url.lower().endswith(".gz") or payload[:2] == b"\x1f\x8b":
        payload = gzip.decompress(payload)
    return payload


def local_name(tag: str) -> str:
    return tag.rsplit("}", 1)[-1]


def parse_sitemaps(root_url: str, timeout: float) -> tuple[list[str], dict[str, dict[str, str]], list[Issue]]:
    pending = [normalize_url(root_url)]
    visited: set[str] = set()
    page_urls: set[str] = set()
    sitemap_hreflang: dict[str, dict[str, str]] = {}
    issues: list[Issue] = []

    while pending:
        sitemap_url = pending.pop()
        if sitemap_url in visited:
            continue
        visited.add(sitemap_url)

        try:
            payload = fetch_sitemap(sitemap_url, timeout)
            root = ET.fromstring(payload)
        except Exception as exc:
            issues.append(Issue(
                "CRITICAL", "SITEMAP_FETCH_OR_PARSE_FAILED", sitemap_url, str(exc)
            ))
            continue

        root_type = local_name(root.tag)
        if root_type == "sitemapindex":
            for element in root:
                if local_name(element.tag) != "sitemap":
                    continue
                loc = next(
                    (child.text for child in element if local_name(child.tag) == "loc"),
                    None,
                )
                if loc:
                    pending.append(normalize_url(loc))
            continue

        if root_type != "urlset":
            issues.append(Issue(
                "HIGH", "UNKNOWN_SITEMAP_ROOT", sitemap_url,
                f"Nieznany element główny XML: {root_type}"
            ))
            continue

        for url_node in root:
            if local_name(url_node.tag) != "url":
                continue
            loc = next(
                (child.text for child in url_node if local_name(child.tag) == "loc"),
                None,
            )
            if not loc:
                continue
            page_url = normalize_url(loc)
            page_urls.add(page_url)

            alternates: dict[str, str] = {}
            for child in url_node:
                if local_name(child.tag) != "link":
                    continue
                hreflang = child.attrib.get("hreflang")
                href = child.attrib.get("href")
                rel = child.attrib.get("rel")
                if hreflang and href and rel == "alternate":
                    alternates[hreflang.lower()] = normalize_url(href)
            if alternates:
                sitemap_hreflang[page_url] = alternates

    if not page_urls:
        issues.append(Issue(
            "CRITICAL", "SITEMAP_CONTAINS_NO_URLS", root_url,
            "Nie znaleziono żadnych adresów stron."
        ))

    return sorted(page_urls), sitemap_hreflang, issues


def build_robot_parser(base_url: str, timeout: float) -> tuple[RobotFileParser | None, list[Issue]]:
    robots_url = urljoin(base_url.rstrip("/") + "/", "robots.txt")
    issues: list[Issue] = []
    try:
        response = clean_get(robots_url, timeout=timeout)
        if response.status_code != 200:
            issues.append(Issue(
                "HIGH", "ROBOTS_HTTP_STATUS", robots_url,
                f"Status HTTP {response.status_code}"
            ))
            return None, issues
        parser = RobotFileParser()
        parser.set_url(robots_url)
        parser.parse(response.text.splitlines())
        return parser, issues
    except Exception as exc:
        issues.append(Issue("HIGH", "ROBOTS_FETCH_FAILED", robots_url, str(exc)))
        return None, issues


def meta_content(soup: BeautifulSoup, *, name: str | None = None, prop: str | None = None) -> str:
    selector: dict[str, str] = {}
    if name:
        selector["name"] = name
    if prop:
        selector["property"] = prop
    element = soup.find("meta", attrs=selector)
    return str(element.get("content", "")).strip() if element else ""


def link_href(soup: BeautifulSoup, rel: str) -> str:
    element = soup.find("link", rel=lambda values: values and rel in values)
    return str(element.get("href", "")).strip() if element else ""


def iter_jsonld_nodes(value: Any) -> Iterable[dict[str, Any]]:
    if isinstance(value, dict):
        yield value
        graph = value.get("@graph")
        if isinstance(graph, list):
            for item in graph:
                yield from iter_jsonld_nodes(item)
    elif isinstance(value, list):
        for item in value:
            yield from iter_jsonld_nodes(item)


def node_types(node: dict[str, Any]) -> list[str]:
    value = node.get("@type")
    if isinstance(value, str):
        return [value]
    if isinstance(value, list):
        return [str(item) for item in value]
    return []


def count_nested_product_in_itemlist(value: Any, inside_itemlist: bool = False) -> int:
    count = 0
    if isinstance(value, dict):
        types = set(node_types(value))
        current_inside = inside_itemlist or "ItemList" in types
        if inside_itemlist and "Product" in types:
            count += 1
        for child in value.values():
            count += count_nested_product_in_itemlist(child, current_inside)
    elif isinstance(value, list):
        for child in value:
            count += count_nested_product_in_itemlist(child, inside_itemlist)
    return count


def audit_page(
    url: str,
    *,
    timeout: float,
    allowed_hosts: set[str],
    robot_parser: RobotFileParser | None,
) -> PageResult:
    result = PageResult(url=url)
    try:
        started = time.perf_counter()
        response = clean_get(url, timeout=timeout, allow_redirects=True)
        result.elapsed_ms = round((time.perf_counter() - started) * 1000)
        result.status_code = response.status_code
        result.final_url = normalize_url(response.url)
        result.redirect_count = len(response.history)
        content_type_header = response.headers.get("Content-Type", "")
        result.content_type = content_type_header.split(";")[0].strip().lower()
        result.declared_charset = parse_declared_charset(content_type_header)
        result.content_length = len(response.content)
        result.x_robots_tag = response.headers.get("X-Robots-Tag", "").strip()
        if robot_parser is not None:
            result.robots_allowed = robot_parser.can_fetch(USER_AGENT, url)

        if result.status_code != 200 or not any(
            result.content_type.startswith(item) for item in HTML_TYPES
        ):
            return result

        # HTML produkcyjny jest UTF-8. Respektujemy deklarację nagłówka,
        # a przy jej braku wymuszamy UTF-8 zamiast domyślnego ISO-8859-1 requests.
        if not result.declared_charset:
            response.encoding = "utf-8"

        soup = BeautifulSoup(response.text, "html.parser")
        result.meta_charset = extract_meta_charset(soup)

        result.title = soup.title.get_text(" ", strip=True) if soup.title else ""
        result.description = meta_content(soup, name="description")
        result.robots_meta = meta_content(soup, name="robots")
        result.og_url = meta_content(soup, prop="og:url")
        result.html_lang = str(soup.html.get("lang", "")).strip() if soup.html else ""

        canonical_raw = link_href(soup, "canonical")
        result.canonical = (
            normalize_url(urljoin(result.final_url or url, canonical_raw))
            if canonical_raw else ""
        )

        h1_elements = soup.find_all("h1")
        result.h1_count = len(h1_elements)
        result.h1_text = " | ".join(
            element.get_text(" ", strip=True) for element in h1_elements
        )[:500]

        page_visible_text = visible_text(soup)
        result.body_text_chars = len(page_visible_text)
        result.mojibake_hits = detect_mojibake(
            result.title,
            result.description,
            result.h1_text,
            page_visible_text,
        )

        for element in soup.find_all("link"):
            rel_values = [str(item).lower() for item in (element.get("rel") or [])]
            hreflang = str(element.get("hreflang", "")).strip().lower()
            href = str(element.get("href", "")).strip()
            if "alternate" in rel_values and hreflang and href:
                result.hreflang[hreflang] = normalize_url(
                    urljoin(result.final_url or url, href)
                )

        jsonld_types: list[str] = []
        for index, script in enumerate(
            soup.find_all("script", attrs={"type": "application/ld+json"}),
            start=1,
        ):
            raw = script.string if script.string is not None else script.get_text()
            if not raw or not raw.strip():
                result.jsonld_errors.append(f"Skrypt {index}: pusty")
                continue
            try:
                data = json.loads(raw)
            except Exception as exc:
                result.jsonld_errors.append(f"Skrypt {index}: {exc}")
                continue

            result.nested_product_in_itemlist += count_nested_product_in_itemlist(data)
            for node in iter_jsonld_nodes(data):
                jsonld_types.extend(node_types(node))

        result.jsonld_types = sorted(set(jsonld_types))

        page_links: set[str] = set()
        resources: set[str] = set()

        attribute_map = {
            "a": ("href",),
            "img": ("src", "srcset"),
            "script": ("src",),
            "link": ("href",),
            "source": ("src", "srcset"),
            "video": ("src", "poster"),
            "audio": ("src",),
            "iframe": ("src",),
        }

        for tag_name, attributes in attribute_map.items():
            for element in soup.find_all(tag_name):
                for attr in attributes:
                    raw_value = element.get(attr)
                    if not raw_value:
                        continue
                    raw_values = (
                        extract_srcset(str(raw_value))
                        if attr == "srcset"
                        else [str(raw_value)]
                    )
                    for raw in raw_values:
                        resolved = resolve_reference(raw, result.final_url or url)
                        if not resolved or not is_internal(resolved, allowed_hosts):
                            continue
                        kind = classify_reference(resolved, tag_name, attr)
                        if kind == "page":
                            page_links.add(resolved)
                        else:
                            resources.add(resolved)

        result.internal_page_links = sorted(page_links)
        result.internal_resources = sorted(resources)
        return result

    except Exception as exc:
        result.error = str(exc)
        return result


def add_issue(
    issues: list[Issue],
    severity: str,
    code: str,
    url: str,
    details: str,
    related_url: str = "",
) -> None:
    issues.append(Issue(severity, code, url, details, related_url))


def expected_language(url: str) -> str:
    return request_language(url)


def path_segments(url: str) -> list[str]:
    return [segment for segment in urlsplit(url).path.split("/") if segment]


def expected_schema_types(url: str) -> set[str]:
    segments = path_segments(url)
    if segments and segments[0] == "en":
        segments = segments[1:]

    if segments == ["about"]:
        return {"AboutPage", "BreadcrumbList"}

    if segments == ["certificates"]:
        return {"CollectionPage", "BreadcrumbList", "ItemList"}

    if segments == ["fabrics"]:
        return {"CollectionPage", "ItemList"}

    if len(segments) == 2 and segments[0] == "fabrics":
        return {"CollectionPage", "ItemList", "BreadcrumbList"}

    if len(segments) == 3 and segments[0] == "fabrics":
        return {"Product", "BreadcrumbList"}

    if len(segments) == 2 and segments[0] == "applications":
        return {"CollectionPage", "ItemList", "BreadcrumbList"}

    return set()


def analyze_pages(
    pages: list[PageResult],
    sitemap_urls: set[str],
    sitemap_hreflang: dict[str, dict[str, str]],
    base_url: str,
) -> list[Issue]:
    issues: list[Issue] = []
    by_url = {normalize_url(page.url): page for page in pages}
    by_canonical: defaultdict[str, list[str]] = defaultdict(list)
    by_title: defaultdict[tuple[str, str], list[str]] = defaultdict(list)
    by_description: defaultdict[tuple[str, str], list[str]] = defaultdict(list)

    for page in pages:
        url = normalize_url(page.url)

        if page.error:
            add_issue(issues, "CRITICAL", "PAGE_FETCH_FAILED", url, page.error)
            continue

        if page.status_code != 200:
            add_issue(
                issues,
                "CRITICAL" if (page.status_code or 0) >= 500 else "HIGH",
                "PAGE_HTTP_STATUS",
                url,
                f"Status HTTP {page.status_code}",
                page.final_url,
            )
            continue

        if page.redirect_count:
            add_issue(
                issues, "MEDIUM", "SITEMAP_URL_REDIRECTS", url,
                f"Adres z sitemap wykonuje {page.redirect_count} przekierowanie(a).",
                page.final_url,
            )

        if page.content_type not in HTML_TYPES:
            add_issue(
                issues, "HIGH", "SITEMAP_NON_HTML", url,
                f"Content-Type: {page.content_type}"
            )
            continue

        if page.elapsed_ms is not None and page.elapsed_ms > 3000:
            add_issue(
                issues, "MEDIUM", "SLOW_RESPONSE", url,
                f"Czas odpowiedzi: {page.elapsed_ms} ms"
            )
        elif page.elapsed_ms is not None and page.elapsed_ms > 1500:
            add_issue(
                issues, "LOW", "ELEVATED_RESPONSE_TIME", url,
                f"Czas odpowiedzi: {page.elapsed_ms} ms"
            )

        if page.robots_allowed is False:
            add_issue(
                issues, "CRITICAL", "BLOCKED_BY_ROBOTS_TXT", url,
                "Adres z sitemap jest blokowany przez robots.txt."
            )

        combined_robots = f"{page.robots_meta} {page.x_robots_tag}".lower()
        if "noindex" in combined_robots:
            add_issue(
                issues, "CRITICAL", "NOINDEX_IN_SITEMAP", url,
                f"Dyrektywy: {combined_robots.strip()}"
            )

        if not page.title:
            add_issue(issues, "HIGH", "MISSING_TITLE", url, "Brak elementu <title>.")
        else:
            by_title[(expected_language(url), page.title.casefold())].append(url)
            if len(page.title) < 10:
                add_issue(
                    issues, "INFO", "TITLE_TOO_SHORT", url,
                    f"{len(page.title)} znaków: {page.title}"
                )
            elif len(page.title) > 65:
                add_issue(
                    issues, "INFO", "TITLE_TOO_LONG", url,
                    f"{len(page.title)} znaków: {page.title}"
                )

        if not page.description:
            add_issue(
                issues, "MEDIUM", "MISSING_META_DESCRIPTION", url,
                "Brak meta description."
            )
        else:
            by_description[(expected_language(url), page.description.casefold())].append(url)
            if len(page.description) < 50:
                add_issue(
                    issues, "INFO", "DESCRIPTION_TOO_SHORT", url,
                    f"{len(page.description)} znaków."
                )
            elif len(page.description) > 180:
                add_issue(
                    issues, "INFO", "DESCRIPTION_TOO_LONG", url,
                    f"{len(page.description)} znaków."
                )

        if not page.canonical:
            add_issue(issues, "CRITICAL", "MISSING_CANONICAL", url, "Brak canonical.")
        else:
            by_canonical[page.canonical].append(url)
            if not same_document(page.canonical, url):
                add_issue(
                    issues, "HIGH", "CANONICAL_NOT_SELF", url,
                    "Canonical nie wskazuje adresu z sitemap.",
                    page.canonical,
                )
            if page.canonical not in sitemap_urls:
                add_issue(
                    issues, "MEDIUM", "CANONICAL_NOT_IN_SITEMAP", url,
                    "Canonical nie występuje w sitemap.",
                    page.canonical,
                )

        if page.og_url and page.canonical and not same_document(page.og_url, page.canonical):
            add_issue(
                issues, "LOW", "OG_URL_DIFFERS_FROM_CANONICAL", url,
                f"og:url: {page.og_url}", page.canonical
            )

        if page.h1_count == 0:
            add_issue(issues, "HIGH", "MISSING_H1", url, "Brak nagłówka H1.")
        elif page.h1_count > 1:
            add_issue(
                issues, "MEDIUM", "MULTIPLE_H1", url,
                f"Liczba H1: {page.h1_count}; {page.h1_text}"
            )

        expected_lang = expected_language(url)
        actual_lang = page.html_lang.lower()
        if not actual_lang:
            add_issue(issues, "MEDIUM", "MISSING_HTML_LANG", url, "Brak lang w <html>.")
        elif not actual_lang.startswith(expected_lang):
            add_issue(
                issues, "HIGH", "HTML_LANG_MISMATCH", url,
                f"Oczekiwano {expected_lang}, jest {page.html_lang}."
            )

        if page.body_text_chars < 250:
            add_issue(
                issues, "MEDIUM", "THIN_PAGE_TEXT", url,
                f"Tylko {page.body_text_chars} znaków tekstu w body."
            )

        if page.declared_charset and page.declared_charset not in {"utf-8", "utf8"}:
            add_issue(
                issues, "HIGH", "NON_UTF8_HTTP_CHARSET", url,
                f"Nagłówek HTTP deklaruje charset={page.declared_charset}."
            )

        if page.meta_charset and page.meta_charset not in {"utf-8", "utf8"}:
            add_issue(
                issues, "HIGH", "NON_UTF8_META_CHARSET", url,
                f"Meta charset deklaruje {page.meta_charset}."
            )

        if page.mojibake_hits:
            add_issue(
                issues, "HIGH", "MOJIBAKE_DETECTED", url,
                "Podejrzane sekwencje: " + ", ".join(page.mojibake_hits)
            )

        if page.jsonld_errors:
            add_issue(
                issues, "HIGH", "INVALID_JSON_LD", url,
                " | ".join(page.jsonld_errors)
            )

        required = expected_schema_types(url)
        missing = sorted(required - set(page.jsonld_types))
        if missing:
            add_issue(
                issues, "MEDIUM", "MISSING_EXPECTED_SCHEMA_TYPE", url,
                f"Brakuje: {', '.join(missing)}; obecne: {', '.join(page.jsonld_types) or 'brak'}"
            )

        if page.nested_product_in_itemlist:
            add_issue(
                issues, "HIGH", "PRODUCT_NESTED_IN_ITEMLIST", url,
                f"Liczba zagnieżdżonych Product: {page.nested_product_in_itemlist}"
            )


        expected_alternates = {"pl", "en", "x-default"}
        missing_alternates = sorted(expected_alternates - set(page.hreflang))
        if missing_alternates:
            add_issue(
                issues, "HIGH", "MISSING_HREFLANG", url,
                f"Brakuje: {', '.join(missing_alternates)}"
            )
        else:
            if page.hreflang.get("x-default") != page.hreflang.get("pl"):
                add_issue(
                    issues, "MEDIUM", "X_DEFAULT_NOT_POLISH", url,
                    "x-default nie jest równy wersji PL.",
                    page.hreflang.get("x-default", ""),
                )

        sitemap_alt = sitemap_hreflang.get(url)
        if sitemap_alt:
            for lang, target in sitemap_alt.items():
                html_target = page.hreflang.get(lang)
                if html_target and not same_document(html_target, target):
                    add_issue(
                        issues, "HIGH", "HTML_SITEMAP_HREFLANG_MISMATCH", url,
                        f"Język {lang}: HTML={html_target}; sitemap={target}",
                        target,
                    )

    for (language, value), urls in by_title.items():
        if value and len(urls) > 1:
            for url in urls:
                add_issue(
                    issues, "MEDIUM", "DUPLICATE_TITLE", url,
                    f"Ten sam title występuje na {len(urls)} stronach języka {language}.",
                    " | ".join(item for item in urls if item != url)[:1000],
                )

    for (language, value), urls in by_description.items():
        if value and len(urls) > 1:
            for url in urls:
                add_issue(
                    issues, "LOW", "DUPLICATE_META_DESCRIPTION", url,
                    f"Ten sam description występuje na {len(urls)} stronach języka {language}.",
                    " | ".join(item for item in urls if item != url)[:1000],
                )

    for canonical, urls in by_canonical.items():
        if canonical and len(urls) > 1:
            for url in urls:
                add_issue(
                    issues, "CRITICAL", "DUPLICATE_CANONICAL_TARGET", url,
                    f"Canonical współdzielony przez {len(urls)} adresy.",
                    canonical,
                )

    # Wzajemność hreflang oraz stan celów.
    for page in pages:
        source = normalize_url(page.url)
        source_lang = expected_language(source)
        for lang, target in page.hreflang.items():
            if lang == "x-default":
                continue
            target_page = by_url.get(normalize_url(target))
            if target_page is None:
                add_issue(
                    issues, "HIGH", "HREFLANG_TARGET_NOT_IN_SITEMAP", source,
                    f"Cel {lang} nie występuje w sitemap.", target
                )
                continue
            if target_page.status_code != 200:
                add_issue(
                    issues, "HIGH", "HREFLANG_TARGET_NOT_200", source,
                    f"Cel {lang} ma status {target_page.status_code}.", target
                )
            back_target = target_page.hreflang.get(source_lang)
            if not back_target or not same_document(back_target, source):
                add_issue(
                    issues, "HIGH", "HREFLANG_NOT_RECIPROCAL", source,
                    f"Cel {lang} nie wskazuje zwrotnie wersji {source_lang}.",
                    target,
                )

    # Osierocenie na podstawie wewnętrznych linków z wszystkich stron sitemap.
    inbound: Counter[str] = Counter()
    for page in pages:
        for target in page.internal_page_links:
            normalized = normalize_url(target)
            if normalized in sitemap_urls:
                inbound[normalized] += 1

    home_candidates = {normalize_url(base_url), normalize_url(base_url + "/en")}
    for url in sorted(sitemap_urls):
        if url not in home_candidates and inbound[url] == 0:
            add_issue(
                issues, "MEDIUM", "ORPHAN_SITEMAP_PAGE", url,
                "Brak linku przychodzącego z innych stron znajdujących się w sitemap."
            )

    return issues


def check_reference(
    url: str, kind: str, timeout: float
) -> tuple[int | None, str, str, str]:
    """Sprawdza odwołanie prawdziwym GET bez pobierania całego body.

    HEAD dawał fałszywe HTTP 400 dla /_next/image. stream=True pobiera
    nagłówki i status, ale nie ładuje obrazu/PDF-u do pamięci.
    """
    try:
        path = urlsplit(url).path
        if path.startswith("/_next/image"):
            accept = "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8"
        elif kind == "page":
            accept = "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
        else:
            accept = "*/*"

        response = clean_get(
            url,
            timeout=timeout,
            allow_redirects=True,
            stream=True,
            accept=accept,
        )
        try:
            return (
                response.status_code,
                normalize_url(response.url),
                response.headers.get("Content-Type", "")
                .split(";")[0]
                .strip()
                .lower(),
                "",
            )
        finally:
            response.close()
    except Exception as exc:
        return None, "", "", str(exc)


def audit_references(
    pages: list[PageResult],
    *,
    timeout: float,
    workers: int,
    check_resources: bool,
) -> tuple[list[Reference], list[Issue]]:
    source_map: defaultdict[tuple[str, str], set[str]] = defaultdict(set)

    for page in pages:
        for target in page.internal_page_links:
            source_map[(target, "page")].add(page.url)
        if check_resources:
            for target in page.internal_resources:
                source_map[(target, "resource")].add(page.url)

    checks: dict[tuple[str, str], tuple[int | None, str, str, str]] = {}
    with ThreadPoolExecutor(max_workers=workers) as executor:
        future_map = {
            executor.submit(check_reference, target, kind, timeout): (target, kind)
            for target, kind in source_map
        }
        for future in as_completed(future_map):
            key = future_map[future]
            try:
                checks[key] = future.result()
            except Exception as exc:
                checks[key] = (None, "", "", str(exc))

    references: list[Reference] = []
    issues: list[Issue] = []

    for (target, kind), sources in sorted(source_map.items()):
        status, final_url, content_type, error = checks[(target, kind)]
        for source in sorted(sources):
            references.append(Reference(
                source_url=source,
                target_url=target,
                kind=kind,
                status_code=status,
                final_url=final_url,
                content_type=content_type,
                error=error,
            ))

        if error:
            for source in sorted(sources):
                add_issue(
                    issues, "HIGH", "INTERNAL_REFERENCE_FETCH_FAILED", source,
                    error, target
                )
        elif status is None or status >= 400:
            severity = "HIGH" if kind == "page" else "MEDIUM"
            for source in sorted(sources):
                add_issue(
                    issues, severity, "BROKEN_INTERNAL_REFERENCE", source,
                    f"{kind}: status HTTP {status}", target
                )
        elif final_url and not same_document(target, final_url):
            for source in sorted(sources):
                add_issue(
                    issues, "LOW", "INTERNAL_REFERENCE_REDIRECTS", source,
                    f"{kind}: przekierowanie do {final_url}", target
                )

        if not error and status is not None and status < 400:
            path = urlsplit(target).path.lower()
            if path.startswith("/_next/image") and not content_type.startswith("image/"):
                for source in sorted(sources):
                    add_issue(
                        issues, "MEDIUM", "NEXT_IMAGE_WRONG_CONTENT_TYPE", source,
                        f"Content-Type: {content_type or 'brak'}", target
                    )
            elif path.endswith(".pdf") and content_type != "application/pdf":
                for source in sorted(sources):
                    add_issue(
                        issues, "MEDIUM", "PDF_WRONG_CONTENT_TYPE", source,
                        f"Content-Type: {content_type or 'brak'}", target
                    )

    return references, issues


def write_csv(path: Path, rows: Iterable[dict[str, Any]], fieldnames: list[str]) -> None:
    with path.open("w", encoding="utf-8-sig", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames, extrasaction="ignore")
        writer.writeheader()
        for row in rows:
            writer.writerow(row)


def page_row(page: PageResult) -> dict[str, Any]:
    row = asdict(page)
    row["hreflang"] = json.dumps(page.hreflang, ensure_ascii=False, sort_keys=True)
    row["jsonld_types"] = " | ".join(page.jsonld_types)
    row["jsonld_errors"] = " | ".join(page.jsonld_errors)
    row["mojibake_hits"] = " | ".join(page.mojibake_hits)
    row["internal_page_links"] = len(page.internal_page_links)
    row["internal_resources"] = len(page.internal_resources)
    return row


def build_summary(
    pages: list[PageResult],
    issues: list[Issue],
    references: list[Reference],
    sitemap_url: str,
    started_at: datetime,
    finished_at: datetime,
) -> dict[str, Any]:
    severity_counts = Counter(issue.severity for issue in issues)
    code_counts = Counter(issue.code for issue in issues)
    status_counts = Counter(str(page.status_code) for page in pages)
    schema_counts = Counter(
        schema_type
        for page in pages
        for schema_type in page.jsonld_types
    )

    return {
        "auditVersion": AUDIT_VERSION,
        "startedAt": started_at.isoformat(),
        "finishedAt": finished_at.isoformat(),
        "durationSeconds": round((finished_at - started_at).total_seconds(), 2),
        "sitemapUrl": sitemap_url,
        "pages": {
            "total": len(pages),
            "statusCounts": dict(sorted(status_counts.items())),
            "withFetchError": sum(bool(page.error) for page in pages),
            "withInvalidJsonLd": sum(bool(page.jsonld_errors) for page in pages),
            "withMojibake": sum(bool(page.mojibake_hits) for page in pages),
        },
        "references": {
            "totalRows": len(references),
            "uniqueTargets": len({reference.target_url for reference in references}),
            "brokenRows": sum(
                bool(reference.error) or (reference.status_code or 0) >= 400
                for reference in references
            ),
        },
        "issues": {
            "total": len(issues),
            "severityCounts": {
                severity: severity_counts.get(severity, 0)
                for severity in SEVERITY_ORDER
            },
            "codeCounts": dict(code_counts.most_common()),
        },
        "schemaTypeCounts": dict(schema_counts.most_common()),
    }


def write_report(path: Path, summary: dict[str, Any], issues: list[Issue]) -> None:
    severity_counts = summary["issues"]["severityCounts"]
    grouped: defaultdict[str, list[Issue]] = defaultdict(list)
    for issue in issues:
        grouped[issue.severity].append(issue)

    lines = [
        "# Audyt produkcyjny Ariteks",
        "",
        f"- Wersja audytora: **{summary['auditVersion']}**",
        f"- Start: `{summary['startedAt']}`",
        f"- Koniec: `{summary['finishedAt']}`",
        f"- Czas: **{summary['durationSeconds']} s**",
        f"- Sitemap: `{summary['sitemapUrl']}`",
        f"- Strony: **{summary['pages']['total']}**",
        f"- Sprawdzone odwołania: **{summary['references']['uniqueTargets']}**",
        "",
        "## Wynik",
        "",
        "| Poziom | Liczba |",
        "|---|---:|",
    ]
    for severity in SEVERITY_ORDER:
        lines.append(f"| {severity} | {severity_counts.get(severity, 0)} |")

    lines.extend([
        "",
        "## Statusy stron",
        "",
        "| HTTP | Liczba |",
        "|---|---:|",
    ])
    for status, count in summary["pages"]["statusCounts"].items():
        lines.append(f"| {status} | {count} |")

    lines.extend([
        "",
        "## Najczęstsze typy problemów",
        "",
        "| Kod | Liczba |",
        "|---|---:|",
    ])
    for code, count in list(summary["issues"]["codeCounts"].items())[:30]:
        lines.append(f"| `{code}` | {count} |")

    for severity in SEVERITY_ORDER:
        items = sorted(
            grouped.get(severity, []),
            key=lambda item: (item.code, item.url, item.related_url),
        )
        if not items:
            continue
        lines.extend(["", f"## {severity}", ""])
        for issue in items[:300]:
            related = f" → `{issue.related_url}`" if issue.related_url else ""
            lines.append(
                f"- **{issue.code}** — `{issue.url}`{related}: {issue.details}"
            )
        if len(items) > 300:
            lines.append(
                f"- … pominięto {len(items) - 300} dalszych pozycji; pełna lista jest w `issues.csv`."
            )

    path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Pełny audyt produkcyjny serwisu Ariteks — wersja 2.0."
    )
    parser.add_argument("--base-url", default=DEFAULT_BASE_URL)
    parser.add_argument("--sitemap", default=DEFAULT_SITEMAP_URL)
    parser.add_argument("--output", default="audit-output")
    parser.add_argument("--workers", type=int, default=12)
    parser.add_argument("--timeout", type=float, default=25.0)
    parser.add_argument(
        "--check-resources",
        action="store_true",
        help="Sprawdź także obrazy, PDF-y, CSS, JS i inne zasoby.",
    )
    parser.add_argument(
        "--fail-on",
        choices=("none", "critical", "high"),
        default="critical",
        help="Kod wyjścia 1 po znalezieniu problemu na wskazanym poziomie.",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    started_at = datetime.now(timezone.utc)
    timestamp = started_at.strftime("%Y%m%d-%H%M%S")
    output_dir = Path(args.output) / timestamp
    output_dir.mkdir(parents=True, exist_ok=True)

    base_url = normalize_url(args.base_url)
    sitemap_url = normalize_url(args.sitemap)
    base_host = (urlsplit(base_url).hostname or "").lower()
    allowed_hosts = {base_host}
    if base_host.startswith("www."):
        allowed_hosts.add(base_host[4:])
    else:
        allowed_hosts.add(f"www.{base_host}")

    print(f"Ariteks production audit v{AUDIT_VERSION}")
    print(f"[1/6] Pobieranie sitemap: {sitemap_url}")
    sitemap_urls, sitemap_hreflang, issues = parse_sitemaps(
        sitemap_url, args.timeout
    )
    print(f"      URL-e w sitemap: {len(sitemap_urls)}")

    print("[2/6] Pobieranie robots.txt")
    robot_parser, robot_issues = build_robot_parser(base_url, args.timeout)
    issues.extend(robot_issues)

    print(f"[3/6] Audyt {len(sitemap_urls)} stron ({args.workers} wątków)")
    pages: list[PageResult] = []
    with ThreadPoolExecutor(max_workers=args.workers) as executor:
        future_map = {
            executor.submit(
                audit_page,
                url,
                timeout=args.timeout,
                allowed_hosts=allowed_hosts,
                robot_parser=robot_parser,
            ): url
            for url in sitemap_urls
        }
        completed = 0
        for future in as_completed(future_map):
            url = future_map[future]
            try:
                pages.append(future.result())
            except Exception as exc:
                pages.append(PageResult(url=url, error=str(exc)))
            completed += 1
            if completed % 25 == 0 or completed == len(future_map):
                print(f"      {completed}/{len(future_map)}")

    pages.sort(key=lambda page: page.url)

    print("[4/6] Analiza metadanych, canonicali, hreflang i JSON-LD")
    issues.extend(analyze_pages(
        pages,
        set(sitemap_urls),
        sitemap_hreflang,
        base_url,
    ))

    print(
        "[5/6] Kontrola linków wewnętrznych"
        + (" i zasobów" if args.check_resources else "")
    )
    references, reference_issues = audit_references(
        pages,
        timeout=args.timeout,
        workers=args.workers,
        check_resources=args.check_resources,
    )
    issues.extend(reference_issues)

    issues.sort(
        key=lambda item: (
            SEVERITY_ORDER.get(item.severity, 99),
            item.code,
            item.url,
            item.related_url,
        )
    )

    finished_at = datetime.now(timezone.utc)
    summary = build_summary(
        pages, issues, references, sitemap_url, started_at, finished_at
    )

    print("[6/6] Zapisywanie raportów")
    (output_dir / "summary.json").write_text(
        json.dumps(summary, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    write_report(output_dir / "report.md", summary, issues)

    page_fields = list(page_row(pages[0]).keys()) if pages else [
        "url", "status_code", "final_url", "error"
    ]
    write_csv(
        output_dir / "pages.csv",
        (page_row(page) for page in pages),
        page_fields,
    )
    write_csv(
        output_dir / "issues.csv",
        (asdict(issue) for issue in issues),
        ["severity", "code", "url", "details", "related_url"],
    )
    write_csv(
        output_dir / "references.csv",
        (asdict(reference) for reference in references),
        [
            "source_url", "target_url", "kind", "status_code",
            "final_url", "content_type", "error",
        ],
    )

    severity_counts = summary["issues"]["severityCounts"]
    print("")
    print(f"GOTOWE: {output_dir.resolve()}")
    print(f"Strony:   {len(pages)}")
    print(f"Odnośniki: {summary['references']['uniqueTargets']}")
    for severity in SEVERITY_ORDER:
        print(f"{severity:8}: {severity_counts.get(severity, 0)}")

    if args.fail_on == "critical" and severity_counts.get("CRITICAL", 0):
        return 1
    if args.fail_on == "high" and (
        severity_counts.get("CRITICAL", 0) or severity_counts.get("HIGH", 0)
    ):
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())