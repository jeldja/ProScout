import type { Player } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PlayerComparisonProps {
  players: [Player | null, Player | null];
  onRemovePlayer: (index: 0 | 1) => void;
}

export function PlayerComparison({ players, onRemovePlayer }: PlayerComparisonProps) {
  const [player1, player2] = players;

  if (!player1 && !player2) {
    return (
      <Card className="col-span-full">
        <CardContent className="flex items-center justify-center h-[400px]">
          <div className="text-center text-muted-foreground">
            <p className="text-lg">Select up to 2 players to compare</p>
            <p className="text-sm mt-2">Click "Compare Player" on any player card below</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getRadarData = () => {
    const categories = [
      { category: 'Scoring', key: 'ppg', max: 30 },
      { category: 'Rebounding', key: 'rpg', max: 15 },
      { category: 'Playmaking', key: 'apg', max: 10 },
      { category: 'FG%', key: 'fg_percentage', max: 70 },
      { category: '3PT%', key: 'three_pt_percentage', max: 50 },
      { category: 'Defense', key: 'spg', max: 3 }
    ];

    return categories.map(cat => ({
      category: cat.category,
      [player1?.name || 'Player 1']: player1 ? player1.ncaaStats[cat.key as keyof typeof player1.ncaaStats] : 0,
      [player2?.name || 'Player 2']: player2 ? player2.ncaaStats[cat.key as keyof typeof player2.ncaaStats] : 0,
      fullMark: cat.max
    }));
  };

  const getBarData = () => {
    return [
      {
        stat: 'PPG',
        [player1?.name || 'Player 1']: player1?.ncaaStats.ppg || 0,
        [player2?.name || 'Player 2']: player2?.ncaaStats.ppg || 0,
      },
      {
        stat: 'RPG',
        [player1?.name || 'Player 1']: player1?.ncaaStats.rpg || 0,
        [player2?.name || 'Player 2']: player2?.ncaaStats.rpg || 0,
      },
      {
        stat: 'APG',
        [player1?.name || 'Player 1']: player1?.ncaaStats.apg || 0,
        [player2?.name || 'Player 2']: player2?.ncaaStats.apg || 0,
      },
      {
        stat: 'SPG',
        [player1?.name || 'Player 1']: player1?.ncaaStats.spg || 0,
        [player2?.name || 'Player 2']: player2?.ncaaStats.spg || 0,
      },
      {
        stat: 'BPG',
        [player1?.name || 'Player 1']: player1?.ncaaStats.bpg || 0,
        [player2?.name || 'Player 2']: player2?.ncaaStats.bpg || 0,
      },
    ];
  };

  const PlayerColumn = ({ player, index }: { player: Player | null, index: 0 | 1 }) => {
    if (!player) {
      return (
        <div className="flex-1 flex items-center justify-center border-2 border-dashed rounded-lg p-8">
          <p className="text-muted-foreground">Select a player to compare</p>
        </div>
      );
    }

    return (
      <div className="flex-1 space-y-4">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle>{player.name}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {player.college} • {player.year}
                </p>
                <div className="flex gap-2 mt-2 text-sm">
                  <Badge variant="outline">{player.position}</Badge>
                  <span className="text-muted-foreground">{player.height} • {player.weight} lbs</span>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => onRemovePlayer(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Predicted NBA Archetype</span>
                <Badge className="bg-blue-600">{player.archetypeConfidence}%</Badge>
              </div>
              <p>{player.predictedArchetype}</p>
              <p className="text-sm text-muted-foreground mt-1">
                NBA Comparison: {player.nbaComparison}
              </p>
            </div>

            <div>
              <p className="text-sm mb-2">NCAA Stats</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">PPG</span>
                    <span>{player.ncaaStats.ppg}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">RPG</span>
                    <span>{player.ncaaStats.rpg}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">APG</span>
                    <span>{player.ncaaStats.apg}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">SPG</span>
                    <span>{player.ncaaStats.spg}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">BPG</span>
                    <span>{player.ncaaStats.bpg}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">FG%</span>
                    <span>{player.ncaaStats.fg_percentage}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">3PT%</span>
                    <span>{player.ncaaStats.three_pt_percentage}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">FT%</span>
                    <span>{player.ncaaStats.ft_percentage}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">PER</span>
                    <span>{player.ncaaStats.per}</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm mb-2">Strengths</p>
              <div className="flex flex-wrap gap-1">
                {player.strengths.map((strength, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {strength}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm mb-2">Concerns</p>
              <div className="flex flex-wrap gap-1">
                {player.concerns.map((concern, i) => (
                  <Badge key={i} variant="outline" className="text-xs">
                    {concern}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <PlayerColumn player={player1} index={0} />
        <PlayerColumn player={player2} index={1} />
      </div>

      {player1 && player2 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Statistical Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getBarData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="stat" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey={player1.name} fill="#3b82f6" />
                  <Bar dataKey={player2.name} fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance Radar</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={getRadarData()}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="category" />
                  <PolarRadiusAxis angle={90} domain={[0, 'auto']} />
                  <Radar
                    name={player1.name}
                    dataKey={player1.name}
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.5}
                  />
                  <Radar
                    name={player2.name}
                    dataKey={player2.name}
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.5}
                  />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
