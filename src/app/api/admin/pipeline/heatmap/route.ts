import { NextResponse } from 'next/server'
import { validateAuth } from '@/lib/supabase/auth-guard'
import { createAdminClient } from '@/lib/supabase/admin'
import { unstable_cache } from 'next/cache'
import type {
  PipelineHeatmapResponse,
  PipelineHeatmapRow,
  PipelineHeatmapCell,
} from '@/types/pipeline'

function daysAgo(d: number): string {
  return new Date(Date.now() - d * 24 * 60 * 60 * 1000).toISOString()
}

function dateStr(daysBack: number): string {
  const d = new Date()
  d.setDate(d.getDate() - daysBack)
  return d.toISOString().split('T')[0]
}

interface ArticleRow {
  status: string
  created_at: string
  social_media_data: { sourceName?: string } | null
}

interface PipelineEventRow {
  source_name: string
  occurred_at: string
}

const getCachedPipelineHeatmap = unstable_cache(
  async (): Promise<PipelineHeatmapResponse> => {
    const supabase = createAdminClient()
    const now7d = daysAgo(7)

    // Build date labels (7 days, oldest first)
    const dateLabels: string[] = []
    for (let i = 6; i >= 0; i--) {
      dateLabels.push(dateStr(i))
    }

    // Get enabled sources
    const { data: sourcesData } = await supabase
      .from('sources')
      .select('name')
      .eq('enabled', true)

    const sourceNames = (sourcesData ?? [])
      .map((s: { name: string }) => s.name)
      .sort()

    // Get articles from last 7 days
    const { data: articles } = await supabase
      .from('articles')
      .select('status, created_at, social_media_data')
      .gte('created_at', now7d)

    // Build data map: source -> date -> { total, published }
    const dataMap = new Map<string, Map<string, { total: number; published: number }>>()

    for (const name of sourceNames) {
      const dayMap = new Map<string, { total: number; published: number }>()
      for (const label of dateLabels) {
        dayMap.set(label, { total: 0, published: 0 })
      }
      dataMap.set(name, dayMap)
    }

    for (const article of (articles ?? []) as ArticleRow[]) {
      const sourceName = article.social_media_data?.sourceName
      if (!sourceName) continue

      const day = new Date(article.created_at).toISOString().split('T')[0]

      let dayMap = dataMap.get(sourceName)
      if (!dayMap) {
        // Source not in sources table but has articles -- add it
        dayMap = new Map<string, { total: number; published: number }>()
        for (const label of dateLabels) {
          dayMap.set(label, { total: 0, published: 0 })
        }
        dataMap.set(sourceName, dayMap)
      }

      const cell = dayMap.get(day)
      if (cell) {
        cell.total++
        if (article.status === 'published') {
          cell.published++
        }
      }
    }

    // Optionally get pipeline_events for error marking
    const errorDays = new Map<string, Set<string>>() // source -> Set<dateStr>
    try {
      const { data: events, error: eventsError } = await supabase
        .from('pipeline_events')
        .select('source_name, occurred_at')
        .eq('event_type', 'error')
        .gte('occurred_at', now7d)

      if (!eventsError && events) {
        for (const event of events as PipelineEventRow[]) {
          const day = new Date(event.occurred_at).toISOString().split('T')[0]
          if (!errorDays.has(event.source_name)) {
            errorDays.set(event.source_name, new Set())
          }
          errorDays.get(event.source_name)!.add(day)
        }
      }
    } catch {
      // pipeline_events table may not exist yet
    }

    // Build rows
    const rows: PipelineHeatmapRow[] = []
    const sortedSources = Array.from(dataMap.keys()).sort()

    for (const sourceName of sortedSources) {
      const dayMap = dataMap.get(sourceName)!
      const days: PipelineHeatmapCell[] = dateLabels.map((label) => {
        const cell = dayMap.get(label) ?? { total: 0, published: 0 }
        const hasErrors = errorDays.get(sourceName)?.has(label) ?? false

        let status: PipelineHeatmapCell['status']
        if (hasErrors) {
          status = 'red'
        } else if (cell.published > 0) {
          status = 'green'
        } else if (cell.total > 0) {
          status = 'yellow'
        } else {
          status = 'gray'
        }

        return {
          status,
          articleCount: cell.total,
          publishedCount: cell.published,
        }
      })

      rows.push({ sourceName, days })
    }

    return {
      rows,
      dateLabels,
      cachedAt: new Date().toISOString(),
    }
  },
  ['admin-pipeline-heatmap'],
  { revalidate: 60 }
)

export async function GET() {
  const { user, error: authError } = await validateAuth()
  if (authError) return authError
  if (!user) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const data = await getCachedPipelineHeatmap()
    return NextResponse.json(data)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { success: false, error: `Failed to fetch pipeline heatmap: ${message}` },
      { status: 500 }
    )
  }
}
