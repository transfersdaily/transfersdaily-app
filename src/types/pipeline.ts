// --- Health summary (embedded in dashboard response) ---
export interface PipelineHealthSummary {
  lastRunTime: string | null
  successRate24h: number
  failureCount24h: number
  totalProcessed24h: number
  totalPublished24h: number
}

// --- Per-source stats (PIPE-03) ---
export interface PipelineSourceStats {
  sourceName: string
  articlesTotal: number
  articles24h: number
  articles7d: number
  published24h: number
  published7d: number
  drafts24h: number
  lastArticleAt: string | null
}

export interface PipelineStatsResponse {
  sources: PipelineSourceStats[]
  summary: {
    totalSources: number
    activeSources24h: number
    totalArticles24h: number
    totalPublished24h: number
  }
  cachedAt: string
}

// --- Error/failure log (PIPE-02) ---
export interface PipelineError {
  id: string
  sourceName: string
  errorMessage: string
  errorStep: string
  occurredAt: string
  articleTitle?: string
  resolved: boolean
}

export interface PipelineErrorsResponse {
  errors: PipelineError[]
  totalCount: number
  cachedAt: string
}

// --- Heatmap (PIPE-04) ---
export interface PipelineHeatmapCell {
  status: 'green' | 'yellow' | 'red' | 'gray'
  articleCount: number
  publishedCount: number
}

export interface PipelineHeatmapRow {
  sourceName: string
  days: PipelineHeatmapCell[]
}

export interface PipelineHeatmapResponse {
  rows: PipelineHeatmapRow[]
  dateLabels: string[]
  cachedAt: string
}
