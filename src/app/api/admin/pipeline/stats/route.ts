import { NextResponse } from 'next/server'
import { validateAuth } from '@/lib/supabase/auth-guard'
import { createClient } from '@/lib/supabase/server'
import { unstable_cache } from 'next/cache'
import type { PipelineStatsResponse, PipelineSourceStats } from '@/types/pipeline'

function hoursAgo(h: number): string {
  return new Date(Date.now() - h * 60 * 60 * 1000).toISOString()
}

function daysAgo(d: number): string {
  return new Date(Date.now() - d * 24 * 60 * 60 * 1000).toISOString()
}

interface ArticleRow {
  uuid: string
  status: string
  published_at: string | null
  created_at: string
  social_media_data: { sourceName?: string } | null
}

const getCachedPipelineStats = unstable_cache(
  async (): Promise<PipelineStatsResponse> => {
    const supabase = await createClient()

    const now24h = hoursAgo(24)
    const now7d = daysAgo(7)

    // Get enabled sources
    const { data: sourcesData } = await supabase
      .from('sources')
      .select('name')
      .eq('enabled', true)

    const sourceNames = (sourcesData ?? []).map((s: { name: string }) => s.name)

    // Get all articles from last 7 days with social_media_data
    const { data: recentArticles } = await supabase
      .from('articles')
      .select('uuid, status, published_at, created_at, social_media_data')
      .gte('created_at', now7d)

    // Get all-time counts per source (using a broader query)
    const { data: allArticles } = await supabase
      .from('articles')
      .select('uuid, status, social_media_data, created_at')

    const articles7d = (recentArticles ?? []) as ArticleRow[]
    const articlesAll = (allArticles ?? []) as ArticleRow[]

    // Build per-source stats
    const sourceStatsMap = new Map<string, PipelineSourceStats>()

    // Initialize all known sources
    for (const name of sourceNames) {
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

    // Process all-time articles
    for (const article of articlesAll) {
      const sourceName = article.social_media_data?.sourceName
      if (!sourceName) continue

      let stats = sourceStatsMap.get(sourceName)
      if (!stats) {
        stats = {
          sourceName,
          articlesTotal: 0,
          articles24h: 0,
          articles7d: 0,
          published24h: 0,
          published7d: 0,
          drafts24h: 0,
          lastArticleAt: null,
        }
        sourceStatsMap.set(sourceName, stats)
      }
      stats.articlesTotal++

      // Track most recent article
      if (!stats.lastArticleAt || article.created_at > stats.lastArticleAt) {
        stats.lastArticleAt = article.created_at
      }
    }

    // Process 7-day articles for time-windowed stats
    for (const article of articles7d) {
      const sourceName = article.social_media_data?.sourceName
      if (!sourceName) continue

      const stats = sourceStatsMap.get(sourceName)
      if (!stats) continue

      stats.articles7d++

      const is24h = article.created_at >= now24h
      if (is24h) {
        stats.articles24h++
        if (article.status === 'draft') {
          stats.drafts24h++
        }
      }

      if (article.status === 'published') {
        stats.published7d++
        if (article.published_at && article.published_at >= now24h) {
          stats.published24h++
        }
      }
    }

    const sources = Array.from(sourceStatsMap.values())
      .sort((a, b) => a.sourceName.localeCompare(b.sourceName))

    const activeSources24h = sources.filter((s) => s.articles24h > 0).length
    const totalArticles24h = sources.reduce((sum, s) => sum + s.articles24h, 0)
    const totalPublished24h = sources.reduce((sum, s) => sum + s.published24h, 0)

    return {
      sources,
      summary: {
        totalSources: sources.length,
        activeSources24h,
        totalArticles24h,
        totalPublished24h,
      },
      cachedAt: new Date().toISOString(),
    }
  },
  ['admin-pipeline-stats'],
  { revalidate: 60 }
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
