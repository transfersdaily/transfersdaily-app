"use client"

import { useQueryClient } from "@tanstack/react-query"
import { AdminPageLayout } from "@/components/admin/AdminPageLayout"
import { PipelineMonitor } from "@/components/admin/PipelineMonitor"
import { PipelineErrorLog } from "@/components/admin/PipelineErrorLog"
import { SourceHeatmap } from "@/components/admin/SourceHeatmap"
import { usePipelineStats, usePipelineErrors, usePipelineHeatmap } from "@/hooks/use-pipeline"
import { Activity, RefreshCw } from "lucide-react"

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

  return (
    <AdminPageLayout
      title="Pipeline Monitor"
      actions={
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary transition-colors disabled:opacity-50"
        >
          <RefreshCw
            className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      }
    >
      <div className="space-y-6">
        {/* Per-query error banners */}
        {statsQuery.isError && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="flex items-center gap-2 text-destructive">
              <Activity className="h-4 w-4" />
              <span className="font-medium">Failed to load pipeline stats</span>
            </div>
          </div>
        )}

        {errorsQuery.isError && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="flex items-center gap-2 text-destructive">
              <Activity className="h-4 w-4" />
              <span className="font-medium">Failed to load error log</span>
            </div>
          </div>
        )}

        {heatmapQuery.isError && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="flex items-center gap-2 text-destructive">
              <Activity className="h-4 w-4" />
              <span className="font-medium">Failed to load heatmap data</span>
            </div>
          </div>
        )}

        {/* Heatmap - visual overview at top */}
        <SourceHeatmap
          heatmap={heatmapQuery.data ?? null}
          isLoading={heatmapQuery.isLoading}
        />

        {/* Per-source stats */}
        <PipelineMonitor
          stats={statsQuery.data ?? null}
          isLoading={statsQuery.isLoading}
        />

        {/* Error log at bottom */}
        <PipelineErrorLog
          errors={errorsQuery.data ?? null}
          isLoading={errorsQuery.isLoading}
        />
      </div>
    </AdminPageLayout>
  )
}
