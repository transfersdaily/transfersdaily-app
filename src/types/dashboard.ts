import type { PipelineHealthSummary } from './pipeline'

export interface DashboardResponse {
  publishedToday: number
  publishedThisWeek: number
  publishedThisMonth: number
  draftBacklog: number
  totalArticles: number
  processingRate: number
  trends: { publishedDaily: number[]; draftsDaily: number[] }
  unreadMessages: number
  pipelineHealth: PipelineHealthSummary | null
  cachedAt: string
}
