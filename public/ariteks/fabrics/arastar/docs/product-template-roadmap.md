# Mapa danych produktu — ArAstar

Wygenerowano: 2026-07-12T14:12:42

## Cel

Ten dokument opisuje kompletny zestaw danych potrzebny do stworzenia nowej strony produktu. Dane pochodzą jednocześnie ze strony zbiorczej kategorii i z podstrony produktu.

## Źródła

- Strona kategorii: https://www.ariteks.net/cloth-technical-textiles.asp
- Strona produktu: https://www.ariteks.net/arastar.asp
- Publiczny manifest JSON: `/ariteks/fabrics/arastar/data/fabric-complete-record.json`
- Folder public: `C:\Projekty\galia-navi\public\ariteks\fabrics\arastar`

## 1. Dane ze strony zbiorczej kategorii

- Grupa: **Lining Fabrics**
- Nazwa w tabeli kategorii: **ArAstar**
- Wiersz tabeli: `25`
- Tekst wiersza: 60 g/m² 100% PES ArAstar 1/1 Plain

### 1.1. Dane skrócone z wiersza

- Gramatura: `60 g/m²`
- Skład: `100% PES`
- Splot / struktura: `1/1 Plain`

### 1.2. Dokument grupy

- [https://www.ariteks.net/pdf/ArAstar_ArSotina_ru_ds_ver2.pdf](/ariteks/fabrics/arastar/documents/arastar-arsotina-ru-ds-ver2__74b122559a.pdf)
  - Public: `/ariteks/fabrics/arastar/documents/arastar-arsotina-ru-ds-ver2__74b122559a.pdf`

### 1.3. Technologia / partner

- Brak.

### 1.4. Piktogramy norm z wiersza kategorii

- Brak.

### 1.5. Struktura / splot z wiersza kategorii

- Nazwa splotu: `1/1 Plain`
- Grafika struktury: `/ariteks/fabrics/arastar/images/woven__c0215fa432.jpg`

### 1.6. Kolory skrócone z wiersza kategorii

| Kolor / wartość | Opis |
|---|---|
| `rgb(0, 0, 0)` |  |
| `rgb(255, 255, 255)` |  |
| `rgb(27, 18, 73)` |  |
| `rgb(195, 195, 195)` |  |
| `rgb(218, 218, 218)` | 140 g/m² 100% PES |

---

## 2. Dane z podstrony produktu

- Nazwa handlowa: **ArAstar**
- Opis z title: `100% polyester lining fabric`
- Linia specyfikacji: `60 g/m², 100% Polyester, 1/1 Plain Woven Fabric`

### 2.1. Hero / duże zdjęcie

- 100% ArAstar plain Fabric
  - Public: `/ariteks/fabrics/arastar/images/arastar-main-pic-m__a3420d26aa.jpg`

### 2.2. Opis

- ArAstar, 100% Polyester taffeta fabric for garment lining.
- It can be used as a lining inside of the shoes.
- ArAstar is the most economical woven fabric on the market as textile material.

### 2.3. Tabela parametrów technicznych

| Parametr | Wartość | Norma |
|---|---|---|
| Fiber | 100% Polyester | EN ISO 2076 |
| Yarn | 75 Denier | EN ISO 2060 |
| Weight | 60 ±10 g/m² | EN ISO 3081 |
| Width | 1500 ±20 mm | EN ISO 3932 |
| Tensile Strength | Warp > 500N ; Weft > 400N | EN ISO 13934-1 |
| Tear Strength | Warp > 20N ; Weft > 15N | EN ISO 13937-2 |
| Dimensional Change | -3% < Length < +3% ; -3% < Width < +3% | EN ISO 5077 |
| Rubbing Fastness | 4-5 | EN ISO 105 X12 |
| Perspiration Fastness | 4-5 | EN ISO 105 E04 |
| Washing Fastness | 4-5 | EN ISO 105 C06 |
| Dry Cleaning Fastness | 4-5 | EN ISO 105 D01 |
| Hypochlorite Fastness | 4-5 | EN ISO 105 N01 |
| Hot Press Fastness | 4-5 | EN ISO 105 X11 |
| pH | 4,0 - 7,5 | EN ISO 3071 |
| Azo Test | No Azo Colorants. | EN ISO 14362-1 |
| Application | Lining |  |
| Quality Management | Done | ISO 9001 |

### 2.4. Technical Documents

- [>> ArAstar Data Sheet](/ariteks/fabrics/arastar/documents/arastar-ds__d32586616c.pdf)
  - Public: `/ariteks/fabrics/arastar/documents/arastar-ds__d32586616c.pdf`

### 2.5. Certificates / test reports

- Brak.

### 2.6. Applications — galeria

- Brak albo nierozpoznane jako application_image.

### 2.7. Functions — ikony funkcji

- Oeko Tex Standard 100
  - Public: `/ariteks/fabrics/arastar/images/oekoteks-standard-100-s__ea5e91d474.jpg`

### 2.8. Care Instructions

- 40'C Machine Wash
  - Public: `/ariteks/fabrics/arastar/images/40-mach-wash-ma-agi__5e0013c265.jpg`
- No Chlorine Based Bleaching
  - Public: `/ariteks/fabrics/arastar/images/no-chlorine-bleach__33a0308671.jpg`
- Can Be Tumble Dried On Low Heat Setting
  - Public: `/ariteks/fabrics/arastar/images/tumble-dried-low-ht__cd432a52a7.jpg`
- Maximum 150'C Warm Iron
  - Public: `/ariteks/fabrics/arastar/images/ma-150-iron__78883199be.jpg`
- Suitable for Dry Cleaning
  - Public: `/ariteks/fabrics/arastar/images/dry-cleaning__6e8a85520f.jpg`

### 2.9. Colors and Article Numbers

| Kolor | Kod / PIND / PT | Wykończenie | Numer artykułu |
|---|---|---|---|
| Grey | PT-95502-1 | - STANDARD - |  |
| Navy | PT-57753-1 | - STANDARD - |  |
| Black | PT-95503-1 | - STANDARD - |  |
| White | PT-10275-1 | - STANDARD - |  |

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
100% polyester lining fabric - ArAstar - Ariteks
Lining, 3 Layer Laminated, Waterproof Breatheable Fabrics
Cloth Technical Textiles
ArAstar
60 gr/m
2
, 100% Polyester, 1/1 Plain Woven Fabric
ArAstar , 100% Polyester taffeta fabric for garment lining.
It can be used as a lining inside of the shoes.
ArAstar is the most economical woven fabric on the market as textile material.
Technical Parameters
Fiber
100% Polyester
EN ISO 2076
Yarn
75 Denier
EN ISO 2060
Weight
60 ±10 gr/m
2
EN ISO 3081
Width
1500 ±20 mm
EN ISO 3932
Tensile Strength
Warp > 500N ; Weft > 400N
EN ISO 13934-1
Tear Strength
Warp > 20N ; Weft > 15N
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
Lining
Quality Management
Done
ISO 9001
Technical Documents
>> ArAstar Data Sheet
Certificates
Applications
Functions
Care Instructions
Colors and Article Numbers
Grey
PT-95502-1
- STANDARD -
ArAstar - 5652
Navy
PT-57753-1
- STANDARD -
ArAstar - 5649
Black
PT-95503-1
- STANDARD -
ArAstar - 5461
White
PT-10275-1
- STANDARD -
ArAstar - 5462
Home
>
Products
>
Cloth
>
ArAstar
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