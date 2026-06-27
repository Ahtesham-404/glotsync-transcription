import { useQuery } from '@tanstack/react-query'
import apiClient from '@/lib/axios'
import type { Transcript, DownloadResponse } from '@/types'

export const transcriptKeys = {
  detail: (id: string) => ['transcript', id] as const,
  download: (id: string, format: string) => ['download', id, format] as const,
}

export function useTranscript(transcriptId: string | undefined) {
  return useQuery({
    queryKey: transcriptKeys.detail(transcriptId ?? ''),
    queryFn: async (): Promise<Transcript> => {
      const { data } = await apiClient.get(`/api/transcript/${transcriptId}`)
      return data
    },
    enabled: Boolean(transcriptId),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export async function getDownloadUrl(
  fileId: string,
  format: 'txt' | 'srt' | 'vtt' | 'original'
): Promise<DownloadResponse> {
  const { data } = await apiClient.get(`/api/download/${fileId}`, {
    params: { format },
  })
  return data
}
