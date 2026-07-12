# Mapa danych produktu — ArClean 250

Wygenerowano: 2026-07-12T14:13:40

## Cel

Ten dokument opisuje kompletny zestaw danych potrzebny do stworzenia nowej strony produktu. Dane pochodzą jednocześnie ze strony zbiorczej kategorii i z podstrony produktu.

## Źródła

- Strona kategorii: https://www.ariteks.net/machine-technical-textiles.asp
- Strona produktu: https://www.ariteks.net/arclean-250.asp
- Publiczny manifest JSON: `/ariteks/fabrics/arclean-250/data/fabric-complete-record.json`
- Folder public: `C:\Projekty\galia-navi\public\ariteks\fabrics\arclean-250`

## 1. Dane ze strony zbiorczej kategorii

- Grupa: **Cleaning Fabrics**
- Nazwa w tabeli kategorii: **ArClean 250**
- Wiersz tabeli: `26`
- Tekst wiersza: 250 g/m² 80% PES 20% PA6 ArClean 250 ArClean 250 Plain Home Home > Products Products > Cleaning Fabrics Cleaning Fabrics Machine Technical Textiles Cleaning Fabrics

### 1.1. Dane skrócone z wiersza

- Gramatura: `250 g/m²`
- Skład: `80% PES 20% PA6`
- Splot / struktura: `Plain`

### 1.2. Dokument grupy

- [https://www.ariteks.net/pdf/ArClean_ru_ds_ver2.pdf](/ariteks/fabrics/arclean-250/documents/arclean-ru-ds-ver2__c558a35384.pdf)
  - Public: `/ariteks/fabrics/arclean-250/documents/arclean-ru-ds-ver2__c558a35384.pdf`

### 1.3. Technologia / partner

- Brak.

### 1.4. Piktogramy norm z wiersza kategorii

- Brak.

### 1.5. Struktura / splot z wiersza kategorii

- Nazwa splotu: `Plain`
- Grafika struktury: `/ariteks/fabrics/arclean-250/images/warp-knit__22376b13e5.jpg`

### 1.6. Kolory skrócone z wiersza kategorii

| Kolor / wartość | Opis |
|---|---|
| `rgb(202, 251, 0)` |  |
| `rgb(255, 255, 0)` |  |
| `rgb(255, 174, 201)` |  |

---

## 2. Dane z podstrony produktu

- Nazwa handlowa: **ArClean 250**
- Opis z title: `80% polyester 20% polyamide microfiber cleaning cloth fabric`
- Linia specyfikacji: `250 g/m², 80% Polyester 20% Polyamide, microfiber warp knit fabric`

### 2.1. Hero / duże zdjęcie

- Microfiber cleaning cloth fabric
  - Public: `/ariteks/fabrics/arclean-250/images/arclean-250-main-pic-m__59b7d778ef.jpg`

### 2.2. Opis

- ArClean 250 is microfiber cloth fabric, mostly used to make cleaning cloth.
- Available in neon color and large width.

### 2.3. Tabela parametrów technicznych

| Parametr | Wartość | Norma |
|---|---|---|
| Fiber | 80% Polyester(PES) 20% Polyamide(Pa6) | EN ISO 2076 |
| Yarn | 150/288 Ne | EN ISO 2060 |
| Weight | 250 ±10 g/m² | EN ISO 3081 |
| Width | 2100 ±20 mm | EN ISO 3932 |
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
| Application | Microfiber Cleaning Cloth |  |
| Quality Management | Done | ISO 9001 |

### 2.4. Technical Documents

- [>> ArClean 250 Data Sheet](/ariteks/fabrics/arclean-250/documents/arclean-250-ds__05c390e032.pdf)
  - Public: `/ariteks/fabrics/arclean-250/documents/arclean-250-ds__05c390e032.pdf`

### 2.5. Certificates / test reports

- Brak.

### 2.6. Applications — galeria

- Microfiber Cleaning Cloth
  - Public: `/ariteks/fabrics/arclean-250/images/mikrofiber-cleaning-cloth-microfiber-temizlik-bezi-m__4bc980300e.jpg`
- Microfiber Cleaning Cloth Printed
  - Public: `/ariteks/fabrics/arclean-250/images/mikrofiber-cleaning-cloth-printed-microfiber-temizlik-bezi-baskili-m__0c1403cfe8.jpg`
- Microfiber Cleaning Cloth
  - Public: `/ariteks/fabrics/arclean-250/images/mikrofiber-cleaning-cloth-microfiber-temizlik-bezi-2-m__a37f1e9065.jpg`

### 2.7. Functions — ikony funkcji

- Oeko Tex Standard 100
  - Public: `/ariteks/fabrics/arclean-250/images/oekoteks-standard-100-s__ea5e91d474.jpg`

### 2.8. Care Instructions

- 60'C Machine Wash
  - Public: `/ariteks/fabrics/arclean-250/images/60-mach-wash-ma-agi__cdc86ecf03.jpg`
- No Chlorine Based Bleaching
  - Public: `/ariteks/fabrics/arclean-250/images/no-chlorine-bleach__33a0308671.jpg`
- Can Be Tumble Dried On Low Heat Setting
  - Public: `/ariteks/fabrics/arclean-250/images/tumble-dried-low-ht__cd432a52a7.jpg`
- Maximum 150'C Warm Iron
  - Public: `/ariteks/fabrics/arclean-250/images/ma-150-iron__78883199be.jpg`
- Suitable for Dry Cleaning
  - Public: `/ariteks/fabrics/arclean-250/images/dry-cleaning__6e8a85520f.jpg`

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
80% polyester 20% polyamide microfiber cleaning cloth fabric - ArClean 250 - Ariteks
Conveying fabrics, sealing and filtration fabrics for machines. Cleaning fabrics for industrials usages. Tire cord fabrics.
Machine Technical Textiles
ArClean 250
250 gr/m
2
, 80% Polyester 20% Polyamide, microfiber warp knit fabric.
ArClean 250 is microfiber cloth fabric, mostly used to make cleaning cloth.
Available in neon color and large width.
Technical Parameters
Fiber
80% Polyester(PES) 20% Polyamide(Pa6)
EN ISO 2076
Yarn
150/288 Ne
EN ISO 2060
Weight
250 ±10 gr/m
2
EN ISO 3081
Width
2100 ±20 mm
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
Microfiber Cleaning Cloth
Quality Management
Done
ISO 9001
Technical Documents
>> ArClean 250 Data Sheet
Certificates
Applications
Functions
Care Instructions
Colors and Article Numbers
Green
- STANDARD -
ArClean 250 - 5364
Yellow
- STANDARD -
ArClean 250 - 5820
Pink
- STANDARD -
ArClean 250 - 5821
Home
>
Products
>
Machine
>
ArClean 250
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