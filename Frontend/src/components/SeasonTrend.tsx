import type { SeasonLog } from "@/data/playerData";

interface SeasonTrendProps {
  seasonLog: SeasonLog[];
}

const SeasonTrend = ({ seasonLog }: SeasonTrendProps) => {
  return (
    <div className="glass-card rounded-xl p-6">
      <h2 className="font-display text-sm font-semibold uppercase tracking-widest text-muted-foreground">
        Season Progression
      </h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="pb-3 text-left font-display text-xs uppercase tracking-wider text-muted-foreground">Season</th>
              <th className="pb-3 text-right font-display text-xs uppercase tracking-wider text-muted-foreground">PPG</th>
              <th className="pb-3 text-right font-display text-xs uppercase tracking-wider text-muted-foreground">RPG</th>
              <th className="pb-3 text-right font-display text-xs uppercase tracking-wider text-muted-foreground">APG</th>
              <th className="pb-3 text-right font-display text-xs uppercase tracking-wider text-muted-foreground">FG%</th>
            </tr>
          </thead>
          <tbody>
            {seasonLog.map((season, i) => (
              <tr key={season.season} className={`border-b border-border/50 ${i === seasonLog.length - 1 ? 'text-primary font-semibold' : 'text-foreground'}`}>
                <td className="py-3 font-medium">{season.season}</td>
                <td className="py-3 text-right font-display">{season.ppg}</td>
                <td className="py-3 text-right font-display">{season.rpg}</td>
                <td className="py-3 text-right font-display">{season.apg}</td>
                <td className="py-3 text-right font-display">{season.fgPct}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SeasonTrend;
