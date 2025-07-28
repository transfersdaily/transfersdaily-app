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
} from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"

interface DailyActivityData {
  date: string
  draftCount: number
  publishedCount: number
  totalCount: number
}

interface DraftVsPublishedChartProps {
  dailyActivity?: DailyActivityData[]
  totalDrafts: number
  totalPublished: number
  isLoading?: boolean
}

const chartConfig = {
  draft: {
    label: "Draft Articles", 
    color: "#f59e0b", // amber-500
  },
  published: {
    label: "Published Articles", 
    color: "#22c55e", // green-500
  },
} satisfies ChartConfig

export function DraftVsPublishedChart({ 
  dailyActivity = [], 
  totalDrafts = 0, 
  totalPublished = 0,
  isLoading = false 
}: DraftVsPublishedChartProps) {
  
  // Debug logging
  console.log('📊 DraftVsPublishedChart Debug:');
  console.log('  - dailyActivity:', dailyActivity);
  console.log('  - dailyActivity length:', dailyActivity.length);
  console.log('  - totalDrafts:', totalDrafts);
  console.log('  - totalPublished:', totalPublished);
  console.log('  - isLoading:', isLoading);
  
  // Validate and filter the daily activity data
  const validDailyActivity = Array.isArray(dailyActivity) 
    ? dailyActivity.filter(day => day && day.date && 
        typeof day.draftCount !== 'undefined' && 
        typeof day.publishedCount !== 'undefined')
    : [];
  
  console.log('  - Valid dailyActivity after filtering:', validDailyActivity);
  
  // If no valid data, create a fallback with 7 days of zero data
  const fallbackData = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    return {
      date: date.toISOString().split('T')[0],
      draftCount: 0,
      publishedCount: 0,
      totalCount: 0
    };
  });
  
  const dataToUse = validDailyActivity.length > 0 ? validDailyActivity : fallbackData;
  console.log('  - Data to use for chart:', dataToUse);
  
  // Transform the daily activity data to show draft vs published articles
  const chartData = dataToUse.map(day => {
    // Handle different date formats that might come from the backend
    let date: Date;
    if (typeof day.date === 'string') {
      // If it's already a date string like "2025-07-27"
      date = new Date(day.date + 'T00:00:00.000Z'); // Add time to avoid timezone issues
    } else {
      date = new Date(day.date);
    }
    
    // Format the date for display
    const monthName = date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      timeZone: 'UTC' // Use UTC to avoid timezone issues
    });
    
    console.log(`  - Processing day: ${day.date} -> ${monthName}, draft: ${day.draftCount || 0}, published: ${day.publishedCount || 0}`);
    
    return {
      date: monthName,
      draft: day.draftCount || 0,
      published: day.publishedCount || 0,
      total: (day.draftCount || 0) + (day.publishedCount || 0),
      rawDate: day.date // Keep original date for sorting
    }
  }).sort((a, b) => {
    // Sort by raw date to ensure chronological order
    return new Date(a.rawDate).getTime() - new Date(b.rawDate).getTime();
  })

  console.log('📈 Chart Data after transformation:', chartData);
  console.log('📈 Chart Data length:', chartData.length);

  // Calculate trend
  const totalArticles = totalDrafts + totalPublished
  const publishedPercentage = totalPublished > 0 ? ((totalPublished / totalArticles) * 100).toFixed(1) : '0'
  const weeklyTotal = dataToUse.reduce((sum, day) => sum + (day.totalCount || day.draftCount + day.publishedCount || 0), 0)
  const weeklyDrafts = dataToUse.reduce((sum, day) => sum + (day.draftCount || 0), 0)
  const weeklyPublished = dataToUse.reduce((sum, day) => sum + (day.publishedCount || 0), 0)

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

  // Show empty state if no data
  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Published Articles Created This Week</CardTitle>
          <CardDescription>
            Daily published article activity over the last 7 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <div className="text-lg mb-2">No data available</div>
              <div className="text-sm">Chart data is being loaded...</div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex w-full items-start gap-2 text-sm">
            <div className="grid gap-2">
              <div className="text-muted-foreground">
                Waiting for data to load...
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Draft vs Published Articles</CardTitle>
        <CardDescription>
          Daily article creation by status over the last 7 days
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
                          Total: {(payload[0]?.payload?.draft || 0) + (payload[0]?.payload?.published || 0)} articles created
                        </div>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Line
                dataKey="draft"
                type="monotone"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={{
                  fill: "#f59e0b",
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
              {weeklyTotal} articles created this week <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-muted-foreground flex items-center gap-2 leading-none">
              {weeklyDrafts} drafts • {weeklyPublished} published over the last 7 days
            </div>
            <div className="text-muted-foreground text-xs">
              {totalPublished} total published • {totalDrafts} total drafts • {totalArticles} total articles
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
