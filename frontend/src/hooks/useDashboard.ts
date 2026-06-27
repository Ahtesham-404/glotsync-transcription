import { useQuery } from '@tanstack/react-query'
import apiClient from '@/lib/axios'
import type { DashboardStats } from '@/types'

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: async (): Promise<DashboardStats> => {
      const { data } = await apiClient.get('/api/dashboard/stats')
      return data
    },
    staleTime: 1000 * 30, // 30 seconds
    refetchInterval: 1000 * 60, // refresh every minute
  })
}
