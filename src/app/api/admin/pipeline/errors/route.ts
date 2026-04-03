import { NextResponse } from 'next/server'
import { validateAuth } from '@/lib/supabase/auth-guard'
import { createAdminClient } from '@/lib/supabase/admin'
import { unstable_cache } from 'next/cache'
import type { PipelineErrorsResponse, PipelineError } from '@/types/pipeline'

function hoursAgo(h: number): string {
  return new Date(Date.now() - h * 60 * 60 * 1000).toISOString()
}

function daysAgo(d: number): string {
  return new Date(Date.now() - d * 24 * 60 * 60 * 1000).toISOString()
}

interface PipelineEventRow {
  id: number
  source_name: string
  error_message: string | null
  error_step: string | null
  occurred_at: string
  resolved: boolean
  articles?: { title?: string } | null
}

interface StaleArticleRow {
  uuid: string
  title: string | null
  created_at: string
  social_media_data: { sourceName?: string } | null
}

const getCachedPipelineErrors = unstable_cache(
  async (): Promise<PipelineErrorsResponse> => {
    const supabase = createAdminClient()
    const errors: PipelineError[] = []

    const now7d = daysAgo(7)
    const now24h = hoursAgo(24)
    const now2h = hoursAgo(2)

    // Query pipeline_events table (gracefully handle if table doesn't exist)
    try {
      const { data: events, error: eventsError } = await supabase
        .from('pipeline_events')
        .select('id, source_name, error_message, error_step, occurred_at, resolved, articles(title)')
        .eq('event_type', 'error')
        .gte('occurred_at', now7d)
        .order('occurred_at', { ascending: false })
        .limit(50)

      if (!eventsError && events) {
        for (const event of events as PipelineEventRow[]) {
          errors.push({
            id: String(event.id),
            sourceName: event.source_name,
            errorMessage: event.error_message ?? 'Unknown error',
            errorStep: event.error_step ?? 'unknown',
            occurredAt: event.occurred_at,
            articleTitle: event.articles?.title ?? undefined,
            resolved: event.resolved,
          })
        }
      }
    } catch {
      // pipeline_events table likely doesn't exist yet -- continue with stale draft detection
    }

    // Query stale drafts as proxy errors: articles stuck in draft for >2h in the last 24h
    const { data: staleDrafts } = await supabase
      .from('articles')
      .select('uuid, title, created_at, social_media_data')
      .eq('status', 'draft')
      .gte('created_at', now24h)
      .lte('created_at', now2h)
      .order('created_at', { ascending: false })
      .limit(50)

    if (staleDrafts) {
      for (const draft of staleDrafts as StaleArticleRow[]) {
        const sourceName = draft.social_media_data?.sourceName ?? 'unknown'
        errors.push({
          id: draft.uuid,
          sourceName,
          errorMessage: 'Article stuck in draft status for over 2 hours',
          errorStep: 'publish',
          occurredAt: draft.created_at,
          articleTitle: draft.title ?? undefined,
          resolved: false,
        })
      }
    }

    // Sort combined errors by date descending
    errors.sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime())

    return {
      errors: errors.slice(0, 50),
      totalCount: errors.length,
      cachedAt: new Date().toISOString(),
    }
  },
  ['admin-pipeline-errors'],
  { revalidate: 3600 }
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
    const data = await getCachedPipelineErrors()
    return NextResponse.json(data)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { success: false, error: `Failed to fetch pipeline errors: ${message}` },
      { status: 500 }
    )
  }
}
