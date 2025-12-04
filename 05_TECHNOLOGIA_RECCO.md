# Technologia RECCO w Systemie Nieśmiertelnik PSP
## Pasywny System Lokalizacji Ratowników
### HackNation 2025 - Cyfrowy Nieśmiertelnik PSP v2.4

---

> **⚠️ WAŻNE: RECCO to PRZYKŁADOWA technologia pasywnej lokalizacji backup.**
>
> Uczestnicy hackathonu mogą zaproponować **alternatywne rozwiązania** pasywnej lub semi-pasywnej lokalizacji, takie jak:
> - Reflektory radarowe innych producentów
> - Znaczniki RFID/NFC o dużym zasięgu
> - Pasywne transpondery akustyczne
> - Markery fluorescencyjne/fosforescencyjne
> - Inne innowacyjne rozwiązania
>
> **Punkty bonusowe** za kreatywne alternatywy z uzasadnieniem technicznym!

---

> HackNation 2025: dokument korzysta w ramach wydarzenia z zasad opisanych w `FORMALNO_PRAWNE_HACKNATION.md`. Przy zgłoszeniu projektu pamiętaj o wymaganiach dotyczących przekazania dokumentacji i praw.

## 1. Wprowadzenie

### 1.1 Dlaczego RECCO?

System „Cyfrowy Nieśmiertelnik PSP" opiera się na aktywnych technologiach (UWB, LoRa, LTE-M), które wymagają zasilania i działającego urządzenia. **Co jednak gdy:**

- Tag nieśmiertelnika ulegnie uszkodzeniu?
- Bateria się wyczerpie?
- Strażak zostanie zasypany gruzem, który zniszczy elektronikę?
- Wszystkie systemy łączności zawiodą?

**RECCO to ostatnia linia obrony** – pasywna technologia, która działa zawsze, bez baterii, bez włączania, bez żadnej obsługi. Nawet gdy strażak jest nieprzytomny, reflektor RECCO „odpowie" na sygnał detektora.

### 1.2 Historia i zastosowania

Technologia RECCO została opracowana w Szwecji w latach 80. dla ratownictwa lawinowego. Dziś jest standardem w:

- **Ratownictwie górskim** – ponad 900 organizacji SAR na świecie
- **Służbach ratunkowych** – straż pożarna, policja, wojsko
- **Odzieży outdoor** – ponad 200 marek wszywają reflektory
- **Hełmach i butach** – naklejki i wkładki RECCO

**W Polsce:** GOPR, TOPR i niektóre jednostki straży pożarnej posiadają detektory RECCO.

---

## 2. Zasada działania

### 2.1 Fizyka technologii

RECCO działa na zasadzie **radaru harmonicznego**:

