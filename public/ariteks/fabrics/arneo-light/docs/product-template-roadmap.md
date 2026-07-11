# Mapa danych produktu — ArNeo Light

Wygenerowano: 2026-07-10T17:46:47

## Cel

Ten dokument opisuje kompletny zestaw danych potrzebny do stworzenia nowej strony produktu. Dane pochodzą jednocześnie ze strony zbiorczej kategorii i z podstrony produktu.

## Źródła

- Strona kategorii: https://www.ariteks.net/protection-technical-textiles.asp
- Strona produktu: https://www.ariteks.net/arneo-light.asp
- Publiczny manifest JSON: `/ariteks/fabrics/arneo-light/data/fabric-complete-record.json`
- Folder public: `C:\Projekty\galia-navi\public\ariteks\fabrics\arneo-light`

## 1. Dane ze strony zbiorczej kategorii

- Grupa: **High Visible Warp Knit Fabrics for Safety Jackets**
- Nazwa w tabeli kategorii: **ArNeo Light**
- Wiersz tabeli: `178`
- Tekst wiersza: 70 g/m² 100% PES ArNeo Light Warp Knit Plain

### 1.1. Dane skrócone z wiersza

- Gramatura: `70 g/m²`
- Skład: `100% PES`
- Splot / struktura: `Warp Knit Plain`

### 1.2. Dokument grupy

