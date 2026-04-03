import { NextResponse } from 'next/server'
import { validateAuth } from '@/lib/supabase/auth-guard'
import { createAdminClient } from '@/lib/supabase/admin'
import { unstable_cache } from 'next/cache'
import type { DashboardResponse } from '@/types/dashboard'

function todayStart(): string {
  const d = new Date()
  d.setUTCHours(0, 0, 0, 0)
  return d.toISOString()
}

function daysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  d.setUTCHours(0, 0, 0, 0)
  return d.toISOString()
}

function hoursAgo(h: number): string {
  return new Date(Date.now() - h * 60 * 60 * 1000).toISOString()
}

function monthStart(): string {
  const d = new Date()
  d.setUTCDate(1)
  d.setUTCHours(0, 0, 0, 0)
  return d.toISOString()
}

const getCachedDashboard = unstable_cache(
  async (): Promise<DashboardResponse> => {
    const supabase = createAdminClient()
    const today = todayStart()
    const weekAgo = daysAgo(7)
    const monthAgo = monthStart()
    const sevenDaysAgo = daysAgo(7)
    const now24h = hoursAgo(24)

    const [
      publishedTodayRes,
      publishedWeekRes,
      publishedMonthRes,
      draftsRes,
      totalArticlesRes,
      trendRes,
      draftTrendRes,
      unreadRes,
      recentArticles24h,
    ] = await Promise.all([
      supabase.from('articles').select('id', { count: 'exact', head: true })
        .eq('status', 'published').gte('published_at', today),
      supabase.from('articles').select('id', { count: 'exact', head: true })
        .eq('status', 'published').gte('published_at', weekAgo),
      supabase.from('articles').select('id', { count: 'exact', head: true })
        .eq('status', 'published').gte('published_at', monthAgo),
      supabase.from('articles').select('id', { count: 'exact', head: true })
        .eq('status', 'draft'),
      supabase.from('articles').select('id', { count: 'exact', head: true }),
      supabase.from('articles').select('published_at')
        .eq('status', 'published').gte('published_at', sevenDaysAgo),
      supabase.from('articles').select('created_at')
        .eq('status', 'draft').gte('created_at', sevenDaysAgo),
      supabase.from('contact_submissions').select('id', { count: 'exact', head: true })
        .eq('status', 'unread').then(r => r).catch(() => ({ count: 0 })),
      // Pipeline health: articles processed in last 24h
      supabase.from('articles').select('status, created_at, published_at')
        .gte('created_at', now24h),
    ])

    const publishedToday = publishedTodayRes.count ?? 0
    const publishedThisWeek = publishedWeekRes.count ?? 0
    const publishedThisMonth = publishedMonthRes.count ?? 0
    const draftBacklog = draftsRes.count ?? 0
    const totalArticles = totalArticlesRes.count ?? 0
    const processingRate = publishedThisWeek > 0 ? Math.round((publishedThisWeek / 7) * 10) / 10 : 0

    // Build 7-day trend arrays
    const publishedDaily: number[] = []
    const draftsDaily: number[] = []
    for (let i = 6; i >= 0; i--) {
      const dayStart = new Date()
      dayStart.setDate(dayStart.getDate() - i)
      dayStart.setUTCHours(0, 0, 0, 0)
      const dayEnd = new Date(dayStart)
      dayEnd.setDate(dayEnd.getDate() + 1)

      const ds = dayStart.toISOString()
      const de = dayEnd.toISOString()

      publishedDaily.push(
        (trendRes.data || []).filter(r => r.published_at && r.published_at >= ds && r.published_at < de).length
      )
      draftsDaily.push(
        (draftTrendRes.data || []).filter(r => r.created_at && r.created_at >= ds && r.created_at < de).length
      )
    }

    const unreadMessages = (unreadRes as { count: number | null }).count ?? 0

    // Calculate pipeline health from recent articles
    const recent24h = (recentArticles24h.data || []) as Array<{
      status: string
      created_at: string
      published_at: string | null
    }>
    const totalProcessed24h = recent24h.length
    const totalPublished24h = recent24h.filter(a => a.status === 'published').length
    const failureCount24h = recent24h.filter(a => a.status === 'draft').length
    const successRate24h = totalProcessed24h > 0
      ? Math.round((totalPublished24h / totalProcessed24h) * 100)
      : 0
    const lastRunArticle = recent24h.sort((a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )[0]

    return {
      publishedToday,
      publishedThisWeek,
      publishedThisMonth,
      draftBacklog,
      totalArticles,
      processingRate,
      trends: { publishedDaily, draftsDaily },
      unreadMessages,
      pipelineHealth: {
        lastRunTime: lastRunArticle?.created_at ?? null,
        successRate24h,
        failureCount24h,
        totalProcessed24h,
        totalPublished24h,
      },
      cachedAt: new Date().toISOString(),
    }
  },
  ['admin-dashboard-v3'],
  { revalidate: 300 }
)

export async function GET() {
  const { user, error: authError } = await validateAuth()
  if (authError) return authError
  if (!user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = await getCachedDashboard()
    return NextResponse.json(data)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { success: false, error: `Failed to fetch dashboard: ${message}` },
      { status: 500 }
    )
  }
}
