'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, type ChartConfig } from '@/components/ui/chart'
import { Skeleton } from '@/components/ui/skeleton'
import type { LeagueDistribution } from '@/types/content-analytics'

interface LeagueDistributionChartProps {
  data: LeagueDistribution[] | undefined
  isLoading: boolean
}

export function LeagueDistributionChart({ data, isLoading }: LeagueDistributionChartProps) {
  const hasData = data && data.length > 0

  const chartConfig: ChartConfig = hasData
    ? Object.fromEntries(data.map((item) => [item.league, { label: item.league, color: item.color }]))
    : {}

  const chartHeight = hasData ? Math.max(200, data.length * 40) : 200

  return (
    <Card className="bg-card border border-border shadow-sm">
      <CardHeader>
        <CardTitle>League Distribution</CardTitle>
        <CardDescription>Articles by league</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[200px] w-full" />
        ) : !hasData ? (
          <div className="flex items-center justify-center h-[200px] text-muted-foreground">
            No data available
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="w-full" style={{ height: `${chartHeight}px` }}>
            <BarChart
              layout="vertical"
              data={data}
              margin={{ left: 12, right: 12, top: 12, bottom: 12 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#374151" />
              <XAxis type="number" tickLine={false} axisLine={false} className="text-xs" />
              <YAxis
                type="category"
                dataKey="league"
                width={120}
                tickLine={false}
                axisLine={false}
                className="text-xs"
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]} isAnimationActive={false}>
                {data.map((item, i) => (
                  <Cell key={i} fill={item.color} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
