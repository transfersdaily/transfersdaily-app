"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Activity,
  FileText,
  Radio,
  TrendingUp,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  ChevronDown,
} from "lucide-react"
import type { PipelineStatsResponse } from "@/types/pipeline"

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
  if (diffDays === 1) return "1d ago"
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString()
}

type SortKey = 'sourceName' | 'articlesTotal' | 'articles24h' | 'articles7d' | 'published24h' | 'drafts24h' | 'lastArticleAt'
type SortDir = 'asc' | 'desc'

function SortIcon({ column, sortKey, sortDir }: { column: SortKey; sortKey: SortKey; sortDir: SortDir }) {
  if (column !== sortKey) return <ArrowUpDown className="ml-1 h-3.5 w-3.5" />
  return sortDir === 'asc' ? <ArrowUp className="ml-1 h-3.5 w-3.5" /> : <ArrowDown className="ml-1 h-3.5 w-3.5" />
}

interface PipelineMonitorProps {
  stats: PipelineStatsResponse | null
  isLoading: boolean
}

export function PipelineMonitor({ stats, isLoading }: PipelineMonitorProps) {
  const [sortKey, setSortKey] = useState<SortKey>('articles24h')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)

  const filtered = useMemo(() => {
    if (!stats || stats.sources.length === 0) return []
    let result = [...stats.sources]
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(s => s.sourceName.toLowerCase().includes(q))
    }
    result.sort((a, b) => {
      let cmp = 0
      switch (sortKey) {
        case 'sourceName': cmp = a.sourceName.localeCompare(b.sourceName); break
        case 'articlesTotal': cmp = a.articlesTotal - b.articlesTotal; break
        case 'articles24h': cmp = a.articles24h - b.articles24h; break
        case 'articles7d': cmp = a.articles7d - b.articles7d; break
        case 'published24h': cmp = a.published24h - b.published24h; break
        case 'drafts24h': cmp = a.drafts24h - b.drafts24h; break
        case 'lastArticleAt': {
          const aTime = a.lastArticleAt ? new Date(a.lastArticleAt).getTime() : 0
          const bTime = b.lastArticleAt ? new Date(b.lastArticleAt).getTime() : 0
          cmp = aTime - bTime
          break
        }
      }
      return sortDir === 'asc' ? cmp : -cmp
    })
    return result
  }, [stats, search, sortKey, sortDir])

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const paged = filtered.slice((page - 1) * perPage, page * perPage)

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
    setPage(1)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Skeleton summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="bg-[#1a1a1a] border border-[#2a2a2a] shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-4" />
                </div>
                <Skeleton className="h-8 w-16 mb-1" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Skeleton table */}
        <Card className="bg-[#1a1a1a] border border-[#2a2a2a] shadow-sm">
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!stats || stats.sources.length === 0) {
    return (
      <div className="space-y-6">
        <Card className="bg-[#1a1a1a] border border-[#2a2a2a] shadow-sm">
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <Activity className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No pipeline data available yet</p>
              <p className="text-xs mt-1">Stats will appear after the first pipeline run</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const summaryCards = [
    {
      title: "Total Sources",
      value: stats.summary.totalSources,
      icon: Radio,
    },
    {
      title: "Active Sources (24h)",
      value: stats.summary.activeSources24h,
      icon: Activity,
    },
    {
      title: "Articles (24h)",
      value: stats.summary.totalArticles24h,
      icon: FileText,
    },
    {
      title: "Published (24h)",
      value: stats.summary.totalPublished24h,
      icon: TrendingUp,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card) => {
          const Icon = card.icon
          return (
            <Card key={card.title} className="bg-[#1a1a1a] border border-[#2a2a2a] shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    {card.title}
                  </span>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="text-2xl font-bold">{card.value}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Per-Source Stats Table */}
      <Card className="bg-[#1a1a1a] border border-[#2a2a2a] shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Per-Source Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="flex items-center gap-2 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Filter sources..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1) }}
                className="pl-8"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Button variant="ghost" size="sm" className="h-8 p-0" onClick={() => toggleSort('sourceName')}>
                      Source<SortIcon column="sourceName" sortKey={sortKey} sortDir={sortDir} />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">
                    <Button variant="ghost" size="sm" className="h-8 p-0" onClick={() => toggleSort('articlesTotal')}>
                      Total<SortIcon column="articlesTotal" sortKey={sortKey} sortDir={sortDir} />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">
                    <Button variant="ghost" size="sm" className="h-8 p-0" onClick={() => toggleSort('articles24h')}>
                      24h<SortIcon column="articles24h" sortKey={sortKey} sortDir={sortDir} />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">
                    <Button variant="ghost" size="sm" className="h-8 p-0" onClick={() => toggleSort('articles7d')}>
                      7d<SortIcon column="articles7d" sortKey={sortKey} sortDir={sortDir} />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">
                    <Button variant="ghost" size="sm" className="h-8 p-0" onClick={() => toggleSort('published24h')}>
                      Published (24h)<SortIcon column="published24h" sortKey={sortKey} sortDir={sortDir} />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">
                    <Button variant="ghost" size="sm" className="h-8 p-0" onClick={() => toggleSort('drafts24h')}>
                      Drafts (24h)<SortIcon column="drafts24h" sortKey={sortKey} sortDir={sortDir} />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" size="sm" className="h-8 p-0" onClick={() => toggleSort('lastArticleAt')}>
                      Last Article<SortIcon column="lastArticleAt" sortKey={sortKey} sortDir={sortDir} />
                    </Button>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      No matching sources
                    </TableCell>
                  </TableRow>
                ) : (
                  paged.map((source) => {
                    const hasDraftImbalance = source.drafts24h > source.published24h
                    return (
                      <TableRow
                        key={source.sourceName}
                        className={hasDraftImbalance ? "bg-amber-500/10" : ""}
                      >
                        <TableCell className="font-medium">
                          {source.sourceName}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {source.articlesTotal}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {source.articles24h}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {source.articles7d}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {source.published24h}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {source.drafts24h}
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-muted-foreground">
                          {source.lastArticleAt
                            ? formatRelativeTime(source.lastArticleAt)
                            : "Never"}
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {filtered.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4">
              <span className="text-sm text-muted-foreground">
                {filtered.length} source{filtered.length !== 1 ? 's' : ''}
              </span>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">Rows</span>
                  <Select value={perPage.toString()} onValueChange={v => { setPerPage(Number(v)); setPage(1) }}>
                    <SelectTrigger className="h-8 w-[65px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent side="top">
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <span className="text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </span>
                <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}>
                  <ChevronDown className="h-4 w-4 rotate-90" />
                </Button>
                <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>
                  <ChevronDown className="h-4 w-4 -rotate-90" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
