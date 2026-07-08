# Mapa drogowa alternatywnej strony certyfikatów Ariteks

Wygenerowano: 2026-07-08T14:12:53

## Cel dokumentu

Ten dokument opisuje, jak odtworzyć alternatywną stronę certyfikatów na podstawie pobranej treści, grafik i dokumentów. Ma być jasne, co wyświetlać na stronie, co otwierać w nowej karcie i co udostępniać do pobrania.

## Źródła danych

- Źródłowa strona: https://www.ariteks.net/certificate.asp
- Publiczny katalog strony: `D:\Ariteks\ariteks_www\public\ariteks\certificates`
- Publiczny URL bazowy: `/ariteks/certificates`
- Manifest publiczny JSON: `/ariteks/certificates/data/certificate-page-public-manifest.json`

## Podsumowanie

- Liczba pozycji certyfikatów / plików: **39**
- Liczba norm i testów: **50**
- Liczba skopiowanych plików publicznych: **48**
- Liczba brakujących plików: **0**

## Zalecana struktura nowej strony

### 1. Nagłówek strony

- Tytuł PL: `Certyfikaty i testy`
- Podtytuł: krótka informacja, że dokumenty potwierdzają zgodność materiałów, procesów i wybranych właściwości technicznych.
- Nie trzeba odtwarzać starego układu tabelkowego; lepiej użyć czytelnej siatki kart.

### 2. Sekcja certyfikatów

Każdy certyfikat powinien być kartą:

- ikona/grafika certyfikatu z `card_image.public_url`,
- nazwa certyfikatu z `label_display`,
- przycisk główny według `ui.button_label_pl`,
- opcjonalny przycisk pobierania według `ui.download_label_pl`,
- kliknięcie powinno używać `target.public_url`.

### 3. Zachowanie kliknięć

| Typ celu | Co robić | Dlaczego |
|---|---|---|
| PDF / dokument | Otwierać w nowej karcie (`target="_blank"`) i opcjonalnie dać `Pobierz PDF` | Użytkownik może obejrzeć certyfikat bez opuszczania strony |
| JPG/PNG / duża grafika | Otwierać w nowej karcie albo lightboxie | To są certyfikaty lub potwierdzenia w formie obrazu |
| Ikona karty | Tylko wyświetlać na karcie | Ikona nie musi być osobno pobierana |

### 4. Sekcja norm i testów

Normy nie są plikami do pobrania. Powinny być wyświetlone jako tabele pogrupowane według kategorii:

- **Apparel Textiles** — 27 pozycji
- **Building Technical Textiles** — 4 pozycji
- **Protection Technical Textiles** — 11 pozycji
- **Geology Technical Textiles** — 2 pozycji
- **Medical Technical Textiles** — 6 pozycji

---

## Lista certyfikatów — co wyświetlać i co otwierać

