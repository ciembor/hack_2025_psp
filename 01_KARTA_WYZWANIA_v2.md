# 🔥 WYZWANIE: Cyfrowy Nieśmiertelnik PSP v2.4
## Hackathon GovTech 2025 – Pełna Specyfikacja

---

## 📋 METADANE WYZWANIA

| Parametr | Wartość |
|----------|---------|
| **Instytucja** | Komenda Główna Państwowej Straży Pożarnej |
| **Biuro** | Biuro Informatyki i Łączności (BIŁ) |
| **Kategoria** | Bezpieczeństwo ratowników / IoT / RTLS |
| **Wydarzenie** | HackNation 2025, 06–07.12.2025, Bydgoskie Centrum Targowo-Wystawiennicze (ul. Gdańska 187, Bydgoszcz) |
| **Poziom trudności** | ⭐⭐⭐⭐ (zaawansowany) |
| **Pula nagród** | 30 000 PLN |
| **Czas trwania** | 24 godziny |
| **Formalności** | Regulaminy, zgody na wizerunek, umowa przeniesienia praw — zob. `FORMALNO_PRAWNE_HACKNATION.md` |

### Uwaga formalna HackNation
- Wyzwanie jest częścią wydarzenia HackNation 2025; obowiązują regulaminy opisane w `FORMALNO_PRAWNE_HACKNATION.md`.
- Projekty nagrodzone wymagają podpisania umowy przeniesienia praw autorskich oraz przekazania kodu/dokumentacji na platformę konkursową.
- Zespół powinien mieć zebrane zgody na publikację wizerunku przed prezentacją finałową.

---

## 🎯 GENEZA PROBLEMU

### Sytuacja krytyczna

Podczas akcji ratowniczo-gaśniczych w zadymionych, ciemnych budynkach **dowódca traci orientację gdzie są jego ludzie**. Strażak może:
- Zgubić się w labiryncie pomieszczeń
- Ulec wypadkowi (zawalenie, upadek przez strop)
- Stracić przytomność (wyczerpanie tlenu, zatrucie)
- Zostać odcięty przez ogień

**Obecne metody lokalizacji:**
- 📻 Radio głosowe – wymaga świadomości strażaka
- 🔊 PASS (Personal Alert Safety System) – alarm dźwiękowy po 30s bezruchu, ale nie wskazuje GDZIE
- 👀 Lina asekuracyjna – ogranicza mobilność
- 🌡️ Kamera termowizyjna – wymaga linii wzroku

**BRAK SYSTEMU KTÓRY:**
- Pokazuje pozycję strażaka w czasie rzeczywistym na mapie budynku
- Działa w zadymieniu, ciemności, pod ziemią
- Automatycznie wykrywa bezruch/upadek
- Działa nawet gdy strażak jest nieprzytomny (backup pasywny)

---

## 🏗️ EKOSYSTEM URZĄDZEŃ DO ZAPROJEKTOWANIA

Wyzwanie obejmuje **6 typów urządzeń** tworzących kompletny system:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    EKOSYSTEM CYFROWY NIEŚMIERTELNIK                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   ┌─────────────┐        ┌─────────────┐        ┌─────────────┐        │
│   │  URZĄDZENIE │        │  URZĄDZENIE │        │  URZĄDZENIE │        │
│   │     1       │        │     2       │        │     3       │        │
│   │             │        │             │        │             │        │
│   │    TAG      │◄─UWB──►│   BEACON    │        │   BRAMKA    │        │
│   │NIEŚMIERTEL- │        │    UWB      │        │    NIB      │        │
│   │    NIK      │        │             │        │             │        │
│   │             │──LoRa─────────────────────────►             │        │
│   │             │──LTE────────────────────────────────►CHMURA │        │
│   │             │◄─BLE──►┌─────────────┐        │             │        │
│   └─────────────┘        │  URZĄDZENIE │        └─────────────┘        │
│                          │     4       │                                │
│                          │  PASEK HR   │                                │
│                          │    (BLE)    │                                │
│                          └─────────────┘                                │
│                                                                         │
│   ════════════════ SYSTEM BACKUP (PASYWNY) ════════════════            │
│                                                                         │
│   ┌─────────────┐        ┌─────────────┐                               │
│   │  URZĄDZENIE │◄─radar─┤  URZĄDZENIE │                               │
│   │     5       │ 1.6GHz │     6       │                               │
│   │  REFLEKTOR  │───────►│  DETEKTOR   │                               │
│   │   RECCO     │ 3.2GHz │   RECCO     │                               │
│   │  (pasywny)  │        │  (aktywny)  │                               │
│   └─────────────┘        └─────────────┘                               │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Tabela urządzeń

