import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import type { DashboardResponse } from '@/types/dashboard'

export function useDashboardStats(): UseQueryResult<DashboardResponse> {
  return useQuery<DashboardResponse>({
    queryKey: ['admin', 'dashboard'],
    queryFn: async () => {
      const res = await fetch('/api/admin/dashboard')
      if (!res.ok) throw new Error('Failed to fetch dashboard')
      return res.json()
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  })
}
