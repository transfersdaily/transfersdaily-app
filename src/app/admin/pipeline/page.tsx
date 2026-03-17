"use client"

import { useState, useEffect, useCallback } from "react"
import { AdminPageLayout } from "@/components/admin/AdminPageLayout"
import { PipelineMonitor } from "@/components/admin/PipelineMonitor"
import type { PipelineStats } from "@/components/admin/PipelineMonitor"
import { adminApi } from "@/lib/api"
import { Activity, RefreshCw } from "lucide-react"

export default function PipelinePage() {
  const [stats, setStats] = useState<PipelineStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPipelineStats = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await adminApi.getPipelineStats()
      setStats(data)
    } catch (err) {
      console.error("Failed to fetch pipeline stats:", err)
      setError("Failed to load pipeline statistics")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPipelineStats()
  }, [fetchPipelineStats])

  return (
    <AdminPageLayout
      title="Pipeline Monitor"
      actions={
        <button
          onClick={fetchPipelineStats}
          disabled={isLoading}
          className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted transition-colors disabled:opacity-50"
        >
          <RefreshCw
            className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      }
    >
      {error && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <div className="flex items-center gap-2 text-destructive">
            <Activity className="h-4 w-4" />
            <span className="font-medium">Connection Error</span>
          </div>
          <p className="text-red-700 text-sm mt-1">{error}</p>
          <button
            onClick={fetchPipelineStats}
            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          >
            Retry Connection
          </button>
        </div>
      )}

      <PipelineMonitor stats={stats} isLoading={isLoading} />
    </AdminPageLayout>
  )
}
