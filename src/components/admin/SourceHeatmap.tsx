"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { motion } from "framer-motion"
import type { PipelineHeatmapResponse, PipelineHeatmapCell } from "@/types/pipeline"

const STATUS_COLORS: Record<PipelineHeatmapCell["status"], string> = {
  green: "bg-emerald-500/70",
  yellow: "bg-amber-400/60",
  red: "bg-red-500/60",
  gray: "bg-white/[0.04]",
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
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="relative overflow-hidden bg-white/[0.03] border border-white/[0.06] backdrop-blur-md">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider">Source Health</h3>
              <p className="text-[11px] text-white/20 mt-0.5">Last 7 days</p>
            </div>
            <div className="flex items-center gap-3">
              {LEGEND_ITEMS.map((item) => (
                <div key={item.status} className="flex items-center gap-1.5">
                  <div className={`h-2.5 w-2.5 rounded-sm ${STATUS_COLORS[item.status]}`} />
                  <span className="text-[10px] text-white/25">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <Skeleton className="h-4 w-28 shrink-0 bg-white/[0.04]" />
                  {Array.from({ length: 7 }).map((_, j) => (
                    <Skeleton key={j} className="h-7 w-full rounded-md bg-white/[0.04]" />
                  ))}
                </div>
              ))}
            </div>
          ) : !heatmap || heatmap.rows.length === 0 ? (
            <div className="text-center py-10 text-sm text-white/20">
              Heatmap data will appear after pipeline runs
            </div>
          ) : (
            <TooltipProvider delayDuration={0}>
              <div className="overflow-x-auto">
                <div
                  className="grid gap-1.5 min-w-[500px]"
                  style={{
                    gridTemplateColumns: `140px repeat(${heatmap.dateLabels.length}, 1fr)`,
                  }}
                >
                  {/* Header row */}
                  <div />
                  {heatmap.dateLabels.map((label) => (
                    <div key={label} className="text-[10px] text-white/20 font-medium text-center">
                      {new Date(label + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })}
                    </div>
                  ))}

                  {/* Data rows */}
                  {heatmap.rows.map((row) => (
                    <div key={row.sourceName} className="contents">
                      <div className="text-xs font-medium text-white/40 truncate pr-2 flex items-center">
                        {row.sourceName}
                      </div>
                      {row.days.map((cell, dayIndex) => (
                        <Tooltip key={`${row.sourceName}-${dayIndex}`}>
                          <TooltipTrigger asChild>
                            <div
                              className={`h-7 rounded-md ${STATUS_COLORS[cell.status]} transition-all hover:opacity-80 hover:scale-105 cursor-default`}
                            />
                          </TooltipTrigger>
                          <TooltipContent side="top" className="bg-[#0e0e14] border-white/10 text-white/70">
                            <p className="text-xs font-medium">{row.sourceName}</p>
                            <p className="text-[10px] text-white/40">{heatmap.dateLabels[dayIndex]}</p>
                            <p className="text-[10px] text-white/50 mt-1">
                              {cell.articleCount} articles, {cell.publishedCount} published
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </TooltipProvider>
          )}
        </CardContent>
        <div className="absolute top-0 left-0 right-0 h-[1px] opacity-30" style={{ background: "linear-gradient(90deg, transparent, #22c55e, transparent)" }} />
      </Card>
    </motion.div>
  )
}
