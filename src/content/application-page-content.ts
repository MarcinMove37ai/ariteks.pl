// src/content/application-page-content.ts
// Uzupełniająca warstwa marketingowa dla aplikacji, które nie mają jeszcze
// pola `content` w applications.ts.
//
// Istniejące, dopracowane treści w `app.content` pozostają nadrzędne.
// Ten plik dostarcza hero + USP tylko dla nowych aplikacji oraz
// spersonalizowane nagłówki sekcji produktów dla wszystkich aplikacji.

import type { ApplicationId } from '@/content/fabric-application-overrides';
import type { Locale } from '@/i18n/routing';

export type ApplicationMarketingContent = {
  heroTitle: Record<Locale, string>;
  heroLead: Record<Locale, string>;
  usp: {
    heading: Record<Locale, string>;
    items: Array<{
      title: Record<Locale, string>;
      text: Record<Locale, string>;
    }>;
  };
};

export type ApplicationProductCopy = {
  primaryHeading: Record<Locale, string>;
  primaryLead: Record<Locale, string>;
  secondaryHeading: Record<Locale, string>;
  secondaryLead: Record<Locale, string>;
};

const NEW_APPLICATION_CONTENT: Partial<
  Record<ApplicationId, ApplicationMarketingContent>
> = {
  transport: {
    heroTitle: {
      pl: 'Komfort zaprojektowany na całą trasę',
      en: 'Comfort engineered for every journey',
    },
    heroLead: {
      pl: 'W transporcie materiał pracuje bez przerwy: pod naciskiem, w kontakcie z użytkownikiem i podczas regularnego czyszczenia. Dlatego tkaniny na siedzenia i wnętrza muszą zachować formę, estetykę i komfort przez cały cykl eksploatacji. Rodzina ArSeat łączy uporządkowaną powierzchnię dzianiny osnowowej z trwałością poliestru — od lekkich konstrukcji po bardziej zwarte poszycia.',
      en: 'In transport, a material works continuously: under pressure, in contact with passengers and through regular cleaning. Seating and interior fabrics therefore have to retain their shape, appearance and comfort throughout their service life. The ArSeat family combines the ordered surface of a warp knit with polyester durability — from lightweight constructions to denser upholstery.',
    },
    usp: {
      heading: {
        pl: 'Co wyróżnia nasze tkaniny dla transportu',
        en: 'What sets our transport fabrics apart',
      },
      items: [
        {
          title: {
            pl: 'Dwie gramatury, jeden spójny system',
            en: 'Two weights, one consistent system',
          },
          text: {
            pl: 'ArSeat Eco 120 g/m² i ArSeat 150 g/m² pozwalają dobrać lżejszą lub bardziej zwartą konstrukcję bez zmiany charakteru powierzchni i bazy surowcowej.',
            en: 'ArSeat Eco at 120 g/m² and ArSeat at 150 g/m² allow a lighter or denser construction without changing the surface character or fibre base.',
          },
        },
        {
          title: {
            pl: 'Dzianina osnowowa do precyzyjnego tapicerowania',
            en: 'Warp knit for precise upholstery',
          },
          text: {
            pl: 'Konstrukcja pique daje regularną, techniczną powierzchnię, która dobrze układa się na profilowanych siedziskach i panelach wnętrza.',
            en: 'The pique construction creates a regular technical surface that fits cleanly over shaped seats and interior panels.',
          },
        },
        {
          title: {
            pl: '100% poliestru do intensywnej eksploatacji',
            en: '100% polyester for intensive service',
          },
          text: {
            pl: 'Jednorodna baza poliestrowa upraszcza dobór materiału do projektów, w których liczą się trwałość, powtarzalność i łatwa pielęgnacja.',
            en: 'A consistent polyester base simplifies material selection where durability, repeatability and easy care matter.',
          },
        },
        {
          title: {
            pl: 'Komfort kontaktu potwierdzony OEKO-TEX',
            en: 'Contact comfort supported by OEKO-TEX',
          },
          text: {
            pl: 'Oznaczenie OEKO-TEX 100 wzmacnia wiarygodność materiału stosowanego w miejscach, z którymi użytkownik ma bezpośredni i długotrwały kontakt.',
            en: 'OEKO-TEX 100 strengthens the credibility of a material used in areas with direct and prolonged passenger contact.',
          },
        },
        {
          title: {
            pl: 'Kolorystyka dla spójnych wnętrz',
            en: 'Colour options for coherent interiors',
          },
          text: {
            pl: 'Dostępne warianty kolorystyczne ułatwiają prowadzenie jednej identyfikacji wnętrza przez siedzenia, panele i elementy uzupełniające.',
            en: 'Available colour variants make it easier to carry one interior identity across seats, panels and complementary elements.',
          },
        },
        {
          title: {
            pl: 'Od pojedynczego fotela po serie kontraktowe',
            en: 'From a single seat to contract series',
          },
          text: {
            pl: 'Powtarzalna konstrukcja i parametry pozwalają rozwijać materiał od prototypu po większe serie dla transportu publicznego i specjalistycznego.',
            en: 'Repeatable construction and parameters allow the material to scale from prototype to larger series for public and specialist transport.',
          },
        },
      ],
    },
  },

  'workwear-industrial': {
    heroTitle: {
      pl: 'Tkaniny, które wytrzymują całą zmianę',
      en: 'Fabrics built to outlast the shift',
    },
    heroLead: {
      pl: 'Odzież robocza musi jednocześnie chronić, znosić codzienne zużycie i pozostać wygodna przez wiele godzin pracy. Dlatego portfolio dla przemysłu nie kończy się na jednej konstrukcji: obejmuje miękkie twille, trwałe mieszanki, warianty antystatyczne, trudnopalne, łukoochronne i chemoodporne. Jeden dostawca pozwala budować spójny system odzieży dla różnych stanowisk i poziomów ryzyka.',
      en: 'Workwear has to protect, withstand daily wear and remain comfortable through long hours on the job. That is why the industrial portfolio goes beyond a single construction: it includes soft twills, durable blends, antistatic, flame-retardant, arc-protective and chemical-resistant variants. One supplier enables a coherent clothing system for different roles and risk levels.',
    },
    usp: {
      heading: {
        pl: 'Co wyróżnia nasze tkaniny robocze i przemysłowe',
        en: 'What sets our workwear and industrial fabrics apart',
      },
      items: [
        {
          title: {
            pl: 'Pełna skala odzieży z jednego źródła',
            en: 'A complete workwear range from one source',
          },
          text: {
            pl: 'Rodziny ArWoWear, Arox i ArGiyim obejmują lekkie koszule, klasyczne ubrania robocze, elastyczne konstrukcje i cięższe materiały do stref intensywnego zużycia.',
            en: 'The ArWoWear, Arox and ArGiyim families cover lightweight shirts, classic workwear, stretch constructions and heavier materials for high-wear zones.',
          },
        },
        {
          title: {
            pl: 'Antystatyka w strukturze tkaniny',
            en: 'Antistatic performance in the fabric structure',
          },
          text: {
            pl: 'Warianty Static Pro wykorzystują włókno węglowe jako element konstrukcji, dzięki czemu właściwości ochronne nie zależą wyłącznie od powierzchniowego wykończenia.',
            en: 'Static Pro variants use carbon fibre as part of the construction, so protective performance does not rely solely on a surface finish.',
          },
        },
        {
          title: {
            pl: 'Ochrona przed płomieniem i łukiem',
            en: 'Protection against flame and electric arc',
          },
          text: {
            pl: 'Linie Flame Pro i Flame Arc Pro rozszerzają bazową odzież roboczą o rozwiązania dla stanowisk wymagających ochrony cieplnej i łukoochronnej.',
            en: 'The Flame Pro and Flame Arc Pro lines extend core workwear into solutions for roles requiring thermal and electric-arc protection.',
          },
        },
        {
          title: {
            pl: 'Chemia, wilgoć i codzienne zabrudzenia',
            en: 'Chemicals, moisture and daily contamination',
          },
          text: {
            pl: 'Warianty Chem Pro oraz konstrukcje Arox pozwalają dobrać materiał do środowisk, w których liczy się odporność na środki przemysłowe, wilgoć i częste czyszczenie.',
            en: 'Chem Pro variants and Arox constructions support environments where resistance to industrial agents, moisture and frequent cleaning is essential.',
          },
        },
        {
          title: {
            pl: 'Komfort bez rezygnacji z trwałości',
            en: 'Comfort without sacrificing durability',
          },
          text: {
            pl: 'Mieszanki bawełny, poliestru i włókien funkcjonalnych pozwalają równoważyć oddychalność, miękkość, stabilność i odporność mechaniczną.',
            en: 'Blends of cotton, polyester and functional fibres balance breathability, softness, stability and mechanical durability.',
          },
        },
        {
          title: {
            pl: 'Jedna logika materiałowa dla całego zakładu',
            en: 'One material logic across the workplace',
          },
          text: {
            pl: 'Spójne rodziny materiałów ułatwiają standaryzację krojów, kolorów, dokumentacji i zaopatrzenia dla wielu działów oraz stanowisk.',
            en: 'Coherent fabric families simplify the standardisation of patterns, colours, documentation and sourcing across departments and job roles.',
          },
        },
      ],
    },
  },

  'outdoor-functional': {
    heroTitle: {
      pl: 'Warstwy gotowe na pogodę, ruch i teren',
      en: 'Layers ready for weather, movement and terrain',
    },
    heroLead: {
      pl: 'Odzież outdoorowa i techniczne wyposażenie muszą działać jako system: zatrzymywać rozdarcie, odprowadzać wilgoć, chronić przed promieniowaniem UV i zachować komfort podczas ruchu. Portfolio łączy tkaniny ripstop, dzianiny funkcjonalne, siatki dystansowe 3D, polary i lekkie materiały komponentowe — od warstwy zewnętrznej po wnętrze produktu.',
      en: 'Outdoor apparel and technical equipment have to work as a system: arrest tears, manage moisture, protect against UV exposure and remain comfortable in motion. The portfolio combines ripstop fabrics, functional knits, 3D spacer meshes, fleece and lightweight component materials — from outer layer to product interior.',
    },
    usp: {
      heading: {
        pl: 'Co wyróżnia nasze tkaniny outdoorowe i funkcjonalne',
        en: 'What sets our outdoor and functional fabrics apart',
      },
      items: [
        {
          title: {
            pl: 'Ripstop zatrzymujący rozwój rozdarcia',
            en: 'Ripstop that arrests tear propagation',
          },
          text: {
            pl: 'AriRipstop wzmacnia konstrukcję regularną siatką włókien, dzięki czemu punktowe uszkodzenie nie musi oznaczać utraty całego elementu odzieży.',
            en: 'AriRipstop reinforces the construction with a regular fibre grid, so local damage does not have to compromise the entire garment panel.',
          },
        },
        {
          title: {
            pl: 'Przestrzenna wentylacja ArAir Mesh',
            en: 'Three-dimensional ventilation with ArAir Mesh',
          },
          text: {
            pl: 'Siatki dystansowe 3D tworzą przewiewną, sprężystą warstwę do paneli pleców, wnętrz obuwia, szelek i miejsc wymagających separacji od ciała.',
            en: '3D spacer meshes create a breathable, resilient layer for back panels, footwear interiors, straps and zones requiring separation from the body.',
          },
        },
        {
          title: {
            pl: 'Ochrona UV w rodzinie AriPam',
            en: 'UV protection in the AriPam family',
          },
          text: {
            pl: 'Materiały AriPam łączą funkcjonalną konstrukcję z oznaczeniem EN 13758, wspierając wyroby przeznaczone do długiej ekspozycji na słońce.',
            en: 'AriPam materials combine functional construction with EN 13758, supporting products intended for prolonged sun exposure.',
          },
        },
        {
          title: {
            pl: 'Warstwa termiczna z polaru ArPo',
            en: 'Thermal layer with ArPo fleece',
          },
          text: {
            pl: 'ArPo 290 g/m² daje miękką warstwę izolacyjną do bluz, podszewek i elementów ocieplających, zachowując prostą poliestrową bazę materiałową.',
            en: 'ArPo at 290 g/m² provides a soft insulating layer for tops, linings and thermal panels while retaining a straightforward polyester base.',
          },
        },
        {
          title: {
            pl: 'Komponenty od powierzchni po wnętrze',
            en: 'Components from outer surface to interior',
          },
          text: {
            pl: 'Podszewki, siatki i dzianiny komponentowe pozwalają budować spójny produkt bez schodzenia z technicznego charakteru materiału w mniej widocznych strefach.',
            en: 'Linings, meshes and component knits make it possible to build a coherent product without losing technical performance in less visible zones.',
          },
        },
        {
          title: {
            pl: 'Jedno portfolio dla wielu poziomów aktywności',
            en: 'One portfolio for multiple activity levels',
          },
          text: {
            pl: 'Od lekkiej odzieży i komponentów obuwia po polar, ripstop i elementy wyposażenia — materiały można zestawiać w kompletne systemy funkcjonalne.',
            en: 'From lightweight apparel and footwear components to fleece, ripstop and equipment panels, the materials can be combined into complete functional systems.',
          },
        },
      ],
    },
  },

  'upholstery-interiors': {
    heroTitle: {
      pl: 'Powierzchnie zaprojektowane do dotyku i użytkowania',
      en: 'Surfaces engineered for touch and use',
    },
    heroLead: {
      pl: 'Tapicerka techniczna musi łączyć pierwsze wrażenie z trwałością codziennego użytkowania. Miękka powierzchnia, stabilna konstrukcja i kontrolowana wentylacja powinny pracować razem na siedzisku, panelu lub elemencie wnętrza. Rodziny ArSeat, ArHard Mesh i ArAir Mesh pozwalają zestawiać materiały od przyjemnych w dotyku warstw wierzchnich po przestrzenne struktury wspierające komfort.',
      en: 'Technical upholstery has to combine first impression with everyday durability. A soft surface, stable construction and controlled ventilation should work together across a seat, panel or interior element. The ArSeat, ArHard Mesh and ArAir Mesh families allow combinations ranging from tactile face fabrics to three-dimensional structures that support comfort.',
    },
    usp: {
      heading: {
        pl: 'Co wyróżnia nasze tkaniny tapicerskie i wnętrzarskie',
        en: 'What sets our upholstery and interior fabrics apart',
      },
      items: [
        {
          title: {
            pl: 'Miękka powierzchnia, techniczna baza',
            en: 'A soft surface on a technical base',
          },
          text: {
            pl: 'ArSeat Touch łączy przyjemny chwyt z poliestrową konstrukcją przeznaczoną do siedzisk i elementów intensywnie użytkowanych.',
            en: 'ArSeat Touch combines a pleasant hand feel with a polyester construction intended for seating and frequently used interior elements.',
          },
        },
        {
          title: {
            pl: 'Siatka 3D dla wentylacji i sprężystości',
            en: '3D mesh for ventilation and resilience',
          },
          text: {
            pl: 'ArAir Mesh Bond tworzy przestrzenną warstwę, która poprawia przepływ powietrza i może wspierać komfort w panelach oraz siedziskach.',
            en: 'ArAir Mesh Bond creates a three-dimensional layer that improves airflow and can support comfort in panels and seating.',
          },
        },
        {
          title: {
            pl: 'Stabilne panele o wyraźnej strukturze',
            en: 'Stable panels with a defined structure',
          },
          text: {
            pl: 'Sztywniejsze siatki ArHard Mesh nadają wnętrzu techniczny charakter i sprawdzają się tam, gdzie materiał ma utrzymać formę.',
            en: 'More rigid ArHard Mesh constructions give interiors a technical character and suit zones where the material has to retain its form.',
          },
        },
        {
          title: {
            pl: 'Poliestrowa baza do regularnej pielęgnacji',
            en: 'A polyester base for regular care',
          },
          text: {
            pl: 'Jednorodna baza surowcowa ułatwia dobór materiałów do wnętrz wymagających trwałości, powtarzalności i regularnego czyszczenia.',
            en: 'A consistent fibre base simplifies material selection for interiors requiring durability, repeatability and regular cleaning.',
          },
        },
        {
          title: {
            pl: 'OEKO-TEX w strefach bliskiego kontaktu',
            en: 'OEKO-TEX for close-contact zones',
          },
          text: {
            pl: 'Oznaczenie OEKO-TEX 100 wzmacnia przekaz jakościowy w siedziskach i elementach, które pozostają w bezpośrednim kontakcie z użytkownikiem.',
            en: 'OEKO-TEX 100 strengthens the quality message for seating and elements that remain in direct contact with the user.',
          },
        },
        {
          title: {
            pl: 'Jedna kompozycja z różnych faktur',
            en: 'One composition built from different textures',
          },
          text: {
            pl: 'Miękkie, gładkie i przestrzenne materiały można łączyć w jednym projekcie, budując czytelny podział funkcji bez utraty spójności wizualnej.',
            en: 'Soft, smooth and three-dimensional materials can be combined in one design, creating clear functional zoning without losing visual coherence.',
          },
        },
      ],
    },
  },

  'print-signage': {
    heroTitle: {
      pl: 'Podłoża tekstylne, które przenoszą obraz',
      en: 'Textile substrates that carry the image',
    },
    heroLead: {
      pl: 'W druku tekstylnym materiał jest częścią komunikatu: wpływa na nasycenie koloru, napięcie powierzchni, sposób montażu i zachowanie gotowej ekspozycji. ArDigiPrint zapewnia elastyczne podłoże do druku cyfrowego i sublimacyjnego, a ArBayrak uzupełnia ofertę o lekką tkaninę flagową i sygnalizacyjną. Dwa różne materiały pozwalają obsłużyć zarówno napięte powierzchnie, jak i formy pracujące w ruchu.',
      en: 'In textile printing, the material is part of the message: it affects colour saturation, surface tension, installation and the behaviour of the finished display. ArDigiPrint provides a flexible substrate for digital and sublimation printing, while ArBayrak adds a lightweight flag and signalling fabric. Two distinct materials cover both tensioned surfaces and forms designed to move.',
    },
    usp: {
      heading: {
        pl: 'Co wyróżnia nasze tkaniny do druku i oznakowania',
        en: 'What sets our printing and signage fabrics apart',
      },
      items: [
        {
          title: {
            pl: 'ArDigiPrint do druku cyfrowego i sublimacji',
            en: 'ArDigiPrint for digital and sublimation printing',
          },
          text: {
            pl: 'Interlock 250 g/m² z poliestru tworzy elastyczną, równą powierzchnię przeznaczoną do nanoszenia grafiki metodami cyfrowymi.',
            en: 'A 250 g/m² polyester interlock creates a flexible, even surface designed for digitally applied graphics.',
          },
        },
        {
          title: {
            pl: 'Elastyczność w obu kierunkach',
            en: 'Stretch in both directions',
          },
          text: {
            pl: 'Możliwość rozciągania wzdłuż i wszerz ułatwia napinanie materiału na ramach, panelach i przestrzennych systemach ekspozycyjnych.',
            en: 'Lengthwise and crosswise stretch supports tensioning over frames, panels and three-dimensional display systems.',
          },
        },
        {
          title: {
            pl: 'Światłoodporność do ekspozycji',
            en: 'Light fastness for display use',
          },
          text: {
            pl: 'Odporność na światło na poziomie 7 według EN ISO 105 B02 wspiera zachowanie koloru w dłużej eksponowanych realizacjach.',
            en: 'Light fastness rated 7 to EN ISO 105 B02 supports colour retention in longer-running displays.',
          },
        },
        {
          title: {
            pl: 'ArBayrak dla form lekkich i ruchomych',
            en: 'ArBayrak for lightweight and moving forms',
          },
          text: {
            pl: 'Tkanina 120 g/m² z poliestru sprawdza się w flagach, oznakowaniu i elementach sygnalizacyjnych, gdzie materiał powinien reagować na ruch powietrza.',
            en: 'A 120 g/m² polyester fabric suits flags, signage and signalling elements where the material should respond to air movement.',
          },
        },
        {
          title: {
            pl: 'Dwa podłoża, dwa sposoby prezentacji',
            en: 'Two substrates, two presentation modes',
          },
          text: {
            pl: 'ArDigiPrint obsługuje powierzchnie napięte i elastyczne, a ArBayrak lekkie formy swobodne — jedna oferta obejmuje dwa podstawowe typy ekspozycji tekstylnej.',
            en: 'ArDigiPrint serves tensioned and flexible surfaces, while ArBayrak covers lightweight free-hanging forms — one offer spans two core textile-display formats.',
          },
        },
        {
          title: {
            pl: 'Poliestrowa baza dla powtarzalnej produkcji',
            en: 'A polyester base for repeatable production',
          },
          text: {
            pl: 'Jednorodny surowiec ułatwia prowadzenie procesu druku, kontroli partii i powtarzania realizacji w kolejnych seriach.',
            en: 'A consistent fibre base supports print-process control, batch management and repeat production across subsequent runs.',
          },
        },
      ],
    },
  },

  'professional-cleaning': {
    heroTitle: {
      pl: 'Mikrofibra stworzona do pracy wielokrotnej',
      en: 'Microfibre built for repeated professional use',
    },
    heroLead: {
      pl: 'Profesjonalna ściereczka musi zbierać zabrudzenia, wytrzymywać intensywne użytkowanie i zachowywać parametry po kolejnych cyklach pielęgnacji. ArClean 250 to gęsta mikrofibra osnowowa z poliestru i poliamidu, zaprojektowana jako trwała baza do wyrobów czyszczących. Łączy wysoką wytrzymałość na przepuklenie, szerokość produkcyjną 2100 mm i dobre odporności użytkowe.',
      en: 'A professional cloth has to capture contamination, withstand intensive use and retain its performance through repeated care cycles. ArClean 250 is a dense warp-knit microfibre made from polyester and polyamide, designed as a durable base for cleaning products. It combines high bursting strength, a 2100 mm production width and strong use-related fastness.',
    },
    usp: {
      heading: {
        pl: 'Co wyróżnia mikrofibrę ArClean',
        en: 'What sets ArClean microfibre apart',
      },
      items: [
        {
          title: {
            pl: 'Mieszanka 80% PES i 20% PA6',
            en: 'An 80% PES and 20% PA6 blend',
          },
          text: {
            pl: 'Połączenie poliestru i poliamidu tworzy gęstą strukturę mikrofibry przeznaczoną do produkcji trwałych ściereczek wielokrotnego użytku.',
            en: 'The polyester-polyamide blend creates a dense microfibre structure intended for durable, reusable cleaning cloths.',
          },
        },
        {
          title: {
            pl: '250 g/m² materiału roboczego',
            en: 'A 250 g/m² working fabric',
          },
          text: {
            pl: 'Gramatura daje wyrobowi wyraźną, stabilną konstrukcję bez charakteru lekkiej jednorazowej włókniny.',
            en: 'The weight gives the product a substantial, stable construction rather than the feel of a lightweight disposable nonwoven.',
          },
        },
        {
          title: {
            pl: 'Ponad 2000 kPa odporności na przepuklenie',
            en: 'Over 2,000 kPa bursting strength',
          },
          text: {
            pl: 'Wysoka odporność na przepuklenie wspiera zastosowania, w których materiał jest intensywnie dociskany, skręcany i wielokrotnie używany.',
            en: 'High bursting strength supports applications where the material is repeatedly pressed, twisted and reused.',
          },
        },
        {
          title: {
            pl: 'Szerokość 2100 mm dla wydajnego rozkroju',
            en: 'A 2100 mm width for efficient cutting',
          },
          text: {
            pl: 'Duża szerokość robocza ułatwia planowanie wykroju i zwiększa elastyczność produkcji różnych formatów ściereczek.',
            en: 'The wide working width supports efficient cutting layouts and flexible production of different cloth formats.',
          },
        },
        {
          title: {
            pl: 'Odporności 4–5 w codziennych testach',
            en: 'Ratings of 4–5 in everyday-use tests',
          },
          text: {
            pl: 'Pranie, tarcie, czyszczenie chemiczne i kontakt z podchlorynem oceniane są na poziomie 4–5, co wspiera wielokrotne użytkowanie wyrobu.',
            en: 'Laundering, rubbing, dry cleaning and hypochlorite contact are rated at 4–5, supporting repeated product use.',
          },
        },
        {
          title: {
            pl: 'Gotowa baza do wariantów kolorystycznych i nadruku',
            en: 'A base for colour and printed variants',
          },
          text: {
            pl: 'Materiał jest dostępny także w intensywnych kolorach i może stanowić bazę dla wyrobów drukowanych, pomagając rozróżniać strefy lub zastosowania.',
            en: 'The material is also available in vivid colours and can serve as a base for printed products, helping distinguish zones or uses.',
          },
        },
      ],
    },
  },
};

