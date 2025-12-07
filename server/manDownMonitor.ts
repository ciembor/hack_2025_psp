import type { TelemetryPacket, Alert } from "../shared/schema";

type State = {
  ts: number;
  stationary: boolean;
  alerted: boolean;
};

const movement: Record<string, State> = {};
const lastTelemetry: Record<string, TelemetryPacket> = {};

let broadcastFn: (data: any) => void = () => {};

export function initManDown(broadcast: (data: any) => void) {
  broadcastFn = broadcast;
}

export function processTelemetry(t: TelemetryPacket) {
  const id = t.firefighter.id;
  const now = Date.now();
  const isStationary = t.vitals.motion_state === "stationary";

  lastTelemetry[id] = t;

  if (!movement[id]) {
    movement[id] = { ts: now, stationary: isStationary, alerted: false };
  }

  const m = movement[id];

  if (isStationary) {
    if (!m.stationary) {
      m.stationary = true;
      m.ts = now;
      m.alerted = false; // new stationary period
    }
  } else {
    // moved → reset everything
    m.stationary = false;
    m.ts = now;
    m.alerted = false;
  }
}

export function checkManDown() {
  const now = Date.now();

  for (const id of Object.keys(movement)) {
    const m = movement[id];

    if (!m.stationary) continue;

    const elapsed = (now - m.ts) / 1000;
    if (elapsed < 30) continue;

    if (m.alerted) continue; // already sent

    const t = lastTelemetry[id];
    if (!t) continue;

    const alert: Alert = {
      type: "alert",
      id: `LOCAL-MAN-DOWN-${id}-${now}`,
      alert_type: "custom_man_down",
      severity: "critical",
      timestamp: new Date().toISOString(),

      firefighter: {
        id: id,
        name: t.firefighter.name,
        role: t.firefighter.role,
        team: t.firefighter.team
      },

      position: {
        x: t.position.x,
        y: t.position.y,
        z: t.position.z,
        floor: t.position.floor
      },

      resolved: false,
      acknowledged: false,
      details: { stationary_seconds: Math.floor(elapsed) }
    };

    console.log("MAN-DOWN:", alert.id);
    broadcastFn(alert);

    m.alerted = true; // prevent spam
  }
}
