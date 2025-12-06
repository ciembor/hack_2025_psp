import L from "leaflet";
import { MapContainer, Rectangle } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// forced icon patch
import icon2x from "leaflet/dist/images/marker-icon-2x.png";
import icon from "leaflet/dist/images/marker-icon.png";
import shadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: icon2x,
  iconUrl: icon,
  shadowUrl: shadow
});

export function MapView() {
  console.log("MAPVIEW RENDER");

  const width = 40;
  const height = 25;

  const bounds = [
    [0, 0],
    [height, width]
  ];

  return (
    <div style={{ width: "100%", height: "100%", background: "pink" }}>
      <MapContainer
        crs={L.CRS.Simple}
        bounds={bounds}
        style={{ width: "100%", height: "100%" }}
        zoom={0}
      >
        <Rectangle
          bounds={[
            [0, 0],
            [height, width]
          ]}
          pathOptions={{ color: "black" }}
        />
      </MapContainer>
    </div>
  );
}
