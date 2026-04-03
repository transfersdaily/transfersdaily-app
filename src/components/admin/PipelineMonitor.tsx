"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion"
import { Search, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import type { PipelineStatsResponse, PipelineSourceStats } from "@/types/pipeline"

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  if (diffMinutes < 1) return "Just now"
  if (diffMinutes < 60) return `${diffMinutes}m ago`
  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays}d ago`
}

type SortKey = 'sourceName' | 'articles24h' | 'articles7d' | 'published24h' | 'drafts24h' | 'lastArticleAt'
type SortDir = 'asc' | 'desc'

function SortButton({ column, current, dir, label, onClick }: {
  column: SortKey; current: SortKey; dir: SortDir; label: string; onClick: () => void
}) {
  const isActive = column === current
  const Icon = !isActive ? ArrowUpDown : dir === 'asc' ? ArrowUp : ArrowDown
  return (
    <button onClick={onClick} className={`inline-flex items-center gap-0.5 text-[10px] font-medium uppercase tracking-wider transition-colors ${isActive ? 'text-white/50' : 'text-white/25 hover:text-white/40'}`}>
      {label}<Icon className="h-2.5 w-2.5" />
    </button>
  )
}

interface PipelineMonitorProps {
  stats: PipelineStatsResponse | null
  isLoading: boolean
}

export function PipelineMonitor({ stats, isLoading }: PipelineMonitorProps) {
  const [sortKey, setSortKey] = useState<SortKey>('articles24h')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [search, setSearch] = useState('')

  const sorted = useMemo(() => {
    if (!stats?.sources) return []
    let result = [...stats.sources]
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(s => s.sourceName.toLowerCase().includes(q))
    }
    result.sort((a, b) => {
      let cmp = 0
      switch (sortKey) {
        case 'sourceName': cmp = a.sourceName.localeCompare(b.sourceName); break
        case 'articles24h': cmp = a.articles24h - b.articles24h; break
        case 'articles7d': cmp = a.articles7d - b.articles7d; break
        case 'published24h': cmp = a.published24h - b.published24h; break
        case 'drafts24h': cmp = a.drafts24h - b.drafts24h; break
        case 'lastArticleAt':
          cmp = (a.lastArticleAt || '').localeCompare(b.lastArticleAt || '')
          break
      }
      return sortDir === 'asc' ? cmp : -cmp
    })
    return result
  }, [stats?.sources, search, sortKey, sortDir])

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('desc') }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
      <Card className="relative overflow-hidden bg-white/[0.03] border border-white/[0.06] backdrop-blur-md">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider">Per-Source Stats</h3>
              {stats?.summary && (
                <p className="text-[11px] text-white/20 mt-0.5">
                  {stats.summary.activeSources24h}/{stats.summary.totalSources} active, {stats.summary.totalArticles24h} articles (24h)
                </p>
              )}
            </div>
            <div className="relative w-48">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-white/20" />
              <Input
                placeholder="Filter sources..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-8 h-8 bg-white/[0.03] border-white/[0.06] text-white/60 placeholder:text-white/15 text-xs"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full bg-white/[0.04]" />
              ))}
            </div>
          ) : sorted.length === 0 ? (
            <div className="py-8 text-center text-sm text-white/20">
              {search ? 'No matching sources' : 'No source data available'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              {/* Header */}
              <div className="grid grid-cols-[1fr_70px_70px_70px_70px_90px] gap-2 px-2 pb-2 border-b border-white/[0.06]">
                <SortButton column="sourceName" current={sortKey} dir={sortDir} label="Source" onClick={() => toggleSort('sourceName')} />
                <div className="text-right"><SortButton column="articles24h" current={sortKey} dir={sortDir} label="24h" onClick={() => toggleSort('articles24h')} /></div>
                <div className="text-right"><SortButton column="articles7d" current={sortKey} dir={sortDir} label="7d" onClick={() => toggleSort('articles7d')} /></div>
                <div className="text-right"><SortButton column="published24h" current={sortKey} dir={sortDir} label="Pub 24h" onClick={() => toggleSort('published24h')} /></div>
                <div className="text-right"><SortButton column="drafts24h" current={sortKey} dir={sortDir} label="Drafts" onClick={() => toggleSort('drafts24h')} /></div>
                <div className="text-right"><SortButton column="lastArticleAt" current={sortKey} dir={sortDir} label="Last" onClick={() => toggleSort('lastArticleAt')} /></div>
              </div>

              {/* Rows */}
              <div className="divide-y divide-white/[0.03]">
                {sorted.map((source) => {
                  const isActive = source.articles24h > 0
                  return (
                    <div key={source.sourceName} className="grid grid-cols-[1fr_70px_70px_70px_70px_90px] gap-2 px-2 py-2.5 hover:bg-white/[0.02] transition-colors">
                      <div className="flex items-center gap-2">
                        <div className={`h-1.5 w-1.5 rounded-full shrink-0 ${isActive ? 'bg-emerald-400' : 'bg-white/10'}`} />
                        <span className={`text-xs truncate ${isActive ? 'text-white/60' : 'text-white/25'}`}>{source.sourceName}</span>
                      </div>
                      <span className={`text-xs text-right tabular-nums ${source.articles24h > 0 ? 'text-white/60' : 'text-white/15'}`}>
                        {source.articles24h || '-'}
                      </span>
                      <span className={`text-xs text-right tabular-nums ${source.articles7d > 0 ? 'text-white/50' : 'text-white/15'}`}>
                        {source.articles7d || '-'}
                      </span>
                      <span className={`text-xs text-right tabular-nums ${source.published24h > 0 ? 'text-emerald-400/60' : 'text-white/15'}`}>
                        {source.published24h || '-'}
                      </span>
                      <span className={`text-xs text-right tabular-nums ${source.drafts24h > 0 ? 'text-amber-400/60' : 'text-white/15'}`}>
                        {source.drafts24h || '-'}
                      </span>
                      <span className="text-[10px] text-right text-white/20">
                        {source.lastArticleAt ? formatRelativeTime(source.lastArticleAt) : '-'}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </CardContent>
        <div className="absolute top-0 left-0 right-0 h-[1px] opacity-30" style={{ background: "linear-gradient(90deg, transparent, #3b82f6, transparent)" }} />
      </Card>
    </motion.div>
  )
}