| # | Nazwa na stronie | Ikona/karta | Cel kliknięcia | Akcja |
|---:|---|---|---|---|
| 1 | Yarn Oeko-Tex Certificate 2009 | `/ariteks/certificates/images/oekotex-100__cf2640970f.png` | `/ariteks/certificates/images/yarn-oeko-tex-certificate-2009__2691fd2ecd.jpg` | `open_new_tab` |
| 2 | Fabric Oeko-Tex Certificate 2014 | `/ariteks/certificates/images/oekotex-100__cf2640970f.png` | `/ariteks/certificates/documents/fabric-oeko-tex-certificate-2014__55c0c73c33.pdf` | `open_new_tab` |
| 3 | Textile Organic Production Certificate | `/ariteks/certificates/images/organic-certificate__136e87e27f.png` | `/ariteks/certificates/documents/textile-organic-production-certificate__3b9e606c95.pdf` | `open_new_tab` |
| 4 | C02 emission reduction | `/ariteks/certificates/images/c02-emission-reduction__c42b33b849.png` | `/ariteks/certificates/images/c02-emission-reduction__15e4c8f129.jpg` | `open_new_tab` |
| 5 | Antimicrobial Products | `/ariteks/certificates/images/antimicrobial-products__52364c2ce9.jpg` | `/ariteks/certificates/images/antimicrobial-products__52364c2ce9.jpg` | `open_new_tab` |
| 6 | ISO 9001 Certificate for Corlu Fabric Treatment Plant 2013 | `/ariteks/certificates/images/iso-9001-certificate__0a2b94eb5d.jpg` | `/ariteks/certificates/images/iso-9001-certificate-for-corlu-fabric-treatment-plant-2013__642fcfd5d5.jpg` | `open_new_tab` |
| 7 | Oeko-Tex Certificate 2017 | `/ariteks/certificates/images/oekotex-100__cf2640970f.png` | `/ariteks/certificates/documents/oeko-tex-certificate-2017__2e3d29b2a8.pdf` | `open_new_tab` |
| 8 | Oeko-Tex Certificate 2018 | `/ariteks/certificates/images/oekotex-100__cf2640970f.png` | `/ariteks/certificates/documents/oeko-tex-certificate-2018__ab3b435863.pdf` | `open_new_tab` |
| 9 | Oeko-Tex Certificate 2019 | `/ariteks/certificates/images/oekotex-100__cf2640970f.png` | `/ariteks/certificates/documents/oeko-tex-certificate-2019__9ca59618fa.pdf` | `open_new_tab` |
| 10 | Çevre İzin Belgesi | `/ariteks/certificates/images/cevre-izin-belgesi__e795e0d446.jpg` | `/ariteks/certificates/documents/cevre-izin-belgesi__2b307fbc54.pdf` | `open_new_tab` |
| 11 | ISO 9001 Certificate | `/ariteks/certificates/images/iso-9001__86072b9a0f.png` | `/ariteks/certificates/documents/iso-9001-certificate__854810168d.pdf` | `open_new_tab` |
| 12 | ISO 14001 Certificate | `/ariteks/certificates/images/iso-14001__b1ac088de9.png` | `/ariteks/certificates/documents/iso-14001-certificate__adf712dd59.pdf` | `open_new_tab` |
| 13 | ISO 18001 Certificate | `/ariteks/certificates/images/iso-18001__22b7527d60.png` | `/ariteks/certificates/documents/iso-18001-certificate__3627cddaea.pdf` | `open_new_tab` |
| 14 | ISO 9001 Certificate | `/ariteks/certificates/images/iso-9001__86072b9a0f.png` | `/ariteks/certificates/documents/iso-9001-certificate__a64f95d916.pdf` | `open_new_tab` |
| 15 | ISO 9001 Certificate 2022 | `/ariteks/certificates/images/iso-9001__86072b9a0f.png` | `/ariteks/certificates/documents/iso-9001-certificate-2022__bbf519a301.pdf` | `open_new_tab` |
| 16 | ISO 14001 Certificate 2022 | `/ariteks/certificates/images/iso-14001__b1ac088de9.png` | `/ariteks/certificates/documents/iso-14001-certificate-2022__93d696f1c6.pdf` | `open_new_tab` |
| 17 | ISO 45001 Certificate 2022 | `/ariteks/certificates/images/iso-18001__fcee21e8fd.png` | `/ariteks/certificates/documents/iso-45001-certificate-2022__8adfea0f56.pdf` | `open_new_tab` |
| 18 | ISO 9001 Certificate 2024 | `/ariteks/certificates/images/iso-9001__86072b9a0f.png` | `/ariteks/certificates/documents/iso-9001-certificate-2024__f18ea7e07b.pdf` | `open_new_tab` |
| 19 | ISO 14001 Certificate 2024 | `/ariteks/certificates/images/iso-14001__b1ac088de9.png` | `/ariteks/certificates/documents/iso-14001-certificate-2024__286f3f5b52.pdf` | `open_new_tab` |
| 20 | ISO 45001 Certificate 2024 | `/ariteks/certificates/images/iso-18001__fcee21e8fd.png` | `/ariteks/certificates/documents/iso-45001-certificate-2024__176462b6d0.pdf` | `open_new_tab` |
| 21 | Recycled Claim Standard | `/ariteks/certificates/images/recycled-claim__b49b450a0c.png` | `/ariteks/certificates/documents/recycled-claim-standard__5de76c422c.pdf` | `open_new_tab` |
| 22 | Organic Content Standard | `/ariteks/certificates/images/organic-content__af9dc0bcea.png` | `/ariteks/certificates/documents/organic-content-standard__141077767f.pdf` | `open_new_tab` |
| 23 | Recycled Claim Standard 2021 | `/ariteks/certificates/images/recycled-claim__b49b450a0c.png` | `/ariteks/certificates/documents/recycled-claim-standard-2021__cff9963559.pdf` | `open_new_tab` |
| 24 | Organic Content Standard 2021 | `/ariteks/certificates/images/organic-content__af9dc0bcea.png` | `/ariteks/certificates/documents/organic-content-standard-2021__e2de670357.pdf` | `open_new_tab` |
| 25 | Recycled Claim Standard 2022 | `/ariteks/certificates/images/recycled-claim__b49b450a0c.png` | `/ariteks/certificates/documents/recycled-claim-standard-2022__d3435150a2.pdf` | `open_new_tab` |
| 26 | Organic Content Standard 2022 | `/ariteks/certificates/images/organic-content__af9dc0bcea.png` | `/ariteks/certificates/documents/organic-content-standard-2022__5bb288ec63.pdf` | `open_new_tab` |
| 27 | Recycled Claim Standard 2024 | `/ariteks/certificates/images/recycled-claim__b49b450a0c.png` | `/ariteks/certificates/documents/recycled-claim-standard-2024__871acf5601.pdf` | `open_new_tab` |
| 28 | Organic Content Standard 2024 | `/ariteks/certificates/images/organic-content__af9dc0bcea.png` | `/ariteks/certificates/documents/recycled-claim-standard-2024__871acf5601.pdf` | `open_new_tab` |
| 29 | Recycled Claim Standard 2025 | `/ariteks/certificates/images/recycled-claim__b49b450a0c.png` | `/ariteks/certificates/documents/recycled-claim-standard-2025__99279bb9fc.pdf` | `open_new_tab` |
| 30 | Organic Content Standard 2025 | `/ariteks/certificates/images/organic-content__af9dc0bcea.png` | `/ariteks/certificates/documents/recycled-claim-standard-2025__99279bb9fc.pdf` | `open_new_tab` |
| 31 | Oeko-Tex Certificate 2020 | `/ariteks/certificates/images/oekotex-100__cf2640970f.png` | `/ariteks/certificates/documents/oeko-tex-certificate-2020__b792142038.pdf` | `open_new_tab` |
| 32 | BCI Sytem No:1012459-1 | `/ariteks/certificates/images/bci-better-cotton-initiative__4009e5f2f4.jpg` | `/ariteks/certificates/images/bci-better-cotton-initiative__4009e5f2f4.jpg` | `open_new_tab` |
| 33 | Oeko-Tex Certificate 2021 Cotton, Viscose, Elastane | `/ariteks/certificates/images/oekotex-100__cf2640970f.png` | `/ariteks/certificates/documents/oeko-tex-certificate-2021-cotton-viscose-elastane__65e1f11f18.pdf` | `open_new_tab` |
| 34 | Oeko-Tex Certificate 2021 Polyester, Elastane | `/ariteks/certificates/images/oekotex-100__cf2640970f.png` | `/ariteks/certificates/documents/oeko-tex-certificate-2021-polyester-elastane__8f3149c069.pdf` | `open_new_tab` |
| 35 | Oeko-Tex Certificate 2022 Cotton, Viscose, Elastane | `/ariteks/certificates/images/oekotex-100__cf2640970f.png` | `/ariteks/certificates/documents/oeko-tex-certificate-2022-cotton-viscose-elastane__a817d1b710.pdf` | `open_new_tab` |
| 36 | Oeko-Tex Certificate 2023 Cotton, Viscose, Polyester | `/ariteks/certificates/images/oekotex-100__cf2640970f.png` | `/ariteks/certificates/documents/oeko-tex-certificate-2023-cotton-viscose-polyester__5ab10b57eb.pdf` | `open_new_tab` |
| 37 | Oeko-Tex Certificate 2024 Cotton, Viscose, Polyester | `/ariteks/certificates/images/oekotex-100__cf2640970f.png` | `/ariteks/certificates/documents/oeko-tex-certificate-2024-cotton-viscose-polyester__a22be4203f.pdf` | `open_new_tab` |
| 38 | Oeko-Tex Certificate 2025 Cotton, Viscose, Polyester | `/ariteks/certificates/images/oekotex-100__cf2640970f.png` | `/ariteks/certificates/documents/oeko-tex-certificate-2025-cotton-viscose-polyester__9b13439013.pdf` | `open_new_tab` |
| 39 | Oeko-Tex Certificate 2025 Cotton, Viscose, Polyester Fabric | `/ariteks/certificates/images/oekotex-100__cf2640970f.png` | `/ariteks/certificates/documents/oeko-tex-certificate-2025-cotton-viscose-polyester-fabric__965a080232.pdf` | `open_new_tab` |