| # | Urządzenie | Typ | Kluczowa technologia | Co projektować |
|---|------------|-----|---------------------|----------------|
| **1** | Tag Nieśmiertelnik | Aktywny, noszony | UWB + LoRa + LTE-M + IMU + GNSS | Pełny schemat HW, BOM |
| **2** | Beacon UWB | Aktywny, rozstawiany | UWB (kotwica) | Schemat, rozmieszczenie |
| **3** | Bramka NIB | Aktywny, w pojeździe | LoRaWAN + LTE/5G | Architektura, software |
| **4** | Pasek HR | Aktywny, noszony | BLE HRS | Integracja lub wybór COTS |
| **5** | Reflektor RECCO | Pasywny, w mundurze | Dioda harmoniczna | Lokalizacja w mundurze |
| **6** | Detektor RECCO | Aktywny, przenośny | Radar 1.6/3.2 GHz | Procedura użycia |

---

## 🎯 CEL WYZWANIA

Zaprojektuj **kompletny system** składający się z:

### A. APLIKACJA DOWÓDCY (oprogramowanie)
Wizualizacja w czasie rzeczywistym:
- Mapa 2D/3D budynku z pozycjami strażaków
- Panel parametrów życiowych (tętno, ruch, bateria)
- System alarmów (man-down, SOS, niska bateria)
- Status beaconów (rozmieszczenie, sygnał)
- Historia trajektorii (czarna skrzynka)

### B. ALGORYTM LOKALIZACJI (software)
Fuzja danych z wielu źródeł:
- UWB ranging (odległości do beaconów)
- IMU dead reckoning (przyspieszenia, obroty)
- Barometr (wysokość → piętro)
- GNSS (pozycja outdoor)

### C. KONCEPCJA HARDWARE (dokumentacja)
Dla każdego z 6 urządzeń:
- Schemat blokowy
- Lista komponentów (BOM) z cenami
- Uzasadnienie wyboru
- Analiza poboru energii
- Wymiary i obudowa

---

## 👥 ODBIORCY ROZWIĄZANIA

| Rola | Potrzeba | Interfejs |
|------|----------|-----------|
| **Dowódca akcji** | Widzi wszystkich strażaków na mapie | Tablet z aplikacją |
| **Dyżurny SK** | Monitoring zdalny, koordynacja | Desktop w centrum |
| **Strażak** | Urządzenie niewidoczne w użyciu | Tag na uprzęży |
| **RIT (Rapid Intervention Team)** | Szybka lokalizacja poszkodowanego | Detektor RECCO |
| **Analityk BHP** | Odtworzenie przebiegu akcji | Logi z czarnej skrzynki |

---

## ✅ WYMAGANIA FUNKCJONALNE

### 🔴 MUSI MIEĆ (MVP) – 60 punktów

| ID | Funkcjonalność | Punkty |
|----|----------------|--------|
| M1 | Wizualizacja mapy 2D budynku z pozycjami strażaków | 15 |
| M2 | Wskaźnik kondygnacji (piętro) dla każdego strażaka | 5 |
| M3 | Panel parametrów: tętno, bateria, stan ruchu | 10 |
| M4 | Alarm MAN-DOWN po 30s bezruchu | 10 |
| M5 | Status beaconów na mapie (aktywne/nieaktywne) | 5 |
| M6 | Dokumentacja HW tagu nieśmiertelnika (schemat + BOM) | 10 |
| M7 | Dokumentacja HW beacona UWB (schemat + BOM) | 5 |

### 🟡 DOBRZE BY MIAŁ – 25 punktów

