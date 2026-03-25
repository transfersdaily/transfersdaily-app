import { NextRequest, NextResponse } from 'next/server'
import { unstable_cache } from 'next/cache'
import { validateAuth } from '@/lib/supabase/auth-guard'
import type { ArticleViewsResponse } from '@/types/content-analytics'

const getCachedArticleViews = unstable_cache(
  async (): Promise<Record<string, number>> => {
    const { getGA4Client, GA4_PROPERTY_ID } = await import('@/lib/ga4-client')
    const client = await getGA4Client()

    const [report] = await client.runReport({
      property: `properties/${GA4_PROPERTY_ID}`,
      dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'pagePath' }],
      metrics: [{ name: 'screenPageViews' }],
      dimensionFilter: {
        filter: {
          fieldName: 'pagePath',
          stringFilter: {
            matchType: 'CONTAINS',
            value: '/article/',
          },
        },
      },
      limit: 500,
    })

    // Aggregate by slug across locales
    const slugViews: Record<string, number> = {}

    for (const row of report.rows || []) {
      const path = row.dimensionValues?.[0]?.value || ''
      const slug = path.split('/article/')[1]?.split('?')[0]
      if (!slug) continue

      const views = parseInt(row.metricValues?.[0]?.value || '0', 10)
      slugViews[slug] = (slugViews[slug] || 0) + views
    }

    return slugViews
  },
  ['content-article-views'],
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

  const { searchParams } = new URL(request.url)
  const slugsParam = searchParams.get('slugs') || ''
  const requestedSlugs = slugsParam
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
    .slice(0, 100)

  if (requestedSlugs.length === 0) {
    return NextResponse.json({
      views: {},
      cachedAt: new Date().toISOString(),
    } satisfies ArticleViewsResponse)
  }

  // Check GA4 credentials
  const hasEnvCredentials = !!process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS
  if (!hasEnvCredentials) {
    return NextResponse.json({
      success: false,
      error: 'ga4_not_configured',
      message: 'GA4 analytics requires Google Service Account credentials.',
    })
  }

  try {
    const allViews = await getCachedArticleViews()

    // Filter to only requested slugs
    const views: Record<string, number> = {}
    for (const slug of requestedSlugs) {
      if (slug in allViews) {
        views[slug] = allViews[slug]
      }
    }

    return NextResponse.json({
      views,
      cachedAt: new Date().toISOString(),
    } satisfies ArticleViewsResponse)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    if (errorMessage.includes('not configured') || errorMessage.includes('credentials')) {
      return NextResponse.json({
        success: false,
        error: 'ga4_not_configured',
        message: 'GA4 analytics requires Google Service Account credentials.',
      })
    }

    return NextResponse.json(
      {
        success: false,
        error: `Failed to fetch article views: ${errorMessage}`,
      },
      { status: 500 }
    )
  }
}
