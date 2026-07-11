# Mapa danych produktu — ArSport El

Wygenerowano: 2026-07-10T19:23:22

## Cel

Ten dokument opisuje kompletny zestaw danych potrzebny do stworzenia nowej strony produktu. Dane pochodzą jednocześnie ze strony zbiorczej kategorii i z podstrony produktu.

## Źródła

- Strona kategorii: https://www.ariteks.net/sport-technical-textiles.asp
- Strona produktu: https://www.ariteks.net/arsport-el.asp
- Publiczny manifest JSON: `/ariteks/fabrics/arsport-el/data/fabric-complete-record.json`
- Folder public: `E:\ariteks\new\sport\public\ariteks\fabrics\arsport-el`

## 1. Dane ze strony zbiorczej kategorii

- Grupa: **Functional knit interlock polyester fabrics.**
- Nazwa w tabeli kategorii: **ArSport El**
- Wiersz tabeli: `168`
- Tekst wiersza: 240 g/m² 92% PES 8% EL ArSport El Interlock

### 1.1. Dane skrócone z wiersza

- Gramatura: `240 g/m²`
- Skład: `92% PES 8% EL`
- Splot / struktura: `Interlock`

### 1.2. Dokument grupy

- [https://www.ariteks.net/pdf/Arsport2_ru_ds_ver2.pdf](/ariteks/fabrics/arsport-el/documents/arsport2-ru-ds-ver2__a2dd65e3e0.pdf)
  - Public: `/ariteks/fabrics/arsport-el/documents/arsport2-ru-ds-ver2__a2dd65e3e0.pdf`

### 1.3. Technologia / partner

- Brak.

### 1.4. Piktogramy norm z wiersza kategorii

- EN 20471
  - Public: `/ariteks/fabrics/arsport-el/images/en-20471__b3c86afe25.jpg`

### 1.5. Struktura / splot z wiersza kategorii

- Nazwa splotu: `Interlock`
- Grafika struktury: `/ariteks/fabrics/arsport-el/images/knit__71fef29325.jpg`

### 1.6. Kolory skrócone z wiersza kategorii

| Kolor / wartość | Opis |
|---|---|
| `rgb(255, 255, 0)` |  |
| `rgb(255, 110, 6)` |  |
| `rgb(255, 0, 0)` |  |

---

## 2. Dane z podstrony produktu

- Nazwa handlowa: **ArSport El**
- Opis z title: `Polyester Elastane Interlock Knit Fabric`
- Linia specyfikacji: `240 g/m², 92% Polyester 8% Elastane Interlock Knit Fabric`

### 2.1. Hero / duże zdjęcie

- ArSport El, elastic knit fabric
  - Public: `/ariteks/fabrics/arsport-el/images/arsport-el-main-pic-m__3cb552b0ef.jpg`

### 2.2. Opis

- ArSport El elastic interlock knit fabric for team uniforms. With high content of elastane the fabric give extra confort to the wearer. Certified for EN 20471.
- It is suitable for sublimation printing.

### 2.3. Tabela parametrów technicznych

| Parametr | Wartość | Norma |
|---|---|---|
| Fiber | 92% Polyester 8% Elastane (PES) | TS EN ISO 1833 |
| Yarn | 75/72 Denier | EN ISO 2060 |
| Weight | 240 ±10 g/m² | TS EN 12127 |
| Width | 1800 ±20 mm | TS EN 1773 |
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
| pH | 4-9 | EN ISO 3071 |
| Azo Test | No Azo Colorants. | EN ISO 14362-1 |
| Application | T-Shirt |  |
| Quality Management | Done | ISO 9001 |
| High Visible | Yes | EN 20471 |

### 2.4. Technical Documents

- [>> ArSport El Data Sheet](/ariteks/fabrics/arsport-el/documents/arsport-el-ds__0d219aa7f2.pdf)
  - Public: `/ariteks/fabrics/arsport-el/documents/arsport-el-ds__0d219aa7f2.pdf`

### 2.5. Certificates / test reports

- Brak.

### 2.6. Applications — galeria

- Brak albo nierozpoznane jako application_image.

### 2.7. Functions — ikony funkcji

- Oeko Tex Standard 100
  - Public: `/ariteks/fabrics/arsport-el/images/oekoteks-standard-100-s__ea5e91d474.jpg`
- High Visible
  - Public: `/ariteks/fabrics/arsport-el/images/en-20471__b3c86afe25.jpg`

### 2.8. Care Instructions

- 60'C Machine Wash
  - Public: `/ariteks/fabrics/arsport-el/images/60-mach-wash-ma-agi__cdc86ecf03.jpg`
- No Chlorine Based Bleaching
  - Public: `/ariteks/fabrics/arsport-el/images/no-chlorine-bleach__33a0308671.jpg`
- Can Be Tumble Dried On Low Heat Setting
  - Public: `/ariteks/fabrics/arsport-el/images/tumble-dried-low-ht__cd432a52a7.jpg`
- Maximum 150'C Warm Iron
  - Public: `/ariteks/fabrics/arsport-el/images/ma-150-iron__78883199be.jpg`
- Suitable for Dry Cleaning
  - Public: `/ariteks/fabrics/arsport-el/images/dry-cleaning__6e8a85520f.jpg`

### 2.9. Colors and Article Numbers

| Kolor | Kod / PIND / PT | Wykończenie | Numer artykułu |
|---|---|---|---|
| Yellow | PT-23603-1 | - HIGH VISIBLE - | ArSport El-5767 |
| Orange | PT-22970-1 | - HIGH VISIBLE - | ArSport El-5768 |
| Red | PT-33280-1 | - HIGH VISIBLE - | ArSport El-5769 |

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
Polyester Elastane Interlock Knit Fabric - ArSport El - Ariteks
Track suits, 3*1 and 2*2 light weight mesh, team uniform, bird eye pattern polyester fabrics.
Sport Technical Textiles
ArSport El
240 gr/m
2
, 92% Polyester 8% Elastane Interlock Knit Fabric
ArSport El elastic interlock knit fabric for team uniforms.
With high content of elastane the fabric give extra confort to the wearer. Certified for EN 20471.
It is suitable for sublimation printing.
Technical Parameters
Fiber
92% Polyester 8% Elastane (PES)
TS EN ISO 1833
Yarn
75/72 Denier
EN ISO 2060
Weight
240 ±10 gr/m
2
TS EN 12127
Width
1800 ±20 mm
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
4-9
EN ISO 3071
Azo Test
No Azo Colorants.
EN ISO 14362-1
Application
T-Shirt
Quality Management
Done
ISO 9001
High Visible
Yes
EN 20471
Technical Documents
>> ArSport El Data Sheet
Certificates
Applications
Functions
Care Instructions
Colors and Article Numbers
Yellow
PT-23603-1
- HIGH VISIBLE -
ArSport El-5767
Orange
PT-22970-1
- HIGH VISIBLE -
ArSport El-5768
Red
PT-33280-1
- HIGH VISIBLE -
ArSport El-5769
Home
>
Products
>
Sport
>
ArSport El
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