| ID | Funkcjonalność | Punkty |
|----|----------------|--------|
| D1 | Algorytm fuzji danych (EKF/UKF) dla lokalizacji | 8 |
| D2 | Wizualizacja 3D budynku (Three.js) | 7 |
| D3 | Historia trajektorii (odtwarzanie ruchu) | 5 |
| D4 | Dokumentacja bramki NIB | 5 |

### 🟢 BONUS – 15 punktów

| ID | Funkcjonalność | Punkty |
|----|----------------|--------|
| B1 | Procedura RECCO – UI dla zespołu RIT | 5 |
| B2 | Symulacja czarnej skrzynki (zapis/odczyt) | 5 |
| B3 | Integracja z mapami OSM/BIM | 3 |
| B4 | Voice alerts / text-to-speech | 2 |

---

## 📡 DANE Z SYMULATORA

Symulator dostarcza **realistyczne dane** z całego ekosystemu urządzeń.

**Publiczny serwer:** `https://niesmiertelnik.replit.app`

### Telemetria z Tagów (WebSocket `wss://niesmiertelnik.replit.app/ws`, 1 Hz)

Pełna struktura pakietu telemetrycznego z tagu strażaka:

```json
{
  "type": "tag_telemetry",
  "timestamp": "2025-01-15T14:32:01.234Z",
  "sequence": 121,
  "tag_id": "TAG-001",

  "firefighter": {
    "id": "FF-001",
    "name": "Jan Kowalski",
    "rank": "asp. sztab.",
    "role": "Dowódca roty",
    "team": "Rota 1"
  },

  "position": {
    "x": 12.45, "y": 8.32, "z": 0.15,
    "floor": 0,
    "confidence": 0.92,
    "source": "uwb_fusion",
    "beacons_used": 4,
    "accuracy_m": 0.25,
    "trilateration": {
      "raw_position": { "x": 12.48, "y": 8.30, "z": 0.12 },
      "filtered_position": { "x": 12.45, "y": 8.32, "z": 0.15 },
      "residual_error_m": 0.18,
      "gdop": 1.8, "hdop": 1.2, "vdop": 1.4,
      "beacons_used": ["BCN-001", "BCN-002", "BCN-003", "BCN-004"],
      "algorithm": "nlse",
      "iterations": 8,
      "convergence": true
    },
    "gps": {
      "lat": 52.229774, "lon": 21.012374,
      "altitude_m": 110.15,
      "accuracy_m": 3.2,
      "satellites": 12,
      "fix": true
    }
  },

  "uwb_measurements": [
    {
      "beacon_id": "BCN-001",
      "beacon_name": "Wejście główne",
      "range_m": 5.23,
      "rssi_dbm": -58,
      "fp_power_dbm": -55,
      "rx_power_dbm": -60,
      "los": true,
      "nlos_probability": 0.12,
      "quality": "excellent"
    }
  ],

  "imu": {
    "accel": { "x": 0.12, "y": -0.08, "z": 9.78 },
    "gyro": { "x": 0.5, "y": -0.3, "z": 0.1 },
    "mag": { "x": 22.5, "y": -5.2, "z": 42.1 },
    "orientation": { "roll": 2.1, "pitch": -1.5, "yaw": 45.2 },
    "temperature_c": 28.5
  },

  "barometer": {
    "pressure_pa": 101125,
    "altitude_rel_m": 0.15,
    "temperature_c": 28.5,
    "trend": "stable",
    "reference_pressure_pa": 101325,
    "estimated_floor": 0,
    "floor_confidence_percent": 95,
    "vertical_speed_mps": 0.0
  },

  "vitals": {
    "heart_rate_bpm": 95,
    "heart_rate_variability_ms": 45,
    "heart_rate_confidence": 98,
    "hr_zone": "light",
    "hr_band_id": "HR-001",
    "hr_band_battery": 85,
    "skin_temperature_c": 34.2,
    "motion_state": "walking",
    "step_count": 1234,
    "calories_burned": 250,
    "stress_level": "moderate",
    "stationary_duration_s": 0
  },

  "scba": {
    "id": "SCBA-001",
    "manufacturer": "Dräger",
    "model": "PSS 5000",
    "cylinder_pressure_bar": 280,
    "max_pressure_bar": 300,
    "consumption_rate_lpm": 45,
    "remaining_time_min": 35,
    "alarms": {
      "low_pressure": false,
      "very_low_pressure": false,
      "motion": false
    },
    "battery_percent": 92,
    "connection_status": "connected"
  },

  "environment": {
    "co_ppm": 5,
    "co_alarm": false,
    "co2_ppm": 450,
    "co2_alarm": false,
    "o2_percent": 20.8,
    "o2_alarm": false,
    "lel_percent": 0,
    "lel_alarm": false,
    "temperature_c": 28,
    "temperature_alarm": false,
    "humidity_percent": 45,
    "sensor_status": "ok"
  },

  "recco": {
    "id": "RECCO-001",
    "type": "rescue",
    "location": "Hełm",
    "detected": false,
    "signal_strength": null,
    "estimated_distance_m": null
  },

  "black_box": {
    "recording": true,
    "storage_used_percent": 12,
    "records_count": 7200,
    "write_rate_hz": 1
  },

  "device": {
    "tag_id": "TAG-001",
    "firmware_version": "2.1.0",
    "hardware_version": "TAG-V3",
    "battery_percent": 78,
    "battery_voltage_mv": 3850,
    "battery_charging": false,
    "battery_temperature_c": 32,
    "connection_primary": "lora",
    "connection_backup": "ble",
    "lora_rssi_dbm": -82,
    "lora_snr_db": 8.5,
    "lte_rssi_dbm": -95,
    "lte_operator": "Play",
    "uptime_s": 7200,
    "sos_button_pressed": false
  }
}
```

