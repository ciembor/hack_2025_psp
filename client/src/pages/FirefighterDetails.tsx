export default function FirefighterDetails({ ff }) {
  if (!ff) return <p>No firefighter selected</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">{ff.firefighter?.name}</h1>

      <h2 className="font-bold mt-4">Vitals</h2>
      <p>Heart rate: {ff.vitals?.heart_rate_bpm}</p>
      <p>Motion: {ff.vitals?.motion_state}</p>

      <h2 className="font-bold mt-4">Battery</h2>
      <p>Tag: {ff.device?.battery_percent}%</p>

      <h2 className="font-bold mt-4">Last Position</h2>
      <p>x={ff.position?.x}, y={ff.position?.y}, floor={ff.position?.floor}</p>
    </div>
  );
}
