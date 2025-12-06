import fs from "fs";
import path from "path";

const DATA_ROOT = path.join(__dirname, "data");
const CACHE_DIR = path.join(DATA_ROOT, "cache");
const INCIDENTS_DIR = path.join(DATA_ROOT, "incidents");

// ensure directory exists
function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

ensureDir(DATA_ROOT);
ensureDir(CACHE_DIR);
ensureDir(INCIDENTS_DIR);

/*
  Generic JSON read/write helpers
*/
function loadJSON<T>(p: string, fallback: T): T {
  try {
    if (!fs.existsSync(p)) return fallback;
    const raw = fs.readFileSync(p, "utf8");
    return JSON.parse(raw) as T;
  } catch (e) {
    console.error("JSON LOAD ERROR:", p, e);
    return fallback;
  }
}

function saveJSON(p: string, data: any) {
  try {
    fs.writeFileSync(p, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error("JSON SAVE ERROR:", p, e);
  }
}

/*
  CACHE STRUCTURE
*/
export interface FirefighterCacheEntry {
  id: string;
  name: string;
  team: string;
  last_seen: string;
  position: { x: number; y: number; floor: number | null } | null;
  heart_rate: number | null;
  battery: number | null;
  motion_state: string | null;
  alerts: string[];
}

export interface AlertCacheEntry {
  id: string;
  firefighter_id: string;
  alert_type: string;
  severity: string;
  timestamp: string;
  resolved: boolean;
}

export interface BeaconCacheEntry {
  id: string;
  name: string;
  floor: number | null;
  position: { x: number; y: number; z?: number };
  status?: string;
  battery_percent?: number;
}

/*
  Load or initialize caches
*/
const firefightersCachePath = path.join(CACHE_DIR, "firefighters.json");
const alertsCachePath = path.join(CACHE_DIR, "alerts.json");
const beaconsCachePath = path.join(CACHE_DIR, "beacons.json");

export const db = {
  cache: {
    firefighters: loadJSON<Record<string, FirefighterCacheEntry>>(
      firefightersCachePath,
      {}
    ),

    alerts: loadJSON<Record<string, AlertCacheEntry>>(
      alertsCachePath,
      {}
    ),

    beacons: loadJSON<Record<string, BeaconCacheEntry>>(
      beaconsCachePath,
      {}
    )
  },

  saveCache() {
    saveJSON(firefightersCachePath, db.cache.firefighters);
    saveJSON(alertsCachePath, db.cache.alerts);
    saveJSON(beaconsCachePath, db.cache.beacons);
  },

  /*
    INCIDENT STORAGE
  */
  incidents: {
    list(): string[] {
      return fs
        .readdirSync(INCIDENTS_DIR)
        .filter((f) => f.endsWith(".json"))
        .map((f) => f.replace(".json", ""));
    },

    load(id: string): any | null {
      const p = path.join(INCIDENTS_DIR, `${id}.json`);
      if (!fs.existsSync(p)) return null;
      return loadJSON(p, {});
    },

    save(id: string, data: any) {
      const p = path.join(INCIDENTS_DIR, `${id}.json`);
      saveJSON(p, data);
    },

    create(name: string) {
      const id = "INC-" + Date.now();
      const incident = {
        id,
        name,
        start_timestamp: new Date().toISOString(),
        end_timestamp: null,
        events: []
      };
      db.incidents.save(id, incident);
      return id;
    },

    appendEvent(id: string, ev: any) {
      const incident = db.incidents.load(id);
      if (!incident) return;
      incident.events.push(ev);
      db.incidents.save(id, incident);
    },

    close(id: string, reason = "completed") {
      const incident = db.incidents.load(id);
      if (!incident) return;
      incident.end_timestamp = new Date().toISOString();
      incident.reason = reason;
      db.incidents.save(id, incident);
    }
  }
};