### Status Beaconów (WebSocket, co 5s)

```json
{
  "type": "beacons_status",
  "timestamp": "2025-01-15T14:32:05.000Z",
  "beacons": [
    {
      "id": "BCN-001",
      "name": "Wejście główne",
      "position": { "x": 2, "y": 5, "z": 0 },
      "floor": 0,
      "type": "entry",
      "status": "active",
      "battery_percent": 95,
      "battery_voltage_mv": 3850,
      "temperature_c": 28,
      "signal_quality": "excellent",
      "tags_in_range": ["TAG-001", "TAG-002"],
      "detected_tags": [
        {
          "tag_id": "TAG-001",
          "firefighter_id": "FF-001",
          "firefighter_name": "Jan Kowalski",
          "range_m": 5.23,
          "rssi_dbm": -58,
          "signal_quality": "excellent",
          "los": true,
          "velocity_mps": 1.2,
          "direction_deg": 45
        }
      ],
      "uwb_tx_count": 12345,
      "uwb_rx_count": 12340,
      "gps": { "lat": 52.2297, "lon": 21.0122, "altitude_m": 110 }
    }
  ]
}
```

### Konfiguracja Budynku (jednorazowo po połączeniu)

```json
{
  "type": "building_config",
  "timestamp": "2025-01-15T14:30:00.000Z",
  "building": {
    "id": "BLD-TRAINING-01",
    "name": "Obiekt szkoleniowy PSP Warszawa",
    "address": "ul. Ćwiczebna 1, 00-001 Warszawa",
    "type": "industrial",
    "dimensions": { "width_m": 40, "depth_m": 25, "height_m": 12 },
    "gps_reference": {
      "origin": { "lat": 52.2297, "lon": 21.0122, "altitude_m": 110 },
      "scale_lat_m_per_deg": 111320,
      "scale_lon_m_per_deg": 71695
    },
    "floors": [
      { "number": -1, "name": "Piwnica", "height_m": -3.0, "hazard_level": "high" },
      { "number": 0, "name": "Parter", "height_m": 0, "hazard_level": "medium" },
      { "number": 1, "name": "1. piętro", "height_m": 3.2, "hazard_level": "low" },
      { "number": 2, "name": "2. piętro", "height_m": 6.4, "hazard_level": "low" }
    ],
    "entry_points": [
      { "id": "ENTRY-01", "name": "Wejście główne", "position": { "x": 0, "y": 5 }, "floor": 0 },
      { "id": "ENTRY-02", "name": "Wejście boczne", "position": { "x": 40, "y": 20 }, "floor": 0 }
    ],
    "hazard_zones": [
      { "id": "HAZ-01", "name": "Kotłownia", "floor": -1, "type": "fire_risk" },
      { "id": "HAZ-02", "name": "Magazyn chemiczny", "floor": 0, "type": "chemical" }
    ],
    "stairwells": [
      { "id": "STAIR-01", "name": "Klatka główna", "position": { "x": 35, "y": 20 }, "floors": [-1, 0, 1, 2] }
    ]
  }
}
```

