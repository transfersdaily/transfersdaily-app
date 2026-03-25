'use client'

import { useContentDistribution, useTranslationCoverage } from '@/hooks/use-content-analytics'
import { ArticlesPerDayChart } from '@/components/admin/ArticlesPerDayChart'
import { LeagueDistributionChart } from '@/components/admin/LeagueDistributionChart'
import { CategoryDistributionChart } from '@/components/admin/CategoryDistributionChart'
import { TranslationCoverageGrid } from '@/components/admin/TranslationCoverageGrid'
import { AdminPageLayout } from '@/components/admin/AdminPageLayout'

export default function ContentAnalyticsPage() {
  const { data: distribution, isLoading: distributionLoading } = useContentDistribution()
  const { data: translations, isLoading: translationsLoading } = useTranslationCoverage()

  return (
    <AdminPageLayout title="Content Analytics" subtitle="Distribution patterns and translation coverage">
      <div className="space-y-6">
        {/* Top row: Articles per day (full width) */}
        <ArticlesPerDayChart
          data={distribution?.articlesPerDay}
          isLoading={distributionLoading}
        />

        {/* Middle row: League + Category distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LeagueDistributionChart
            data={distribution?.byLeague}
            isLoading={distributionLoading}
          />
          <CategoryDistributionChart
            data={distribution?.byCategory}
            isLoading={distributionLoading}
          />
        </div>

        {/* Bottom row: Translation coverage (full width) */}
        <TranslationCoverageGrid
          data={translations}
          isLoading={translationsLoading}
        />
      </div>
    </AdminPageLayout>
  )
}
