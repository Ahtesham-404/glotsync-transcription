import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '@/lib/axios'
import type { UploadedFile, PaginatedResponse, TranscriptionJob } from '@/types'

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const fileKeys = {
  all: ['files'] as const,
  list: (page: number, pageSize: number) => ['files', 'list', page, pageSize] as const,
  detail: (id: string) => ['files', id] as const,
  job: (id: string) => ['files', id, 'job'] as const,
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

export function useFiles(page = 1, pageSize = 20) {
  return useQuery({
    queryKey: fileKeys.list(page, pageSize),
    queryFn: async (): Promise<PaginatedResponse<UploadedFile>> => {
      const { data } = await apiClient.get('/api/files', {
        params: { page, page_size: pageSize },
      })
      return data
    },
  })
}

export function useFile(id: string) {
  return useQuery({
    queryKey: fileKeys.detail(id),
    queryFn: async (): Promise<UploadedFile> => {
      const { data } = await apiClient.get(`/api/files/${id}`)
      return data
    },
    enabled: Boolean(id),
  })
}

export function useJobStatus(jobId: string | undefined, enabled = true) {
  return useQuery({
    queryKey: fileKeys.job(jobId ?? ''),
    queryFn: async (): Promise<TranscriptionJob> => {
      const { data } = await apiClient.get(`/api/jobs/${jobId}`)
      return data
    },
    enabled: Boolean(jobId) && enabled,
    refetchInterval: (query) => {
      const status = query.state.data?.status
      if (status === 'queued' || status === 'processing' || status === 'uploading') {
        return 3000 // poll every 3s while in progress
      }
      return false
    },
  })
}

export function useDeleteFile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (fileId: string) => {
      await apiClient.delete(`/api/files/${fileId}`)
      return fileId
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fileKeys.all })
    },
  })
}
