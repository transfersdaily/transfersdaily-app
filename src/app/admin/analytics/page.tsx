'use client'

import { Suspense } from 'react'
import { DateRangeSelector } from '@/components/admin/DateRangeSelector'
import { AudienceKpis } from '@/components/admin/AudienceKpis'
import { TrafficChart } from '@/components/admin/TrafficChart'
import { TopArticlesTable } from '@/components/admin/TopArticlesTable'
import { useDateRange } from '@/hooks/use-date-range'
import { useTrafficData, useTopArticles } from '@/hooks/use-analytics'
import { motion } from 'framer-motion'
import { BarChart3, AlertCircle } from 'lucide-react'

function AnalyticsContent() {
  const { days, daysParam, setDays } = useDateRange()
  const { data: traffic, isLoading: trafficLoading, error: trafficError } = useTrafficData(days)
  const { data: topArticles, isLoading: articlesLoading, error: articlesError } = useTopArticles(days)

  const hasError = trafficError || articlesError

  return (
    <div className="space-y-6">
      {/* Header with date range selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div />
        {!hasError && <DateRangeSelector days={daysParam} onDaysChange={setDays} />}
      </div>

      {hasError ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-8 text-center backdrop-blur-md"
        >
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-amber-400/60" />
            </div>
          </div>
          <h2 className="text-base font-semibold text-white/70 mb-2">Analytics Not Available</h2>
          <p className="text-sm text-white/30 max-w-md mx-auto">
            Google Analytics 4 service account credentials are not configured.
            Add <code className="text-[11px] bg-white/[0.06] px-1.5 py-0.5 rounded text-white/50">GOOGLE_SERVICE_ACCOUNT_CREDENTIALS</code> to
            your environment variables to enable analytics.
          </p>
        </motion.div>
      ) : (
        <>
          <AudienceKpis kpis={traffic?.kpis} isLoading={trafficLoading} />
          <TrafficChart
            timeSeries={traffic?.timeSeries}
            isLoading={trafficLoading}
            dateRange={traffic?.dateRange ?? ''}
          />
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