---

## Dokumenty PDF / pliki do otwierania w nowej karcie

### 2. Fabric Oeko-Tex Certificate 2014

- Wyświetlana ikona: `/ariteks/certificates/images/oekotex-100__cf2640970f.png`
- Dokument: `/ariteks/certificates/documents/fabric-oeko-tex-certificate-2014__55c0c73c33.pdf`
- Akcja główna: otwórz w nowej karcie
- Akcja dodatkowa: pobierz PDF

### 3. Textile Organic Production Certificate

- Wyświetlana ikona: `/ariteks/certificates/images/organic-certificate__136e87e27f.png`
- Dokument: `/ariteks/certificates/documents/textile-organic-production-certificate__3b9e606c95.pdf`
- Akcja główna: otwórz w nowej karcie
- Akcja dodatkowa: pobierz PDF

### 7. Oeko-Tex Certificate 2017

- Wyświetlana ikona: `/ariteks/certificates/images/oekotex-100__cf2640970f.png`
- Dokument: `/ariteks/certificates/documents/oeko-tex-certificate-2017__2e3d29b2a8.pdf`
- Akcja główna: otwórz w nowej karcie
- Akcja dodatkowa: pobierz PDF

### 8. Oeko-Tex Certificate 2018

- Wyświetlana ikona: `/ariteks/certificates/images/oekotex-100__cf2640970f.png`
- Dokument: `/ariteks/certificates/documents/oeko-tex-certificate-2018__ab3b435863.pdf`
- Akcja główna: otwórz w nowej karcie
- Akcja dodatkowa: pobierz PDF

