export function FirefighterCard({ ff }) {
  return (
    <div className="border p-2 rounded mb-2">
      <p><b>{ff.firefighter?.name}</b> ({ff.id})</p>
      <p>Team: {ff.firefighter?.team}</p>
      <p>Floor: {ff.position?.floor}</p>
      <p>Heart rate: {ff.vitals?.heart_rate_bpm}</p>
      <p>Battery: {ff.device?.battery_percent}%</p>
      <p>Motion: {ff.vitals?.motion_state}</p>
    </div>
  );
}
