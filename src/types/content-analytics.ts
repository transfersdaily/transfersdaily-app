export const SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de', 'it'] as const

export interface LeagueDistribution {
  league: string
  count: number
  color: string
}

export interface CategoryDistribution {
  category: string
  count: number
}

export interface DailyArticleCount {
  date: string
  label: string
  published: number
  drafts: number
}

export interface ContentDistributionResponse {
  byLeague: LeagueDistribution[]
  byCategory: CategoryDistribution[]
  articlesPerDay: DailyArticleCount[]
  totalPublished: number
  totalDrafts: number
  cachedAt: string
}

export interface ArticleViewsResponse {
  views: Record<string, number>
  cachedAt: string
}

export interface TranslationCoverageResponse {
  languages: Array<{
    language: string
    label: string
    articleCount: number
    translatedCount: number
    coveragePercent: number
  }>
  totalArticles: number
  cachedAt: string
}
