import { NextRequest, NextResponse } from 'next/server'
import { getGA4Client, GA4_PROPERTY_ID } from '@/lib/ga4-client'

export async function GET(request: NextRequest) {
  try {
    // Auth check
    const authHeader = request.headers.get('Authorization')
    if (!authHeader) {
      return NextResponse.json(
        { success: false, error: 'Missing authorization header' },
        { status: 401 }
      )
    }

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
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch analytics overview',
      },
      { status: 500 }
    )
  }
}
