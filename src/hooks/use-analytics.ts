'use client'

import { useQuery } from '@tanstack/react-query'
import type { TrafficResponse, TopArticlesResponse } from '@/types/analytics'

export function useTrafficData(days: number) {
  return useQuery<TrafficResponse>({
    queryKey: ['admin', 'analytics', 'traffic', days],
    queryFn: async () => {
      const res = await fetch(`/api/admin/analytics/traffic?days=${days}`)
      if (!res.ok) throw new Error('Failed to fetch traffic data')
      return res.json()
    },
    staleTime: 60 * 60 * 1000, // 1 hour (matches server cache)
    refetchOnWindowFocus: false,
  })
}

export function useTopArticles(days: number) {
  return useQuery<TopArticlesResponse>({
    queryKey: ['admin', 'analytics', 'top-articles', days],
    queryFn: async () => {
      const res = await fetch(`/api/admin/analytics/top-articles?days=${days}`)
      if (!res.ok) throw new Error('Failed to fetch top articles')
      return res.json()
    },
    staleTime: 60 * 60 * 1000, // 1 hour (matches server cache)
    refetchOnWindowFocus: false,
  })
}