### Zdarzenia / Alarmy

Symulator generuje 12 typów alertów:

```json
{
  "id": "ALERT-1705329322000",
  "type": "alert",
  "timestamp": "2025-01-15T14:35:22Z",
  "alert_type": "man_down",
  "severity": "critical",
  "tag_id": "TAG-003",
  "firefighter": {
    "id": "FF-003",
    "name": "Anna Wiśniewska",
    "role": "Ratownik",
    "team": "Rota 1"
  },
  "position": { "x": 22.1, "y": 15.8, "z": 0.2, "floor": 0 },
  "details": {
    "stationary_duration_s": 35,
    "last_motion_state": "walking",
    "last_heart_rate": 142
  },
  "resolved": false,
  "acknowledged": false
}
```

**Typy alertów:**
| Typ | Severity | Opis |
|-----|----------|------|
| `man_down` | critical | Bezruch >30s |
| `sos_pressed` | critical | Przycisk SOS |
| `high_heart_rate` | warning | Tętno >180 bpm |
| `low_battery` | warning | Bateria <20% |
| `scba_low_pressure` | warning | Niskie ciśnienie SCBA |
| `scba_critical` | critical | Krytyczne ciśnienie SCBA |
| `beacon_offline` | warning | Beacon nie odpowiada |
| `tag_offline` | critical | Tag strażaka offline |
| `high_co` | critical | Wysokie CO |
| `low_oxygen` | critical | Niski O2 |
| `explosive_gas` | critical | Gaz wybuchowy (LEL) |
| `high_temperature` | warning | Wysoka temperatura |

### Status Bramki NIB (WebSocket, co 10s)

Zawiera: status połączeń (LTE, LoRa, WiFi, GPS), system info (CPU, RAM, temperatura), statystyki pakietów, dane pogodowe ze stacji oraz status detektora RECCO.

---

## 🌐 REST API

**Bazowy URL:** `https://niesmiertelnik.replit.app/api/v1`

| Endpoint | Metoda | Opis |
|----------|--------|------|
| `/health` | GET | Status serwera i symulacji |
| `/building` | GET | Konfiguracja budynku |
| `/firefighters` | GET | Lista strażaków z telemetrią |
| `/firefighters/:id` | GET | Pełna telemetria strażaka |
| `/firefighters/:id/history` | GET | Historia pozycji (max 300 rekordów) |
| `/beacons` | GET | Lista beaconów |
| `/beacons/:id` | GET | Szczegóły beacona |
| `/alerts` | GET | Lista alarmów (?active=true) |
| `/nib` | GET | Status bramki NIB |
| `/scba` | GET | Status aparatów powietrznych |
| `/recco` | GET | Status systemu RECCO |
| `/weather` | GET | Dane pogodowe |
| `/simulation/control` | POST | Sterowanie symulacją |
| `/recording/status` | GET | Status nagrywania |
| `/incidents` | GET | Lista nagranych incydentów |
| `/incidents/:id/replay` | GET | Odtwarzanie incydentu |

### Sterowanie symulacją (POST /simulation/control)