### 9. Oeko-Tex Certificate 2019

- Wyświetlana ikona: `/ariteks/certificates/images/oekotex-100__cf2640970f.png`
- Dokument: `/ariteks/certificates/documents/oeko-tex-certificate-2019__9ca59618fa.pdf`
- Akcja główna: otwórz w nowej karcie
- Akcja dodatkowa: pobierz PDF

### 10. Çevre İzin Belgesi

- Wyświetlana ikona: `/ariteks/certificates/images/cevre-izin-belgesi__e795e0d446.jpg`
- Dokument: `/ariteks/certificates/documents/cevre-izin-belgesi__2b307fbc54.pdf`
- Akcja główna: otwórz w nowej karcie
- Akcja dodatkowa: pobierz PDF

### 11. ISO 9001 Certificate

- Wyświetlana ikona: `/ariteks/certificates/images/iso-9001__86072b9a0f.png`
- Dokument: `/ariteks/certificates/documents/iso-9001-certificate__854810168d.pdf`
- Akcja główna: otwórz w nowej karcie
- Akcja dodatkowa: pobierz PDF

### 12. ISO 14001 Certificate

- Wyświetlana ikona: `/ariteks/certificates/images/iso-14001__b1ac088de9.png`
- Dokument: `/ariteks/certificates/documents/iso-14001-certificate__adf712dd59.pdf`
- Akcja główna: otwórz w nowej karcie
- Akcja dodatkowa: pobierz PDF

