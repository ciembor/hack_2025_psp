# Cyfrowy Nieśmiertelnik PSP v2.4
## Kompletny pakiet wyzwania hackathonowego

> **„Ratują innych, ryzykując własne życie. Czas, by technologia pomogła im w tym zadaniu. Stwórz rozwiązanie, które zwiększy bezpieczeństwo strażaków – nawet tam, gdzie nie ma sieci ani sygnału GPS."**

**Pula nagród: 25 000 PLN**

**HackNation 2025** — 06–07.12.2025, Bydgoskie Centrum Targowo-Wystawiennicze (ul. Gdańska 187, Bydgoszcz).

**Symulator:** https://niesmiertelnik.replit.app

**Dokumentacja** https://niesmiertelnikcyfrowy-admin810.replit.app

**Strona Wydarzenia** https://hacknation.pl

Materiały formalne i zgody: `FORMALNO_PRAWNE_HACKNATION.md`

---

## Zawartość pakietu

```
Dokumentacja_HACK/
│
├── README.md                       # Ten plik
├── 01_KARTA_WYZWANIA_v2.md         # Oficjalna karta wyzwania GovTech
├── 02_SYMULATOR_API_v2.md          # Dokumentacja API symulatora
├── 03_KONCEPCJA_HW_WYTYCZNE.md     # Jak dokumentować hardware
├── 04_QUICK_START.md               # Przewodnik szybkiego startu
├── 05_TECHNOLOGIA_RECCO.md         # Dokumentacja systemu RECCO (przykładowa)
├── EKOSYSTEM_URZADZEN_PELNA_SPECYFIKACJA.md  # Szczegółowa dokumentacja urządzeń
└── FORMALNO_PRAWNE_HACKNATION.md   # Formalności i zgody HackNation
```

---

## Szybki start

### 1. Połącz się z symulatorem

```
Frontend:   https://niesmiertelnik.replit.app
WebSocket:  wss://niesmiertelnik.replit.app/ws
REST API:   https://niesmiertelnik.replit.app/api/v1/
```

### 2. Sprawdź API

```bash
# Status serwera
curl https://niesmiertelnik.replit.app/api/v1/health

# Lista strażaków
curl https://niesmiertelnik.replit.app/api/v1/firefighters

# Lista beaconów
curl https://niesmiertelnik.replit.app/api/v1/beacons
```

### 3. Przetestuj alarmy

```bash
# Man-down
curl -X POST https://niesmiertelnik.replit.app/api/v1/simulation/control \
  -H "Content-Type: application/json" \
  -d '{"action": "trigger_man_down", "params": {"firefighter_id": "FF-003"}}'

# SOS
curl -X POST https://niesmiertelnik.replit.app/api/v1/simulation/control \
  -H "Content-Type: application/json" \
  -d '{"action": "trigger_sos", "params": {"firefighter_id": "FF-002"}}'
```

---

## Formalności HackNation

- Podsumowanie formalno-prawne i wymagane formularze: `FORMALNO_PRAWNE_HACKNATION.md`
- Kluczowe pliki: regulaminy HackNation, wzór umowy przeniesienia praw autorskich, zgody na wizerunek
- Upewnij się, że zespół posiada podpisane zgody przed prezentacją

---

## Ekosystem urządzeń

Wyzwanie obejmuje **6 typów urządzeń**:

| # | Urządzenie | Opis | Dokumentacja |
|---|------------|------|--------------|
| 1 | **Tag Nieśmiertelnik** | Urządzenie noszone przez strażaka (UWB+IMU+LoRa+LTE+GNSS+BLE+Środowisko) | EKOSYSTEM_URZADZEN_PELNA_SPECYFIKACJA.md §2 |
| 2 | **Beacon UWB** | Kotwica pozycyjna rozstawiana w budynku | EKOSYSTEM_URZADZEN_PELNA_SPECYFIKACJA.md §3 |
| 3 | **Bramka NIB** | Koncentrator sieciowy w pojeździe | EKOSYSTEM_URZADZEN_PELNA_SPECYFIKACJA.md §4 |
| 4 | **Pasek HR** | Monitor tętna BLE | EKOSYSTEM_URZADZEN_PELNA_SPECYFIKACJA.md §5 |
| 5 | **Reflektor RECCO** | Pasywny element lokalizacyjny (przykładowa technologia) | 05_TECHNOLOGIA_RECCO.md |
| 6 | **Detektor RECCO** | Urządzenie poszukiwawcze (przykładowa technologia) | 05_TECHNOLOGIA_RECCO.md |

