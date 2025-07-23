"use client"

import { useState, useEffect } from "react"
import { AdminPageLayout } from "@/components/admin/AdminPageLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardCard } from "@/components/ui/dashboard-card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  FileText, 
  Users, 
  Eye, 
  Plus,
  Edit,
  Upload,
  Settings,
  Download,
  Clock,
  Activity,
  Database,
  Globe
} from "lucide-react"
import { adminApi } from "@/lib/api"
import { API_CONFIG } from "@/lib/config"
import { DraftVsPublishedChart } from "@/components/DraftVsPublishedChart"

interface DashboardStats {
  totalArticles: number
  draftArticles: number
  publishedArticles: number
  totalClubs: number
  totalPlayers: number
  totalLeagues: number
  createdToday?: number
  createdThisWeek?: number
  createdThisMonth?: number
  byCategory?: Array<{
    name: string
    value: number
    color: string
  }>
  byLeague?: Array<{
    name: string
    value: number
  }>
  dailyActivity?: Array<{
    date: string
    count: number
  }>
}

interface RecentArticle {
  id: string
  title: string
  status: string
  created_at: string
  category: string
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentArticles, setRecentArticles] = useState<RecentArticle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)



  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Fetch dashboard stats from the dedicated API endpoint
      try {
        console.log('Dashboard: Calling getDashboardStats API')
        console.log('API Base URL:', process.env.NEXT_PUBLIC_API_URL)
        console.log('Stats endpoint:', `${process.env.NEXT_PUBLIC_API_URL || 'https://ti7pb2xkjh.execute-api.us-east-1.amazonaws.com/prod'}/admin/stats`)
        const dashboardStats = await adminApi.getDashboardStats()
        console.log('Dashboard stats response:', JSON.stringify(dashboardStats, null, 2))
        
        setStats({
          totalArticles: dashboardStats.totalArticles || 0,
          draftArticles: dashboardStats.draftArticles || 0,
          publishedArticles: dashboardStats.publishedArticles || 0,
          totalClubs: dashboardStats.totalClubs || 0,
          totalPlayers: dashboardStats.totalPlayers || 0,
          totalLeagues: dashboardStats.totalLeagues || 5,
          createdToday: dashboardStats.createdToday || 0,
          createdThisWeek: dashboardStats.createdThisWeek || 0,
          createdThisMonth: dashboardStats.createdThisMonth || 0,
          byCategory: dashboardStats.byCategory || [],
          byLeague: dashboardStats.byLeague || [],
          dailyActivity: dashboardStats.dailyActivity || []
        })
        
        // Only try to fetch recent articles if stats worked
        try {
          console.log('Dashboard: Calling getRecentArticles API')
          const recentArticles = await adminApi.getRecentArticles(5)
          console.log('Dashboard recent articles:', JSON.stringify(recentArticles, null, 2))
          
          const mappedArticles = recentArticles.map((article: any) => ({
            id: article.uuid || article.id,
            title: article.title,
            status: article.status,
            created_at: article.created_at,
            category: article.category || 'Transfer'
          }))
          
          setRecentArticles(mappedArticles)
        } catch (articlesError) {
          console.warn('Could not fetch recent articles (CORS or API issue):', articlesError)
          // Don't set error state, just leave recent articles empty
          setRecentArticles([])
        }
        
      } catch (statsError) {
        console.error('Could not fetch dashboard stats:', statsError)
        setError('Failed to connect to dashboard API')
        setStats({
          totalArticles: 0,
          draftArticles: 0,
          publishedArticles: 0,
          totalClubs: 0,
          totalPlayers: 0,
          totalLeagues: 0
        })
        setRecentArticles([])
      }
      
    } catch (err) {
      console.error('Dashboard fetch error:', err)
      setError('Failed to load dashboard data')
      setStats({
        totalArticles: 0,
        draftArticles: 0,
        publishedArticles: 0,
        totalClubs: 0,
        totalPlayers: 0,
        totalLeagues: 0
      })
      setRecentArticles([])
    } finally {
      setIsLoading(false)
    }
  }

  const kpis = stats ? [
    {
      title: "Total Articles",
      value: stats.totalArticles.toString(),
      change: stats.createdThisWeek ? `+${stats.createdThisWeek} this week` : "",
      trend: (stats.createdThisWeek || 0) > 0 ? "up" as const : "neutral" as const,
      icon: FileText
    },
    {
      title: "Published Today",
      value: stats.createdToday.toString(),
      change: stats.createdToday > 0 ? "Articles published today" : "No articles published today",
      trend: (stats.createdToday || 0) > 0 ? "up" as const : "neutral" as const,
      icon: Eye
    },
    {
      title: "Published This Week",
      value: stats.createdThisWeek.toString(),
      change: stats.createdThisWeek > 0 ? "Articles published this week" : "No articles published this week",
      trend: (stats.createdThisWeek || 0) > 0 ? "up" as const : "neutral" as const,
      icon: Activity
    },
    {
      title: "Draft Articles",
      value: stats.draftArticles.toString(),
      change: `${Math.round((stats.draftArticles / Math.max(stats.totalArticles, 1)) * 100)}% of total`,
      trend: "neutral" as const,
      icon: Edit
    }
  ] : []

  const quickActions = [
    { title: "Manage Drafts", desc: `${stats?.draftArticles || 0} pending`, icon: Edit, color: "text-orange-500", href: "/admin/articles/drafts" },
    { title: "Manage Clubs", desc: `${stats?.totalClubs || 0} clubs`, icon: Users, color: "text-green-500", href: "/admin/clubs" },
    { title: "Manage Players", desc: `${stats?.totalPlayers || 0} players`, icon: Database, color: "text-purple-500", href: "/admin/players" },
    { title: "Manage Leagues", desc: `${stats?.totalLeagues || 0} leagues`, icon: Globe, color: "text-blue-500", href: "/admin/leagues" },
    { title: "Site Settings", desc: "Configure system", icon: Settings, color: "text-gray-500", href: "/admin/settings" }
  ]

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

  const systemStatus = [
    { name: "Articles API", status: "healthy", value: "Connected", icon: FileText },
    { name: "Draft Articles", status: "healthy", value: `${stats?.draftArticles || 0} drafts`, icon: Edit },
    { name: "Published Articles", status: "healthy", value: `${stats?.publishedArticles || 0} published`, icon: Eye },
    { name: "Total Articles", status: "healthy", value: `${stats?.totalArticles || 0} total`, icon: Database }
  ]

  return (
    <AdminPageLayout title="Dashboard">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 text-red-800">
            <Activity className="h-4 w-4" />
            <span className="font-medium">Connection Error</span>
          </div>
          <p className="text-red-700 text-sm mt-1">{error}</p>
          <button 
            onClick={fetchDashboardData}
            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          >
            Retry Connection
          </button>
        </div>
      )}
      
      <div className="space-y-8">
        {/* Hero Metrics */}
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
            kpis.map((kpi, index) => (
              <DashboardCard
                key={index}
                title={kpi.title}
                value={kpi.value}
                change={kpi.change}
                trend={kpi.trend}
                icon={kpi.icon}
              />
            ))
          )}
        </div>

        {/* Secondary Metrics */}
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
            [
              {
                title: "Published Articles",
                value: stats?.publishedArticles.toString() || "0",
                change: `${Math.round((stats?.publishedArticles || 0) / Math.max(stats?.totalArticles || 1, 1) * 100)}% of total`,
                trend: "neutral" as const,
                icon: Globe
              },
              {
                title: "Total Leagues",
                value: stats?.totalLeagues.toString() || "0",
                change: stats?.totalClubs ? `${stats.totalClubs} clubs, ${stats.totalPlayers} players` : "",
                trend: "neutral" as const,
                icon: Database
              },
              {
                title: "This Month",
                value: stats?.createdThisMonth.toString() || "0",
                change: "Articles created this month",
                trend: (stats?.createdThisMonth || 0) > 0 ? "up" as const : "neutral" as const,
                icon: Clock
              },
              {
                title: "System Status",
                value: "Healthy",
                change: "All systems operational",
                trend: "up" as const,
                icon: Activity
              }
            ].map((kpi, index) => (
              <DashboardCard
                key={index}
                title={kpi.title}
                value={kpi.value}
                change={kpi.change}
                trend={kpi.trend}
                icon={kpi.icon}
              />
            ))
          )}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <Card 
                  key={index} 
                  className="hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer group"
                  onClick={() => window.location.href = action.href}
                >
                  <CardContent className="p-6 text-center">
                    <Icon className={`h-8 w-8 mx-auto mb-3 ${action.color} group-hover:scale-110 transition-transform`} />
                    <h3 className="font-semibold mb-1">{action.title}</h3>
                    <p className="text-sm text-muted-foreground">{action.desc}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Draft vs Published Articles Line Chart */}
        <DraftVsPublishedChart 
          dailyActivity={stats?.dailyActivity || []}
          totalDrafts={stats?.draftArticles || 0}
          totalPublished={stats?.publishedArticles || 0}
          isLoading={isLoading}
        />

        {/* Content Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Articles */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Latest Articles
              </CardTitle>
              <CardDescription>Recently published and draft content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="flex items-center justify-between p-3">
                    <div className="flex-1">
                      <Skeleton className="h-4 w-3/4 mb-2" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                    <Skeleton className="h-6 w-16" />
                  </div>
                ))
              ) : recentArticles.length > 0 ? (
                recentArticles.map((article, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{article.title}</h4>
                      <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                        <span>{article.category}</span>
                        <span>•</span>
                        <span>{formatDate(article.created_at)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 ml-4">
                      <Badge variant={article.status === 'published' ? 'default' : 'secondary'}>
                        {article.status}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-4">No articles found</p>
              )}
            </CardContent>
          </Card>

          {/* System Status */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                System Status
              </CardTitle>
              <CardDescription>Real-time system health monitoring</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {systemStatus.map((item, index) => {
                const Icon = item.icon
                const statusColor = item.status === 'healthy' ? 'bg-green-500' : 
                                  item.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                return (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${statusColor}`}></div>
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground font-mono">{item.value}</span>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>

        {/* Category and League Breakdown */}
        {stats?.byCategory && stats.byCategory.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Articles by Category */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Articles by Category
                </CardTitle>
                <CardDescription>Distribution of articles across categories</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {stats.byCategory.map((category, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: category.color }}
                      ></div>
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{category.value} articles</span>
                      <Badge variant="outline">
                        {Math.round((category.value / Math.max(stats.totalArticles, 1)) * 100)}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Articles by League */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Articles by League
                </CardTitle>
                <CardDescription>Top leagues by article count</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {stats.byLeague && stats.byLeague.length > 0 ? (
                  stats.byLeague.map((league, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="font-medium">{league.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{league.value} articles</span>
                        <Badge variant="outline">
                          {Math.round((league.value / Math.max(stats.totalArticles, 1)) * 100)}%
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-4">No league data available</p>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AdminPageLayout>
  )
}