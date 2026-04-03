"use client"

import { GlassCard } from "@/components/ui/glass-card"
import { Skeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion"
import type { PipelineSourceStats } from "@/types/pipeline"

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  if (diffMinutes < 1) return "now"
  if (diffMinutes < 60) return `${diffMinutes}m`
  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) return `${diffHours}h`
  return `${Math.floor(diffHours / 24)}d`
}

interface DashboardSourcesOverviewProps {
  sources?: PipelineSourceStats[]
  isLoading: boolean
}

export function DashboardSourcesOverview({ sources, isLoading }: DashboardSourcesOverviewProps) {
  const sortedSources = sources
    ? [...sources].sort((a, b) => b.articles24h - a.articles24h)
    : []

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.45, ease: "easeOut" }}
    >
      <GlassCard
        title="Sources (24h)"
        accentColor="#3b82f6"
        className="h-full"
        icon={
          <span className="text-[10px] text-white/20">
            {sortedSources.filter(s => s.articles24h > 0).length} active
          </span>
        }
      >
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <Skeleton className="h-3 w-24 bg-white/[0.06]" />
                  <Skeleton className="h-3 w-12 bg-white/[0.06]" />
                </div>
              ))}
            </div>
          ) : sortedSources.length === 0 ? (
            <div className="py-8 text-center text-sm text-white/20">
              No source data available
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[280px] overflow-y-auto scrollbar-thin">
              {sortedSources.map((source, i) => {
                const isActive = source.articles24h > 0
                return (
                  <motion.div
                    key={source.sourceName}
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="flex items-center justify-between py-1.5"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                        isActive ? "bg-emerald-400" : "bg-white/10"
                      }`} />
                      <span className={`text-xs truncate ${isActive ? "text-white/60" : "text-white/25"}`}>
                        {source.sourceName}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs tabular-nums text-white/40">
                        {source.articles24h > 0 ? source.articles24h : "-"}
                      </span>
                      <span className={`text-[10px] tabular-nums w-10 text-right ${
                        source.published24h > 0 ? "text-emerald-400/60" : "text-white/15"
                      }`}>
                        {source.published24h > 0 ? `${source.published24h} pub` : ""}
                      </span>
                      <span className="text-[10px] text-white/15 w-8 text-right">
                        {source.lastArticleAt ? formatRelativeTime(source.lastArticleAt) : "-"}
                      </span>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
      </GlassCard>
    </motion.div>
  )
}
