'use client'

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { motion } from 'framer-motion'
import type { TrafficResponse } from '@/types/analytics'

interface TrafficChartProps {
  timeSeries: TrafficResponse['timeSeries'] | undefined
  isLoading: boolean
  dateRange: string
}

export function TrafficChart({ timeSeries, isLoading, dateRange }: TrafficChartProps) {
  const hasData = timeSeries && timeSeries.length > 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <Card className="relative overflow-hidden bg-white/[0.03] border border-white/[0.06] backdrop-blur-md">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider">Traffic Overview</h3>
              <p className="text-[11px] text-white/20 mt-0.5">{dateRange || 'Select a date range'}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-blue-400" />
                <span className="text-[10px] text-white/30">Page Views</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-violet-400" />
                <span className="text-[10px] text-white/30">Sessions</span>
              </div>
            </div>
          </div>

          {isLoading ? (
            <Skeleton className="h-[300px] w-full bg-white/[0.04]" />
          ) : !hasData ? (
            <div className="flex items-center justify-center h-[300px] text-sm text-white/20">
              No traffic data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={timeSeries} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="pvGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="sessGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis
                  dataKey="label"
                  tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 10 }}
                  axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(14,14,20,0.95)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    fontSize: "12px",
                    color: "rgba(255,255,255,0.7)",
                  }}
                  itemStyle={{ color: "rgba(255,255,255,0.7)" }}
                  labelStyle={{ color: "rgba(255,255,255,0.4)" }}
                />
                <Area
                  type="monotone"
                  dataKey="pageViews"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="url(#pvGrad)"
                  dot={false}
                  activeDot={{ r: 3, fill: "#3b82f6" }}
                />
                <Area
                  type="monotone"
                  dataKey="sessions"
                  stroke="#8b5cf6"
                  strokeWidth={1.5}
                  fill="url(#sessGrad)"
                  dot={false}
                  activeDot={{ r: 3, fill: "#8b5cf6" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
        <div
          className="absolute top-0 left-0 right-0 h-[1px] opacity-30"
          style={{ background: "linear-gradient(90deg, transparent, #3b82f6, transparent)" }}
        />
      </Card>
    </motion.div>
  )
}