```
┌─────────────────────────────────────────────────────────────────────┐
│                    ZASADA DZIAŁANIA RECCO                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  DETEKTOR                                                           │
│  ┌───────────┐         ────────► Sygnał TX 1.6 GHz                 │
│  │           │         ◄──────── Echo RX 3.2 GHz                   │
│  │   📡 TX   ├────────►                                            │
│  │           │         ┌─────────────────────┐                     │
│  │   📡 RX   │◄────────┤    REFLEKTOR        │                     │
│  │           │         │                     │                     │
│  └───────────┘         │   ┌─────────┐       │                     │
│                        │   │  Dioda  │       │                     │
│                        │   │Schottky │       │                     │
│                        │   │ (GaAs)  │       │                     │
│                        │   └────┬────┘       │                     │
│                        │        │            │                     │
│                        │   Podwojenie        │                     │
│                        │   częstotliwości    │                     │
│                        │   (harmonic)        │                     │
│                        └─────────────────────┘                     │
│                                                                     │
│  1.6 GHz → Dioda → 3.2 GHz (2× częstotliwość)                      │
│                                                                     │
│  Detektor odbiera TYLKO echo 3.2 GHz, odrzucając odbicia           │
│  środowiskowe na 1.6 GHz → bardzo wysoka selektywność              │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.2 Kluczowe parametry

| Parametr | Wartość | Uwagi |
|----------|---------|-------|
| Częstotliwość TX | 1.6 GHz | Wysyłana przez detektor |
| Częstotliwość RX | 3.2 GHz | Harmonic od reflektora |
| Zasięg (otwarta przestrzeń) | do 80 m | Detektor ręczny R9 |
| Zasięg (śnieg ubity) | do 20 m | Zależny od wilgotności |
| Zasięg (gruz betonowy) | 5-20 m | Zależny od zbrojenia |
| Zasięg (helikopter) | 100 m radius | Przy 100 m wysokości |
| Prędkość skanowania (heli) | do 100 km/h | SAR Helicopter Detector |

### 2.3 Wpływ środowiska

| Materiał | Wpływ na zasięg | Uwagi |
|----------|-----------------|-------|
| Śnieg suchy | Minimalny (90%+) | Najlepsze warunki |
| Śnieg mokry | Umiarkowany (60-80%) | Woda tłumi sygnał |
| Beton niezbrojony | Umiarkowany (50-70%) | Zależy od grubości |
| Beton zbrojony | Znaczny (20-50%) | Stal odbija sygnał |
| Metal (blacha) | Bardzo duży (<20%) | Ekranowanie |
| Drewno | Minimalny (80-90%) | Dobra przenikliwość |
| Woda | Bardzo duży (<10%) | Prawie całkowite tłumienie |

---

## 3. Komponenty systemu

### 3.1 Reflektor RECCO

**Opis:** Pasywny element elektroniczny składający się z anteny i diody Schottky na podłożu GaAs (arsenek galu). Zero zasilania, zero obsługi.

#### Warianty

| Wariant | Wymiary | Waga | Zastosowanie | Cena |
|---------|---------|------|--------------|------|
| Sewn-in (wszyty) | 67×22×3 mm | 4 g | Fabryczna integracja w mundurze | ~$20 |
| Helmet Rescue | 60×20×4 mm | 6 g | Naklejka na hełm | ~$30 |
| Clip-on | 55×25×8 mm | 12 g | Przypinka do uprzęży | ~$35 |
| Boot insert | 70×15×2 mm | 3 g | Wkładka do buta | ~$25 |

#### Specyfikacja techniczna

```
┌─────────────────────────────────────────────────────────────────────┐
│                     REFLEKTOR RECCO                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  ████████████████████████████████████████████████████████  │   │
│  │  █                                                       █  │   │
│  │  █   ┌─────────────┐         ┌─────────────┐            █  │   │
│  │  █   │   ANTENA    │─────────│   DIODA     │            █  │   │
│  │  █   │   dipol     │         │  Schottky   │            █  │   │
│  │  █   │   1.6 GHz   │         │   GaAs      │            █  │   │
│  │  █   └─────────────┘         └─────────────┘            █  │   │
│  │  █                                                       █  │   │
│  │  ████████████████████████████████████████████████████████  │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  Wymiary: 67 × 22 × 3 mm                                           │
│  Waga: ~4 g                                                         │
│  Temperatura pracy: -40°C do +85°C                                  │
│  Żywotność: >20 lat (brak części zużywalnych)                      │
│  Wodoodporność: Pełna (hermetyczne laminowanie)                    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

#### Rozmieszczenie na strażaku

**Zalecane minimum: 2 reflektory na osobę**

```
         ┌───────┐
         │ HEŁM  │ ← Reflektor #1 (naklejka)
         │  👷   │
         └───┬───┘
             │
    ┌────────┴────────┐
    │                 │
    │    KURTKA       │
    │                 │
    │   [RECCO #2]    │ ← Reflektor #2 (wszyty pod naramiennikiem)
    │                 │
    └────────┬────────┘
             │
    ┌────────┴────────┐
    │   SPODNIE       │
    │                 │
    └────────┬────────┘
             │
    ┌────────┴────────┐
    │    BUTY         │
    │   [RECCO #3]    │ ← Opcjonalny reflektor #3 (wkładka)
    └─────────────────┘
```

**Uzasadnienie redundancji:**
- Górna część ciała (hełm/kurtka) może być widoczna nawet przy częściowym zasypaniu
- Dolna część (buty) może być dostępna przy zasypaniu głową w dół
- Uszkodzenie jednego reflektora nie eliminuje całej detekcji

### 3.2 Detektor RECCO

#### Detektor ręczny R9

**Opis:** Przenośne urządzenie do poszukiwań pieszych. Operator skanuje teren, nasłuchując sygnału audio i obserwując LED.

| Parametr | Wartość |
|----------|---------|
| Model | RECCO R9 |
| Zasięg | do 80 m (open), 20 m (buried) |
| Waga | ~800 g |
| Bateria | Li-Ion, ~5h pracy ciągłej |
| Ładowanie | USB-C, 2h |
| Wskaźnik | Audio (ton) + LED (intensywność) |
| Wodoodporność | IP67 |
| Temp. pracy | -20°C do +45°C |
| Cena | ~$5000-8000 |
| Dostępność dla służb | Często bezpłatnie po szkoleniu |