```javascript
// Wywołaj man-down
{ "action": "trigger_man_down", "params": { "firefighter_id": "FF-003" } }

// Wywołaj SOS
{ "action": "trigger_sos", "params": { "firefighter_id": "FF-002" } }

// Wyłącz beacon
{ "action": "beacon_offline", "params": { "beacon_id": "BCN-002" } }

// Uzupełnij SCBA
{ "action": "scba_refill", "params": { "firefighter_id": "FF-001" } }

// Potwierdź alert
{ "action": "acknowledge_alert", "params": { "alert_id": "...", "acknowledged_by": "Dowódca" } }

// Wywołaj zagrożenie środowiskowe (high_co, low_oxygen, explosive_gas, high_temperature)
{ "action": "trigger_environment_hazard", "params": { "firefighter_id": "FF-001", "hazard_type": "high_co" } }

// Reset symulacji
{ "action": "reset" }

// Pauza / Wznowienie
{ "action": "pause" }
{ "action": "resume" }

// Zmiana prędkości (0.1 - 10x)
{ "action": "set_speed", "params": { "speed": 2.0 } }

// Rozpocznij nagrywanie
{ "action": "start_recording", "params": { "name": "Ćwiczenia 2025" } }

// Zatrzymaj nagrywanie
{ "action": "stop_recording", "params": { "reason": "Zakończenie" } }
```

### Komendy WebSocket

Alternatywnie możesz wysyłać komendy przez WebSocket:

```javascript
ws.send(JSON.stringify({ command: "trigger_man_down", firefighter_id: "FF-003" }));
ws.send(JSON.stringify({ command: "trigger_sos", firefighter_id: "FF-002" }));
ws.send(JSON.stringify({ command: "beacon_offline", beacon_id: "BCN-002" }));
ws.send(JSON.stringify({ command: "scba_refill", firefighter_id: "FF-001" }));
ws.send(JSON.stringify({ command: "reset" }));
ws.send(JSON.stringify({ command: "pause" }));
ws.send(JSON.stringify({ command: "set_speed", speed: 2.0 }));
```

---

## 🔧 TECHNOLOGIE REFERENCYJNE

### Hardware (komponenty sugerowane)

| Kategoria | Komponent | Model | Cena | Uzasadnienie |
|-----------|-----------|-------|------|--------------|
| MCU | Mikrokontroler | nRF52840 | $7 | BLE 5.0, ultra-low power |
| UWB | Moduł UWB | DWM3000 | $18 | IEEE 802.15.4z, <10cm |
| GNSS | Odbiornik GPS | LC86L | $12 | Multi-constellation |
| IMU | Akcelerometr+Gyro | BMI270 | $4.50 | 6-axis, wearables |
| BARO | Barometr | BMP390 | $2.50 | ±0.5m dokładność |
| LoRa | Transceiver | SX1262 | $6 | 868 MHz, +22 dBm |
| LTE-M | Modem | SARA-R412M | $22 | Cat-M1/NB-IoT |
| FLASH | Pamięć | W25Q128 | $2 | 16 MB, czarna skrzynka |
| SECURE | Secure Element | ATECC608B | $1.50 | Crypto, key storage |

### Software (stack sugerowany)

| Warstwa | Technologia | Alternatywa |
|---------|-------------|-------------|
| Frontend | React + Leaflet.js | Vue + OpenLayers |
| 3D | Three.js | Babylon.js |
| Backend | Node.js / Python | Go / Rust |
| Realtime | WebSocket | MQTT over WS |
| Algorytmy | Python (NumPy, SciPy) | C++ |
| Embedded | Zephyr RTOS | FreeRTOS |

### Technologia RECCO

| Element | Specyfikacja |
|---------|--------------|
| Reflektor | Pasywna dioda harmoniczna |
| Częstotliwość TX | 1.6 GHz |
| Częstotliwość RX | 3.2 GHz (harmonic) |
| Zasięg (otwarta przestrzeń) | do 80m |
| Zasięg (gruz/beton) | 5-20m |
| Producent | RECCO AB (Szwecja) |
| Koszt reflektora | ~$25 (100 PLN) |
| Detektor | R9 (ręczny) lub SAR (helikopter) |

---

## 🏆 KRYTERIA OCENY

| Kategoria | Waga | Opis |
|-----------|------|------|
| **Funkcjonalność aplikacji** | 30% | Kompletność MVP, UX, responsywność |
| **Algorytm lokalizacji** | 20% | Dokładność, płynność, obsługa edge cases |
| **Koncepcja hardware** | 25% | Kompletność, realność, innowacyjność |
| **Jakość kodu i dokumentacji** | 15% | Czytelność, README, komentarze |
| **Prezentacja** | 10% | Klarowność, demo, odpowiedzi na pytania |

### Szczegółowa rubrika Hardware (25 punktów)

