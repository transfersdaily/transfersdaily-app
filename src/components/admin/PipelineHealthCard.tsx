"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity } from "lucide-react"
import type { PipelineHealthSummary } from "@/types/pipeline"

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMinutes = Math.floor(diffMs / (1000 * 60))

  if (diffMinutes < 1) return "Just now"
  if (diffMinutes < 60) return `${diffMinutes}m ago`
  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays === 1) return "1d ago"
  return `${diffDays}d ago`
}

function getSuccessRateColor(rate: number): string {
  if (rate >= 90) return "text-green-400"
  if (rate >= 70) return "text-amber-400"
  return "text-red-400"
}

interface PipelineHealthCardProps {
  health: PipelineHealthSummary | null
}

export function PipelineHealthCard({ health }: PipelineHealthCardProps) {
  if (!health) {
    return (
      <Card className="h-[140px] bg-[#1a1a1a] border border-[#2a2a2a] shadow-sm">
        <CardContent className="p-5 h-full flex flex-col">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Pipeline Health</span>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex-1 flex items-center">
            <span className="text-sm text-muted-foreground">Pipeline data unavailable</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  const rateColor = getSuccessRateColor(health.successRate24h)

  return (
    <Card className="h-[140px] bg-[#1a1a1a] border border-[#2a2a2a] shadow-sm">
      <CardContent className="p-5 h-full flex flex-col">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Pipeline Health</span>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className={`text-3xl font-bold tracking-tight mt-1 ${rateColor}`}>
          {Math.round(health.successRate24h)}%
        </div>
        <div className="mt-auto flex items-center justify-between text-xs">
          <span className="text-muted-foreground">
            Last run: {health.lastRunTime ? formatRelativeTime(health.lastRunTime) : "Never"}
          </span>
          {health.failureCount24h > 0 ? (
            <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
              {health.failureCount24h} failure{health.failureCount24h !== 1 ? "s" : ""}
            </Badge>
          ) : (
            <Badge className="text-[10px] px-1.5 py-0 bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/20">
              0 failures
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