### 13. ISO 18001 Certificate

- Wyświetlana ikona: `/ariteks/certificates/images/iso-18001__22b7527d60.png`
- Dokument: `/ariteks/certificates/documents/iso-18001-certificate__3627cddaea.pdf`
- Akcja główna: otwórz w nowej karcie
- Akcja dodatkowa: pobierz PDF

### 14. ISO 9001 Certificate

- Wyświetlana ikona: `/ariteks/certificates/images/iso-9001__86072b9a0f.png`
- Dokument: `/ariteks/certificates/documents/iso-9001-certificate__a64f95d916.pdf`
- Akcja główna: otwórz w nowej karcie
- Akcja dodatkowa: pobierz PDF

### 15. ISO 9001 Certificate 2022

- Wyświetlana ikona: `/ariteks/certificates/images/iso-9001__86072b9a0f.png`
- Dokument: `/ariteks/certificates/documents/iso-9001-certificate-2022__bbf519a301.pdf`
- Akcja główna: otwórz w nowej karcie
- Akcja dodatkowa: pobierz PDF

### 16. ISO 14001 Certificate 2022

- Wyświetlana ikona: `/ariteks/certificates/images/iso-14001__b1ac088de9.png`
- Dokument: `/ariteks/certificates/documents/iso-14001-certificate-2022__93d696f1c6.pdf`
- Akcja główna: otwórz w nowej karcie
- Akcja dodatkowa: pobierz PDF

### 17. ISO 45001 Certificate 2022

- Wyświetlana ikona: `/ariteks/certificates/images/iso-18001__fcee21e8fd.png`
- Dokument: `/ariteks/certificates/documents/iso-45001-certificate-2022__8adfea0f56.pdf`
- Akcja główna: otwórz w nowej karcie
- Akcja dodatkowa: pobierz PDF

### 18. ISO 9001 Certificate 2024

- Wyświetlana ikona: `/ariteks/certificates/images/iso-9001__86072b9a0f.png`
- Dokument: `/ariteks/certificates/documents/iso-9001-certificate-2024__f18ea7e07b.pdf`
- Akcja główna: otwórz w nowej karcie
- Akcja dodatkowa: pobierz PDF

### 19. ISO 14001 Certificate 2024

- Wyświetlana ikona: `/ariteks/certificates/images/iso-14001__b1ac088de9.png`
- Dokument: `/ariteks/certificates/documents/iso-14001-certificate-2024__286f3f5b52.pdf`
- Akcja główna: otwórz w nowej karcie
- Akcja dodatkowa: pobierz PDF

### 20. ISO 45001 Certificate 2024

- Wyświetlana ikona: `/ariteks/certificates/images/iso-18001__fcee21e8fd.png`
- Dokument: `/ariteks/certificates/documents/iso-45001-certificate-2024__176462b6d0.pdf`
- Akcja główna: otwórz w nowej karcie
- Akcja dodatkowa: pobierz PDF

### 21. Recycled Claim Standard

- Wyświetlana ikona: `/ariteks/certificates/images/recycled-claim__b49b450a0c.png`
- Dokument: `/ariteks/certificates/documents/recycled-claim-standard__5de76c422c.pdf`
- Akcja główna: otwórz w nowej karcie
- Akcja dodatkowa: pobierz PDF

### 22. Organic Content Standard

- Wyświetlana ikona: `/ariteks/certificates/images/organic-content__af9dc0bcea.png`
- Dokument: `/ariteks/certificates/documents/organic-content-standard__141077767f.pdf`
- Akcja główna: otwórz w nowej karcie
- Akcja dodatkowa: pobierz PDF

### 23. Recycled Claim Standard 2021

- Wyświetlana ikona: `/ariteks/certificates/images/recycled-claim__b49b450a0c.png`
- Dokument: `/ariteks/certificates/documents/recycled-claim-standard-2021__cff9963559.pdf`
- Akcja główna: otwórz w nowej karcie
- Akcja dodatkowa: pobierz PDF

