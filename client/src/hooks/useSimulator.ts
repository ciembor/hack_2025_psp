import { useEffect, useState } from "react";

export function useSimulator() {
  const [firefighters, setFirefighters] = useState([]);
  const [beacons, setBeacons] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:5001/ws");

    ws.onopen = () => {
      console.log("WS FRONT CONNECTED");
    };
    ws.onerror = (err) => {
      console.error("WS ERROR", err);
    };
    ws.onclose = () => {
      console.log("WS CLOSED");
    };

    ws.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      console.log("WS MESSAGE:", msg);

      // -------------------------------------
      // FIREFIGHTERS LIST (rarely used)
      // -------------------------------------
      if (msg.type === "firefighters_list") {
        setFirefighters(msg.firefighters);
        return;
      }

      // -------------------------------------
      // TELEMETRY → add or update firefighter
      // -------------------------------------
      if (msg.type === "tag_telemetry") {
        setFirefighters((prev) => {
          const id = msg.firefighter.id;
          const idx = prev.findIndex((ff) => ff.id === id);

          const updated = {
            id,
            firefighter: msg.firefighter,
            position: msg.position,
            vitals: msg.vitals,
            device: msg.device
          };

          if (idx === -1) {
            // first time seeing this firefighter
            return [...prev, updated];
          }

          // update existing firefighter
          const copy = [...prev];
          copy[idx] = updated;
          return copy;
        });

        return;
      }

      // -------------------------------------
      // BEACONS
      // -------------------------------------
      if (msg.type === "beacons_status") {
        setBeacons(msg.beacons);
        return;
      }

      // -------------------------------------
      // ALERTS (including MAN-DOWN)
      // -------------------------------------
      if (msg.type === "alert") {
        setAlerts((prev) => [...prev, msg]);
        return;
      }
    };

    return () => ws.close();
  }, []);

  return { firefighters, beacons, alerts };
}
