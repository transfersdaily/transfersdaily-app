import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import type { SocialAggregateStats } from '@/types/social'

export function useSocialStats(
  period: '7d' | '30d' = '7d'
): UseQueryResult<SocialAggregateStats> {
  return useQuery<SocialAggregateStats>({
    queryKey: ['admin', 'social-stats', period],
    queryFn: async () => {
      const res = await fetch(`/api/admin/social/stats?period=${period}`)
      if (!res.ok) throw new Error('Failed to fetch social stats')
      return res.json()
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  })
}
