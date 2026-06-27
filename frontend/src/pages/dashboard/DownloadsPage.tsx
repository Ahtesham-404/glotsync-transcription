import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Download, FileText, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { useToast } from '@/components/ui/Toast'
import { useFiles } from '@/hooks/useFiles'
import { getDownloadUrl } from '@/hooks/useTranscript'

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function DownloadsPage() {
  const { data, isLoading } = useFiles(1, 100)
  const { toast } = useToast()
  const [downloading, setDownloading] = useState<string | null>(null)

  const completedFiles = data?.items.filter((f) => f.job?.status === 'completed') ?? []

  const handleDownload = async (fileId: string, format: 'txt' | 'srt' | 'vtt') => {
    const key = `${fileId}-${format}`
    setDownloading(key)
    try {
      const { downloadUrl } = await getDownloadUrl(fileId, format)
      const a = document.createElement('a')
      a.href = downloadUrl
      a.download = `transcript.${format}`
      a.click()
    } catch {
      toast.error('Download failed', 'Could not generate download link.')
    } finally {
      setDownloading(null)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <Download size={22} className="text-brand-400" />
        <h1 className="text-2xl font-bold text-gray-100">Downloads</h1>
      </div>
      <p className="text-gray-400 text-sm">Download transcripts from all your completed files.</p>

      {isLoading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : completedFiles.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <FileText size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium">No completed transcripts yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {completedFiles.map((file, i) => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="glass rounded-xl p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-medium text-gray-200">{file.originalName}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{formatDate(file.createdAt)}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {(['txt', 'srt', 'vtt'] as const).map((fmt) => {
                  const key = `${file.id}-${fmt}`
                  const isLoading = downloading === key
                  return (
                    <Button
                      key={fmt}
                      variant="secondary"
                      size="sm"
                      loading={isLoading}
                      icon={isLoading ? undefined : <Download size={13} />}
                      onClick={() => handleDownload(file.id, fmt)}
                    >
                      .{fmt.toUpperCase()}
                    </Button>
                  )
                })}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
