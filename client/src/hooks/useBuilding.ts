import { useEffect, useState } from "react";

export function useBuilding() {
  const [building, setBuilding] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5001/proxy/building")
      .then((r) => r.json())
      .then((data) => setBuilding(data))
      .catch(console.error);
  }, []);

  return building;
}