| Aspekt | Punkty | Kryteria |
|--------|--------|----------|
| Kompletność schematu | 8 | Wszystkie bloki, połączenia, anteny |
| BOM z cenami | 5 | Realne komponenty, źródła, suma |
| Uzasadnienie wyborów | 5 | Dlaczego te komponenty, trade-offs |
| Analiza energii | 4 | Pobór mocy, czas pracy |
| Wymiary i obudowa | 3 | Realność, IP rating |

---

## ⏰ HARMONOGRAM 24H

| Czas | Faza | Kamień milowy |
|------|------|---------------|
| 0:00 | START | Zapoznanie z wyzwaniem |
| 0-2h | Analiza | Zrozumienie problemu, plan pracy |
| 2-6h | Sprint 1 | Połączenie z API, podstawowa mapa |
| 6:00 | **CHECKPOINT 1** | Demo: mapa + pozycje aktualizują się |
| 6-12h | Sprint 2 | Panel parametrów, alarmy, beacony |
| 12:00 | **CHECKPOINT 2** | Demo: pełne MVP działa |
| 12-18h | Sprint 3 | Dokumentacja HW, algorytm fuzji |
| 18:00 | **CHECKPOINT 3** | Dokumentacja HW gotowa |
| 18-22h | Polish | Testy, UI, dokumentacja |
| 22:00 | **CODE FREEZE** | Ostatni commit |
| 22-23h | Przygotowanie | Prezentacja (max 10 slajdów) |
| 23:00 | **PREZENTACJE** | 10 min + 5 min Q&A |
| 24:00 | **WYNIKI** | Ogłoszenie zwycięzców |

---

## 🏅 NAGRODY

| Miejsce | Nagroda | Dodatkowe |
|---------|---------|-----------|
| 🥇 1. miejsce | **15 000 PLN** | Kontynuacja projektu z PSP |
| 🥈 2. miejsce | **10 000 PLN** | Referencje |
| 🥉 3. miejsce | **5 000 PLN** | Referencje |

**Nagroda specjalna:** Najlepsza koncepcja RECCO – zaproszenie na szkolenie z technologii RECCO

---

## 📚 ZASOBY

### Dokumentacja
- `02_SYMULATOR_API_v2.md` – pełna dokumentacja API symulatora
- `03_KONCEPCJA_HW_WYTYCZNE.md` – jak dokumentować hardware
- `04_QUICK_START.md` – przewodnik szybkiego startu
- `05_TECHNOLOGIA_RECCO.md` – dokumentacja systemu RECCO
- `EKOSYSTEM_URZADZEN_PELNA_SPECYFIKACJA.md` – pełna specyfikacja HW

### Symulator (publiczny serwer - bez instalacji!)
- **Frontend:** `https://niesmiertelnik.replit.app`
- **WebSocket:** `wss://niesmiertelnik.replit.app/ws`
- **REST API:** `https://niesmiertelnik.replit.app/api/v1/`

### Uruchomienie lokalne (opcjonalnie)
- **Uruchomienie:** `npm run dev` w głównym katalogu projektu
- **Frontend:** `http://localhost:5000`
- **WebSocket:** `ws://localhost:5000/ws`
- **REST API:** `http://localhost:5000/api/v1/`

### Aplikacja demonstracyjna
- Frontend React + TypeScript już działa na publicznym serwerze
- Mapa Leaflet z strażakami
- Panel z telemetrią
- Można ją rozbudować lub napisać własną od zera

### Strażacy w symulacji

Symulator symuluje **6 strażaków** z pełnym wyposażeniem:

| ID | Tag | Imię | Stopień | Rola | Zespół |
|----|-----|------|---------|------|--------|
| FF-001 | TAG-001 | Jan Kowalski | asp. sztab. | Dowódca roty | Rota 1 |
| FF-002 | TAG-002 | Piotr Nowak | ogn. | Przodownik | Rota 1 |
| FF-003 | TAG-003 | Anna Wiśniewska | st. ogn. | Ratownik | Rota 1 |
| FF-004 | TAG-004 | Tomasz Zieliński | mł. ogn. | Ratownik | Rota 1 |
| FF-005 | TAG-005 | Marek Kamiński | sekc. | Kierowca-operator | Rota 1 |
| FF-006 | TAG-006 | Katarzyna Dąbrowska | asp. | Dowódca sekcji RIT | RIT |

