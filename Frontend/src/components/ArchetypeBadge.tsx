import { useState } from "react";
import { NBAComparison } from "@/data/playerData";
import NBAComparisonModal from "./NBAComparisonModal";
import { ChevronRight, Users } from "lucide-react";

interface ArchetypeBadgeProps {
  archetype: string;
  confidence: number;
  nbaComp: string;
  playerName: string;
  nbaComparisons: NBAComparison[];
}

const ArchetypeBadge = ({ archetype, confidence, nbaComp, playerName, nbaComparisons }: ArchetypeBadgeProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const circumference = 2 * Math.PI * 36;
  const strokeDashoffset = circumference - (confidence / 100) * circumference;

  const topComp = nbaComparisons[0];

  return (
    <>
      <div className="glass-card-3d stat-glow rounded-xl p-6 floating-glow">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground font-display">
          Predicted Archetype
        </p>

        <div className="mt-4 flex items-center gap-5">
          {/* Circular progress */}
          <div className="relative h-24 w-24 flex-shrink-0">
            <svg className="h-24 w-24 -rotate-90" viewBox="0 0 96 96">
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(24 100% 55%)" />
                  <stop offset="100%" stopColor="hsl(15 100% 45%)" />
                </linearGradient>
              </defs>
              <circle cx="48" cy="48" r="42" fill="none" stroke="hsl(var(--secondary))" strokeWidth="6" />
              <circle
                cx="48"
                cy="48"
                r="42"
                fill="none"
                stroke="url(#progressGradient)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 42}
                strokeDashoffset={(2 * Math.PI * 42) - (confidence / 100) * (2 * Math.PI * 42)}
                className="transition-all duration-1000 ease-out"
                style={{ filter: "drop-shadow(0 0 8px hsl(24 100% 50% / 0.5))" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display text-xl font-bold text-gradient">{confidence}%</span>
            </div>
          </div>

          <div className="flex-1">
            <h3 className="text-xl font-bold text-foreground">{archetype}</h3>
            
            {/* Clickable NBA Comp */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-3 flex items-center gap-3 p-3 -mx-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-all group"
            >
              {topComp && (
                <img
                  src={topComp.headshotUrl}
                  alt={nbaComp}
                  className="w-10 h-10 rounded-full object-cover object-top bg-secondary headshot-glow"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(nbaComp)}&background=1a1a2e&color=ff6b35&bold=true`;
                  }}
                />
              )}
              <div className="flex-1 text-left">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Primary NBA Comp</p>
                <p className="font-semibold text-primary">{nbaComp}</p>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground group-hover:text-primary transition-colors">
                <Users className="h-4 w-4" />
                <span className="text-xs font-medium">View All 5</span>
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>
        </div>
      </div>

      <NBAComparisonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        playerName={playerName}
        comparisons={nbaComparisons}
      />
    </>
  );
};

export default ArchetypeBadge;
