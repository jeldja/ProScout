import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { playerDatabase } from "@/data/playerData";
import PlayerCard from "@/components/PlayerCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { useSavedPlayersContext } from "@/contexts/SavedPlayersContext";
import { SlidersHorizontal, X } from "lucide-react";

const PER_PAGE = 10;

interface PlayersProps {
  onLogout?: () => void;
}

const Players = ({ onLogout }: PlayersProps) => {
  const { isSaved, toggleSaved } = useSavedPlayersContext();
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [collegeFilter, setCollegeFilter] = useState<string>("all");
  const [positionFilter, setPositionFilter] = useState<string>("all");

  const colleges = useMemo(() => {
    const unique = [...new Set(playerDatabase.map((p) => p.school))];
    return unique.sort();
  }, []);

  const positions = useMemo(() => {
    const unique = [...new Set(playerDatabase.map((p) => p.position))];
    return unique.sort();
  }, []);

  const filteredAndSortedPlayers = useMemo(() => {
    let list = [...playerDatabase];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.school.toLowerCase().includes(q) ||
          p.position.toLowerCase().includes(q) ||
          p.archetype.toLowerCase().includes(q)
      );
    }
    if (collegeFilter !== "all") {
      list = list.filter((p) => p.school === collegeFilter);
    }
    if (positionFilter !== "all") {
      list = list.filter((p) => p.position === positionFilter);
    }
    return list.sort((a, b) => b.draftabilityScore - a.draftabilityScore);
  }, [searchQuery, collegeFilter, positionFilter]);

  const totalPages = Math.ceil(filteredAndSortedPlayers.length / PER_PAGE) || 1;
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * PER_PAGE;
  const paginatedPlayers = filteredAndSortedPlayers.slice(start, start + PER_PAGE);

  const activeFilterCount = [collegeFilter !== "all", positionFilter !== "all"].filter(Boolean).length;

  const clearFilters = () => {
    setCollegeFilter("all");
    setPositionFilter("all");
    setSearchQuery("");
    setPage(1);
  };

  // Google-style pagination: 1 2 3 ... 10 Next
  const getPageNumbers = (): (number | "ellipsis")[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const result: (number | "ellipsis")[] = [1];
    const low = Math.max(2, currentPage - 1);
    const high = Math.min(totalPages - 1, currentPage + 1);
    if (low > 2) result.push("ellipsis");
    for (let i = low; i <= high; i++) result.push(i);
    if (high < totalPages - 1) result.push("ellipsis");
    if (totalPages > 1) result.push(totalPages);
    return result;
  };

  const pageNumbers = getPageNumbers();

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
            <Link to="/dashboard" className="font-display text-xs uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors">
              Dashboard
            </Link>
            <Link to="/players" className="font-display text-xs uppercase tracking-wider text-primary">
              Players
            </Link>
            {onLogout && (
              <Button variant="ghost" size="sm" onClick={onLogout} className="font-display text-xs uppercase tracking-wider text-muted-foreground hover:text-destructive">
                Sign Out
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Search + Filters */}
      <div className="border-b border-border bg-card/40 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Input
                type="text"
                placeholder="Search players by name, school, position..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="w-full max-w-md pl-3 pr-8 h-10 bg-background/50"
              />
              {searchQuery && (
                <button
                  onClick={() => { setSearchQuery(""); setPage(1); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              )}
            </div>
            <Button
              variant={showFilters ? "default" : "outline"}
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-1.5"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
            </Button>
            {activeFilterCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
                Clear filters
              </Button>
            )}
            <span className="text-sm text-muted-foreground ml-auto">
              <span className="font-semibold text-foreground">{filteredAndSortedPlayers.length}</span>{" "}
              player{filteredAndSortedPlayers.length !== 1 ? "s" : ""} • Sorted by draft score
            </span>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-border flex flex-wrap gap-4">
              <div>
                <label className="text-xs font-display uppercase tracking-wider text-muted-foreground block mb-1.5">
                  School
                </label>
                <Select value={collegeFilter} onValueChange={(v) => { setCollegeFilter(v); setPage(1); }}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All schools" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All schools</SelectItem>
                    {colleges.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-display uppercase tracking-wider text-muted-foreground block mb-1.5">
                  Position
                </label>
                <Select value={positionFilter} onValueChange={(v) => { setPositionFilter(v); setPage(1); }}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="All positions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All positions</SelectItem>
                    {positions.map((p) => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <header className="mb-6">
          <h1 className="font-display text-2xl font-bold text-foreground tracking-tight">
            NCAA Players
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Ranked by draftability score • 10 per page
          </p>
        </header>

        <div className="space-y-4">
          {paginatedPlayers.map((player, index) => (
            <PlayerCard
              key={player.id}
              player={player}
              rank={start + index + 1}
              isSaved={isSaved(player.id)}
              onToggleSave={toggleSaved}
            />
          ))}
        </div>

        {filteredAndSortedPlayers.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <p className="font-medium">No players found</p>
            <p className="text-sm mt-1">Try adjusting your filters or search</p>
            <Button variant="outline" className="mt-4" onClick={clearFilters}>
              Clear filters
            </Button>
          </div>
        )}

        {filteredAndSortedPlayers.length > 0 && totalPages > 1 && (
          <div className="mt-10 flex flex-col items-center gap-4">
            <p className="text-sm text-muted-foreground">
              Showing {start + 1}–{Math.min(start + PER_PAGE, filteredAndSortedPlayers.length)} of{" "}
              {filteredAndSortedPlayers.length} results
            </p>
            {/* Google-style pagination: Prev | 1 2 3 ... 10 | Next */}
            <Pagination className="flex-wrap justify-center">
              <PaginationContent className="gap-0">
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e: React.MouseEvent) => {
                      e.preventDefault();
                      if (currentPage > 1) setPage((p) => p - 1);
                    }}
                    className={
                      currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer min-w-[4rem]"
                    }
                  />
                </PaginationItem>
                {pageNumbers.map((num, i) =>
                  num === "ellipsis" ? (
                    <PaginationItem key={`ellipsis-${i}`}>
                      <PaginationEllipsis className="cursor-default" />
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={num}>
                      <PaginationLink
                        href="#"
                        onClick={(e: React.MouseEvent) => {
                          e.preventDefault();
                          setPage(num as number);
                        }}
                        isActive={currentPage === num}
                        className="cursor-pointer min-w-[2.25rem] justify-center font-medium"
                      >
                        {num}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e: React.MouseEvent) => {
                      e.preventDefault();
                      if (currentPage < totalPages) setPage((p) => p + 1);
                    }}
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer min-w-[4rem]"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </main>

      <footer className="border-t border-border py-6">
        <p className="text-center font-display text-xs uppercase tracking-widest text-muted-foreground">
          ProScout Analytics • 2026
        </p>
      </footer>
    </div>
  );
};

export default Players;
