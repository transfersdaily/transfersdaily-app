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
  Edit,
  Settings,
  Activity,
  Database,
  Globe
} from "lucide-react"
import { adminApi } from "@/lib/api"
import { DraftVsPublishedChart } from "@/components/DraftVsPublishedChart"
import { useIsMobile, adminMobileGrid, formatForMobile } from "@/lib/mobile-utils"

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
    draftCount: number
    publishedCount: number
    totalCount: number
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
  const isMobile = useIsMobile()


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
        
        // Debug dailyActivity specifically
        console.log('🔍 Daily Activity Debug:');
        console.log('  - Raw dailyActivity:', dashboardStats.dailyActivity);
        console.log('  - dailyActivity type:', typeof dashboardStats.dailyActivity);
        console.log('  - dailyActivity length:', dashboardStats.dailyActivity?.length);
        if (dashboardStats.dailyActivity && dashboardStats.dailyActivity.length > 0) {
          console.log('  - First item:', dashboardStats.dailyActivity[0]);
          console.log('  - Last item:', dashboardStats.dailyActivity[dashboardStats.dailyActivity.length - 1]);
          console.log('  - Sample date format:', typeof dashboardStats.dailyActivity[0].date);
        }
        
        // Ensure dailyActivity is properly formatted for chart component
        const formattedDailyActivity = (dashboardStats.dailyActivity || []).map((item: any) => ({
          date: item.date,
          draftCount: parseInt(item.draftCount || item.count || 0),
          publishedCount: parseInt(item.publishedCount || item.count || 0),
          totalCount: parseInt(item.totalCount || item.count || 0)
        }));
        
        console.log('  - Formatted dailyActivity:', formattedDailyActivity);
        
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
          dailyActivity: formattedDailyActivity
        })
        
        console.log('📊 Stats set in state:');
        console.log('  - dailyActivity after setState:', dashboardStats.dailyActivity || []);
        
        // Only try to fetch recent articles if stats worked
        try {
          console.log('Dashboard: Calling getArticles API for recent articles')
          const articlesResponse = await adminApi.getArticles({
            page: 1,
            limit: 5,
            sortBy: 'created_at',
            sortOrder: 'desc'
          })
          console.log('Recent articles response:', articlesResponse)
          
          if (articlesResponse.articles) {
            setRecentArticles(articlesResponse.articles.slice(0, 5))
          }
        } catch (articlesError) {
          console.error('Failed to fetch recent articles:', articlesError)
          // Don't fail the whole dashboard if recent articles fail
        }
        
      } catch (statsError) {
        console.error('Failed to fetch dashboard stats:', statsError)
        setError('Failed to load dashboard statistics')
      }
      
    } catch (error) {
      console.error('Dashboard error:', error)
      setError('Failed to load dashboard data')
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
      title: "Draft Articles",
      value: stats.draftArticles.toString(),
      change: stats.createdToday ? `+${stats.createdToday} today` : "",
      trend: (stats.createdToday || 0) > 0 ? "up" as const : "neutral" as const,
      icon: Edit
    },
    {
      title: "Published Articles",
      value: stats.publishedArticles.toString(),
      change: `${Math.round((stats.publishedArticles / Math.max(stats.totalArticles, 1)) * 100)}% of total`,
      trend: "neutral" as const,
      icon: Eye
    },
    {
      title: "Total Leagues",
      value: stats.totalLeagues.toString(),
      change: stats.totalClubs ? `${stats.totalClubs} clubs, ${stats.totalPlayers} players` : "",
      trend: "neutral" as const,
      icon: Globe
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
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <div className="flex items-center gap-2 text-destructive">
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
        <div className={adminMobileGrid.statsCards}>
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

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className={adminMobileGrid.quickActions}>
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <Card 
                  key={index} 
                  className="hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer group"
                  onClick={() => window.location.href = action.href}
                >
                  <CardContent className={`p-6 text-center ${isMobile ? 'p-4' : ''}`}>
                    <Icon className={`h-8 w-8 mx-auto mb-3 ${action.color} group-hover:scale-110 transition-transform ${isMobile ? 'h-6 w-6 mb-2' : ''}`} />
                    <h3 className={`font-semibold mb-1 ${isMobile ? 'text-sm' : ''}`}>{action.title}</h3>
                    <p className={`text-sm text-muted-foreground ${isMobile ? 'text-xs' : ''}`}>{action.desc}</p>
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
        <div className={adminMobileGrid.contentGrid}>
          {/* Recent Articles */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Latest Articles
              </CardTitle>
              <CardDescription>Recently published and draft content</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                      <Skeleton className="h-6 w-16" />
                    </div>
                  ))}
                </div>
              ) : recentArticles.length > 0 ? (
                <div className="space-y-3">
                  {recentArticles.map((article) => (
                    <div key={article.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="min-w-0 flex-1">
                        <h4 className={`font-medium leading-tight mb-1 ${isMobile ? 'text-sm' : 'text-sm'}`}>
                          {isMobile ? formatForMobile.truncateTitle(article.title, 40) : article.title}
                        </h4>
                        <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-xs'}`}>
                          {formatForMobile.formatMobileDate(article.created_at)} • {article.category}
                        </p>
                      </div>
                      <Badge variant={article.status === 'published' ? 'default' : 'secondary'} className="text-xs ml-2">
                        {article.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No recent articles found</p>
                </div>
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
              <CardDescription>Current system health and metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systemStatus.map((item, index) => {
                  const Icon = item.icon
                  return (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                          <Icon className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className={`font-medium ${isMobile ? 'text-sm' : 'text-sm'}`}>{item.name}</p>
                          <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-xs'}`}>
                            {isMobile ? formatForMobile.formatMobileNumber(parseInt(item.value.split(' ')[0]) || 0) + ' ' + item.value.split(' ').slice(1).join(' ') : item.value}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-green-600 dark:text-green-400 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 text-xs">
                        {item.status}
                      </Badge>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminPageLayout>
  )
}
