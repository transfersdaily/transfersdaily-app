"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Share2 } from "lucide-react"
import { useSocialStats } from "@/hooks/use-social"
import type { PlatformAggregateStats } from "@/types/social"

const PLATFORM_ICONS: Record<string, string> = {
  twitter: "X",
  bluesky: "BS",
  facebook: "FB",
  threads: "TH",
}

function PlatformRow({ stat }: { stat: PlatformAggregateStats }) {
  const successRate =
    stat.attempted > 0
      ? Math.round((stat.succeeded / stat.attempted) * 100)
      : 0

  return (
    <div className="flex items-center justify-between py-2 border-b border-[#2a2a2a] last:border-0">
      <div className="flex items-center gap-3">
        <span className="text-xs font-mono font-medium text-gray-500 w-6 text-center">
          {PLATFORM_ICONS[stat.platform] ?? stat.platform}
        </span>
        <span className="text-sm font-medium text-gray-100">{stat.label}</span>
      </div>
      <div className="flex items-center gap-2">
        {stat.attempted === 0 ? (
          <span className="text-xs text-gray-500">No posts</span>
        ) : (
          <>
            <span className="text-xs text-gray-500">
              {stat.succeeded}/{stat.attempted}
            </span>
            <Badge
              variant="outline"
              className={
                successRate >= 90
                  ? "text-[10px] px-1.5 py-0 bg-green-500/20 text-green-400 border-green-500/30"
                  : successRate >= 50
                    ? "text-[10px] px-1.5 py-0 bg-amber-500/20 text-amber-400 border-amber-500/30"
                    : "text-[10px] px-1.5 py-0 bg-red-500/20 text-red-400 border-red-500/30"
              }
            >
              {successRate}%
            </Badge>
          </>
        )}
      </div>
    </div>
  )
}

export function SocialStatsCard() {
  const [period, setPeriod] = useState<"7d" | "30d">("7d")
  const { data, isLoading, isError } = useSocialStats(period)

  return (
    <Card className="bg-[#1a1a1a] border border-[#2a2a2a] shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Share2 className="h-4 w-4 text-gray-400" />
            <CardTitle className="text-sm font-medium text-gray-400">
              Social Media
            </CardTitle>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => setPeriod("7d")}
              className={`text-[10px] px-2 py-0.5 rounded-full transition-colors ${
                period === "7d"
                  ? "bg-white text-[#0a0a0a]"
                  : "bg-[#222222] text-gray-400 hover:bg-[#2a2a2a]"
              }`}
            >
              7d
            </button>
            <button
              onClick={() => setPeriod("30d")}
              className={`text-[10px] px-2 py-0.5 rounded-full transition-colors ${
                period === "30d"
                  ? "bg-white text-[#0a0a0a]"
                  : "bg-[#222222] text-gray-400 hover:bg-[#2a2a2a]"
              }`}
            >
              30d
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-4 w-6" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <p className="text-sm text-gray-400 py-4 text-center">
            Failed to load social stats
          </p>
        ) : data ? (
          <>
            <div className="divide-y-0">
              {data.platforms.map((stat) => (
                <PlatformRow key={stat.platform} stat={stat} />
              ))}
            </div>
            {data.totals.attempted > 0 && (
              <div className="mt-3 pt-3 border-t border-[#2a2a2a] flex items-center justify-between text-xs text-gray-500">
                <span>
                  Total: {data.totals.succeeded}/{data.totals.attempted} posts
                </span>
                <span>
                  {data.totals.failed > 0
                    ? `${data.totals.failed} failed`
                    : "All successful"}
                </span>
              </div>
            )}
          </>
        ) : null}
      </CardContent>
    </Card>
  )
}

export function SocialStatsCardSkeleton() {
  return (
    <Card className="bg-[#1a1a1a] border border-[#2a2a2a] shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-24" />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <Skeleton className="h-4 w-6" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
