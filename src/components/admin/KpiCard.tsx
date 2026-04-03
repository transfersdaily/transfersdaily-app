"use client"

import { GlassCard } from "@/components/ui/glass-card"
import { LineChart, Line, ResponsiveContainer } from "recharts"
import { motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"

function SparklineChart({ data, color }: { data: number[]; color: string }) {
  if (data.length === 0) return null
  const chartData = data.map((value) => ({ v: value }))
  return (
    <ResponsiveContainer width="100%" height={32}>
      <LineChart data={chartData}>
        <Line
          type="monotone"
          dataKey="v"
          stroke={color}
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

function getTrend(data: number[]): "up" | "down" | "flat" {
  if (data.length < 4) return "flat"
  const midpoint = Math.floor(data.length / 2)
  const recent = data.slice(midpoint)
  const older = data.slice(0, midpoint)
  const recentAvg = recent.reduce((s, v) => s + v, 0) / recent.length
  const olderAvg = older.reduce((s, v) => s + v, 0) / older.length
  if (olderAvg === 0 && recentAvg === 0) return "flat"
  if (olderAvg === 0) return "up"
  if (recentAvg > olderAvg * 1.1) return "up"
  if (recentAvg < olderAvg * 0.9) return "down"
  return "flat"
}

interface KpiCardProps {
  label: string
  value: number
  sparklineData?: number[]
  icon: LucideIcon
  subtitle?: string
  accentColor?: string
  delay?: number
}

const trendConfig = {
  up: { color: "#22c55e", label: "Trending up" },
  down: { color: "#ef4444", label: "Trending down" },
  flat: { color: "#64748b", label: "Stable" },
} as const

export function KpiCard({
  label,
  value,
  sparklineData = [],
  icon: Icon,
  subtitle,
  accentColor,
  delay = 0,
}: KpiCardProps) {
  const trend = getTrend(sparklineData)
  const color = accentColor || trendConfig[trend].color

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
    >
      <GlassCard
        title={label}
        accentColor={color}
        hoverable
        className="shadow-sm group"
        icon={
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04] group-hover:bg-white/[0.08] transition-colors">
            <Icon className="h-4 w-4 text-white/30" />
          </div>
        }
      >
          <div className="text-3xl font-bold tracking-tight mt-2 text-white">
            {new Intl.NumberFormat("en-US").format(value)}
          </div>
          {subtitle && (
            <p className="text-[11px] text-white/30 mt-1">{subtitle}</p>
          )}
          <div className="mt-auto">
            {sparklineData.length > 0 && (
              <SparklineChart data={sparklineData} color={color} />
            )}
          </div>
      </GlassCard>
    </motion.div>
  )
}
