# Mapa danych produktu — ArDigiPrint

Wygenerowano: 2026-07-12T14:11:22

## Cel

Ten dokument opisuje kompletny zestaw danych potrzebny do stworzenia nowej strony produktu. Dane pochodzą jednocześnie ze strony zbiorczej kategorii i z podstrony produktu.

## Źródła

- Strona kategorii: https://www.ariteks.net/building-technical-textiles.asp
- Strona produktu: https://www.ariteks.net/ardigiprint.asp
- Publiczny manifest JSON: `/ariteks/fabrics/ardigiprint/data/fabric-complete-record.json`
- Folder public: `C:\Projekty\galia-navi\public\ariteks\fabrics\ardigiprint`

## 1. Dane ze strony zbiorczej kategorii

- Grupa: ****
- Nazwa w tabeli kategorii: **ArDigiPrint**
- Wiersz tabeli: `73`
- Tekst wiersza: 250 g/m² 100% PES ArDigiPrint Interlock

### 1.1. Dane skrócone z wiersza

- Gramatura: `250 g/m²`
- Skład: `100% PES`
- Splot / struktura: `Interlock`

### 1.2. Dokument grupy

- Brak wykrytego dokumentu grupy.

### 1.3. Technologia / partner

- Brak.

### 1.4. Piktogramy norm z wiersza kategorii

- Stretchable
  - Public: `/ariteks/fabrics/ardigiprint/images/stretchable__0596a42c8d.jpg`
- Less Steel Usage
  - Public: `/ariteks/fabrics/ardigiprint/images/less-steel-usage__1777345555.jpg`

### 1.5. Struktura / splot z wiersza kategorii

- Nazwa splotu: `Interlock`
- Grafika struktury: `/ariteks/fabrics/ardigiprint/images/knit__71fef29325.jpg`

### 1.6. Kolory skrócone z wiersza kategorii

| Kolor / wartość | Opis |
|---|---|
| `rgb(255, 255, 255)` |  |

---

## 2. Dane z podstrony produktu

- Nazwa handlowa: **ArDigiPrint**
- Opis z title: `Flexible Fabric for Digital Printing`
- Linia specyfikacji: `250 g/m², 100% Polyester, Flexible Fabric for Digital Printing 100% Polyester flexible fabrics for digital printing`

### 2.1. Hero / duże zdjęcie

- Brak wykrytego hero image.

### 2.2. Opis

- Suitable for sublimation printing.
- Can be stretched on widht and length wise.

### 2.3. Tabela parametrów technicznych

| Parametr | Wartość | Norma |
|---|---|---|
| Fiber | 100% Polyester (PES) | EN ISO 2076 |
| Yarn | 100*2 Denier | EN ISO 2060 |
| Weight | 250 ±5 g/m² | EN ISO 3081 |
| Width | 1800 ±20 mm | EN ISO 3932 |
| Bursting strength | > 1100 kPa (kN/m² ) | EN ISO 13938-1 |
| Dimensional Change | -5% < Length < +5% ; -5% < Width < +5% | EN ISO 5077 |
| Rubbing Fastness | 4-5 | EN ISO 105 X12 |
| Perspiration Fastness | 4-5 | EN ISO 105 E04 |
| Washing Fastness | 4-5 | EN ISO 105 C06 |
| Dry Cleaning Fastness | 4-5 | EN ISO 105 D01 |
| Hypochlorite Fastness | 4-5 | EN ISO 105 N01 |
| Hot Press Fastness | 4-5 | EN ISO 105 X11 |
| Light Fastness | 7 | EN ISO 105 B02 |
| pH | 6.2 | EN ISO 3071 |
| Azo Test | No Azo Colorants. | EN ISO 14362-1 |
| Application | Digital Printing |  |
| Quality Management | Done | ISO 9001 |

### 2.4. Technical Documents

- Brak data sheet.

### 2.5. Certificates / test reports

- Brak.

### 2.6. Applications — galeria

- ArDigiPrint
  - Public: `/ariteks/fabrics/ardigiprint/images/ardigiprint-mm__c5186ac475.jpg`
- Digital Printing Fabrics
  - Public: `/ariteks/fabrics/ardigiprint/images/ardigiprint-pic6-s__371e45d7e1.jpg`
- Digital Printing Fabrics
  - Public: `/ariteks/fabrics/ardigiprint/images/ardigiprint-pic4-s__c7d23a8c88.jpg`
- Digital Printing Fabrics
  - Public: `/ariteks/fabrics/ardigiprint/images/ardigiprint-pic11-s__1a4d114b67.jpg`

### 2.7. Functions — ikony funkcji

- Oeko Teks Standard 100
  - Public: `/ariteks/fabrics/ardigiprint/images/oekoteks-standard-100-s__ea5e91d474.jpg`
- Stretchable
  - Public: `/ariteks/fabrics/ardigiprint/images/stretchable__0596a42c8d.jpg`
- Less Steel Usage
  - Public: `/ariteks/fabrics/ardigiprint/images/less-steel-usage__1777345555.jpg`

### 2.8. Care Instructions

- 60'C Machine Wash
  - Public: `/ariteks/fabrics/ardigiprint/images/60-mach-wash-ma-agi__cdc86ecf03.jpg`
- No Chlorine Based Bleaching
  - Public: `/ariteks/fabrics/ardigiprint/images/no-chlorine-bleach__33a0308671.jpg`
- Drip Dry
  - Public: `/ariteks/fabrics/ardigiprint/images/drip-dry__a3b1d54d76.jpg`
- Maximum 150'C Warm Iron
  - Public: `/ariteks/fabrics/ardigiprint/images/ma-150-iron__78883199be.jpg`
- Suitable for Dry Cleaning
  - Public: `/ariteks/fabrics/ardigiprint/images/dry-cleaning__6e8a85520f.jpg`

### 2.9. Colors and Article Numbers

| Kolor | Kod / PIND / PT | Wykończenie | Numer artykułu |
|---|---|---|---|
| White |  |  | PTO-10275 |
| - STANDART - |  |  | ArDigiPrint-2419 |

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
Flexible Fabric for Digital Printing - ArDigiPrint -Ariteks
Products related to isolation, roofing systems and
advertising media. Military and Disaster Tents Fabric.
Building Technical Textiles
ArDigiPrint
250 gr/m
2
, 100% Polyester, Flexible Fabric for Digital Printing
100% Polyester flexible fabrics for digital printing.
Suitable for sublimation printing.
Can be stretched on widht and length wise.
Technical Parameters
Fiber
100% Polyester (PES)
EN ISO 2076
Yarn
100*2 Denier
EN ISO 2060
Weight
250 ±5 gr/m
2
EN ISO 3081
Width
1800 ±20 mm
EN ISO 3932
Bursting strength
> 1100 kPa (kN/m
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
Light Fastness
7
EN ISO 105 B02
pH
6.2
EN ISO 3071
Azo Test
No Azo Colorants.
EN ISO 14362-1
Application
Digital Printing
Quality Management
Done
ISO 9001
Technical Documents
Certificates
Applications
Functions
Safe Textile
Care Instructions
Colors and Article Numbers
White
PTO-10275-1
- STANDART -
ArDigiPrint-2419
Home
>
Products
>
Building
>
ArDigiPrint
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