"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, Loader2, Clock, X } from "lucide-react"
import Link from "next/link"
import { searchApi } from "@/lib/api"
import { type Locale, type Dictionary, getTranslation } from "@/lib/i18n"
import { getTranslation as getCommonTranslation } from "@/lib/translations"

interface TrendingTopic {
  name: string
  count: string
  query: string
  search_count: number
}

interface TrendingTopicsProps {
  locale?: Locale
  dict?: Dictionary
}

// Recent searches management
const RECENT_SEARCHES_KEY = 'transfersdaily_recent_searches'
const MAX_RECENT_SEARCHES = 5

function getRecentSearches(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function addRecentSearch(query: string) {
  if (typeof window === 'undefined') return
  try {
    const recent = getRecentSearches()
    const filtered = recent.filter(q => q.toLowerCase() !== query.toLowerCase())
    const updated = [query, ...filtered].slice(0, MAX_RECENT_SEARCHES)
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated))
  } catch {
    // Ignore localStorage errors
  }
}

function removeRecentSearch(query: string) {
  if (typeof window === 'undefined') return
  try {
    const recent = getRecentSearches()
    const filtered = recent.filter(q => q.toLowerCase() !== query.toLowerCase())
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(filtered))
  } catch {
    // Ignore localStorage errors
  }
}

export function TrendingTopics({ locale = 'en', dict }: TrendingTopicsProps) {
  const [topics, setTopics] = useState<TrendingTopic[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [showRecent, setShowRecent] = useState(false)

  // Enhanced translation function with fallbacks
  const t = (key: string, fallback?: string) => {
    // Try dictionary first
    if (dict) {
      const dictTranslation = getTranslation(dict, key)
      if (dictTranslation && dictTranslation !== key) {
        return dictTranslation
      }
    }
    
    // Try common translations
    const commonTranslation = getCommonTranslation(locale, key)
    if (commonTranslation && commonTranslation !== key) {
      return commonTranslation
    }
    
    // Return fallback or key
    return fallback || key.split('.').pop() || key
  }

  useEffect(() => {
    loadTrendingTopics()
    loadRecentSearches()
  }, [])

  const loadTrendingTopics = async () => {
    try {
      setIsLoading(true)
      
      // Try to get trending searches from API
      try {
        const trendingSearches = await searchApi.getTrendingSearches({ limit: 8 })
        if (trendingSearches && trendingSearches.length > 0) {
          setTopics(trendingSearches)
          return
        }
      } catch (apiError) {
        console.warn('API trending searches failed, using fallback data:', apiError)
      }
      
      // Fallback to static trending topics if API fails
      const fallbackTopics: TrendingTopic[] = [
        { name: "Kylian Mbappé", count: "2.1k searches", query: "Kylian Mbappé", search_count: 2100 },
        { name: "Manchester United", count: "1.8k searches", query: "Manchester United transfers", search_count: 1800 },
        { name: "Real Madrid", count: "1.5k searches", query: "Real Madrid", search_count: 1500 },
        { name: "Premier League", count: "1.3k searches", query: "Premier League", search_count: 1300 },
        { name: "Chelsea FC", count: "1.1k searches", query: "Chelsea signings", search_count: 1100 },
        { name: "Liverpool FC", count: "950 searches", query: "Liverpool news", search_count: 950 },
        { name: "Barcelona", count: "890 searches", query: "Barcelona transfers", search_count: 890 },
        { name: "Arsenal FC", count: "780 searches", query: "Arsenal deals", search_count: 780 }
      ]
      
      setTopics(fallbackTopics)
    } catch (error) {
      console.error('Error loading trending topics:', error)
      setTopics([])
    } finally {
      setIsLoading(false)
    }
  }

  const loadRecentSearches = () => {
    const recent = getRecentSearches()
    setRecentSearches(recent)
    setShowRecent(recent.length > 0)
  }

  const handleSearchClick = (query: string) => {
    addRecentSearch(query)
    loadRecentSearches()
  }

  const handleRemoveRecentSearch = (query: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    removeRecentSearch(query)
    loadRecentSearches()
  }

  return (
    <div className="space-y-6">
      {/* Recent Searches */}
      {showRecent && recentSearches.length > 0 && (
        <Card className="shadow-sm border-border bg-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Clock className="h-4 w-4 text-primary" />
              <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">
                {t('sidebar.recentSearches', 'Recent Searches')}
              </h3>
            </div>
            
            <div className="space-y-3">
              {recentSearches.map((query, index) => (
                <Link 
                  key={`${query}-${index}`}
                  href={`/${locale}/search?q=${encodeURIComponent(query)}`}
                  className="flex items-center justify-between group cursor-pointer block"
                  onClick={() => handleSearchClick(query)}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
                      <Clock className="h-3 w-3" />
                    </div>
                    <div className="font-medium text-sm group-hover:text-primary transition-colors truncate">
                      {query}
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleRemoveRecentSearch(query, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-muted rounded transition-all"
                    title="Remove"
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                  </button>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Trending Topics */}
      <Card className="shadow-sm border-border bg-card">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="h-4 w-4 text-primary" />
            <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">
              {t('sidebar.trending', 'Most Searched')}
            </h3>
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="space-y-4">
              {topics.length > 0 ? (
                topics.map((topic, index) => (
                  <Link 
                    key={topic.name} 
                    href={`/${locale}/search?q=${encodeURIComponent(topic.query)}`}
                    className="flex items-center justify-between group cursor-pointer block"
                    onClick={() => handleSearchClick(topic.query)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-xs font-medium text-primary">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium text-sm group-hover:text-primary transition-colors">
                          {topic.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {topic.count}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  {t('common.noResults', 'No results found')}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Export the functions for use in other components
export { addRecentSearch, getRecentSearches }
