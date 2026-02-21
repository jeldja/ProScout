import type { Player } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface PlayerCardProps {
  player: Player;
  onCompare: (player: Player) => void;
  isSelected: boolean;
}

export function PlayerCard({ player, onCompare, isSelected }: PlayerCardProps) {
  return (
    <Card className={`transition-all ${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{player.name}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {player.college} • {player.year}
            </p>
          </div>
          <Badge variant="outline">{player.position}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2 text-sm">
            <span className="text-muted-foreground">{player.height}</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">{player.weight} lbs</span>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm">Predicted Archetype</span>
              <Badge className="bg-blue-600">{player.archetypeConfidence}%</Badge>
            </div>
            <p className="text-sm">{player.predictedArchetype}</p>
            <p className="text-xs text-muted-foreground mt-1">
              NBA Comp: {player.nbaComparison}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 text-sm">
            <div>
              <p className="text-muted-foreground text-xs">PPG</p>
              <p>{player.ncaaStats.ppg}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">RPG</p>
              <p>{player.ncaaStats.rpg}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">APG</p>
              <p>{player.ncaaStats.apg}</p>
            </div>
          </div>

          <Button 
            className="w-full" 
            variant={isSelected ? "default" : "outline"}
            onClick={() => onCompare(player)}
          >
            {isSelected ? 'Selected for Comparison' : 'Compare Player'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
