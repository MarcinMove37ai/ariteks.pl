# Mapa danych produktu — ArSeat Touch

Wygenerowano: 2026-07-12T14:12:10

## Cel

Ten dokument opisuje kompletny zestaw danych potrzebny do stworzenia nowej strony produktu. Dane pochodzą jednocześnie ze strony zbiorczej kategorii i z podstrony produktu.

## Źródła

- Strona kategorii: https://www.ariteks.net/transport-technical-textiles.asp
- Strona produktu: https://www.ariteks.net/arseat-touch.asp
- Publiczny manifest JSON: `/ariteks/fabrics/arseat-touch/data/fabric-complete-record.json`
- Folder public: `C:\Projekty\galia-navi\public\ariteks\fabrics\arseat-touch`

## 1. Dane ze strony zbiorczej kategorii

- Grupa: **Warp Knit Fabrics for Upholstery and Shoes**
- Nazwa w tabeli kategorii: **ArSeat Touch**
- Wiersz tabeli: `51`
- Tekst wiersza: 150 g/m² 100% PES ArSeat Touch Warp Knit Plain

### 1.1. Dane skrócone z wiersza

- Gramatura: `150 g/m²`
- Skład: `100% PES`
- Splot / struktura: `Warp Knit Plain`

### 1.2. Dokument grupy

