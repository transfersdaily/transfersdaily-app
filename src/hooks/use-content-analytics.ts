'use client'

import { useQuery } from '@tanstack/react-query'
import type {
  ContentDistributionResponse,
  ArticleViewsResponse,
  TranslationCoverageResponse,
} from '@/types/content-analytics'

export function useContentDistribution() {
  return useQuery<ContentDistributionResponse>({
    queryKey: ['admin', 'content', 'distribution'],
    queryFn: async () => {
      const res = await fetch('/api/admin/content/distribution')
      if (!res.ok) throw new Error('Failed to fetch content distribution')
      return res.json()
    },
    staleTime: 5 * 60 * 1000, // 5 min (matches server cache)
    refetchOnWindowFocus: false,
  })
}

export function useArticleViews(slugs: string[]) {
  return useQuery<ArticleViewsResponse>({
    queryKey: ['admin', 'content', 'article-views', slugs.sort().join(',')],
    queryFn: async () => {
      const res = await fetch(`/api/admin/content/article-views?slugs=${slugs.join(',')}`)
      if (!res.ok) throw new Error('Failed to fetch article views')
      return res.json()
    },
    staleTime: 60 * 60 * 1000, // 1 hour (matches server cache)
    enabled: slugs.length > 0,
    refetchOnWindowFocus: false,
  })
}

export function useTranslationCoverage() {
  return useQuery<TranslationCoverageResponse>({
    queryKey: ['admin', 'content', 'translations'],
    queryFn: async () => {
      const res = await fetch('/api/admin/content/translations')
      if (!res.ok) throw new Error('Failed to fetch translation coverage')
      return res.json()
    },
    staleTime: 5 * 60 * 1000, // 5 min (matches server cache)
    refetchOnWindowFocus: false,
  })
}
