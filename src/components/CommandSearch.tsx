'use client';

import { useEffect, useState, useRef } from 'react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { useRouter } from 'next/navigation';
import { useDictionary } from '@/lib/dictionary-provider';
import { transfersApi, searchApi } from '@/lib/api';
import { Search, Newspaper, TrendingUp, ArrowRight } from 'lucide-react';
import { typography } from '@/lib/typography';
import { cn } from '@/lib/theme';

interface CommandSearchProps {
  locale: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandSearch({ locale, open, onOpenChange }: CommandSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [popularTerms, setPopularTerms] = useState<Array<{ term: string; count: number }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { t } = useDictionary();
  const abortControllerRef = useRef<AbortController | null>(null);

  // Cmd+K / Ctrl+K keyboard shortcut listener
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [open, onOpenChange]);

  // Load popular searches on mount (cache once)
  useEffect(() => {
    if (open && popularTerms.length === 0) {
      searchApi.getMostSearchedTerms({ limit: 6, days: 7 })
        .then(terms => setPopularTerms(terms))
        .catch(() => {
          // Fallback to hardcoded trending if API fails
          setPopularTerms([
            { term: 'Premier League', count: 0 },
            { term: 'Real Madrid', count: 0 },
            { term: 'Manchester United transfers', count: 0 },
            { term: 'Chelsea signings', count: 0 },
          ]);
        });
    }
  }, [open, popularTerms.length]);

  // Debounced search (250ms, cancel previous)
  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    const timer = setTimeout(async () => {
      try {
        const data = await transfersApi.search(query, { language: locale });
        setResults(data || []);
        // Track the search
        searchApi.trackSearch(query, { language: locale }).catch(() => {});
      } catch (error: any) {
        if (error?.name !== 'AbortError') {
          setResults([]);
        }
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query, locale]);

  const getLocalizedPath = (path: string) => {
    return locale === 'en' ? path : `/${locale}${path}`;
  };

  const handleSelect = (slug: string) => {
    onOpenChange(false);
    setQuery('');
    router.push(getLocalizedPath(`/article/${slug}`));
  };

  const handleSearchAll = () => {
    onOpenChange(false);
    const searchQuery = query || '';
    setQuery('');
    router.push(getLocalizedPath(`/search?q=${encodeURIComponent(searchQuery)}`));
  };

  const handlePopularSelect = (term: string) => {
    setQuery(term);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setQuery('');
      setResults([]);
    }
    onOpenChange(newOpen);
  };

  return (
    <CommandDialog open={open} onOpenChange={handleOpenChange}>
      <CommandInput
        placeholder={t('search.placeholder', 'Search transfers, leagues, players...')}
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        {/* Loading state */}
        {isLoading && (
          <div className="py-6 text-center text-sm text-muted-foreground">
            {t('search.searching', 'Searching...')}
          </div>
        )}

        {/* No results state */}
        {!isLoading && query.length >= 2 && results.length === 0 && (
          <CommandEmpty>
            <div className="py-4 text-center">
              <p className={cn(typography.body.base, 'text-muted-foreground')}>
                {t('search.noResults', 'No results found for')} &quot;{query}&quot;
              </p>
              {popularTerms.length > 0 && (
                <div className="mt-4">
                  <p className={cn(typography.body.small, 'text-muted-foreground mb-2')}>
                    {t('search.trySearching', 'Try searching for:')}
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {popularTerms.slice(0, 4).map(({ term }) => (
                      <button
                        key={term}
                        onClick={() => setQuery(term)}
                        className="text-xs bg-muted px-2 py-1 rounded-md cursor-pointer hover:bg-muted/80 motion-safe:transition-colors duration-fast"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CommandEmpty>
        )}

        {/* Search results */}
        {!isLoading && results.length > 0 && (
          <CommandGroup heading={t('search.results', 'Results')}>
            {results.slice(0, 8).map((result) => (
              <CommandItem
                key={result.id || result.slug}
                value={result.title}
                onSelect={() => handleSelect(result.slug)}
                className="cursor-pointer"
              >
                <Newspaper className="mr-2 h-4 w-4 text-muted-foreground" />
                <div className="flex flex-col">
                  <span className={typography.body.base}>{result.title}</span>
                  {result.league && (
                    <span className={cn(typography.body.xs, 'text-muted-foreground')}>
                      {result.league}
                    </span>
                  )}
                </div>
              </CommandItem>
            ))}
            <CommandSeparator />
            <CommandItem onSelect={handleSearchAll} className="cursor-pointer">
              <ArrowRight className="mr-2 h-4 w-4" />
              <span>{t('search.viewAll', 'View all results')}</span>
              <kbd className="ml-auto text-xs text-muted-foreground">Enter</kbd>
            </CommandItem>
          </CommandGroup>
        )}

        {/* Popular searches (shown when query is empty) */}
        {!isLoading && query.length < 2 && popularTerms.length > 0 && (
          <CommandGroup heading={t('search.popular', 'Popular Searches')}>
            {popularTerms.map(({ term }) => (
              <CommandItem
                key={term}
                value={term}
                onSelect={() => handlePopularSelect(term)}
                className="cursor-pointer"
              >
                <TrendingUp className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{term}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {/* Always show "Go to search page" option */}
        {!isLoading && query.length < 2 && (
          <>
            <CommandSeparator />
            <CommandGroup>
              <CommandItem onSelect={handleSearchAll} className="cursor-pointer">
                <Search className="mr-2 h-4 w-4" />
                <span>{t('search.openSearchPage', 'Open search page')}</span>
              </CommandItem>
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}
