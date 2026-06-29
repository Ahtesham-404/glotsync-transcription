// build: 2026-06-29
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,   // 2 minutes
      gcTime: 1000 * 60 * 10,     // 10 minutes

      // Only retry once, and never retry 4xx errors.
      // Without this, a failed API call retries 3× with exponential back-off
      // (up to 32 seconds delay) which is why pages feel "stuck".
      retry: (failureCount, error) => {
        if (error instanceof Error && 'status' in error) {
          const status = (error as { status: number }).status
          if (status >= 400 && status < 500) return false
        }
        // For network errors (backend unreachable) retry once only
        return failureCount < 1
      },
      retryDelay: 1000, // 1 second flat — no exponential back-off

      refetchOnWindowFocus: false,

      // Don't throw on error — let the component handle it gracefully
      throwOnError: false,
    },
    mutations: {
      retry: 0,
    },
  },
})
