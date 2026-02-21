export interface PlayerStats {
  ppg: number;
  rpg: number;
  apg: number;
  spg: number;
  bpg: number;
  fgPct: number;
  threePct: number;
  ftPct: number;
  topg: number;
  mpg: number;
}

export interface CareerOutcome {
  outcome: string;
  probability: number;
  description: string;
}

export interface SeasonLog {
  season: string;
  ppg: number;
  rpg: number;
  apg: number;
  fgPct: number;
}

export interface Player {
  id: string;
  name: string;
  school: string;
  year: string;
  position: string;
  height: string;
  weight: string;
  archetype: string;
  archetypeConfidence: number;
  nbaComp: string;
  stats: PlayerStats;
  careerOutcomes: CareerOutcome[];
  seasonLog: SeasonLog[];
  strengths: string[];
  weaknesses: string[];
}

export const playerDatabase: Player[] = [
  {
    id: "marcus-williams",
    name: "Marcus Williams",
    school: "Duke",
    year: "Junior",
    position: "PG",
    height: "6'3\"",
    weight: "185 lbs",
    archetype: "Point Guard Playmaker",
    archetypeConfidence: 87,
    nbaComp: "Malcolm Brogdon",
    stats: {
      ppg: 18.5,
      rpg: 3.8,
      apg: 7.2,
      spg: 1.4,
      bpg: 0.2,
      fgPct: 46.3,
      threePct: 38.7,
      ftPct: 84.2,
      topg: 2.1,
      mpg: 34.6,
    },
    careerOutcomes: [
      { outcome: "All-Star", probability: 12, description: "Multiple All-Star selections, franchise cornerstone" },
      { outcome: "Quality Starter", probability: 34, description: "Consistent starter averaging 14+ PPG for 8+ seasons" },
      { outcome: "Solid Rotation", probability: 28, description: "Reliable rotation player with 7+ year career" },
      { outcome: "Role Player", probability: 18, description: "Bench contributor with specific skill set" },
      { outcome: "Out of League", probability: 8, description: "Exits NBA within 3 seasons" },
    ],
    seasonLog: [
      { season: "2022-23", ppg: 10.2, rpg: 2.8, apg: 4.5, fgPct: 42.1 },
      { season: "2023-24", ppg: 14.8, rpg: 3.3, apg: 5.9, fgPct: 44.0 },
      { season: "2024-25", ppg: 18.5, rpg: 3.8, apg: 7.2, fgPct: 46.3 },
    ],
    strengths: ["Court vision", "Mid-range shooting", "Pick & roll management", "Free throw shooting"],
    weaknesses: ["Lateral quickness", "Finishing through contact", "Defensive consistency"],
  },
  {
    id: "jaylen-carter",
    name: "Jaylen Carter",
    school: "Kentucky",
    year: "Sophomore",
    position: "SG",
    height: "6'5\"",
    weight: "205 lbs",
    archetype: "Two-Way Wing",
    archetypeConfidence: 91,
    nbaComp: "Mikal Bridges",
    stats: {
      ppg: 16.8,
      rpg: 5.1,
      apg: 2.9,
      spg: 1.8,
      bpg: 0.6,
      fgPct: 47.8,
      threePct: 36.2,
      ftPct: 79.5,
      topg: 1.6,
      mpg: 33.2,
    },
    careerOutcomes: [
      { outcome: "All-Star", probability: 18, description: "Elite two-way player, defensive anchor" },
      { outcome: "Quality Starter", probability: 38, description: "Starting-caliber wing on a playoff team" },
      { outcome: "Solid Rotation", probability: 25, description: "Switchable defender off the bench" },
      { outcome: "Role Player", probability: 14, description: "3&D specialist" },
      { outcome: "Out of League", probability: 5, description: "Exits NBA within 3 seasons" },
    ],
    seasonLog: [
      { season: "2023-24", ppg: 12.3, rpg: 4.2, apg: 1.8, fgPct: 44.5 },
      { season: "2024-25", ppg: 16.8, rpg: 5.1, apg: 2.9, fgPct: 47.8 },
    ],
    strengths: ["Perimeter defense", "Transition offense", "Athleticism", "Wingspan"],
    weaknesses: ["Ball handling", "Off-dribble creation", "Free throw shooting"],
  },
];
