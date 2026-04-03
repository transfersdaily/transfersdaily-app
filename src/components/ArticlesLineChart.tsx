"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { TrendingUp, Calendar } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface DailyData {
  date: string
  count: number
  dayName: string
  fullDate: string
}

interface ArticlesLineChartProps {
  data?: DailyData[]
  isLoading?: boolean
  title?: string
  description?: string
  className?: string
}

export function ArticlesLineChart({
  data = [],
  isLoading = false,
  title = "Articles Created This Week",
  description = "Daily article creation from Sunday to Saturday",
  className = ""
}: ArticlesLineChartProps) {

  const generateDefaultData = (): DailyData[] => {
    const days = []
    const today = new Date()
    const dayOfWeek = today.getDay()
    const mostRecentSunday = new Date(today)
    mostRecentSunday.setDate(today.getDate() - dayOfWeek)

    for (let i = 0; i < 7; i++) {
      const date = new Date(mostRecentSunday)
      date.setDate(mostRecentSunday.getDate() + i)
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      days.push({
        date: date.toISOString().split('T')[0],
        count: 0,
        dayName: dayNames[date.getDay()],
        fullDate: date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
      })
    }
    return days
  }

  const chartData = data.length > 0 ? data : generateDefaultData()
  const totalArticles = chartData.reduce((sum, day) => sum + day.count, 0)
  const averagePerDay = totalArticles > 0 ? (totalArticles / chartData.length).toFixed(1) : '0'
  const peakDay = chartData.reduce((max, day) => day.count > max.count ? day : max, chartData[0])

  if (isLoading) {
    return (
      <Card className={`relative overflow-hidden bg-white/[0.03] border border-white/[0.06] backdrop-blur-md ${className}`}>
        <CardContent className="p-5">
          <Skeleton className="h-5 w-48 bg-white/[0.06]" />
          <Skeleton className="h-3 w-64 mt-2 bg-white/[0.06]" />
          <Skeleton className="h-64 w-full mt-4 bg-white/[0.06]" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`relative overflow-hidden bg-white/[0.03] border border-white/[0.06] backdrop-blur-md ${className}`}>
      <CardContent className="p-5">
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04]">
              <TrendingUp className="h-4 w-4 text-white/30" />
            </div>
            <h3 className="text-sm font-medium text-white/70">{title}</h3>
          </div>
          <p className="text-[11px] text-white/30 mt-1 ml-10">{description}</p>

          {/* Quick Stats */}
          <div className="flex items-center gap-5 text-[11px] text-white/30 mt-3 ml-10">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>Total: {totalArticles}</span>
            </div>
            <span>Avg: {averagePerDay}/day</span>
            {peakDay && peakDay.count > 0 && (
              <span>Peak: {peakDay.dayName} ({peakDay.count})</span>
            )}
          </div>
        </div>

        <div className="h-64 w-full">
          <ChartContainer
            config={{
              count: {
                label: "Articles Created",
                color: "#22c55e",
              },
            }}
            className="h-full w-full"
          >
            <LineChart
              data={chartData}
              margin={{ left: 12, right: 12, top: 12, bottom: 12 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.04)"
                vertical={false}
              />
              <XAxis
                dataKey="dayName"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fontSize: 11, fill: "rgba(255,255,255,0.4)" }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fontSize: 11, fill: "rgba(255,255,255,0.3)" }}
                allowDecimals={false}
              />
              <ChartTooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload as DailyData
                    return (
                      <div className="rounded-lg border border-white/[0.1] bg-black/80 backdrop-blur-sm p-3 shadow-lg">
                        <div className="text-sm font-medium text-white/80">{d.fullDate}</div>
                        <div className="text-xs text-white/50 mt-0.5">
                          {payload[0].value} articles created
                        </div>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#22c55e"
                strokeWidth={2}
                dot={{ fill: "#22c55e", strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6, fill: "#22c55e", strokeWidth: 2, stroke: "rgba(0,0,0,0.5)" }}
              />
            </LineChart>
          </ChartContainer>
        </div>

        {totalArticles === 0 && (
          <div className="text-center text-white/30 text-xs mt-4">
            No articles created this week
          </div>
        )}
      </CardContent>
      <div
        className="absolute top-0 left-0 right-0 h-[1px] opacity-40"
        style={{ background: "linear-gradient(90deg, transparent, #22c55e, transparent)" }}
      />
    </Card>
  )
}
