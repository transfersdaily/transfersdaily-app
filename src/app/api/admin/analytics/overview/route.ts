import { NextRequest, NextResponse } from 'next/server'
import { validateAuth } from '@/lib/supabase/auth-guard'

export async function GET(request: NextRequest) {
  try {
    const { user, error: authError } = await validateAuth()
    if (authError) return authError

    // Check if GA4 credentials are configured before attempting to load client
    const hasEnvCredentials = !!process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS
    if (!hasEnvCredentials) {
      // Check SSM availability would require an AWS call — just return not configured
      // The ga4-client will also try SSM, but we short-circuit here for a clean UX
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
      metrics: [
        { name: 'screenPageViews' },
        { name: 'sessions' },
        { name: 'totalUsers' },
        { name: 'averageSessionDuration' },
      ],
    })

    const row = report.rows?.[0]

    const data = {
      pageViews: parseInt(row?.metricValues?.[0]?.value || '0', 10),
      sessions: parseInt(row?.metricValues?.[1]?.value || '0', 10),
      totalUsers: parseInt(row?.metricValues?.[2]?.value || '0', 10),
      avgSessionDuration: parseFloat(row?.metricValues?.[3]?.value || '0'),
    }

    return NextResponse.json({
      success: true,
      data,
      dateRange: `${days}daysAgo - today`,
    })
  } catch (error) {
    console.error('Overview analytics route error:', error)

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
        error: 'Failed to fetch analytics overview',
        details: errorMessage,
      },
      { status: 500 }
    )
  }
}
