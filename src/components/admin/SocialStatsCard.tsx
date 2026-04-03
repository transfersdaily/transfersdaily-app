"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Share2 } from "lucide-react"
import { motion } from "framer-motion"
import { useSocialStats } from "@/hooks/use-social"
import type { PlatformAggregateStats } from "@/types/social"

const PLATFORM_COLORS: Record<string, string> = {
  twitter: "#1DA1F2",
  bluesky: "#0085FF",
  facebook: "#1877F2",
  threads: "#999999",
}

function PlatformRow({ stat, index }: { stat: PlatformAggregateStats; index: number }) {
  const successRate = stat.attempted > 0
    ? Math.round((stat.succeeded / stat.attempted) * 100)
    : 0
  const color = PLATFORM_COLORS[stat.platform] || "#64748b"

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-center justify-between py-2.5"
    >
      <div className="flex items-center gap-3">
        <div
          className="h-2 w-2 rounded-full shrink-0"
          style={{ backgroundColor: color }}
        />
        <span className="text-sm text-white/70">{stat.label}</span>
      </div>
      <div className="flex items-center gap-3">
        {stat.attempted === 0 ? (
          <span className="text-xs text-white/20">No posts</span>
        ) : (
          <>
            <span className="text-xs text-white/30 tabular-nums">
              {stat.succeeded}/{stat.attempted}
            </span>
            <div className="w-12 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${successRate}%`,
                  backgroundColor: successRate >= 90 ? "#22c55e" : successRate >= 50 ? "#eab308" : "#ef4444",
                }}
              />
            </div>
            <span className="text-xs font-medium text-white/50 w-8 text-right tabular-nums">{successRate}%</span>
          </>
        )}
      </div>
    </motion.div>
  )
}

interface SocialStatsCardProps {
  delay?: number
}

export function SocialStatsCard({ delay = 0 }: SocialStatsCardProps) {
  const [period, setPeriod] = useState<"7d" | "30d">("7d")
  const { data, isLoading, isError } = useSocialStats(period)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
    >
      <Card className="relative overflow-hidden bg-white/[0.03] border border-white/[0.06] backdrop-blur-md hover:bg-white/[0.05] transition-colors duration-300">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04]">
                <Share2 className="h-4 w-4 text-white/30" />
              </div>
              <span className="text-xs font-medium text-white/40 uppercase tracking-wider">Social Media</span>
            </div>
            <div className="flex gap-1 p-0.5 rounded-lg bg-white/[0.04]">
              {(["7d", "30d"] as const).map(p => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`text-[10px] px-2.5 py-1 rounded-md font-medium transition-all ${
                    period === p
                      ? "bg-white/[0.1] text-white shadow-sm"
                      : "text-white/30 hover:text-white/50"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between py-2.5">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-2 w-2 rounded-full bg-white/[0.06]" />
                    <Skeleton className="h-4 w-20 bg-white/[0.06]" />
                  </div>
                  <Skeleton className="h-4 w-24 bg-white/[0.06]" />
                </div>
              ))}
            </div>
          ) : isError ? (
            <p className="text-sm text-white/30 py-4 text-center">
              Failed to load social stats
            </p>
          ) : data ? (
            <>
              <div className="divide-y divide-white/[0.04]">
                {data.platforms.map((stat, i) => (
                  <PlatformRow key={stat.platform} stat={stat} index={i} />
                ))}
              </div>
              {data.totals.attempted > 0 && (
                <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
                  <span className="text-white/30">
                    {data.totals.succeeded}/{data.totals.attempted} posts delivered
                  </span>
                  {data.totals.failed > 0 && (
                    <span className="text-red-400/70">{data.totals.failed} failed</span>
                  )}
                </div>
              )}
            </>
          ) : null}
        </CardContent>
        <div
          className="absolute top-0 left-0 right-0 h-[1px] opacity-40"
          style={{ background: "linear-gradient(90deg, transparent, #1DA1F2, transparent)" }}
        />
      </Card>
    </motion.div>
  )
}

export function SocialStatsCardSkeleton() {
  return (
    <Card className="bg-white/[0.03] border border-white/[0.06] backdrop-blur-md">
      <CardContent className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="h-8 w-8 rounded-lg bg-white/[0.06]" />
          <Skeleton className="h-3 w-24 bg-white/[0.06]" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between py-2.5">
              <div className="flex items-center gap-3">
                <Skeleton className="h-2 w-2 rounded-full bg-white/[0.06]" />
                <Skeleton className="h-4 w-20 bg-white/[0.06]" />
              </div>
              <Skeleton className="h-4 w-24 bg-white/[0.06]" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
