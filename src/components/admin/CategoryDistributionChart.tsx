'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'
import { Skeleton } from '@/components/ui/skeleton'
import type { CategoryDistribution } from '@/types/content-analytics'

const chartConfig = {
  count: { label: 'Articles', color: 'hsl(var(--primary))' },
} satisfies ChartConfig

interface CategoryDistributionChartProps {
  data: CategoryDistribution[] | undefined
  isLoading: boolean
}

export function CategoryDistributionChart({ data, isLoading }: CategoryDistributionChartProps) {
  const hasData = data && data.length > 0

  const chartHeight = hasData ? Math.max(150, data.length * 40) : 150

  return (
    <Card className="bg-white border border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle>Category Distribution</CardTitle>
        <CardDescription>Articles by type</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[150px] w-full" />
        ) : !hasData ? (
          <div className="flex items-center justify-center h-[150px] text-muted-foreground">
            No data available
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="w-full" style={{ height: `${chartHeight}px` }}>
            <BarChart
              layout="vertical"
              data={data}
              margin={{ left: 12, right: 12, top: 12, bottom: 12 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tickLine={false} axisLine={false} className="text-xs" />
              <YAxis
                type="category"
                dataKey="category"
                width={100}
                tickLine={false}
                axisLine={false}
                className="text-xs"
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="count"
                fill="var(--color-count)"
                radius={[0, 4, 4, 0]}
                isAnimationActive={false}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
