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

/** Projected NBA peak stats from draftability model */
export interface CareerProjections {
  peak_bpm: number;
  peak_vorp: number;
  peak_pts: number;
  peak_mp: number;
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
  headshotUrl: string;
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
  careerProjections?: CareerProjections | null;
  seasonLog: SeasonLog[];
  strengths: string[];
  weaknesses: string[];
  draftabilityScore: number;
}

export const playerDatabase: Player[] = [
  {
    id: "marcus-williams",
    name: "Marcus Williams",
    headshotUrl: "https://api.dicebear.com/7.x/avataaars/png?seed=marcus-williams&backgroundColor=1e3a5f&radius=50",
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
    careerProjections: { peak_bpm: 2.4, peak_vorp: 1.8, peak_pts: 16.2, peak_mp: 2100 },
    seasonLog: [
      { season: "2022-23", ppg: 10.2, rpg: 2.8, apg: 4.5, fgPct: 42.1 },
      { season: "2023-24", ppg: 14.8, rpg: 3.3, apg: 5.9, fgPct: 44.0 },
      { season: "2024-25", ppg: 18.5, rpg: 3.8, apg: 7.2, fgPct: 46.3 },
    ],
    strengths: ["Court vision", "Mid-range shooting", "Pick & roll management", "Free throw shooting"],
    weaknesses: ["Lateral quickness", "Finishing through contact", "Defensive consistency"],
    draftabilityScore: 78,
  },
  {
    id: "jaylen-carter",
    name: "Jaylen Carter",
    headshotUrl: "https://api.dicebear.com/7.x/avataaars/png?seed=jaylen-carter&backgroundColor=1e3a5f&radius=50",
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
    draftabilityScore: 85,
  },
  {
    id: "tyler-adams",
    name: "Tyler Adams",
    headshotUrl: "https://api.dicebear.com/7.x/avataaars/png?seed=tyler-adams&backgroundColor=1e3a5f&radius=50",
    school: "Duke",
    year: "Freshman",
    position: "PF",
    height: "6'9\"",
    weight: "235 lbs",
    archetype: "Stretch Four",
    archetypeConfidence: 79,
    nbaComp: "Pascal Siakam",
    nbaComparisons: [
      { name: "Pascal Siakam", team: "Indiana Pacers", position: "PF", matchScore: 79, headshotUrl: "https://cdn.nba.com/headshots/nba/latest/1040x760/1627783.png", similarities: ["Versatile scoring", "Face-up game"], differences: ["Siakam more polished"], stats: { ppg: 22.1, rpg: 7.2, apg: 4.8 } },
      { name: "Scottie Barnes", team: "Toronto Raptors", position: "PF", matchScore: 75, headshotUrl: "https://cdn.nba.com/headshots/nba/latest/1040x760/1630567.png", similarities: ["Ball handling", "Passing"], differences: ["Barnes stronger"], stats: { ppg: 19.9, rpg: 8.2, apg: 6.1 } },
      { name: "Evan Mobley", team: "Cleveland Cavaliers", position: "C", matchScore: 72, headshotUrl: "https://cdn.nba.com/headshots/nba/latest/1040x760/1630596.png", similarities: ["Rim protection", "Mobility"], differences: ["Mobley taller"], stats: { ppg: 16.2, rpg: 9.4, apg: 3.2 } },
      { name: "Jabari Smith Jr.", team: "Houston Rockets", position: "PF", matchScore: 70, headshotUrl: "https://cdn.nba.com/headshots/nba/latest/1040x760/1631096.png", similarities: ["Shooting", "Defense"], differences: ["Smith better shooter"], stats: { ppg: 13.7, rpg: 8.1, apg: 1.5 } },
      { name: "Paolo Banchero", team: "Orlando Magic", position: "PF", matchScore: 68, headshotUrl: "https://cdn.nba.com/headshots/nba/latest/1040x760/1631094.png", similarities: ["Scoring versatility"], differences: ["Banchero stronger"], stats: { ppg: 22.6, rpg: 6.9, apg: 5.4 } },
    ],
    stats: { ppg: 15.2, rpg: 8.1, apg: 2.4, spg: 0.9, bpg: 1.2, fgPct: 48.2, threePct: 34.1, ftPct: 72.5, topg: 1.8, mpg: 28.4 },
    careerOutcomes: [
      { outcome: "All-Star", probability: 8, description: "Elite stretch big" },
      { outcome: "Quality Starter", probability: 35, description: "Starting-caliber power forward" },
      { outcome: "Solid Rotation", probability: 32, description: "Reliable rotation big" },
      { outcome: "Role Player", probability: 20, description: "Stretch four off bench" },
      { outcome: "Out of League", probability: 5, description: "Exits NBA within 3 seasons" },
    ],
    seasonLog: [{ season: "2024-25", ppg: 15.2, rpg: 8.1, apg: 2.4, fgPct: 48.2 }],
    strengths: ["Shooting from mid-range", "Rebounding", "Switchability"],
    weaknesses: ["Post defense", "Free throw consistency"],
    draftabilityScore: 82,
  },
  {
    id: "emmanuel-okeke",
    name: "Emmanuel Okeke",
    headshotUrl: "https://api.dicebear.com/7.x/avataaars/png?seed=emmanuel-okeke&backgroundColor=1e3a5f&radius=50",
    school: "Kansas",
    year: "Senior",
    position: "C",
    height: "7'0\"",
    weight: "250 lbs",
    archetype: "Rim Runner",
    archetypeConfidence: 85,
    nbaComp: "Walker Kessler",
    nbaComparisons: [
      { name: "Walker Kessler", team: "Utah Jazz", position: "C", matchScore: 85, headshotUrl: "https://cdn.nba.com/headshots/nba/latest/1040x760/1631117.png", similarities: ["Rim protection", "P&R finishing"], differences: ["Kessler more refined"], stats: { ppg: 9.2, rpg: 8.4, apg: 1.1 } },
      { name: "Clint Capela", team: "Atlanta Hawks", position: "C", matchScore: 80, headshotUrl: "https://cdn.nba.com/headshots/nba/latest/1040x760/203991.png", similarities: ["Lob threat", "Shot blocking"], differences: ["Capela more athletic"], stats: { ppg: 11.5, rpg: 10.6, apg: 1.2 } },
      { name: "Daniel Gafford", team: "Dallas Mavericks", position: "C", matchScore: 78, headshotUrl: "https://cdn.nba.com/headshots/nba/latest/1040x760/1629655.png", similarities: ["Energy", "Finishing"], differences: ["Gafford quicker"], stats: { ppg: 10.9, rpg: 6.0, apg: 1.4 } },
      { name: "Ivica Zubac", team: "Los Angeles Clippers", position: "C", matchScore: 74, headshotUrl: "https://cdn.nba.com/headshots/nba/latest/1040x760/1627826.png", similarities: ["Size", "Rebounding"], differences: ["Zubac stronger"], stats: { ppg: 11.7, rpg: 9.2, apg: 1.3 } },
      { name: "Jarrett Allen", team: "Cleveland Cavaliers", position: "C", matchScore: 71, headshotUrl: "https://cdn.nba.com/headshots/nba/latest/1040x760/1628386.png", similarities: ["Rim running"], differences: ["Allen more skilled"], stats: { ppg: 16.5, rpg: 10.9, apg: 1.7 } },
    ],
    stats: { ppg: 12.1, rpg: 9.8, apg: 1.2, spg: 0.5, bpg: 2.4, fgPct: 64.2, threePct: 0, ftPct: 58.3, topg: 1.4, mpg: 26.2 },
    careerOutcomes: [
      { outcome: "All-Star", probability: 5, description: "Elite rim protector" },
      { outcome: "Quality Starter", probability: 28, description: "Starting center" },
      { outcome: "Solid Rotation", probability: 38, description: "Backup big" },
      { outcome: "Role Player", probability: 22, description: "Rim runner specialist" },
      { outcome: "Out of League", probability: 7, description: "Exits NBA within 3 seasons" },
    ],
    seasonLog: [
      { season: "2021-22", ppg: 6.2, rpg: 5.1, apg: 0.8, fgPct: 58.2 },
      { season: "2022-23", ppg: 8.4, rpg: 6.8, apg: 1.0, fgPct: 61.5 },
      { season: "2023-24", ppg: 10.2, rpg: 8.2, apg: 1.1, fgPct: 62.8 },
      { season: "2024-25", ppg: 12.1, rpg: 9.8, apg: 1.2, fgPct: 64.2 },
    ],
    strengths: ["Shot blocking", "Rim running", "Rebounding", "Size"],
    weaknesses: ["Shooting range", "Free throw shooting", "Ball handling"],
    draftabilityScore: 72,
  },
  {
    id: "derek-johnson",
    name: "Derek Johnson",
    headshotUrl: "https://api.dicebear.com/7.x/avataaars/png?seed=derek-johnson&backgroundColor=1e3a5f&radius=50",
    school: "Duke",
    year: "Sophomore",
    position: "SG",
    height: "6'4\"",
    weight: "198 lbs",
    archetype: "3&D Wing",
    archetypeConfidence: 82,
    nbaComp: "Gary Trent Jr.",
    nbaComparisons: [
      { name: "Gary Trent Jr.", team: "Toronto Raptors", position: "SG", matchScore: 82, headshotUrl: "https://cdn.nba.com/headshots/nba/latest/1040x760/1629018.png", similarities: ["Three-point shooting", "Defensive effort"], differences: ["Trent more experienced"], stats: { ppg: 13.3, rpg: 2.4, apg: 1.5 } },
      { name: "Kentavious Caldwell-Pope", team: "Denver Nuggets", position: "SG", matchScore: 78, headshotUrl: "https://cdn.nba.com/headshots/nba/latest/1040x760/203484.png", similarities: ["3&D role", "Reliability"], differences: ["KCP stronger"], stats: { ppg: 10.1, rpg: 2.4, apg: 2.1 } },
      { name: "Duncan Robinson", team: "Miami Heat", position: "SF", matchScore: 74, headshotUrl: "https://cdn.nba.com/headshots/nba/latest/1040x760/1629130.png", similarities: ["Shooting"], differences: ["Robinson purer shooter"], stats: { ppg: 12.9, rpg: 2.6, apg: 2.2 } },
      { name: "Luke Kennard", team: "Memphis Grizzlies", position: "SG", matchScore: 71, headshotUrl: "https://cdn.nba.com/headshots/nba/latest/1040x760/1628379.png", similarities: ["Elite shooting"], differences: ["Kennard better creator"], stats: { ppg: 11.0, rpg: 2.5, apg: 2.9 } },
      { name: "Max Strus", team: "Cleveland Cavaliers", position: "SG", matchScore: 69, headshotUrl: "https://cdn.nba.com/headshots/nba/latest/1040x760/1629312.png", similarities: ["Catch-and-shoot"], differences: ["Strus more movement"], stats: { ppg: 12.2, rpg: 2.8, apg: 2.1 } },
    ],
    stats: { ppg: 11.4, rpg: 3.2, apg: 1.8, spg: 1.2, bpg: 0.3, fgPct: 43.5, threePct: 39.2, ftPct: 81.2, topg: 1.2, mpg: 27.8 },
    careerOutcomes: [
      { outcome: "All-Star", probability: 4, description: "Elite 3&D" },
      { outcome: "Quality Starter", probability: 25, description: "Starting wing" },
      { outcome: "Solid Rotation", probability: 35, description: "Bench shooter" },
      { outcome: "Role Player", probability: 28, description: "Specialist" },
      { outcome: "Out of League", probability: 8, description: "Exits NBA within 3 seasons" },
    ],
    seasonLog: [
      { season: "2023-24", ppg: 7.8, rpg: 2.4, apg: 1.2, fgPct: 40.2 },
      { season: "2024-25", ppg: 11.4, rpg: 3.2, apg: 1.8, fgPct: 43.5 },
    ],
    strengths: ["Three-point shooting", "Defensive effort", "Off-ball movement"],
    weaknesses: ["Ball handling", "Creating offense", "Finishing"],
    draftabilityScore: 68,
  },
  {
    id: "james-mitchell",
    name: "James Mitchell",
    headshotUrl: "https://api.dicebear.com/7.x/avataaars/png?seed=james-mitchell&backgroundColor=1e3a5f&radius=50",
    school: "North Carolina",
    year: "Junior",
    position: "SF",
    height: "6'7\"",
    weight: "215 lbs",
    archetype: "Combo Forward",
    archetypeConfidence: 76,
    nbaComp: "Trey Murphy III",
    nbaComparisons: [
      { name: "Trey Murphy III", team: "New Orleans Pelicans", position: "SF", matchScore: 76, headshotUrl: "https://cdn.nba.com/headshots/nba/latest/1040x760/1630530.png", similarities: ["Size", "Shooting", "Athleticism"], differences: ["Murphy more explosive"], stats: { ppg: 14.8, rpg: 4.9, apg: 2.2 } },
      { name: "Franz Wagner", team: "Orlando Magic", position: "SF", matchScore: 73, headshotUrl: "https://cdn.nba.com/headshots/nba/latest/1040x760/1630532.png", similarities: ["Versatility", "Size"], differences: ["Wagner better creator"], stats: { ppg: 19.1, rpg: 5.6, apg: 3.9 } },
      { name: "Bojan Bogdanovic", team: "New York Knicks", position: "SF", matchScore: 70, headshotUrl: "https://cdn.nba.com/headshots/nba/latest/1040x760/202711.png", similarities: ["Scoring"], differences: ["Bogdanovic purer shooter"], stats: { ppg: 12.8, rpg: 3.2, apg: 1.8 } },
      { name: "Harrison Barnes", team: "Sacramento Kings", position: "SF", matchScore: 67, headshotUrl: "https://cdn.nba.com/headshots/nba/latest/1040x760/203084.png", similarities: ["Reliability"], differences: ["Barnes more experienced"], stats: { ppg: 12.2, rpg: 3.0, apg: 1.8 } },
      { name: "Kevin Huerter", team: "Sacramento Kings", position: "SG", matchScore: 65, headshotUrl: "https://cdn.nba.com/headshots/nba/latest/1040x760/1628983.png", similarities: ["Shooting", "Passing"], differences: ["Huerter better passer"], stats: { ppg: 10.2, rpg: 3.5, apg: 2.6 } },
    ],
    stats: { ppg: 14.2, rpg: 5.4, apg: 2.8, spg: 1.0, bpg: 0.4, fgPct: 45.8, threePct: 36.5, ftPct: 77.8, topg: 1.6, mpg: 30.2 },
    careerOutcomes: [
      { outcome: "All-Star", probability: 6, description: "Elite versatile forward" },
      { outcome: "Quality Starter", probability: 30, description: "Starting forward" },
      { outcome: "Solid Rotation", probability: 32, description: "Versatile bench piece" },
      { outcome: "Role Player", probability: 26, description: "Role player" },
      { outcome: "Out of League", probability: 6, description: "Exits NBA within 3 seasons" },
    ],
    seasonLog: [
      { season: "2022-23", ppg: 8.2, rpg: 3.4, apg: 1.5, fgPct: 42.1 },
      { season: "2023-24", ppg: 11.5, rpg: 4.5, apg: 2.2, fgPct: 44.2 },
      { season: "2024-25", ppg: 14.2, rpg: 5.4, apg: 2.8, fgPct: 45.8 },
    ],
    strengths: ["Versatility", "Mid-range game", "Defensive switchability"],
    weaknesses: ["Explosiveness", "Three-point volume", "Playmaking"],
    draftabilityScore: 74,
  },
  // --- 14 more dummy players for pagination (20 total) ---
  {
    id: "brandon-hayes",
    name: "Brandon Hayes",
    headshotUrl: "https://api.dicebear.com/7.x/avataaars/png?seed=brandon-hayes&backgroundColor=1e3a5f&radius=50",
    school: "UCLA",
    year: "Junior",
    position: "PG",
    height: "6'2\"",
    weight: "190 lbs",
    archetype: "Score-First Guard",
    archetypeConfidence: 81,
    nbaComp: "Collin Sexton",
    nbaComparisons: [
      { name: "Collin Sexton", team: "Utah Jazz", position: "PG", matchScore: 81, headshotUrl: "https://cdn.nba.com/headshots/nba/latest/1040x760/1629012.png", similarities: ["Aggressive scorer", "Speed"], differences: ["Sexton more polished"], stats: { ppg: 18.7, rpg: 2.6, apg: 4.9 } },
      { name: "Anfernee Simons", team: "Portland Trail Blazers", position: "SG", matchScore: 77, headshotUrl: "https://cdn.nba.com/headshots/nba/latest/1040x760/1629014.png", similarities: ["Shooting", "Athleticism"], differences: ["Simons better shooter"], stats: { ppg: 22.9, rpg: 3.5, apg: 5.8 } },
    ],
    stats: { ppg: 17.2, rpg: 3.1, apg: 5.4, spg: 1.3, bpg: 0.1, fgPct: 44.8, threePct: 35.2, ftPct: 82.1, topg: 2.4, mpg: 32.1 },
    careerOutcomes: [
      { outcome: "All-Star", probability: 10, description: "Elite scorer" },
      { outcome: "Quality Starter", probability: 32, description: "Starting guard" },
      { outcome: "Solid Rotation", probability: 30, description: "Bench scorer" },
      { outcome: "Role Player", probability: 20, description: "Scoring specialist" },
      { outcome: "Out of League", probability: 8, description: "Exits NBA within 3 seasons" },
    ],
    seasonLog: [
      { season: "2022-23", ppg: 9.1, rpg: 2.2, apg: 3.2, fgPct: 41.2 },
      { season: "2023-24", ppg: 13.4, rpg: 2.8, apg: 4.5, fgPct: 43.1 },
      { season: "2024-25", ppg: 17.2, rpg: 3.1, apg: 5.4, fgPct: 44.8 },
    ],
    strengths: ["Scoring", "Speed", "Free throw shooting"],
    weaknesses: ["Playmaking", "Defense", "Efficiency"],
    draftabilityScore: 76,
  },
  {
    id: "isaiah-coleman",
    name: "Isaiah Coleman",
    headshotUrl: "https://api.dicebear.com/7.x/avataaars/png?seed=isaiah-coleman&backgroundColor=1e3a5f&radius=50",
    school: "Villanova",
    year: "Sophomore",
    position: "SG",
    height: "6'6\"",
    weight: "210 lbs",
    archetype: "Wing Scorer",
    archetypeConfidence: 78,
    nbaComp: "Devin Vassell",
    nbaComparisons: [
      { name: "Devin Vassell", team: "San Antonio Spurs", position: "SG", matchScore: 78, headshotUrl: "https://cdn.nba.com/headshots/nba/latest/1040x760/1630170.png", similarities: ["Length", "Shooting"], differences: ["Vassell more polished"], stats: { ppg: 19.5, rpg: 3.8, apg: 3.6 } },
    ],
    stats: { ppg: 15.6, rpg: 4.2, apg: 2.6, spg: 1.4, bpg: 0.5, fgPct: 46.2, threePct: 37.8, ftPct: 80.5, topg: 1.5, mpg: 31.4 },
    careerOutcomes: [
      { outcome: "All-Star", probability: 8, description: "Elite wing" },
      { outcome: "Quality Starter", probability: 35, description: "Starting wing" },
      { outcome: "Solid Rotation", probability: 30, description: "Bench wing" },
      { outcome: "Role Player", probability: 20, description: "Wing specialist" },
      { outcome: "Out of League", probability: 7, description: "Exits NBA within 3 seasons" },
    ],
    seasonLog: [
      { season: "2023-24", ppg: 10.2, rpg: 3.1, apg: 1.8, fgPct: 43.2 },
      { season: "2024-25", ppg: 15.6, rpg: 4.2, apg: 2.6, fgPct: 46.2 },
    ],
    strengths: ["Shooting", "Length", "Defensive potential"],
    weaknesses: ["Ball handling", "Creating for others"],
    draftabilityScore: 75,
  },
  {
    id: "marcus-thompson",
    name: "Marcus Thompson",
    headshotUrl: "https://api.dicebear.com/7.x/avataaars/png?seed=marcus-thompson&backgroundColor=1e3a5f&radius=50",
    school: "Michigan State",
    year: "Senior",
    position: "PF",
    height: "6'8\"",
    weight: "228 lbs",
    archetype: "Energy Big",
    archetypeConfidence: 74,
    nbaComp: "Jeremiah Robinson-Earl",
    nbaComparisons: [
      { name: "Jeremiah Robinson-Earl", team: "New Orleans Pelicans", position: "PF", matchScore: 74, headshotUrl: "https://cdn.nba.com/headshots/nba/latest/1040x760/1630526.png", similarities: ["Motor", "Rebounding"], differences: ["JRE more skilled"], stats: { ppg: 7.2, rpg: 5.1, apg: 1.4 } },
    ],
    stats: { ppg: 11.8, rpg: 7.4, apg: 1.9, spg: 0.8, bpg: 0.9, fgPct: 52.1, threePct: 31.2, ftPct: 69.4, topg: 1.3, mpg: 26.8 },
    careerOutcomes: [
      { outcome: "All-Star", probability: 3, description: "Elite energy big" },
      { outcome: "Quality Starter", probability: 22, description: "Starting forward" },
      { outcome: "Solid Rotation", probability: 40, description: "Bench big" },
      { outcome: "Role Player", probability: 28, description: "Energy specialist" },
      { outcome: "Out of League", probability: 7, description: "Exits NBA within 3 seasons" },
    ],
    seasonLog: [
      { season: "2021-22", ppg: 4.2, rpg: 3.2, apg: 0.8, fgPct: 48.2 },
      { season: "2022-23", ppg: 7.1, rpg: 5.1, apg: 1.2, fgPct: 50.1 },
      { season: "2023-24", ppg: 9.5, rpg: 6.2, apg: 1.5, fgPct: 51.2 },
      { season: "2024-25", ppg: 11.8, rpg: 7.4, apg: 1.9, fgPct: 52.1 },
    ],
    strengths: ["Rebounding", "Motor", "Screen setting"],
    weaknesses: ["Shooting", "Post game", "Shot creation"],
    draftabilityScore: 71,
  },
  {
    id: "jordan-rivers",
    name: "Jordan Rivers",
    headshotUrl: "https://api.dicebear.com/7.x/avataaars/png?seed=jordan-rivers&backgroundColor=1e3a5f&radius=50",
    school: "Arizona",
    year: "Freshman",
    position: "SF",
    height: "6'7\"",
    weight: "218 lbs",
    archetype: "Slasher",
    archetypeConfidence: 77,
    nbaComp: "Jalen Johnson",
    nbaComparisons: [
      { name: "Jalen Johnson", team: "Atlanta Hawks", position: "SF", matchScore: 77, headshotUrl: "https://cdn.nba.com/headshots/nba/latest/1040x760/1630552.png", similarities: ["Athleticism", "Finishing"], differences: ["Johnson more polished"], stats: { ppg: 16.1, rpg: 8.7, apg: 3.6 } },
    ],
    stats: { ppg: 13.4, rpg: 5.8, apg: 2.2, spg: 1.1, bpg: 0.6, fgPct: 48.5, threePct: 32.1, ftPct: 74.2, topg: 1.7, mpg: 28.2 },
    careerOutcomes: [
      { outcome: "All-Star", probability: 7, description: "Elite wing" },
      { outcome: "Quality Starter", probability: 32, description: "Starting forward" },
      { outcome: "Solid Rotation", probability: 33, description: "Bench wing" },
      { outcome: "Role Player", probability: 21, description: "Athletic specialist" },
      { outcome: "Out of League", probability: 7, description: "Exits NBA within 3 seasons" },
    ],
    seasonLog: [{ season: "2024-25", ppg: 13.4, rpg: 5.8, apg: 2.2, fgPct: 48.5 }],
    strengths: ["Athleticism", "Finishing", "Transition"],
    weaknesses: ["Shooting", "Half-court creation"],
    draftabilityScore: 73,
  },
  {
    id: "aaron-brooks",
    name: "Aaron Brooks",
    headshotUrl: "https://api.dicebear.com/7.x/avataaars/png?seed=aaron-brooks-2&backgroundColor=1e3a5f&radius=50",
    school: "Gonzaga",
    year: "Junior",
    position: "C",
    height: "6'11\"",
    weight: "245 lbs",
    archetype: "Traditional Big",
    archetypeConfidence: 72,
    nbaComp: "Drew Eubanks",
    nbaComparisons: [
      { name: "Drew Eubanks", team: "Phoenix Suns", position: "C", matchScore: 72, headshotUrl: "https://cdn.nba.com/headshots/nba/latest/1040x760/1629234.png", similarities: ["Size", "Rim running"], differences: ["Eubanks more mobile"], stats: { ppg: 5.8, rpg: 4.2, apg: 1.0 } },
    ],
    stats: { ppg: 10.2, rpg: 8.6, apg: 1.4, spg: 0.4, bpg: 1.8, fgPct: 58.2, threePct: 0, ftPct: 62.1, topg: 1.2, mpg: 24.1 },
    careerOutcomes: [
      { outcome: "All-Star", probability: 2, description: "Elite center" },
      { outcome: "Quality Starter", probability: 18, description: "Starting center" },
      { outcome: "Solid Rotation", probability: 42, description: "Backup big" },
      { outcome: "Role Player", probability: 30, description: "Depth big" },
      { outcome: "Out of League", probability: 8, description: "Exits NBA within 3 seasons" },
    ],
    seasonLog: [
      { season: "2022-23", ppg: 4.1, rpg: 4.2, apg: 0.6, fgPct: 54.2 },
      { season: "2023-24", ppg: 7.2, rpg: 6.1, apg: 1.0, fgPct: 56.1 },
      { season: "2024-25", ppg: 10.2, rpg: 8.6, apg: 1.4, fgPct: 58.2 },
    ],
    strengths: ["Size", "Rebounding", "Rim protection"],
    weaknesses: ["Shooting", "Speed", "Free throws"],
    draftabilityScore: 69,
  },
  {
    id: "kevin-morris",
    name: "Kevin Morris",
    headshotUrl: "https://api.dicebear.com/7.x/avataaars/png?seed=kevin-morris&backgroundColor=1e3a5f&radius=50",
    school: "Connecticut",
    year: "Sophomore",
    position: "PG",
    height: "6'1\"",
    weight: "178 lbs",
    archetype: "Pass-First Guard",
    archetypeConfidence: 75,
    nbaComp: "Andrew Nembhard",
    nbaComparisons: [
      { name: "Andrew Nembhard", team: "Indiana Pacers", position: "PG", matchScore: 75, headshotUrl: "https://cdn.nba.com/headshots/nba/latest/1040x760/1630614.png", similarities: ["Playmaking", "Poise"], differences: ["Nembhard more experienced"], stats: { ppg: 9.2, rpg: 2.4, apg: 4.9 } },
    ],
    stats: { ppg: 9.8, rpg: 2.6, apg: 6.2, spg: 1.0, bpg: 0.1, fgPct: 42.1, threePct: 34.5, ftPct: 78.9, topg: 1.8, mpg: 28.4 },
    careerOutcomes: [
      { outcome: "All-Star", probability: 5, description: "Elite playmaker" },
      { outcome: "Quality Starter", probability: 28, description: "Starting point guard" },
      { outcome: "Solid Rotation", probability: 35, description: "Backup point guard" },
      { outcome: "Role Player", probability: 25, description: "Rotation guard" },
      { outcome: "Out of League", probability: 7, description: "Exits NBA within 3 seasons" },
    ],
    seasonLog: [
      { season: "2023-24", ppg: 5.2, rpg: 1.8, apg: 3.4, fgPct: 39.2 },
      { season: "2024-25", ppg: 9.8, rpg: 2.6, apg: 6.2, fgPct: 42.1 },
    ],
    strengths: ["Court vision", "Assist rate", "Low turnovers"],
    weaknesses: ["Scoring", "Size", "Athleticism"],
    draftabilityScore: 70,
  },
  {
    id: "terrence-wright",
    name: "Terrence Wright",
    headshotUrl: "https://api.dicebear.com/7.x/avataaars/png?seed=terrence-wright&backgroundColor=1e3a5f&radius=50",
    school: "Baylor",
    year: "Senior",
    position: "SG",
    height: "6'5\"",
    weight: "202 lbs",
    archetype: "3&D Wing",
    archetypeConfidence: 73,
    nbaComp: "Josh Green",
    nbaComparisons: [
      { name: "Josh Green", team: "Dallas Mavericks", position: "SG", matchScore: 73, headshotUrl: "https://cdn.nba.com/headshots/nba/latest/1040x760/1630182.png", similarities: ["Defense", "Athleticism"], differences: ["Green more explosive"], stats: { ppg: 8.2, rpg: 2.8, apg: 2.1 } },
    ],
    stats: { ppg: 10.8, rpg: 3.6, apg: 2.0, spg: 1.3, bpg: 0.3, fgPct: 44.2, threePct: 37.1, ftPct: 76.8, topg: 1.1, mpg: 26.2 },
    careerOutcomes: [
      { outcome: "All-Star", probability: 3, description: "Elite 3&D" },
      { outcome: "Quality Starter", probability: 24, description: "Starting wing" },
      { outcome: "Solid Rotation", probability: 38, description: "Bench wing" },
      { outcome: "Role Player", probability: 28, description: "Specialist" },
      { outcome: "Out of League", probability: 7, description: "Exits NBA within 3 seasons" },
    ],
    seasonLog: [
      { season: "2021-22", ppg: 3.2, rpg: 1.4, apg: 0.8, fgPct: 38.2 },
      { season: "2022-23", ppg: 5.8, rpg: 2.2, apg: 1.2, fgPct: 40.1 },
      { season: "2023-24", ppg: 8.1, rpg: 2.9, apg: 1.6, fgPct: 42.5 },
      { season: "2024-25", ppg: 10.8, rpg: 3.6, apg: 2.0, fgPct: 44.2 },
    ],
    strengths: ["Defense", "Three-point shooting", "Versatility"],
    weaknesses: ["Creation", "Finishing", "Playmaking"],
    draftabilityScore: 67,
  },
  {
    id: "david-parker",
    name: "David Parker",
    headshotUrl: "https://api.dicebear.com/7.x/avataaars/png?seed=david-parker&backgroundColor=1e3a5f&radius=50",
    school: "Ohio State",
    year: "Junior",
    position: "PF",
    height: "6'9\"",
    weight: "232 lbs",
    archetype: "Stretch Four",
    archetypeConfidence: 70,
    nbaComp: "Jalen Smith",
    nbaComparisons: [
      { name: "Jalen Smith", team: "Chicago Bulls", position: "PF", matchScore: 70, headshotUrl: "https://cdn.nba.com/headshots/nba/latest/1040x760/1630188.png", similarities: ["Shooting", "Length"], differences: ["Smith more polished"], stats: { ppg: 9.9, rpg: 6.8, apg: 1.2 } },
    ],
    stats: { ppg: 12.4, rpg: 6.2, apg: 1.8, spg: 0.7, bpg: 0.8, fgPct: 46.8, threePct: 35.2, ftPct: 71.2, topg: 1.4, mpg: 27.1 },
    careerOutcomes: [
      { outcome: "All-Star", probability: 4, description: "Elite stretch big" },
      { outcome: "Quality Starter", probability: 26, description: "Starting forward" },
      { outcome: "Solid Rotation", probability: 36, description: "Bench stretch four" },
      { outcome: "Role Player", probability: 27, description: "Shooting specialist" },
      { outcome: "Out of League", probability: 7, description: "Exits NBA within 3 seasons" },
    ],
    seasonLog: [
      { season: "2022-23", ppg: 6.2, rpg: 3.8, apg: 1.0, fgPct: 43.2 },
      { season: "2023-24", ppg: 9.4, rpg: 5.0, apg: 1.4, fgPct: 45.1 },
      { season: "2024-25", ppg: 12.4, rpg: 6.2, apg: 1.8, fgPct: 46.8 },
    ],
    strengths: ["Shooting", "Size", "Rebounding"],
    weaknesses: ["Defense", "Post game", "Athleticism"],
    draftabilityScore: 66,
  },
  {
    id: "chris-evans",
    name: "Chris Evans",
    headshotUrl: "https://api.dicebear.com/7.x/avataaars/png?seed=chris-evans-2&backgroundColor=1e3a5f&radius=50",
    school: "Texas",
    year: "Freshman",
    position: "SG",
    height: "6'4\"",
    weight: "195 lbs",
    archetype: "Combo Guard",
    archetypeConfidence: 72,
    nbaComp: "Nick Smith Jr.",
    nbaComparisons: [
      { name: "Nick Smith Jr.", team: "Charlotte Hornets", position: "SG", matchScore: 72, headshotUrl: "https://cdn.nba.com/headshots/nba/latest/1040x760/1631107.png", similarities: ["Scoring", "Handle"], differences: ["Smith more explosive"], stats: { ppg: 8.7, rpg: 2.1, apg: 2.4 } },
    ],
    stats: { ppg: 11.2, rpg: 2.8, apg: 3.2, spg: 1.0, bpg: 0.2, fgPct: 42.8, threePct: 33.5, ftPct: 79.2, topg: 1.6, mpg: 25.4 },
    careerOutcomes: [
      { outcome: "All-Star", probability: 6, description: "Elite combo guard" },
      { outcome: "Quality Starter", probability: 28, description: "Starting guard" },
      { outcome: "Solid Rotation", probability: 34, description: "Bench guard" },
      { outcome: "Role Player", probability: 25, description: "Scoring guard" },
      { outcome: "Out of League", probability: 7, description: "Exits NBA within 3 seasons" },
    ],
    seasonLog: [{ season: "2024-25", ppg: 11.2, rpg: 2.8, apg: 3.2, fgPct: 42.8 }],
    strengths: ["Scoring", "Ball handling", "Free throws"],
    weaknesses: ["Defense", "Consistency", "Playmaking"],
    draftabilityScore: 65,
  },
  {
    id: "ryan-foster",
    name: "Ryan Foster",
    headshotUrl: "https://api.dicebear.com/7.x/avataaars/png?seed=ryan-foster&backgroundColor=1e3a5f&radius=50",
    school: "Purdue",
    year: "Senior",
    position: "C",
    height: "7'1\"",
    weight: "265 lbs",
    archetype: "Back to Basket Big",
    archetypeConfidence: 71,
    nbaComp: "Zach Edey",
    nbaComparisons: [
      { name: "Zach Edey", team: "Memphis Grizzlies", position: "C", matchScore: 71, headshotUrl: "https://cdn.nba.com/headshots/nba/latest/1040x760/1641792.png", similarities: ["Size", "Post game"], differences: ["Edey more dominant"], stats: { ppg: 12.2, rpg: 9.8, apg: 1.2 } },
    ],
    stats: { ppg: 11.6, rpg: 9.2, apg: 1.1, spg: 0.3, bpg: 2.1, fgPct: 56.8, threePct: 0, ftPct: 65.2, topg: 1.5, mpg: 25.8 },
    careerOutcomes: [
      { outcome: "All-Star", probability: 3, description: "Elite center" },
      { outcome: "Quality Starter", probability: 22, description: "Starting center" },
      { outcome: "Solid Rotation", probability: 38, description: "Backup big" },
      { outcome: "Role Player", probability: 28, description: "Depth big" },
      { outcome: "Out of League", probability: 9, description: "Exits NBA within 3 seasons" },
    ],
    seasonLog: [
      { season: "2021-22", ppg: 3.8, rpg: 3.2, apg: 0.4, fgPct: 52.1 },
      { season: "2022-23", ppg: 6.2, rpg: 5.4, apg: 0.6, fgPct: 54.2 },
      { season: "2023-24", ppg: 8.8, rpg: 7.2, apg: 0.9, fgPct: 55.5 },
      { season: "2024-25", ppg: 11.6, rpg: 9.2, apg: 1.1, fgPct: 56.8 },
    ],
    strengths: ["Size", "Post scoring", "Shot blocking"],
    weaknesses: ["Mobility", "Shooting", "Switchability"],
    draftabilityScore: 64,
  },
  {
    id: "nathan-bell",
    name: "Nathan Bell",
    headshotUrl: "https://api.dicebear.com/7.x/avataaars/png?seed=nathan-bell&backgroundColor=1e3a5f&radius=50",
    school: "Florida",
    year: "Sophomore",
    position: "SF",
    height: "6'6\"",
    weight: "208 lbs",
    archetype: "Wing Defender",
    archetypeConfidence: 69,
    nbaComp: "Dalen Terry",
    nbaComparisons: [
      { name: "Dalen Terry", team: "Chicago Bulls", position: "SF", matchScore: 69, headshotUrl: "https://cdn.nba.com/headshots/nba/latest/1040x760/1631120.png", similarities: ["Length", "Defense"], differences: ["Terry more athletic"], stats: { ppg: 4.2, rpg: 2.4, apg: 1.8 } },
    ],
    stats: { ppg: 8.4, rpg: 4.2, apg: 2.0, spg: 1.2, bpg: 0.5, fgPct: 43.2, threePct: 32.8, ftPct: 72.1, topg: 1.2, mpg: 24.2 },
    careerOutcomes: [
      { outcome: "All-Star", probability: 2, description: "Elite defender" },
      { outcome: "Quality Starter", probability: 18, description: "Starting wing" },
      { outcome: "Solid Rotation", probability: 40, description: "Defensive wing" },
      { outcome: "Role Player", probability: 32, description: "Defense specialist" },
      { outcome: "Out of League", probability: 8, description: "Exits NBA within 3 seasons" },
    ],
    seasonLog: [
      { season: "2023-24", ppg: 4.8, rpg: 2.6, apg: 1.2, fgPct: 40.2 },
      { season: "2024-25", ppg: 8.4, rpg: 4.2, apg: 2.0, fgPct: 43.2 },
    ],
    strengths: ["Defense", "Length", "Motor"],
    weaknesses: ["Scoring", "Shooting", "Creation"],
    draftabilityScore: 62,
  },
  {
    id: "tyler-green",
    name: "Tyler Green",
    headshotUrl: "https://api.dicebear.com/7.x/avataaars/png?seed=tyler-green-2&backgroundColor=1e3a5f&radius=50",
    school: "Marquette",
    year: "Junior",
    position: "PG",
    height: "6'0\"",
    weight: "172 lbs",
    archetype: "Floor General",
    archetypeConfidence: 68,
    nbaComp: "Tyus Jones",
    nbaComparisons: [
      { name: "Tyus Jones", team: "Minnesota Timberwolves", position: "PG", matchScore: 68, headshotUrl: "https://cdn.nba.com/headshots/nba/latest/1040x760/1626145.png", similarities: ["Assist-to-turnover", "Poise"], differences: ["Jones more proven"], stats: { ppg: 10.0, rpg: 2.5, apg: 7.3 } },
    ],
    stats: { ppg: 8.2, rpg: 2.2, apg: 5.8, spg: 0.9, bpg: 0.0, fgPct: 41.2, threePct: 35.1, ftPct: 85.2, topg: 1.2, mpg: 26.8 },
    careerOutcomes: [
      { outcome: "All-Star", probability: 2, description: "Elite floor general" },
      { outcome: "Quality Starter", probability: 20, description: "Starting point guard" },
      { outcome: "Solid Rotation", probability: 38, description: "Backup point guard" },
      { outcome: "Role Player", probability: 32, description: "Rotation guard" },
      { outcome: "Out of League", probability: 8, description: "Exits NBA within 3 seasons" },
    ],
    seasonLog: [
      { season: "2022-23", ppg: 3.2, rpg: 1.2, apg: 2.4, fgPct: 38.2 },
      { season: "2023-24", ppg: 5.8, rpg: 1.8, apg: 4.2, fgPct: 39.8 },
      { season: "2024-25", ppg: 8.2, rpg: 2.2, apg: 5.8, fgPct: 41.2 },
    ],
    strengths: ["Assist-to-turnover", "Free throw shooting", "Poise"],
    weaknesses: ["Size", "Scoring", "Athleticism"],
    draftabilityScore: 61,
  },
  {
    id: "jason-lee",
    name: "Jason Lee",
    headshotUrl: "https://api.dicebear.com/7.x/avataaars/png?seed=jason-lee&backgroundColor=1e3a5f&radius=50",
    school: "Creighton",
    year: "Senior",
    position: "SG",
    height: "6'3\"",
    weight: "188 lbs",
    archetype: "Shooter",
    archetypeConfidence: 67,
    nbaComp: "Sam Hauser",
    nbaComparisons: [
      { name: "Sam Hauser", team: "Boston Celtics", position: "SF", matchScore: 67, headshotUrl: "https://cdn.nba.com/headshots/nba/latest/1040x760/1630573.png", similarities: ["Shooting", "Off-ball"], differences: ["Hauser taller"], stats: { ppg: 9.0, rpg: 3.8, apg: 1.4 } },
    ],
    stats: { ppg: 9.8, rpg: 2.6, apg: 1.4, spg: 0.6, bpg: 0.2, fgPct: 44.2, threePct: 40.1, ftPct: 88.2, topg: 0.9, mpg: 22.4 },
    careerOutcomes: [
      { outcome: "All-Star", probability: 1, description: "Elite shooter" },
      { outcome: "Quality Starter", probability: 14, description: "Starting shooter" },
      { outcome: "Solid Rotation", probability: 36, description: "Bench shooter" },
      { outcome: "Role Player", probability: 40, description: "Shooting specialist" },
      { outcome: "Out of League", probability: 9, description: "Exits NBA within 3 seasons" },
    ],
    seasonLog: [
      { season: "2021-22", ppg: 2.8, rpg: 1.2, apg: 0.4, fgPct: 38.2 },
      { season: "2022-23", ppg: 5.2, rpg: 1.8, apg: 0.8, fgPct: 40.1 },
      { season: "2023-24", ppg: 7.4, rpg: 2.2, apg: 1.0, fgPct: 42.2 },
      { season: "2024-25", ppg: 9.8, rpg: 2.6, apg: 1.4, fgPct: 44.2 },
    ],
    strengths: ["Three-point shooting", "Free throw shooting", "Efficiency"],
    weaknesses: ["Defense", "Creation", "Athleticism"],
    draftabilityScore: 59,
  },
  {
    id: "michael-sanders",
    name: "Michael Sanders",
    headshotUrl: "https://api.dicebear.com/7.x/avataaars/png?seed=michael-sanders&backgroundColor=1e3a5f&radius=50",
    school: "Virginia",
    year: "Freshman",
    position: "PF",
    height: "6'8\"",
    weight: "225 lbs",
    archetype: "Project Big",
    archetypeConfidence: 64,
    nbaComp: "Trayce Jackson-Davis",
    nbaComparisons: [
      { name: "Trayce Jackson-Davis", team: "Golden State Warriors", position: "PF", matchScore: 64, headshotUrl: "https://cdn.nba.com/headshots/nba/latest/1040x760/1641926.png", similarities: ["Motor", "Finishing"], differences: ["TJD more polished"], stats: { ppg: 7.2, rpg: 4.8, apg: 1.8 } },
    ],
    stats: { ppg: 6.8, rpg: 5.2, apg: 1.2, spg: 0.5, bpg: 1.0, fgPct: 50.2, threePct: 28.1, ftPct: 68.2, topg: 1.4, mpg: 18.2 },
    careerOutcomes: [
      { outcome: "All-Star", probability: 2, description: "Elite big" },
      { outcome: "Quality Starter", probability: 12, description: "Starting forward" },
      { outcome: "Solid Rotation", probability: 34, description: "Bench big" },
      { outcome: "Role Player", probability: 36, description: "Depth big" },
      { outcome: "Out of League", probability: 16, description: "Exits NBA within 3 seasons" },
    ],
    seasonLog: [{ season: "2024-25", ppg: 6.8, rpg: 5.2, apg: 1.2, fgPct: 50.2 }],
    strengths: ["Motor", "Rebounding", "Finishing"],
    weaknesses: ["Shooting", "Skill", "Experience"],
    draftabilityScore: 55,
  },
];
