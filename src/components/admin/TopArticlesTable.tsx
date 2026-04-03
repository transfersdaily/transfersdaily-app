'use client'

import { useState, useMemo } from 'react'
import { GlassCard } from '@/components/ui/glass-card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { motion } from 'framer-motion'
import { ArrowUpDown, ArrowUp, ArrowDown, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import type { TopArticlesResponse } from '@/types/analytics'

function formatDuration(seconds: number): string {
  if (!seconds || isNaN(seconds)) return '0m 0s'
  const mins = Math.floor(seconds / 60)
  const secs = Math.round(seconds % 60)
  return `${mins}m ${secs}s`
}

type SortKey = 'rank' | 'title' | 'pageViews' | 'avgDuration'
type SortDir = 'asc' | 'desc'

interface TopArticlesTableProps {
  articles: TopArticlesResponse['articles'] | undefined
  isLoading: boolean
}

function SortButton({ column, sortKey, sortDir, label, onClick }: {
  column: SortKey; sortKey: SortKey; sortDir: SortDir; label: string; onClick: () => void
}) {
  const isActive = column === sortKey
  const Icon = !isActive ? ArrowUpDown : sortDir === 'asc' ? ArrowUp : ArrowDown
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-wider transition-colors ${
        isActive ? 'text-white/60' : 'text-white/30 hover:text-white/50'
      }`}
    >
      {label}
      <Icon className="h-3 w-3" />
    </button>
  )
}

export function TopArticlesTable({ articles, isLoading }: TopArticlesTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('rank')
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const perPage = 10

  const hasData = articles && articles.length > 0

  const filtered = useMemo(() => {
    if (!hasData) return []
    let result = [...articles]
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(a => (a.title || a.slug || '').toLowerCase().includes(q))
    }
    result.sort((a, b) => {
      let cmp = 0
      switch (sortKey) {
        case 'rank': cmp = a.rank - b.rank; break
        case 'title': cmp = (a.title || a.slug || '').localeCompare(b.title || b.slug || ''); break
        case 'pageViews': cmp = a.pageViews - b.pageViews; break
        case 'avgDuration': cmp = a.avgDuration - b.avgDuration; break
      }
      return sortDir === 'asc' ? cmp : -cmp
    })
    return result
  }, [articles, hasData, search, sortKey, sortDir])

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const paged = filtered.slice((page - 1) * perPage, page * perPage)

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
    setPage(1)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
    >
      <GlassCard
        title="Top Articles"
        subtitle="Most viewed in selected period"
        accentColor="#8b5cf6"
      >
          {!isLoading && !hasData ? (
            <div className="flex items-center justify-center py-12 text-sm text-white/20">
              No article data available
            </div>
          ) : (
            <>
              {hasData && (
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/20" />
                  <Input
                    placeholder="Filter articles..."
                    value={search}
                    onChange={e => { setSearch(e.target.value); setPage(1) }}
                    className="pl-9 bg-white/[0.03] border-white/[0.06] text-white/70 placeholder:text-white/20 h-9 text-sm"
                  />
                </div>
              )}

              {/* Table header */}
              <div className="grid grid-cols-[40px_1fr_80px_80px] gap-2 px-2 pb-2 border-b border-white/[0.06]">
                <SortButton column="rank" sortKey={sortKey} sortDir={sortDir} label="#" onClick={() => toggleSort('rank')} />
                <SortButton column="title" sortKey={sortKey} sortDir={sortDir} label="Title" onClick={() => toggleSort('title')} />
                <div className="text-right">
                  <SortButton column="pageViews" sortKey={sortKey} sortDir={sortDir} label="Views" onClick={() => toggleSort('pageViews')} />
                </div>
                <div className="text-right">
                  <SortButton column="avgDuration" sortKey={sortKey} sortDir={sortDir} label="Time" onClick={() => toggleSort('avgDuration')} />
                </div>
              </div>

              {/* Table body */}
              <div className="divide-y divide-white/[0.03]">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="grid grid-cols-[40px_1fr_80px_80px] gap-2 px-2 py-3">
                      <Skeleton className="h-4 w-6 bg-white/[0.06]" />
                      <Skeleton className="h-4 w-48 bg-white/[0.06]" />
                      <Skeleton className="h-4 w-12 ml-auto bg-white/[0.06]" />
                      <Skeleton className="h-4 w-14 ml-auto bg-white/[0.06]" />
                    </div>
                  ))
                ) : paged.length === 0 ? (
                  <div className="py-8 text-center text-sm text-white/20">
                    No matching articles
                  </div>
                ) : (
                  paged.map((article) => (
                    <div key={article.rank} className="grid grid-cols-[40px_1fr_80px_80px] gap-2 px-2 py-3 hover:bg-white/[0.02] transition-colors">
                      <span className="text-xs text-white/25 tabular-nums">{article.rank}</span>
                      <div className="min-w-0">
                        {article.title ? (
                          <a
                            href={article.url}
                            className="text-sm text-white/70 hover:text-white truncate block transition-colors"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {article.title}
                          </a>
                        ) : (
                          <span className="text-xs text-white/30 font-mono">{article.slug}</span>
                        )}
                      </div>
                      <span className="text-xs text-white/50 text-right tabular-nums">
                        {new Intl.NumberFormat('en-US').format(article.pageViews)}
                      </span>
                      <span className="text-xs text-white/30 text-right tabular-nums">
                        {formatDuration(article.avgDuration)}
                      </span>
                    </div>
                  ))
                )}
              </div>

              {/* Pagination */}
              {hasData && filtered.length > perPage && (
                <div className="flex items-center justify-between pt-4 mt-2 border-t border-white/[0.06]">
                  <span className="text-[11px] text-white/20">
                    {filtered.length} article{filtered.length !== 1 ? 's' : ''}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-white/20">
                      {page}/{totalPages}
                    </span>
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page <= 1}
                      className="h-7 w-7 flex items-center justify-center rounded-lg bg-white/[0.04] text-white/30 hover:text-white/50 disabled:opacity-30 transition-colors"
                    >
                      <ChevronLeft className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page >= totalPages}
                      className="h-7 w-7 flex items-center justify-center rounded-lg bg-white/[0.04] text-white/30 hover:text-white/50 disabled:opacity-30 transition-colors"
                    >
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
      </GlassCard>
    </motion.div>
  )
}
