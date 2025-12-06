import { FirefighterCard } from "../components/FirefighterCard";

export default function FirefightersList({ firefighters }) {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-3">Firefighters</h1>
      {firefighters.map(ff => (
        <FirefighterCard key={ff.id} ff={ff} />
      ))}
    </div>
  );
}