```
┌─────────────────────────────────────────────────────────────────────┐
│                     DETEKTOR RECCO R9                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│          ┌──────────────────────────────┐                          │
│          │         ANTENA               │                          │
│          │    (kierunkowa, 60°)         │                          │
│          └──────────────┬───────────────┘                          │
│                         │                                          │
│          ┌──────────────┴───────────────┐                          │
│          │                              │                          │
│          │   [LED WSKAŹNIK]             │                          │
│          │                              │                          │
│          │   [GŁOŚNIK]                  │                          │
│          │                              │                          │
│          │   [WYŚWIETLACZ LCD]          │                          │
│          │    - siła sygnału            │                          │
│          │    - kierunek                │                          │
│          │    - bateria                 │                          │
│          │                              │                          │
│          │   [PRZYCISK POWER]           │                          │
│          │   [PRZYCISK SENS+/-]         │                          │
│          │                              │                          │
│          │        UCHWYT                │                          │
│          │                              │                          │
│          └──────────────────────────────┘                          │
│                                                                     │
│  Wymiary: ~40 × 15 × 8 cm (z anteną)                               │
│  Masa: ~800 g                                                       │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

#### Interpretacja sygnału

| Sygnał audio | Wskaźnik LED | Interpretacja |
|--------------|--------------|---------------|
| Brak | Brak | Brak reflektora w zasięgu |
| Słaby ton | 1 dioda | Reflektor daleko lub przesłonięty |
| Średni ton | 2-3 diody | Reflektor w średniej odległości |
| Silny ton | 4-5 diod | Reflektor blisko |
| Głośny ciągły | Wszystkie diody | Reflektor bardzo blisko (<2m) |

#### Detektor helikopterowy (SAR)

| Parametr | Wartość |
|----------|---------|
| Zasięg | 100 m radius przy 100 m wysokości |
| Prędkość skanowania | do 100 km/h |
| Obszar/h | ~200 km² |
| Montaż | Podwieszenie pod helikopterem |
| Waga systemu | ~15 kg |
| Dostępność w Polsce | Brak (2024) – potencjał rozwoju |

---

## 4. Procedury operacyjne

### 4.1 Procedura „Firefighter Down" z użyciem RECCO

```
┌─────────────────────────────────────────────────────────────────────┐
│           PROCEDURA FIREFIGHTER DOWN + RECCO                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ KROK 1: ALARMOWANIE                                         │   │
│  │                                                              │   │
│  │ • System Nieśmiertelnik zgłasza alarm MAN-DOWN              │   │
│  │ • LUB: Brak kontaktu radiowego >2 min                       │   │
│  │ • LUB: Słyszalny alarm PASS                                 │   │
│  │                                                              │   │
│  │ Dowódca ogłasza: "MAYDAY - FIREFIGHTER DOWN"                │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                         │                                          │
│                         ▼                                          │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ KROK 2: AKTYWACJA RIT                                       │   │
│  │                                                              │   │
│  │ Sekcja RIT pobiera z pojazdu:                               │   │
│  │ • Kamerę termowizyjną                                       │   │
│  │ • Detektor RECCO R9                                         │   │
│  │ • Zestaw medyczny                                           │   │
│  │ • Nosze/strap                                               │   │
│  │ • Dodatkowe aparaty powietrzne                              │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                         │                                          │
│                         ▼                                          │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ KROK 3: LOKALIZACJA WSTĘPNA                                 │   │
│  │                                                              │   │
│  │ Sprawdź system Nieśmiertelnik:                              │   │
│  │ • Ostatnia znana pozycja (UWB/GPS)                          │   │
│  │ • Historia trajektorii                                       │   │
│  │ • Piętro z barometru                                         │   │
│  │                                                              │   │
│  │ Jeśli brak danych → przejdź do RECCO                        │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                         │                                          │
│                         ▼                                          │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ KROK 4: SKANOWANIE RECCO                                    │   │
│  │                                                              │   │
│  │ Operator detektora:                                          │   │
│  │ • Włącza detektor R9                                        │   │
│  │ • Ustawia czułość na MEDIUM                                 │   │
│  │ • Rozpoczyna skanowanie od ostatniej znanej pozycji         │   │
│  │                                                              │   │
│  │ Technika skanowania:                                         │   │
│  │ • Powolne ruchy poziome (90° łuk)                           │   │
│  │ • Nasłuchiwanie tonu (wyższy = bliżej)                      │   │
│  │ • Obserwacja LED                                            │   │
│  │ • Triangulacja z 2-3 punktów                                │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                         │                                          │
│                         ▼                                          │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ KROK 5: TRIANGULACJA                                        │   │
│  │                                                              │   │
│  │         Punkt A           Punkt B                           │   │
│  │            ◉ ─────────────── ◉                              │   │
│  │             \               /                               │   │
│  │              \    SYGNAŁ   /                                │   │
│  │               \   ┌───┐   /                                 │   │
│  │                \  │ ★ │  /                                  │   │
│  │                 \ └───┘ /                                   │   │
│  │                  \     /                                    │   │
│  │                   \   /                                     │   │
│  │                    \ /                                      │   │
│  │                     ◉                                       │   │
│  │                 Punkt C                                     │   │
│  │                                                              │   │
│  │ Przeprowadź pomiary z minimum 2 punktów,                    │   │
│  │ oznacz kierunek maksymalnego sygnału                        │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                         │                                          │
│                         ▼                                          │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ KROK 6: DOTARCIE I EWAKUACJA                                │   │
│  │                                                              │   │
│  │ • Podejście do źródła sygnału                               │   │
│  │ • Użycie kamery termo do potwierdzenia                      │   │
│  │ • Ewakuacja zgodnie z procedurą medyczną                    │   │
│  │ • Raport do dowódcy                                         │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 4.2 Technika skanowania

