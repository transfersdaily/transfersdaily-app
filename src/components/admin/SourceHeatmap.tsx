"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { LayoutGrid } from "lucide-react"
import type { PipelineHeatmapResponse, PipelineHeatmapCell } from "@/types/pipeline"

const STATUS_COLORS: Record<PipelineHeatmapCell["status"], string> = {
  green: "bg-green-500",
  yellow: "bg-amber-400",
  red: "bg-red-500",
  gray: "bg-gray-200",
}

const LEGEND_ITEMS: { status: PipelineHeatmapCell["status"]; label: string }[] = [
  { status: "green", label: "Published" },
  { status: "yellow", label: "Drafts Only" },
  { status: "red", label: "Errors" },
  { status: "gray", label: "No Data" },
]

interface SourceHeatmapProps {
  heatmap: PipelineHeatmapResponse | null
  isLoading: boolean
}

export function SourceHeatmap({ heatmap, isLoading }: SourceHeatmapProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LayoutGrid className="h-5 w-5" />
            Source Health (7 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex gap-2 items-center">
                <Skeleton className="h-4 w-28 shrink-0" />
                {Array.from({ length: 7 }).map((_, j) => (
                  <Skeleton key={j} className="h-8 w-full rounded-sm" />
                ))}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!heatmap || heatmap.rows.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LayoutGrid className="h-5 w-5" />
            Source Health (7 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <LayoutGrid className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Heatmap data will appear after pipeline runs</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LayoutGrid className="h-5 w-5" />
          Source Health (7 Days)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div
            className="grid gap-1 min-w-[500px]"
            style={{
              gridTemplateColumns: `140px repeat(${heatmap.dateLabels.length}, 1fr)`,
            }}
          >
            {/* Header row */}
            <div className="text-xs text-muted-foreground font-medium" />
            {heatmap.dateLabels.map((label) => (
              <div
                key={label}
                className="text-xs text-muted-foreground font-medium text-center"
              >
                {label}
              </div>
            ))}

            {/* Data rows */}
            {heatmap.rows.map((row) => (
              <>
                <div
                  key={`label-${row.sourceName}`}
                  className="text-sm font-medium truncate pr-2 flex items-center"
                  title={row.sourceName}
                >
                  {row.sourceName}
                </div>
                {row.days.map((cell, dayIndex) => (
                  <div
                    key={`${row.sourceName}-${dayIndex}`}
                    className={`h-8 rounded-sm ${STATUS_COLORS[cell.status]} transition-opacity hover:opacity-80`}
                    title={`${row.sourceName} - ${heatmap.dateLabels[dayIndex]}: ${cell.articleCount} articles, ${cell.publishedCount} published`}
                  />
                ))}
              </>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-100">
          {LEGEND_ITEMS.map((item) => (
            <div key={item.status} className="flex items-center gap-1.5">
              <div
                className={`h-3 w-3 rounded-sm ${STATUS_COLORS[item.status]}`}
              />
              <span className="text-xs text-muted-foreground">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
