"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Activity,
  FileText,
  Copy,
  AlertCircle,
} from "lucide-react"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart"

// Types

export interface PipelineRun {
  run_id: string
  started_at: string
  completed_at: string | null
  status: "running" | "completed" | "failed"
  articles_processed: number
  articles_published: number
  articles_skipped_duplicate: number
  articles_failed: number
  trigger_source: string
}

export interface SourceMetric {
  source_name: string
  total_runs: number
  total_articles: number
  last_active: string
  avg_success_rate: number
}

export interface PipelineStats {
  recent_runs: PipelineRun[]
  source_metrics: SourceMetric[]
  summary: {
    total_runs: number
    total_published: number
    total_skipped: number
    total_failed: number
  }
}

interface PipelineMonitorProps {
  stats: PipelineStats | null
  isLoading: boolean
}

const chartConfig = {
  articles: {
    label: "Articles",
    color: "#3b82f6",
  },
} satisfies ChartConfig

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60)
  )

  if (diffInHours < 1) return "Just now"
  if (diffInHours < 24) return `${diffInHours}h ago`
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays === 1) return "1d ago"
  if (diffInDays < 7) return `${diffInDays}d ago`
  return date.toLocaleDateString()
}

function getStatusBadgeVariant(
  status: string
): "default" | "destructive" | "secondary" {
  switch (status) {
    case "completed":
      return "default"
    case "failed":
      return "destructive"
    case "running":
      return "secondary"
    default:
      return "secondary"
  }
}

export function PipelineMonitor({ stats, isLoading }: PipelineMonitorProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Loading summary cards */}
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

        {/* Loading recent runs table */}
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

        {/* Loading source metrics */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  const summaryCards = [
    {
      title: "Total Runs",
      value: stats?.summary.total_runs ?? 0,
      icon: Activity,
      className: "",
    },
    {
      title: "Articles Published",
      value: stats?.summary.total_published ?? 0,
      icon: FileText,
      className: "",
    },
    {
      title: "Duplicates Skipped",
      value: stats?.summary.total_skipped ?? 0,
      icon: Copy,
      className: "",
    },
    {
      title: "Failures",
      value: stats?.summary.total_failed ?? 0,
      icon: AlertCircle,
      className:
        (stats?.summary.total_failed ?? 0) > 0 ? "text-red-600" : "",
    },
  ]

  const sourceChartData = (stats?.source_metrics ?? []).map((m) => ({
    name: m.source_name,
    articles: m.total_articles,
    successRate: m.avg_success_rate,
  }))

  return (
    <div className="space-y-6">
      {/* Summary Cards Row */}
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
                  <Icon className={`h-4 w-4 text-muted-foreground ${card.className}`} />
                </div>
                <div className={`text-2xl font-bold ${card.className}`}>
                  {card.value}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Runs Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Pipeline Runs
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stats && stats.recent_runs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-2 pr-4">Time</th>
                    <th className="pb-2 pr-4">Status</th>
                    <th className="pb-2 pr-4">Processed</th>
                    <th className="pb-2 pr-4">Published</th>
                    <th className="pb-2 pr-4">Skipped</th>
                    <th className="pb-2 pr-4">Failed</th>
                    <th className="pb-2">Trigger</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recent_runs.slice(0, 10).map((run) => (
                    <tr key={run.run_id} className="border-b last:border-0">
                      <td className="py-2 pr-4 whitespace-nowrap">
                        {formatRelativeTime(run.started_at)}
                      </td>
                      <td className="py-2 pr-4">
                        <Badge variant={getStatusBadgeVariant(run.status)}>
                          {run.status}
                        </Badge>
                      </td>
                      <td className="py-2 pr-4">{run.articles_processed}</td>
                      <td className="py-2 pr-4">{run.articles_published}</td>
                      <td className="py-2 pr-4">
                        {run.articles_skipped_duplicate}
                      </td>
                      <td className="py-2 pr-4">
                        <span
                          className={
                            run.articles_failed > 0 ? "text-red-600 font-medium" : ""
                          }
                        >
                          {run.articles_failed}
                        </span>
                      </td>
                      <td className="py-2">{run.trigger_source}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Activity className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No pipeline runs recorded yet</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Source Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            RSS Source Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stats && stats.source_metrics.length > 0 ? (
            <div className="space-y-6">
              {/* BarChart */}
              <div className="h-64 w-full">
                <ChartContainer config={chartConfig} className="h-full w-full">
                  <BarChart data={sourceChartData}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="name"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      interval={0}
                      fontSize={12}
                    />
                    <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                    <ChartTooltip
                      cursor={false}
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="rounded-lg border bg-background p-3 shadow-md">
                              <div className="font-medium mb-1">{label}</div>
                              <div className="text-sm">
                                Articles: {payload[0]?.value}
                              </div>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Bar dataKey="articles" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </div>

              {/* Source metrics table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-muted-foreground">
                      <th className="pb-2 pr-4">Source</th>
                      <th className="pb-2 pr-4">Total Runs</th>
                      <th className="pb-2 pr-4">Total Articles</th>
                      <th className="pb-2 pr-4">Success Rate</th>
                      <th className="pb-2">Last Active</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.source_metrics.map((source) => (
                      <tr
                        key={source.source_name}
                        className="border-b last:border-0"
                      >
                        <td className="py-2 pr-4 font-medium">
                          {source.source_name}
                        </td>
                        <td className="py-2 pr-4">{source.total_runs}</td>
                        <td className="py-2 pr-4">{source.total_articles}</td>
                        <td className="py-2 pr-4">
                          {source.avg_success_rate.toFixed(1)}%
                        </td>
                        <td className="py-2">
                          {formatRelativeTime(source.last_active)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Source metrics will appear after the first pipeline run</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
