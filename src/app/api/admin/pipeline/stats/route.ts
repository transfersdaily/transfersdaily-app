import { NextResponse } from 'next/server'
import { validateAuth } from '@/lib/supabase/auth-guard'
import { createAdminClient } from '@/lib/supabase/admin'
import { unstable_cache } from 'next/cache'
import type { PipelineStatsResponse, PipelineSourceStats } from '@/types/pipeline'

// Known sources (matches CDK pipeline stack)
const KNOWN_SOURCES = [
  'teamtalk', 'footballtransfers', 'football-espana', 'laliganews',
  'kicker', 'sportschau', 'gazzetta', 'tuttosport', 'sofoot', 'lequipe'
]

function hoursAgo(h: number): string {
  return new Date(Date.now() - h * 60 * 60 * 1000).toISOString()
}

function daysAgo(d: number): string {
  return new Date(Date.now() - d * 24 * 60 * 60 * 1000).toISOString()
}

const getCachedPipelineStats = unstable_cache(
  async (): Promise<PipelineStatsResponse> => {
    const supabase = createAdminClient()
    const now24h = hoursAgo(24)
    const now7d = daysAgo(7)

    // Only fetch recent articles (7 days) to keep query fast
    const { data: recentArticles } = await supabase
      .from('articles')
      .select('uuid, status, published_at, created_at, social_media_data')
      .gte('created_at', now7d)

    const articles = (recentArticles ?? []) as Array<{
      uuid: string
      status: string
      published_at: string | null
      created_at: string
      social_media_data: { sourceName?: string } | null
    }>

    // Build per-source stats
    const sourceStatsMap = new Map<string, PipelineSourceStats>()

    for (const name of KNOWN_SOURCES) {
      sourceStatsMap.set(name, {
        sourceName: name,
        articlesTotal: 0,
        articles24h: 0,
        articles7d: 0,
        published24h: 0,
        published7d: 0,
        drafts24h: 0,
        lastArticleAt: null,
      })
    }

    for (const article of articles) {
      const sourceName = article.social_media_data?.sourceName
      if (!sourceName) continue

      let stats = sourceStatsMap.get(sourceName)
      if (!stats) {
        stats = {
          sourceName,
          articlesTotal: 0, articles24h: 0, articles7d: 0,
          published24h: 0, published7d: 0, drafts24h: 0, lastArticleAt: null,
        }
        sourceStatsMap.set(sourceName, stats)
      }

      stats.articles7d++
      stats.articlesTotal++

      if (!stats.lastArticleAt || article.created_at > stats.lastArticleAt) {
        stats.lastArticleAt = article.created_at
      }

      const is24h = article.created_at >= now24h
      if (is24h) {
        stats.articles24h++
        if (article.status === 'draft') stats.drafts24h++
      }

      if (article.status === 'published') {
        stats.published7d++
        if (article.published_at && article.published_at >= now24h) {
          stats.published24h++
        }
      }
    }

    const sources = Array.from(sourceStatsMap.values())
      .sort((a, b) => b.articles24h - a.articles24h)

    return {
      sources,
      summary: {
        totalSources: sources.length,
        activeSources24h: sources.filter(s => s.articles24h > 0).length,
        totalArticles24h: sources.reduce((sum, s) => sum + s.articles24h, 0),
        totalPublished24h: sources.reduce((sum, s) => sum + s.published24h, 0),
      },
      cachedAt: new Date().toISOString(),
    }
  },
  ['admin-pipeline-stats'],
  { revalidate: 3600 }
)

export async function GET() {
  const { user, error: authError } = await validateAuth()
  if (authError) return authError
  if (!user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = await getCachedPipelineStats()
    return NextResponse.json(data)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { success: false, error: `Failed to fetch pipeline stats: ${message}` },
      { status: 500 }
    )
  }
}
