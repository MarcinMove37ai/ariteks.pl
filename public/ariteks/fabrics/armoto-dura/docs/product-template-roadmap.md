# Mapa danych produktu — ArMoto

Wygenerowano: 2026-07-10T19:22:41

## Cel

Ten dokument opisuje kompletny zestaw danych potrzebny do stworzenia nowej strony produktu. Dane pochodzą jednocześnie ze strony zbiorczej kategorii i z podstrony produktu.

## Źródła

- Strona kategorii: https://www.ariteks.net/sport-technical-textiles.asp
- Strona produktu: https://www.ariteks.net/armoto-dura.asp
- Publiczny manifest JSON: `/ariteks/fabrics/armoto-dura/data/fabric-complete-record.json`
- Folder public: `E:\ariteks\new\sport\public\ariteks\fabrics\armoto-dura`

## 1. Dane ze strony zbiorczej kategorii

- Grupa: **Heavy Warp Knit Fabrics for Shoes and Wind Jackets**
- Nazwa w tabeli kategorii: **ArMoto Dura**
- Wiersz tabeli: `103`
- Tekst wiersza: 240 g/m² 100% PA 6.6 ArMoto Dura ArMoto Dura Warp Knit Wind Heavy Mesh Fabrics 420 g/m² 100% PES Warp Knit Wind Warp Knit Wind ArMoto

### 1.1. Dane skrócone z wiersza

- Gramatura: `240 g/m²`
- Skład: `100% PA`
- Splot / struktura: `Warp Knit`

### 1.2. Dokument grupy

- [https://www.ariteks.net/pdf/ArMoto_ru_ds_ver2.pdf](/ariteks/fabrics/armoto-dura/documents/armoto-ru-ds-ver2__eab0490475.pdf)
  - Public: `/ariteks/fabrics/armoto-dura/documents/armoto-ru-ds-ver2__eab0490475.pdf`

### 1.3. Technologia / partner

- Cordura
  - Public: `/ariteks/fabrics/armoto-dura/images/cordura__d3d460308b.jpg`

### 1.4. Piktogramy norm z wiersza kategorii

- Brak.

### 1.5. Struktura / splot z wiersza kategorii

- Nazwa splotu: `Warp Knit`
- Grafika struktury: `/ariteks/fabrics/armoto-dura/images/warp-knit__22376b13e5.jpg`

### 1.6. Kolory skrócone z wiersza kategorii

| Kolor / wartość | Opis |
|---|---|
| `rgb(0, 0, 0)` |  |
| `rgb(255, 255, 255)` |  |
| `rgb(218, 218, 218)` | 420 g/m² 100% PES |

---

## 2. Dane z podstrony produktu

- Nazwa handlowa: **ArMoto**
- Opis z title: `Pa 6.6 Fabric for Shoes`
- Linia specyfikacji: `240 g/m², 100% Pa 6.6, Warp Knit Fabric`

### 2.1. Hero / duże zdjęcie

- Fabric for Military Shoes
  - Public: `/ariteks/fabrics/armoto-dura/images/armoto-dura-main-pic-m__5ed66a8526.jpg`

### 2.2. Opis

- ArMoto Dura is made of high tenacity polyamide fibers.
- For the military shoes industry it is popular fabric to laminate on base and edge of shoes.

### 2.3. Tabela parametrów technicznych

| Parametr | Wartość | Norma |
|---|---|---|
| Fiber | 100% HT Polyamide (PA 6.6) | TS EN ISO 1833 |
| Yarn | 300 Denier | EN ISO 2060 |
| Weight | 240 ±5 g/m² | TS EN 12127 |
| Width | 1500 ±20 mm | TS EN 1773 |
| Bursting strength | > 5000 kPa (kN/m² ) | TS EN 13938-1 |
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
| Application | Military Shoes |  |
| Quality Management | Done | ISO 9001 |

### 2.4. Technical Documents

- [>> ArMoto Dura Data Sheet](/ariteks/fabrics/armoto-dura/documents/armoto-dura-ds__efccc07b43.pdf)
  - Public: `/ariteks/fabrics/armoto-dura/documents/armoto-dura-ds__efccc07b43.pdf`

### 2.5. Certificates / test reports

- Brak.

### 2.6. Applications — galeria

- Brak albo nierozpoznane jako application_image.

### 2.7. Functions — ikony funkcji

- Oeko Tex Standard 100
  - Public: `/ariteks/fabrics/armoto-dura/images/oekoteks-standard-100-s__ea5e91d474.jpg`

### 2.8. Care Instructions

- 60'C Machine Wash
  - Public: `/ariteks/fabrics/armoto-dura/images/60-mach-wash-ma-agi__cdc86ecf03.jpg`
- No Chlorine Based Bleaching
  - Public: `/ariteks/fabrics/armoto-dura/images/no-chlorine-bleach__33a0308671.jpg`
- Can Be Tumble Dried On Low Heat Setting
  - Public: `/ariteks/fabrics/armoto-dura/images/tumble-dried-low-ht__cd432a52a7.jpg`
- Maximum 150'C Warm Iron
  - Public: `/ariteks/fabrics/armoto-dura/images/ma-150-iron__78883199be.jpg`
- Suitable for Dry Cleaning
  - Public: `/ariteks/fabrics/armoto-dura/images/dry-cleaning__6e8a85520f.jpg`

### 2.9. Colors and Article Numbers

| Kolor | Kod / PIND / PT | Wykończenie | Numer artykułu |
|---|---|---|---|
| Black |  |  | PN-96686 |

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
Pa 6.6 Fabric for Shoes - ArMoto - Ariteks
Track suits, 3*1 and 2*2 light weight mesh, team uniform, bird eye pattern polyester fabrics.
Sport Technical Textiles
ArMoto Dura
240 gr/m
2
, 100% Pa 6.6, Warp Knit Fabric
%100 polyamide 6.6 warp knit fabric for heavy duty and military shoes.
ArMoto Dura is made of high tenacity polyamide fibers.
For the military shoes industry it is popular fabric to laminate on base and edge of shoes.
Technical Parameters
Fiber
100% HT Polyamide (PA 6.6)
TS EN ISO 1833
Yarn
300 Denier
EN ISO 2060
Weight
240 ±5 gr/m
2
TS EN 12127
Width
1500 ±20 mm
TS EN 1773
Bursting strength
> 5000 kPa (kN/m
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
Military Shoes
Quality Management
Done
ISO 9001
Technical Documents
>> ArMoto Dura Data Sheet
Certificates
Applications
Functions
Care Instructions
Colors and Article Numbers
Black
PN-96686-1
- STANDARD -
ArMoto Dura- 5346
White
PNO 10464-1
- STANDARD -
ArMoto Dura- 5347
Home
>
Products
>
Sport
>
ArMoto Dura
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