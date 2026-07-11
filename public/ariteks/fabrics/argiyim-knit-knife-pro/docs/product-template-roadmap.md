# Mapa danych produktu — ArGiyim Knit Knife Pro

Wygenerowano: 2026-07-10T19:40:44

## Cel

Ten dokument opisuje kompletny zestaw danych potrzebny do stworzenia nowej strony produktu. Dane pochodzą jednocześnie ze strony zbiorczej kategorii i z podstrony produktu.

## Źródła

- Strona kategorii: https://www.ariteks.net/package-technical-textiles.asp
- Strona produktu: https://www.ariteks.net/argiyim-knit-knife-pro.asp
- Publiczny manifest JSON: `/ariteks/fabrics/argiyim-knit-knife-pro/data/fabric-complete-record.json`
- Folder public: `E:\ariteks\new\package\public\ariteks\fabrics\argiyim-knit-knife-pro`

## 1. Dane ze strony zbiorczej kategorii

- Grupa: **Cut-proof knit fabric from p-aramid. Bomb and nail proof woven fabrics from Pa6.6**
- Nazwa w tabeli kategorii: **ArGiyim Knit Knife Pro**
- Wiersz tabeli: `207`
- Tekst wiersza: 250 g/m² 100% p-AR ArGiyim Knit Knife Pro Jersey

### 1.1. Dane skrócone z wiersza

- Gramatura: `250 g/m²`
- Skład: `100% p-AR`
- Splot / struktura: `Jersey`

### 1.2. Dokument grupy

- Brak wykrytego dokumentu grupy.

### 1.3. Technologia / partner

- Twaron
  - Public: `/ariteks/fabrics/argiyim-knit-knife-pro/images/twaron__d08f177ec1.jpg`

### 1.4. Piktogramy norm z wiersza kategorii

- EN 388
  - Public: `/ariteks/fabrics/argiyim-knit-knife-pro/images/en-388__1cf7d88453.jpg`

### 1.5. Struktura / splot z wiersza kategorii

- Nazwa splotu: `Jersey`
- Grafika struktury: `/ariteks/fabrics/argiyim-knit-knife-pro/images/knit__71fef29325.jpg`

### 1.6. Kolory skrócone z wiersza kategorii

| Kolor / wartość | Opis |
|---|---|
| `rgb(0, 0, 0)` |  |
| `rgb(249, 249, 0)` |  |

---

## 2. Dane z podstrony produktu

- Nazwa handlowa: **ArGiyim Knit Knife Pro**
- Opis z title: `100% p-Aramid, Cut Proof Knit Fabric`
- Linia specyfikacji: `250 g/m², 100% p-Aramid Cut Proof, Jersey Knit Fabric`

### 2.1. Hero / duże zdjęcie

- 100% p-Aramid Jersey Knit Fabric
  - Public: `/ariteks/fabrics/argiyim-knit-knife-pro/images/argiyim-knit-knife-pro-main-pic-m__29f88f5085.jpg`

### 2.2. Opis

- 100% p-Aramid jersey knit fabric for motorcyclist linings.
- ArGiyim Knit Knife Pro can also be used for cut proof gloves.

### 2.3. Tabela parametrów technicznych

| Parametr | Wartość | Norma |
|---|---|---|
| Fiber | 100% p-Aramid (p-AR) | EN ISO 2076 |
| Yarn | 24/2 Ne Combed | EN ISO 2060 |
| Weight | 250 ±5 g/m² | EN ISO 3081 |
| Width | 1800 ±20 mm | EN ISO 3932 |
| Bursting strength | > 2500 kPa(kN/m² ) | EN ISO 13938-1 |
| Dimensional Change | -5% < Length < +5% ; -5% < Width < +5% | EN ISO 5077 |
| Rubbing Fastness | 4-5 | EN ISO 105 X12 |
| Perspiration Fastness | 4-5 | EN ISO 105 E04 |
| Washing Fastness | 4-5 | EN ISO 105 C06 |
| Dry Cleaning Fastness | 4-5 | EN ISO 105 D01 |
| Hypochlorite Fastness | 4-5 | EN ISO 105 N01 |
| Peroxide Fastness | 4-5 | EN ISO 105 N02 |
| Hot Press Fastness | 4-5 | EN ISO 105 X11 |
| Light Fastness | 4-5 | EN ISO 105 B02 |
| Perspiration Light Fast. | 4-5 | EN ISO 105 B07 |
| pH | 4.0-7.5 | EN ISO 3071 |
| Azo Test | No Azo Colorants. | EN ISO 14362-1 |
| Application | Motorcyclist lining |  |
| Quality Management | Done | ISO 9001 |
| Cut-Proof | Done | EN 388 |