### Architektura

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│    TAG      │◄───►│   BEACON    │     │   BRAMKA    │
│ (strażak)   │ UWB │    UWB      │     │    NIB      │
│             │     │             │     │  (pojazd)   │
│ UWB+IMU+    │     └─────────────┘     │             │
│ LoRa+LTE+   │──────────LoRa──────────►│ LoRa+LTE+   │
│ GNSS+BLE    │                         │ WiFi+GPS    │
└──────┬──────┘                         └──────┬──────┘
       │ BLE                                   │ LTE/5G
       ▼                                       ▼
┌─────────────┐                         ┌─────────────┐
│  PASEK HR   │                         │   CHMURA    │
│   (BLE)     │                         │    PSP      │
└─────────────┘                         └─────────────┘

═══════════════ BACKUP PASYWNY ═══════════════

┌─────────────┐     ┌─────────────┐
│  REFLEKTOR  │◄───►│  DETEKTOR   │
│   RECCO     │radar│   RECCO     │
│ (w mundurze)│     │  (ręczny)   │
└─────────────┘     └─────────────┘
```

---

## API Symulatora v2.4

### WebSocket

**Połączenie:** `wss://niesmiertelnik.replit.app/ws`

**Wiadomości przychodzące:**

| Typ | Częstotliwość | Opis |
|-----|---------------|------|
| `welcome` | Jednorazowo | Powitanie, wersja symulatora |
| `building_config` | Jednorazowo | Konfiguracja budynku (piętra, strefy) |
| `beacons_config` | Jednorazowo | Lista beaconów UWB |
| `firefighters_list` | Jednorazowo | Lista strażaków |
| `tag_telemetry` | 1 Hz | Pełna telemetria strażaka |
| `beacons_status` | 5s | Status beaconów |
| `nib_status` | 10s | Status bramki NIB |
| `weather` | 30s | Dane pogodowe |
| `alert` | Event | Alarm (man-down, SOS, itp.) |

**Komendy:**

```javascript
// Wywołaj man-down
ws.send(JSON.stringify({ command: "trigger_man_down", firefighter_id: "FF-003" }));

// Wywołaj SOS
ws.send(JSON.stringify({ command: "trigger_sos", firefighter_id: "FF-002" }));

// Wyłącz beacon
ws.send(JSON.stringify({ command: "beacon_offline", beacon_id: "BCN-002" }));

// Reset symulacji
ws.send(JSON.stringify({ command: "reset" }));

// Pauza/wznowienie
ws.send(JSON.stringify({ command: "pause" }));

// Zmiana prędkości (0.1 - 10x)
ws.send(JSON.stringify({ command: "set_speed", speed: 2.0 }));
```

### REST API

| Endpoint | Metoda | Opis |
|----------|--------|------|
| `/api/v1/health` | GET | Status serwera i symulacji |
| `/api/v1/building` | GET | Konfiguracja budynku |
| `/api/v1/beacons` | GET | Lista beaconów |
| `/api/v1/beacons/:id` | GET | Szczegóły beacona |
| `/api/v1/firefighters` | GET | Lista strażaków |
| `/api/v1/firefighters/:id` | GET | Pełna telemetria strażaka |
| `/api/v1/firefighters/:id/history` | GET | Historia pozycji (max 300) |
| `/api/v1/nib` | GET | Status bramki NIB |
| `/api/v1/scba` | GET | Status aparatów powietrznych |
| `/api/v1/recco` | GET | Status systemu RECCO |
| `/api/v1/weather` | GET | Dane pogodowe |
| `/api/v1/alerts` | GET | Lista alarmów (?active=true) |
| `/api/v1/simulation/control` | POST | Sterowanie symulacją |
| `/api/v1/recording/status` | GET | Status nagrywania |
| `/api/v1/incidents` | GET | Lista nagranych incydentów |
| `/api/v1/incidents/:id/replay` | GET | Odtwarzanie incydentu |

Pełna dokumentacja API: `02_SYMULATOR_API_v2.md`

---

## Wymagania hackathonu

### MUSI MIEĆ (MVP) – 60 punktów

- [ ] Wizualizacja mapy 2D budynku z pozycjami strażaków (15 pkt)
- [ ] Wskaźnik kondygnacji dla każdego strażaka (5 pkt)
- [ ] Panel parametrów: tętno, bateria, stan ruchu (10 pkt)
- [ ] Alarm MAN-DOWN po 30s bezruchu (10 pkt)
- [ ] Status beaconów na mapie (5 pkt)
- [ ] Dokumentacja HW tagu nieśmiertelnika (10 pkt)
- [ ] Dokumentacja HW beacona UWB (5 pkt)

