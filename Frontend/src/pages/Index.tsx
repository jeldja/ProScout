import { playerDatabase } from "@/data/playerData";
import PlayerHeader from "@/components/PlayerHeader";
import StatCard from "@/components/StatCard";
import ArchetypeBadge from "@/components/ArchetypeBadge";
import CareerOutcomeBar from "@/components/CareerOutcomeBar";
import HeroScroll3D from "@/components/HeroScroll3D";

const Index = () => {
  const player = playerDatabase[0]; // Marcus Williams

  return (
    <div className="min-h-screen bg-background">
      {/* Top nav bar */}
      <nav className="border-b border-border bg-card/60 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-primary animate-pulse-glow" />
            <span className="font-display text-sm font-bold uppercase tracking-widest text-foreground">
              ProScout
            </span>
          </div>
          <div className="flex items-center gap-6">
            <a href="/dashboard" className="font-display text-xs uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors">Dashboard</a>
            <a href="/players" className="font-display text-xs uppercase tracking-wider text-primary">Players</a>
          </div>
        </div>
      </nav>

      {/* 3D Scroll Hero */}
      <HeroScroll3D />

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

        <ArchetypeBadge
          archetype={player.archetype}
          nbaComp={player.nbaComp}
          playerName={player.name}
          nbaComparisons={player.nbaComparisons}
        />

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
          <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
            <div className="rounded-lg bg-secondary/40 px-4 py-3 text-center">
              <span className="block font-display text-xs uppercase tracking-wider text-muted-foreground">Draft Score</span>
              <span className="mt-1 block text-lg font-bold text-primary">{player.draftabilityScore}</span>
            </div>
            {player.careerProjections && (
              <>
                <div className="rounded-lg bg-secondary/40 px-4 py-3 text-center">
                  <span className="block font-display text-xs uppercase tracking-wider text-muted-foreground">Peak BPM</span>
                  <span className="mt-1 block text-lg font-bold text-foreground">{player.careerProjections.peak_bpm}</span>
                </div>
                <div className="rounded-lg bg-secondary/40 px-4 py-3 text-center">
                  <span className="block font-display text-xs uppercase tracking-wider text-muted-foreground">Peak VORP</span>
                  <span className="mt-1 block text-lg font-bold text-foreground">{player.careerProjections.peak_vorp}</span>
                </div>
                <div className="rounded-lg bg-secondary/40 px-4 py-3 text-center">
                  <span className="block font-display text-xs uppercase tracking-wider text-muted-foreground">Peak PTS</span>
                  <span className="mt-1 block text-lg font-bold text-foreground">{player.careerProjections.peak_pts}</span>
                </div>
                <div className="rounded-lg bg-secondary/40 px-4 py-3 text-center">
                  <span className="block font-display text-xs uppercase tracking-wider text-muted-foreground">Peak MP</span>
                  <span className="mt-1 block text-lg font-bold text-foreground">{player.careerProjections.peak_mp}</span>
                </div>
              </>
            )}
          </div>
          <div className="space-y-5">
            {player.careerOutcomes.map((outcome, i) => (
              <CareerOutcomeBar key={outcome.outcome} outcome={outcome} index={i} />
            ))}
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6">
        <p className="text-center font-display text-xs uppercase tracking-widest text-muted-foreground">
          ProScout Analytics • 2025
        </p>
      </footer>
    </div>
  );
};

export default Index;
