"use client"

import { useState, useEffect } from "react"
import { AdminPageLayout } from "@/components/admin/AdminPageLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MobileDataCard } from "@/components/admin/MobileDataCard"
import { MobileSearchFilter } from "@/components/admin/MobileSearchFilter"
import {
  Search,
  TrendingUp,
  Users,
  Eye,
  Download,
  BarChart3,
  Activity,
  Settings
} from "lucide-react"
import { searchApi } from "@/lib/api"
import { useIsMobile, adminMobileGrid, adminMobileClasses, formatForMobile } from "@/lib/mobile-utils"

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

interface GA4Overview {
  pageViews: number
  sessions: number
  totalUsers: number
  avgSessionDuration: number
}

export default function AnalyticsPage() {
  const isMobile = useIsMobile()
  const [stats, setStats] = useState<SearchStats | null>(null)
  const [ga4Data, setGa4Data] = useState<GA4Overview | null>(null)
  const [ga4NotConfigured, setGa4NotConfigured] = useState(false)
  const [ga4Loading, setGa4Loading] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchFilter, setSearchFilter] = useState("")
  const [dateRange, setDateRange] = useState("7d")

  useEffect(() => {
    fetchSearchStats()
    fetchGA4Overview()
  }, [])

  const fetchGA4Overview = async () => {
    try {
      setGa4Loading(true)
      const response = await fetch('/api/admin/analytics/overview?days=30')
      const result = await response.json()

      if (result.error === 'ga4_not_configured') {
        setGa4NotConfigured(true)
        return
      }

      if (result.success && result.data) {
        setGa4Data(result.data)
      }
    } catch (err) {
      console.error('Error fetching GA4 overview:', err)
    } finally {
      setGa4Loading(false)
    }
  }

  const fetchSearchStats = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await searchApi.getSearchStats()
      setStats(data)
    } catch (err) {
      console.error('Error fetching search stats:', err)
      setError('Failed to load search analytics')

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

  const searchKpis = stats ? [
    {
      title: "Total Searches",
      value: formatForMobile.formatMobileNumber(stats.totalSearches),
      change: `${stats.recentActivity.recent_searches} recent`,
      trend: "up" as const,
      icon: Search,
      color: "text-blue-600"
    },
    {
      title: "Unique Queries",
      value: formatForMobile.formatMobileNumber(stats.uniqueQueries),
      change: `${stats.recentActivity.unique_recent} recent`,
      trend: "up" as const,
      icon: Users,
      color: "text-green-600"
    },
    {
      title: "Avg Searches/Query",
      value: (stats.totalSearches / Math.max(stats.uniqueQueries, 1)).toFixed(1),
      change: "Overall average",
      trend: "neutral" as const,
      icon: TrendingUp,
      color: "text-purple-600"
    },
    {
      title: "Top Query",
      value: stats.topSearches[0]?.search_count.toString() || "0",
      change: stats.topSearches[0]?.original_query || "No searches",
      trend: "neutral" as const,
      icon: Eye,
      color: "text-orange-600"
    }
  ] : []

  const filters = [
    {
      key: 'dateRange',
      label: 'Date Range',
      value: dateRange,
      options: [
        { value: '1d', label: 'Last 24 hours' },
        { value: '7d', label: 'Last 7 days' },
        { value: '30d', label: 'Last 30 days' },
        { value: '90d', label: 'Last 90 days' }
      ],
      onChange: setDateRange
    }
  ]

  const handleResetFilters = () => {
    setSearchFilter("")
    setDateRange("7d")
  }

  // GA4 Not Configured Card
  const GA4NotConfiguredCard = () => (
    <Card className="border-dashed">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-muted">
            <Settings className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <CardTitle className="text-lg">GA4 Analytics Not Configured</CardTitle>
            <CardDescription>
              To enable analytics, set up a Google Cloud service account with GA4 Data API access.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">Setup steps:</p>
          <ol className="list-decimal list-inside space-y-2 ml-1">
            <li>Create a service account in Google Cloud Console</li>
            <li>Enable the Google Analytics Data API</li>
            <li>Grant Viewer access on GA4 property</li>
            <li>Download the JSON key and set as <code className="px-1.5 py-0.5 rounded bg-muted font-mono text-xs">GOOGLE_SERVICE_ACCOUNT_CREDENTIALS</code> env var</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  )

  // GA4 Overview Cards
  const GA4OverviewCards = () => {
    if (ga4Loading) {
      return (
        <div className={adminMobileGrid.statsCards}>
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-4" />
                </div>
                <Skeleton className="h-6 w-12 mb-1" />
                <Skeleton className="h-3 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      )
    }

    if (!ga4Data) return null

    const ga4Kpis = [
      {
        title: "Page Views",
        value: ga4Data.pageViews.toLocaleString(),
        icon: Eye,
        color: "text-blue-600"
      },
      {
        title: "Sessions",
        value: ga4Data.sessions.toLocaleString(),
        icon: Activity,
        color: "text-green-600"
      },
      {
        title: "Total Users",
        value: ga4Data.totalUsers.toLocaleString(),
        icon: Users,
        color: "text-purple-600"
      },
      {
        title: "Avg Session Duration",
        value: `${Math.round(ga4Data.avgSessionDuration)}s`,
        icon: BarChart3,
        color: "text-orange-600"
      },
    ]

    return (
      <div className={adminMobileGrid.statsCards}>
        {ga4Kpis.map((kpi, index) => {
          const Icon = kpi.icon
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className={`p-4 ${isMobile ? 'p-3' : ''}`}>
                <div className="flex items-center justify-between mb-2">
                  <p className={`font-medium text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>
                    {kpi.title}
                  </p>
                  <Icon className={`h-4 w-4 ${kpi.color}`} />
                </div>
                <p className={`font-bold ${isMobile ? 'text-lg' : 'text-2xl'}`}>
                  {kpi.value}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    )
  }

  // Search KPI Cards
  const SearchKPICards = () => (
    <div className={adminMobileGrid.statsCards}>
      {isLoading ? (
        Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-4" />
              </div>
              <Skeleton className="h-6 w-12 mb-1" />
              <Skeleton className="h-3 w-16" />
            </CardContent>
          </Card>
        ))
      ) : (
        searchKpis.map((kpi, index) => {
          const Icon = kpi.icon
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className={`p-4 ${isMobile ? 'p-3' : ''}`}>
                <div className="flex items-center justify-between mb-2">
                  <p className={`font-medium text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>
                    {kpi.title}
                  </p>
                  <Icon className={`h-4 w-4 ${kpi.color}`} />
                </div>
                <div className="space-y-1">
                  <p className={`font-bold ${isMobile ? 'text-lg' : 'text-2xl'}`}>
                    {kpi.value}
                  </p>
                  <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-xs'}`}>
                    {formatForMobile.truncateTitle(kpi.change, 20)}
                  </p>
                </div>
              </CardContent>
            </Card>
          )
        })
      )}
    </div>
  )

  // Mobile Search Terms List
  const MobileSearchTermsList = () => (
    <div className="space-y-3">
      {filteredSearches.map((search, index) => (
        <MobileDataCard
          key={index}
          title={search.original_query}
          subtitle={`Rank #${index + 1} -- Last searched ${formatForMobile.formatMobileDate(search.last_searched_at)}`}
          metadata={[
            {
              label: "Searches",
              value: (
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="font-mono text-xs">
                    {formatForMobile.formatMobileNumber(search.search_count)}
                  </Badge>
                  <div className="w-16 bg-muted rounded-full h-1.5">
                    <div
                      className="bg-primary h-1.5 rounded-full"
                      style={{
                        width: `${Math.min(100, (search.search_count / (stats?.topSearches[0]?.search_count || 1)) * 100)}%`
                      }}
                    />
                  </div>
                </div>
              )
            },
            {
              label: "Popularity",
              value: `${Math.round((search.search_count / (stats?.totalSearches || 1)) * 100)}% of total`
            }
          ]}
          actions={[
            {
              label: "View Details",
              onClick: () => console.log('View details for:', search.original_query),
              variant: "outline",
              icon: <Eye className="w-4 h-4" />
            }
          ]}
          badge={{
            text: `${search.search_count}`,
            variant: 'secondary'
          }}
        />
      ))}
    </div>
  )

  // Desktop Search Terms Table
  const DesktopSearchTermsTable = () => (
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
                  Last searched {formatForMobile.formatMobileDate(search.last_searched_at)}
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
  )

  return (
    <AdminPageLayout
      title="Analytics"
      subtitle="Site traffic and search analytics"
      actions={
        !isMobile ? (
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        ) : undefined
      }
    >
      {error && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <div className="flex items-center gap-2 text-destructive">
            <Activity className="h-4 w-4" />
            <span className="font-medium">Error Loading Analytics</span>
          </div>
          <p className="text-sm mt-1 text-muted-foreground">{error}</p>
          <Button
            onClick={fetchSearchStats}
            variant="outline"
            size="sm"
            className="mt-2 min-h-[44px]"
          >
            Retry
          </Button>
        </div>
      )}

      <div className="space-y-8">
        {/* GA4 Site Analytics Section */}
        <section>
          <h3 className={`font-semibold mb-4 ${isMobile ? 'text-base' : 'text-lg'}`}>
            Site Traffic (GA4)
          </h3>
          {ga4NotConfigured ? (
            <GA4NotConfiguredCard />
          ) : (
            <GA4OverviewCards />
          )}
        </section>

        {/* Search Analytics Section */}
        <section>
          <h3 className={`font-semibold mb-4 ${isMobile ? 'text-base' : 'text-lg'}`}>
            Search Analytics
          </h3>
          <SearchKPICards />
        </section>

        {/* Search Terms Analysis */}
        <Card>
          <CardHeader className={isMobile ? "pb-4" : ""}>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Top Search Terms
                </CardTitle>
                <CardDescription>
                  {filteredSearches.length} of {stats?.topSearches.length || 0} search terms
                </CardDescription>
              </div>
              {!isMobile && (
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
              )}
            </div>
          </CardHeader>
          <CardContent>
            {/* Mobile Search Filter */}
            {isMobile && (
              <div className="mb-4">
                <MobileSearchFilter
                  searchTerm={searchFilter}
                  onSearchChange={setSearchFilter}
                  filters={filters}
                  onResetFilters={handleResetFilters}
                />
              </div>
            )}

            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: isMobile ? 5 : 10 }).map((_, i) => (
                  <div key={i} className={`p-4 border rounded-lg ${isMobile ? 'space-y-2' : 'flex items-center justify-between'}`}>
                    <div className={isMobile ? 'space-y-2' : 'space-y-2'}>
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <div className={`flex items-center gap-4 ${isMobile ? 'justify-between' : ''}`}>
                      <Skeleton className="h-6 w-12" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredSearches.length > 0 ? (
              <>
                {/* Mobile: Card-based layout */}
                <div className={adminMobileClasses.mobileOnly}>
                  <MobileSearchTermsList />
                </div>

                {/* Desktop: Traditional table */}
                <div className={adminMobileClasses.desktopOnly}>
                  <DesktopSearchTermsTable />
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className={`font-medium ${isMobile ? 'text-base' : 'text-lg'}`}>
                  No search data found
                </p>
                <p className={`${isMobile ? 'text-sm' : 'text-sm'} mt-1`}>
                  Search terms will appear here once users start searching
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminPageLayout>
  )
}
