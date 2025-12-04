# 03. Koncepcja Hardware - Wytyczne dla Uczestników
## Jak przygotować dokumentację sprzętową na hackathonie
### HackNation 2025 - Cyfrowy Nieśmiertelnik PSP v2.4

---

> **Symulator online:** https://niesmiertelnik.replit.app
>
> Symulator generuje realistyczne dane telemetryczne zgodne z opisaną tutaj specyfikacją hardware. Przetestuj swoją dokumentację z rzeczywistymi danymi!

---

## 🎯 Cel dokumentacji HW

Na hackathonie **NIE budujecie fizycznego prototypu**. Zamiast tego przygotowujecie **profesjonalną dokumentację koncepcyjną**, która pozwoli inżynierom PSP zrozumieć i ewentualnie zrealizować projekt.

**Co oceniamy:**
- Kompletność schematu blokowego
- Uzasadnienie wyboru komponentów
- Realność kosztów i dostępność części
- Analiza poboru energii i czasu pracy
- Przemyślenie aspektów praktycznych (obudowa, montaż, środowisko)

> Uwaga HackNation 2025: dokumentacja i kod zgłaszane na hackathon będą podlegać zapisom umowy przeniesienia praw autorskich oraz regulaminom wydarzenia (zob. `FORMALNO_PRAWNE_HACKNATION.md`). Zaplanuj udostępnienie schematów/BOM w repozytorium zgodnie z wymaganiami Organizatora.

---

## 📋 Wymagana struktura dokumentacji

### 1. Schemat blokowy (OBOWIĄZKOWY)

Narysuj schemat pokazujący wszystkie moduły i ich połączenia.

**Przykład dla Tagu Nieśmiertelnika:**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           TAG NIEŚMIERTELNIK v2.4                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │   UWB    │  │   GNSS   │  │   IMU    │  │  BARO    │  │ SENSORS  │      │
│  │ DWM3000  │  │  LC86L   │  │ BMI270   │  │ BMP390   │  │ CO/O2/T  │      │
│  │ SPI+IRQ  │  │  UART    │  │ SPI+IRQ  │  │   I2C    │  │   I2C    │      │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘      │
│       │             │             │             │             │             │
│       └─────────────┴──────┬──────┴─────────────┴─────────────┘             │
│                            │                                                │
│                   ┌────────┴────────┐                                       │
│                   │                 │                                       │
│                   │  MCU nRF52840   │◄────── BLE ◄──── HR Band              │
│                   │                 │                                       │
│                   │ ARM Cortex-M4F  │                                       │
│                   │ BLE 5.0 + Mesh  │                                       │
│                   │ Crypto Engine   │                                       │
│                   │                 │                                       │
│                   └────────┬────────┘                                       │
│                            │                                                │
│       ┌────────────────────┼────────────────────┐                           │
│       │                    │                    │                           │
│  ┌────┴─────┐        ┌─────┴─────┐        ┌─────┴─────┐                     │
│  │   LoRa   │        │  LTE-M    │        │   Flash   │                     │
│  │  SX1262  │        │SARA-R412M │        │ W25Q128   │                     │
│  │   SPI    │        │   UART    │        │   SPI     │                     │
│  └──────────┘        └───────────┘        └───────────┘                     │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         ZASILANIE + UI                               │   │
│  │  Li-Po 1500mAh → PMIC BQ25895 → 3.3V/1.8V LDO                       │   │
│  │                   ↑                                                  │   │
│  │              USB-C (5V/1A)    LED RGB + Buzzer 85dB + SOS Button    │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────┐                                                            │
│  │   RECCO    │  Reflektor pasywny (backup lokalizacji)                    │
│  │  Passive   │                                                            │
│  └─────────────┘                                                            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Wskazówki:**
- Użyj ASCII art lub narzędzi jak draw.io, Figma, Lucidchart
- Pokaż interfejsy (SPI, I2C, UART, GPIO)
- Zaznacz przepływ danych i zasilania
- Nie zapomnij o antenach!

---

### 2. Lista materiałowa (BOM) - OBOWIĄZKOWA

Tabela ze wszystkimi komponentami:

