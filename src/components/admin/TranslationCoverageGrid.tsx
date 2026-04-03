'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { motion } from 'framer-motion'
import type { TranslationCoverageResponse } from '@/types/content-analytics'

interface TranslationCoverageGridProps {
  data: TranslationCoverageResponse | undefined
  isLoading: boolean
}

function getCoverageTier(percent: number) {
  if (percent >= 90) return { color: '#22c55e', label: 'Excellent' }
  if (percent >= 50) return { color: '#eab308', label: 'Partial' }
  if (percent > 0) return { color: '#ef4444', label: 'Low' }
  return { color: '#64748b', label: 'None' }
}

export function TranslationCoverageGrid({ data, isLoading }: TranslationCoverageGridProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <Card className="relative overflow-hidden bg-white/[0.03] border border-white/[0.06] backdrop-blur-md">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider">Translation Coverage</h3>
              <p className="text-[11px] text-white/20 mt-0.5">
                {data ? `${data.totalArticles} total articles` : 'Loading...'}
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-[120px] w-full rounded-xl bg-white/[0.04]" />
              ))}
            </div>
          ) : !data || data.languages.length === 0 ? (
            <div className="flex items-center justify-center h-[120px] text-sm text-white/20">
              No data available
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {data.languages.map((lang, i) => {
                const tier = getCoverageTier(lang.coveragePercent)
                return (
                  <motion.div
                    key={lang.language}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 space-y-2 hover:bg-white/[0.04] transition-colors"
                  >
                    <p className="font-semibold text-sm text-white/70">{lang.label}</p>
                    <p className="text-[11px] text-white/25">
                      {lang.translatedCount} / {lang.articleCount}
                    </p>
                    <p className="text-xl font-bold tabular-nums" style={{ color: tier.color }}>
                      {lang.coveragePercent}%
                    </p>
                    <div className="h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(lang.coveragePercent, 100)}%` }}
                        transition={{ duration: 0.6, delay: i * 0.05 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: tier.color }}
                      />
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </CardContent>
        <div className="absolute top-0 left-0 right-0 h-[1px] opacity-30" style={{ background: "linear-gradient(90deg, transparent, #8b5cf6, transparent)" }} />
      </Card>
    </motion.div>
  )
}
