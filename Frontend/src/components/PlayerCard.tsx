import { Link } from "react-router-dom";
import type { Player } from "@/data/playerData";
import { Bookmark, BookmarkCheck } from "lucide-react";

interface PlayerCardProps {
  player: Player;
  isSaved?: boolean;
  onToggleSave?: (id: string) => void;
  /** Optional overall rank (e.g. 1–10 on first page when sorted by draftability) */
  rank?: number;
}

const CIRCLE_SIZE = 52;
const CIRCLE_STROKE = 4;
const CIRCLE_R = (CIRCLE_SIZE - CIRCLE_STROKE) / 2;
const CIRCLE_CX = CIRCLE_SIZE / 2;
const CIRCLE_CY = CIRCLE_SIZE / 2;
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_R;

function DraftabilityCircle({ score }: { score: number }) {
  const clamped = Math.min(100, Math.max(0, score));
  const offset = CIRCLE_CIRCUMFERENCE * (1 - clamped / 100);
  return (
    <div className="relative flex h-[52px] w-[52px] flex-shrink-0 items-center justify-center">
      <svg
        width={CIRCLE_SIZE}
        height={CIRCLE_SIZE}
        className="-rotate-90"
        aria-hidden
      >
        <circle
          cx={CIRCLE_CX}
          cy={CIRCLE_CY}
          r={CIRCLE_R}
          fill="none"
          stroke="currentColor"
          strokeWidth={CIRCLE_STROKE}
          className="text-muted-foreground/30"
        />
        <circle
          cx={CIRCLE_CX}
          cy={CIRCLE_CY}
          r={CIRCLE_R}
          fill="none"
          stroke="currentColor"
          strokeWidth={CIRCLE_STROKE}
          strokeLinecap="round"
          className="text-primary transition-[stroke-dashoffset] duration-300"
          strokeDasharray={CIRCLE_CIRCUMFERENCE}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-display text-sm font-bold tabular-nums text-primary">
        {score}
      </span>
    </div>
  );
}

const PlayerCard = ({ player, isSaved = false, onToggleSave, rank }: PlayerCardProps) => {
  return (
    <Link
      to={`/players/${player.id}`}
      className="group block rounded-xl glass-card-3d p-5 transition-all hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex gap-4 flex-1 min-w-0">
          {rank != null && (
            <span className="flex h-14 w-10 flex-shrink-0 items-center justify-center font-display text-lg font-bold text-muted-foreground/80 tabular-nums">
              #{rank}
            </span>
          )}
          <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0 overflow-hidden ring-2 ring-primary/20">
            <img
              src={player.headshotUrl}
              alt={player.name}
              className="h-full w-full object-cover"
              referrerPolicy="no-referrer"
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
              <span className="text-xs text-muted-foreground">
                {player.stats.ppg} PPG • {player.stats.rpg} RPG • {player.stats.apg} APG
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider text-right">
            Draft Score
          </span>
          <DraftabilityCircle score={player.draftabilityScore} />
          {onToggleSave && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onToggleSave(player.id);
              }}
              className="p-2 rounded-lg hover:bg-muted/50 transition-colors"
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
      </div>
    </Link>
  );
};

export default PlayerCard;
