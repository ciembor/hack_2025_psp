import React from "react";
import ReactDOM from "react-dom/client";
import Dashboard from "./pages/Dashboard";

import "leaflet/dist/leaflet.css";

import L from "leaflet";

// bez tego nie działa, a z tym działa
delete L.Icon.Default.prototype._getIconUrl;

import iconUrl from "leaflet/dist/images/marker-icon.png?url";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png?url";
import shadowUrl from "leaflet/dist/images/marker-shadow.png?url";

L.Icon.Default.mergeOptions({
  iconUrl,
  iconRetinaUrl,
  shadowUrl
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Dashboard />
  </React.StrictMode>
);