- [https://www.ariteks.net/pdf/ArSeat_ru_ds_ver2.pdf](/ariteks/fabrics/arseat-touch/documents/arseat-ru-ds-ver2__212f6f5d31.pdf)
  - Public: `/ariteks/fabrics/arseat-touch/documents/arseat-ru-ds-ver2__212f6f5d31.pdf`

### 1.3. Technologia / partner

- Brak.

### 1.4. Piktogramy norm z wiersza kategorii

- Brak.

### 1.5. Struktura / splot z wiersza kategorii

- Nazwa splotu: `Warp Knit Plain`
- Grafika struktury: `/ariteks/fabrics/arseat-touch/images/warp-knit__22376b13e5.jpg`

### 1.6. Kolory skrócone z wiersza kategorii

| Kolor / wartość | Opis |
|---|---|
| `rgb(195, 195, 195)` |  |
| `rgb(0, 0, 0)` |  |
| `rgb(218, 218, 218)` | 250 g/m² 100% PES |

---

## 2. Dane z podstrony produktu

- Nazwa handlowa: **ArSeat Touch**
- Opis z title: `Micro Alcantara Fabric`
- Linia specyfikacji: `150 g/m², 100% Polyester, Micro alcantara one side fleece knit fabric`

### 2.1. Hero / duże zdjęcie

- Fabric for Shoes and Upholstery
  - Public: `/ariteks/fabrics/arseat-touch/images/arseat-touch-main-pic-m__fecf839dd3.jpg`

### 2.2. Opis

- ArSeat Touch is 100% polyester, 150 g/m², micro alcantara warp knit fabric.
- It is suitable for upholstery.

### 2.3. Tabela parametrów technicznych

| Parametr | Wartość | Norma |
|---|---|---|
| Fiber | 100% Polyester (PES) | TS EN ISO 1833 |
| Yarn | 75/144 Denier | EN ISO 2060 |
| Weight | 150 ±5 g/m² | TS EN 12127 |
| Width | 1500 ±20 mm | TS EN 1773 |
| Bursting strength | > 1000 kPa (kN/m² ) | TS EN 13938-1 |
| Dimensinal Change | -5% < Length < +5% ; -5% < Width < +5% | TS EN ISO 5077 |
| Abrasion Resistance | @50000 | TS EN 530 |
| Rubbing Fastness | 4 | EN ISO 105 X12 |
| Perspiration Fastness | 4-5 | EN ISO 105 E04 |
| Washing Fastness | 4-5 | EN ISO 105 C01 |
| Dry Cleaning Fastness | 4-5 | EN ISO 105 D01 |
| Hypochlorite Fastness | 4-5 | EN ISO 105 N01 |
| Hot Press Fastness | 4-5 | EN ISO 105 X11 |
| Light Fastness | 4-5 | EN ISO 105 B02 |
| pH | 6.2 | EN ISO 3071 |
| Azo Test | No Azo Colorants. | EN ISO 14362-1 |
| Application | Upholstery |  |
| Quality Management | Done | ISO 9001 |

### 2.4. Technical Documents

- [>> ArSeat Touch Data Sheet](/ariteks/fabrics/arseat-touch/documents/arseat-touch-ds__f835785a55.pdf)
  - Public: `/ariteks/fabrics/arseat-touch/documents/arseat-touch-ds__f835785a55.pdf`

### 2.5. Certificates / test reports

- Brak.

### 2.6. Applications — galeria

- Brak albo nierozpoznane jako application_image.

### 2.7. Functions — ikony funkcji

- Oeko Tex Standard 100
  - Public: `/ariteks/fabrics/arseat-touch/images/oekoteks-standard-100-s__ea5e91d474.jpg`

### 2.8. Care Instructions

- 60'C Machine Wash
  - Public: `/ariteks/fabrics/arseat-touch/images/60-mach-wash-ma-agi__cdc86ecf03.jpg`
- No Chlorine Based Bleaching
  - Public: `/ariteks/fabrics/arseat-touch/images/no-chlorine-bleach__33a0308671.jpg`
- Can Be Tumble Dried On Low Heat Setting
  - Public: `/ariteks/fabrics/arseat-touch/images/tumble-dried-low-ht__cd432a52a7.jpg`
- Maximum 150'C Warm Iron
  - Public: `/ariteks/fabrics/arseat-touch/images/ma-150-iron__78883199be.jpg`
- Suitable for Dry Cleaning
  - Public: `/ariteks/fabrics/arseat-touch/images/dry-cleaning__6e8a85520f.jpg`

### 2.9. Colors and Article Numbers

| Kolor | Kod / PIND / PT | Wykończenie | Numer artykułu |
|---|---|---|---|
| Grey | PT-95787 | - STANDARD - | ArSeat Touch-4302 |
| Black | PT-95503 | - STANDARD - | ArSeat Touch-4384 |

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
Micro Alcantara Fabric - ArSeat Touch - Ariteks
3D Air Mesh, upholstery fabrics.
Transport Technical Textiles
ArSeat Touch
150 gr/m
2
, 100% Polyester, Micro alcantara one side fleece knit fabric
ArSeat Touch is 100% polyester, 150 g/m², micro alcantara warp knit fabric.
It is suitable for upholstery.
Technical Parameters
Fiber
100% Polyester (PES)
TS EN ISO 1833
Yarn
75/144 Denier
EN ISO 2060
Weight
150 ±5 gr/m
2
TS EN 12127
Width
1500 ±20 mm
TS EN 1773
Bursting strength
> 1000 kPa (kN/m
2
)
TS EN 13938-1
Dimensinal Change
-5% < Length < +5% ; -5% < Width < +5%
TS EN ISO 5077
Abrasion Resistance
@50000
TS EN 530
Rubbing Fastness
4
EN ISO 105 X12
Perspiration Fastness
4-5
EN ISO 105 E04
Washing Fastness
4-5
EN ISO 105 C01
Dry Cleaning Fastness
4-5
EN ISO 105 D01
Hypochlorite Fastness
4-5
EN ISO 105 N01
Hot Press Fastness
4-5
EN ISO 105 X11
Light Fastness
4-5
EN ISO 105 B02
pH
6.2
EN ISO 3071
Azo Test
No Azo Colorants.
EN ISO 14362-1
Application
Upholstery
Quality Management
Done
ISO 9001
Technical Documents
>> ArSeat Touch Data Sheet
Certificates
Applications
Functions
Care Instructions
Colors and Article Numbers
Grey
PT-95787
- STANDARD -
ArSeat Touch-4302
Black
PT-95503
- STANDARD -
ArSeat Touch-4384
Home
>
Products
>
Transport
>
ArSeat Touch
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