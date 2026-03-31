'use client'

import { Suspense } from 'react'
import { DateRangeSelector } from '@/components/admin/DateRangeSelector'
import { AudienceKpis } from '@/components/admin/AudienceKpis'
import { TrafficChart } from '@/components/admin/TrafficChart'
import { TopArticlesTable } from '@/components/admin/TopArticlesTable'
import { useDateRange } from '@/hooks/use-date-range'
import { useTrafficData, useTopArticles } from '@/hooks/use-analytics'

function AnalyticsContent() {
  const { days, daysParam, setDays } = useDateRange()
  const { data: traffic, isLoading: trafficLoading, error: trafficError } = useTrafficData(days)
  const { data: topArticles, isLoading: articlesLoading, error: articlesError } = useTopArticles(days)

  const hasError = trafficError || articlesError

  return (
    <div className="space-y-6">
      {/* Header with date range selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">Analytics</h1>
          <p className="text-sm text-muted-foreground">Site traffic and audience insights</p>
        </div>
        {!hasError && <DateRangeSelector days={daysParam} onDaysChange={setDays} />}
      </div>

      {hasError ? (
        <div className="rounded-lg border border-border bg-card p-8 text-center">
          <h2 className="text-lg font-semibold mb-2">Analytics Not Available</h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Google Analytics 4 service account credentials are not configured.
            Add <code className="text-xs bg-muted px-1 py-0.5 rounded">GOOGLE_SERVICE_ACCOUNT_CREDENTIALS</code> to
            your Vercel environment variables to enable analytics.
          </p>
        </div>
      ) : (
        <>
          {/* Audience KPIs */}
          <AudienceKpis kpis={traffic?.kpis} isLoading={trafficLoading} />

          {/* Traffic chart */}
          <TrafficChart
            timeSeries={traffic?.timeSeries}
            isLoading={trafficLoading}
            dateRange={traffic?.dateRange ?? ''}
          />

          {/* Top articles */}
          <TopArticlesTable
            articles={topArticles?.articles}
            isLoading={articlesLoading}
          />
        </>
      )}
    </div>
  )
}

export default function AnalyticsPage() {
  return (
    <Suspense fallback={null}>
      <AnalyticsContent />
    </Suspense>
  )
}
