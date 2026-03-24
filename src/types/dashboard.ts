export interface DashboardResponse {
  publishedToday: number
  publishedThisWeek: number
  publishedThisMonth: number
  draftBacklog: number
  processingRate: number
  trends: { publishedDaily: number[]; draftsDaily: number[] }
  unreadMessages: number
  cachedAt: string
}
