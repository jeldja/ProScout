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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X, SlidersHorizontal } from "lucide-react";

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard = ({ onLogout }: DashboardProps) => {
  const navigate = useNavigate();
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>(playerDatabase[0].id);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [collegeFilter, setCollegeFilter] = useState<string>("all");
  const [positionFilter, setPositionFilter] = useState<string>("all");
  const [minPPG, setMinPPG] = useState<string>("");
  const [minRPG, setMinRPG] = useState<string>("");
  const [minAPG, setMinAPG] = useState<string>("");
  const searchRef = useRef<HTMLDivElement>(null);

  const player = playerDatabase.find((p) => p.id === selectedPlayerId) || playerDatabase[0];

  const colleges = useMemo(() => {
    const uniqueColleges = [...new Set(playerDatabase.map((p) => p.school))];
    return uniqueColleges.sort();
  }, []);

  const positions = useMemo(() => {
    const uniquePositions = [...new Set(playerDatabase.map((p) => p.position))];
    return uniquePositions.sort();
  }, []);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (collegeFilter !== "all") count++;
    if (positionFilter !== "all") count++;
    if (minPPG) count++;
    if (minRPG) count++;
    if (minAPG) count++;
    return count;
  }, [collegeFilter, positionFilter, minPPG, minRPG, minAPG]);

  const filteredPlayers = useMemo(() => {
    return playerDatabase.filter((p) => {
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          p.name.toLowerCase().includes(query) ||
          p.school.toLowerCase().includes(query) ||
          p.position.toLowerCase().includes(query) ||
          p.archetype.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      if (collegeFilter !== "all" && p.school !== collegeFilter) return false;
      if (positionFilter !== "all" && p.position !== positionFilter) return false;
      if (minPPG && p.stats.ppg < parseFloat(minPPG)) return false;
      if (minRPG && p.stats.rpg < parseFloat(minRPG)) return false;
      if (minAPG && p.stats.apg < parseFloat(minAPG)) return false;

      return true;
    });
  }, [searchQuery, collegeFilter, positionFilter, minPPG, minRPG, minAPG]);

  const clearAllFilters = () => {
    setCollegeFilter("all");
    setPositionFilter("all");
    setMinPPG("");
    setMinRPG("");
    setMinAPG("");
    setSearchQuery("");
  };

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
            <div ref={searchRef} className="relative flex items-center gap-2">
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
              <Button
                variant={showFilters ? "default" : "outline"}
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="h-9 gap-1.5"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span className="hidden sm:inline">Filters</span>
                {activeFilterCount > 0 && (
                  <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
              
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

      {/* Filter Panel */}
      {showFilters && (
        <div className="border-b border-border bg-card/40 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-6 py-4">
            <div className="flex flex-wrap items-end gap-4">
              {/* College Filter */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-display uppercase tracking-wider text-muted-foreground">
                  College
                </label>
                <Select value={collegeFilter} onValueChange={setCollegeFilter}>
                  <SelectTrigger className="w-40 h-9 bg-background/50">
                    <SelectValue placeholder="All Colleges" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Colleges</SelectItem>
                    {colleges.map((college) => (
                      <SelectItem key={college} value={college}>
                        {college}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Position Filter */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-display uppercase tracking-wider text-muted-foreground">
                  Position
                </label>
                <Select value={positionFilter} onValueChange={setPositionFilter}>
                  <SelectTrigger className="w-32 h-9 bg-background/50">
                    <SelectValue placeholder="All Positions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Positions</SelectItem>
                    {positions.map((position) => (
                      <SelectItem key={position} value={position}>
                        {position}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Stat Filters */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-display uppercase tracking-wider text-muted-foreground">
                  Min PPG
                </label>
                <Input
                  type="number"
                  placeholder="0"
                  value={minPPG}
                  onChange={(e) => setMinPPG(e.target.value)}
                  className="w-20 h-9 bg-background/50"
                  min="0"
                  step="0.1"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-display uppercase tracking-wider text-muted-foreground">
                  Min RPG
                </label>
                <Input
                  type="number"
                  placeholder="0"
                  value={minRPG}
                  onChange={(e) => setMinRPG(e.target.value)}
                  className="w-20 h-9 bg-background/50"
                  min="0"
                  step="0.1"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-display uppercase tracking-wider text-muted-foreground">
                  Min APG
                </label>
                <Input
                  type="number"
                  placeholder="0"
                  value={minAPG}
                  onChange={(e) => setMinAPG(e.target.value)}
                  className="w-20 h-9 bg-background/50"
                  min="0"
                  step="0.1"
                />
              </div>

              {/* Clear Filters Button */}
              {activeFilterCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="h-9 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear All
                </Button>
              )}

              {/* Results Count */}
              <div className="ml-auto flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">{filteredPlayers.length}</span>
                  {" "}player{filteredPlayers.length !== 1 ? "s" : ""} found
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

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
            playerName={player.name}
            nbaComparisons={player.nbaComparisons}
          />

          {/* Scouting Notes */}
          <SkillTags strengths={player.strengths} weaknesses={player.weaknesses} />
        </div>

        {/* Career Outcomes */}
        <div className="glass-card-3d rounded-xl p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-display text-sm font-semibold uppercase tracking-widest text-muted-foreground">
              Career Outcome Projections
            </h2>
            <span className="rounded-lg bg-gradient-to-r from-primary/20 to-orange-500/20 px-4 py-1.5 font-display text-xs font-semibold text-primary border border-primary/30 shadow-lg shadow-primary/10">
              AI Model v3.2
            </span>
          </div>
          <div className="space-y-3">
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
