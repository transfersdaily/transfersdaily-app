import { NextRequest, NextResponse } from 'next/server'
import { validateAuth } from '@/lib/supabase/auth-guard'
import { createAdminClient } from '@/lib/supabase/admin'
import { unstable_cache } from 'next/cache'
import type {
  SocialAggregateStats,
  PlatformAggregateStats,
  SocialPlatform,
  SocialPlatformResult,
} from '@/types/social'

const PLATFORMS: { key: SocialPlatform; label: string }[] = [
  { key: 'twitter', label: 'X / Twitter' },
  { key: 'bluesky', label: 'Bluesky' },
  { key: 'facebook', label: 'Facebook' },
  { key: 'threads', label: 'Threads' },
]

function daysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  d.setHours(0, 0, 0, 0)
  return d.toISOString()
}

function aggregateFromRows(
  rows: Array<{ social_media_data: Record<string, unknown> | null }>,
  period: '7d' | '30d'
): SocialAggregateStats {
  const stats: Record<SocialPlatform, PlatformAggregateStats> = {} as Record<
    SocialPlatform,
    PlatformAggregateStats
  >

  for (const p of PLATFORMS) {
    stats[p.key] = {
      platform: p.key,
      label: p.label,
      attempted: 0,
      succeeded: 0,
      failed: 0,
      skipped: 0,
    }
  }

  for (const row of rows) {
    const data = row.social_media_data
    if (!data || typeof data !== 'object') continue

    // The social results can be stored either at top level or under socialResults key
    const socialResults =
      (data as Record<string, unknown>).socialResults ??
      (data as Record<string, unknown>)

    if (!socialResults || typeof socialResults !== 'object') continue

    for (const p of PLATFORMS) {
      const result = (socialResults as Record<string, SocialPlatformResult>)[
        p.key
      ]
      if (!result || typeof result !== 'object') continue

      stats[p.key].attempted++

      if (result.skipped) {
        stats[p.key].skipped++
      } else if (result.success) {
        stats[p.key].succeeded++
      } else {
        stats[p.key].failed++
      }
    }
  }

  const totals = {
    attempted: 0,
    succeeded: 0,
    failed: 0,
  }
  for (const p of PLATFORMS) {
    totals.attempted += stats[p.key].attempted
    totals.succeeded += stats[p.key].succeeded
    totals.failed += stats[p.key].failed
  }

  return {
    period,
    platforms: PLATFORMS.map((p) => stats[p.key]),
    totals,
    cachedAt: new Date().toISOString(),
  }
}

const getCachedSocialStats = unstable_cache(
  async (period: '7d' | '30d'): Promise<SocialAggregateStats> => {
    const supabase = createAdminClient()
    const since = period === '7d' ? daysAgo(7) : daysAgo(30)

    const { data: rows, error } = await supabase
      .from('articles')
      .select('social_media_data')
      .eq('status', 'published')
      .not('social_media_data', 'is', null)
      .gte('published_at', since)

    if (error) {
      throw new Error(`Failed to query social data: ${error.message}`)
    }

    return aggregateFromRows(rows ?? [], period)
  },
  ['admin-social-stats'],
  { revalidate: 3600 }
)

export async function GET(request: NextRequest) {
  const { user, error: authError } = await validateAuth()
  if (authError) return authError
  if (!user) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') === '30d' ? '30d' : '7d'

    const data = await getCachedSocialStats(period)
    return NextResponse.json(data)
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { success: false, error: `Failed to fetch social stats: ${message}` },
      { status: 500 }
    )
  }
}
