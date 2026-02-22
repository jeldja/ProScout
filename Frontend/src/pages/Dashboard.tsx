import { Link, useNavigate } from "react-router-dom";
import { usePlayers } from "@/hooks/usePlayers";
import PlayerCard from "@/components/PlayerCard";
import { Button } from "@/components/ui/button";
import { useSavedPlayersContext } from "@/contexts/SavedPlayersContext";
import { Users } from "lucide-react";

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard = ({ onLogout }: DashboardProps) => {
  const navigate = useNavigate();
  const { data: playerDatabase = [], isLoading } = usePlayers();
  const { savedIds, toggleSaved } = useSavedPlayersContext();
  const savedPlayers = playerDatabase.filter((p) => savedIds.includes(p.id)).sort((a, b) => b.draftabilityScore - a.draftabilityScore);

  const handleLogout = () => {
    onLogout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card/60 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-primary animate-pulse-glow" />
            <span className="font-display text-sm font-bold uppercase tracking-widest text-foreground">
              ProScout
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="font-display text-xs uppercase tracking-wider text-primary">
              Dashboard
            </Link>
            <Link to="/players" className="font-display text-xs uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors">
              Players
            </Link>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="font-display text-xs uppercase tracking-wider text-muted-foreground hover:text-destructive">
              Sign Out
            </Button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8">
          <h1 className="font-display text-2xl font-bold text-foreground">Saved Players</h1>
          <p className="text-muted-foreground mt-1">Your saved prospects — click any card to view full stats and profile.</p>
        </div>

        {isLoading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : savedPlayers.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {savedPlayers.map((player) => (
              <PlayerCard
                key={player.id}
                player={player}
                isSaved={true}
                onToggleSave={toggleSaved}
              />
            ))}
          </div>
        ) : savedPlayers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 rounded-xl border-2 border-dashed border-border bg-card/30">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h2 className="font-display text-lg font-semibold text-foreground">No saved players yet</h2>
            <p className="text-muted-foreground text-center max-w-sm mt-2">
              Browse all players, save your favorites, and they&apos;ll appear here for quick access.
            </p>
            <Button asChild className="mt-6">
              <Link to="/players">Browse Players</Link>
            </Button>
          </div>
        ) : null}
      </main>

      <footer className="border-t border-border py-6">
        <p className="text-center font-display text-xs uppercase tracking-widest text-muted-foreground">
          ProScout Analytics • 2026
        </p>
      </footer>
    </div>
  );
};

export default Dashboard;