Każdy strażak ma przypisany: Tag Nieśmiertelnik, Pasek HR, Aparat SCBA, Reflektor RECCO.

### Budynek szkoleniowy

```
Obiekt: Obiekt szkoleniowy PSP Warszawa
Wymiary: 40m × 25m × 12m
GPS: 52.2297°N, 21.0122°E

Piętra:
  -1: Piwnica (kotłownia - strefa niebezpieczna)
   0: Parter (magazyn chemiczny)
   1: 1. piętro
   2: 2. piętro

Wejścia: Główne, Boczne, Techniczne
Klatka schodowa: (x=35, y=20) - wszystkie piętra
Beaconów UWB: 15 szt.
```

### Zewnętrzne
- [Qorvo DWM3000 Datasheet](https://www.qorvo.com/products/p/DWM3000)
- [Nordic nRF52840 Product Brief](https://www.nordicsemi.com/Products/nRF52840)
- [RECCO Technology](https://recco.com/technology/)
- [LoRaWAN Specification](https://lora-alliance.org/resource_hub/lorawan-specification-v1-0-4/)

---

## ❓ FAQ

**Q: Czy muszę zaprojektować wszystkie 6 urządzeń?**
A: Minimum to tag nieśmiertelnika (obowiązkowo) + beacon (obowiązkowo). Pozostałe urządzenia dają dodatkowe punkty.

**Q: Czy muszę budować fizyczny prototyp?**
A: NIE! Hackathon skupia się na oprogramowaniu i koncepcji. Hardware to dokumentacja (schematy, BOM).

**Q: Skąd wziąć dane o położeniu strażaków?**
A: Symulator na `https://niesmiertelnik.replit.app` generuje realistyczne dane. Wystarczy połączyć się przez WebSocket (`wss://niesmiertelnik.replit.app/ws`).

**Q: Czy mogę użyć gotowych bibliotek?**
A: TAK! Leaflet.js, Three.js, Chart.js – wszystko dozwolone. Liczy się efekt końcowy.

**Q: Czy muszę pisać własną aplikację od zera?**
A: NIE! Możesz rozbudować istniejącą aplikację demonstracyjną (React + Leaflet) lub napisać własną. Obie opcje są dozwolone.

**Q: Jak przetestować alarmy?**
A: Użyj REST API: `POST /api/v1/simulation/control` z akcją `trigger_man_down` lub `trigger_sos`. Możesz też wysłać komendę przez WebSocket.

**Q: Jak działa RECCO?**
A: Reflektor to pasywna dioda. Detektor wysyła 1.6 GHz, reflektor odbija 3.2 GHz. Zero baterii, zero obsługi. To backup gdy systemy aktywne zawiodą.

**Q: Co oznaczają pola w telemetrii?**
A: Szczegółowa dokumentacja wszystkich pól znajduje się w `02_SYMULATOR_API_v2.md`.

---

## 📞 KONTAKT

- **Discord:** https://discord.com/invite/Kn7mhgVqHV

---

## 🔗 Powiązane dokumenty

| Dokument | Opis |
|----------|------|
| `README.md` | Przegląd pakietu dokumentacji |
| `02_SYMULATOR_API_v2.md` | Pełna dokumentacja API symulatora |
| `03_KONCEPCJA_HW_WYTYCZNE.md` | Wytyczne do dokumentacji hardware |
| `04_QUICK_START.md` | Szybki start dla uczestników |
| `05_TECHNOLOGIA_RECCO.md` | System backup lokalizacji RECCO |
| `EKOSYSTEM_URZADZEN_PELNA_SPECYFIKACJA.md` | Szczegółowa specyfikacja urządzeń |
| `FORMALNO_PRAWNE_HACKNATION.md` | Formalności i zgody HackNation |

---

*Powodzenia! Wasz system może uratować życie strażaka.* 🚒

---

*Karta Wyzwania v2.4 – Cyfrowy Nieśmiertelnik PSP*
*HackNation 2025 – Grudzień 2025*
