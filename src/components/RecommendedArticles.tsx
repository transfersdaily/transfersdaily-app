"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { transfersApi, type Transfer } from "@/lib/api"
import { SidebarArticleItem } from "@/components/SidebarArticleItem"
import { type Locale, type Dictionary, getTranslation } from "@/lib/i18n"
import { getTranslation as getCommonTranslation } from "@/lib/translations"

interface RecommendedArticlesProps {
  locale?: Locale
  dict?: Dictionary
}

export function RecommendedArticles({ locale = 'en', dict }: RecommendedArticlesProps) {
  const [articles, setArticles] = useState<Transfer[]>([])
  const [isLoading, setIsLoading] = useState(true)

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
    loadRecommendedArticles()
  }, [locale])

  const loadRecommendedArticles = async () => {
    try {
      setIsLoading(true)
      
      // Try to get recommended articles from API
      try {
        const transfers = await transfersApi.getLatest(5, 0, locale)
        if (transfers && transfers.length > 0) {
          setArticles(transfers)
          return
        }
      } catch (apiError) {
        console.warn('API recommended articles failed, using fallback data:', apiError)
      }
      
      // Fallback to sample articles if API fails
      const fallbackArticles: Transfer[] = [
        {
          id: '1',
          title: 'Transfer Window Update: Latest Moves Across Europe',
          excerpt: 'Stay updated with the latest transfer news and rumors from top European leagues.',
          league: 'Premier League',
          publishedAt: new Date().toISOString(),
          slug: 'transfer-window-update',
          status: 'confirmed'
        },
        {
          id: '2', 
          title: 'Summer Transfer Roundup: Biggest Deals So Far',
          excerpt: 'A comprehensive look at the biggest transfers of the summer window.',
          league: 'La Liga',
          publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          slug: 'summer-transfer-roundup',
          status: 'confirmed'
        },
        {
          id: '3',
          title: 'Rising Stars to Watch This Season',
          excerpt: 'Young talents making waves in the transfer market this season.',
          league: 'Serie A',
          publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          slug: 'rising-stars-to-watch',
          status: 'confirmed'
        },
        {
          id: '4',
          title: 'January Window Preview: What to Expect',
          excerpt: 'What to expect from the upcoming January transfer window.',
          league: 'Bundesliga',
          publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          slug: 'january-window-preview',
          status: 'confirmed'
        },
        {
          id: '5',
          title: 'Record Breaking Deals That Shook Football',
          excerpt: 'The most expensive transfers that shook the football world.',
          league: 'Ligue 1',
          publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
          slug: 'record-breaking-deals',
          status: 'confirmed'
        }
      ]
      
      setArticles(fallbackArticles)
    } catch (error) {
      console.error('Error loading recommended articles:', error)
      setArticles([])
    } finally {
      setIsLoading(false)
    }
  }

  const formatTimeAgo = (dateString: string): string => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return t('common.justNow', 'Just now')
    if (diffInHours < 24) return `${diffInHours}h`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d`
    const diffInWeeks = Math.floor(diffInDays / 7)
    return `${diffInWeeks}w`
  }

  return (
    <Card className="shadow-sm border-border bg-card">
      <CardContent className="p-6">
        <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-6">
          {t('sidebar.recommended', 'Recommended Articles')}
        </h3>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : articles.length > 0 ? (
          <div className="space-y-4">
            {articles.map((article) => (
              <SidebarArticleItem
                key={article.id}
                article={article}
                locale={locale}
                formatTimeAgo={formatTimeAgo}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground text-sm">
            {t('common.noResults', 'No articles found')}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
