import { NextResponse } from 'next/server'
import { validateAuth } from '@/lib/supabase/auth-guard'
import { createClient } from '@/lib/supabase/server'
import { unstable_cache } from 'next/cache'
import type { DashboardResponse } from '@/types/dashboard'
import type { PipelineHealthSummary } from '@/types/pipeline'

function hoursAgo(h: number): string {
  return new Date(Date.now() - h * 60 * 60 * 1000).toISOString()
}

function daysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  d.setHours(0, 0, 0, 0)
  return d.toISOString()
}

function startOfMonth(): string {
  const d = new Date()
  d.setDate(1)
  d.setHours(0, 0, 0, 0)
  return d.toISOString()
}

function todayStart(): string {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d.toISOString()
}

function groupByDay(
  rows: Array<{ published_at?: string; created_at?: string }>,
  dateField: 'published_at' | 'created_at',
  daysBack: number
): number[] {
  const counts: Record<string, number> = {}

  // Initialize all days with 0
  for (let i = daysBack - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = d.toISOString().split('T')[0]
    counts[key] = 0
  }

  // Count rows per day
  for (const row of rows) {
    const dateStr = row[dateField]
    if (!dateStr) continue
    const key = new Date(dateStr).toISOString().split('T')[0]
    if (key in counts) {
      counts[key]++
    }
  }

  // Return as ordered array (oldest first)
  return Object.keys(counts)
    .sort()
    .map((key) => counts[key])
}

const getCachedDashboardData = unstable_cache(
  async (): Promise<DashboardResponse> => {
    const supabase = await createClient()

    const today = todayStart()
    const weekAgo = daysAgo(7)
    const monthStart = startOfMonth()

    const [
      todayResult,
      weekResult,
      monthResult,
      draftsResult,
      publishedTrendResult,
      draftsTrendResult,
      contactResult,
      pipeProcessedResult,
      pipePublishedResult,
      pipeStaleDraftsResult,
      pipeLastRunResult,
    ] = await Promise.all([
      // Published today
      supabase
        .from('articles')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'published')
        .gte('published_at', today)
        .catch(() => ({ count: null, error: null })),

      // Published this week
      supabase
        .from('articles')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'published')
        .gte('published_at', weekAgo)
        .catch(() => ({ count: null, error: null })),

      // Published this month
      supabase
        .from('articles')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'published')
        .gte('published_at', monthStart)
        .catch(() => ({ count: null, error: null })),

      // Draft backlog
      supabase
        .from('articles')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'draft')
        .catch(() => ({ count: null, error: null })),

      // 7-day published trend data
      supabase
        .from('articles')
        .select('published_at')
        .eq('status', 'published')
        .gte('published_at', weekAgo)
        .catch(() => ({ data: null, error: null })),

      // 7-day drafts trend data
      supabase
        .from('articles')
        .select('created_at')
        .eq('status', 'draft')
        .gte('created_at', weekAgo)
        .catch(() => ({ data: null, error: null })),

      // Unread contact messages — gracefully handle missing table
      supabase
        .from('contact_submissions')
        .select('id', { count: 'exact', head: true })
        .catch(() => ({ count: null, error: null })),

      // Pipeline: total articles created in last 24h
      supabase
        .from('articles')
        .select('id', { count: 'exact', head: true })
        .in('status', ['draft', 'published'])
        .gte('created_at', hoursAgo(24))
        .catch(() => ({ count: null, error: null })),

      // Pipeline: articles published in last 24h
      supabase
        .from('articles')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'published')
        .gte('published_at', hoursAgo(24))
        .catch(() => ({ count: null, error: null })),

      // Pipeline: stale drafts (failure proxy) — draft for >2h in last 24h
      supabase
        .from('articles')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'draft')
        .gte('created_at', hoursAgo(24))
        .lte('created_at', hoursAgo(2))
        .catch(() => ({ count: null, error: null })),

      // Pipeline: most recent published article
      supabase
        .from('articles')
        .select('published_at')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(1)
        .catch(() => ({ data: null, error: null })),
    ])

    const publishedToday = todayResult.count ?? 0
    const publishedThisWeek = weekResult.count ?? 0
    const publishedThisMonth = monthResult.count ?? 0
    const draftBacklog = draftsResult.count ?? 0

    // Processing rate: articles published in last 7 days / 7
    const processingRate =
      publishedThisWeek > 0
        ? Math.round((publishedThisWeek / 7) * 10) / 10
        : 0

    // Trend data
    const publishedDaily = groupByDay(
      (publishedTrendResult as { data: Array<{ published_at?: string }> | null }).data || [],
      'published_at',
      7
    )
    const draftsDaily = groupByDay(
      (draftsTrendResult as { data: Array<{ created_at?: string }> | null }).data || [],
      'created_at',
      7
    )

    // Unread messages — default to 0 if table missing or error
    const unreadMessages = contactResult.count ?? 0

    // Pipeline health summary
    let pipelineHealth: PipelineHealthSummary | null = null
    try {
      const totalProcessed24h = pipeProcessedResult.count ?? 0
      const totalPublished24h = pipePublishedResult.count ?? 0
      const failureCount24h = pipeStaleDraftsResult.count ?? 0
      const lastRunData = (pipeLastRunResult as { data: Array<{ published_at: string }> | null }).data
      const lastRunTime = lastRunData?.[0]?.published_at ?? null
      const successRate24h = totalProcessed24h > 0
        ? Math.round((totalPublished24h / totalProcessed24h) * 1000) / 10
        : 100

      pipelineHealth = {
        lastRunTime,
        successRate24h,
        failureCount24h,
        totalProcessed24h,
        totalPublished24h,
      }
    } catch {
      // Pipeline health queries failed -- degrade gracefully
      pipelineHealth = null
    }

    return {
      publishedToday,
      publishedThisWeek,
      publishedThisMonth,
      draftBacklog,
      processingRate,
      trends: {
        publishedDaily,
        draftsDaily,
      },
      unreadMessages,
      pipelineHealth,
      cachedAt: new Date().toISOString(),
    }
  },
  ['admin-dashboard'],
  { revalidate: 300 }
)

export async function GET() {
  const { user, error: authError } = await validateAuth()
  if (authError) return authError
  if (!user) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const data = await getCachedDashboardData()
    return NextResponse.json(data)
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { success: false, error: `Failed to fetch dashboard data: ${message}` },
      { status: 500 }
    )
  }
}
