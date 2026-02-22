/**
 * Player API service — fetches from backend /player endpoint, falls back to mock when unavailable.
 */

import { apiGet } from "./api";
import type { Player } from "@/data/playerData";
import { playerDatabase } from "@/data/playerData";

const USE_MOCK = false; // Set to true to force mock data (e.g. when backend is down)

let cachedPlayers: Player[] | null = null;

/**
 * Convert slug (marcus-williams) to API-friendly name (marcus williams)
 */
function slugToName(slug: string): string {
  return decodeURIComponent(slug).replace(/-/g, " ");
}

/**
 * Normalize backend response to Player type (handles both formats)
 */
function normalizePlayer(p: Record<string, unknown>): Player {
  const conf = p.archetypeConfidence as number;
  const outcomes = (p.careerOutcomes as Array<{ outcome: string; probability: number; description: string }>) || [];
  return {
    id: String(p.id ?? ""),
    name: String(p.name ?? ""),
    headshotUrl: String(p.headshotUrl ?? ""),
    school: String(p.school ?? ""),
    year: String(p.year ?? ""),
    position: String(p.position ?? ""),
    height: String(p.height ?? ""),
    weight: String(p.weight ?? ""),
    archetype: String(p.archetype ?? ""),
    archetypeConfidence: typeof conf === "number" ? (conf <= 1 ? conf * 100 : conf) : 0,
    nbaComp: String(p.nbaComp ?? ""),
    nbaComparisons: Array.isArray(p.nbaComparisons) ? (p.nbaComparisons as Player["nbaComparisons"]) : [],
    stats: (p.stats as Player["stats"]) ?? {
      ppg: 0, rpg: 0, apg: 0, spg: 0, bpg: 0,
      fgPct: 0, threePct: 0, ftPct: 0, topg: 0, mpg: 0,
    },
    careerOutcomes: outcomes.map((o) => ({
      outcome: o.outcome,
      probability: typeof o.probability === "number" ? (o.probability <= 1 ? o.probability * 100 : o.probability) : 0,
      description: o.description ?? "",
    })),
    seasonLog: Array.isArray(p.seasonLog) ? (p.seasonLog as Player["seasonLog"]) : [],
    strengths: Array.isArray(p.strengths) ? (p.strengths as string[]) : [],
    weaknesses: Array.isArray(p.weaknesses) ? (p.weaknesses as string[]) : [],
    draftabilityScore: Number(p.draftabilityScore ?? 0),
  };
}

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
    const toFetch = names;

    for (const name of toFetch) {
      try {
        const nameForApi = typeof name === "string" ? name : String(name);
        const res = await apiGet<Record<string, unknown>>(
          `player/${encodeURIComponent(nameForApi.replace(/\s+/g, "-"))}`
        );
        if (res && res.id) players.push(normalizePlayer(res));
      } catch {
        // Skip player if fetch fails
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
  const nameForApi = slugToName(id);

  try {
    const res = await apiGet<Record<string, unknown>>(
      `player/${encodeURIComponent(nameForApi.replace(/\s+/g, "-"))}`
    );
    if (res && res.id) return normalizePlayer(res);
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
