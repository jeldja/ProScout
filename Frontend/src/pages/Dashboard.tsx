import { Link, useNavigate } from "react-router-dom";
import { playerDatabase } from "@/data/playerData";
import PlayerHeader from "@/components/PlayerHeader";
import StatCard from "@/components/StatCard";
import ArchetypeBadge from "@/components/ArchetypeBadge";
import CareerOutcomeBar from "@/components/CareerOutcomeBar";
import SeasonTrend from "@/components/SeasonTrend";
import SkillTags from "@/components/SkillTags";
import { Button } from "@/components/ui/button";

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard = ({ onLogout }: DashboardProps) => {
  const navigate = useNavigate();
  const player = playerDatabase[0]; // Marcus Williams

  const handleLogout = () => {
    onLogout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top nav bar */}
      <nav className="border-b border-border bg-card/60 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-primary animate-pulse-glow" />
            <span className="font-display text-sm font-bold uppercase tracking-widest text-foreground">
              ProScout
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <Link
              to="/dashboard"
              className="font-display text-xs uppercase tracking-wider text-primary"
            >
              Dashboard
            </Link>
            <a
              href="#"
              className="font-display text-xs uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors"
            >
              Players
            </a>
            <a
              href="#"
              className="font-display text-xs uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors"
            >
              Compare
            </a>
            <a
              href="#"
              className="font-display text-xs uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors"
            >
              Draft Board
            </a>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="font-display text-xs uppercase tracking-wider text-muted-foreground hover:text-destructive"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl space-y-6 px-6 py-8">
        {/* Header */}
        <PlayerHeader player={player} />

        {/* Key Stats Row */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          <StatCard label="PPG" value={player.stats.ppg} highlighted />
          <StatCard label="RPG" value={player.stats.rpg} />
          <StatCard label="APG" value={player.stats.apg} highlighted />
          <StatCard label="FG%" value={`${player.stats.fgPct}%`} />
          <StatCard label="3PT%" value={`${player.stats.threePct}%`} />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          <StatCard label="SPG" value={player.stats.spg} />
          <StatCard label="BPG" value={player.stats.bpg} />
          <StatCard label="FT%" value={`${player.stats.ftPct}%`} />
          <StatCard label="TO/G" value={player.stats.topg} />
          <StatCard label="MPG" value={player.stats.mpg} />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Archetype */}
          <ArchetypeBadge
            archetype={player.archetype}
            confidence={player.archetypeConfidence}
            nbaComp={player.nbaComp}
          />

          {/* Scouting Notes */}
          <SkillTags strengths={player.strengths} weaknesses={player.weaknesses} />
        </div>

        {/* Career Outcomes */}
        <div className="glass-card rounded-xl p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-display text-sm font-semibold uppercase tracking-widest text-muted-foreground">
              Career Outcome Projections
            </h2>
            <span className="rounded-md bg-primary/10 px-3 py-1 font-display text-xs font-semibold text-primary">
              AI Model v3.2
            </span>
          </div>
          <div className="space-y-5">
            {player.careerOutcomes.map((outcome, i) => (
              <CareerOutcomeBar key={outcome.outcome} outcome={outcome} index={i} />
            ))}
          </div>
        </div>

        {/* Season Trend */}
        <SeasonTrend seasonLog={player.seasonLog} />
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6">
        <p className="text-center font-display text-xs uppercase tracking-widest text-muted-foreground">
          ProScout Analytics • 2026
        </p>
      </footer>
    </div>
  );
};

export default Dashboard;
