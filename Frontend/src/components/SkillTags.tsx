interface SkillTagsProps {
  strengths: string[];
  weaknesses: string[];
}

const SkillTags = ({ strengths, weaknesses }: SkillTagsProps) => {
  return (
    <div className="glass-card rounded-xl p-6">
      <h2 className="font-display text-sm font-semibold uppercase tracking-widest text-muted-foreground">
        Scouting Notes
      </h2>

      <div className="mt-4 space-y-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-stat-green">Strengths</p>
          <div className="flex flex-wrap gap-2">
            {strengths.map((s) => (
              <span key={s} className="rounded-md border border-stat-green/20 bg-stat-green/10 px-3 py-1 text-xs font-medium text-stat-green">
                {s}
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-stat-red">Weaknesses</p>
          <div className="flex flex-wrap gap-2">
            {weaknesses.map((w) => (
              <span key={w} className="rounded-md border border-stat-red/20 bg-stat-red/10 px-3 py-1 text-xs font-medium text-stat-red">
                {w}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillTags;
