"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, Loader2 } from "lucide-react"
import Link from "next/link"
import { searchApi } from "@/lib/api"

interface TrendingTopic {
  name: string
  count: string
  query: string
  search_count: number
}

export function TrendingTopics() {
  const [topics, setTopics] = useState<TrendingTopic[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadTrendingTopics()
  }, [])

  const loadTrendingTopics = async () => {
    try {
      setIsLoading(true)
      const trendingData = await searchApi.getTrendingSearches({ 
        limit: 8, 
        days: 30 
      })
      setTopics(trendingData)
    } catch (error) {
      console.error('Error loading trending topics:', error)
      // Fallback data will be used from the API function
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="shadow-sm border-0 bg-white dark:bg-slate-800">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="h-4 w-4 text-primary" />
          <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Most Searched</h3>
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
                  href={`/search?q=${encodeURIComponent(topic.query)}`}
                  className="flex items-center justify-between group cursor-pointer block"
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
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground">No trending searches yet</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
