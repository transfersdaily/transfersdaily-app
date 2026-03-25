"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Activity,
  FileText,
  Radio,
  TrendingUp,
} from "lucide-react"
import type { PipelineStatsResponse } from "@/types/pipeline"

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
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString()
}

interface PipelineMonitorProps {
  stats: PipelineStatsResponse | null
  isLoading: boolean
}

export function PipelineMonitor({ stats, isLoading }: PipelineMonitorProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Skeleton summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-4" />
                </div>
                <Skeleton className="h-8 w-16 mb-1" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Skeleton table */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!stats || stats.sources.length === 0) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <Activity className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No pipeline data available yet</p>
              <p className="text-xs mt-1">Stats will appear after the first pipeline run</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const summaryCards = [
    {
      title: "Total Sources",
      value: stats.summary.totalSources,
      icon: Radio,
    },
    {
      title: "Active Sources (24h)",
      value: stats.summary.activeSources24h,
      icon: Activity,
    },
    {
      title: "Articles (24h)",
      value: stats.summary.totalArticles24h,
      icon: FileText,
    },
    {
      title: "Published (24h)",
      value: stats.summary.totalPublished24h,
      icon: TrendingUp,
    },
  ]

  const sortedSources = [...stats.sources].sort(
    (a, b) => b.articles24h - a.articles24h
  )

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card) => {
          const Icon = card.icon
          return (
            <Card key={card.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    {card.title}
                  </span>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="text-2xl font-bold">{card.value}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Per-Source Stats Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Per-Source Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-2 pr-4">Source</th>
                  <th className="pb-2 pr-4 text-right">Total</th>
                  <th className="pb-2 pr-4 text-right">24h</th>
                  <th className="pb-2 pr-4 text-right">7d</th>
                  <th className="pb-2 pr-4 text-right">Published (24h)</th>
                  <th className="pb-2 pr-4 text-right">Drafts (24h)</th>
                  <th className="pb-2">Last Article</th>
                </tr>
              </thead>
              <tbody>
                {sortedSources.map((source) => {
                  const hasDraftImbalance =
                    source.drafts24h > source.published24h
                  return (
                    <tr
                      key={source.sourceName}
                      className={`border-b last:border-0 ${
                        hasDraftImbalance ? "bg-amber-50" : ""
                      }`}
                    >
                      <td className="py-2 pr-4 font-medium">
                        {source.sourceName}
                      </td>
                      <td className="py-2 pr-4 text-right tabular-nums">
                        {source.articlesTotal}
                      </td>
                      <td className="py-2 pr-4 text-right tabular-nums">
                        {source.articles24h}
                      </td>
                      <td className="py-2 pr-4 text-right tabular-nums">
                        {source.articles7d}
                      </td>
                      <td className="py-2 pr-4 text-right tabular-nums">
                        {source.published24h}
                      </td>
                      <td className="py-2 pr-4 text-right tabular-nums">
                        {source.drafts24h}
                      </td>
                      <td className="py-2 whitespace-nowrap text-muted-foreground">
                        {source.lastArticleAt
                          ? formatRelativeTime(source.lastArticleAt)
                          : "Never"}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
