import { NextRequest, NextResponse } from 'next/server'
import { unstable_cache } from 'next/cache'
import { validateAuth } from '@/lib/supabase/auth-guard'
import { createClient } from '@/lib/supabase/server'
import type { TopArticlesResponse } from '@/types/analytics'

const VALID_DAYS = [1, 7, 30, 90]

const getCachedTopArticles = unstable_cache(
  async (days: number): Promise<TopArticlesResponse> => {
    const { getGA4Client, GA4_PROPERTY_ID } = await import('@/lib/ga4-client')
    const client = await getGA4Client()

    const [report] = await client.runReport({
      property: `properties/${GA4_PROPERTY_ID}`,
      dateRanges: [{ startDate: `${days}daysAgo`, endDate: 'today' }],
      dimensions: [{ name: 'pagePath' }],
      metrics: [
        { name: 'screenPageViews' },
        { name: 'averageSessionDuration' },
      ],
      dimensionFilter: {
        filter: {
          fieldName: 'pagePath',
          stringFilter: {
            matchType: 'CONTAINS',
            value: '/article/',
          },
        },
      },
      orderBys: [
        {
          metric: { metricName: 'screenPageViews' },
          desc: true,
        },
      ],
      limit: 500,
    })

    // Aggregate results by slug across locales
    const slugMap: Record<string, {
      pageViews: number
      totalDuration: number
      totalViews: number
      firstPath: string
    }> = {}

    for (const row of report.rows || []) {
      const path = row.dimensionValues?.[0]?.value || ''
      const slug = path.split('/article/')[1]?.split('?')[0]
      if (!slug) continue

      const views = parseInt(row.metricValues?.[0]?.value || '0', 10)
      const duration = parseFloat(row.metricValues?.[1]?.value || '0')

      if (!slugMap[slug]) {
        slugMap[slug] = { pageViews: 0, totalDuration: 0, totalViews: 0, firstPath: path }
      }

      slugMap[slug].pageViews += views
      slugMap[slug].totalDuration += duration * views
      slugMap[slug].totalViews += views
    }

    // Match slugs to article titles from Supabase
    const slugs = Object.keys(slugMap)
    let titleMap = new Map<string, string>()

    if (slugs.length > 0) {
      const supabase = await createClient()
      const { data: articles } = await supabase
        .from('articles')
        .select('slug, title')
        .in('slug', slugs)

      titleMap = new Map(articles?.map(a => [a.slug, a.title]) ?? [])
    }

    // Build top 10 array sorted by pageViews desc
    const sorted = Object.entries(slugMap)
      .sort(([, a], [, b]) => b.pageViews - a.pageViews)
      .slice(0, 10)

    const topArticles = sorted.map(([slug, stats], index) => ({
      rank: index + 1,
      slug,
      title: titleMap.get(slug) ?? null,
      pageViews: stats.pageViews,
      avgDuration: stats.totalViews > 0
        ? Math.round((stats.totalDuration / stats.totalViews) * 100) / 100
        : 0,
      url: stats.firstPath,
    }))

    return {
      articles: topArticles,
      dateRange: `${days}daysAgo - today`,
      cachedAt: new Date().toISOString(),
    }
  },
  ['analytics-top-articles'],
  { revalidate: 3600 }
)

export async function GET(request: NextRequest) {
  try {
    const { error: authError } = await validateAuth()
    if (authError) return authError

    const { searchParams } = new URL(request.url)
    const daysParam = parseInt(searchParams.get('days') || '30', 10)
    const days = VALID_DAYS.includes(daysParam) ? daysParam : 30

    const data = await getCachedTopArticles(days)

    return NextResponse.json(data)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    if (errorMessage.includes('not configured') || errorMessage.includes('credentials')) {
      return NextResponse.json({
        success: false,
        error: 'ga4_not_configured',
        message: 'GA4 analytics requires Google Service Account credentials.',
      }, { status: 503 })
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch top articles analytics',
        details: errorMessage,
      },
      { status: 500 }
    )
  }
}
