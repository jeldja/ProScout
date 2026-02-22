import { Check, AlertTriangle } from "lucide-react";

interface SkillTagsProps {
  strengths: string[];
  weaknesses: string[];
}

const SkillTags = ({ strengths, weaknesses }: SkillTagsProps) => {
  return (
    <div className="glass-card-3d rounded-xl p-6">
      <h2 className="font-display text-sm font-semibold uppercase tracking-widest text-muted-foreground">
        Scouting Notes
      </h2>

      <div className="mt-5 space-y-5">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-md bg-green-500/20 flex items-center justify-center">
              <Check className="w-3.5 h-3.5 text-green-400" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-green-400">Strengths</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {strengths.map((s, i) => (
              <span 
                key={s} 
                className="rounded-lg border border-green-500/30 bg-green-500/10 px-3 py-1.5 text-xs font-medium text-green-400 transition-all hover:bg-green-500/20 hover:scale-105 hover:shadow-lg hover:shadow-green-500/10"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-md bg-red-500/20 flex items-center justify-center">
              <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-red-400">Areas to Develop</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {weaknesses.map((w, i) => (
              <span 
                key={w} 
                className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 transition-all hover:bg-red-500/20 hover:scale-105 hover:shadow-lg hover:shadow-red-500/10"
                style={{ animationDelay: `${i * 50}ms` }}
              >
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
