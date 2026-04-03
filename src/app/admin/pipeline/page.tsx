"use client"

import { useQueryClient } from "@tanstack/react-query"
import { PipelineMonitor } from "@/components/admin/PipelineMonitor"
import { PipelineErrorLog } from "@/components/admin/PipelineErrorLog"
import { SourceHeatmap } from "@/components/admin/SourceHeatmap"
import { usePipelineStats, usePipelineErrors, usePipelineHeatmap } from "@/hooks/use-pipeline"
import { RefreshCw, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"

export default function PipelinePage() {
  const queryClient = useQueryClient()
  const statsQuery = usePipelineStats()
  const errorsQuery = usePipelineErrors()
  const heatmapQuery = usePipelineHeatmap()

  const isRefreshing =
    statsQuery.isFetching || errorsQuery.isFetching || heatmapQuery.isFetching

  function handleRefresh() {
    queryClient.invalidateQueries({ queryKey: ["admin", "pipeline"] })
  }

  const errors = [
    statsQuery.isError && "pipeline stats",
    errorsQuery.isError && "error log",
    heatmapQuery.isError && "heatmap data",
  ].filter(Boolean)

  return (
    <div className="space-y-6">
      {/* Action bar */}
      <div className="flex items-center justify-between">
        <div />
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3.5 py-2 text-xs font-medium text-white/50 hover:text-white/70 hover:bg-white/[0.06] transition-all disabled:opacity-30"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Error banners */}
      {errors.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl border border-red-500/20 bg-red-500/5"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-400/70" />
            <span className="text-sm text-red-400/70">
              Failed to load: {errors.join(", ")}
            </span>
          </div>
        </motion.div>
      )}

      {/* Heatmap */}
      <SourceHeatmap
        heatmap={heatmapQuery.data ?? null}
        isLoading={heatmapQuery.isLoading}
      />

      {/* Per-source stats */}
      <PipelineMonitor
        stats={statsQuery.data ?? null}
        isLoading={statsQuery.isLoading}
      />

      {/* Error log */}
      <PipelineErrorLog
        errors={errorsQuery.data ?? null}
        isLoading={errorsQuery.isLoading}
      />
    </div>
  )
}
