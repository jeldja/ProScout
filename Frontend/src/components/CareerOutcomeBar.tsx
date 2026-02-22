import type { CareerOutcome } from "@/data/playerData";

interface CareerOutcomeBarProps {
  outcome: CareerOutcome;
  index: number;
}

const outcomeStyles: Record<string, { bg: string; glow: string; icon: string }> = {
  "BPM vs Peers": { 
    bg: "bg-gradient-to-r from-green-500 to-emerald-400", 
    glow: "shadow-green-500/40",
    icon: "📈"
  },
  "VORP vs Peers": { 
    bg: "bg-gradient-to-r from-blue-500 to-cyan-400", 
    glow: "shadow-blue-500/40",
    icon: "💪"
  },
  "PTS vs Peers": { 
    bg: "bg-gradient-to-r from-orange-500 to-amber-400", 
    glow: "shadow-orange-500/40",
    icon: "🏀"
  },
  "MP vs Peers": { 
    bg: "bg-gradient-to-r from-purple-500 to-violet-400", 
    glow: "shadow-purple-500/40",
    icon: "⏱️"
  },
  // Fallback for players not in predictions CSV
  "All-Star": { bg: "bg-gradient-to-r from-green-500 to-emerald-400", glow: "shadow-green-500/40", icon: "🌟" },
  "Star": { bg: "bg-gradient-to-r from-green-500 to-emerald-400", glow: "shadow-green-500/40", icon: "🌟" },
  "Quality Starter": { bg: "bg-gradient-to-r from-blue-500 to-cyan-400", glow: "shadow-blue-500/40", icon: "💪" },
  "Starter": { bg: "bg-gradient-to-r from-blue-500 to-cyan-400", glow: "shadow-blue-500/40", icon: "💪" },
  "Solid Rotation": { bg: "bg-gradient-to-r from-orange-500 to-amber-400", glow: "shadow-orange-500/40", icon: "🔄" },
  "Rotation": { bg: "bg-gradient-to-r from-orange-500 to-amber-400", glow: "shadow-orange-500/40", icon: "🔄" },
  "Role Player": { bg: "bg-gradient-to-r from-yellow-500 to-yellow-400", glow: "shadow-yellow-500/40", icon: "👤" },
  "Long Shot": { bg: "bg-gradient-to-r from-red-500 to-rose-400", glow: "shadow-red-500/40", icon: "📉" },
  "Out of League": { bg: "bg-gradient-to-r from-red-500 to-rose-400", glow: "shadow-red-500/40", icon: "📉" },
};

const PEER_METRICS = ["BPM vs Peers", "VORP vs Peers", "PTS vs Peers", "MP vs Peers"];

const CareerOutcomeBar = ({ outcome, index }: CareerOutcomeBarProps) => {
  const style = outcomeStyles[outcome.outcome] || { 
    bg: "bg-gradient-to-r from-primary to-orange-400", 
    glow: "shadow-primary/40",
    icon: "📊"
  };
  const isPercentile = PEER_METRICS.includes(outcome.outcome);
  const valueLabel = isPercentile
    ? `${Math.round(outcome.probability)}th percentile`
    : `${outcome.probability}%`;

  return (
    <div
      className="group p-3 -mx-3 rounded-lg hover:bg-secondary/30 transition-all duration-300"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base">{style.icon}</span>
          <span className="text-sm font-semibold text-foreground">{outcome.outcome}</span>
        </div>
        <span className="font-display text-lg font-bold text-gradient">{valueLabel}</span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-secondary/50 backdrop-blur-sm">
        <div
          className={`h-full rounded-full ${style.bg} transition-all duration-1000 ease-out shadow-lg ${style.glow}`}
          style={{ width: `${outcome.probability}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-muted-foreground group-hover:text-foreground/70 transition-colors">
        {outcome.description}
      </p>
    </div>
  );
};

export default CareerOutcomeBar;
