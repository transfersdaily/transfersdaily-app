'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { TranslationCoverageResponse } from '@/types/content-analytics'

interface TranslationCoverageGridProps {
  data: TranslationCoverageResponse | undefined
  isLoading: boolean
}

function getCoverageTier(percent: number) {
  if (percent >= 90) return { text: 'text-green-400', bg: 'bg-green-500' }
  if (percent >= 50) return { text: 'text-amber-400', bg: 'bg-amber-500' }
  return { text: 'text-red-400', bg: 'bg-red-500' }
}

export function TranslationCoverageGrid({ data, isLoading }: TranslationCoverageGridProps) {
  return (
    <Card className="bg-card border border-border shadow-sm">
      <CardHeader>
        <CardTitle>Translation Coverage</CardTitle>
        <CardDescription>
          {data ? `${data.totalArticles} total articles` : 'Loading coverage data...'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-[120px] w-full rounded-lg" />
            ))}
          </div>
        ) : !data || data.languages.length === 0 ? (
          <div className="flex items-center justify-center h-[120px] text-muted-foreground">
            No data available
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {data.languages.map((lang) => {
              const tier = getCoverageTier(lang.coveragePercent)
              return (
                <div
                  key={lang.language}
                  className="rounded-lg border border-border bg-secondary p-4 space-y-2"
                >
                  <p className="font-semibold text-sm">{lang.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {lang.translatedCount} articles
                  </p>
                  <p className={`text-lg font-bold tabular-nums ${tier.text}`}>
                    {lang.coveragePercent}%
                  </p>
                  <div className="h-1.5 w-full rounded-full bg-border">
                    <div
                      className={`h-full rounded-full transition-all ${tier.bg}`}
                      style={{ width: `${Math.min(lang.coveragePercent, 100)}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
