'use client';

import { useState, useRef, useEffect } from 'react';
import { Check, X, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Common countries for autocomplete suggestions
const COMMON_COUNTRIES = [
  'England', 'Spain', 'Italy', 'Germany', 'France', 'Netherlands', 'Portugal', 'Scotland',
  'Turkey', 'Greece', 'Belgium', 'Switzerland', 'Austria', 'Russia', 'Ukraine', 'Poland',
  'United States', 'Saudi Arabia', 'China', 'Japan', 'Australia', 'Brazil', 'Argentina', 'Mexico'
];

interface InlineCountryInputProps {
  leagueId: number;
  currentCountry: string | null;
  onUpdate: (leagueId: number, newCountry: string) => Promise<void>;
}

export function InlineCountryInput({ leagueId, currentCountry, onUpdate }: InlineCountryInputProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(currentCountry || '');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleInputChange = (value: string) => {
    setInputValue(value);
    
    if (value.length > 0) {
      const filtered = COMMON_COUNTRIES.filter(country =>
        country.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSave = async () => {
    const trimmedValue = inputValue.trim();
    
    if (trimmedValue === currentCountry) {
      setIsEditing(false);
      return;
    }

    if (!trimmedValue) {
      setInputValue(currentCountry || '');
      setIsEditing(false);
      return;
    }

    setIsLoading(true);
    try {
      await onUpdate(leagueId, trimmedValue);
      setIsEditing(false);
      setSuggestions([]);
    } catch (error) {
      console.error('Failed to update country:', error);
      setInputValue(currentCountry || '');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setInputValue(currentCountry || '');
    setIsEditing(false);
    setSuggestions([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const selectSuggestion = (country: string) => {
    setInputValue(country);
    setSuggestions([]);
    inputRef.current?.focus();
  };

  if (isEditing) {
    return (
      <div className="relative min-w-[200px]">
        <div className="flex items-center gap-2">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className="h-8 text-sm"
            placeholder="Enter country name..."
            disabled={isLoading}
          />
          
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0"
              onClick={handleSave}
              disabled={isLoading}
            >
              <Check className="h-3 w-3 text-green-600" />
            </Button>
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

        {/* Autocomplete suggestions */}
        {suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-background border border-border rounded-md shadow-lg">
            {suggestions.map((country) => (
              <button
                key={country}
                className="w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors"
                onClick={() => selectSuggestion(country)}
              >
                {country}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 group">
      <span className="text-sm">
        {currentCountry || (
          <span className="text-muted-foreground italic">Unknown</span>
        )}
      </span>
      <Button
        size="sm"
        variant="ghost"
        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => setIsEditing(true)}
      >
        <Edit3 className="h-3 w-3" />
      </Button>
    </div>
  );
}
