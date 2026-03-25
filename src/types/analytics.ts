export interface KpiMetric {
  value: number
  change: number // percentage change vs previous period
}

export interface TrafficResponse {
  kpis: {
    pageViews: KpiMetric
    sessions: KpiMetric
    totalUsers: KpiMetric
    avgSessionDuration: KpiMetric // value in seconds
    bounceRate: KpiMetric // value 0-100 (already multiplied)
  }
  timeSeries: Array<{
    label: string // "Mar 1" for daily, "2 PM" for hourly
    pageViews: number
    sessions: number
  }>
  dateRange: string
  cachedAt: string
}

export interface TopArticlesResponse {
  articles: Array<{
    rank: number
    slug: string
    title: string | null // null if not found in DB
    pageViews: number
    avgDuration: number // seconds
    url: string // e.g. "/en/article/slug"
  }>
  dateRange: string
  cachedAt: string
}

export type DateRange = '1' | '7' | '30' | '90'

export const DATE_RANGE_OPTIONS = [
  { value: '1' as const, label: 'Last 24 hours' },
  { value: '7' as const, label: 'Last 7 days' },
  { value: '30' as const, label: 'Last 30 days' },
  { value: '90' as const, label: 'Last 90 days' },
] as const