| # | Komponent | Model/Part Number | Producent | Ilość | Cena jedn. | Suma | Źródło | Uzasadnienie |
|---|-----------|-------------------|-----------|-------|------------|------|--------|--------------|
| 1 | MCU | nRF52840 | Nordic | 1 | $7.50 | $7.50 | DigiKey | BLE 5.0, ultra-low power, crypto |
| 2 | Moduł UWB | DWM3000 | Qorvo | 1 | $18.00 | $18.00 | Mouser | IEEE 802.15.4z, <10cm accuracy |
| 3 | GNSS | LC86L | Quectel | 1 | $12.00 | $12.00 | LCSC | Multi-constellation, low power |
| 4 | IMU | BMI270 | Bosch | 1 | $4.50 | $4.50 | DigiKey | 6-axis, wearable optimized |
| 5 | Barometr | BMP390 | Bosch | 1 | $2.50 | $2.50 | DigiKey | ±0.5m dokładność piętra |
| 6 | LoRa | SX1262 | Semtech | 1 | $6.00 | $6.00 | Mouser | 868 MHz EU, +22dBm |
| 7 | LTE-M | SARA-R412M | u-blox | 1 | $22.00 | $22.00 | DigiKey | Cat-M1/NB-IoT, PSM |
| 8 | Flash | W25Q128JV | Winbond | 1 | $2.00 | $2.00 | LCSC | 16MB, czarna skrzynka |
| 9 | Czujnik CO | TGS5042 | Figaro | 1 | $18.00 | $18.00 | Mouser | Elektrochem., 0-10000 ppm |
| 10 | Czujnik O2/LEL | SGP41 | Sensirion | 1 | $8.00 | $8.00 | DigiKey | VOC + NOx proxy |
| 11 | Temp/Hum | SHT40 | Sensirion | 1 | $3.00 | $3.00 | LCSC | ±0.2°C, ±1.8% RH |
| 12 | Reflektor RECCO | Standard | RECCO | 1 | $5.00 | $5.00 | RECCO | Pasywny backup |
| 13 | Bateria | Li-Po 1500mAh | Generic | 1 | $8.00 | $8.00 | Alibaba | High-temp rated |
| 14 | PMIC | BQ25895 | TI | 1 | $3.50 | $3.50 | DigiKey | USB-C charging, fuel gauge |
| 15 | Obudowa | Custom IP67 | - | 1 | $8.00 | $8.00 | - | ABS/PC, 75×50×22mm |
| 16 | Elementy pasywne | Misc | Various | 1 | $5.00 | $5.00 | LCSC | Kondensatory, rezystory |
| 17 | PCB | 4-layer FR4 | - | 1 | $3.00 | $3.00 | JLCPCB | 60×40mm |
| **SUMA** | | | | | | **~$135** | | |

**Wskazówki:**
- Podaj konkretne part numbers (nie "jakiś akcelerometr")
- Sprawdź dostępność na DigiKey/Mouser/LCSC
- Uzasadnij DLACZEGO wybrałeś ten komponent
- Uwzględnij elementy pasywne (kondensatory, rezystory) jako "~$5 misc"

---

### 3. Specyfikacja techniczna

**Wymiary i obudowa:**
```
Wymiary:        75 × 50 × 22 mm (jak paczka zapałek)
Waga:           ~85 g (z baterią)
Obudowa:        ABS/PC, IP67
Temp. pracy:    -20°C do +60°C
Odporność:      Upadek z 2m na beton
Mocowanie:      Klips do uprzęży SCBA
```

**Interfejsy:**
```
Ładowanie:      USB-C (5V/1A)
Wskaźniki:      LED RGB (status), Buzzer 85dB
Przyciski:      SOS (IP67, 3s hold to activate)
Anteny:         5× (UWB, GNSS, LoRa, LTE, BLE) - wewnętrzne PCB
```

---

### 4. Analiza poboru energii (WAŻNA!)

**Tabela trybów pracy:**

| Tryb | Opis | Pobór prądu | Czas pracy* |
|------|------|-------------|-------------|
| Deep Sleep | Tylko RTC | 15 µA | >1 rok |
| Standby | LoRa RX window co 30s | 500 µA | >30 dni |
| Outdoor Active | GNSS on, LoRa TX co 30s | 8 mA avg | ~180h |
| Indoor Active | UWB 1Hz, IMU fusion, LoRa | 25 mA avg | ~60h |
| Indoor High-rate | UWB 10Hz, full telemetry | 45 mA avg | ~33h |
| Alarm | Buzzer + LED + all radio | 120 mA | ~12h |

*Przy baterii 1500 mAh

