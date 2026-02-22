/**
 * Player API service — fetches from backend, falls back to mock data when backend unavailable.
 */

import { apiGet } from "./api";
import type { Player, NBAComparison, PlayerStats } from "@/data/playerData";
import { playerDatabase } from "@/data/playerData";

// Backend API response types
interface ArchetypeResponse {
  player: string;
  archetype: string;
  confidence: number;
  stats: Record<string, number>;
}

interface CompRecord {
  Player?: string;
  Team?: string;
  Pos?: string;
  PTS?: number;
  AST?: number;
  TRB?: number;
  MP?: number;
  similarity_score?: number;
}

const USE_MOCK = false; // Set to true to force mock data (e.g. when backend is down)

function slugify(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

function titleCase(str: string): string {
  return str.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
}

function mapArchetypeToPlayer(
  name: string,
  archetype: ArchetypeResponse,
  comps: CompRecord[]
): Player {
  const id = slugify(name);
  const statsData = archetype.stats || {};

  const gp = statsData.GP ?? 1;
  const stats: PlayerStats = {
    ppg: Math.round(((statsData.PTS ?? 0) / gp) * 10) / 10,
    rpg: Math.round(((statsData.TRB ?? 0) / gp) * 10) / 10,
    apg: Math.round(((statsData.AST ?? 0) / gp) * 10) / 10,
    spg: 0,
    bpg: 0,
    fgPct: Math.round((statsData.TS_per ?? 0) * 100) / 100,
    threePct: 0,
    ftPct: Math.round((statsData.TS_per ?? 0) * 100) / 100,
    topg: 0,
    mpg: Math.round((statsData.Min_per ?? 0) * 10) / 10,
  };

  const nbaComparisons: NBAComparison[] = comps
    .filter((c) => c.Player)
    .map((c, i) => ({
      name: c.Player!,
      team: c.Team ?? "Unknown",
      position: c.Pos ?? "—",
      matchScore: Math.round((c.similarity_score ?? 0.9 - i * 0.05) * 100),
      headshotUrl: `https://api.dicebear.com/7.x/avataaars/png?seed=${encodeURIComponent(c.Player!)}&backgroundColor=1e3a5f&radius=50`,
      similarities: [],
      differences: [],
      stats: {
        ppg: Math.round(((c.PTS ?? 0) / 82) * 10) / 10,
        rpg: Math.round(((c.TRB ?? 0) / 82) * 10) / 10,
        apg: Math.round(((c.AST ?? 0) / 82) * 10) / 10,
      },
    }));

  const confidencePercent = Math.round((archetype.confidence ?? 0) * 100);
  const topComp = nbaComparisons[0];

  return {
    id,
    name: titleCase(archetype.player),
    headshotUrl: `https://api.dicebear.com/7.x/avataaars/png?seed=${encodeURIComponent(id)}&backgroundColor=1e3a5f&radius=50`,
    school: "NCAA",
    year: "—",
    position: "—",
    height: "—",
    weight: "—",
    archetype: archetype.archetype,
    archetypeConfidence: confidencePercent,
    nbaComp: topComp?.name ?? "—",
    nbaComparisons,
    stats,
    careerOutcomes: [
      { outcome: "Quality Starter", probability: Math.min(40, confidencePercent), description: "Based on archetype fit" },
      { outcome: "Solid Rotation", probability: 30, description: "Rotation player potential" },
      { outcome: "Role Player", probability: 20, description: "Bench contributor" },
      { outcome: "Out of League", probability: Math.max(10, 100 - confidencePercent), description: "Exits within 5 seasons" },
    ],
    seasonLog: [{ season: "2024-25", ppg: stats.ppg, rpg: stats.rpg, apg: stats.apg, fgPct: stats.fgPct }],
    strengths: ["Archetype fit", "NBA comps identified"],
    weaknesses: [],
    draftabilityScore: confidencePercent,
  };
}

let cachedPlayers: Player[] | null = null;

/**
 * Fetch all players from backend. Falls back to mock data on error.
 */
export async function fetchPlayers(): Promise<Player[]> {
  if (USE_MOCK) return playerDatabase;

  if (cachedPlayers) return cachedPlayers;

  try {
    const names = await apiGet<string[]>("players");
    if (!names?.length) return playerDatabase;

    const players: Player[] = [];
    for (const name of names.slice(0, 50)) {
      try {
        const [archetype, comps] = await Promise.all([
          apiGet<ArchetypeResponse>(`archetype/${encodeURIComponent(name)}`),
          apiGet<CompRecord[]>(`comps/${encodeURIComponent(name)}`).catch(() => []),
        ]);
        players.push(mapArchetypeToPlayer(name, archetype, Array.isArray(comps) ? comps : []));
      } catch {
        // Skip player if archetype/comps fail
      }
    }

    if (players.length > 0) {
      cachedPlayers = players;
      return players;
    }
  } catch {
    // Fallback to mock data
  }

  return playerDatabase;
}

/**
 * Fetch a single player by ID (slug). Tries backend first, falls back to mock.
 */
export async function fetchPlayerById(id: string): Promise<Player | null> {
  if (USE_MOCK) {
    return playerDatabase.find((p) => p.id === id) ?? null;
  }

  const mockPlayer = playerDatabase.find((p) => p.id === id);
  const nameFromSlug = id.replace(/-/g, " ");

  const nameForApi = nameFromSlug.toLowerCase();

  try {
    const [archetype, comps] = await Promise.all([
      apiGet<ArchetypeResponse>(`archetype/${encodeURIComponent(nameForApi)}`).catch(() => null),
      apiGet<CompRecord[]>(`comps/${encodeURIComponent(nameForApi)}`).catch(() => []),
    ]);

    if (archetype) {
      return mapArchetypeToPlayer(
        archetype.player,
        archetype,
        Array.isArray(comps) ? comps : []
      );
    }
  } catch {
    // Fall through to mock
  }

  return mockPlayer ?? null;
}

/**
 * Get player by ID from a pre-fetched list, or fetch individually.
 */
export async function getPlayerById(id: string, fromList?: Player[]): Promise<Player | null> {
  if (fromList) {
    const found = fromList.find((p) => p.id === id);
    if (found) return found;
  }
  return fetchPlayerById(id);
}
