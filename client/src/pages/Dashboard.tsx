import { useState } from "react";
import { useSimulator } from "../hooks/useSimulator";
import { useBuilding } from "../hooks/useBuilding";
import { MapView } from "../components/MapView";
import { AlertsPanel } from "../components/AlertsPanel";

export default function Dashboard() {
  const { firefighters, beacons, alerts } = useSimulator();
  const building = useBuilding();
  const [floor, setFloor] = useState(0);

  if (!building) {
    return <div>Loading building...</div>;
  }

  return (
    <div className="flex flex-row h-screen w-screen overflow-hidden">
      <div className="flex flex-col flex-1 h-full">
        <div className="p-2 flex gap-2 border-b bg-gray-100 shrink-0">
          {[-1, 0, 1, 2].map((f) => (
            <button
              key={f}
              onClick={() => setFloor(f)}
              className={`px-3 py-1 border rounded ${
                floor === f ? "bg-blue-300" : ""
              }`}
            >
              Floor {f}
            </button>
          ))}
        </div>

        <div style={{ height: "600px", width: "600px" }}>
          <MapView
            building={building}
            firefighters={firefighters}
            beacons={beacons}
            floor={floor}
          />
        </div>
      </div>

      <div className="w-80 border-l h-full bg-white overflow-y-auto shrink-0">
        <AlertsPanel alerts={alerts} />
      </div>
    </div>
  );
}
