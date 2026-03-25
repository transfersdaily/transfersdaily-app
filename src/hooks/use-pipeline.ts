import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import type {
  PipelineStatsResponse,
  PipelineErrorsResponse,
  PipelineHeatmapResponse,
} from '@/types/pipeline'

export function usePipelineStats(): UseQueryResult<PipelineStatsResponse> {
  return useQuery<PipelineStatsResponse>({
    queryKey: ['admin', 'pipeline', 'stats'],
    queryFn: async () => {
      const res = await fetch('/api/admin/pipeline/stats')
      if (!res.ok) throw new Error('Failed to fetch pipeline stats')
      return res.json()
    },
    staleTime: 60 * 1000,
    refetchOnWindowFocus: true,
  })
}

export function usePipelineErrors(): UseQueryResult<PipelineErrorsResponse> {
  return useQuery<PipelineErrorsResponse>({
    queryKey: ['admin', 'pipeline', 'errors'],
    queryFn: async () => {
      const res = await fetch('/api/admin/pipeline/errors')
      if (!res.ok) throw new Error('Failed to fetch pipeline errors')
      return res.json()
    },
    staleTime: 60 * 1000,
    refetchOnWindowFocus: true,
  })
}

export function usePipelineHeatmap(): UseQueryResult<PipelineHeatmapResponse> {
  return useQuery<PipelineHeatmapResponse>({
    queryKey: ['admin', 'pipeline', 'heatmap'],
    queryFn: async () => {
      const res = await fetch('/api/admin/pipeline/heatmap')
      if (!res.ok) throw new Error('Failed to fetch pipeline heatmap')
      return res.json()
    },
    staleTime: 60 * 1000,
    refetchOnWindowFocus: true,
  })
}