### 24. Organic Content Standard 2021

- Wyświetlana ikona: `/ariteks/certificates/images/organic-content__af9dc0bcea.png`
- Dokument: `/ariteks/certificates/documents/organic-content-standard-2021__e2de670357.pdf`
- Akcja główna: otwórz w nowej karcie
- Akcja dodatkowa: pobierz PDF

### 25. Recycled Claim Standard 2022

- Wyświetlana ikona: `/ariteks/certificates/images/recycled-claim__b49b450a0c.png`
- Dokument: `/ariteks/certificates/documents/recycled-claim-standard-2022__d3435150a2.pdf`
- Akcja główna: otwórz w nowej karcie
- Akcja dodatkowa: pobierz PDF

### 26. Organic Content Standard 2022

- Wyświetlana ikona: `/ariteks/certificates/images/organic-content__af9dc0bcea.png`
- Dokument: `/ariteks/certificates/documents/organic-content-standard-2022__5bb288ec63.pdf`
- Akcja główna: otwórz w nowej karcie
- Akcja dodatkowa: pobierz PDF

### 27. Recycled Claim Standard 2024

- Wyświetlana ikona: `/ariteks/certificates/images/recycled-claim__b49b450a0c.png`
- Dokument: `/ariteks/certificates/documents/recycled-claim-standard-2024__871acf5601.pdf`
- Akcja główna: otwórz w nowej karcie
- Akcja dodatkowa: pobierz PDF

### 28. Organic Content Standard 2024

- Wyświetlana ikona: `/ariteks/certificates/images/organic-content__af9dc0bcea.png`
- Dokument: `/ariteks/certificates/documents/recycled-claim-standard-2024__871acf5601.pdf`
- Akcja główna: otwórz w nowej karcie
- Akcja dodatkowa: pobierz PDF

### 29. Recycled Claim Standard 2025

- Wyświetlana ikona: `/ariteks/certificates/images/recycled-claim__b49b450a0c.png`
- Dokument: `/ariteks/certificates/documents/recycled-claim-standard-2025__99279bb9fc.pdf`
- Akcja główna: otwórz w nowej karcie
- Akcja dodatkowa: pobierz PDF

### 30. Organic Content Standard 2025

- Wyświetlana ikona: `/ariteks/certificates/images/organic-content__af9dc0bcea.png`
- Dokument: `/ariteks/certificates/documents/recycled-claim-standard-2025__99279bb9fc.pdf`
- Akcja główna: otwórz w nowej karcie
- Akcja dodatkowa: pobierz PDF

### 31. Oeko-Tex Certificate 2020

- Wyświetlana ikona: `/ariteks/certificates/images/oekotex-100__cf2640970f.png`
- Dokument: `/ariteks/certificates/documents/oeko-tex-certificate-2020__b792142038.pdf`
- Akcja główna: otwórz w nowej karcie
- Akcja dodatkowa: pobierz PDF

### 33. Oeko-Tex Certificate 2021 Cotton, Viscose, Elastane

- Wyświetlana ikona: `/ariteks/certificates/images/oekotex-100__cf2640970f.png`
- Dokument: `/ariteks/certificates/documents/oeko-tex-certificate-2021-cotton-viscose-elastane__65e1f11f18.pdf`
- Akcja główna: otwórz w nowej karcie
- Akcja dodatkowa: pobierz PDF

### 34. Oeko-Tex Certificate 2021 Polyester, Elastane

- Wyświetlana ikona: `/ariteks/certificates/images/oekotex-100__cf2640970f.png`
- Dokument: `/ariteks/certificates/documents/oeko-tex-certificate-2021-polyester-elastane__8f3149c069.pdf`
- Akcja główna: otwórz w nowej karcie
- Akcja dodatkowa: pobierz PDF

### 35. Oeko-Tex Certificate 2022 Cotton, Viscose, Elastane

- Wyświetlana ikona: `/ariteks/certificates/images/oekotex-100__cf2640970f.png`
- Dokument: `/ariteks/certificates/documents/oeko-tex-certificate-2022-cotton-viscose-elastane__a817d1b710.pdf`
- Akcja główna: otwórz w nowej karcie
- Akcja dodatkowa: pobierz PDF

