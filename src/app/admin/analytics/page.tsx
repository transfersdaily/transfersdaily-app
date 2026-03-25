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
  const { data: traffic, isLoading: trafficLoading } = useTrafficData(days)
  const { data: topArticles, isLoading: articlesLoading } = useTopArticles(days)

  return (
    <div className="space-y-6">
      {/* Header with date range selector */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">Site traffic and audience insights</p>
        </div>
        <DateRangeSelector days={daysParam} onDaysChange={setDays} />
      </div>

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
