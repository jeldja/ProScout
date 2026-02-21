import { useState, useMemo } from 'react';
import { PlayerSearch } from '@/components/PlayerSearch';
import { PlayerCard } from '@/components/PlayerCard';
import { PlayerComparison } from '@/components/PlayerComparison';
import { players } from '@/data/playerData';
import type { Player } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function DashboardPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [positionFilter, setPositionFilter] = useState('all');
  const [collegeFilter, setCollegeFilter] = useState('all');
  const [selectedPlayers, setSelectedPlayers] = useState<[Player | null, Player | null]>([null, null]);
  const [activeTab, setActiveTab] = useState('search');

  const filteredPlayers = useMemo(() => {
    return players.filter(player => {
      const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          player.college.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesPosition = positionFilter === 'all' || player.position.includes(positionFilter);
      const matchesCollege = collegeFilter === 'all' || player.college === collegeFilter;

      return matchesSearch && matchesPosition && matchesCollege;
    });
  }, [searchTerm, positionFilter, collegeFilter]);

  const handleComparePlayer = (player: Player) => {
    setSelectedPlayers(prev => {
      if (prev[0]?.id === player.id) return [prev[1], null];
      if (prev[1]?.id === player.id) return [prev[0], null];
      if (!prev[0]) return [player, prev[1]];
      if (!prev[1]) return [prev[0], player];
      return [player, prev[1]];
    });
    setActiveTab('comparison');
  };

  const handleRemovePlayer = (index: 0 | 1) => {
    setSelectedPlayers(prev => {
      const newSelection: [Player | null, Player | null] = [...prev];
      newSelection[index] = null;
      return newSelection;
    });
  };

  const isPlayerSelected = (playerId: string) => {
    return selectedPlayers[0]?.id === playerId || selectedPlayers[1]?.id === playerId;
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="mb-6">
        <TabsTrigger value="search">Player Search</TabsTrigger>
        <TabsTrigger value="comparison">
          Comparison {(selectedPlayers[0] || selectedPlayers[1]) && 
            `(${[selectedPlayers[0], selectedPlayers[1]].filter(Boolean).length})`}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="search" className="space-y-6">
        <PlayerSearch
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          positionFilter={positionFilter}
          onPositionFilterChange={setPositionFilter}
          collegeFilter={collegeFilter}
          onCollegeFilterChange={setCollegeFilter}
        />

        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              {filteredPlayers.length} player{filteredPlayers.length !== 1 ? 's' : ''} found
            </p>
            {(selectedPlayers[0] || selectedPlayers[1]) && (
              <p className="text-sm text-blue-600">
                {[selectedPlayers[0], selectedPlayers[1]].filter(Boolean).length} selected for comparison
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredPlayers.map(player => (
              <PlayerCard
                key={player.id}
                player={player}
                onCompare={handleComparePlayer}
                isSelected={isPlayerSelected(player.id)}
              />
            ))}
          </div>

          {filteredPlayers.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p>No players found matching your criteria</p>
              <p className="text-sm mt-2">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="comparison">
        <PlayerComparison
          players={selectedPlayers}
          onRemovePlayer={handleRemovePlayer}
        />
      </TabsContent>
    </Tabs>
  );
}
