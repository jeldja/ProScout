import type { SeasonLog } from "@/data/playerData";
import { TrendingUp, Calendar } from "lucide-react";

interface SeasonTrendProps {
  seasonLog: SeasonLog[];
}

const SeasonTrend = ({ seasonLog }: SeasonTrendProps) => {
  return (
    <div className="glass-card-3d rounded-xl p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
          <TrendingUp className="w-4 h-4 text-primary" />
        </div>
        <h2 className="font-display text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Season Progression
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50">
              <th className="pb-4 text-left font-display text-xs uppercase tracking-wider text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" />
                  Season
                </div>
              </th>
              <th className="pb-4 text-right font-display text-xs uppercase tracking-wider text-muted-foreground">PPG</th>
              <th className="pb-4 text-right font-display text-xs uppercase tracking-wider text-muted-foreground">RPG</th>
              <th className="pb-4 text-right font-display text-xs uppercase tracking-wider text-muted-foreground">APG</th>
              <th className="pb-4 text-right font-display text-xs uppercase tracking-wider text-muted-foreground">FG%</th>
            </tr>
          </thead>
          <tbody>
            {seasonLog.map((season, i) => {
              const isLatest = i === seasonLog.length - 1;
              return (
                <tr 
                  key={season.season} 
                  className={`border-b border-border/30 transition-colors hover:bg-secondary/30 ${
                    isLatest ? 'bg-primary/5' : ''
                  }`}
                >
                  <td className="py-4 font-medium">
                    <span className={isLatest ? 'text-primary font-semibold' : 'text-foreground'}>
                      {season.season}
                    </span>
                    {isLatest && (
                      <span className="ml-2 text-[10px] font-bold uppercase tracking-wider bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                        Current
                      </span>
                    )}
                  </td>
                  <td className={`py-4 text-right font-display text-lg ${isLatest ? 'text-gradient font-bold' : 'text-foreground'}`}>
                    {season.ppg}
                  </td>
                  <td className={`py-4 text-right font-display text-lg ${isLatest ? 'font-semibold text-foreground' : 'text-foreground'}`}>
                    {season.rpg}
                  </td>
                  <td className={`py-4 text-right font-display text-lg ${isLatest ? 'font-semibold text-foreground' : 'text-foreground'}`}>
                    {season.apg}
                  </td>
                  <td className={`py-4 text-right font-display text-lg ${isLatest ? 'font-semibold text-foreground' : 'text-foreground'}`}>
                    {season.fgPct}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SeasonTrend;
