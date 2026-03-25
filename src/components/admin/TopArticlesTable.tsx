'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import type { TopArticlesResponse } from '@/types/analytics'

function formatDuration(seconds: number): string {
  if (!seconds || isNaN(seconds)) return '0m 0s'
  const mins = Math.floor(seconds / 60)
  const secs = Math.round(seconds % 60)
  return `${mins}m ${secs}s`
}

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

export function TopArticlesTable({ articles, isLoading }: TopArticlesTableProps) {
  const hasData = articles && articles.length > 0

  return (
    <Card className="bg-white border border-gray-200 shadow-sm">
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
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead className="text-right">Views</TableHead>
                  <TableHead className="text-right">Avg. Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableSkeleton />
                ) : (
                  articles!.map((article) => (
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
        )}
      </CardContent>
    </Card>
  )
}
