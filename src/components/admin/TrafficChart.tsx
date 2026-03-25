'use client'

import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, type ChartConfig } from '@/components/ui/chart'
import { Skeleton } from '@/components/ui/skeleton'
import type { TrafficResponse } from '@/types/analytics'

const chartConfig = {
  pageViews: { label: 'Page Views', color: 'hsl(var(--primary))' },
  sessions: { label: 'Sessions', color: 'hsl(var(--chart-2))' },
} satisfies ChartConfig

interface TrafficChartProps {
  timeSeries: TrafficResponse['timeSeries'] | undefined
  isLoading: boolean
  dateRange: string
}

export function TrafficChart({ timeSeries, isLoading, dateRange }: TrafficChartProps) {
  const hasData = timeSeries && timeSeries.length > 0

  return (
    <Card className="bg-white border border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle>Traffic Overview</CardTitle>
        <CardDescription>{dateRange || 'Select a date range'}</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[350px] w-full" />
        ) : !hasData ? (
          <div className="flex items-center justify-center h-[350px] text-muted-foreground">
            Collecting data...
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[350px] w-full">
            <AreaChart data={timeSeries} margin={{ left: 12, right: 12, top: 12, bottom: 12 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                className="text-xs"
              />
              <YAxis
                yAxisId="left"
                tickLine={false}
                axisLine={false}
                className="text-xs"
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tickLine={false}
                axisLine={false}
                className="text-xs"
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="pageViews"
                stroke="var(--color-pageViews)"
                fill="var(--color-pageViews)"
                fillOpacity={0.1}
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="sessions"
                stroke="var(--color-sessions)"
                fill="var(--color-sessions)"
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
