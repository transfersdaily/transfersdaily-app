import { NextRequest, NextResponse } from 'next/server'
import { validateAuth } from '@/lib/supabase/auth-guard'

export async function GET(request: NextRequest) {
  try {
    const { user, error: authError } = await validateAuth()
    if (authError) return authError

    // Check if GA4 credentials are configured before attempting to load client
    const hasEnvCredentials = !!process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS
    if (!hasEnvCredentials) {
      return NextResponse.json({
        success: false,
        error: 'ga4_not_configured',
        message: 'GA4 analytics requires Google Service Account credentials.',
      })
    }

    const { getGA4Client, GA4_PROPERTY_ID } = await import('@/lib/ga4-client')

    const { searchParams } = new URL(request.url)
    const days = searchParams.get('days') || '30'

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
    const slugMap: Record<string, { pageViews: number; totalDuration: number; totalViews: number }> = {}

    for (const row of report.rows || []) {
      const path = row.dimensionValues?.[0]?.value || ''
      const slug = path.split('/article/')[1]?.split('?')[0]
      if (!slug) continue

      const views = parseInt(row.metricValues?.[0]?.value || '0', 10)
      const duration = parseFloat(row.metricValues?.[1]?.value || '0')

      if (!slugMap[slug]) {
        slugMap[slug] = { pageViews: 0, totalDuration: 0, totalViews: 0 }
      }

      slugMap[slug].pageViews += views
      slugMap[slug].totalDuration += duration * views
      slugMap[slug].totalViews += views
    }

    // Build final data with weighted average duration
    const data: Record<string, { pageViews: number; avgDuration: number }> = {}
    for (const [slug, stats] of Object.entries(slugMap)) {
      data[slug] = {
        pageViews: stats.pageViews,
        avgDuration: stats.totalViews > 0
          ? Math.round((stats.totalDuration / stats.totalViews) * 100) / 100
          : 0,
      }
    }

    return NextResponse.json({
      success: true,
      data,
      dateRange: `${days}daysAgo - today`,
    })
  } catch (error) {
    console.error('Article analytics route error:', error)

    // Check if this is a credentials error from ga4-client
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
        error: 'Failed to fetch article analytics',
        details: errorMessage,
      },
      { status: 500 }
    )
  }
}
