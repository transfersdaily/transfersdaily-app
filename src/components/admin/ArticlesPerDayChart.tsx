'use client'

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts'
import { GlassCard } from '@/components/ui/glass-card'
import { Skeleton } from '@/components/ui/skeleton'
import { motion } from 'framer-motion'
import type { DailyArticleCount } from '@/types/content-analytics'

interface ArticlesPerDayChartProps {
  data: DailyArticleCount[] | undefined
  isLoading: boolean
}

export function ArticlesPerDayChart({ data, isLoading }: ArticlesPerDayChartProps) {
  const hasData = data && data.length > 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <GlassCard
        title="Articles Per Day"
        subtitle="Last 30 days"
        accentColor="#22c55e"
        icon={
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-[10px] text-white/30">Published</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-amber-400" />
              <span className="text-[10px] text-white/30">Drafts</span>
            </div>
          </div>
        }
      >
          {isLoading ? (
            <Skeleton className="h-[280px] w-full bg-white/[0.04]" />
          ) : !hasData ? (
            <div className="flex items-center justify-center h-[280px] text-sm text-white/20">
              No data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="contentPubGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="contentDraftGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#eab308" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#eab308" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis
                  dataKey="label"
                  tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 10 }}
                  axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
                  tickLine={false}
                  interval={Math.max(0, Math.floor((data.length / 7) - 1))}
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
                />
                <Area type="monotone" dataKey="published" stroke="#22c55e" strokeWidth={2} fill="url(#contentPubGrad)" dot={false} />
                <Area type="monotone" dataKey="drafts" stroke="#eab308" strokeWidth={1.5} fill="url(#contentDraftGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          )}
      </GlassCard>
    </motion.div>
  )
}
