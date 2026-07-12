# Mapa danych produktu — Ari Pike

Wygenerowano: 2026-07-12T14:13:34

## Cel

Ten dokument opisuje kompletny zestaw danych potrzebny do stworzenia nowej strony produktu. Dane pochodzą jednocześnie ze strony zbiorczej kategorii i z podstrony produktu.

## Źródła

- Strona kategorii: https://www.ariteks.net/cloth-technical-textiles.asp
- Strona produktu: https://www.ariteks.net/aripike.asp
- Publiczny manifest JSON: `/ariteks/fabrics/aripike/data/fabric-complete-record.json`
- Folder public: `C:\Projekty\galia-navi\public\ariteks\fabrics\aripike`

## 1. Dane ze strony zbiorczej kategorii

- Grupa: **AriPam spun fabrics for shoe lining**
- Nazwa w tabeli kategorii: **Ari Pike**
- Wiersz tabeli: `154`
- Tekst wiersza: 210 g/m² 100% AriPam Ari Pike Twill

### 1.1. Dane skrócone z wiersza

- Gramatura: `210 g/m²`
- Skład: `100% AriPam`
- Splot / struktura: `Twill`

### 1.2. Dokument grupy

- [https://www.ariteks.net/pdf/AriPam_ru_ds_ver2.pdf](/ariteks/fabrics/aripike/documents/aripam-ru-ds-ver2__86a33c6d42.pdf)
  - Public: `/ariteks/fabrics/aripike/documents/aripam-ru-ds-ver2__86a33c6d42.pdf`

### 1.3. Technologia / partner

- Brak.

### 1.4. Piktogramy norm z wiersza kategorii

- EN 13758
  - Public: `/ariteks/fabrics/aripike/images/en-13758__2ac2efc41b.jpg`

### 1.5. Struktura / splot z wiersza kategorii

- Nazwa splotu: `Twill`
- Grafika struktury: `/ariteks/fabrics/aripike/images/knit__71fef29325.jpg`

### 1.6. Kolory skrócone z wiersza kategorii

| Kolor / wartość | Opis |
|---|---|
| `rgb(195, 195, 195)` |  |
| `rgb(27, 18, 73)` |  |

---

## 2. Dane z podstrony produktu

- Nazwa handlowa: **Ari Pike**
- Opis z title: `100% AriPam uv resistant pique fabric`
- Linia specyfikacji: `210 g/m², 100% AriPam, Uv protective, Pique Knit Fabric`

### 2.1. Hero / duże zdjęcie

- 100% AriSpun plain Fabric
  - Public: `/ariteks/fabrics/aripike/images/aripike-main-pic-m__027a6ea607.jpg`

### 2.2. Opis

- 100% AriPam pique knit fabric.
- It is used as a lining inside of the shoes.
- Ari Pike can also be used on promotional t-shirts.

### 2.3. Tabela parametrów technicznych

| Parametr | Wartość | Norma |
|---|---|---|
| Fiber | 100% AriPam | EN ISO 2076 |
| Yarn | 30/1 Ne | EN ISO 2060 |
| Weight | 210 ±10 g/m² | EN ISO 3081 |
| Width | 1700 ±20 mm | EN ISO 3932 |
| Bursting strength | > 1400 kPa(kN/m² ) | EN ISO 13938-1 |
| Dimensional Change | -5% < Length < +5% ; -5% < Width < +5% | EN ISO 5077 |
| Rubbing Fastness | 4-5 | EN ISO 105 X12 |
| Perspiration Fastness | 4-5 | EN ISO 105 E04 |
| Washing Fastness | 4-5 | EN ISO 105 C06 |
| Dry Cleaning Fastness | 4-5 | EN ISO 105 D01 |
| Hypochlorite Fastness | 4-5 | EN ISO 105 N01 |
| Hot Press Fastness | 4-5 | EN ISO 105 X11 |
| pH | 4,0 - 7,5 | EN ISO 3071 |
| Azo Test | No Azo Colorants. | EN ISO 14362-1 |
| Application | Lining for shoes |  |
| Quality Management | Done | ISO 9001 |

### 2.4. Technical Documents

- [>> Ari Pike Data Sheet](/ariteks/fabrics/aripike/documents/aripike-ds__21d826a62a.pdf)
  - Public: `/ariteks/fabrics/aripike/documents/aripike-ds__21d826a62a.pdf`

### 2.5. Certificates / test reports

- Brak.

### 2.6. Applications — galeria

- Brak albo nierozpoznane jako application_image.

### 2.7. Functions — ikony funkcji

- Oeko Tex Standard 100
  - Public: `/ariteks/fabrics/aripike/images/oekoteks-standard-100-s__ea5e91d474.jpg`
- Uv Protection
  - Public: `/ariteks/fabrics/aripike/images/en-13758__2ac2efc41b.jpg`

### 2.8. Care Instructions

- 60'C Machine Wash
  - Public: `/ariteks/fabrics/aripike/images/60-mach-wash-ma-agi__cdc86ecf03.jpg`
- No Chlorine Based Bleaching
  - Public: `/ariteks/fabrics/aripike/images/no-chlorine-bleach__33a0308671.jpg`
- Can Be Tumble Dried On Low Heat Setting
  - Public: `/ariteks/fabrics/aripike/images/tumble-dried-low-ht__cd432a52a7.jpg`
- Maximum 150'C Warm Iron
  - Public: `/ariteks/fabrics/aripike/images/ma-150-iron__78883199be.jpg`
- Suitable for Dry Cleaning
  - Public: `/ariteks/fabrics/aripike/images/dry-cleaning__6e8a85520f.jpg`

### 2.9. Colors and Article Numbers

| Kolor | Kod / PIND / PT | Wykończenie | Numer artykułu |
|---|---|---|---|
| Grey | PT-97892-1 | - STANDARD - |  |
| Navy | PT-5011717-1 | - STANDARD - |  |

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
100% AriPam uv resistant pique fabric - Ari Pike - Ariteks
Lining, 3 Layer Laminated, Waterproof Breatheable Fabrics
Cloth Technical Textiles
Ari Pike
210 gr/m
2
, 100% AriPam, Uv protective, Pique Knit Fabric
100% AriPam pique knit fabric. It is used as a lining inside of the shoes.
Ari Pike can also be used on promotional t-shirts.
Technical Parameters
Fiber
100% AriPam
EN ISO 2076
Yarn
30/1 Ne
EN ISO 2060
Weight
210 ±10 gr/m
2
EN ISO 3081
Width
1700 ±20 mm
EN ISO 3932
Bursting strength
> 1400 kPa(kN/m
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
Lining for shoes
Quality Management
Done
ISO 9001
Uv Protection
Done
EN ISO 13758
Technical Documents
>> Ari Pike Data Sheet
Certificates
Applications
Functions
Care Instructions
Colors and Article Numbers
Grey
PT-97892-1
- STANDARD -
Ari Pike - 5928
Navy
PT-5011717-1
- STANDARD -
Ari Pike- 5929
Home
>
Products
>
Cloth
>
Ari Pike
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