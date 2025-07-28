"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
  description = "Daily article creation from Sunday to Monday",
  className = ""
}: ArticlesLineChartProps) {
  
  // Generate default data for the last 7 days (Sunday to Monday)
  const generateDefaultData = (): DailyData[] => {
    const days = []
    const today = new Date()
    
    // Find the most recent Sunday
    const dayOfWeek = today.getDay() // 0 = Sunday, 1 = Monday, etc.
    const mostRecentSunday = new Date(today)
    mostRecentSunday.setDate(today.getDate() - dayOfWeek)
    
    // Generate 7 days from Sunday to Saturday (next Monday would be day 8)
    for (let i = 0; i < 7; i++) {
      const date = new Date(mostRecentSunday)
      date.setDate(mostRecentSunday.getDate() + i)
      
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      
      days.push({
        date: date.toISOString().split('T')[0], // YYYY-MM-DD
        count: 0,
        dayName: dayNames[date.getDay()],
        fullDate: date.toLocaleDateString('en-US', { 
          weekday: 'long', 
          month: 'short', 
          day: 'numeric' 
        })
      })
    }
    
    return days
  }

  const chartData = data.length > 0 ? data : generateDefaultData()
  
  // Calculate some stats
  const totalArticles = chartData.reduce((sum, day) => sum + day.count, 0)
  const averagePerDay = totalArticles > 0 ? (totalArticles / chartData.length).toFixed(1) : '0'
  const peakDay = chartData.reduce((max, day) => day.count > max.count ? day : max, chartData[0])

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-6 w-48" />
          </div>
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-64 w-full" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
        
        {/* Quick Stats */}
        <div className="flex items-center gap-6 text-sm text-muted-foreground pt-2">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>Total: {totalArticles}</span>
          </div>
          <div>
            <span>Avg: {averagePerDay}/day</span>
          </div>
          {peakDay && peakDay.count > 0 && (
            <div>
              <span>Peak: {peakDay.dayName} ({peakDay.count})</span>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="h-64 w-full">
          <ChartContainer
            config={{
              count: {
                label: "Articles Created",
                color: "hsl(var(--primary))",
              },
            }}
            className="h-full w-full"
          >
            <LineChart
              data={chartData}
              margin={{
                left: 12,
                right: 12,
                top: 12,
                bottom: 12,
              }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                className="stroke-muted" 
                vertical={false}
              />
              <XAxis
                dataKey="dayName"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                className="text-xs"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                className="text-xs"
                allowDecimals={false}
              />
              <ChartTooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as DailyData
                    return (
                      <div className="rounded-lg border bg-background p-3 shadow-md">
                        <div className="font-medium">{data.fullDate}</div>
                        <div className="text-sm text-muted-foreground">
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
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{
                  fill: "hsl(var(--primary))",
                  strokeWidth: 2,
                  r: 4,
                }}
                activeDot={{
                  r: 6,
                  fill: "hsl(var(--primary))",
                  strokeWidth: 2,
                  stroke: "hsl(var(--background))",
                }}
              />
            </LineChart>
          </ChartContainer>
        </div>
        
        {totalArticles === 0 && (
          <div className="text-center text-muted-foreground text-sm mt-4">
            No articles created this week
          </div>
        )}
      </CardContent>
    </Card>
  )
}
