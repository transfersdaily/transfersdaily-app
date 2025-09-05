"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, Loader2 } from "lucide-react"
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
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="h-5 w-5 text-primary/60" />
          <h3 className="text-lg font-bold text-foreground tracking-tight">Most Searched</h3>
        </div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between py-2">
              <div className="h-4 bg-slate-200 rounded-full animate-pulse flex-1 mr-3" />
              <div className="h-3 bg-slate-200 rounded-full animate-pulse w-16" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (hasError) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="h-5 w-5 text-primary/60" />
          <h3 className="text-lg font-bold text-foreground tracking-tight">Most Searched</h3>
        </div>
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground/80">{t('sidebar.errorLoadingTrends')}</p>
        </div>
      </div>
    )
  }

  if (topics.length === 0) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="h-5 w-5 text-primary/60" />
          <h3 className="text-lg font-bold text-foreground tracking-tight">Most Searched</h3>
        </div>
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground/80">{t('sidebar.noTrendingTopics')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp className="h-5 w-5 text-primary/60" />
        <h3 className="text-lg font-bold text-foreground tracking-tight">Most Searched</h3>
      </div>
      <div className="space-y-1">
        {topics.map((topic, index) => (
          <Link
            key={`${topic.query}-${index}`}
            href={`/${locale}/search?q=${encodeURIComponent(topic.query)}`}
            onClick={() => handleTopicClick(topic.query)}
            className="flex items-center justify-between p-3 rounded-xl hover:bg-white/60 transition-all duration-200 group border-0"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-primary/60 to-primary/40 flex-shrink-0"></div>
              <span className="text-sm font-medium text-slate-700 group-hover:text-primary truncate transition-colors duration-200">
                {topic.name}
              </span>
            </div>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-full ml-3 flex-shrink-0">
              {topic.count}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
  }
