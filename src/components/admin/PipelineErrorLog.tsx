"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { Search, AlertCircle, CheckCircle } from "lucide-react"
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
  return `${Math.floor(diffHours / 24)}d ago`
}

interface PipelineErrorLogProps {
  errors: PipelineErrorsResponse | null
  isLoading: boolean
}

export function PipelineErrorLog({ errors: data, isLoading }: PipelineErrorLogProps) {
  const [search, setSearch] = useState('')

  const filtered = (data?.errors || []).filter(e => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      e.sourceName.toLowerCase().includes(q) ||
      e.errorMessage.toLowerCase().includes(q) ||
      (e.articleTitle || '').toLowerCase().includes(q)
    )
  })

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
      <Card className="relative overflow-hidden bg-white/[0.03] border border-white/[0.06] backdrop-blur-md">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider">Error Log</h3>
              <p className="text-[11px] text-white/20 mt-0.5">
                {data ? `${data.totalCount} issue${data.totalCount !== 1 ? 's' : ''} in last 7 days` : 'Loading...'}
              </p>
            </div>
            <div className="relative w-48">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-white/20" />
              <Input
                placeholder="Filter errors..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-8 h-8 bg-white/[0.03] border-white/[0.06] text-white/60 placeholder:text-white/15 text-xs"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full bg-white/[0.04]" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-8 text-center">
              <CheckCircle className="h-8 w-8 mx-auto mb-2 text-emerald-400/30" />
              <p className="text-sm text-white/20">
                {search ? 'No matching errors' : 'No errors detected'}
              </p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {filtered.map((error, i) => (
                <motion.div
                  key={error.id}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.02 }}
                  className="rounded-lg border border-white/[0.04] bg-white/[0.02] p-3 hover:bg-white/[0.03] transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2 min-w-0">
                      <AlertCircle className="h-3.5 w-3.5 text-red-400/50 mt-0.5 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-white/50 line-clamp-2">{error.errorMessage}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-[10px] text-white/25">{error.sourceName}</span>
                          <span className="text-[10px] text-white/15">|</span>
                          <span className="text-[10px] text-white/25">{error.errorStep}</span>
                          {error.articleTitle && (
                            <>
                              <span className="text-[10px] text-white/15">|</span>
                              <span className="text-[10px] text-white/20 truncate max-w-[200px]">{error.articleTitle}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] text-white/15">{formatRelativeTime(error.occurredAt)}</span>
                      {error.resolved && (
                        <Badge className="text-[9px] px-1.5 py-0 bg-emerald-500/10 text-emerald-400/60 border-emerald-500/20">
                          Resolved
                        </Badge>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
        <div className="absolute top-0 left-0 right-0 h-[1px] opacity-30" style={{ background: "linear-gradient(90deg, transparent, #ef4444, transparent)" }} />
      </Card>
    </motion.div>
  )
}
