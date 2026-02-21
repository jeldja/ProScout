import { Link } from "react-router-dom";
import type { Player } from "@/data/playerData";
import { Bookmark, BookmarkCheck } from "lucide-react";

interface PlayerCardProps {
  player: Player;
  isSaved?: boolean;
  onToggleSave?: (id: string) => void;
}

const PlayerCard = ({ player, isSaved = false, onToggleSave }: PlayerCardProps) => {
  return (
    <Link
      to={`/players/${player.id}`}
      className="group block rounded-xl glass-card-3d p-5 transition-all hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex gap-4 flex-1 min-w-0">
          <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0 overflow-hidden ring-2 ring-primary/20">
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
            <span className="font-display text-lg font-bold text-primary hidden">
              {player.name.split(" ").map((n) => n[0]).join("")}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
              {player.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {player.position} • {player.school} • {player.year}
            </p>
            <div className="mt-2 flex items-center gap-3">
              <span className="text-xs font-display font-bold text-primary">
                Score: {player.draftabilityScore}
              </span>
              <span className="text-xs text-muted-foreground">
                {player.stats.ppg} PPG • {player.stats.rpg} RPG • {player.stats.apg} APG
              </span>
            </div>
          </div>
        </div>
        {onToggleSave && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onToggleSave(player.id);
            }}
            className="p-2 rounded-lg hover:bg-muted/50 transition-colors flex-shrink-0"
            aria-label={isSaved ? "Remove from saved" : "Save player"}
          >
            {isSaved ? (
              <BookmarkCheck className="h-5 w-5 text-primary fill-primary" />
            ) : (
              <Bookmark className="h-5 w-5 text-muted-foreground" />
            )}
          </button>
        )}
      </div>
    </Link>
  );
};

export default PlayerCard;
