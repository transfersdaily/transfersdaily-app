'use client'

import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, type ChartConfig } from '@/components/ui/chart'
import { Skeleton } from '@/components/ui/skeleton'
import type { DailyArticleCount } from '@/types/content-analytics'

const chartConfig = {
  published: { label: 'Published', color: 'hsl(var(--primary))' },
  drafts: { label: 'Drafts', color: 'hsl(var(--chart-2))' },
} satisfies ChartConfig

interface ArticlesPerDayChartProps {
  data: DailyArticleCount[] | undefined
  isLoading: boolean
}

export function ArticlesPerDayChart({ data, isLoading }: ArticlesPerDayChartProps) {
  const hasData = data && data.length > 0

  return (
    <Card className="bg-[#1a1a1a] border border-[#2a2a2a] shadow-sm">
      <CardHeader>
        <CardTitle>Articles Per Day</CardTitle>
        <CardDescription>Last 30 days</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : !hasData ? (
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            No data available
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <AreaChart data={data} margin={{ left: 12, right: 12, top: 12, bottom: 12 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                className="text-xs"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                className="text-xs"
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Area
                type="monotone"
                dataKey="published"
                stroke="var(--color-published)"
                fill="var(--color-published)"
                fillOpacity={0.3}
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
              <Area
                type="monotone"
                dataKey="drafts"
                stroke="var(--color-drafts)"
                fill="var(--color-drafts)"
                fillOpacity={0.1}
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
