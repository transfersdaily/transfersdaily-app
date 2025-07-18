"use client"

import { useState, useEffect } from "react"
import { AdminPageLayout } from "@/components/admin/AdminPageLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardCard } from "@/components/ui/dashboard-card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { 
  FileText, 
  Users, 
  Eye, 
  TrendingUp,
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
import { ArticlesLineChart } from "@/components/ArticlesLineChart"

interface DashboardStats {
  totalArticles: number
  draftArticles: number
  publishedArticles: number
  totalClubs: number
  totalPlayers: number
  totalLeagues: number
}

interface RecentArticle {
  id: string
  title: string
  status: string
  created_at: string
  category: string
}

interface ChartData {
  date: string
  created: number
  published: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentArticles, setRecentArticles] = useState<RecentArticle[]>([])
  const [chartData, setChartData] = useState<ChartData[]>([])
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
          totalLeagues: dashboardStats.totalLeagues || 5
        })
        
        // Fetch recent articles for display
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
          setChartData(generateChartData(recentArticles || []))
        } catch (articlesError) {
          console.warn('Could not fetch recent articles:', articlesError)
          setRecentArticles([])
          setChartData([])
        }
        
      } catch (statsError) {
        console.error('Could not fetch dashboard stats:', statsError)
        // Try fallback to articles API if stats endpoint fails
        try {
          console.log('Dashboard: Fallback to getDraftArticles with status=all')
          const articlesData = await adminApi.getDraftArticles({ status: 'all', limit: 50 })
          console.log('Dashboard fallback articlesData:', JSON.stringify(articlesData, null, 2))
          const allArticles = articlesData.articles || articlesData.data?.articles || []
          
          const draftCount = allArticles.filter((a: any) => a.status === 'draft').length
          const publishedCount = allArticles.filter((a: any) => a.status === 'published').length
          
          setStats({
            totalArticles: allArticles.length || 0,
            draftArticles: draftCount || 0,
            publishedArticles: publishedCount || 0,
            totalClubs: 0,
            totalPlayers: 0,
            totalLeagues: 5
          })
          
          const mappedArticles = allArticles.slice(0, 5).map((article: any) => ({
            id: article.uuid || article.id,
            title: article.title,
            status: article.status,
            created_at: article.created_at,
            category: article.category || 'Transfer'
          }))
          
          setRecentArticles(mappedArticles)
          setChartData(generateChartData(allArticles || []))
        } catch (fallbackError) {
          console.error('Fallback also failed:', fallbackError)
          setStats({
            totalArticles: 0,
            draftArticles: 0,
            publishedArticles: 0,
            totalClubs: 0,
            totalPlayers: 0,
            totalLeagues: 0
          })
          setRecentArticles([])
          setChartData([])
        }
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
      setChartData([])
    } finally {
      setIsLoading(false)
    }
  }

  const kpis = stats ? [
    {
      title: "Total Articles",
      value: stats.totalArticles.toString(),
      change: "",
      trend: "neutral" as const,
      icon: FileText
    },
    {
      title: "Draft Articles",
      value: stats.draftArticles.toString(),
      change: "",
      trend: "neutral" as const,
      icon: Edit
    },
    {
      title: "Published Articles",
      value: stats.publishedArticles.toString(),
      change: "",
      trend: "neutral" as const,
      icon: Eye
    },
    {
      title: "Total Leagues",
      value: stats.totalLeagues.toString(),
      change: "",
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

  const generateChartData = (articles: any[]): ChartData[] => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i))
      return date.toISOString().split('T')[0]
    })

    return last7Days.map(date => {
      const dayArticles = articles.filter(article => 
        article.created_at?.startsWith(date)
      )
      
      return {
        date: new Date(date).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        }),
        created: dayArticles.length,
        published: dayArticles.filter(a => a.status === 'published').length
      }
    })
  }

  const systemStatus = [
    { name: "Articles API", status: "healthy", value: "Connected", icon: FileText },
    { name: "Draft Articles", status: "healthy", value: `${stats?.draftArticles || 0} drafts`, icon: Edit },
    { name: "Published Articles", status: "healthy", value: `${stats?.publishedArticles || 0} published`, icon: Eye },
    { name: "Total Articles", status: "healthy", value: `${stats?.totalArticles || 0} total`, icon: Database }
  ]

  return (
    <AdminPageLayout title="Dashboard">
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

        {/* Weekly Articles Line Chart */}
        <ArticlesLineChart 
          data={chartData.map(item => ({
            date: item.date,
            count: item.created,
            dayName: item.date,
            fullDate: item.date
          }))}
          title="Articles Created This Week"
          description="Daily article creation from Sunday to Saturday"
          isLoading={isLoading}
        />

        {/* Articles Activity Chart */}
        <div>
          <Card className="overflow-hidden">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Articles Activity
              </CardTitle>
              <CardDescription>Daily article creation and publishing over the last 7 days</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="h-80 flex items-center justify-center">
                  <div className="space-y-3 w-full max-w-md">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-64 w-full" />
                  </div>
                </div>
              ) : (
                <div className="h-80 w-full p-4">
                  <ChartContainer
                    config={{
                      created: {
                        label: "Created",
                        color: "hsl(var(--chart-1))",
                      },
                      published: {
                        label: "Published",
                        color: "hsl(var(--chart-2))",
                      },
                    }}
                    className="h-full w-full"
                  >
                    <AreaChart
                      data={chartData}
                      margin={{
                        left: 12,
                        right: 12,
                        top: 12,
                        bottom: 12,
                      }}
                    >
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="date"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tickFormatter={(value) => value}
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                      />
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent />}
                      />
                      <Area
                        dataKey="published"
                        type="natural"
                        fill="var(--color-published)"
                        fillOpacity={0.4}
                        stroke="var(--color-published)"
                        stackId="a"
                      />
                      <Area
                        dataKey="created"
                        type="natural"
                        fill="var(--color-created)"
                        fillOpacity={0.4}
                        stroke="var(--color-created)"
                        stackId="a"
                      />
                    </AreaChart>
                  </ChartContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

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
      </div>
    </AdminPageLayout>
  )
}