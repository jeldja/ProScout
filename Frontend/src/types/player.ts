export interface NCAAStats {
  ppg: number;
  rpg: number;
  apg: number;
  fg_percentage: number;
  three_pt_percentage: number;
  ft_percentage: number;
  spg: number;
  bpg: number;
  per: number;
}

export interface Player {
  id: string;
  name: string;
  college: string;
  position: string;
  height: string;
  weight: number;
  year: string;
  ncaaStats: NCAAStats;
  predictedArchetype: string;
  archetypeConfidence: number;
  nbaComparison: string;
  strengths: string[];
  concerns: string[];
}
