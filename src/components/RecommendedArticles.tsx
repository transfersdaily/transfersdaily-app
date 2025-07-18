"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Clock } from "lucide-react"
import { useState, useEffect } from "react"
import { articlesApi, type Article } from "@/lib/api"
import Link from "next/link"

export function RecommendedArticles() {
  const [articles, setArticles] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadRecommendedArticles()
  }, [])

  const loadRecommendedArticles = async () => {
    try {
      setIsLoading(true)
      // Get more articles than needed and randomize client-side as fallback
      const recommendedArticles = await articlesApi.getRecommended(10)
      
      // Shuffle the array and take first 5 before setting state
      const shuffled = [...recommendedArticles].sort(() => Math.random() - 0.5).slice(0, 5)
      setArticles(shuffled)
    } catch (error) {
      console.error('Error loading recommended articles:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours} hours ago`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays} days ago`
  }

  return (
    <Card className="shadow-sm border-0 bg-white dark:bg-slate-800">
      <CardContent className="p-3">
        <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-6">Recommended Articles</h3>
        <div className="space-y-4">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-0">
                <div className="w-full sm:w-20 h-32 sm:h-20 bg-muted rounded-lg flex-shrink-0 animate-pulse"></div>
                <div className="flex-1 min-w-0">
                  <div className="h-4 bg-muted rounded mb-2 animate-pulse"></div>
                  <div className="h-3 bg-muted rounded mb-2 animate-pulse"></div>
                  <div className="h-3 bg-muted rounded w-20 animate-pulse"></div>
                </div>
              </div>
            ))
          ) : (
            articles.map((article) => (
              <Link key={article.id} href={`/article/${article.id}`}>
                <div className="group cursor-pointer p-0 mb-4 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:shadow-sm transition-all duration-200">
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <div className="w-full sm:w-20 h-32 sm:h-20 bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/20 dark:to-orange-900/20 rounded-lg flex-shrink-0 overflow-hidden">
                      {article.imageUrl ? (
                        <img 
                          src={article.imageUrl} 
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-6 h-6 bg-red-500/20 rounded-full"></div>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm leading-tight mb-1 group-hover:text-primary transition-colors line-clamp-2">
                        {article.title}
                      </h4>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {article.excerpt}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
