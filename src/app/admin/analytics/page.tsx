"use client"

import { useState, useEffect } from "react"
import { AdminPageLayout } from "@/components/admin/AdminPageLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { 
  Search, 
  TrendingUp, 
  Users, 
  Eye,
  Download
} from "lucide-react"
import { searchApi } from "@/lib/api"

interface SearchTerm {
  original_query: string
  search_count: number
  last_searched_at: string
}

interface SearchStats {
  totalSearches: number
  uniqueQueries: number
  topSearches: SearchTerm[]
  recentActivity: {
    recent_searches: number
    unique_recent: number
  }
}

export default function SearchAnalyticsPage() {
  const [stats, setStats] = useState<SearchStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchFilter, setSearchFilter] = useState("")

  useEffect(() => {
    fetchSearchStats()
  }, [])

  const fetchSearchStats = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await searchApi.getSearchStats()
      setStats(data)
    } catch (err) {
      console.error('Error fetching search stats:', err)
      setError('Failed to load search analytics')
      
      // Set fallback empty stats to prevent UI crashes
      setStats({
        totalSearches: 0,
        uniqueQueries: 0,
        topSearches: [],
        recentActivity: {
          recent_searches: 0,
          unique_recent: 0
        }
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filteredSearches = stats?.topSearches.filter(search =>
    search.original_query.toLowerCase().includes(searchFilter.toLowerCase())
  ) || []

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays === 1) return '1d ago'
    if (diffInDays < 7) return `${diffInDays}d ago`
    return date.toLocaleDateString()
  }

  const kpis = stats ? [
    {
      title: "Total Searches",
      value: stats.totalSearches.toLocaleString(),
      change: `${stats.recentActivity.recent_searches} recent`,
      trend: "up" as const,
      icon: Search
    },
    {
      title: "Unique Queries",
      value: stats.uniqueQueries.toLocaleString(),
      change: `${stats.recentActivity.unique_recent} recent`,
      trend: "up" as const,
      icon: Users
    },
    {
      title: "Avg Searches/Query",
      value: (stats.totalSearches / Math.max(stats.uniqueQueries, 1)).toFixed(1),
      change: "Overall average",
      trend: "neutral" as const,
      icon: TrendingUp
    },
    {
      title: "Top Query",
      value: stats.topSearches[0]?.search_count.toString() || "0",
      change: stats.topSearches[0]?.original_query || "No searches",
      trend: "neutral" as const,
      icon: Eye
    }
  ] : []

  return (
    <AdminPageLayout title="Search Analytics">
      {error && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <div className="flex items-center gap-2 text-destructive">
            <Search className="h-4 w-4" />
            <span className="font-medium">Error Loading Analytics</span>
          </div>
          <p className="text-red-700 text-sm mt-1">{error}</p>
          <Button 
            onClick={fetchSearchStats}
            variant="outline"
            size="sm"
            className="mt-2"
          >
            Retry
          </Button>
        </div>
      )}

      <div className="space-y-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-4" />
                  </div>
                  <Skeleton className="h-8 w-16 mb-1" />
                  <Skeleton className="h-3 w-20" />
                </CardContent>
              </Card>
            ))
          ) : (
            kpis.map((kpi, index) => {
              const Icon = kpi.icon
              return (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-muted-foreground">{kpi.title}</p>
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-2xl font-bold">{kpi.value}</p>
                      <p className="text-xs text-muted-foreground">{kpi.change}</p>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>

        {/* Search Terms Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Top Search Terms
                </CardTitle>
                <CardDescription>Most searched terms and their frequency</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Filter searches..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    className="pl-8 w-64"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-6 w-12" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredSearches.length > 0 ? (
              <div className="space-y-2">
                {filteredSearches.map((search, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-muted-foreground w-8">
                          #{index + 1}
                        </span>
                        <div>
                          <p className="font-medium">{search.original_query}</p>
                          <p className="text-sm text-muted-foreground">
                            Last searched {formatDate(search.last_searched_at)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="secondary" className="font-mono">
                        {search.search_count.toLocaleString()} searches
                      </Badge>
                      <div className="w-24 bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ 
                            width: `${Math.min(100, (search.search_count / (stats?.topSearches[0]?.search_count || 1)) * 100)}%` 
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No search data found</p>
                <p className="text-sm">Search terms will appear here once users start searching</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminPageLayout>
  )
}
