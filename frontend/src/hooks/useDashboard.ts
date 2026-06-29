import { useQuery } from '@tanstack/react-query'
import apiClient from '@/lib/axios'
import type { DashboardStats } from '@/types'

// Empty stats returned when the backend is unreachable
const EMPTY_STATS: DashboardStats = {
  totalUploads: 0,
  completedJobs: 0,
  processingJobs: 0,
  failedJobs: 0,
  storageUsedBytes: 0,
  storageQuotaBytes: 524288000, // 500 MB default (free plan)
  recentActivity: [],
  usageByDay: [],
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: async (): Promise<DashboardStats> => {
      try {
        const { data } = await apiClient.get('/api/dashboard/stats', {
          // Short timeout so the dashboard renders quickly even if backend is slow
          timeout: 8000,
        })
        return data
      } catch {
        // Return empty stats rather than leaving the dashboard in a loading/error
        // state when the backend is temporarily unreachable
        return EMPTY_STATS
      }
    },
    staleTime: 1000 * 30,           // 30 seconds
    refetchInterval: 1000 * 60 * 5, // poll every 5 minutes (was every 1 minute)
    placeholderData: EMPTY_STATS,
    gcTime: 1000 * 60 * 10,
  })
}
