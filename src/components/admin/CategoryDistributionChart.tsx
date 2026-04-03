'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { motion } from 'framer-motion'
import type { CategoryDistribution } from '@/types/content-analytics'

interface CategoryDistributionChartProps {
  data: CategoryDistribution[] | undefined
  isLoading: boolean
}

export function CategoryDistributionChart({ data, isLoading }: CategoryDistributionChartProps) {
  const hasData = data && data.length > 0
  const chartHeight = hasData ? Math.min(400, Math.max(150, data.length * 40)) : 150

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
    >
      <Card className="relative overflow-hidden bg-white/[0.03] border border-white/[0.06] backdrop-blur-md">
        <CardContent className="p-5">
          <div className="mb-4">
            <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider">Category Distribution</h3>
            <p className="text-[11px] text-white/20 mt-0.5">Articles by type</p>
          </div>

          {isLoading ? (
            <Skeleton className="h-[150px] w-full bg-white/[0.04]" />
          ) : !hasData ? (
            <div className="flex items-center justify-center h-[150px] text-sm text-white/20">No data available</div>
          ) : (
            <ResponsiveContainer width="100%" height={chartHeight}>
              <BarChart layout="vertical" data={data} margin={{ left: 0, right: 12, top: 4, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.04)" />
                <XAxis type="number" tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="category" width={100} tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "rgba(14,14,20,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "12px", color: "rgba(255,255,255,0.7)" }}
                />
                <Bar dataKey="count" fill="#3b82f6" fillOpacity={0.6} radius={[0, 6, 6, 0]} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
        <div className="absolute top-0 left-0 right-0 h-[1px] opacity-30" style={{ background: "linear-gradient(90deg, transparent, #3b82f6, transparent)" }} />
      </Card>
    </motion.div>
  )
}
