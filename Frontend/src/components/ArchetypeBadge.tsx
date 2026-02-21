interface ArchetypeBadgeProps {
  archetype: string;
  confidence: number;
  nbaComp: string;
}

const ArchetypeBadge = ({ archetype, confidence, nbaComp }: ArchetypeBadgeProps) => {
  const circumference = 2 * Math.PI * 36;
  const strokeDashoffset = circumference - (confidence / 100) * circumference;

  return (
    <div className="glass-card stat-glow rounded-xl p-6">
      <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground font-display">
        Predicted Archetype
      </p>

      <div className="mt-4 flex items-center gap-5">
        {/* Circular progress */}
        <div className="relative h-20 w-20 flex-shrink-0">
          <svg className="h-20 w-20 -rotate-90" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="36" fill="none" stroke="hsl(var(--secondary))" strokeWidth="5" />
            <circle
              cx="40"
              cy="40"
              r="36"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display text-lg font-bold text-gradient">{confidence}%</span>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-foreground">{archetype}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            NBA Comp: <span className="font-semibold text-primary">{nbaComp}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ArchetypeBadge;