- [https://www.ariteks.net/pdf/Arneo_ru_ds_ver2.pdf](/ariteks/fabrics/arneo-light/documents/arneo-ru-ds-ver2__c1069fddab.pdf)
  - Public: `/ariteks/fabrics/arneo-light/documents/arneo-ru-ds-ver2__c1069fddab.pdf`

### 1.3. Technologia / partner

- Brak.

### 1.4. Piktogramy norm z wiersza kategorii

- Brak.

### 1.5. Struktura / splot z wiersza kategorii

- Nazwa splotu: `Warp Knit Plain`
- Grafika struktury: `/ariteks/fabrics/arneo-light/images/warp-knit__22376b13e5.jpg`

### 1.6. Kolory skrócone z wiersza kategorii

| Kolor / wartość | Opis |
|---|---|
| `rgb(255, 250, 0)` |  |
| `rgb(223, 251, 0)` |  |
| `rgb(255, 110, 6)` |  |
| `rgb(255, 0, 0)` |  |
| `rgb(218, 218, 218)` | 70 g/m² 100% PES |

---

## 2. Dane z podstrony produktu

- Nazwa handlowa: **ArNeo Light**
- Opis z title: `Economical Safety Jacket Fabric`
- Linia specyfikacji: `70 g/m², 100% Polyester, High Visible Knit Fabric`

### 2.1. Hero / duże zdjęcie

- Fluorescent Warp Knit Fabric
  - Public: `/ariteks/fabrics/arneo-light/images/arneo-light-main-pic-m__aae9de090b.jpg`

### 2.2. Opis

- ArNeo Light is 100% polyester, 65-70 g/m² warp knitted neon colored jacket fabric.
- It is an economic alternative to ArNeo Eco for non professional usage.
- Designed for construction and mining workwear applications.

### 2.3. Tabela parametrów technicznych

| Parametr | Wartość | Norma |
|---|---|---|
| Fiber | 100% Polyester (PES) | EN ISO 2076 |
| Yarn | 68 Denier | EN ISO 2060 |
| Weight | 70 ±5 g/m² | EN ISO 3081 |
| Width | 1500 ±20 mm | EN ISO 3932 |
| Bursting strength | > 400 kPa (kN/m² ) | EN ISO 13938-1 |
| Dimensional Change | -5% < Length < +5% ; -5% < Width < +5% | EN ISO 5077 |
| Rubbing Fastness | 4-5 | EN ISO 105 X12 |
| Perspiration Fastness | 4-5 | EN ISO 105 E04 |
| Washing Fastness | 4-5 | EN ISO 105 C06 |
| Dry Cleaning Fastness | 4-5 | EN ISO 105 D01 |
| Hypochlorite Fastness | 4-5 | EN ISO 105 N01 |
| Hot Press Fastness | 4-5 | EN ISO 105 X11 |
| pH | 6.2 | EN ISO 3071 |
| Azo Test | No Azo Colorants. | EN ISO 14362-1 |
| Application | Safety Jacket |  |
| Quality Management | Done | ISO 9001 |

### 2.4. Technical Documents

- [>> ArNeo Light Data Sheet](/ariteks/fabrics/arneo-light/documents/arneo-light-ds__9baf7278d5.pdf)
  - Public: `/ariteks/fabrics/arneo-light/documents/arneo-light-ds__9baf7278d5.pdf`

### 2.5. Certificates / test reports

- Brak.

### 2.6. Applications — galeria

- Economical High Visible Yellow Safety Jacket
  - Public: `/ariteks/fabrics/arneo-light/images/arneo20-m__2c45bb8f61.jpg`

### 2.7. Functions — ikony funkcji

- Oeko Tex Standard 100
  - Public: `/ariteks/fabrics/arneo-light/images/oekoteks-standard-100-s__ea5e91d474.jpg`

### 2.8. Care Instructions

- 60'C Machine Wash
  - Public: `/ariteks/fabrics/arneo-light/images/60-mach-wash-ma-agi__cdc86ecf03.jpg`
- No Chlorine Based Bleaching
  - Public: `/ariteks/fabrics/arneo-light/images/no-chlorine-bleach__33a0308671.jpg`
- Can Be Tumble Dried On Low Heat Setting
  - Public: `/ariteks/fabrics/arneo-light/images/tumble-dried-low-ht__cd432a52a7.jpg`
- Maximum 150'C Warm Iron
  - Public: `/ariteks/fabrics/arneo-light/images/ma-150-iron__78883199be.jpg`
- Suitable for Dry Cleaning
  - Public: `/ariteks/fabrics/arneo-light/images/dry-cleaning__6e8a85520f.jpg`

### 2.9. Colors and Article Numbers

| Kolor | Kod / PIND / PT | Wykończenie | Numer artykułu |
|---|---|---|---|
| Yellow | PT-23603-1 | - HIGH VISIBLE - | ArNeo Light-4065 |
| Green | PT-22971-1 | - HIGH VISIBLE - | ArNeo Light-4084 |
| Orange | PT-22970-1 | - HIGH VISIBLE - | ArNeo Light-4066 |
| Red | PT-33280-1 | - HIGH VISIBLE - | ArNeo Light-4067 |

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
Economical Safety Jacket Fabric - ArNeo Light - Ariteks
High visible, waterproof, flame retardant, antistatic, chemical resistant workwear fabrics.
Protection Technical Textiles
Ar
Neo
Light
70 gr/m
2
, 100% Polyester, High Visible Knit Fabric
ArNeo Light is 100% polyester, 65-70 g/m² warp knitted neon colored jacket fabric.
It is an economic alternative to ArNeo Eco for non professional usage.
Designed for construction and mining workwear applications.
Technical Parameters
Fiber
100% Polyester (PES)
EN ISO 2076
Yarn
68 Denier
EN ISO 2060
Weight
70 ±5 gr/m
2
EN ISO 3081
Width
1500 ±20 mm
EN ISO 3932
Bursting strength
> 400 kPa (kN/m
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
6.2
EN ISO 3071
Azo Test
No Azo Colorants.
EN ISO 14362-1
Application
Safety Jacket
Quality Management
Done
ISO 9001
Technical Documents
>> ArNeo Light Data Sheet
Certificates
Applications
Functions
Care Instructions
Colors and Article Numbers
Yellow
PT-23603-1
- HIGH VISIBLE -
ArNeo Light-4065
Green
PT-22971-1
- HIGH VISIBLE -
ArNeo Light-4084
Orange
PT-22970-1
- HIGH VISIBLE -
ArNeo Light-4066
Red
PT-33280-1
- HIGH VISIBLE -
ArNeo Light-4067
Home
>
Products
>
Protection
>
ArNeo Light
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