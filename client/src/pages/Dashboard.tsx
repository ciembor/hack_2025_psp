import { useState } from "react";
import { useSimulator } from "../hooks/useSimulator";
import { useBuilding } from "../hooks/useBuilding";
import { MapView } from "../components/MapView";
import FirefightersList from "./FirefightersList";
import { AlertsPanel } from "../components/AlertsPanel";

export default function Dashboard() {
  const { firefighters, beacons, alerts } = useSimulator();
  const building = useBuilding();
  const [floor, setFloor] = useState(0);
  const [view, setView] = useState("map");

  if (!building) {
    return <div>Loading building...</div>;
  }

  // Dynamiczne piętra z API
  const floors = building.floors
    ?.slice()
    .sort((a, b) => a.number - b.number);

  return (
    <div className="flex flex-row h-screen w-screen overflow-hidden">
      <div className="flex flex-col flex-1 h-full">

        {/* Przyciski pięter */}
        <div className="p-2 flex gap-2 border-b bg-gray-100 shrink-0">
          {floors.map((fl) => (
            <button
              key={fl.number}
              onClick={() => setFloor(fl.number)}
              className={`px-3 py-1 border rounded ${
                floor === fl.number ? "bg-blue-300" : ""
              }`}
            >
              {fl.name}
            </button>
          ))}
        </div>

        {/* Przełączanie widoków */}
        <div className="p-2 flex gap-2 border-b bg-gray-200 shrink-0">
          <button
            onClick={() => setView("map")}
            className="px-3 py-1 border rounded"
          >
            Map
          </button>
          <button
            onClick={() => setView("firefighters")}
            className="px-3 py-1 border rounded"
          >
            Firefighters
          </button>
          <button
            onClick={() => setView("alerts")}
            className="px-3 py-1 border rounded"
          >
            Alerts
          </button>
        </div>

        {/* Główna sekcja */}
        <div className="flex-1 w-full h-full overflow-auto p-4">

          {view === "map" && (
            <div style={{ width: "600px", height: "600px" }}>
              <MapView
                building={building}
                firefighters={firefighters}
                beacons={beacons}
                floor={floor}
              />
            </div>
          )}

          {view === "firefighters" && (
            <FirefightersList firefighters={firefighters} />
          )}

          {view === "alerts" && (
            <AlertsPanel alerts={alerts} />
          )}
        </div>
      </div>
    </div>
  );
}