#### Schemat przeszukiwania spiralnego

```
    START
      │
      ▼
    ┌───┐
    │ ◉ │──────────────────────┐
    └───┘                      │
      │                        │
      │    ┌───────────────┐   │
      │    │               │   │
      │    │   ┌───────┐   │   │
      │    │   │       │   │   │
      │    │   │   ★   │   │   │
      │    │   │ OFIARA│   │   │
      │    │   └───────┘   │   │
      │    │               │   │
      │    └───────────────┘   │
      │                        │
      └────────────────────────┘
      
    Spirala rozszerzająca się od centrum
    Krok: ~3-5 m między zwojami
    Prędkość: wolna, systematyczna
```

#### Wskazówki dla operatora

1. **Przed skanowaniem:**
   - Sprawdź baterię detektora (min. 50%)
   - Wykonaj test na kontrolnym reflektorze
   - Ustaw czułość na MEDIUM

2. **Podczas skanowania:**
   - Trzymaj detektor poziomo
   - Powolne, płynne ruchy
   - Nasłuchuj zmian tonu (nie tylko obecności)
   - Oznaczaj miejsca z sygnałem

3. **Interpretacja:**
   - Sygnał silniejszy = bliżej do celu
   - Sygnał zanika za metalem = zmień pozycję
   - Wiele sygnałów = inne reflektory (sprzęt, inni strażacy)

4. **Fałszywe alarmy:**
   - Aparaty powietrzne (metal) mogą odbijać sygnał
   - Inne reflektory RECCO w okolicy
   - Rozróżnienie: reflektor daje charakterystyczny „czysty" ton

---

## 5. Integracja z systemem Nieśmiertelnik

### 5.1 Komplementarność technologii

| Sytuacja | System aktywny (UWB/LoRa) | RECCO |
|----------|---------------------------|-------|
| Normalna praca | ✅ Pełna telemetria | Nieużywany |
| Bateria wyczerpana | ❌ | ✅ Działa |
| Urządzenie uszkodzone | ❌ | ✅ Działa |
| Strażak nieprzytomny | ✅ (jeśli tag działa) | ✅ Działa |
| Brak zasięgu sieci | ❌ (brak uplinku) | ✅ Działa |
| Zasypanie gruzem | ⚠️ Ograniczone | ✅ Działa (krótszy zasięg) |

### 5.2 Scenariusz użycia

```
FAZA 1: Normalna akcja
├── System Nieśmiertelnik działa
├── Pozycja UWB aktualizowana co 1s
├── Telemetria przez LoRa
└── RECCO nieużywany (backup)

FAZA 2: Alarm MAN-DOWN
├── System wykrywa bezruch >30s
├── Alert na tablecie dowódcy
├── Ostatnia pozycja znana
└── RIT używa tej pozycji do nawigacji

FAZA 3: Utrata sygnału
├── Tag nie odpowiada (uszkodzony/bateria)
├── Ostatnia pozycja sprzed X minut
├── RIT włącza detektor RECCO
└── Skanowanie od ostatniej pozycji

FAZA 4: Lokalizacja RECCO
├── Detektor wykrywa reflektor
├── Triangulacja pozycji
├── Kamera termo potwierdza
└── Ewakuacja
```

