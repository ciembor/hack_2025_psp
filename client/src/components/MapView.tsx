import L from "leaflet";
import { MapContainer, Rectangle, Marker, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// patch ikon Leaflet
import icon2x from "leaflet/dist/images/marker-icon-2x.png";
import icon from "leaflet/dist/images/marker-icon.png";
import shadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: icon2x,
  iconUrl: icon,
  shadowUrl: shadow
});

export function MapView({ building, firefighters, beacons, floor }) {
  if (!building) return null;

  const width = building.dimensions.width_m;   // 40
  const height = building.dimensions.depth_m;  // 25

  const bounds = [
    [0, 0],
    [height, width]
  ];

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <MapContainer
        crs={L.CRS.Simple}
        bounds={bounds}
        style={{ width: "100%", height: "100%", background: "#101828" }}
        zoom={0}
      >
        {/* budynek */}
        <Rectangle
          bounds={[
            [0, 0],
            [height, width]
          ]}
          pathOptions={{ color: "#4b5563", weight: 2 }}
        />

        {/* HAZARD ZONES */}
        {building.hazard_zones
          .filter((h) => h.floor === floor)
          .map((h) => (
            <Rectangle
              key={h.id}
              bounds={[
                [h.bounds.y1, h.bounds.x1],
                [h.bounds.y2, h.bounds.x2]
              ]}
              pathOptions={{ color: "red", weight: 2, fillOpacity: 0.2 }}
            />
          ))}

        {/* ENTRY POINTS */}
        {building.entry_points
          .filter((e) => e.floor === floor)
          .map((e) => (
            <Marker
              key={e.id}
              position={[e.position.y, e.position.x]}
            />
          ))}

        {/* STAIRWELLS */}
        {building.stairwells
          ?.filter((s) => s.floors.includes(floor))
          .map((s) => (
            <Circle
              key={s.id}
              center={[s.position.y, s.position.x]}
              radius={1.2}
              pathOptions={{ color: "blue" }}
            />
          ))}

        {/* BEACONS */}
        {beacons
          ?.filter((b) => b.floor === floor)
          .map((b) => (
            <Circle
              key={b.id}
              center={[b.position.y, b.position.x]}
              radius={0.6}
              pathOptions={{
                color: b.status === "active" ? "lime" : "red"
              }}
            />
          ))}

        {/* FIREFIGHTERS – GŁÓWNA RZECZ */}
        {firefighters
          ?.filter((ff) => ff.position?.floor === floor)
          .map((ff) => (
            <Marker
              key={ff.id}
              position={[ff.position.y, ff.position.x]}
            />
          ))}
      </MapContainer>
    </div>
  );
}
