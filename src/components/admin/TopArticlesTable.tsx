'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowUpDown, ArrowUp, ArrowDown, Search, ChevronDown } from 'lucide-react'
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

function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell><Skeleton className="h-4 w-6" /></TableCell>
          <TableCell><Skeleton className="h-4 w-48" /></TableCell>
          <TableCell><Skeleton className="h-4 w-12" /></TableCell>
          <TableCell><Skeleton className="h-4 w-14" /></TableCell>
        </TableRow>
      ))}
    </>
  )
}

function SortIcon({ column, sortKey, sortDir }: { column: SortKey; sortKey: SortKey; sortDir: SortDir }) {
  if (column !== sortKey) return <ArrowUpDown className="ml-1 h-3.5 w-3.5" />
  return sortDir === 'asc' ? <ArrowUp className="ml-1 h-3.5 w-3.5" /> : <ArrowDown className="ml-1 h-3.5 w-3.5" />
}

export function TopArticlesTable({ articles, isLoading }: TopArticlesTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('rank')
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)

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
    <Card className="bg-card border border-border shadow-sm">
      <CardHeader>
        <CardTitle>Top Articles</CardTitle>
        <CardDescription>Most viewed articles in selected period</CardDescription>
      </CardHeader>
      <CardContent>
        {!isLoading && !hasData ? (
          <div className="flex items-center justify-center py-12 text-muted-foreground">
            No article data available
          </div>
        ) : (
          <>
            {/* Search */}
            {hasData && (
              <div className="flex items-center gap-2 mb-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Filter articles..."
                    value={search}
                    onChange={e => { setSearch(e.target.value); setPage(1) }}
                    className="pl-8"
                  />
                </div>
              </div>
            )}

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Button variant="ghost" size="sm" className="h-8 p-0" onClick={() => toggleSort('rank')}>
                        #<SortIcon column="rank" sortKey={sortKey} sortDir={sortDir} />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" size="sm" className="h-8 p-0" onClick={() => toggleSort('title')}>
                        Title<SortIcon column="title" sortKey={sortKey} sortDir={sortDir} />
                      </Button>
                    </TableHead>
                    <TableHead className="text-right">
                      <Button variant="ghost" size="sm" className="h-8 p-0" onClick={() => toggleSort('pageViews')}>
                        Views<SortIcon column="pageViews" sortKey={sortKey} sortDir={sortDir} />
                      </Button>
                    </TableHead>
                    <TableHead className="text-right">
                      <Button variant="ghost" size="sm" className="h-8 p-0" onClick={() => toggleSort('avgDuration')}>
                        Avg. Time<SortIcon column="avgDuration" sortKey={sortKey} sortDir={sortDir} />
                      </Button>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableSkeleton />
                  ) : paged.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                        No matching articles
                      </TableCell>
                    </TableRow>
                  ) : (
                    paged.map((article) => (
                      <TableRow key={article.rank}>
                        <TableCell className="font-medium text-muted-foreground">
                          {article.rank}
                        </TableCell>
                        <TableCell>
                          {article.title ? (
                            <a
                              href={article.url}
                              className="hover:underline font-medium"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {article.title}
                            </a>
                          ) : (
                            <span>
                              <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">
                                {article.slug}
                              </code>
                              <span className="text-muted-foreground ml-2 text-sm">(no title)</span>
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {new Intl.NumberFormat('en-US').format(article.pageViews)}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {formatDuration(article.avgDuration)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {hasData && filtered.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4">
                <span className="text-sm text-muted-foreground">
                  {filtered.length} article{filtered.length !== 1 ? 's' : ''}
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
          </>
        )}
      </CardContent>
    </Card>
  )
}
