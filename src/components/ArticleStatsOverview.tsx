"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardCard } from "@/components/ui/dashboard-card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, Line, LineChart, Pie, PieChart, Cell, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { CalendarDays, FileText, TrendingUp, Clock } from "lucide-react"
import { ArticlesLineChart } from "@/components/ArticlesLineChart"

interface StatsData {
  totalArticles: number
  createdToday: number
  createdThisWeek: number
  createdThisMonth: number
  byCategory: Array<{ name: string; value: number; color: string }>
  byLeague: Array<{ name: string; value: number }>
  dailyCreation: Array<{ date: string; count: number }>
  byStatus: Array<{ name: string; value: number; color: string }>
}

interface ArticleStatsOverviewProps {
  data: StatsData
  pageType: "draft" | "published" | "scheduled"
}

const chartConfig = {
  articles: {
    label: "Articles",
    color: "hsl(330 81% 60%)",
  },
  transfer: {
    label: "Transfer",
    color: "hsl(330 81% 60%)",
  },
  loan: {
    label: "Loan", 
    color: "hsl(346 77% 49%)",
  },
  contract: {
    label: "Contract",
    color: "hsl(351 83% 74%)",
  },
  rumour: {
    label: "Rumour",
    color: "hsl(330 81% 60%)",
  },
  confirmed: {
    label: "Confirmed",
    color: "hsl(346 77% 49%)",
  },
  completed: {
    label: "Completed",
    color: "hsl(351 83% 74%)",
  },
  failed: {
    label: "Failed",
    color: "hsl(338 71% 37%)",
  },
} satisfies ChartConfig

export function ArticleStatsOverview({ data, pageType }: ArticleStatsOverviewProps) {
  // Ensure all arrays have default values to prevent map errors
  const safeData = {
    ...data,
    byCategory: data.byCategory || [],
    byLeague: data.byLeague || [],
    dailyCreation: data.dailyCreation || [],
    byStatus: data.byStatus || []
  }

  const getPageTitle = () => {
    switch (pageType) {
      case "draft": return "Draft Articles"
      case "published": return "Published Articles"
      case "scheduled": return "Scheduled Articles"
    }
  }

  const getPageDescription = () => {
    switch (pageType) {
      case "draft": return "Overview of draft articles awaiting publication"
      case "published": return "Overview of published articles performance"
      case "scheduled": return "Overview of scheduled articles pipeline"
    }
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title={`Total ${getPageTitle()}`}
          value={safeData.totalArticles || 0}
          icon={FileText}
          description={pageType === "draft" ? "Awaiting publication" : pageType === "published" ? "Live articles" : "Scheduled for publication"}
        />
        
        <DashboardCard
          title="Created Today"
          value={safeData.createdToday || 0}
          change={safeData.totalArticles ? `+${Math.round(((safeData.createdToday || 0) / safeData.totalArticles) * 100)}% of total` : ""}
          trend="up"
          icon={CalendarDays}
        />
        
        <DashboardCard
          title="This Week"
          value={safeData.createdThisWeek || 0}
          change={(safeData.createdThisWeek || 0) > (safeData.createdToday || 0) * 7 ? "↗ vs last week" : "↘ vs last week"}
          trend={(safeData.createdThisWeek || 0) > (safeData.createdToday || 0) * 7 ? "up" : "down"}
          icon={TrendingUp}
        />
        
        <DashboardCard
          title="This Month"
          value={safeData.createdThisMonth || 0}
          icon={Clock}
          description={`Avg ${Math.round((safeData.createdThisMonth || 0) / 30)} per day`}
        />
      </div>

      {/* Weekly Articles Line Chart */}
      <ArticlesLineChart 
        data={safeData.dailyCreation?.map(item => ({
          date: item.date,
          count: item.count,
          dayName: item.dayName || item.date,
          fullDate: item.fullDate || item.date
        })) || []}
        title={`${getPageTitle()} Created This Week`}
        description={`Daily ${pageType} article creation from Sunday to Saturday`}
        className="col-span-full"
      />

      {/* Charts Row */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {/* Category Distribution */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>By Category</CardTitle>
            <CardDescription>Distribution of articles by category</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <ChartContainer config={chartConfig} className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={safeData.byCategory}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    fill="hsl(330 81% 60%)"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {safeData.byCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={[
                        "hsl(330 81% 60%)",
                        "hsl(346 77% 49%)", 
                        "hsl(351 83% 74%)"
                      ][index % 3]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* League Distribution */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>By League</CardTitle>
            <CardDescription>Articles per league</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <ChartContainer config={chartConfig} className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={safeData.byLeague} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis />
                  <Bar dataKey="value" fill="hsl(330 81% 60%)" radius={4} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Status Distribution (for drafts) or Daily Trend */}
        {pageType === "draft" ? (
          <Card className="col-span-1 lg:col-span-2 xl:col-span-1">
            <CardHeader>
              <CardTitle>By Status</CardTitle>
              <CardDescription>Transfer status breakdown</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <ChartContainer config={chartConfig} className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={safeData.byStatus}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={120}
                      fill="hsl(330 81% 60%)"
                    >
                      {safeData.byStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={[
                          "hsl(330 81% 60%)",
                          "hsl(346 77% 49%)",
                          "hsl(351 83% 74%)",
                          "hsl(338 71% 37%)"
                        ][index % 4]} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        ) : (
          <Card className="col-span-1 lg:col-span-2 xl:col-span-1">
            <CardHeader>
              <CardTitle>Daily Trend</CardTitle>
              <CardDescription>Articles created over time</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <ChartContainer config={chartConfig} className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={safeData.dailyCreation} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                    <YAxis />
                    <Line 
                      type="monotone" 
                      dataKey="count" 
                      stroke="hsl(330 81% 60%)" 
                      strokeWidth={3}
                      dot={{ r: 5, fill: "hsl(330 81% 60%)" }}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}