### 5.3 UI aplikacji – moduł RECCO

Propozycja interfejsu dla zespołu RIT:

```
┌─────────────────────────────────────────────────────────────────────┐
│                    TRYB RECCO - POSZUKIWANIE                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                                                              │   │
│  │                      MAPA BUDYNKU                            │   │
│  │                                                              │   │
│  │         ⚠️ Ostatnia znana pozycja                            │   │
│  │            (5 min temu)                                      │   │
│  │                  │                                           │   │
│  │                  ▼                                           │   │
│  │              ┌───────┐                                       │   │
│  │              │   ★   │ ← Strażak (offline)                   │   │
│  │              └───────┘                                       │   │
│  │                                                              │   │
│  │         ◉ Punkt skanowania #1 (operator RIT)                 │   │
│  │         ◉ Punkt skanowania #2                                │   │
│  │                                                              │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌──────────────────┐  ┌──────────────────┐                        │
│  │ SYGNAŁ RECCO     │  │ INSTRUKCJE       │                        │
│  │                  │  │                  │                        │
│  │  ████████░░░░    │  │ 1. Idź do ⚠️     │                        │
│  │  Siła: 65%       │  │ 2. Włącz detektor│                        │
│  │  Kierunek: NE    │  │ 3. Skanuj 360°   │                        │
│  │                  │  │ 4. Oznacz kierun.│                        │
│  └──────────────────┘  └──────────────────┘                        │
│                                                                     │
│  [OZNACZ PUNKT] [RESETUJ] [WEZWIJ WSPARCIE]                        │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 6. Wdrożenie w PSP

### 6.1 Plan wyposażenia

#### Faza 1: Pilotaż (6 miesięcy)

| Element | Ilość | Koszt jednostkowy | Koszt całkowity |
|---------|-------|-------------------|-----------------|
| Reflektory (naklejki hełm) | 100 | 120 PLN | 12 000 PLN |
| Reflektory (wkładki but) | 100 | 100 PLN | 10 000 PLN |
| Detektor R9 | 2 | 0 PLN* | 0 PLN |
| Szkolenie (2 dni) | 1 | 10 000 PLN | 10 000 PLN |
| **RAZEM** | | | **32 000 PLN** |

*Detektory często udostępniane bezpłatnie służbom ratunkowym po szkoleniu

#### Faza 2: Rozszerzenie (12-24 miesiące)

- Wyposażenie wszystkich strażaków JRG w reflektory
- Detektor w każdej KM PSP
- Integracja z procedurami RIT
- Szkolenia cykliczne

### 6.2 Szkolenie

**Moduł podstawowy (4h):**
1. Teoria technologii RECCO
2. Obsługa detektora R9
3. Techniki skanowania
4. Interpretacja sygnałów

**Moduł praktyczny (4h):**
1. Ćwiczenia z ukrytym manekinem
2. Scenariusze „Firefighter Down"
3. Praca w zadymieniu
4. Współpraca z systemem Nieśmiertelnik

### 6.3 Utrzymanie

| Czynność | Częstotliwość | Wykonawca |
|----------|---------------|-----------|
| Test reflektorów | Co 6 miesięcy | Strażak (samodzielnie) |
| Kalibracja detektora | Co 12 miesięcy | Serwis RECCO |
| Ładowanie baterii | Po każdym użyciu | Operator |
| Wymiana reflektorów | Przy uszkodzeniu | Magazyn |

---

## 7. Alternatywne technologie (dla uczestników)

RECCO jest przykładem sprawdzonej technologii, ale **nie jedyną opcją**. Poniżej lista alternatyw do rozważenia:

### 7.1 Alternatywy pasywne

| Technologia | Zasięg | Koszt | Zalety | Wady |
|-------------|--------|-------|--------|------|
| **RFID UHF pasywny** | 5-15 m | $1-5 | Bardzo tani, masowa produkcja | Krótki zasięg |
| **Reflektory radarowe** | 10-50 m | $10-30 | Proste, niezawodne | Wymagają detektora |
| **Markery akustyczne** | 20-100 m | $5-20 | Działają przez przeszkody | Zakłócenia hałasem |
| **Fosforyzujące znaczniki** | Wizualny | $1-3 | Zero elektroniki | Tylko światło UV |

### 7.2 Alternatywy semi-pasywne

| Technologia | Zasięg | Bateria | Zalety | Wady |
|-------------|--------|---------|--------|------|
| **BLE Beacon (long-life)** | 50-100 m | 5+ lat | Tani, popularny | Wymaga smartfona |
| **LoRa Beacon** | 1-5 km | 2+ lat | Duży zasięg | Infrastruktura |
| **AIS MOB** | 2-5 km | 5+ lat | Morski standard | Wymaga odbiornika |

### 7.3 Kryteria oceny alternatyw

Proponując alternatywę, rozważ:

1. **Niezawodność** - Czy działa bez zasilania lub z minimalnym?
2. **Zasięg** - Jaki zasięg przez typowe materiały budowlane?
3. **Koszt** - Czy jest ekonomicznie uzasadniony na skalę PSP?
4. **Dostępność** - Czy detektory są dostępne lub łatwe do zbudowania?
5. **Integracja** - Czy można zintegrować z systemem Nieśmiertelnik?

### 7.4 Przykład alternatywy: Ultra-Long-Life BLE Beacon

```
┌─────────────────────────────────────────────────────────────────────┐
│              ALTERNATYWA: BLE BEACON ULTRA-LOW-POWER                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Komponent:     nRF52810 + CR2032                                  │
│  Zasięg:        30-50 m (BLE 5.0 Long Range)                       │
│  Bateria:       5+ lat (1 beacon/s, TX: -8 dBm)                    │
│  Koszt:         ~$8                                                 │
│  Detekcja:      Dowolny smartfon z BLE                             │
│                                                                     │
│  Zalety:                                                            │
│  • Każdy smartfon może być detektorem                              │
│  • Aplikacja RIT na telefonie                                      │
│  • Tańszy niż RECCO                                                │
│                                                                     │
│  Wady:                                                              │
│  • Wymaga baterii (choć na 5+ lat)                                 │
│  • BLE słabo przechodzi przez metal/wodę                           │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