### DOBRZE BY MIAŁ – 25 punktów

- [ ] Algorytm fuzji danych (EKF/UKF) (8 pkt)
- [ ] Wizualizacja 3D (Three.js) (7 pkt)
- [ ] Historia trajektorii (5 pkt)
- [ ] Dokumentacja bramki NIB (5 pkt)

### BONUS – 15 punktów

- [ ] Procedura RECCO – UI dla zespołu RIT (5 pkt)
- [ ] Symulacja czarnej skrzynki (5 pkt)
- [ ] Integracja z mapami OSM/BIM (3 pkt)
- [ ] Voice alerts (2 pkt)

---

## Szacowany poziom trudności

| Zadanie | Trudność | Czas |
|---------|----------|------|
| Połączenie z API | * | 1h |
| Mapa 2D z markerami | ** | 3-4h |
| Panel parametrów | ** | 2-3h |
| Status beaconów | ** | 2h |
| Alarm man-down | ** | 2h |
| Dokumentacja HW | *** | 4-6h |
| Algorytm fuzji (EKF) | **** | 6-10h |
| Wizualizacja 3D | **** | 8-12h |

**MVP:** ~12-16 godzin dla zespołu 3-4 osób

---

## Dane z symulacji

### Strażacy (6 osób)
| ID | Imię | Stopień | Rola | Zespół |
|----|------|---------|------|--------|
| FF-001 | Jan Kowalski | asp. sztab. | Dowódca roty | Rota 1 |
| FF-002 | Piotr Nowak | ogn. | Przodownik | Rota 1 |
| FF-003 | Anna Wiśniewska | st. ogn. | Ratownik | Rota 1 |
| FF-004 | Tomasz Zieliński | mł. ogn. | Ratownik | Rota 1 |
| FF-005 | Marek Kamiński | sekc. | Kierowca-operator | Rota 1 |
| FF-006 | Katarzyna Dąbrowska | asp. | Dowódca sekcji RIT | RIT |

### Budynek szkoleniowy
- Wymiary: 40m × 25m × 12m
- Piętra: -1 (Piwnica), 0 (Parter), 1, 2
- GPS: 52.2297°N, 21.0122°E (Warszawa)
- Beaconów: 15 szt.
- Strefy niebezpieczne: Kotłownia (piwnica), Magazyn chemiczny (parter)

---

## Nowe funkcje w v2.4

- **Rozszerzona telemetria** - GPS, trilateration, drift, environment sensors
- **System SCBA** - pełna symulacja aparatu powietrznego
- **Czujniki środowiskowe** - CO, CO2, O2, LEL, temperatura
- **Stacja pogodowa** - dane z pojazdu
- **System nagrywania** - zapis i odtwarzanie incydentów
- **Rozszerzone beacony** - wykrywanie tagów, prędkość, kierunek
- **RECCO** - pełna symulacja systemu backup

---

## Kontakt

- **Strona wydarzenia:** https://hacknation.pl/
- **Discord:** https://discord.com/invite/Kn7mhgVqHV
- **Mentor wyzwania:** Michał Kłosiński - KG PSP

---

## Powiązane dokumenty

| Dokument | Opis |
|----------|------|
| `01_KARTA_WYZWANIA_v2.md` | Oficjalna karta wyzwania GovTech |
| `02_SYMULATOR_API_v2.md` | Pełna dokumentacja API symulatora |
| `03_KONCEPCJA_HW_WYTYCZNE.md` | Wytyczne do dokumentacji hardware |
| `04_QUICK_START.md` | Szybki start dla uczestników |
| `05_TECHNOLOGIA_RECCO.md` | System backup lokalizacji RECCO (przykładowa technologia) |
| `EKOSYSTEM_URZADZEN_PELNA_SPECYFIKACJA.md` | Szczegółowa specyfikacja urządzeń |
| `FORMALNO_PRAWNE_HACKNATION.md` | Formalności i zgody HackNation |

---

## Licencja

Dokumentacja i kod udostępnione na potrzeby hackathonu HackNation 2025.
Prawa autorskie: Komenda Główna Państwowej Straży Pożarnej, Biuro Informatyki i Łączności.

---

*Wersja 2.4 – Pełny ekosystem urządzeń z symulatorem zintegrowanym*
*HackNation 2025 – Grudzień 2025*
