import { NextResponse } from 'next/server'
import { validateAuth } from '@/lib/supabase/auth-guard'
import { API_CONFIG } from '@/lib/config'
import type { DashboardResponse } from '@/types/dashboard'

const API_BASE_URL = API_CONFIG.baseUrl
const API_KEY = process.env.API_GATEWAY_API_KEY || ''

export async function GET() {
  const { user, error: authError } = await validateAuth()
  if (authError) return authError
  if (!user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Proxy through Lambda backend which has direct DB access
    const response = await fetch(`${API_BASE_URL}/admin/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'X-User-Id': user.id,
      },
      signal: AbortSignal.timeout(10000),
    })

    if (!response.ok) {
      throw new Error(`Lambda stats API returned ${response.status}`)
    }

    const raw = await response.json()

    const totalPublished = parseInt(raw.published || '0')
    const totalDrafts = parseInt(raw.drafts || '0')
    const last24h = parseInt(raw.last_24h || '0')

    // Build daily trend from Lambda data if available
    const dailyActivity: Array<{ date: string; published_count?: number; draft_count?: number; count?: number }> = raw.daily_activity || []
    const publishedDaily = dailyActivity.length > 0
      ? dailyActivity.map((d: { published_count?: number; count?: number }) => d.published_count ?? d.count ?? 0)
      : Array(7).fill(0)
    const draftsDaily = dailyActivity.length > 0
      ? dailyActivity.map((d: { draft_count?: number }) => d.draft_count ?? 0)
      : Array(7).fill(0)

    const data: DashboardResponse = {
      publishedToday: last24h,
      publishedThisWeek: totalPublished,
      publishedThisMonth: totalPublished,
      draftBacklog: totalDrafts,
      processingRate: last24h > 0 ? Math.round(last24h * 10) / 10 : 0,
      trends: {
        publishedDaily,
        draftsDaily,
      },
      unreadMessages: 0,
      pipelineHealth: {
        lastRunTime: new Date().toISOString(),
        successRate24h: totalPublished > 0 ? Math.round((totalPublished / (totalPublished + totalDrafts)) * 1000) / 10 : 100,
        failureCount24h: 0,
        totalProcessed24h: last24h,
        totalPublished24h: last24h,
      },
      cachedAt: new Date().toISOString(),
    }

    return NextResponse.json(data)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { success: false, error: `Failed to fetch dashboard data: ${message}` },
      { status: 500 }
    )
  }
}
