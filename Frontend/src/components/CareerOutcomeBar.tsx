import type { CareerOutcome } from "@/data/playerData";

interface CareerOutcomeBarProps {
  outcome: CareerOutcome;
  index: number;
}

const outcomeColors: Record<string, string> = {
  "All-Star": "bg-stat-green",
  "Quality Starter": "bg-stat-blue",
  "Solid Rotation": "bg-primary",
  "Role Player": "bg-stat-yellow",
  "Out of League": "bg-stat-red",
};

const CareerOutcomeBar = ({ outcome, index }: CareerOutcomeBarProps) => {
  const colorClass = outcomeColors[outcome.outcome] || "bg-primary";

  return (
    <div
      className="animate-slide-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="mb-1 flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">{outcome.outcome}</span>
        <span className="font-display text-sm font-bold text-foreground">{outcome.probability}%</span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className={`h-full rounded-full ${colorClass} transition-all duration-1000 ease-out`}
          style={{ width: `${outcome.probability}%` }}
        />
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{outcome.description}</p>
    </div>
  );
};

export default CareerOutcomeBar;
