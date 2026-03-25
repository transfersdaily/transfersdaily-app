"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, CheckCircle, ChevronDown, ChevronRight } from "lucide-react"
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

interface PipelineErrorLogProps {
  errors: PipelineErrorsResponse | null
  isLoading: boolean
}

export function PipelineErrorLog({ errors, isLoading }: PipelineErrorLogProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

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

  if (isLoading) {
    return (
      <Card>
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

  const hasErrors = errors && errors.errors.length > 0
  const sortedErrors = hasErrors
    ? [...errors.errors].sort(
        (a, b) =>
          new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime()
      )
    : []

  return (
    <Card>
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
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-2 pr-2 w-6"></th>
                    <th className="pb-2 pr-4">Time</th>
                    <th className="pb-2 pr-4">Source</th>
                    <th className="pb-2 pr-4">Step</th>
                    <th className="pb-2 pr-4">Error Message</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedErrors.map((error) => {
                    const isExpanded = expandedRows.has(error.id)
                    const isLong = error.errorMessage.length > 80
                    return (
                      <tr key={error.id} className="border-b last:border-0 align-top">
                        <td className="py-2 pr-2">
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
                        </td>
                        <td className="py-2 pr-4 whitespace-nowrap text-muted-foreground">
                          {formatRelativeTime(error.occurredAt)}
                        </td>
                        <td className="py-2 pr-4 font-medium">
                          {error.sourceName}
                        </td>
                        <td className="py-2 pr-4 text-muted-foreground">
                          {error.errorStep}
                        </td>
                        <td className="py-2 pr-4">
                          <div>
                            {isExpanded
                              ? null
                              : truncateMessage(error.errorMessage, 80)}
                          </div>
                          {isExpanded && (
                            <pre className="mt-1 p-2 bg-gray-50 border border-gray-200 rounded text-xs whitespace-pre-wrap break-words max-w-lg">
                              {error.errorMessage}
                            </pre>
                          )}
                        </td>
                        <td className="py-2">
                          {error.resolved ? (
                            <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100">
                              Resolved
                            </Badge>
                          ) : (
                            <Badge variant="destructive">Unresolved</Badge>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            {errors.totalCount > errors.errors.length && (
              <p className="text-xs text-muted-foreground mt-3">
                Showing {errors.errors.length} of {errors.totalCount} errors
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
