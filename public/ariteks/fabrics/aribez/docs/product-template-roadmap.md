# Mapa danych produktu — Ari Bez

Wygenerowano: 2026-07-12T14:13:25

## Cel

Ten dokument opisuje kompletny zestaw danych potrzebny do stworzenia nowej strony produktu. Dane pochodzą jednocześnie ze strony zbiorczej kategorii i z podstrony produktu.

## Źródła

- Strona kategorii: https://www.ariteks.net/cloth-technical-textiles.asp
- Strona produktu: https://www.ariteks.net/aribez.asp
- Publiczny manifest JSON: `/ariteks/fabrics/aribez/data/fabric-complete-record.json`
- Folder public: `C:\Projekty\galia-navi\public\ariteks\fabrics\aribez`

## 1. Dane ze strony zbiorczej kategorii

- Grupa: **AriPam spun fabrics for shoe lining**
- Nazwa w tabeli kategorii: **Ari Bez**
- Wiersz tabeli: `132`
- Tekst wiersza: 180 g/m² 100% AriPam Ari Bez 1/1 Plain

### 1.1. Dane skrócone z wiersza

- Gramatura: `180 g/m²`
- Skład: `100% AriPam`
- Splot / struktura: `1/1 Plain`

### 1.2. Dokument grupy