### 36. Oeko-Tex Certificate 2023 Cotton, Viscose, Polyester

- Wyświetlana ikona: `/ariteks/certificates/images/oekotex-100__cf2640970f.png`
- Dokument: `/ariteks/certificates/documents/oeko-tex-certificate-2023-cotton-viscose-polyester__5ab10b57eb.pdf`
- Akcja główna: otwórz w nowej karcie
- Akcja dodatkowa: pobierz PDF

### 37. Oeko-Tex Certificate 2024 Cotton, Viscose, Polyester

- Wyświetlana ikona: `/ariteks/certificates/images/oekotex-100__cf2640970f.png`
- Dokument: `/ariteks/certificates/documents/oeko-tex-certificate-2024-cotton-viscose-polyester__a22be4203f.pdf`
- Akcja główna: otwórz w nowej karcie
- Akcja dodatkowa: pobierz PDF

### 38. Oeko-Tex Certificate 2025 Cotton, Viscose, Polyester

- Wyświetlana ikona: `/ariteks/certificates/images/oekotex-100__cf2640970f.png`
- Dokument: `/ariteks/certificates/documents/oeko-tex-certificate-2025-cotton-viscose-polyester__9b13439013.pdf`
- Akcja główna: otwórz w nowej karcie
- Akcja dodatkowa: pobierz PDF

### 39. Oeko-Tex Certificate 2025 Cotton, Viscose, Polyester Fabric

- Wyświetlana ikona: `/ariteks/certificates/images/oekotex-100__cf2640970f.png`
- Dokument: `/ariteks/certificates/documents/oeko-tex-certificate-2025-cotton-viscose-polyester-fabric__965a080232.pdf`
- Akcja główna: otwórz w nowej karcie
- Akcja dodatkowa: pobierz PDF

---

## Certyfikaty / potwierdzenia w formie obrazu

### 1. Yarn Oeko-Tex Certificate 2009

- Wyświetlana ikona: `/ariteks/certificates/images/oekotex-100__cf2640970f.png`
- Obraz docelowy: `/ariteks/certificates/images/yarn-oeko-tex-certificate-2009__2691fd2ecd.jpg`
- Akcja główna: pokaż w nowej karcie albo lightboxie
- Akcja dodatkowa: opcjonalnie pobierz grafikę

### 4. C02 emission reduction

- Wyświetlana ikona: `/ariteks/certificates/images/c02-emission-reduction__c42b33b849.png`
- Obraz docelowy: `/ariteks/certificates/images/c02-emission-reduction__15e4c8f129.jpg`
- Akcja główna: pokaż w nowej karcie albo lightboxie
- Akcja dodatkowa: opcjonalnie pobierz grafikę

### 5. Antimicrobial Products

- Wyświetlana ikona: `/ariteks/certificates/images/antimicrobial-products__52364c2ce9.jpg`
- Obraz docelowy: `/ariteks/certificates/images/antimicrobial-products__52364c2ce9.jpg`
- Akcja główna: pokaż w nowej karcie albo lightboxie
- Akcja dodatkowa: opcjonalnie pobierz grafikę

### 6. ISO 9001 Certificate for Corlu Fabric Treatment Plant 2013

- Wyświetlana ikona: `/ariteks/certificates/images/iso-9001-certificate__0a2b94eb5d.jpg`
- Obraz docelowy: `/ariteks/certificates/images/iso-9001-certificate-for-corlu-fabric-treatment-plant-2013__642fcfd5d5.jpg`
- Akcja główna: pokaż w nowej karcie albo lightboxie
- Akcja dodatkowa: opcjonalnie pobierz grafikę

### 32. BCI Sytem No:1012459-1

- Wyświetlana ikona: `/ariteks/certificates/images/bci-better-cotton-initiative__4009e5f2f4.jpg`
- Obraz docelowy: `/ariteks/certificates/images/bci-better-cotton-initiative__4009e5f2f4.jpg`
- Akcja główna: pokaż w nowej karcie albo lightboxie
- Akcja dodatkowa: opcjonalnie pobierz grafikę

