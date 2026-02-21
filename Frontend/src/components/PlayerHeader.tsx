import type { Player } from "@/data/playerData";

interface PlayerHeaderProps {
  player: Player;
}

const PlayerHeader = ({ player }: PlayerHeaderProps) => {
  return (
    <div className="relative overflow-hidden rounded-2xl glass-card p-8">
      {/* Accent line */}
      <div className="accent-line absolute left-0 right-0 top-0" />

      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-6">
          {/* Player avatar placeholder */}
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-secondary font-display text-3xl font-bold text-primary">
            {player.name.split(" ").map(n => n[0]).join("")}
          </div>

          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground font-display lg:text-4xl">
              {player.name}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span className="rounded-md bg-primary/10 px-2.5 py-1 font-display text-xs font-semibold text-primary">
                {player.position}
              </span>
              <span>{player.school} • {player.year}</span>
              <span className="hidden sm:inline">•</span>
              <span>{player.height} • {player.weight}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button className="rounded-lg bg-primary px-5 py-2.5 font-display text-xs font-semibold uppercase tracking-wider text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20">
            Compare Player
          </button>
          <button className="rounded-lg border border-border bg-secondary px-5 py-2.5 font-display text-xs font-semibold uppercase tracking-wider text-secondary-foreground transition-all hover:bg-secondary/80">
            Full Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayerHeader;
