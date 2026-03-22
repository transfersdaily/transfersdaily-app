"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { searchApi } from "@/lib/api"
import { API_CONFIG } from "@/lib/config"
import { type Locale, type Dictionary, getTranslation } from "@/lib/i18n"
import { getTranslation as getCommonTranslation } from "@/lib/translations"
import { mobileTypography } from "@/lib/mobile-utils"

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
const RECENT_SEARCHES_KEY = 'recent_searches'

function getRecentSearches(): string[] {
  try {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function removeFromRecentSearches(query: string) {
  try {
    const recent = getRecentSearches()
    const filtered = recent.filter(q => q.toLowerCase() !== query.toLowerCase())
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(filtered))
  } catch {
    // Ignore localStorage errors
  }
}

export function addRecentSearch(query: string) {
  try {
    const recent = getRecentSearches()
    const filtered = recent.filter(q => q.toLowerCase() !== query.toLowerCase())
    const updated = [query, ...filtered].slice(0, 10) // Keep only 10 recent searches
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated))
  } catch {
    // Ignore localStorage errors
  }
}

export default function TrendingTopics({ locale = 'en', dict }: TrendingTopicsProps) {
  const [topics, setTopics] = useState<TrendingTopic[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const t = (key: string) => {
    let translation = key;
    
    if (dict) {
      translation = getTranslation(dict, key)
    } else {
      translation = getCommonTranslation(key, locale)
    }
    
    console.log(`Translation for "${key}":`, translation);
    return translation;
  }

  useEffect(() => {
    loadMostSearchedTerms()
  }, [])

  const loadMostSearchedTerms = async () => {
    try {
      setIsLoading(true)
      setHasError(false)
      
      // Get most searched terms from API
      const mostSearchedTerms = await searchApi.getMostSearchedTerms({ 
        limit: 8,
        days: 30 // Last 30 days
      })
      
      if (mostSearchedTerms && mostSearchedTerms.length > 0) {
        // Convert the format to match what the component expects
        const formattedTopics = mostSearchedTerms.map(item => ({
          name: item.term,
          query: item.query,
          count: item.displayCount || `${item.count} searches`,
          search_count: item.count
        }))
        console.log('📝 TrendingTopics: Formatted topics:', formattedTopics)
        setTopics(formattedTopics)
      } else {
        // No most searched terms available
        setTopics([])
      }
    } catch (error) {
      console.error('❌ TrendingTopics: Error loading most searched terms:', error)
      setHasError(true)
      setTopics([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleTopicClick = (query: string) => {
    // Track the search when user clicks on a trending topic
    searchApi.trackSearch(query).catch(console.error)
  }

  if (isLoading) {
    return (
      <div>
        <h3 className="font-display text-base font-bold uppercase tracking-tight text-foreground mb-4">Most Searched</h3>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between py-2">
              <div className="h-4 bg-muted rounded-full animate-pulse flex-1 mr-3" />
              <div className="h-3 bg-muted rounded-full animate-pulse w-16" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (hasError) {
    return (
      <div>
        <h3 className="font-display text-base font-bold uppercase tracking-tight text-foreground mb-4">Most Searched</h3>
        <div className="text-center py-6">
          <p className="text-sm text-muted-foreground">{t('sidebar.errorLoadingTrends')}</p>
        </div>
      </div>
    )
  }

  if (topics.length === 0) {
    return (
      <div>
        <h3 className="font-display text-base font-bold uppercase tracking-tight text-foreground mb-4">Most Searched</h3>
        <div className="text-center py-6">
          <p className="text-sm text-muted-foreground">{t('sidebar.noTrendingTopics')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-5">
      <h3 className="font-display text-base font-bold uppercase tracking-tight text-foreground mb-4">Most Searched</h3>
      <div className="space-y-1">
        {topics.map((topic, index) => (
          <Link
            key={`${topic.query}-${index}`}
            href={`/${locale}/search?q=${encodeURIComponent(topic.query)}`}
            onClick={() => handleTopicClick(topic.query)}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors duration-200 group"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-2 h-2 rounded-full bg-primary/60 flex-shrink-0"></div>
              <span className="text-sm font-medium text-foreground group-hover:text-primary truncate transition-colors duration-300">
                {topic.name}
              </span>
            </div>
            <span className="text-xs font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-md ml-3 flex-shrink-0">
              {topic.count}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
  }
