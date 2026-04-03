'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { motion } from 'framer-motion'
import type { LeagueDistribution } from '@/types/content-analytics'

interface LeagueDistributionChartProps {
  data: LeagueDistribution[] | undefined
  isLoading: boolean
}

export function LeagueDistributionChart({ data, isLoading }: LeagueDistributionChartProps) {
  const hasData = data && data.length > 0
  const chartHeight = hasData ? Math.min(400, Math.max(200, data.length * 40)) : 200

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <Card className="relative overflow-hidden bg-white/[0.03] border border-white/[0.06] backdrop-blur-md">
        <CardContent className="p-5">
          <div className="mb-4">
            <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider">League Distribution</h3>
            <p className="text-[11px] text-white/20 mt-0.5">Articles by league</p>
          </div>

          {isLoading ? (
            <Skeleton className="h-[200px] w-full bg-white/[0.04]" />
          ) : !hasData ? (
            <div className="flex items-center justify-center h-[200px] text-sm text-white/20">No data available</div>
          ) : (
            <ResponsiveContainer width="100%" height={chartHeight}>
              <BarChart layout="vertical" data={data} margin={{ left: 0, right: 12, top: 4, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.04)" />
                <XAxis type="number" tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="league" width={120} tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "rgba(14,14,20,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "12px", color: "rgba(255,255,255,0.7)" }}
                />
                <Bar dataKey="count" radius={[0, 6, 6, 0]} isAnimationActive={false}>
                  {data.map((item, i) => (
                    <Cell key={i} fill={item.color} fillOpacity={0.7} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
        <div className="absolute top-0 left-0 right-0 h-[1px] opacity-30" style={{ background: "linear-gradient(90deg, transparent, #37003c, transparent)" }} />
      </Card>
    </motion.div>
  )
}
