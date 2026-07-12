# Mapa danych produktu — ArSotina

Wygenerowano: 2026-07-12T14:12:49

## Cel

Ten dokument opisuje kompletny zestaw danych potrzebny do stworzenia nowej strony produktu. Dane pochodzą jednocześnie ze strony zbiorczej kategorii i z podstrony produktu.

## Źródła

- Strona kategorii: https://www.ariteks.net/cloth-technical-textiles.asp
- Strona produktu: https://www.ariteks.net/arsotina.asp
- Publiczny manifest JSON: `/ariteks/fabrics/arsotina/data/fabric-complete-record.json`
- Folder public: `C:\Projekty\galia-navi\public\ariteks\fabrics\arsotina`

## 1. Dane ze strony zbiorczej kategorii

- Grupa: **Lining Fabrics**
- Nazwa w tabeli kategorii: **ArSotina**
- Wiersz tabeli: `37`
- Tekst wiersza: 140 g/m² 100% PES ArSotina 1/1 Plain

### 1.1. Dane skrócone z wiersza

- Gramatura: `140 g/m²`
- Skład: `100% PES`
- Splot / struktura: `1/1 Plain`

### 1.2. Dokument grupy

- [https://www.ariteks.net/pdf/ArAstar_ArSotina_ru_ds_ver2.pdf](/ariteks/fabrics/arsotina/documents/arastar-arsotina-ru-ds-ver2__74b122559a.pdf)
  - Public: `/ariteks/fabrics/arsotina/documents/arastar-arsotina-ru-ds-ver2__74b122559a.pdf`

### 1.3. Technologia / partner

- Brak.

### 1.4. Piktogramy norm z wiersza kategorii

- Brak.

### 1.5. Struktura / splot z wiersza kategorii

- Nazwa splotu: `1/1 Plain`
- Grafika struktury: `/ariteks/fabrics/arsotina/images/woven__c0215fa432.jpg`

### 1.6. Kolory skrócone z wiersza kategorii

| Kolor / wartość | Opis |
|---|---|
| `rgb(0, 0, 0)` |  |
| `rgb(31, 31, 201)` |  |
| `rgb(27, 18, 73)` |  |
| `rgb(223, 251, 0)` |  |
| `rgb(255, 110, 6)` |  |
| `rgb(218, 218, 218)` | 290 g/m² 100% PES |

---

## 2. Dane z podstrony produktu

- Nazwa handlowa: **ArSotina**
- Opis z title: `100% polyester lining fabric`
- Linia specyfikacji: `140 g/m², 100% Polyester, 1/1 Plain Woven Fabric`

### 2.1. Hero / duże zdjęcie

- 100% ArAstar plain Fabric
  - Public: `/ariteks/fabrics/arsotina/images/arsotina-main-pic-m__837f6c37af.jpg`

### 2.2. Opis

- ArSotina, 100% Polyester sotina fabric for garment lining.
- It can be used as a lining inside of the shoes.
- ArSotina is a durable lining fabric for more hard conditions.

### 2.3. Tabela parametrów technicznych

| Parametr | Wartość | Norma |
|---|---|---|
| Fiber | 100% Polyester | EN ISO 2076 |
| Yarn | 75 Denier | EN ISO 2060 |
| Weight | 140 ±10 g/m² | EN ISO 3081 |
| Width | 1500 ±20 mm | EN ISO 3932 |
| Tensile Strength | Warp > 800N ; Weft > 800N | EN ISO 13934-1 |
| Tear Strength | Warp > 30N ; Weft > 25N | EN ISO 13937-2 |
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

- [>> ArSotina Data Sheet](/ariteks/fabrics/arsotina/documents/arsotina-ds__8d1956f149.pdf)
  - Public: `/ariteks/fabrics/arsotina/documents/arsotina-ds__8d1956f149.pdf`

### 2.5. Certificates / test reports

- Brak.

### 2.6. Applications — galeria

- Brak albo nierozpoznane jako application_image.

### 2.7. Functions — ikony funkcji

- Oeko Tex Standard 100
  - Public: `/ariteks/fabrics/arsotina/images/oekoteks-standard-100-s__ea5e91d474.jpg`

### 2.8. Care Instructions

- 40'C Machine Wash
  - Public: `/ariteks/fabrics/arsotina/images/40-mach-wash-ma-agi__5e0013c265.jpg`
- No Chlorine Based Bleaching
  - Public: `/ariteks/fabrics/arsotina/images/no-chlorine-bleach__33a0308671.jpg`
- Can Be Tumble Dried On Low Heat Setting
  - Public: `/ariteks/fabrics/arsotina/images/tumble-dried-low-ht__cd432a52a7.jpg`
- Maximum 150'C Warm Iron
  - Public: `/ariteks/fabrics/arsotina/images/ma-150-iron__78883199be.jpg`
- Suitable for Dry Cleaning
  - Public: `/ariteks/fabrics/arsotina/images/dry-cleaning__6e8a85520f.jpg`

### 2.9. Colors and Article Numbers

| Kolor | Kod / PIND / PT | Wykończenie | Numer artykułu |
|---|---|---|---|
| Black | PT-95503-1 | - STANDARD - |  |
| Navy | PT-57753-1 | - STANDARD - |  |
| Green | PT-22971-1 | - HIGH VISIBLE - |  |
| Orange | PT-22970-1 | - HIGH VISIBLE - |  |

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
100% polyester lining fabric - ArSotina - Ariteks
Lining, 3 Layer Laminated, Waterproof Breatheable Fabrics
Cloth Technical Textiles
ArSotina
140 gr/m
2
, 100% Polyester, 1/1 Plain Woven Fabric
ArSotina , 100% Polyester sotina fabric for garment lining.
It can be used as a lining inside of the shoes.
ArSotina is a durable lining fabric for more hard conditions.
Technical Parameters
Fiber
100% Polyester
EN ISO 2076
Yarn
75 Denier
EN ISO 2060
Weight
140 ±10 gr/m
2
EN ISO 3081
Width
1500 ±20 mm
EN ISO 3932
Tensile Strength
Warp > 800N ; Weft > 800N
EN ISO 13934-1
Tear Strength
Warp > 30N ; Weft > 25N
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
>> ArSotina Data Sheet
Certificates
Applications
Functions
Care Instructions
Colors and Article Numbers
Black
PT-95503-1
- STANDARD -
ArSotina - 5909
Navy
PT-57753-1
- STANDARD -
ArSotina - 5911
Green
PT-22971-1
- HIGH VISIBLE -
ArSotina - 5912
Orange
PT-22970-1
- HIGH VISIBLE -
ArSotina - 5913
Home
>
Products
>
Cloth
>
ArSotina
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