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
      
      console.log('🔍 TrendingTopics: Loading most searched terms...')
      console.log('🌐 API Config baseUrl:', API_CONFIG.baseUrl)
      console.log('🔗 Most searched endpoint:', API_CONFIG.endpoints.mostSearched)
      console.log('📡 Full URL will be:', `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.mostSearched}`)
      
      // Get most searched terms from API
      const mostSearchedTerms = await searchApi.getMostSearchedTerms({ 
        limit: 8,
        days: 30 // Last 30 days
      })
      
      console.log('📊 TrendingTopics: API response:', mostSearchedTerms)
      
      if (mostSearchedTerms && mostSearchedTerms.length > 0) {
        console.log('✅ TrendingTopics: Found', mostSearchedTerms.length, 'search terms')
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
        console.log('⚠️ TrendingTopics: No search terms found')
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
      <div className="p-4">
        <div className="mb-3 md:mb-4">
          <h3 className="text-sm md:text-base font-semibold text-foreground">Most Searched</h3>
        </div>
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="h-4 bg-gray-200 rounded animate-pulse flex-1 mr-2" />
              <div className="h-3 bg-gray-200 rounded animate-pulse w-12" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (hasError) {
    return (
      <div className="p-4">
        <div className="mb-3 md:mb-4">
          <h3 className="text-sm md:text-base font-semibold text-foreground">Most Searched</h3>
        </div>
        <div className="text-center py-4">
          <p className="text-sm text-gray-500">{t('sidebar.errorLoadingTrends')}</p>
        </div>
      </div>
    )
  }

  if (topics.length === 0) {
    return (
      <div className="p-4">
        <div className="mb-3 md:mb-4">
          <h3 className="text-sm md:text-base font-semibold text-foreground">Most Searched</h3>
        </div>
        <div className="text-center py-4">
          <p className="text-sm text-gray-500">{t('sidebar.noTrendingTopics')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="mb-3 md:mb-4">
        <h3 className="text-sm md:text-base font-semibold text-foreground">Most Searched</h3>
      </div>
        <div className="space-y-2">
          {topics.map((topic, index) => (
            <Link
              key={`${topic.query}-${index}`}
              href={`/${locale}/search?q=${encodeURIComponent(topic.query)}`}
              onClick={() => handleTopicClick(topic.query)}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <span className="text-sm text-gray-700 group-hover:text-blue-600 truncate flex-1 mr-2">
                {topic.name}
              </span>
              <span className="text-xs text-gray-500 whitespace-nowrap">
                {topic.count}
              </span>
            </Link>
          ))}
        </div>
      </div>
    )
  }