**Wzór obliczeniowy:**
```
Czas pracy [h] = Pojemność baterii [mAh] / Średni pobór [mA]

Przykład Indoor Active:
1500 mAh / 25 mA = 60 godzin
```

**Budżet energetyczny (Indoor Active):**
```
MCU (active):           3.0 mA
UWB TX/RX (1Hz, 10ms):  5.0 mA avg (50mA × 10%)
IMU (continuous):       0.5 mA
Barometr (1Hz):         0.01 mA
BLE (HR rx):            0.5 mA
LoRa TX (co 30s):       2.0 mA avg
LTE-M (standby):        0.01 mA
Flash (write):          0.5 mA avg
Czujnik CO (continuous):1.5 mA
Czujniki środ. (I2C):   0.3 mA
PMIC overhead:          0.5 mA
────────────────────────────────
SUMA:                   ~14 mA (typowy)
                        ~25 mA (z marginesem bezpieczeństwa)
```

**Dane z symulatora:**
Symulator generuje realistyczne wartości baterii dla tagów (78-95%) i beaconów (90-98%), symulując zużycie energii w czasie rzeczywistym.

---

### 5. Uzasadnienie decyzji projektowych

Dla każdego kluczowego wyboru napisz 2-3 zdania DLACZEGO:

**Przykład:**

> **Dlaczego nRF52840 a nie ESP32?**
> 
> nRF52840 oferuje natywne wsparcie BLE 5.0 Long Range z lepszą energooszczędnością (3µA deep sleep vs 10µA ESP32). Wbudowany akcelerator kryptograficzny (AES, ECC) eliminuje potrzebę zewnętrznego Secure Element dla podstawowych operacji. Ekosystem Zephyr RTOS jest lepiej udokumentowany dla aplikacji wearable.

> **Dlaczego LoRa + LTE-M (oba)?**
> 
> LoRa zapewnia komunikację przez bramkę NIB bez kosztów operatora, ale ma ograniczony zasięg w budynkach. LTE-M (Cat-M1) działa jako fallback gdy strażak wyjdzie poza zasięg LoRa - np. przy ewakuacji na zewnątrz. Tryb PSM (Power Saving Mode) LTE-M pozwala na <10µA w standby, więc nie obciąża znacząco baterii.

---

### 6. Aspekty praktyczne

**Montaż i użytkowanie:**
- Gdzie na strażaku będzie zamontowany tag?
- Jak będzie ładowany? (stacja ładująca w remizie?)
- Jak często wymiana baterii?
- Jak odporna jest obudowa?

**Certyfikacje (do rozważenia):**
- CE (Europa) - wymagane dla urządzeń radiowych
- ATEX/IECEx - jeśli praca w strefach zagrożonych wybuchem
- IP67/IP68 - wodoodporność
- MIL-STD-810G - odporność na wstrząsy

**Produkcja:**
- Czy komponenty są dostępne w ilościach >1000 szt?
- Czy PCB można wyprodukować w standardowym procesie?
- Szacunkowy koszt przy różnych wolumenach

---

## 📡 Przykład: Beacon UWB

Oprócz tagu nieśmiertelnika, wyzwanie obejmuje również **beacon UWB** (kotwicę pozycyjną). Oto przykładowa specyfikacja:

**Schemat blokowy:**
```
┌─────────────────────────────────────────────────────┐
│                   BEACON UWB v2.4                   │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────┐        ┌──────────┐                  │
│  │   UWB    │        │  GNSS    │                  │
│  │ DWM3000  │        │  LC86L   │  (opcjonalny)    │
│  │ SPI+IRQ  │        │  UART    │                  │
│  └────┬─────┘        └────┬─────┘                  │
│       │                   │                        │
│       └─────────┬─────────┘                        │
│                 │                                  │
│        ┌────────┴────────┐                         │
│        │   MCU nRF52833  │                         │
│        │  ARM Cortex-M4  │                         │
│        │    BLE 5.0      │                         │
│        └────────┬────────┘                         │
│                 │                                  │
│        ┌────────┴────────┐                         │
│        │   LoRa SX1262   │  (do bramki NIB)        │
│        └─────────────────┘                         │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │              ZASILANIE                       │   │
│  │  Li-Po 6000mAh (wewnętrzna) lub PoE        │   │
│  │  lub zasilacz 5V USB-C (zewnętrzny)        │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  LED status (zielony/czerwony)                     │
│  Obudowa IP65, magnes montażowy                    │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**BOM beacona (~$85):**

| # | Komponent | Model | Cena |
|---|-----------|-------|------|
| 1 | MCU | nRF52833 | $5.50 |
| 2 | UWB | DWM3000 | $18.00 |
| 3 | LoRa | SX1262 | $6.00 |
| 4 | GNSS (opcja) | LC86L | $12.00 |
| 5 | Bateria | Li-Po 6000mAh | $15.00 |
| 6 | Obudowa | IP65 z magnesem | $12.00 |
| 7 | Anteny + PCB + misc | - | $16.50 |

**Specyfikacja:**
```
Wymiary:        120 × 80 × 35 mm
Waga:           ~180 g (z baterią)
Zasięg UWB:     50m (LOS), 20m (NLOS)
Czas pracy:     >7 dni (bateria), ciągłe (zasilacz)
Temp. pracy:    -20°C do +50°C
Montaż:         Magnes neodymowy + taśma 3M VHB
```

---

## 📝 Szablon dokumentu HW

```markdown
# Koncepcja Hardware: [NAZWA URZĄDZENIA]
## Zespół: [NAZWA ZESPOŁU]

### 1. Opis ogólny
[2-3 zdania co to urządzenie robi]

### 2. Schemat blokowy
[ASCII art lub załączony obrazek]

### 3. Lista materiałowa (BOM)
[Tabela z komponentami]

**Suma BOM:** $XXX (~XXX PLN)

### 4. Specyfikacja techniczna
- Wymiary: XX × XX × XX mm
- Waga: XX g
- Zasilanie: [typ baterii, pojemność]
- Czas pracy: XX h (tryb aktywny)
- Obudowa: [materiał, IP rating]
- Temp. pracy: -XX°C do +XX°C

### 5. Analiza energetyczna
[Tabela trybów + obliczenia]

### 6. Uzasadnienie wyborów
[Dlaczego te komponenty?]

### 7. Aspekty praktyczne
[Montaż, ładowanie, certyfikacje]

### 8. Ryzyka i ograniczenia
[Co może pójść nie tak?]
```

---

## ✅ Checklist przed oddaniem

- [ ] Schemat blokowy jest czytelny i kompletny
- [ ] BOM zawiera konkretne part numbers
- [ ] Ceny są realistyczne i zsumowane
- [ ] Obliczenia energetyczne się zgadzają
- [ ] Każdy kluczowy wybór jest uzasadniony
- [ ] Wymiary i waga są realistyczne
- [ ] Rozważono aspekty praktyczne (IP rating, montaż)
- [ ] Dokument jest dobrze sformatowany

---

## 🏆 Co wyróżnia najlepsze dokumentacje?

1. **Szczegółowość** - konkretne modele, nie "jakiś moduł GPS"
2. **Realizm** - sprawdzone ceny i dostępność
3. **Innowacyjność** - ciekawe rozwiązania problemów
4. **Kompletność** - nic nie pominięte
5. **Czytelność** - łatwo zrozumieć dla osoby z zewnątrz

---

## 📚 Zasoby

- [DigiKey](https://www.digikey.com) - komponenty, datasheety
- [Mouser](https://www.mouser.com) - komponenty
- [LCSC](https://www.lcsc.com) - tanie komponenty z Chin
- [Octopart](https://octopart.com) - porównywarka cen
- [EasyEDA](https://easyeda.com) - darmowy edytor schematów
- [draw.io](https://draw.io) - diagramy blokowe

---

## 🔗 Powiązane dokumenty

| Dokument | Opis |
|----------|------|
| `README.md` | Przegląd pakietu dokumentacji |
| `01_KARTA_WYZWANIA_v2.md` | Oficjalna karta wyzwania |
| `02_SYMULATOR_API_v2.md` | Pełna dokumentacja API symulatora |
| `04_QUICK_START.md` | Szybki start dla uczestników |
| `05_TECHNOLOGIA_RECCO.md` | System backup lokalizacji RECCO |
| `EKOSYSTEM_URZADZEN_PELNA_SPECYFIKACJA.md` | Szczegółowa specyfikacja urządzeń |

---

*Wytyczne Hardware v2.4 - Cyfrowy Nieśmiertelnik PSP*
*HackNation 2025 - Grudzień 2025*

**Powodzenia z dokumentacją hardware!**