### 2.4. Technical Documents

- [>> ArGiyim Knit Knife Data Sheet](/ariteks/fabrics/argiyim-knit-knife-pro/documents/argiyim-knit-knife-pro-ds__05b06076f2.pdf)
  - Public: `/ariteks/fabrics/argiyim-knit-knife-pro/documents/argiyim-knit-knife-pro-ds__05b06076f2.pdf`

### 2.5. Certificates / test reports

- Brak.

### 2.6. Applications — galeria

- Brak albo nierozpoznane jako application_image.

### 2.7. Functions — ikony funkcji

- Oeko Tex Standard 100
  - Public: `/ariteks/fabrics/argiyim-knit-knife-pro/images/oekoteks-standard-100-s__ea5e91d474.jpg`
- EN 388
  - Public: `/ariteks/fabrics/argiyim-knit-knife-pro/images/en-388__1cf7d88453.jpg`

### 2.8. Care Instructions

- 40'C Machine Wash
  - Public: `/ariteks/fabrics/argiyim-knit-knife-pro/images/40-mach-wash-ma-agi__5e0013c265.jpg`
- Chlorine Based Bleaching
  - Public: `/ariteks/fabrics/argiyim-knit-knife-pro/images/chlorine-bleach__84f9125a6d.jpg`
- Can Be Tumble Dried On Low Heat Setting
  - Public: `/ariteks/fabrics/argiyim-knit-knife-pro/images/tumble-dried-low-ht__cd432a52a7.jpg`
- Maximum 150'C Warm Iron
  - Public: `/ariteks/fabrics/argiyim-knit-knife-pro/images/ma-150-iron__78883199be.jpg`
- Suitable for Dry Cleaning
  - Public: `/ariteks/fabrics/argiyim-knit-knife-pro/images/dry-cleaning__6e8a85520f.jpg`

### 2.9. Colors and Article Numbers

- Brak.

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
100% p-Aramid, Cut Proof Knit Fabric - ArGiyim Knit Knife Pro - Ariteks
High Tenacity Polyamide Fabrics (PA6.6) for Military bags, motorcyclist clothing and workwear fabrics. Pa6.6 fabrics has high tenacity and friction resistance.
Package Technical Textiles
ArGiyim Knit Knife Pro
250 gr/m
2
, 100% p-Aramid Cut Proof, Jersey Knit Fabric
100% p-Aramid jersey knit fabric for motorcyclist linings.
ArGiyim Knit Knife Pro can also be used for cut proof gloves.
EN 388 certified.
Technical Parameters
Fiber
100% p-Aramid (p-AR)
EN ISO 2076
Yarn
24/2 Ne Combed
EN ISO 2060
Weight
250 ±5 gr/m
2
EN ISO 3081
Width
1800 ±20 mm
EN ISO 3932
Bursting strength
> 2500 kPa(kN/m
2
)
EN ISO 13938-1
Dimensional Change
-5% < Length < +5% ; -5% < Width < +5%
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
Peroxide Fastness
4-5
EN ISO 105 N02
Hot Press Fastness
4-5
EN ISO 105 X11
Light Fastness
4-5
EN ISO 105 B02
Perspiration Light Fast.
4-5
EN ISO 105 B07
pH
4.0-7.5
EN ISO 3071
Azo Test
No Azo Colorants.
EN ISO 14362-1
Application
Motorcyclist lining
Quality Management
Done
ISO 9001
Cut-Proof
Done
EN 388
Technical Documents
>> ArGiyim Knit Knife Data Sheet
Certificates
Applications
Functions
Care Instructions
Colors and Article Numbers
Black
- STANDART -
ArGiyim Knit Knife Pro - 6140
Yellow
- STANDART -
ArGiyim Knit Knife Pro - 5358
Home
>
Products
>
Ambalaj
>
ArGiyim Knit Knife Pro
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