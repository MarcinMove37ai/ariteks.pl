# Mapa danych produktu — ArPo

Wygenerowano: 2026-07-12T14:12:55

## Cel

Ten dokument opisuje kompletny zestaw danych potrzebny do stworzenia nowej strony produktu. Dane pochodzą jednocześnie ze strony zbiorczej kategorii i z podstrony produktu.

## Źródła

- Strona kategorii: https://www.ariteks.net/cloth-technical-textiles.asp
- Strona produktu: https://www.ariteks.net/arpo.asp
- Publiczny manifest JSON: `/ariteks/fabrics/arpo/data/fabric-complete-record.json`
- Folder public: `C:\Projekty\galia-navi\public\ariteks\fabrics\arpo`

## 1. Dane ze strony zbiorczej kategorii

- Grupa: **Polar Fabrics**
- Nazwa w tabeli kategorii: **ArPo**
- Wiersz tabeli: `53`
- Tekst wiersza: 290 g/m² 100% PES ArPo ArPo Polar 3 Layer (woven fabric + TPU Membrane + knit Fabric) laminated fabrics. Polar Fabrics 1/1 Plain Polar Fabrics ArAstar ArSotina Polar Fabrics

### 1.1. Dane skrócone z wiersza

- Gramatura: `290 g/m²`
- Skład: `100% PES`
- Splot / struktura: ``

### 1.2. Dokument grupy

- [https://www.ariteks.net/pdf/ArPo_ru_ds_ver2.pdf](/ariteks/fabrics/arpo/documents/arpo-ru-ds-ver2__e2da7651e1.pdf)
  - Public: `/ariteks/fabrics/arpo/documents/arpo-ru-ds-ver2__e2da7651e1.pdf`

### 1.3. Technologia / partner

- Brak.

### 1.4. Piktogramy norm z wiersza kategorii

- Brak.

### 1.5. Struktura / splot z wiersza kategorii

- Nazwa splotu: ``
- Grafika struktury: `/ariteks/fabrics/arpo/images/knit__71fef29325.jpg`

### 1.6. Kolory skrócone z wiersza kategorii

| Kolor / wartość | Opis |
|---|---|
| `rgb(0, 0, 0)` |  |
| `rgb(31, 31, 201)` |  |
| `rgb(27, 18, 73)` |  |
| `rgb(195, 195, 195)` |  |

---

## 2. Dane z podstrony produktu

- Nazwa handlowa: **ArPo**
- Opis z title: `100% polyester polar fabric`
- Linia specyfikacji: `290 g/m², 100% Polyester polar knit fabric`

### 2.1. Hero / duże zdjęcie

- Micropolar fabric
  - Public: `/ariteks/fabrics/arpo/images/arpo-main-pic-m__c677688f06.jpg`

### 2.2. Opis

- ArPo is micro polar fabric, mostly used to make winter jackets. Polar fabric creates extra heat insulation as basic use or as lining
- 100% polyester polar fabric

### 2.3. Tabela parametrów technicznych

| Parametr | Wartość | Norma |
|---|---|---|
| Fiber | 100% Polyester(PES) | EN ISO 2076 |
| Yarn | 100/144 Ne | EN ISO 2060 |
| Weight | 290 ±10 g/m² | EN ISO 3081 |
| Width | 1800 ±20 mm | EN ISO 3932 |
| Bursting strength | > 2000 kPa (kN/m² ) | EN ISO 13938-1 |
| Dimensional Change | -5% < Length < +5% ; -5% < Width < +5% | EN ISO 5077 |
| Rubbing Fastness | 4-5 | EN ISO 105 X12 |
| Perspiration Fastness | 4-5 | EN ISO 105 E04 |
| Washing Fastness | 4-5 | EN ISO 105 C06 |
| Dry Cleaning Fastness | 4-5 | EN ISO 105 D01 |
| Hypochlorite Fastness | 4-5 | EN ISO 105 N01 |
| Hot Press Fastness | 4-5 | EN ISO 105 X11 |
| pH | 4,0 - 7,5 | EN ISO 3071 |
| Azo Test | No Azo Colorants. | EN ISO 14362-1 |
| Application | Winter Jacket |  |
| Quality Management | Done | ISO 9001 |

### 2.4. Technical Documents

- [>> ArPo Data Sheet](/ariteks/fabrics/arpo/documents/arpo-ds__941f04e94e.pdf)
  - Public: `/ariteks/fabrics/arpo/documents/arpo-ds__941f04e94e.pdf`

### 2.5. Certificates / test reports

- Brak.

### 2.6. Applications — galeria

- High visible yellow polar fleece
  - Public: `/ariteks/fabrics/arpo/images/polar-fleece-1-m__d5fbc7d96d.jpg`
- polar fleece
  - Public: `/ariteks/fabrics/arpo/images/polar-fleece-2-m__f2b064d0b4.jpg`
- polar fleece jacket
  - Public: `/ariteks/fabrics/arpo/images/polar-fleece-3-m__d42b14bdc2.jpg`

### 2.7. Functions — ikony funkcji

- Oeko Tex Standard 100
  - Public: `/ariteks/fabrics/arpo/images/oekoteks-standard-100-s__ea5e91d474.jpg`

### 2.8. Care Instructions

- 60'C Machine Wash
  - Public: `/ariteks/fabrics/arpo/images/60-mach-wash-ma-agi__cdc86ecf03.jpg`
- No Chlorine Based Bleaching
  - Public: `/ariteks/fabrics/arpo/images/no-chlorine-bleach__33a0308671.jpg`
- Can Be Tumble Dried On Low Heat Setting
  - Public: `/ariteks/fabrics/arpo/images/tumble-dried-low-ht__cd432a52a7.jpg`
- Maximum 150'C Warm Iron
  - Public: `/ariteks/fabrics/arpo/images/ma-150-iron__78883199be.jpg`
- Suitable for Dry Cleaning
  - Public: `/ariteks/fabrics/arpo/images/dry-cleaning__6e8a85520f.jpg`

### 2.9. Colors and Article Numbers

| Kolor | Kod / PIND / PT | Wykończenie | Numer artykułu |
|---|---|---|---|
| Grey | PT-95592-1 | - STANDARD - |  |
| Dark Blue | PT-57972-1 | - STANDARD - |  |
| Black | PT-95503-1 | - STANDARD - |  |
| Navy | PT-57753-1 | - STANDARD - |  |

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
100% polyester polar fabric - ArPo - Ariteks
Lining, 3 Layer Laminated, Waterproof Breatheable Fabrics
Cloth Technical Textiles
ArPo
290 gr/m
2
, 100% Polyester polar knit fabric.
ArPo is micro polar fabric, mostly used to make winter jackets.
Polar fabric creates extra heat insulation as basic use or as lining
Technical Parameters
Fiber
100% Polyester(PES)
EN ISO 2076
Yarn
100/144 Ne
EN ISO 2060
Weight
290 ±10 gr/m
2
EN ISO 3081
Width
1800 ±20 mm
EN ISO 3932
Bursting strength
> 2000 kPa (kN/m
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
Winter Jacket
Quality Management
Done
ISO 9001
Technical Documents
>> ArPo Data Sheet
Certificates
Applications
Functions
Care Instructions
Colors and Article Numbers
Grey
PT-95592-1
- STANDARD -
ArPo - 5819
Dark Blue
PT-57972-1
- STANDARD -
ArPo - 5818
Black
PT-95503-1
- STANDARD -
ArPo - 5583
Navy
PT-57753-1
- STANDARD -
ArPo - 5394
Home
>
Products
>
Cloth
>
ArPo
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