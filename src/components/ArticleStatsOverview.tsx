"use client"

import { GlassCard } from "@/components/ui/glass-card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, Line, LineChart, Pie, PieChart, Cell, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { CalendarDays, FileText, TrendingUp, Clock } from "lucide-react"
import { ArticlesLineChart } from "@/components/ArticlesLineChart"
import { DashboardCard } from "@/components/ui/dashboard-card"

interface StatsData {
  totalArticles: number
  createdToday: number
  createdThisWeek: number
  createdThisMonth: number
  byCategory: Array<{ name: string; value: number; color: string }>
  byLeague: Array<{ name: string; value: number }>
  dailyCreation: Array<{ date: string; count: number; dayName?: string; fullDate?: string }>
  byStatus: Array<{ name: string; value: number; color: string }>
}

interface ArticleStatsOverviewProps {
  data: StatsData
  pageType: "draft" | "published" | "scheduled"
}

const CHART_COLORS = [
  "#22c55e",
  "#3b82f6",
  "#a855f7",
  "#f59e0b",
]

const chartConfig = {
  articles: { label: "Articles", color: "#22c55e" },
  transfer: { label: "Transfer", color: "#22c55e" },
  loan: { label: "Loan", color: "#3b82f6" },
  contract: { label: "Contract", color: "#a855f7" },
  rumour: { label: "Rumour", color: "#f59e0b" },
  confirmed: { label: "Confirmed", color: "#22c55e" },
  completed: { label: "Completed", color: "#3b82f6" },
  failed: { label: "Failed", color: "#ef4444" },
} satisfies ChartConfig

function ChartCard({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <GlassCard title={title} subtitle={subtitle} accentColor="#64748b">
      {children}
    </GlassCard>
  )
}

export function ArticleStatsOverview({ data, pageType }: ArticleStatsOverviewProps) {
  const safeData = {
    ...data,
    byCategory: data.byCategory || [],
    byLeague: data.byLeague || [],
    dailyCreation: data.dailyCreation || [],
    byStatus: data.byStatus || []
  }

  const getPageTitle = () => {
    switch (pageType) {
      case "draft": return "Draft"
      case "published": return "Published"
      case "scheduled": return "Scheduled"
    }
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title={`Total ${getPageTitle()}`}
          value={safeData.totalArticles || 0}
          icon={FileText}
          description={pageType === "draft" ? "Awaiting publication" : pageType === "published" ? "Live articles" : "Scheduled"}
          delay={0}
        />
        <DashboardCard
          title={pageType === "published" ? "Published Today" : "Created Today"}
          value={safeData.createdToday || 0}
          change={safeData.totalArticles ? `${Math.round(((safeData.createdToday || 0) / safeData.totalArticles) * 100)}% of total` : undefined}
          trend="up"
          icon={CalendarDays}
          delay={0.05}
        />
        <DashboardCard
          title={pageType === "published" ? "Published This Week" : "This Week"}
          value={safeData.createdThisWeek || 0}
          change={(safeData.createdThisWeek || 0) > (safeData.createdToday || 0) * 7 ? "Up vs last week" : "Down vs last week"}
          trend={(safeData.createdThisWeek || 0) > (safeData.createdToday || 0) * 7 ? "up" : "down"}
          icon={TrendingUp}
          delay={0.1}
        />
        <DashboardCard
          title={pageType === "published" ? "Published This Month" : "This Month"}
          value={safeData.createdThisMonth || 0}
          icon={Clock}
          description={`Avg ${Math.round((safeData.createdThisMonth || 0) / 30)} per day`}
          delay={0.15}
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
        title={`${getPageTitle()} Articles This Week`}
        description={`Daily ${pageType} article creation`}
        className="col-span-full"
      />

      {/* Charts Row */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {/* Category Distribution */}
        <ChartCard title="By Category" subtitle="Distribution of articles by category">
          <ChartContainer config={chartConfig} className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={safeData.byCategory}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  strokeWidth={0}
                  label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                >
                  {safeData.byCategory.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </ChartCard>

        {/* League Distribution */}
        <ChartCard title="By League" subtitle="Articles per league">
          <ChartContainer config={chartConfig} className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={safeData.byLeague} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "rgba(255,255,255,0.4)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "rgba(255,255,255,0.3)" }} axisLine={false} tickLine={false} />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <ChartTooltip content={<ChartTooltipContent />} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </ChartCard>

        {/* Status Distribution or Daily Trend */}
        {pageType === "draft" ? (
          <ChartCard title="By Status" subtitle="Transfer status breakdown">
            <ChartContainer config={chartConfig} className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={safeData.byStatus}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={100}
                    strokeWidth={0}
                  >
                    {safeData.byStatus.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </ChartCard>
        ) : (
          <ChartCard title="Daily Trend" subtitle="Articles created over time">
            <ChartContainer config={chartConfig} className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={safeData.dailyCreation} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: "rgba(255,255,255,0.4)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "rgba(255,255,255,0.3)" }} axisLine={false} tickLine={false} />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#22c55e"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "#22c55e", strokeWidth: 0 }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </ChartCard>
        )}
      </div>
    </div>
  )
}