export const APPLICATION_PRODUCT_COPY: Record<
  ApplicationId,
  ApplicationProductCopy
> = {
  military: {
    primaryHeading: {
      pl: 'Tkaniny dla wojska i służb',
      en: 'Fabrics for military and uniformed services',
    },
    primaryLead: {
      pl: 'Zobacz materiały przeznaczone do umundurowania, oporządzenia, kombinezonów specjalistycznych i wyposażenia służb.',
      en: 'Explore materials for uniforms, load-bearing equipment, specialist suits and service gear.',
    },
    secondaryHeading: { pl: 'Zobacz również', en: 'See also' },
    secondaryLead: {
      pl: 'Te tkaniny powstały dla innych głównych zastosowań, ale sprawdzają się również w wybranych elementach wyposażenia wojskowego i służbowego.',
      en: 'These fabrics were developed for other primary uses but also suit selected military and service applications.',
    },
  },
  firefighting: {
    primaryHeading: {
      pl: 'Tkaniny do odzieży strażackiej',
      en: 'Fabrics for firefighting apparel',
    },
    primaryLead: {
      pl: 'Zobacz materiały na ubrania bojowe, odzież służbową i warstwy ochronne dla straży pożarnej.',
      en: 'Explore materials for turnout gear, station wear and protective layers for firefighting.',
    },
    secondaryHeading: { pl: 'Zobacz również', en: 'See also' },
    secondaryLead: {
      pl: 'Dodatkowe materiały, które mogą uzupełniać specjalistyczne systemy odzieży strażackiej.',
      en: 'Additional materials that can complement specialist firefighting clothing systems.',
    },
  },
  energy: {
    primaryHeading: {
      pl: 'Tkaniny ochronne dla energetyki',
      en: 'Protective fabrics for the energy sector',
    },
    primaryLead: {
      pl: 'Zobacz tkaniny antystatyczne, trudnopalne, łukoochronne i ekranujące do pracy w energetyce.',
      en: 'Explore antistatic, flame-retardant, arc-protective and shielding fabrics for energy-sector work.',
    },
    secondaryHeading: { pl: 'Zobacz również', en: 'See also' },
    secondaryLead: {
      pl: 'Materiały z innych grup, które znajdują dodatkowe zastosowanie w odzieży i wyposażeniu dla energetyki.',
      en: 'Materials from other groups with additional uses in energy-sector clothing and equipment.',
    },
  },
  welding: {
    primaryHeading: {
      pl: 'Tkaniny dla hutnictwa i spawalnictwa',
      en: 'Fabrics for metallurgy and welding',
    },
    primaryLead: {
      pl: 'Zobacz materiały chroniące przed płomieniem, ciepłem, iskrami i rozbryzgiem stopionego metalu.',
      en: 'Explore materials protecting against flame, heat, sparks and molten-metal splash.',
    },
    secondaryHeading: { pl: 'Zobacz również', en: 'See also' },
    secondaryLead: {
      pl: 'Dodatkowe tkaniny, które mogą rozszerzać system ochrony pracowników gorących procesów.',
      en: 'Additional fabrics that can extend protection systems for hot-work processes.',
    },
  },
  motorcycle: {
    primaryHeading: {
      pl: 'Tkaniny do odzieży motocyklowej',
      en: 'Fabrics for motorcycle apparel',
    },
    primaryLead: {
      pl: 'Zobacz materiały odporne na ścieranie, rozdarcie i przecięcie, przeznaczone do technicznej odzieży motocyklowej.',
      en: 'Explore abrasion-, tear- and cut-resistant materials for technical motorcycle apparel.',
    },
    secondaryHeading: { pl: 'Zobacz również', en: 'See also' },
    secondaryLead: {
      pl: 'Tkaniny z innych grup, które mogą uzupełniać strefy ochronne, elastyczne lub wzmacniające odzieży motocyklowej.',
      en: 'Fabrics from other groups that can complement protective, stretch or reinforcement zones in motorcycle apparel.',
    },
  },
  hivis: {
    primaryHeading: {
      pl: 'Dzianiny do odzieży ostrzegawczej',
      en: 'Knits for high-visibility apparel',
    },
    primaryLead: {
      pl: 'Zobacz fluorescencyjne dzianiny i tkaniny do kamizelek, kurtek, koszulek oraz odzieży ostrzegawczej specjalnego przeznaczenia.',
      en: 'Explore fluorescent knits and fabrics for vests, jackets, shirts and specialist high-visibility apparel.',
    },
    secondaryHeading: { pl: 'Zobacz również', en: 'See also' },
    secondaryLead: {
      pl: 'Dodatkowe materiały, które mogą rozszerzać odzież ostrzegawczą o ochronę mechaniczną, termiczną lub pogodową.',
      en: 'Additional materials that can add mechanical, thermal or weather protection to high-visibility apparel.',
    },
  },
  medical: {
    primaryHeading: {
      pl: 'Tkaniny dla medycyny',
      en: 'Fabrics for medical applications',
    },
    primaryLead: {
      pl: 'Zobacz materiały na odzież medyczną, fartuchy barierowe, wyroby antywirusowe, antybakteryjne i elastyczne komponenty.',
      en: 'Explore materials for medical clothing, barrier gowns, antiviral and antibacterial products, and stretch components.',
    },
    secondaryHeading: { pl: 'Zobacz również', en: 'See also' },
    secondaryLead: {
      pl: 'Dodatkowe tkaniny, które mogą wspierać wybrane konstrukcje medyczne i higieniczne.',
      en: 'Additional fabrics that can support selected medical and hygiene constructions.',
    },
  },
  sport: {
    primaryHeading: {
      pl: 'Dzianiny sportowe',
      en: 'Sport knits',
    },
    primaryLead: {
      pl: 'Zobacz oddychające i szybkoschnące materiały do odzieży sportowej oraz aktywności o wysokiej intensywności.',
      en: 'Explore breathable and quick-drying materials for sportswear and high-intensity activity.',
    },
    secondaryHeading: { pl: 'Zobacz również', en: 'See also' },
    secondaryLead: {
      pl: 'Materiały z innych grup, które mogą uzupełniać sportowe konstrukcje o elastyczność, ochronę lub dodatkową wentylację.',
      en: 'Materials from other groups that can add stretch, protection or ventilation to sports constructions.',
    },
  },
  'architecture-building': {
    primaryHeading: {
      pl: 'Tkaniny architektoniczne i budowlane',
      en: 'Architectural and building fabrics',
    },
    primaryLead: {
      pl: 'Zobacz membrany, tkaniny napinane i materiały do sufitów świetlnych, osłon oraz systemów tekstylnych w architekturze.',
      en: 'Explore membranes, tension fabrics and materials for luminous ceilings, shading and architectural textile systems.',
    },
    secondaryHeading: { pl: 'Zobacz również', en: 'See also' },
    secondaryLead: {
      pl: 'Dodatkowe materiały, które mogą wspierać wybrane projekty architektoniczne i wnętrzarskie.',
      en: 'Additional materials that can support selected architectural and interior projects.',
    },
  },
  transport: {
    primaryHeading: {
      pl: 'Tkaniny dla transportu',
      en: 'Fabrics for transport',
    },
    primaryLead: {
      pl: 'Zobacz materiały do siedzeń, tapicerki i wnętrz pojazdów przeznaczone do regularnej, intensywnej eksploatacji.',
      en: 'Explore materials for seating, upholstery and vehicle interiors designed for regular intensive service.',
    },
    secondaryHeading: { pl: 'Zobacz również', en: 'See also' },
    secondaryLead: {
      pl: 'Dodatkowe tkaniny do elementów sygnalizacyjnych, wyposażenia bezpieczeństwa i wybranych stref wnętrza pojazdu.',
      en: 'Additional fabrics for signalling elements, safety equipment and selected vehicle-interior zones.',
    },
  },
  'workwear-industrial': {
    primaryHeading: {
      pl: 'Tkaniny do odzieży roboczej i przemysłowej',
      en: 'Fabrics for workwear and industrial apparel',
    },
    primaryLead: {
      pl: 'Zobacz pełną ofertę materiałów na ubrania robocze — od miękkich mieszanek po konstrukcje antystatyczne, trudnopalne i chemoodporne.',
      en: 'Explore the full workwear range — from soft blends to antistatic, flame-retardant and chemical-resistant constructions.',
    },
    secondaryHeading: { pl: 'Zobacz również', en: 'See also' },
    secondaryLead: {
      pl: 'Materiały opracowane dla innych głównych zastosowań, które mogą uzupełniać specjalistyczną odzież przemysłową.',
      en: 'Materials developed for other primary uses that can complement specialist industrial apparel.',
    },
  },
  'outdoor-functional': {
    primaryHeading: {
      pl: 'Tkaniny outdoorowe i funkcjonalne',
      en: 'Outdoor and functional fabrics',
    },
    primaryLead: {
      pl: 'Zobacz tkaniny ripstop, dzianiny, siatki 3D, polary i komponenty do odzieży, obuwia oraz lekkiego wyposażenia outdoorowego.',
      en: 'Explore ripstop fabrics, knits, 3D meshes, fleece and components for outdoor apparel, footwear and lightweight equipment.',
    },
    secondaryHeading: { pl: 'Zobacz również', en: 'See also' },
    secondaryLead: {
      pl: 'Dodatkowe materiały, które mogą rozszerzać system outdoorowy o ochronę, komfort, widoczność lub trwałość.',
      en: 'Additional materials that can add protection, comfort, visibility or durability to an outdoor system.',
    },
  },
  'upholstery-interiors': {
    primaryHeading: {
      pl: 'Tkaniny tapicerskie i wnętrzarskie',
      en: 'Upholstery and interior fabrics',
    },
    primaryLead: {
      pl: 'Zobacz miękkie dzianiny, siatki przestrzenne i materiały do siedzisk, paneli oraz technicznego wyposażenia wnętrz.',
      en: 'Explore soft knits, three-dimensional meshes and materials for seating, panels and technical interior furnishings.',
    },
    secondaryHeading: { pl: 'Zobacz również', en: 'See also' },
    secondaryLead: {
      pl: 'Dodatkowe produkty, które mogą uzupełniać wnętrza o nowe faktury, funkcje i strefy użytkowe.',
      en: 'Additional products that can add new textures, functions and use zones to interiors.',
    },
  },
  'print-signage': {
    primaryHeading: {
      pl: 'Tkaniny do druku, reklamy i oznakowania',
      en: 'Fabrics for printing, advertising and signage',
    },
    primaryLead: {
      pl: 'Zobacz podłoża do druku cyfrowego, sublimacji, flag, ekspozycji i tekstylnych systemów oznakowania.',
      en: 'Explore substrates for digital printing, sublimation, flags, displays and textile signage systems.',
    },
    secondaryHeading: { pl: 'Zobacz również', en: 'See also' },
    secondaryLead: {
      pl: 'Dodatkowe materiały, które mogą wspierać specjalne formy ekspozycji i komunikacji wizualnej.',
      en: 'Additional materials that can support specialist display and visual-communication formats.',
    },
  },
  'professional-cleaning': {
    primaryHeading: {
      pl: 'Mikrofibry do czyszczenia profesjonalnego',
      en: 'Microfibres for professional cleaning',
    },
    primaryLead: {
      pl: 'Zobacz trwałe materiały do produkcji wielorazowych ściereczek dla czyszczenia przemysłowego i profesjonalnego.',
      en: 'Explore durable materials for reusable cloths in industrial and professional cleaning.',
    },
    secondaryHeading: { pl: 'Zobacz również', en: 'See also' },
    secondaryLead: {
      pl: 'Dodatkowe tkaniny, które mogą znaleźć zastosowanie w specjalistycznych wyrobach czyszczących i pielęgnacyjnych.',
      en: 'Additional fabrics that may suit specialist cleaning and surface-care products.',
    },
  },
};

export function getApplicationMarketingContent(
  applicationId: ApplicationId,
): ApplicationMarketingContent | undefined {
  return NEW_APPLICATION_CONTENT[applicationId];
}

export function getApplicationProductCopy(
  applicationId: ApplicationId,
): ApplicationProductCopy {
  return APPLICATION_PRODUCT_COPY[applicationId];
}
