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

export interface NBAComparison {
  name: string;
  team: string;
  position: string;
  matchScore: number;
  headshotUrl: string;
  similarities: string[];
  differences: string[];
  stats: {
    ppg: number;
    rpg: number;
    apg: number;
  };
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
  nbaComparisons: NBAComparison[];
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
    nbaComparisons: [
      {
        name: "Malcolm Brogdon",
        team: "Washington Wizards",
        position: "PG",
        matchScore: 87,
        headshotUrl: "https://cdn.nba.com/headshots/nba/latest/1040x760/1627763.png",
        similarities: ["High basketball IQ", "Efficient mid-range game", "Strong free throw shooting", "Solid playmaking ability"],
        differences: ["Brogdon is more physical defender", "Williams has quicker first step", "Brogdon more experienced in pick-and-roll"],
        stats: { ppg: 15.7, rpg: 4.5, apg: 5.8 }
      },
      {
        name: "Tyrese Haliburton",
        team: "Indiana Pacers",
        position: "PG",
        matchScore: 82,
        headshotUrl: "https://cdn.nba.com/headshots/nba/latest/1040x760/1630169.png",
        similarities: ["Elite court vision", "Smart decision maker", "Efficient shooter", "Pass-first mentality"],
        differences: ["Haliburton has longer wingspan", "Williams more aggressive scorer", "Haliburton better in transition"],
        stats: { ppg: 20.1, rpg: 3.9, apg: 10.9 }
      },
      {
        name: "Jalen Brunson",
        team: "New York Knicks",
        position: "PG",
        matchScore: 78,
        headshotUrl: "https://cdn.nba.com/headshots/nba/latest/1040x760/1628973.png",
        similarities: ["Tough shot maker", "Strong in clutch", "Mid-range specialist", "High motor player"],
        differences: ["Brunson more physical", "Williams taller", "Brunson more proven playoff performer"],
        stats: { ppg: 28.7, rpg: 3.6, apg: 6.7 }
      },
      {
        name: "Fred VanVleet",
        team: "Houston Rockets",
        position: "PG",
        matchScore: 74,
        headshotUrl: "https://cdn.nba.com/headshots/nba/latest/1040x760/1627832.png",
        similarities: ["Defensive effort", "Three-point shooting", "Leadership qualities", "Competitive spirit"],
        differences: ["VanVleet more tenacious defender", "Williams better finisher", "VanVleet more experienced"],
        stats: { ppg: 17.1, rpg: 3.8, apg: 7.2 }
      },
      {
        name: "Derrick White",
        team: "Boston Celtics",
        position: "PG/SG",
        matchScore: 71,
        headshotUrl: "https://cdn.nba.com/headshots/nba/latest/1040x760/1628401.png",
        similarities: ["Two-way potential", "Smart defender", "Team-first mentality", "Solid shooter"],
        differences: ["White is elite shot blocker for guard", "Williams better passer", "White more versatile defensively"],
        stats: { ppg: 15.2, rpg: 4.2, apg: 5.2 }
      }
    ],
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
    nbaComparisons: [
      {
        name: "Mikal Bridges",
        team: "New York Knicks",
        position: "SF",
        matchScore: 91,
        headshotUrl: "https://cdn.nba.com/headshots/nba/latest/1040x760/1628969.png",
        similarities: ["Elite perimeter defender", "High motor", "Excellent wingspan", "Consistent three-point shooter"],
        differences: ["Bridges more polished", "Carter more explosive athlete", "Bridges better off-ball movement"],
        stats: { ppg: 19.6, rpg: 4.5, apg: 3.6 }
      },
      {
        name: "Herb Jones",
        team: "New Orleans Pelicans",
        position: "SF",
        matchScore: 86,
        headshotUrl: "https://cdn.nba.com/headshots/nba/latest/1040x760/1630537.png",
        similarities: ["Lockdown defender", "Versatile on both ends", "High effort player", "Team-first attitude"],
        differences: ["Jones more physical", "Carter better shooter", "Jones more switchable"],
        stats: { ppg: 11.2, rpg: 3.8, apg: 2.1 }
      },
      {
        name: "OG Anunoby",
        team: "New York Knicks",
        position: "SF",
        matchScore: 83,
        headshotUrl: "https://cdn.nba.com/headshots/nba/latest/1040x760/1628384.png",
        similarities: ["Elite wing defender", "Strong build", "Improving offensive game", "Reliable three-point shot"],
        differences: ["Anunoby stronger", "Carter quicker laterally", "Anunoby more experienced"],
        stats: { ppg: 14.1, rpg: 4.4, apg: 2.1 }
      },
      {
        name: "Jalen Williams",
        team: "Oklahoma City Thunder",
        position: "SG/SF",
        matchScore: 79,
        headshotUrl: "https://cdn.nba.com/headshots/nba/latest/1040x760/1631114.png",
        similarities: ["Two-way versatility", "Long wingspan", "Improving playmaker", "Smart defender"],
        differences: ["Williams better ball handler", "Carter more athletic", "Williams more creative scorer"],
        stats: { ppg: 19.1, rpg: 4.5, apg: 5.1 }
      },
      {
        name: "Cam Johnson",
        team: "Brooklyn Nets",
        position: "SF",
        matchScore: 75,
        headshotUrl: "https://cdn.nba.com/headshots/nba/latest/1040x760/1629661.png",
        similarities: ["Knockdown shooter", "Solid defender", "Good size", "Low turnover player"],
        differences: ["Johnson better shooter", "Carter more athletic", "Johnson more off-ball oriented"],
        stats: { ppg: 13.4, rpg: 4.3, apg: 2.4 }
      }
    ],
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
