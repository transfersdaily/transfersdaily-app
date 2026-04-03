"use client"

import { GlassCard } from "@/components/ui/glass-card"
import { Activity, CheckCircle, AlertTriangle, XCircle } from "lucide-react"
import { motion } from "framer-motion"
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
  return `${diffDays}d ago`
}

interface PipelineHealthCardProps {
  health: PipelineHealthSummary | null
  delay?: number
}

export function PipelineHealthCard({ health, delay = 0 }: PipelineHealthCardProps) {
  const isHealthy = health && health.successRate24h >= 90
  const isWarning = health && health.successRate24h >= 70 && health.successRate24h < 90
  const statusColor = !health
    ? "#64748b"
    : isHealthy
      ? "#22c55e"
      : isWarning
        ? "#eab308"
        : "#ef4444"

  const StatusIcon = !health
    ? Activity
    : isHealthy
      ? CheckCircle
      : isWarning
        ? AlertTriangle
        : XCircle

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
    >
      <GlassCard
        title="Pipeline Health"
        accentColor={statusColor}
        hoverable
        icon={
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04]">
            <StatusIcon className="h-4 w-4" style={{ color: statusColor }} />
          </div>
        }
      >
          {!health ? (
            <div className="flex items-center gap-2 py-4">
              <Activity className="h-4 w-4 text-white/20" />
              <span className="text-sm text-white/30">No pipeline activity detected</span>
            </div>
          ) : (
            <>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-4xl font-bold tracking-tight" style={{ color: statusColor }}>
                  {Math.round(health.successRate24h)}%
                </span>
                <span className="text-xs text-white/30">success rate</span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-2 rounded-lg bg-white/[0.03]">
                  <p className="text-lg font-semibold text-white">{health.totalProcessed24h}</p>
                  <p className="text-[10px] text-white/30 mt-0.5">Processed</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-white/[0.03]">
                  <p className="text-lg font-semibold text-emerald-400">{health.totalPublished24h}</p>
                  <p className="text-[10px] text-white/30 mt-0.5">Published</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-white/[0.03]">
                  <p className="text-lg font-semibold text-amber-400">{health.failureCount24h}</p>
                  <p className="text-[10px] text-white/30 mt-0.5">Stuck</p>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center justify-between">
                <span className="text-[11px] text-white/30">
                  Last activity: {health.lastRunTime ? formatRelativeTime(health.lastRunTime) : "Never"}
                </span>
              </div>
            </>
          )}
      </GlassCard>
    </motion.div>
  )
}
