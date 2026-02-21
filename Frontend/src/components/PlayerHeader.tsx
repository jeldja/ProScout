import type { Player } from "@/data/playerData";
import { MapPin, Ruler, Weight } from "lucide-react";

interface PlayerHeaderProps {
  player: Player;
}

const PlayerHeader = ({ player }: PlayerHeaderProps) => {
  return (
    <div className="relative overflow-hidden rounded-2xl glass-card-3d p-8">
      {/* Accent gradient */}
      <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-primary via-orange-400 to-primary/50" />
      
      {/* Background glow effect */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl" />

      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-6">
          {/* Player headshot with glow */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-orange-500 rounded-full blur-lg opacity-50" />
            <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-secondary to-card border-2 border-primary/30 font-display text-3xl font-bold text-gradient shadow-2xl overflow-hidden">
              <img
                src={player.headshotUrl}
                alt={player.name}
                className="h-full w-full object-cover"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.style.display = "none";
                  img.nextElementSibling?.classList.remove("hidden");
                }}
              />
              <span className="hidden font-display text-3xl font-bold text-gradient">
                {player.name.split(" ").map(n => n[0]).join("")}
              </span>
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground font-display lg:text-4xl">
              {player.name}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="rounded-lg bg-gradient-to-r from-primary/20 to-orange-500/20 px-3 py-1.5 font-display text-xs font-bold text-primary border border-primary/30 shadow-lg shadow-primary/10">
                {player.position}
              </span>
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                <span className="font-medium">{player.school}</span>
              </div>
              <span className="text-primary">•</span>
              <span>{player.year}</span>
              <span className="text-primary hidden sm:inline">•</span>
              <div className="hidden sm:flex items-center gap-1.5">
                <Ruler className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{player.height}</span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5">
                <Weight className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{player.weight}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <span className="rounded-xl bg-gradient-to-r from-primary/20 to-orange-500/20 px-6 py-3 font-display text-xs font-semibold text-primary border border-primary/30">
            Draft Score: {player.draftabilityScore}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PlayerHeader;
