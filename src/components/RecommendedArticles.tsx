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
  const [hasError, setHasError] = useState(false)

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
      setHasError(false)
      
      // Try to get recommended articles from API
      const transfers = await transfersApi.getLatest(5, 0, locale)
      if (transfers && transfers.length > 0) {
        setArticles(transfers)
      } else {
        setArticles([])
      }
    } catch (error) {
      console.error('Error loading recommended articles:', error)
      setHasError(true)
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

  // Don't render anything if there's an error or no articles
  if (hasError || (!isLoading && articles.length === 0)) {
    return null
  }

  return (
    <Card className="shadow-sm border-border bg-card">
      <CardContent className="p-5">
        <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-5">
          {t('sidebar.recommended', 'Recommended Articles')}
        </h3>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
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
        )}
      </CardContent>
    </Card>
  )
}
