import { useState } from "react";
import { NBAComparison } from "@/data/playerData";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check, X, TrendingUp, Users } from "lucide-react";

interface NBAComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerName: string;
  comparisons: NBAComparison[];
}

const NBAComparisonModal = ({
  isOpen,
  onClose,
  playerName,
  comparisons,
}: NBAComparisonModalProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedComp = comparisons[selectedIndex];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-panel max-w-4xl max-h-[90vh] overflow-hidden p-0 border-primary/20">
        <div className="p-6 pb-0">
          <DialogHeader>
            <DialogTitle className="font-display text-xl text-gradient flex items-center gap-3">
              <Users className="h-6 w-6 text-primary" />
              NBA Player Comparisons
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Top 5 professional players that match {playerName}'s play style
            </p>
          </DialogHeader>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 p-6 overflow-auto">
          {/* Left side - Player cards */}
          <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 lg:w-48 flex-shrink-0">
            {comparisons.map((comp, index) => (
              <button
                key={comp.name}
                onClick={() => setSelectedIndex(index)}
                className={`nba-card flex-shrink-0 p-3 rounded-xl transition-all duration-300 text-left ${
                  selectedIndex === index
                    ? "border-primary/50 ring-2 ring-primary/30"
                    : "hover:border-primary/30"
                }`}
                style={{
                  transform: selectedIndex === index 
                    ? "perspective(600px) rotateY(0deg) rotateX(0deg) scale(1.02)" 
                    : undefined
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={comp.headshotUrl}
                      alt={comp.name}
                      className="w-12 h-12 rounded-full object-cover object-top bg-secondary headshot-glow"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(comp.name)}&background=1a1a2e&color=ff6b35&bold=true`;
                      }}
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-card border-2 border-primary flex items-center justify-center">
                      <span className="text-[10px] font-bold text-primary">#{index + 1}</span>
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-foreground truncate">{comp.name}</p>
                    <p className="text-xs text-muted-foreground">{comp.matchScore}% match</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Right side - Detailed comparison */}
          <div className="flex-1 space-y-5">
            {/* Selected player header */}
            <div className="glass-card-3d rounded-xl p-5">
              <div className="flex items-start gap-5">
                <div className="relative flex-shrink-0">
                  <img
                    src={selectedComp.headshotUrl}
                    alt={selectedComp.name}
                    className="w-24 h-24 rounded-2xl object-cover object-top bg-secondary headshot-glow"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedComp.name)}&background=1a1a2e&color=ff6b35&bold=true&size=128`;
                    }}
                  />
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-lg">
                    {selectedComp.matchScore}% Match
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-foreground font-display">{selectedComp.name}</h3>
                  <p className="text-muted-foreground mt-1">
                    {selectedComp.team} • {selectedComp.position}
                  </p>
                  <div className="flex gap-4 mt-3">
                    <div className="text-center">
                      <p className="text-xl font-bold text-gradient font-display">{selectedComp.stats.ppg}</p>
                      <p className="text-xs text-muted-foreground uppercase">PPG</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-foreground font-display">{selectedComp.stats.rpg}</p>
                      <p className="text-xs text-muted-foreground uppercase">RPG</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-foreground font-display">{selectedComp.stats.apg}</p>
                      <p className="text-xs text-muted-foreground uppercase">APG</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Match score bar */}
              <div className="mt-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-display uppercase tracking-wider text-muted-foreground">
                    Similarity Score
                  </span>
                  <span className="text-sm font-bold text-primary">{selectedComp.matchScore}%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full similarity-bar rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${selectedComp.matchScore}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Similarities and Differences */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Similarities */}
              <div className="glass-card rounded-xl p-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <Check className="h-4 w-4 text-green-400" />
                  </div>
                  <h4 className="font-display text-sm uppercase tracking-wider text-green-400">
                    Similarities
                  </h4>
                </div>
                <ul className="space-y-2.5">
                  {selectedComp.similarities.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 flex-shrink-0" />
                      <span className="text-foreground/90">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Differences */}
              <div className="glass-card rounded-xl p-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-orange-400" />
                  </div>
                  <h4 className="font-display text-sm uppercase tracking-wider text-orange-400">
                    Key Differences
                  </h4>
                </div>
                <ul className="space-y-2.5">
                  {selectedComp.differences.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 flex-shrink-0" />
                      <span className="text-foreground/90">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NBAComparisonModal;
