// ---------------------------------------------
// Building
// ---------------------------------------------
export type Building = {
  id: string
  name: string
  address: string
  dimensions: {
    width_m: number
    depth_m: number
    height_m: number
  }
  floors: {
    number: number
    name: string
    height_m: number
    hazard_level: string
  }[]
  entry_points: {
    id: string
    name: string
    position: { x: number; y: number }
    floor: number
  }[]
  hazard_zones: {
    id: string
    name: string
    floor: number
    bounds: { x1: number; y1: number; x2: number; y2: number }
    type: string
  }[]
}

// ---------------------------------------------
// Firefighter
// ---------------------------------------------
export type Firefighter = {
  id: string
  name: string
  rank: string
  role: string
  team: string
  position?: {
    x: number
    y: number
    z: number
    floor: number
  }
  battery?: number
  heart_rate?: number
  motion_state?: string
}

// ---------------------------------------------
// Beacon
// ---------------------------------------------
export type Beacon = {
  id: string
  name: string
  position: { x: number; y: number; z: number }
  floor: number
  type: string
  status: string
  battery_percent: number
}

// ---------------------------------------------
// Telemetry Packet (tag_telemetry)
// ---------------------------------------------
export type TelemetryPacket = {
  type: "tag_telemetry"
  timestamp: string
  tag_id: string

  firefighter: {
    id: string
    name: string
    rank: string
    role: string
    team: string
  }

  position: {
    x: number
    y: number
    z: number
    floor: number
    confidence: number
  }

  vitals: {
    heart_rate_bpm: number
    motion_state: string
    stationary_duration_s: number
  }

  device: {
    battery_percent: number
    sos_button_pressed: boolean
  }
}

// ---------------------------------------------
// Alert
// ---------------------------------------------
export type Alert = {
  type: "alert"
  id: string
  alert_type: string
  severity: "warning" | "critical"
  timestamp: string

  firefighter: {
    id: string
    name: string
    role: string
    team: string
  }

  position: {
    x: number
    y: number
    z: number
    floor: number
  }

  resolved: boolean
  acknowledged: boolean

  details?: any
}
