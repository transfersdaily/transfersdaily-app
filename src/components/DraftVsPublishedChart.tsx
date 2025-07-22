"use client"

import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"

interface DailyActivityData {
  date: string
  count: number
}

interface DraftVsPublishedChartProps {
  dailyActivity?: DailyActivityData[]
  totalDrafts: number
  totalPublished: number
  isLoading?: boolean
}

const chartConfig = {
  drafts: {
    label: "Drafts Created",
    color: "#ef4444", // red-500
  },
  published: {
    label: "Articles Published", 
    color: "#22c55e", // green-500
  },
} satisfies ChartConfig

export function DraftVsPublishedChart({ 
  dailyActivity = [], 
  totalDrafts = 0, 
  totalPublished = 0,
  isLoading = false 
}: DraftVsPublishedChartProps) {
  
  // Transform the daily activity data to show drafts vs published
  const chartData = dailyActivity.map(day => {
    const date = new Date(day.date)
    const monthName = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    
    // Estimate drafts vs published based on total ratio
    const publishedRatio = totalPublished / Math.max(totalDrafts + totalPublished, 1)
    const estimatedPublished = Math.round(day.count * publishedRatio)
    const estimatedDrafts = day.count - estimatedPublished
    
    return {
      date: monthName,
      drafts: Math.max(estimatedDrafts, 0),
      published: Math.max(estimatedPublished, 0),
      total: day.count
    }
  }).reverse() // Reverse to show chronological order

  // Calculate trend
  const totalArticles = totalDrafts + totalPublished
  const publishedPercentage = totalPublished > 0 ? ((totalPublished / totalArticles) * 100).toFixed(1) : '0'
  const weeklyTotal = dailyActivity.reduce((sum, day) => sum + day.count, 0)

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-80 w-full" />
        </CardContent>
        <CardFooter>
          <Skeleton className="h-16 w-full" />
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Draft vs Published Articles</CardTitle>
        <CardDescription>
          Daily article creation and publishing activity over the last 7 days
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <LineChart
              accessibilityLayer
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
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-3 shadow-md">
                        <div className="font-medium mb-2">{label}</div>
                        {payload.map((entry, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: entry.color }}
                            />
                            <span>{entry.name}: {entry.value}</span>
                          </div>
                        ))}
                        <div className="text-xs text-muted-foreground mt-1">
                          Total: {(payload[0]?.payload?.drafts || 0) + (payload[1]?.payload?.published || 0)} articles
                        </div>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Line
                dataKey="drafts"
                type="monotone"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{
                  fill: "#ef4444",
                  strokeWidth: 2,
                  r: 4,
                }}
                activeDot={{
                  r: 6,
                }}
              />
              <Line
                dataKey="published"
                type="monotone"
                stroke="#22c55e"
                strokeWidth={2}
                dot={{
                  fill: "#22c55e",
                  strokeWidth: 2,
                  r: 4,
                }}
                activeDot={{
                  r: 6,
                }}
              />
            </LineChart>
          </ChartContainer>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none font-medium">
              {publishedPercentage}% articles published <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-muted-foreground flex items-center gap-2 leading-none">
              Showing {weeklyTotal} total articles created over the last 7 days
            </div>
            <div className="text-muted-foreground text-xs">
              {totalDrafts} drafts • {totalPublished} published • {totalArticles} total
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
