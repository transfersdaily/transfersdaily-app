"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import {
  AlertCircle,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
} from "lucide-react"
import type { PipelineErrorsResponse } from "@/types/pipeline"

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

function truncateMessage(message: string, maxLen: number): string {
  if (message.length <= maxLen) return message
  return message.slice(0, maxLen) + "..."
}

type SortKey = 'occurredAt' | 'sourceName' | 'errorStep' | 'resolved'
type SortDir = 'asc' | 'desc'

function SortIcon({ column, sortKey, sortDir }: { column: SortKey; sortKey: SortKey; sortDir: SortDir }) {
  if (column !== sortKey) return <ArrowUpDown className="ml-1 h-3.5 w-3.5" />
  return sortDir === 'asc' ? <ArrowUp className="ml-1 h-3.5 w-3.5" /> : <ArrowDown className="ml-1 h-3.5 w-3.5" />
}

interface PipelineErrorLogProps {
  errors: PipelineErrorsResponse | null
  isLoading: boolean
}

export function PipelineErrorLog({ errors, isLoading }: PipelineErrorLogProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [sortKey, setSortKey] = useState<SortKey>('occurredAt')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'resolved' | 'unresolved'>('all')
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)

  function toggleRow(id: string) {
    setExpandedRows((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const hasErrors = errors && errors.errors.length > 0

  const filtered = useMemo(() => {
    if (!hasErrors) return []
    let result = [...errors.errors]

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(e =>
        e.sourceName.toLowerCase().includes(q) ||
        e.errorStep.toLowerCase().includes(q) ||
        e.errorMessage.toLowerCase().includes(q)
      )
    }

    if (statusFilter === 'resolved') {
      result = result.filter(e => e.resolved)
    } else if (statusFilter === 'unresolved') {
      result = result.filter(e => !e.resolved)
    }

    result.sort((a, b) => {
      let cmp = 0
      switch (sortKey) {
        case 'occurredAt': cmp = new Date(a.occurredAt).getTime() - new Date(b.occurredAt).getTime(); break
        case 'sourceName': cmp = a.sourceName.localeCompare(b.sourceName); break
        case 'errorStep': cmp = a.errorStep.localeCompare(b.errorStep); break
        case 'resolved': cmp = (a.resolved ? 1 : 0) - (b.resolved ? 1 : 0); break
      }
      return sortDir === 'asc' ? cmp : -cmp
    })
    return result
  }, [errors, hasErrors, search, statusFilter, sortKey, sortDir])

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const paged = filtered.slice((page - 1) * perPage, page * perPage)

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir(key === 'occurredAt' ? 'desc' : 'asc')
    }
    setPage(1)
  }

  if (isLoading) {
    return (
      <Card className="bg-[#1a1a1a] border border-[#2a2a2a] shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Error Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-[#1a1a1a] border border-[#2a2a2a] shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Error Log
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!hasErrors ? (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-500 opacity-70" />
            <p className="text-sm text-muted-foreground">
              No pipeline errors in the last 7 days
            </p>
          </div>
        ) : (
          <>
            {/* Search + Status Filter */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Filter errors..."
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1) }}
                  className="pl-8"
                />
              </div>
              <Select value={statusFilter} onValueChange={(v: 'all' | 'resolved' | 'unresolved') => { setStatusFilter(v); setPage(1) }}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="unresolved">Unresolved</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-6"></TableHead>
                    <TableHead>
                      <Button variant="ghost" size="sm" className="h-8 p-0" onClick={() => toggleSort('occurredAt')}>
                        Time<SortIcon column="occurredAt" sortKey={sortKey} sortDir={sortDir} />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" size="sm" className="h-8 p-0" onClick={() => toggleSort('sourceName')}>
                        Source<SortIcon column="sourceName" sortKey={sortKey} sortDir={sortDir} />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" size="sm" className="h-8 p-0" onClick={() => toggleSort('errorStep')}>
                        Step<SortIcon column="errorStep" sortKey={sortKey} sortDir={sortDir} />
                      </Button>
                    </TableHead>
                    <TableHead>Error Message</TableHead>
                    <TableHead>
                      <Button variant="ghost" size="sm" className="h-8 p-0" onClick={() => toggleSort('resolved')}>
                        Status<SortIcon column="resolved" sortKey={sortKey} sortDir={sortDir} />
                      </Button>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paged.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        No matching errors
                      </TableCell>
                    </TableRow>
                  ) : (
                    paged.map((error) => {
                      const isExpanded = expandedRows.has(error.id)
                      const isLong = error.errorMessage.length > 80
                      return (
                        <TableRow key={error.id} className="align-top">
                          <TableCell className="pr-2">
                            {isLong && (
                              <button
                                onClick={() => toggleRow(error.id)}
                                className="text-muted-foreground hover:text-foreground transition-colors"
                                aria-label={isExpanded ? "Collapse" : "Expand"}
                              >
                                {isExpanded ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                              </button>
                            )}
                          </TableCell>
                          <TableCell className="whitespace-nowrap text-muted-foreground">
                            {formatRelativeTime(error.occurredAt)}
                          </TableCell>
                          <TableCell className="font-medium">
                            {error.sourceName}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {error.errorStep}
                          </TableCell>
                          <TableCell>
                            <div>
                              {isExpanded
                                ? null
                                : truncateMessage(error.errorMessage, 80)}
                            </div>
                            {isExpanded && (
                              <pre className="mt-1 p-2 bg-[#222222] border border-[#2a2a2a] rounded text-xs whitespace-pre-wrap break-words max-w-lg text-gray-300">
                                {error.errorMessage}
                              </pre>
                            )}
                          </TableCell>
                          <TableCell>
                            {error.resolved ? (
                              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/20">
                                Resolved
                              </Badge>
                            ) : (
                              <Badge variant="destructive">Unresolved</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4">
              <span className="text-sm text-muted-foreground">
                {filtered.length} error{filtered.length !== 1 ? 's' : ''}
                {errors.totalCount > errors.errors.length && ` (showing ${errors.errors.length} of ${errors.totalCount} total)`}
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
          </>
        )}
      </CardContent>
    </Card>
  )
}
