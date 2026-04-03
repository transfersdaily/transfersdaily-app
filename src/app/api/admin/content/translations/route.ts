import { NextResponse } from 'next/server'
import { unstable_cache } from 'next/cache'
import { validateAuth } from '@/lib/supabase/auth-guard'
import { createAdminClient } from '@/lib/supabase/admin'
import { SUPPORTED_LANGUAGES } from '@/types/content-analytics'
import type { TranslationCoverageResponse } from '@/types/content-analytics'

const LANGUAGE_LABELS: Record<string, string> = {
  en: 'English',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  it: 'Italian',
}

const getCachedTranslations = unstable_cache(
  async (): Promise<TranslationCoverageResponse> => {
    const supabase = createAdminClient()

    const [totalResult, translationsResult] = await Promise.all([
      supabase
        .from('articles')
        .select('uuid', { count: 'exact', head: true })
        .eq('status', 'published'),

      supabase
        .from('article_translations')
        .select('language'),
    ])

    const totalPublished = totalResult.count ?? 0

    // Group translations by language
    const langCounts: Record<string, number> = {}
    for (const row of translationsResult.data || []) {
      const lang = row.language
      if (!lang) continue
      langCounts[lang] = (langCounts[lang] || 0) + 1
    }

    const languages = SUPPORTED_LANGUAGES.map(lang => {
      // English is the source language — all published articles are in English
      const isEnglish = lang === 'en'
      const articleCount = totalPublished
      const translatedCount = isEnglish ? totalPublished : (langCounts[lang] || 0)
      const coveragePercent = totalPublished > 0
        ? Math.round((translatedCount / totalPublished) * 100)
        : 0

      return {
        language: lang,
        label: LANGUAGE_LABELS[lang] || lang,
        articleCount,
        translatedCount,
        coveragePercent,
      }
    })

    return {
      languages,
      totalArticles: totalPublished,
      cachedAt: new Date().toISOString(),
    }
  },
  ['content-translations'],
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
    const data = await getCachedTranslations()
    return NextResponse.json(data)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { success: false, error: `Failed to fetch translation coverage: ${message}` },
      { status: 500 }
    )
  }
}
