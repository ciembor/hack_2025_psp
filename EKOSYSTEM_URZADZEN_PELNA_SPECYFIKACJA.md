# Ekosystem Urządzeń „Cyfrowy Nieśmiertelnik PSP"
## Pełna Specyfikacja Techniczna
### HackNation 2025

**Wersja:** 2.4
**Status:** Dokumentacja dla hackathonu
**Autor:** BIŁ KG PSP

---

> **Symulator online:** https://niesmiertelnik.replit.app
>
> Wszystkie urządzenia opisane w tym dokumencie są symulowane przez API. Połącz się przez WebSocket (`wss://niesmiertelnik.replit.app/ws`) aby odbierać dane telemetryczne w czasie rzeczywistym!

---

> HackNation 2025: ten opis ekosystemu jest częścią pakietu konkursowego; obowiązują regulaminy i wzory dokumentów opisane w `FORMALNO_PRAWNE_HACKNATION.md`. Projekty nagrodzone wymagają przekazania kodu/dokumentacji zgodnie z umową przeniesienia praw.

---

# SPIS TREŚCI

1. [Przegląd ekosystemu](#1-przegląd-ekosystemu)
2. [URZĄDZENIE 1: Tag Nieśmiertelnik](#2-urządzenie-1-tag-nieśmiertelnik)
3. [URZĄDZENIE 2: Beacon UWB](#3-urządzenie-2-beacon-uwb)
4. [URZĄDZENIE 3: Bramka NIB (Network-in-the-Box)](#4-urządzenie-3-bramka-nib)
5. [URZĄDZENIE 4: Pasek HR (BLE)](#5-urządzenie-4-pasek-hr-ble)
6. [URZĄDZENIE 5: Reflektor RECCO](#6-urządzenie-5-reflektor-recco)
7. [URZĄDZENIE 6: Detektor RECCO](#7-urządzenie-6-detektor-recco)
8. [Podsumowanie kosztów](#8-podsumowanie-kosztów)
9. [Matryca komunikacji](#9-matryca-komunikacji)

---

# 1. Przegląd ekosystemu

## 1.1 Architektura systemu

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CHMURA PSP / STANOWISKO KIEROWANIA                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │ Serwer MQTT │  │ Baza danych │  │  CAD/AVL    │  │ Repozytorium│        │
│  │   Broker    │  │    Logów    │  │ (HxGN OnCall│  │   Czarnych  │        │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  │   Skrzynek  │        │
│         └────────────────┴─────────────────┴────────┴──────┬──────┘        │
│                                    ▲                        │               │
│                                    │ VPN/TLS               │               │
└────────────────────────────────────┼────────────────────────┼───────────────┘
                                     │                        │
                    ┌────────────────┴────────────────────────┘
                    │
          ┌─────────▼─────────┐
          │                   │
          │   BRAMKA NIB      │◄─────── LTE/5G do chmury
          │ (Network-in-Box)  │◄─────── GPS (czas + pozycja pojazdu)
          │                   │◄─────── WiFi AP (tablet dowódcy)
          │   W POJEŹDZIE     │
          │                   │
          └─────────┬─────────┘
                    │
      ┌─────────────┼─────────────┐
      │LoRaWAN 868MHz             │
      ▼             ▼             ▼
┌─────────┐   ┌─────────┐   ┌─────────┐
│   TAG   │   │   TAG   │   │   TAG   │
│Strażak 1│   │Strażak 2│   │Strażak 3│
└────┬────┘   └────┬────┘   └────┬────┘
     │             │             │
     │ UWB TWR     │ UWB TWR     │ UWB TWR
     ▼             ▼             ▼
┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐
│ BEACON  │   │ BEACON  │   │ BEACON  │   │ BEACON  │
│   B1    │   │   B2    │   │   B3    │   │   B4    │
│ Wejście │   │Korytarz │   │ Klatka  │   │1.piętro │
└─────────┘   └─────────┘   └─────────┘   └─────────┘

SYSTEM PASYWNY (BACKUP):
┌─────────────┐         ┌─────────────┐
│  REFLEKTOR  │ ◄─────► │  DETEKTOR   │
│    RECCO    │  radar  │    RECCO    │
│ (w mundurze)│ 1.6 GHz │  (ręczny)   │
└─────────────┘         └─────────────┘
```

## 1.2 Tabela urządzeń

| ID | Urządzenie | Typ | Ilość/zastęp | Kluczowa funkcja |
|----|------------|-----|--------------|------------------|
| U1 | Tag Nieśmiertelnik | Aktywny, noszony | 6-8 szt | Lokalizacja + telemetria strażaka |
| U2 | Beacon UWB | Aktywny, rozstawiany | 6-12 szt | Kotwica pozycyjna dla UWB RTLS |
| U3 | Bramka NIB | Aktywny, w pojeździe | 1-2 szt | Koncentrator sieci, uplink do chmury |
| U4 | Pasek HR | Aktywny, noszony | 6-8 szt | Pomiar tętna (BLE do tagu) |
| U5 | Reflektor RECCO | Pasywny, w mundurze | 2 szt/osoba | Backup lokalizacji (pasywny) |
| U6 | Detektor RECCO | Aktywny, przenośny | 1 szt/powiat | Wyszukiwanie zaginionych |

---

# 2. URZĄDZENIE 1: Tag Nieśmiertelnik

## 2.1 Opis funkcjonalny

Kompaktowe urządzenie noszone przez każdego strażaka, zapewniające:
- Precyzyjną lokalizację indoor (UWB) i outdoor (GNSS)
- Określanie kondygnacji (barometr)
- Monitorowanie ruchu i wykrywanie upadku (IMU)
- Odbiór danych o tętnie (BLE z paska HR)
- **Monitoring środowiska** (CO, O2, LEL, temperatura)
- Transmisję danych przez LoRa i/lub LTE-M
- Lokalny zapis danych („czarna skrzynka")
- Sygnalizację alarmów (LED, buzzer, wibracja)

## 2.2 Schemat blokowy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          TAG NIEŚMIERTELNIK PSP                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────── MODUŁY LOKALIZACJI ────────────────────┐            │
│  │                                                             │            │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │            │
│  │  │     UWB     │  │    GNSS     │  │     IMU     │         │            │
│  │  │  DWM3000    │  │  LC86L      │  │  BMI270     │         │            │
│  │  │             │  │             │  │             │         │            │
│  │  │ • IEEE      │  │ • GPS       │  │ • 6-axis    │         │            │
│  │  │   802.15.4z │  │ • Galileo   │  │ • Accel 16g │         │            │
│  │  │ • TWR/TDoA  │  │ • GLONASS   │  │ • Gyro 2000°│         │            │
│  │  │ • <10cm acc │  │ • BeiDou    │  │ • 6.4kHz ODR│         │            │
│  │  │ • Ch5/Ch9   │  │ • 1Hz-10Hz  │  │             │         │            │
│  │  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘         │            │
│  │         │                │                │                 │            │
│  └─────────┼────────────────┼────────────────┼─────────────────┘            │
│            │                │                │                              │
│            └────────────────┴────────┬───────┘                              │
│                                      │                                      │
│  ┌───────────────────────────────────▼────────────────────────────────────┐ │
│  │                           MIKROKONTROLER                               │ │
│  │                          nRF52840 (Nordic)                             │ │
│  │                                                                        │ │
│  │  • ARM Cortex-M4F @ 64 MHz          • 1 MB Flash / 256 KB RAM         │ │
│  │  • BLE 5.0 Long Range               • USB 2.0 Full Speed             │ │
│  │  • Zephyr RTOS                      • Crypto accelerator (AES)       │ │
│  │  • Ultra-low power (3 µA sleep)     • 48 GPIO                        │ │
│  └───────────────────────────────────┬────────────────────────────────────┘ │
│                                      │                                      │
│  ┌───────────────────────────────────┼────────────────────────────────────┐ │
│  │                                   │                                    │ │
│  │  ┌─────────────┐  ┌─────────────┐ │ ┌─────────────┐  ┌─────────────┐   │ │
│  │  │  BAROMETR   │  │  ŚRODOWISKO │ │ │    LoRa     │  │   LTE-M     │   │ │
│  │  │   BMP390    │  │ TGS5042+    │ │ │   SX1262    │  │  SARA-R412M │   │ │
│  │  │             │  │ SGP41+SHT40 │ │ │             │  │             │   │ │
│  │  │ • ±0.5m acc │  │             │ │ │ • 868 MHz   │  │ • LTE Cat-M1│   │ │
│  │  │ • 0.33 Pa   │  │ • CO 0-10k  │ │ │ • +22 dBm   │  │ • NB-IoT    │   │ │
│  │  │   resolution│  │ • O2/LEL    │ │ │ • LoRaWAN   │  │ • PSM mode  │   │ │
│  │  │ • Temp sens │  │ • Temp/Hum  │ │ │   1.0.4     │  │ • +23 dBm   │   │ │
│  │  └─────────────┘  └─────────────┘ │ └─────────────┘  └─────────────┘   │ │
│  │                                   │                                    │ │
│  └─────── CZUJNIKI (BARO+ENV) ───────┴─────────── KOMUNIKACJA ────────────┘ │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │                           PAMIĘĆ I ZASILANIE                            ││
│  │                                                                         ││
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    ││
│  │  │   FLASH     │  │   PMIC      │  │   BATERIA   │  │  FUEL GAUGE │    ││
│  │  │  W25Q128JV  │  │  BQ25895    │  │  Li-Po      │  │  MAX17048   │    ││
│  │  │             │  │             │  │  1500 mAh   │  │             │    ││
│  │  │ • 16 MB     │  │ • 5V→3.3V   │  │             │  │ • SOC %     │    ││
│  │  │ • 104 MHz   │  │ • USB-C PD  │  │ • 3.7V nom  │  │ • Temp comp │    ││
│  │  │ • Czarna    │  │ • Charging  │  │ • High temp │  │ • 0.5% acc  │    ││
│  │  │   skrzynka  │  │   indicator │  │   rated     │  │             │    ││
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘    ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │                        INTERFEJS UŻYTKOWNIKA                            ││
│  │                                                                         ││
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    ││
│  │  │   LED RGB   │  │   BUZZER    │  │  WIBRACJA   │  │ PRZYCISK SOS│    ││
│  │  │             │  │   Piezo     │  │   ERM motor │  │             │    ││
│  │  │ • Status    │  │             │  │             │  │ • Podświetl │    ││
│  │  │ • Alarm     │  │ • 85 dB     │  │ • Haptic    │  │ • Wodoproof │    ││
│  │  │ • Ładowanie │  │ • PASS-like │  │   feedback  │  │ • 3s hold   │    ││
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘    ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                             │
│  ┌─────────────────── ANTENY ──────────────────────────────────────────────┐│
│  │  [ANT UWB 6-8 GHz]  [ANT GNSS L1/L5]  [ANT LoRa 868]  [ANT LTE]  [BLE] ││
│  └─────────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────┘
```

## 2.3 Lista komponentów (BOM)

| Kategoria | Komponent | Model | Producent | Qty | Cena USD | Uzasadnienie |
|-----------|-----------|-------|-----------|-----|----------|--------------|
| **MCU** | Mikrokontroler | nRF52840 | Nordic | 1 | $7.50 | BLE 5.0 LE, ultra-low power, Zephyr RTOS |
| **UWB** | Moduł UWB | DWM3000 | Qorvo | 1 | $18.00 | IEEE 802.15.4z, najlepsza dokładność, Ch5+Ch9 |
| **GNSS** | Odbiornik GNSS | LC86L | Quectel | 1 | $12.00 | Multi-constellation, ultra-low power, L1+L5 |
| **IMU** | Akcelerometr+Żyroskop | BMI270 | Bosch | 1 | $4.50 | 6-axis, wearable optimized, step counter |
| **BARO** | Barometr | BMP390 | Bosch | 1 | $2.50 | ±0.5m accuracy, temperature compensated |
| **CO** | Czujnik CO | TGS5042 | Figaro | 1 | $18.00 | Elektrochemiczny, 0-10000 ppm |
| **O2/LEL** | Czujnik VOC/NOx | SGP41 | Sensirion | 1 | $8.00 | Proxy dla O2/LEL, I2C |
| **TEMP** | Temp/Humidity | SHT40 | Sensirion | 1 | $3.00 | ±0.2°C, ±1.8% RH |
| **LoRa** | Transceiver LoRa | SX1262 | Semtech | 1 | $6.00 | 868 MHz EU, +22 dBm, LoRaWAN 1.0.4 |
| **LTE-M** | Modem LTE-M/NB-IoT | SARA-R412M | u-blox | 1 | $22.00 | Cat-M1 + NB1, PSM, global bands |
| **FLASH** | Pamięć Flash | W25Q128JV | Winbond | 1 | $2.00 | 16 MB, czarna skrzynka (~72h logów) |
| **SECURE** | Secure Element | ATECC608B | Microchip | 1 | $1.50 | ECC P256, AES-256, key storage |
| **PMIC** | Zarządzanie energią | BQ25895 | TI | 1 | $3.00 | USB-C charging, power path |
| **FUEL** | Fuel Gauge | MAX17048 | Analog | 1 | $1.50 | SOC estimation, temp compensated |
| **BAT** | Bateria Li-Po | 1500mAh 3.7V | Various | 1 | $8.00 | High-temp rated (do 60°C) |
| **ANT** | Anteny (5x) | Ceramiczne/PCB | Various | 5 | $5.00 | UWB, GNSS, LoRa, LTE, BLE |
| **UI** | LED RGB | SK6812MINI | Worldsemi | 1 | $0.30 | Addressable, bright |
| **UI** | Buzzer piezo | SMD 9.6mm | TDK | 1 | $1.00 | 85 dB @ 3V |
| **UI** | Motor wibracyjny | ERM 10mm | Various | 1 | $1.50 | Haptic feedback |
| **UI** | Przycisk wodoodporny | IP67 tactile | Various | 1 | $0.50 | SOS button |
| **MISC** | Obudowa IP67 | Custom ABS/PC | - | 1 | $8.00 | 75×50×22mm, fire-resistant |
| **MISC** | Złącze USB-C | IP67 | Various | 1 | $1.50 | Charging + debug |
| **MISC** | PCB 4-layer | FR4 1.6mm | - | 1 | $3.00 | Multilayer for RF |
| **MISC** | Passive components | Various | - | set | $2.00 | Resistors, caps, crystals |

### **SUMA BOM (1 szt):** ~$136 USD (~550 PLN)

> **Uwaga:** Cena zawiera czujniki środowiskowe (CO, O2/LEL, temp/hum) - $29 dodatkowe.

### Koszt produkcji:
| Skala | Koszt/szt | Uwagi |
|-------|-----------|-------|
| Prototyp (10 szt) | ~1400 PLN | Ręczny montaż, testy |
| Mała seria (100 szt) | ~950 PLN | SMT assembly |
| Produkcja (1000+ szt) | ~700 PLN | Volume discounts |

## 2.4 Specyfikacja techniczna

| Parametr | Wartość | Uwagi |
|----------|---------|-------|
| **Wymiary** | 75 × 50 × 22 mm | Wielkość paczki zapałek |
| **Waga** | ~85 g (z baterią) | |
| **Obudowa** | ABS/PC IP67 | Odporność na wodę, pył |
| **Temp. pracy** | -20°C do +60°C | Bateria limituje górny zakres |
| **Temp. przechow.** | -40°C do +85°C | |
| **Odporność na upadek** | 2m na beton | Wewnętrzna pianka |
| **Czas pracy (aktywny)** | >48h | UWB 1Hz, LoRa co 30s |
| **Czas pracy (standby)** | >30 dni | GPS off, 1 pomiar/min |
| **Ładowanie** | USB-C PD, 2h do 100% | |
| **Dokładność UWB** | <30 cm (3+ beaconów) | TWR mode |
| **Dokładność GNSS** | <3m (open sky) | Multi-constellation |
| **Dokładność baro (Z)** | ±0.5m | Po kalibracji |
| **Częstotliwość danych** | 1-10 Hz | Adaptacyjna |
| **Pojemność logów** | ~72h | 16MB Flash @ 60 B/record |

## 2.5 Tryby pracy

| Tryb | Opis | Pobór mocy | Czas pracy |
|------|------|------------|------------|
| **Deep Sleep** | Poza akcją, minimalna aktywność | ~15 µA | >1 rok |
| **Standby** | W gotowości, nasłuch sieci | ~500 µA | >30 dni |
| **Outdoor Active** | GNSS on, LoRa co 30s | ~8 mA avg | ~180h |
| **Indoor Active** | UWB 1Hz, IMU fusion, LoRa | ~25 mA avg | ~60h |
| **Indoor High-rate** | UWB 10Hz, pełna telemetria | ~45 mA avg | ~33h |
| **Alarm** | Buzzer + LED + wszystkie radio | ~120 mA | ~12h |

---

# 3. URZĄDZENIE 2: Beacon UWB

## 3.1 Opis funkcjonalny

Przenośna kotwica pozycyjna rozmieszczana przez strażaków przy wejściach i w kluczowych punktach budynku. Tworzy lokalny układ współrzędnych dla systemu RTLS.

**Funkcje:**
- Odpowiadanie na zapytania UWB TWR (Two-Way Ranging) od tagów
- Oznaczanie stref (ENTRY, EXIT, FLOOR_N)
- Automatyczna kalibracja pozycji względem innych beaconów
- Sygnalizacja statusu (LED)
- Długi czas pracy na baterii lub zasilanie zewnętrzne

## 3.2 Schemat blokowy

```
┌─────────────────────────────────────────────────────────────────┐
│                        BEACON UWB PSP                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │     UWB     │  │     MCU     │  │   FLASH     │             │
│  │  DWM3000    │  │  nRF52833   │  │  W25Q32     │             │
│  │             │  │             │  │             │             │
│  │ • TWR resp  │  │ • BLE 5.0   │  │ • 4 MB      │             │
│  │ • TDoA anch │  │ • Low power │  │ • Config    │             │
│  │ • Ch5/Ch9   │  │ • 64 MHz    │  │   storage   │             │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘             │
│         │                │                │                     │
│         └────────────────┴────────────────┘                     │
│                          │                                      │
│  ┌───────────────────────┼───────────────────────────────────┐  │
│  │         ZASILANIE     │                                   │  │
│  │  ┌─────────────┐  ┌───┴───────┐  ┌─────────────┐         │  │
│  │  │   BATERIA   │  │   PMIC    │  │   USB-C     │         │  │
│  │  │  18650      │  │  TPS62840 │  │  lub DC-in  │         │  │
│  │  │  3400 mAh   │  │           │  │  5-12V      │         │  │
│  │  └─────────────┘  └───────────┘  └─────────────┘         │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │    [LED STATUS]   [MAGNES MONTAŻOWY]   [ANTENA UWB]      │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 3.3 Lista komponentów (BOM)

| Komponent | Model | Cena USD | Uzasadnienie |
|-----------|-------|----------|--------------|
| MCU | nRF52833 | $4.50 | Tańszy niż 52840, wystarczający |
| UWB | DWM3000 | $18.00 | Kompatybilność z tagami |
| Flash | W25Q32 | $0.50 | Konfiguracja |
| Bateria | 18650 3400mAh | $5.00 | Długi czas pracy |
| PMIC | TPS62840 | $1.50 | Ultra-low quiescent |
| Obudowa | IP65 ABS 100×60×35mm | $4.00 | Wodoodporna |
| Magnes | Neodymowy N52 | $2.00 | Montaż na metalowych powierzchniach |
| LED | WS2812B | $0.20 | Status |
| Antena UWB | Ceramiczna | $1.50 | 6-8 GHz |
| PCB + misc | - | $3.00 | |

### **SUMA BOM:** ~$40 USD (~160 PLN)
### **Koszt produkcji (100 szt):** ~350 PLN/szt

## 3.4 Specyfikacja

| Parametr | Wartość |
|----------|---------|
| Wymiary | 100 × 60 × 35 mm |
| Waga | ~150 g (z baterią) |
| Obudowa | IP65 |
| Czas pracy (bat) | >72h ciągłej pracy |
| Zasilanie zewn. | 5-12V DC lub USB-C |
| Zasięg UWB | do 50m (LOS) |
| Montaż | Magnes / Velcro / Śruba |

---

# 4. URZĄDZENIE 3: Bramka NIB (Network-in-the-Box)

## 4.1 Opis funkcjonalny

Mobilny koncentrator sieciowy montowany w pojeździe ratowniczym. Pełni rolę:
- Bramki LoRaWAN (odbiera dane z tagów)
- Routera z uplinkiem LTE/5G do chmury PSP
- Lokalnego serwera (cache, wizualizacja offline)
- Access Point WiFi dla tabletu dowódcy
- Odbiornika GPS (czas, pozycja pojazdu)

## 4.2 Schemat blokowy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    BRAMKA NIB (NETWORK-IN-THE-BOX)                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                        COMPUTE MODULE                                │   │
│  │                                                                      │   │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐      │   │
│  │  │  Raspberry Pi   │  │     SSD         │  │    RAM          │      │   │
│  │  │  CM4 8GB        │  │   256 GB NVMe   │  │   8 GB LPDDR4   │      │   │
│  │  │                 │  │                 │  │                 │      │   │
│  │  │ • Quad A72      │  │ • Cache logów   │  │ • Edge compute  │      │   │
│  │  │ • Linux/Docker  │  │ • Mapy offline  │  │                 │      │   │
│  │  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘      │   │
│  │           └────────────────────┴────────────────────┘               │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                      │                                      │
│  ┌───────────────────────────────────┼───────────────────────────────────┐  │
│  │              MODUŁY RADIOWE       │                                   │  │
│  │                                   │                                   │  │
│  │  ┌─────────────┐  ┌─────────────┐ │ ┌─────────────┐  ┌─────────────┐  │  │
│  │  │  LoRaWAN    │  │   LTE/5G    │ │ │    WiFi     │  │    GPS      │  │  │
│  │  │ Concentrator│  │   Modem     │ │ │    AP       │  │   Module    │  │  │
│  │  │  RAK2287    │  │  RM502Q-AE  │ │ │  MT7921     │  │  NEO-M9N    │  │  │
│  │  │             │  │             │ │ │             │  │             │  │  │
│  │  │ • 8 kanałów │  │ • 5G SA/NSA │ │ │ • WiFi 6    │  │ • Multi-GNSS│  │  │
│  │  │ • SX1302    │  │ • LTE Cat20 │ │ │ • Dual band │  │ • 1PPS out  │  │  │
│  │  │ • Class A/C │  │ • 2 SIM     │ │ │ • AP mode   │  │ • Time sync │  │  │
│  │  └─────────────┘  └─────────────┘ │ └─────────────┘  └─────────────┘  │  │
│  └───────────────────────────────────┴───────────────────────────────────┘  │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                          ZASILANIE                                   │   │
│  │                                                                      │   │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐      │   │
│  │  │   DC-DC 12V→5V  │  │   UPS / Bateria │  │   Złącze 12V DC │      │   │
│  │  │   10A output    │  │   LiFePO4 20Ah  │  │   z pojazdu     │      │   │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │   [ANT LoRa 868]  [ANT LTE MIMO]  [ANT WiFi]  [ANT GPS]  [ETH RJ45] │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 4.3 Lista komponentów (BOM)

| Komponent | Model | Cena USD | Uzasadnienie |
|-----------|-------|----------|--------------|
| Compute | Raspberry Pi CM4 8GB | $90 | Linux, Docker, edge compute |
| Carrier Board | CM4 IO Board | $35 | PCIe, USB, GPIO |
| SSD | NVMe 256GB | $30 | Cache, logs, offline maps |
| LoRaWAN | RAK2287 | $120 | 8-ch concentrator, SX1302 |
| LTE/5G | Quectel RM502Q-AE | $180 | 5G SA/NSA, 2×SIM |
| WiFi | MT7921 M.2 | $25 | WiFi 6 AP |
| GPS | u-blox NEO-M9N | $50 | Multi-GNSS, 1PPS |
| PSU | DC-DC 12V→5V 10A | $20 | Vehicle power |
| UPS | LiFePO4 20Ah | $80 | Backup power (2h) |
| Obudowa | Aluminium IP65 | $50 | Vehicle mount, cooling |
| Anteny (4x) | External MIMO | $40 | LoRa, LTE×2, GPS, WiFi |
| Kable, złącza | Various | $30 | |

### **SUMA BOM:** ~$750 USD (~3000 PLN)
### **Koszt produkcji (10 szt):** ~4500 PLN/szt

## 4.4 Specyfikacja

| Parametr | Wartość |
|----------|---------|
| Wymiary | 250 × 200 × 80 mm |
| Waga | ~2.5 kg |
| Obudowa | Aluminium IP65 |
| Zasilanie | 12V DC (pojazd) |
| Pobór mocy | 15-30W |
| Backup | 2h na wew. baterii |
| Temp. pracy | -20°C do +55°C |
| Zasięg LoRa | do 5 km (teren otwarty) |
| Zasięg WiFi | do 100m |
| Pojemność logów | 256 GB (tygodnie danych) |

## 4.5 Oprogramowanie

- **OS:** Raspberry Pi OS Lite (64-bit)
- **Containers:** Docker + Docker Compose
- **LoRaWAN:** ChirpStack Gateway Bridge + Network Server
- **Broker:** Mosquitto MQTT
- **Database:** InfluxDB (timeseries)
- **Visualization:** Grafana + custom WebApp
- **VPN:** WireGuard do chmury PSP
- **Offline maps:** MapTiler / OpenStreetMap tiles

---

# 5. URZĄDZENIE 4: Pasek HR (BLE)

## 5.1 Opis funkcjonalny

Pasek piersiowy lub opaska nadgarstkowa do pomiaru tętna, komunikująca się przez BLE z tagiem nieśmiertelnika.

**Opcje:**
- **Gotowy produkt** – Polar H10, Garmin HRM-Pro (certyfikowane, niezawodne)
- **Custom** – własny design dla integracji z munduthem

## 5.2 Rekomendacja: Polar H10

| Parametr | Wartość |
|----------|---------|
| Model | Polar H10 |
| Cena | ~$90 (360 PLN) |
| Protokół | BLE GATT HRS (Heart Rate Service) |
| Dokładność | ±1 bpm (lab-grade) |
| Bateria | CR2025, ~400h |
| Wodoodporność | IP68 (do 30m) |
| Zakres HR | 30-240 bpm |

**Uzasadnienie:** 
- Certyfikowany jako urządzenie medyczne (dokładność)
- Standard BLE HRS – łatwa integracja
- Sprawdzony w ekstremalnych warunkach (sport)
- Bateria wymieniana przez użytkownika

## 5.3 Alternatywa: Custom Chest Strap

Dla pełnej integracji (np. w mundurze):

| Komponent | Model | Cena |
|-----------|-------|------|
| MCU | nRF52810 | $2.50 |
| ECG Frontend | AD8232 | $5.00 |
| Elektrody | Suche tekstylne | $3.00 |
| Bateria | CR2032 | $0.50 |
| Pasek elastyczny | Custom | $4.00 |
| **RAZEM** | | ~$15 (~60 PLN) |

---

# 6. URZĄDZENIE 5: Reflektor RECCO

## 6.1 Opis funkcjonalny

**Pasywny** element lokalizacyjny działający jako backup gdy systemy aktywne zawiodą. Reflektor RECCO to dioda rezonansowa, która odbija sygnał radarowy detektora z podwójną częstotliwością.

**Zasada działania:**
1. Detektor wysyła sygnał 1.6 GHz
2. Reflektor pochłania energię i odbija sygnał 3.2 GHz
3. Detektor odbiera echo i wskazuje kierunek/odległość

**Zalety:**
- **Zero zasilania** – działa wiecznie
- **Zero obsługi** – brak baterii, brak włączania
- **Małe wymiary** – można wszyć w mundur
- **Działa gdy strażak nieprzytomny**

## 6.2 Specyfikacja

| Parametr | Wartość |
|----------|---------|
| Technologia | RECCO (Szwecja) |
| Typ | Pasywna dioda harmoniczna |
| Częstotliwość | 1.6 GHz → 3.2 GHz |
| Zasięg (detektor ręczny) | do 80m (otwarta przestrzeń) |
| Zasięg (gruz/śnieg) | 5-20m |
| Wymiary | 65 × 25 × 3 mm (naklejka) |
| Waga | ~4 g |
| Cena | ~$20-40 (80-160 PLN) |
| Żywotność | >20 lat |

## 6.3 Warianty

| Wariant | Opis | Zastosowanie |
|---------|------|--------------|
| **Helmet Rescue** | Naklejka na hełm | Widoczna, łatwy montaż |
| **Sewn-in** | Wszyty w mundur | Fabryczna integracja |
| **Clip-on** | Przypinka do uprzęży | Uniwersalna |

## 6.4 Rozmieszczenie

Zalecane minimum **2 reflektory na strażaka**:
1. Na hełmie (górna część ciała)
2. W bucie lub na uprzęży (dolna część ciała)

Redundancja zapewnia, że nawet przy uszkodzeniu jednego, drugi zadziała.

---

# 7. URZĄDZENIE 6: Detektor RECCO

## 7.1 Opis funkcjonalny

Aktywne urządzenie poszukiwawcze emitujące sygnał radarowy i wykrywające echo z reflektorów RECCO.

## 7.2 Warianty

### 7.2.1 Detektor ręczny (R9)

| Parametr | Wartość |
|----------|---------|
| Model | RECCO R9 |
| Zasięg | 80m (open), 20m (buried) |
| Waga | ~800g |
| Bateria | Li-Ion, ~5h pracy |
| Wskaźnik | Audio (ton) + LED |
| Cena | ~$5000-8000 (darmowy dla służb ratowniczych po szkoleniu) |

### 7.2.2 Detektor helikopterowy (SAR)

| Parametr | Wartość |
|----------|---------|
| Model | RECCO SAR Helicopter Detector |
| Zasięg | 100m radius z 100m wysokości |
| Prędkość skanowania | 100 km/h |
| Montaż | Podwieszenie pod helikopterem |
| Cena | Dostępny dla służb ratowniczych |

## 7.3 Procedura użycia

1. **Alarm „Firefighter Down"** – uruchomienie procedury RIT
2. **Pobranie detektora** z pojazdu
3. **Przeszukiwanie metodyczne** – zataczanie spirali od ostatniej znanej pozycji
4. **Interpretacja sygnału** – głośność i ton wskazują kierunek
5. **Triangulacja** – potwierdzenie z kilku pozycji
6. **Lokalizacja** – zbliżenie do źródła sygnału

---

# 8. Podsumowanie kosztów

## 8.1 Koszt pojedynczego zestawu zastępu (6 strażaków)

| Urządzenie | Ilość | Cena/szt | Suma |
|------------|-------|----------|------|
| Tag Nieśmiertelnik (z czujnikami środ.) | 6 | 950 PLN | 5 700 PLN |
| Beacon UWB | 8 | 350 PLN | 2 800 PLN |
| Bramka NIB | 1 | 4 500 PLN | 4 500 PLN |
| Pasek HR (Polar H10) | 6 | 360 PLN | 2 160 PLN |
| Reflektor RECCO (×2) | 12 | 120 PLN | 1 440 PLN |
| **RAZEM SPRZĘT** | | | **16 600 PLN** |

## 8.2 Koszty dodatkowe (jednorazowe)

| Pozycja | Koszt |
|---------|-------|
| Detektor RECCO R9 | 0 PLN (darmowy dla służb) |
| Serwer centralny (chmura) | 500 PLN/mies |
| Szkolenie (2 dni) | 5 000 PLN |
| Integracja z CAD | 20 000 PLN |

## 8.3 Koszt pilota (1 komenda miejska, 3 zastępy)

| Pozycja | Koszt |
|---------|-------|
| Sprzęt (3 × zestaw) | 49 800 PLN |
| Oprogramowanie + integracja | 25 000 PLN |
| Szkolenia | 15 000 PLN |
| **RAZEM PILOT** | **89 800 PLN** |

## 8.4 Porównanie z konkurencją

| System | Koszt/strażaka | Funkcje |
|--------|----------------|---------|
| **Nasz (Nieśmiertelnik PSP)** | ~2 800 PLN | Pełny RTLS + vitals + środowisko + RECCO |
| Blackline G7 | ~4 000 PLN + abo | GPS + gazy + basic indoor |
| Dräger SCBA telemetry | >10 000 PLN | Tylko SCBA, brak lokalizacji |
| NEON Personnel Tracker | ~8 000 PLN | IMU only, brak UWB |

> **Przewaga Nieśmiertelnika:** Pełna funkcjonalność (UWB+GNSS+IMU+czujniki środowiskowe+vitals+RECCO) w cenie konkurencji oferującej tylko GPS lub tylko czujniki gazów.

---

# 9. Matryca komunikacji

## 9.1 Protokoły i interfejsy

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         MATRYCA KOMUNIKACJI                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  TAG ◄──── UWB TWR (6-8 GHz) ────► BEACON                              │
│   │                                                                     │
│   ├──── BLE 5.0 LE (2.4 GHz) ────► PASEK HR                            │
│   │                                                                     │
│   ├──── LoRaWAN (868 MHz) ────────► BRAMKA NIB                         │
│   │                                                                     │
│   └──── LTE-M/NB-IoT (B3/B8/B20) ─► CHMURA PSP (fallback)              │
│                                                                         │
│  BRAMKA NIB ◄── LTE/5G ──► CHMURA PSP                                  │
│       │                                                                 │
│       ├── WiFi AP ──► TABLET DOWÓDCY                                   │
│       │                                                                 │
│       └── Ethernet ──► SIEĆ POJAZDU (opcja)                            │
│                                                                         │
│  REFLEKTOR RECCO ◄── Radar 1.6/3.2 GHz ──► DETEKTOR RECCO              │
│  (pasywny)                                   (aktywny)                  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## 9.2 Format pakietów danych

### Pakiet LoRaWAN (uplink, 51 bajtów max)

```
Offset  Len  Field           Description
------  ---  -------------   ----------------------------------
0       4    timestamp       Unix timestamp (s)
4       2    tag_id          Identyfikator tagu
6       4    pos_x           Pozycja X (mm, int32)
10      4    pos_y           Pozycja Y (mm, int32)
14      2    pos_z           Pozycja Z (mm, int16)
16      1    floor           Numer kondygnacji (int8)
17      1    pos_quality     Jakość pozycji (0-100)
18      1    pos_source      Źródło (0=UWB, 1=IMU, 2=GPS)
19      2    heart_rate      Tętno (bpm × 10)
21      1    hr_quality      Jakość HR (0-100)
22      1    motion_state    Stan ruchu (enum)
23      1    battery_pct     Bateria (%)
24      2    battery_mv      Napięcie baterii (mV)
26      1    signal_rssi     RSSI do bramki (dBm + 128)
27      1    uwb_beacons     Liczba widzianych beaconów
28      1    flags           Flagi alarmowe (bitfield)
29      2    crc16           Suma kontrolna
```

### Flagi alarmowe (bitfield)

| Bit | Znaczenie |
|-----|-----------|
| 0 | MAN_DOWN (bezruch >30s) |
| 1 | SOS_PRESSED |
| 2 | LOW_BATTERY (<20%) |
| 3 | HIGH_HEART_RATE (>180 bpm) |
| 4 | LOW_HEART_RATE (<40 bpm) |
| 5 | FALL_DETECTED |
| 6 | CONNECTION_LOST (bramka) |
| 7 | Reserved |

---

# 10. Rekomendacje dla hackathonu

## 10.1 Co uczestnicy powinni zaprojektować

| Obszar | Zakres | Priorytet |
|--------|--------|-----------|
| **Aplikacja dowódcy** | Wizualizacja mapy 2D/3D, panel parametrów, alarmy | 🔴 MUSI |
| **Algorytm lokalizacji** | Fuzja UWB + IMU + baro (symulowane dane) | 🟡 DOBRZE |
| **Koncepcja HW tagu** | Schemat, BOM, uzasadnienie | 🔴 MUSI |
| **Koncepcja beaconów** | Rozmieszczenie, kalibracja | 🟡 DOBRZE |
| **Integracja RECCO** | Procedura użycia, UI detekcji | 🟢 BONUS |

## 10.2 Symulator – dostępne dane

**Symulator online:** https://niesmiertelnik.replit.app

Symulator dostarcza pełne dane dla wszystkich urządzeń z ekosystemu:

| Dane | Endpoint/Wiadomość | Częstotliwość |
|------|---------------------|---------------|
| Telemetria tagów | `tag_telemetry` (WS) | 1 Hz |
| Status beaconów | `beacons_status` (WS) | 5s |
| Status bramki NIB | `nib_status` (WS) | 10s |
| Dane pogodowe | `weather` (WS) | 30s |
| Alarmy | `alert` (WS) | Event-driven |
| SCBA (aparaty) | `GET /api/v1/scba` | On-demand |
| RECCO | `GET /api/v1/recco` | On-demand |

**Telemetria tagu zawiera:**
- Pozycja (x, y, z, floor, confidence, source)
- Trilateration (raw, filtered, GDOP, HDOP, VDOP)
- UWB measurements (range, RSSI, LOS/NLOS)
- IMU (accel, gyro, mag, orientation)
- Barometer (pressure, altitude, estimated_floor)
- Vitals (heart_rate, motion_state, stress_level)
- SCBA (pressure, remaining_time, alarms)
- **Environment (co_ppm, o2_percent, lel_percent, temperature)**
- RECCO (detected, signal_strength, bearing)
- Device (battery, connection, firmware)

Pełna dokumentacja API: `02_SYMULATOR_API_v2.md`

---

## 🔗 Powiązane dokumenty

| Dokument | Opis |
|----------|------|
| `README.md` | Przegląd pakietu dokumentacji |
| `01_KARTA_WYZWANIA_v2.md` | Oficjalna karta wyzwania |
| `02_SYMULATOR_API_v2.md` | Pełna dokumentacja API symulatora |
| `03_KONCEPCJA_HW_WYTYCZNE.md` | Wytyczne do dokumentacji hardware |
| `04_QUICK_START.md` | Szybki start dla uczestników |
| `05_TECHNOLOGIA_RECCO.md` | System backup lokalizacji RECCO |
| `FORMALNO_PRAWNE_HACKNATION.md` | Formalności i zgody HackNation |

---

*Dokument opracowany przez BIŁ KG PSP*

*Ekosystem Urządzeń v2.4 – Cyfrowy Nieśmiertelnik PSP*
*HackNation 2025 – Grudzień 2025*
