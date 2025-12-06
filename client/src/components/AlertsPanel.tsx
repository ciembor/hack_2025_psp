export function AlertsPanel({ alerts }) {
  const sorted = [...alerts].sort((a, b) => {
    const sev = { critical: 2, warning: 1 };
    return sev[b.severity] - sev[a.severity];
  });

  return (
    <div className="p-2 border-l w-80 overflow-y-auto">
      <h2 className="font-bold mb-2">Active Alerts</h2>
      {sorted.map((a) => (
        <div key={a.id} className="p-2 mb-2 border rounded bg-red-100">
          <p><b>{a.alert_type}</b></p>
          <p>{a.firefighter.name}</p>
          <p>{new Date(a.timestamp).toLocaleTimeString()}</p>
        </div>
      ))}
    </div>
  );
}