- [https://www.ariteks.net/pdf/AriPam_ru_ds_ver2.pdf](/ariteks/fabrics/aribez/documents/aripam-ru-ds-ver2__86a33c6d42.pdf)
  - Public: `/ariteks/fabrics/aribez/documents/aripam-ru-ds-ver2__86a33c6d42.pdf`

### 1.3. Technologia / partner

- Brak.

### 1.4. Piktogramy norm z wiersza kategorii

- EN 13758
  - Public: `/ariteks/fabrics/aribez/images/en-13758__2ac2efc41b.jpg`

### 1.5. Struktura / splot z wiersza kategorii

- Nazwa splotu: `1/1 Plain`
- Grafika struktury: `/ariteks/fabrics/aribez/images/woven__c0215fa432.jpg`

### 1.6. Kolory skrócone z wiersza kategorii

| Kolor / wartość | Opis |
|---|---|
| `rgb(255, 255, 255)` |  |

---

## 2. Dane z podstrony produktu

- Nazwa handlowa: **Ari Bez**
- Opis z title: `100% AriPam uv resistant plain fabric`
- Linia specyfikacji: `180 g/m², 100% AriPam, Uv protective, 1/1 Plain Woven Fabric`

### 2.1. Hero / duże zdjęcie

- 100% AriSpun plain Fabric
  - Public: `/ariteks/fabrics/aribez/images/aribez-main-pic-m__422386b687.jpg`

### 2.2. Opis

- 100% AriPam spun plain fabric.
- It is used as a lining inside of the shoes.
- Ari Bez can also be used on outdoor medical cloth.

### 2.3. Tabela parametrów technicznych

| Parametr | Wartość | Norma |
|---|---|---|
| Fiber | 100% AriPam | EN ISO 2076 |
| Yarn | 60/2 Ne | EN ISO 2060 |
| Weight | 180 ±10 g/m² | EN ISO 3081 |
| Width | 1600 ±20 mm | EN ISO 3932 |
| Tensile Strength | Warp > 1000N ; Weft > 800N | EN ISO 13934-1 |
| Tear Strength | Warp > 25N ; Weft > 20N | EN ISO 13937-2 |
| Dimensional Change | -3% < Length < +3% ; -3% < Width < +3% | EN ISO 5077 |
| Rubbing Fastness | 4-5 | EN ISO 105 X12 |
| Perspiration Fastness | 4-5 | EN ISO 105 E04 |
| Washing Fastness | 4-5 | EN ISO 105 C06 |
| Dry Cleaning Fastness | 4-5 | EN ISO 105 D01 |
| Hypochlorite Fastness | 4-5 | EN ISO 105 N01 |
| Hot Press Fastness | 4-5 | EN ISO 105 X11 |
| pH | 4,0 - 7,5 | EN ISO 3071 |
| Azo Test | No Azo Colorants. | EN ISO 14362-1 |
| Application | Lining for Shoes |  |
| Quality Management | Done | ISO 9001 |

### 2.4. Technical Documents

- [>> Ari Bez Data Sheet](/ariteks/fabrics/aribez/documents/aribez-ds__2684ea950d.pdf)
  - Public: `/ariteks/fabrics/aribez/documents/aribez-ds__2684ea950d.pdf`

### 2.5. Certificates / test reports

- Brak.

### 2.6. Applications — galeria

- Brak albo nierozpoznane jako application_image.

### 2.7. Functions — ikony funkcji

- Oeko Tex Standard 100
  - Public: `/ariteks/fabrics/aribez/images/oekoteks-standard-100-s__ea5e91d474.jpg`
- Uv Protection
  - Public: `/ariteks/fabrics/aribez/images/en-13758__2ac2efc41b.jpg`

### 2.8. Care Instructions

- 60'C Machine Wash
  - Public: `/ariteks/fabrics/aribez/images/60-mach-wash-ma-agi__cdc86ecf03.jpg`
- No Chlorine Based Bleaching
  - Public: `/ariteks/fabrics/aribez/images/no-chlorine-bleach__33a0308671.jpg`
- Can Be Tumble Dried On Low Heat Setting
  - Public: `/ariteks/fabrics/aribez/images/tumble-dried-low-ht__cd432a52a7.jpg`
- Maximum 150'C Warm Iron
  - Public: `/ariteks/fabrics/aribez/images/ma-150-iron__78883199be.jpg`
- Suitable for Dry Cleaning
  - Public: `/ariteks/fabrics/aribez/images/dry-cleaning__6e8a85520f.jpg`

### 2.9. Colors and Article Numbers

| Kolor | Kod / PIND / PT | Wykończenie | Numer artykułu |
|---|---|---|---|
| White |  |  | PT0-10275 |

---

## 3. Jak budować szablon strony produktu

Szablon produktu powinien używać pól:

```text
record.category_row.group.title
record.category_row.summary.weight
record.category_row.summary.composition
record.category_row.structure.name
record.product_page.commercial_name
record.product_page.spec_line
record.product_page.description_blocks
record.product_page.technical_parameters
record.product_page.technical_documents
record.product_page.image_groups.hero_images
record.product_page.image_groups.application_images
record.product_page.image_groups.function_icons
record.product_page.image_groups.care_instructions
record.product_page.colors_and_articles
```

## 4. Pełny tekst strony produktu

```text
100% AriPam uv resistant plain fabric - Ari Bez - Ariteks
Lining, 3 Layer Laminated, Waterproof Breatheable Fabrics
Cloth Technical Textiles
Ari Bez
180 gr/m
2
, 100% AriPam, Uv protective, 1/1 Plain Woven Fabric
100% AriPam spun plain fabric. It is used as a lining inside of the shoes.
Ari Bez can also be used on outdoor medical cloth.
Technical Parameters
Fiber
100% AriPam
EN ISO 2076
Yarn
60/2 Ne
EN ISO 2060
Weight
180 ±10 gr/m
2
EN ISO 3081
Width
1600 ±20 mm
EN ISO 3932
Tensile Strength
Warp > 1000N ; Weft > 800N
EN ISO 13934-1
Tear Strength
Warp > 25N ; Weft > 20N
EN ISO 13937-2
Dimensional Change
-3% < Length < +3% ; -3% < Width < +3%
EN ISO 5077
Rubbing Fastness
4-5
EN ISO 105 X12
Perspiration Fastness
4-5
EN ISO 105 E04
Washing Fastness
4-5
EN ISO 105 C06
Dry Cleaning Fastness
4-5
EN ISO 105 D01
Hypochlorite Fastness
4-5
EN ISO 105 N01
Hot Press Fastness
4-5
EN ISO 105 X11
pH
4,0 - 7,5
EN ISO 3071
Azo Test
No Azo Colorants.
EN ISO 14362-1
Application
Lining for Shoes
Quality Management
Done
ISO 9001
Uv Protection
Done
EN ISO 13758
Technical Documents
>> Ari Bez Data Sheet
Certificates
Applications
Functions
Care Instructions
Colors and Article Numbers
White
PT0-10275-1
- STANDARD -
Ari Bez - 5922
Home
>
Products
>
Cloth
>
Ari Bez
APPAREL TEXTILES
BUILDING TECHNICAL TEXTILES
HOME TECHNICAL TEXTILES
PROTECTION TECHNICAL TEXTILES
MEDICAL TECHNICAL TEXTILES
SPORT TECHNICAL TEXTILES
TRANSPORT TECHNICAL TEXTILES
ARITEKS GROUP
SERVICES
UV PROTECTION
FLAME RETARDANT
INSECT REPELLENT
ANTIBACTERIAL
WATER REPELLENT
ARDILIGHT
ARNEO ECO
AROF FILE
Ariteks Headquarters
Phone:
+90 212 538 05 98
Address:
Otakçılar Cad. No:80/32 34050
Eyupsultan/Istanbul Turkiye
E-Mail:
support@ariteksinfo.com
Web:
www.ariteks.net
Copyright © 2026 Arıteks A.Ş.
```
---

## 5. Fabric Photo — zdjęcie próbki tkaniny

- Brak wykrytego zdjęcia próbki tkaniny.