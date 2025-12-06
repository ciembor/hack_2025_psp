import { useEffect, useState } from "react";

export function useSimulator() {
  const [firefighters, setFirefighters] = useState([]);
  const [beacons, setBeacons] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const ws = new WebSocket("wss://niesmiertelnik.replit.app/ws");

    ws.onmessage = (e) => {
      const msg = JSON.parse(e.data);

      if (msg.type === "firefighters_list") {
        setFirefighters(msg.firefighters);
      }

      if (msg.type === "tag_telemetry") {
        setFirefighters((prev) =>
          prev.map((ff) =>
            ff.id === msg.firefighter.id
              ? {
                  ...ff,
                  ...msg,
                  position: msg.position,
                  vitals: msg.vitals,
                  device: msg.device
                }
              : ff
          )
        );
      }

      if (msg.type === "beacons_status") {
        setBeacons(msg.beacons);
      }

      if (msg.type === "alert") {
        setAlerts((prev) => [...prev, msg]);
      }
    };

    return () => ws.close();
  }, []);

  return { firefighters, beacons, alerts };
}