---

## Normy i testy do wyświetlenia na stronie

### Apparel Textiles

| Badanie / właściwość | Norma |
|---|---|
| Determination of linear density | ISO 2060 |
| Determination of mass per unit area | ISO 3801 |
| Determination of width and length | EN 1773 |
| Determination of dimensional change | ISO 3759 |
| Colour fastness to artificial light | ISO 105 B02 |
| Colour fanstness to rubbing | ISO 105 X12 |
| Colour fastness to water | ISO 105 E01 |
| Colour fastness to sea water | ISO 105 E02 |
| Colour fastness to chlorinated water | ISO 105 E03 |
| Colour fastness to perspiration | ISO 105 E04 |
| Colour fastness to spotting:Acid | ISO 105 E05 |
| Colour fastness to spotting:Alkali | ISO 105 E06 |
| Colour fastness to laundering | ISO 105 C06 |
| Colour fastness to mercerizing | ISO 105 X04 |
| Colour fastness to bleaching: Hypochlorite | ISO 105 N01 |
| Colour fastness to bleaching: Peroxide | ISO 105 N02 |
| Colour fastness to dry heat | ISO 105 P01 |
| Colour fastness to PVC coating | ISO 105 X10 |
| Colour fastness to hot pressing | ISO 105 X11 |
| Colour fastness to dry cleaning | ISO 105 D01 |
| Determination of abrasion resistance | ISO 12947-1 |
| Tensile properties of fabrics - Part1 | ISO 13934-1 |
| Bursting properties of fabrics - Part1 | ISO 13938-1 |
| Stretch Recovery | EN 14704-1 |
| Quantitative chemical analysis | ISO 1833-1 |
| Determination of formaldehyde | ISO 14184-1 |
| Aromatic amines from azo colorants | ISO 14362-1 |

### Building Technical Textiles

| Badanie / właściwość | Norma |
|---|---|
| Tensile stregth and elongation | ISO 1421 |
| Coating adhesion | ISO 2411 |
| Rating of sound insulation | ISO 717-1 |
| Flame Retardancy | DIN 4102 B1 |

### Protection Technical Textiles

| Badanie / właściwość | Norma |
|---|---|
| Welding Protection | EN 11611 |
| Heat and Flame Protection | EN 11612 |
| Arc Protection | EN 61482 |
| Rain Protection | EN 343 |
| High Visibility | EN 20471 |
| Surface Resistivity | EN 1149 |
| Chemical Protection | EN 13034 |
| Heat and Flame Protection | EN 14116 |
| Oil Repellency | EN 14419 |
| Uv Permeability | AATCC 183 |
| Firefighting Requirement | EN 469 |

### Geology Technical Textiles

| Badanie / właściwość | Norma |
|---|---|
| Wide-width tensile test | ISO 10319 |
| Mass per unit area of geotextiles | ISO 9864 |

### Medical Technical Textiles

| Badanie / właściwość | Norma |
|---|---|
| Antibacterial activity | AATCC 147 |
| Antibacterial activity | AATCC 100 |
| Antimicrobial activity | ASTM E2149 |
| Antiviral Textiles | ISO 18184 |
| Infective Agents | EN 14126 |
| Bacterial Filtration | EN 14683 |

---

## Minimalna implementacja w nowej stronie

1. Wczytać JSON:

```ts
const data = await fetch('/ariteks/certificates/data/certificate-page-public-manifest.json').then(r => r.json())
```

2. Zbudować grid z `data.certificates`.

3. W karcie użyć:

```tsx
<img src={item.card_image.public_url} alt={item.card_image.alt} />
<h3>{item.label_display}</h3>
<a href={item.target.public_url} target="_blank" rel="noopener noreferrer">
  {item.ui.button_label_pl}
</a>
```

4. Zbudować tabele z `data.standards`, grupując po `category_display`.

5. Nie linkować ikon kart jako pobierania. Pobieranie dotyczy tylko `target.public_url`.
