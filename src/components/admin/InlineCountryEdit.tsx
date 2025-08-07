'use client';

import { useState, useRef, useEffect } from 'react';
import { Check, X, Edit3, Globe, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Complete world countries list
const COUNTRIES = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan',
  'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Bolivia', 'Bosnia and Herzegovina', 'Brazil', 'Bulgaria',
  'Cambodia', 'Cameroon', 'Canada', 'Chile', 'China', 'Colombia', 'Costa Rica', 'Croatia', 'Cyprus', 'Czech Republic',
  'Denmark', 'Ecuador', 'Egypt', 'England', 'Estonia', 'Ethiopia', 'Finland', 'France',
  'Georgia', 'Germany', 'Ghana', 'Greece', 'Guatemala', 'Hungary',
  'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy',
  'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kuwait',
  'Latvia', 'Lebanon', 'Lithuania', 'Luxembourg',
  'Malaysia', 'Malta', 'Mexico', 'Moldova', 'Montenegro', 'Morocco', 'Netherlands', 'New Zealand', 'Nigeria', 'North Macedonia', 'Norway',
  'Pakistan', 'Paraguay', 'Peru', 'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia',
  'Saudi Arabia', 'Scotland', 'Serbia', 'Singapore', 'Slovakia', 'Slovenia', 'South Africa', 'South Korea', 'Spain', 'Sweden', 'Switzerland',
  'Thailand', 'Tunisia', 'Turkey', 'Ukraine', 'United Arab Emirates', 'United States', 'Uruguay', 'Venezuela', 'Wales', 'Zimbabwe'
].sort();

interface InlineCountryEditProps {
  leagueId: number;
  currentCountry: string | null;
  onUpdate: (leagueId: number, newCountry: string) => Promise<void>;
}

export function InlineCountryEdit({ leagueId, currentCountry, onUpdate }: InlineCountryEditProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(currentCountry || '');
  const [isLoading, setIsLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter countries based on search term
  const filteredCountries = COUNTRIES.filter(country =>
    country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (isEditing && searchInputRef.current) {
      searchInputRef.current.focus();
      setSearchTerm('');
      setHighlightedIndex(-1);
    }
  }, [isEditing]);

  useEffect(() => {
    // Reset highlighted index when search term changes
    setHighlightedIndex(-1);
  }, [searchTerm]);

  const handleSave = async () => {
    if (selectedCountry === currentCountry) {
      setIsEditing(false);
      return;
    }

    if (!selectedCountry) {
      setIsEditing(false);
      return;
    }

    setIsLoading(true);
    try {
      await onUpdate(leagueId, selectedCountry);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update country:', error);
      // Reset to original value on error
      setSelectedCountry(currentCountry || '');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setSelectedCountry(currentCountry || '');
    setSearchTerm('');
    setIsEditing(false);
  };

  const selectCountry = (country: string) => {
    setSelectedCountry(country);
    setSearchTerm('');
    handleSaveWithCountry(country);
  };

  const handleSaveWithCountry = async (country: string) => {
    if (country === currentCountry) {
      setIsEditing(false);
      return;
    }

    setIsLoading(true);
    try {
      await onUpdate(leagueId, country);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update country:', error);
      setSelectedCountry(currentCountry || '');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCancel();
      return;
    }

    if (filteredCountries.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => 
        prev < filteredCountries.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => 
        prev > 0 ? prev - 1 : filteredCountries.length - 1
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < filteredCountries.length) {
        selectCountry(filteredCountries[highlightedIndex]);
      } else if (filteredCountries.length === 1) {
        selectCountry(filteredCountries[0]);
      }
    }
  };

  if (isEditing) {
    return (
      <div className="relative min-w-[250px]">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
            <Input
              ref={searchInputRef}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-8 text-sm pl-7"
              placeholder="Search countries..."
              disabled={isLoading}
            />
          </div>
          
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0"
              onClick={handleCancel}
              disabled={isLoading}
            >
              <X className="h-3 w-3 text-red-600" />
            </Button>
          </div>
        </div>

        {/* Dropdown with filtered countries */}
        {searchTerm && (
          <div 
            ref={dropdownRef}
            className="absolute top-full left-0 right-0 z-50 mt-1 bg-background border border-border rounded-md shadow-lg max-h-[200px] overflow-y-auto"
          >
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country, index) => (
                <button
                  key={country}
                  className={`w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors flex items-center gap-2 ${
                    index === highlightedIndex ? 'bg-muted' : ''
                  }`}
                  onClick={() => selectCountry(country)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                >
                  <Globe className="h-3 w-3 text-muted-foreground" />
                  {country}
                  {country === currentCountry && (
                    <span className="ml-auto text-xs text-muted-foreground">(current)</span>
                  )}
                </button>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-muted-foreground">
                No countries found matching "{searchTerm}"
              </div>
            )}
          </div>
        )}

        {/* Show current selection when not searching */}
        {!searchTerm && selectedCountry && (
          <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-background border border-border rounded-md shadow-lg">
            <div className="px-3 py-2 text-sm text-muted-foreground">
              Current: <span className="font-medium text-foreground">{selectedCountry}</span>
            </div>
            <div className="px-3 py-1 text-xs text-muted-foreground border-t">
              Start typing to search and change country
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 group">
      <div className="flex items-center gap-2">
        <Globe className="h-3 w-3 text-muted-foreground" />
        <span className="text-sm">
          {currentCountry || (
            <span className="text-muted-foreground italic">Unknown</span>
          )}
        </span>
      </div>
      <Button
        size="sm"
        variant="ghost"
        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => setIsEditing(true)}
        title="Edit country"
      >
        <Edit3 className="h-3 w-3" />
      </Button>
    </div>
  );
}
