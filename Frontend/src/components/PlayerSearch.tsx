import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PlayerSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  positionFilter: string;
  onPositionFilterChange: (value: string) => void;
  collegeFilter: string;
  onCollegeFilterChange: (value: string) => void;
}

export function PlayerSearch({
  searchTerm,
  onSearchChange,
  positionFilter,
  onPositionFilterChange,
  collegeFilter,
  onCollegeFilterChange
}: PlayerSearchProps) {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder="Search players by name..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <div className="flex gap-3 items-center">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Select value={positionFilter} onValueChange={onPositionFilterChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Positions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Positions</SelectItem>
            <SelectItem value="PG">Point Guard</SelectItem>
            <SelectItem value="SG">Shooting Guard</SelectItem>
            <SelectItem value="SF">Small Forward</SelectItem>
            <SelectItem value="PF">Power Forward</SelectItem>
            <SelectItem value="C">Center</SelectItem>
          </SelectContent>
        </Select>

        <Select value={collegeFilter} onValueChange={onCollegeFilterChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Colleges" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Colleges</SelectItem>
            <SelectItem value="Duke">Duke</SelectItem>
            <SelectItem value="Kentucky">Kentucky</SelectItem>
            <SelectItem value="Kansas">Kansas</SelectItem>
            <SelectItem value="UNC">UNC</SelectItem>
            <SelectItem value="UCLA">UCLA</SelectItem>
            <SelectItem value="Gonzaga">Gonzaga</SelectItem>
            <SelectItem value="Michigan State">Michigan State</SelectItem>
            <SelectItem value="Villanova">Villanova</SelectItem>
            <SelectItem value="Arizona">Arizona</SelectItem>
            <SelectItem value="Texas">Texas</SelectItem>
            <SelectItem value="Purdue">Purdue</SelectItem>
            <SelectItem value="Baylor">Baylor</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
