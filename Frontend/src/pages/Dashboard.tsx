import { useState, useMemo, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { playerDatabase, Player } from "@/data/playerData";
import PlayerHeader from "@/components/PlayerHeader";
import StatCard from "@/components/StatCard";
import ArchetypeBadge from "@/components/ArchetypeBadge";
import CareerOutcomeBar from "@/components/CareerOutcomeBar";
import SeasonTrend from "@/components/SeasonTrend";
import SkillTags from "@/components/SkillTags";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard = ({ onLogout }: DashboardProps) => {
  const navigate = useNavigate();
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>(playerDatabase[0].id);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const player = playerDatabase.find((p) => p.id === selectedPlayerId) || playerDatabase[0];

  const filteredPlayers = useMemo(() => {
    if (!searchQuery.trim()) return playerDatabase;
    const query = searchQuery.toLowerCase();
    return playerDatabase.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.school.toLowerCase().includes(query) ||
        p.position.toLowerCase().includes(query) ||
        p.archetype.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePlayerSelect = (p: Player) => {
    setSelectedPlayerId(p.id);
    setSearchQuery("");
    setIsSearchOpen(false);
  };

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
            {/* Search Bar */}
            <div ref={searchRef} className="relative">
              <div className="relative flex items-center">
                <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  type="text"
                  placeholder="Search players..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchOpen(true);
                  }}
                  onFocus={() => setIsSearchOpen(true)}
                  className="w-64 pl-9 pr-8 h-9 bg-background/50 border-border/50 focus:border-primary/50 transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setIsSearchOpen(false);
                    }}
                    className="absolute right-2 p-1 hover:bg-muted rounded-sm transition-colors"
                  >
                    <X className="h-3 w-3 text-muted-foreground" />
                  </button>
                )}
              </div>
              
              {isSearchOpen && (searchQuery || filteredPlayers.length > 0) && (
                <div className="absolute top-full mt-2 w-80 bg-card border border-border rounded-lg shadow-xl overflow-hidden z-50">
                  <div className="p-2 border-b border-border bg-muted/30">
                    <span className="text-xs font-display uppercase tracking-wider text-muted-foreground">
                      {searchQuery ? `${filteredPlayers.length} result${filteredPlayers.length !== 1 ? "s" : ""}` : "All Players"}
                    </span>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {filteredPlayers.length > 0 ? (
                      filteredPlayers.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => handlePlayerSelect(p)}
                          className={`w-full flex items-center gap-3 p-3 text-left hover:bg-muted/50 transition-colors ${
                            p.id === selectedPlayerId ? "bg-primary/10 border-l-2 border-primary" : ""
                          }`}
                        >
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                            <span className="font-display text-sm font-bold text-primary">
                              {p.name.split(" ").map((n) => n[0]).join("")}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-foreground truncate">{p.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {p.position} • {p.school} • {p.year}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-display text-primary">{p.stats.ppg} PPG</span>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="p-4 text-center">
                        <p className="text-sm text-muted-foreground">No players found</p>
                        <p className="text-xs text-muted-foreground mt-1">Try a different search term</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

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
