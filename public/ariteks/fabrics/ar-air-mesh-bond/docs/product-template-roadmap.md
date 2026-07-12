# Mapa danych produktu — ArAir Mesh Bond

Wygenerowano: 2026-07-12T14:12:31

## Cel

Ten dokument opisuje kompletny zestaw danych potrzebny do stworzenia nowej strony produktu. Dane pochodzą jednocześnie ze strony zbiorczej kategorii i z podstrony produktu.

## Źródła

- Strona kategorii: https://www.ariteks.net/transport-technical-textiles.asp
- Strona produktu: https://www.ariteks.net/ar-air-mesh-bond.asp
- Publiczny manifest JSON: `/ariteks/fabrics/ar-air-mesh-bond/data/fabric-complete-record.json`
- Folder public: `C:\Projekty\galia-navi\public\ariteks\fabrics\ar-air-mesh-bond`

## 1. Dane ze strony zbiorczej kategorii

- Grupa: **3D Air Mesh Fabrics**
- Nazwa w tabeli kategorii: **ArAir Mesh Bond**
- Wiersz tabeli: `115`
- Tekst wiersza: 230 g/m² 100% PES ArAir Mesh Bond Mesh

### 1.1. Dane skrócone z wiersza

- Gramatura: `230 g/m²`
- Skład: `100% PES`
- Splot / struktura: `Mesh`

### 1.2. Dokument grupy

- [https://www.ariteks.net/pdf/ArAirMesh_ru_ds_ver2.pdf](/ariteks/fabrics/ar-air-mesh-bond/documents/arairmesh-ru-ds-ver2__db6f079a0c.pdf)
  - Public: `/ariteks/fabrics/ar-air-mesh-bond/documents/arairmesh-ru-ds-ver2__db6f079a0c.pdf`

### 1.3. Technologia / partner

- Brak.

### 1.4. Piktogramy norm z wiersza kategorii

- Brak.

### 1.5. Struktura / splot z wiersza kategorii

- Nazwa splotu: `Mesh`
- Grafika struktury: `/ariteks/fabrics/ar-air-mesh-bond/images/warp-knit__22376b13e5.jpg`

### 1.6. Kolory skrócone z wiersza kategorii

| Kolor / wartość | Opis |
|---|---|
| `rgb(255, 255, 255)` |  |
| `rgb(0, 0, 0)` |  |
| `rgb(218, 218, 218)` | 120 g/m² 100% PES |

---

## 2. Dane z podstrony produktu

- Nazwa handlowa: **ArAir Mesh Bond**
- Opis z title: `3D Air Mesh Bond Fabric`
- Linia specyfikacji: `230 g/m², 100% Polyester, Air Mesh Open Structure Fabric`

### 2.1. Hero / duże zdjęcie

- ArAirMesh, Air Mesh Fabric
  - Public: `/ariteks/fabrics/ar-air-mesh-bond/images/ar-air-mesh-bond-main-pic-m__564cf5fb97.jpg`

### 2.2. Opis

- 100% polyester, 230 g/m² 3d warp knitted air mesh open structure fabric.
- ArAir Mesh Bond fabric due to its 3d warp knitting structure has high suspension function.
- It can be used as upholstery mesh for office furniture.
- Suitable for sport and military shoes.
- Another application is the acoustic control panels for theatre and cinema walls.

### 2.3. Tabela parametrów technicznych

| Parametr | Wartość | Norma |
|---|---|---|
| Fiber | 100% Polyester (PES) | TS EN ISO 1833 |
| Yarn | 150 Denier | EN ISO 2060 |
| Weight | 230 ±5 g/m² | TS EN 12127 |
| Width | 1500 ±20 mm | TS EN 1773 |
| Bursting strength | > 2000 kPa (kN/m² ) | TS EN 13938-1 |
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
| Application | Uphosltery, Bag, Shoes |  |
| Quality Management | Done | ISO 9001 |

### 2.4. Technical Documents

- [>> ArAir Mesh Bond Data Sheet](/ariteks/fabrics/ar-air-mesh-bond/documents/arairmesh-bond-ds__d05c323999.pdf)
  - Public: `/ariteks/fabrics/ar-air-mesh-bond/documents/arairmesh-bond-ds__d05c323999.pdf`

### 2.5. Certificates / test reports

- Brak.

### 2.6. Applications — galeria

- Brak albo nierozpoznane jako application_image.

### 2.7. Functions — ikony funkcji

- Oeko Tex Standard 100
  - Public: `/ariteks/fabrics/ar-air-mesh-bond/images/oekoteks-standard-100-s__ea5e91d474.jpg`

### 2.8. Care Instructions

- 30'C Machine Wash
  - Public: `/ariteks/fabrics/ar-air-mesh-bond/images/30-mach-wash-min-agi__f57e5d6f66.jpg`
- No Chlorine Based Bleaching
  - Public: `/ariteks/fabrics/ar-air-mesh-bond/images/no-chlorine-bleach__33a0308671.jpg`
- Drip Dry
  - Public: `/ariteks/fabrics/ar-air-mesh-bond/images/drip-dry__a3b1d54d76.jpg`
- No Iron
  - Public: `/ariteks/fabrics/ar-air-mesh-bond/images/no-iron__ddbff3d85e.jpg`
- Not Suitable for Dry Cleaning
  - Public: `/ariteks/fabrics/ar-air-mesh-bond/images/no-dry-cleaning__4f513b6eb5.jpg`

### 2.9. Colors and Article Numbers

| Kolor | Kod / PIND / PT | Wykończenie | Numer artykułu |
|---|---|---|---|
| White |  |  | PT0-10275 |
| Black | PT-95503 | - STANDARD - | ArAir Mesh Bond-5336 |

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
3D Air Mesh Bond Fabric - ArAir Mesh Bond - Ariteks
3D Air Mesh, upholstery fabrics.
Transport Technical Textiles
ArAir Mesh Bond
230 gr/m
2
, 100% Polyester, Air Mesh Open Structure Fabric
100% polyester, 230 g/m² 3d warp knitted air mesh open structure fabric.
ArAir Mesh Bond fabric due to its 3d warp knitting structure has high suspension function.
It can be used as upholstery mesh for office furniture.
Suitable for sport and military shoes.
Another application is the acoustic control panels for theatre and cinema walls.
Technical Parameters
Fiber
100% Polyester (PES)
TS EN ISO 1833
Yarn
150 Denier
EN ISO 2060
Weight
230 ±5 gr/m
2
TS EN 12127
Width
1500 ±20 mm
TS EN 1773
Thickness
3 mm
BS 2544
Bursting strength
> 2000 kPa (kN/m
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
Uphosltery, Bag, Shoes
Quality Management
Done
ISO 9001
Technical Documents
>> ArAir Mesh Bond Data Sheet
Certificates
Applications
Functions
Care Instructions
Colors and Article Numbers
White
PT0-10275
- STANDARD -
ArAir Mesh Bond-5335
Black
PT-95503
- STANDARD -
ArAir Mesh Bond-5336
Home
>
Products
>
Transport
>
ArAir Mesh Bond
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