> **Dla uczestników:** Jeśli proponujesz alternatywę, przygotuj:
> 1. Schemat blokowy rozwiązania
> 2. Analizę kosztów (BOM)
> 3. Porównanie z RECCO (tabela zalet/wad)
> 4. Prototyp UI dla detektora/aplikacji

---

## 8. Podsumowanie

### Zalety RECCO dla PSP

✅ **Niezawodność** – brak baterii = brak awarii  
✅ **Prostota** – zero obsługi dla strażaka  
✅ **Niski koszt** – reflektory tanie, detektory często bezpłatne  
✅ **Komplementarność** – backup dla systemów aktywnych  
✅ **Uniwersalność** – działa w każdych warunkach  

### Ograniczenia

⚠️ **Zasięg** – ograniczony przez materiały (metal, woda)  
⚠️ **Brak precyzji** – wskazuje kierunek, nie dokładną pozycję  
⚠️ **Wymagany operator** – nie działa automatycznie  
⚠️ **Brak telemetrii** – tylko lokalizacja, brak vitals  

### Rekomendacja

**RECCO powinno być obowiązkowym elementem wyposażenia każdego strażaka PSP** jako ostatnia linia obrony w sytuacjach krytycznych. Koszt implementacji jest niski, a potencjalna wartość – nieoceniona.

---

## 🔗 Powiązane dokumenty

| Dokument | Opis |
|----------|------|
| `README.md` | Przegląd pakietu dokumentacji |
| `01_KARTA_WYZWANIA_v2.md` | Oficjalna karta wyzwania |
| `02_SYMULATOR_API_v2.md` | Pełna dokumentacja API symulatora |
| `03_KONCEPCJA_HW_WYTYCZNE.md` | Wytyczne do dokumentacji hardware |
| `04_QUICK_START.md` | Szybki start dla uczestników |
| `EKOSYSTEM_URZADZEN_PELNA_SPECYFIKACJA.md` | Szczegółowa specyfikacja urządzeń |

---

*Dokument opracowany przez BIŁ KG PSP*
*Na podstawie materiałów RECCO AB oraz analizy wdrożeń w służbach ratunkowych*

*Technologia RECCO v2.4 - Cyfrowy Nieśmiertelnik PSP*
*HackNation 2025 - Grudzień 2025*
