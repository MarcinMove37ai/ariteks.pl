# Mapa danych produktu — ArDiLight

Wygenerowano: 2026-07-12T15:47:41

## Cel

Ten dokument opisuje kompletny zestaw danych potrzebny do stworzenia nowej strony produktu. Dane pochodzą jednocześnie ze strony zbiorczej kategorii i z podstrony produktu.

## Źródła

- Strona kategorii: https://www.ariteks.net/home-technical-textiles.asp
- Strona produktu: https://www.ariteks.net/ardilight.asp
- Publiczny manifest JSON: `/ariteks/fabrics/ardilight/data/fabric-complete-record.json`
- Folder public: `C:\Projekty\galia-navi\public\ariteks\fabrics\ardilight`

## 1. Dane ze strony zbiorczej kategorii

- Grupa: ****
- Nazwa w tabeli kategorii: **ArDiLight**
- Wiersz tabeli: `-1`
- Tekst wiersza: 350 g/m² 46% PES 4% EL 50% PVC ArDiLight Interlock

### 1.1. Dane skrócone z wiersza

- Gramatura: `350 g/m²`
- Skład: `46% PES 4% EL 50% PVC`
- Splot / struktura: `Interlock`

### 1.2. Dokument grupy

- Brak wykrytego dokumentu grupy.

### 1.3. Technologia / partner

- Brak.

### 1.4. Piktogramy norm z wiersza kategorii

- Brak.

### 1.5. Struktura / splot z wiersza kategorii

- Nazwa splotu: ``

### 1.6. Kolory skrócone z wiersza kategorii

- Brak / kolory pełne znajdują się na podstronie produktu.

---

## 2. Dane z podstrony produktu

- Nazwa handlowa: **ArDiLight**
- Opis z title: `Stretch Ceiling PVC Fabric`
- Linia specyfikacji: `350 g/m², 46% Polyester 4% Elastane 50% PVC, Stretch Ceiling Fabric Flexible, pvc stretch ceiling fabric systems`

### 2.1. Hero / duże zdjęcie

- Brak wykrytego hero image.

### 2.2. Opis

- No need for special profiles nor heating during start-up.
- No insect accumulation during time.
- Very fast start-up.
- No shrinkage due to heat stabilized fabric system.
- More homojenious light distribution.
- Suitable for digital printing

### 2.3. Tabela parametrów technicznych

| Parametr | Wartość | Norma |
|---|---|---|
| Fiber | 46% Polyester (PES) 4% Elastane (EL) 50% PVC | EN ISO 2076 |
| Yarn | 75 Denier | EN ISO 2060 |
| Weight | 350 ±5 g/m² | EN ISO 3081 |
| Width | 1800 ±20 mm | EN ISO 3932 |
| Bursting strength | > 1500 kPa (kN/m² ) | EN ISO 13938-1 |
| Dimensional Change | -5% < Length < +5% ; -5% < Width < +5% | EN ISO 5077 |
| Flame Retardancy | B1 | DIN 4102-1 |
| Uv Permeability | < 1% | AATCC 183 |
| Working Temperature | -30'C to 70'C | DIN 4102-1 |
| Application | Stretch Ceiling |  |
| Quality Management | Done | ISO 9001 |

### 2.4. Technical Documents

- Brak data sheet.

### 2.5. Certificates / test reports

- Brak.

### 2.6. Applications — galeria

- Ardilight
  - Public: `/ariteks/fabrics/ardilight/images/ardilight-ss__1f123b5ab4.jpg`
- Stretch Ceiling 2
  - Public: `/ariteks/fabrics/ardilight/images/ardilight-pic2-s__58a9e73644.jpg`
- Stretch Ceiling 3
  - Public: `/ariteks/fabrics/ardilight/images/ardilight-pic3-s__3f052b722d.jpg`
- Stretch Ceiling 9
  - Public: `/ariteks/fabrics/ardilight/images/ardilight-pic9-s__f60395cae1.jpg`

### 2.7. Functions — ikony funkcji

- Oeko Teks Standard 100
  - Public: `/ariteks/fabrics/ardilight/images/oekoteks-standard-100-s__ea5e91d474.jpg`
- Recyclable
  - Public: `/ariteks/fabrics/ardilight/images/recyclable__4ea56600e8.jpg`
- Flame Retardant
  - Public: `/ariteks/fabrics/ardilight/images/en-14116__43b497ecc3.jpg`
- Stretchable
  - Public: `/ariteks/fabrics/ardilight/images/stretchable__0596a42c8d.jpg`
- Uniform Light
  - Public: `/ariteks/fabrics/ardilight/images/uniform-light__ec120505d2.jpg`

### 2.8. Care Instructions

- No Wash
  - Public: `/ariteks/fabrics/ardilight/images/no-wash__8141132449.jpg`
- No Chlorine Based Bleaching
  - Public: `/ariteks/fabrics/ardilight/images/no-chlorine-bleach__33a0308671.jpg`
- No Tumble Dry
  - Public: `/ariteks/fabrics/ardilight/images/no-tumble-dry__ff651379f2.jpg`
- No Iron
  - Public: `/ariteks/fabrics/ardilight/images/no-iron__ddbff3d85e.jpg`
- No Dry Cleaning
  - Public: `/ariteks/fabrics/ardilight/images/no-dry-cleaning__4f513b6eb5.jpg`

### 2.9. Colors and Article Numbers

| Kolor | Kod / PIND / PT | Wykończenie | Numer artykułu |
|---|---|---|---|
| White |  |  | PTO-10275 |
| - STANDART - |  |  | ArDiLight-4224 |

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
Stretch Ceiling PVC Fabric - ArDiLight - Ariteks
Pvc coated semi transparent stretch ceiling fabrics for soft and diffuse light systems.
Home Technical Textiles
ArDiLight
350 gr/m
2
, 46% Polyester 4% Elastane 50% PVC, Stretch Ceiling Fabric
Flexible, pvc stretch ceiling fabric systems.
No need for special profiles nor heating during start-up.
No insect accumulation during time.
Very fast start-up.
No shrinkage due to heat stabilized fabric system.
More homojenious light distribution.
Suitable for digital printing
Technical Parameters
Fiber
46% Polyester (PES) 4% Elastane (EL) 50% PVC
EN ISO 2076
Yarn
75 Denier
EN ISO 2060
Weight
350 ±5 gr/m
2
EN ISO 3081
Width
1800 ±20 mm
EN ISO 3932
Bursting strength
> 1500 kPa (kN/m
2
)
EN ISO 13938-1
Dimensional Change
-5% < Length < +5% ; -5% < Width < +5%
EN ISO 5077
Flame Retardancy
B1
DIN 4102-1
Uv Permeability
< 1%
AATCC 183
Working Temperature
-30'C to 70'C
DIN 4102-1
Transmittance at 550 nm
Reflectance at 550 nm
Absorbance at 550 nm
Application
Stretch Ceiling
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
ArDiLight-4224
Home
>
Products
>
Home
>
ArDiLight
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