"use client"

import { Card, CardContent } from "@/components/ui/card"
import { LineChart, Line, ResponsiveContainer } from "recharts"
import type { LucideIcon } from "lucide-react"

function SparklineChart({ data, color }: { data: number[]; color: string }) {
  const chartData = data.map((value) => ({ v: value }))
  return (
    <ResponsiveContainer width="100%" height={24}>
      <LineChart data={chartData}>
        <Line
          type="monotone"
          dataKey="v"
          stroke={color}
          strokeWidth={1.5}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

function getTrend(data: number[]): "up" | "down" | "flat" {
  if (data.length < 7) return "flat"
  const recent = (data[4] + data[5] + data[6]) / 3
  const older = (data[0] + data[1] + data[2] + data[3]) / 4
  if (recent > older * 1.1) return "up"
  if (recent < older * 0.9) return "down"
  return "flat"
}

interface KpiCardProps {
  label: string
  value: number
  sparklineData: number[]
  icon: LucideIcon
  subtitle?: string
}

const trendColors = {
  up: "#22c55e",
  down: "#ef4444",
  flat: "#94a3b8",
} as const

export function KpiCard({ label, value, sparklineData, icon: Icon, subtitle }: KpiCardProps) {
  const trend = getTrend(sparklineData)
  const color = trendColors[trend]

  return (
    <Card className="h-[140px] bg-card border border-border shadow-sm">
      <CardContent className="p-5 h-full flex flex-col">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{label}</span>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="text-3xl font-bold tracking-tight mt-1">
          {new Intl.NumberFormat("en-US").format(value)}
        </div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
        <div className="mt-auto h-6">
          <SparklineChart data={sparklineData} color={color} />
        </div>
      </CardContent>
    </Card>
  )
}
