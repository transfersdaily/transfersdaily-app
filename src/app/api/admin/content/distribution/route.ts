import { NextResponse } from 'next/server'
import { unstable_cache } from 'next/cache'
import { validateAuth } from '@/lib/supabase/auth-guard'
import { createAdminClient } from '@/lib/supabase/admin'
import { LEAGUE_BY_NAME } from '@/lib/constants'
import type { ContentDistributionResponse, DailyArticleCount } from '@/types/content-analytics'

function formatDayLabel(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const getCachedDistribution = unstable_cache(
  async (): Promise<ContentDistributionResponse> => {
    const supabase = createAdminClient()

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    thirtyDaysAgo.setHours(0, 0, 0, 0)
    const thirtyDaysAgoISO = thirtyDaysAgo.toISOString()

    const [leagueResult, categoryResult, dailyResult] = await Promise.all([
      supabase
        .from('articles')
        .select('league')
        .eq('status', 'published'),

      supabase
        .from('articles')
        .select('category')
        .eq('status', 'published'),

      supabase
        .from('articles')
        .select('status, created_at, published_at')
        .gte('created_at', thirtyDaysAgoISO),
    ])

    // League distribution
    const leagueCounts: Record<string, number> = {}
    for (const row of leagueResult.data || []) {
      const league = row.league || 'Unknown'
      leagueCounts[league] = (leagueCounts[league] || 0) + 1
    }

    const byLeague = Object.entries(leagueCounts)
      .map(([league, count]) => ({
        league,
        count,
        color: LEAGUE_BY_NAME[league]?.color || '#6b7280',
      }))
      .sort((a, b) => b.count - a.count)

    // Category distribution
    const categoryCounts: Record<string, number> = {}
    for (const row of categoryResult.data || []) {
      const category = row.category || 'Uncategorized'
      categoryCounts[category] = (categoryCounts[category] || 0) + 1
    }

    const byCategory = Object.entries(categoryCounts)
      .map(([category, count]) => ({
        category: category.charAt(0).toUpperCase() + category.slice(1),
        count,
      }))
      .sort((a, b) => b.count - a.count)

    // Articles per day (last 30 days) with gap-fill
    const dayMap: Record<string, { published: number; drafts: number }> = {}
    for (let i = 29; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const key = d.toISOString().split('T')[0]
      dayMap[key] = { published: 0, drafts: 0 }
    }

    for (const row of dailyResult.data || []) {
      if (row.status === 'published') {
        // Use published_at for published articles
        const pubDate = row.published_at || row.created_at
        if (!pubDate) continue
        const key = new Date(pubDate).toISOString().split('T')[0]
        if (key in dayMap) dayMap[key].published++
      } else if (row.status === 'draft') {
        // Use created_at for draft articles
        const dateStr = row.created_at
        if (!dateStr) continue
        const key = new Date(dateStr).toISOString().split('T')[0]
        if (key in dayMap) dayMap[key].drafts++
      }
    }

    const articlesPerDay: DailyArticleCount[] = Object.entries(dayMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, counts]) => ({
        date,
        label: formatDayLabel(date),
        published: counts.published,
        drafts: counts.drafts,
      }))

    const totalPublished = articlesPerDay.reduce((sum, d) => sum + d.published, 0)
    const totalDrafts = articlesPerDay.reduce((sum, d) => sum + d.drafts, 0)

    return {
      byLeague,
      byCategory,
      articlesPerDay,
      totalPublished,
      totalDrafts,
      cachedAt: new Date().toISOString(),
    }
  },
  ['content-distribution'],
  { revalidate: 3600 }
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
    const data = await getCachedDistribution()
    return NextResponse.json(data)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { success: false, error: `Failed to fetch content distribution: ${message}` },
      { status: 500 }
    )
  }
}
