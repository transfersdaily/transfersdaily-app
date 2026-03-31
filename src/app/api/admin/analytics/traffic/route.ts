import { NextRequest, NextResponse } from 'next/server'
import { unstable_cache } from 'next/cache'
import { validateAuth } from '@/lib/supabase/auth-guard'
import type { TrafficResponse, KpiMetric } from '@/types/analytics'

const VALID_DAYS = [1, 7, 30, 90]

function parseMetricValue(row: { metricValues?: Array<{ value?: string | null }> } | undefined, index: number, asFloat = false): number {
  const raw = row?.metricValues?.[index]?.value || '0'
  return asFloat ? parseFloat(raw) : parseInt(raw, 10)
}

function calculateChange(current: number, previous: number): number {
  if (previous === 0) return 0
  return Math.round(((current - previous) / previous) * 100 * 10) / 10
}

function buildKpi(current: number, previous: number): KpiMetric {
  return { value: current, change: calculateChange(current, previous) }
}

function fillTimeSeries(
  rows: Array<{ key: string; pageViews: number; sessions: number }>,
  days: number
): Array<{ label: string; pageViews: number; sessions: number }> {
  const isHourly = days <= 1
  const map = new Map(rows.map(r => [r.key, r]))
  const result: Array<{ label: string; pageViews: number; sessions: number }> = []
  const now = new Date()
  const start = new Date(now)

  if (isHourly) {
    start.setHours(start.getHours() - 24)
    const current = new Date(start)
    while (current <= now) {
      const key = current.toISOString().slice(0, 10).replace(/-/g, '') +
        current.getHours().toString().padStart(2, '0')
      const existing = map.get(key)
      result.push({
        label: current.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
        pageViews: existing?.pageViews ?? 0,
        sessions: existing?.sessions ?? 0,
      })
      current.setHours(current.getHours() + 1)
    }
  } else {
    start.setDate(start.getDate() - days)
    const current = new Date(start)
    while (current <= now) {
      const key = current.toISOString().slice(0, 10).replace(/-/g, '')
      const existing = map.get(key)
      result.push({
        label: current.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        pageViews: existing?.pageViews ?? 0,
        sessions: existing?.sessions ?? 0,
      })
      current.setDate(current.getDate() + 1)
    }
  }
  return result
}

const getCachedTrafficData = unstable_cache(
  async (days: number): Promise<TrafficResponse> => {
    const { getGA4Client, GA4_PROPERTY_ID } = await import('@/lib/ga4-client')
    const client = await getGA4Client()
    const dimensionName = days <= 1 ? 'dateHour' : 'date'

    const [response] = await client.batchRunReports({
      property: `properties/${GA4_PROPERTY_ID}`,
      requests: [
        // Report 0: Current period KPIs
        {
          dateRanges: [{ startDate: `${days}daysAgo`, endDate: 'today' }],
          metrics: [
            { name: 'screenPageViews' },
            { name: 'sessions' },
            { name: 'totalUsers' },
            { name: 'averageSessionDuration' },
            { name: 'bounceRate' },
          ],
        },
        // Report 1: Previous period KPIs (for % change)
        {
          dateRanges: [{ startDate: `${days * 2}daysAgo`, endDate: `${days + 1}daysAgo` }],
          metrics: [
            { name: 'screenPageViews' },
            { name: 'sessions' },
            { name: 'totalUsers' },
            { name: 'averageSessionDuration' },
            { name: 'bounceRate' },
          ],
        },
        // Report 2: Time-series data
        {
          dateRanges: [{ startDate: `${days}daysAgo`, endDate: 'today' }],
          dimensions: [{ name: dimensionName }],
          metrics: [
            { name: 'screenPageViews' },
            { name: 'sessions' },
          ],
          orderBys: [{ dimension: { dimensionName }, desc: false }],
        },
      ],
    })

    const reports = response.reports || []
    const currentRow = reports[0]?.rows?.[0]
    const previousRow = reports[1]?.rows?.[0]

    // Extract current period values
    const currentPageViews = parseMetricValue(currentRow, 0)
    const currentSessions = parseMetricValue(currentRow, 1)
    const currentUsers = parseMetricValue(currentRow, 2)
    const currentDuration = parseMetricValue(currentRow, 3, true)
    const currentBounceRate = parseMetricValue(currentRow, 4, true) * 100

    // Extract previous period values
    const previousPageViews = parseMetricValue(previousRow, 0)
    const previousSessions = parseMetricValue(previousRow, 1)
    const previousUsers = parseMetricValue(previousRow, 2)
    const previousDuration = parseMetricValue(previousRow, 3, true)
    const previousBounceRate = parseMetricValue(previousRow, 4, true) * 100

    // Build time-series from Report 2
    const timeSeriesRows = (reports[2]?.rows || []).map(row => ({
      key: row.dimensionValues?.[0]?.value || '',
      pageViews: parseInt(row.metricValues?.[0]?.value || '0', 10),
      sessions: parseInt(row.metricValues?.[1]?.value || '0', 10),
    }))

    return {
      kpis: {
        pageViews: buildKpi(currentPageViews, previousPageViews),
        sessions: buildKpi(currentSessions, previousSessions),
        totalUsers: buildKpi(currentUsers, previousUsers),
        avgSessionDuration: buildKpi(currentDuration, previousDuration),
        bounceRate: buildKpi(currentBounceRate, previousBounceRate),
      },
      timeSeries: fillTimeSeries(timeSeriesRows, days),
      dateRange: `${days}daysAgo - today`,
      cachedAt: new Date().toISOString(),
    }
  },
  ['analytics-traffic'],
  { revalidate: 3600 }
)

export async function GET(request: NextRequest) {
  try {
    const { error: authError } = await validateAuth()
    if (authError) return authError

    // Check if GA4 credentials are configured
    const hasEnvCredentials = !!process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS
    if (!hasEnvCredentials) {
      return NextResponse.json({
        success: false,
        error: 'ga4_not_configured',
        message: 'GA4 analytics requires Google Service Account credentials.',
      }, { status: 503 })
    }

    const { searchParams } = new URL(request.url)
    const daysParam = parseInt(searchParams.get('days') || '30', 10)
    const days = VALID_DAYS.includes(daysParam) ? daysParam : 30

    const data = await getCachedTrafficData(days)

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
        error: 'Failed to fetch traffic analytics',
        details: errorMessage,
      },
      { status: 500 }
    )
  }
}
