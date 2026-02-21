import { useParams, Link, useNavigate } from "react-router-dom";
import { playerDatabase } from "@/data/playerData";
import PlayerHeader from "@/components/PlayerHeader";
import StatCard from "@/components/StatCard";
import ArchetypeBadge from "@/components/ArchetypeBadge";
import CareerOutcomeBar from "@/components/CareerOutcomeBar";
import SkillTags from "@/components/SkillTags";
import { Button } from "@/components/ui/button";
import { useSavedPlayersContext } from "@/contexts/SavedPlayersContext";
import { Bookmark, BookmarkCheck, ArrowLeft } from "lucide-react";

interface PlayerProfileProps {
  onLogout?: () => void;
}

const PlayerProfile = ({ onLogout }: PlayerProfileProps) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isSaved, toggleSaved } = useSavedPlayersContext();
  const player = playerDatabase.find((p) => p.id === id);

  if (!player) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-bold text-foreground">Player not found</h1>
          <Button asChild className="mt-4">
            <Link to="/players">Back to Players</Link>
          </Button>
        </div>
      </div>
    );
  }

  const saved = isSaved(player.id);

  return (
    <div className="min-h-screen bg-background">
      {/* Top nav bar - minimal for profile */}
      <nav className="border-b border-border bg-card/60 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-primary animate-pulse-glow" />
            <span className="font-display text-sm font-bold uppercase tracking-widest text-foreground">
              ProScout
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard" className="gap-1.5">
                <ArrowLeft className="h-4 w-4" />
                Dashboard
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/players" className="gap-1.5">
                Players
              </Link>
            </Button>
            <Button
              variant={saved ? "default" : "outline"}
              size="sm"
              onClick={() => toggleSaved(player.id)}
              className="gap-1.5"
            >
              {saved ? (
                <>
                  <BookmarkCheck className="h-4 w-4" />
                  Saved
                </>
              ) : (
                <>
                  <Bookmark className="h-4 w-4" />
                  Save Player
                </>
              )}
            </Button>
            {onLogout && (
              <Button variant="ghost" size="sm" onClick={onLogout} className="text-muted-foreground hover:text-destructive">
                Sign Out
              </Button>
            )}
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl space-y-6 px-6 py-8">
        <PlayerHeader player={player} />

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          <StatCard label="PPG" value={player.stats.ppg} highlighted />
          <StatCard label="RPG" value={player.stats.rpg} />
          <StatCard label="APG" value={player.stats.apg} highlighted />
          <StatCard label="FG%" value={`${player.stats.fgPct}%`} />
          <StatCard label="3PT%" value={`${player.stats.threePct}%`} />
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          <StatCard label="SPG" value={player.stats.spg} />
          <StatCard label="BPG" value={player.stats.bpg} />
          <StatCard label="FT%" value={`${player.stats.ftPct}%`} />
          <StatCard label="TO/G" value={player.stats.topg} />
          <StatCard label="MPG" value={player.stats.mpg} />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <ArchetypeBadge
            archetype={player.archetype}
            confidence={player.archetypeConfidence}
            nbaComp={player.nbaComp}
            playerName={player.name}
            nbaComparisons={player.nbaComparisons}
          />
          <SkillTags strengths={player.strengths} weaknesses={player.weaknesses} />
        </div>

        <div className="glass-card-3d rounded-xl p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-display text-sm font-semibold uppercase tracking-widest text-muted-foreground">
              Career Outcome Projections
            </h2>
            <span className="rounded-lg bg-gradient-to-r from-primary/20 to-orange-500/20 px-4 py-1.5 font-display text-xs font-semibold text-primary border border-primary/30">
              AI Model v3.2
            </span>
          </div>
          <div className="space-y-3">
            {player.careerOutcomes.map((outcome, i) => (
              <CareerOutcomeBar key={outcome.outcome} outcome={outcome} index={i} />
            ))}
          </div>
        </div>
      </main>

      <footer className="border-t border-border py-6">
        <p className="text-center font-display text-xs uppercase tracking-widest text-muted-foreground">
          ProScout Analytics • 2026
        </p>
      </footer>
    </div>
  );
};

export default PlayerProfile;
