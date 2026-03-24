'use client';

import { useState } from 'react';
import { InlineCountryEdit } from './InlineCountryEdit';
import { InlineCountryInput } from './InlineCountryInput';
import { useToast } from '@/hooks/use-toast';

interface League {
  id: number;
  name: string;
  country: string | null;
  clubs_count: number;
  players_count: number;
  articles_count: number;
}

interface LeagueTableProps {
  leagues: League[];
  onLeagueUpdate: (updatedLeague: League) => void;
}

export function LeagueTable({ leagues, onLeagueUpdate }: LeagueTableProps) {
  const [isUpdating, setIsUpdating] = useState<number | null>(null);
  const { toast } = useToast();

  const handleCountryUpdate = async (leagueId: number, newCountry: string) => {
    setIsUpdating(leagueId);
    
    try {
      const response = await fetch(`/api/admin/leagues/${leagueId}/country`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}` // Adjust based on your auth
        },
        body: JSON.stringify({ country: newCountry })
      });

      if (!response.ok) {
        throw new Error('Failed to update country');
      }

      const result = await response.json();
      
      // Update the league in parent component
      const updatedLeague = leagues.find(l => l.id === leagueId);
      if (updatedLeague) {
        onLeagueUpdate({ ...updatedLeague, country: newCountry });
      }

      toast({
        title: "Success",
        description: `League country updated to ${newCountry}`,
      });

    } catch (error) {
      console.error('Failed to update country:', error);
      toast({
        title: "Error",
        description: "Failed to update league country",
        variant: "destructive",
      });
      throw error; // Re-throw to let the component handle the error state
    } finally {
      setIsUpdating(null);
    }
  };

  return (
    <div className="rounded-md border">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="p-4 text-left">League</th>
            <th className="p-4 text-left">Country</th>
            <th className="p-4 text-left">Clubs</th>
            <th className="p-4 text-left">Players</th>
            <th className="p-4 text-left">Articles</th>
          </tr>
        </thead>
        <tbody>
          {leagues.map((league) => (
            <tr key={league.id} className="border-b hover:bg-muted/25">
              <td className="p-4 font-medium">{league.name}</td>
              <td className="p-4">
                {/* Option 1: Dropdown */}
                <InlineCountryEdit
                  leagueId={league.id}
                  currentCountry={league.country}
                  onUpdate={handleCountryUpdate}
                />
                
                {/* Option 2: Input with autocomplete */}
                {/* <InlineCountryInput
                  leagueId={league.id}
                  currentCountry={league.country}
                  onUpdate={handleCountryUpdate}
                /> */}
              </td>
              <td className="p-4 text-muted-foreground">{league.clubs_count}</td>
              <td className="p-4 text-muted-foreground">{league.players_count}</td>
              <td className="p-4 text-muted-foreground">{league.articles_count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
