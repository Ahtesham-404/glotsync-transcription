import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Search, FileAudio, FileVideo, Trash2, Eye, Download, RefreshCw,
  Filter, ChevronLeft, ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { JobStatusBadge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { Spinner } from '@/components/ui/Spinner'
import { useToast } from '@/components/ui/Toast'
import { useFiles, useDeleteFile } from '@/hooks/useFiles'
import { getDownloadUrl } from '@/hooks/useTranscript'
import type { UploadedFile } from '@/types'

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

export function FilesPage() {
  const [page, setPage] = useState(1)
  const [query, setQuery] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<UploadedFile | null>(null)
  const { toast } = useToast()
  const { data, isLoading, refetch } = useFiles(page, 20)
  const deleteMutation = useDeleteFile()

  const filtered = data?.items.filter((f) =>
    !query || f.originalName.toLowerCase().includes(query.toLowerCase())
  ) ?? []

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteMutation.mutateAsync(deleteTarget.id)
      toast.success('File deleted', deleteTarget.originalName)
      setDeleteTarget(null)
    } catch {
      toast.error('Delete failed', 'Please try again.')
    }
  }

  const handleDownload = async (file: UploadedFile) => {
    try {
      const { downloadUrl } = await getDownloadUrl(file.id, 'original')
      window.open(downloadUrl, '_blank')
    } catch {
      toast.error('Download failed', 'Could not generate download link.')
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-bold text-gray-100">My Files</h1>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" icon={<RefreshCw size={14} />} onClick={() => refetch()}>
            Refresh
          </Button>
          <Link to="/dashboard/upload">
            <Button variant="primary" size="sm" icon={<Filter size={14} />}>
              Upload New
            </Button>
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
        <input
          type="search"
          placeholder="Search files..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-sm bg-surface-800 border border-surface-600/50 rounded-xl text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <FileAudio size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium">No files yet</p>
          <p className="text-sm mt-1">Upload your first audio or video file to get started.</p>
          <Link to="/dashboard/upload" className="mt-4 inline-block">
            <Button variant="primary" size="sm">Upload a file</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((file, i) => {
            const isVideo = ['mp4', 'mov', 'avi', 'mkv', 'webm'].some((ext) =>
              file.originalName.toLowerCase().endsWith(ext)
            )
            return (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="glass rounded-xl p-4 flex items-center gap-4 hover:border-surface-500 transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-surface-700 flex items-center justify-center flex-shrink-0">
                  {isVideo
                    ? <FileVideo size={18} className="text-blue-400" />
                    : <FileAudio size={18} className="text-brand-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-200 truncate">{file.originalName}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-gray-500">{formatBytes(file.sizeBytes)}</span>
                    <span className="text-xs text-gray-600">{formatDate(file.createdAt)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  {file.job && <JobStatusBadge status={file.job.status} />}
                  <div className="flex items-center gap-1">
                    {file.job?.status === 'completed' && file.job.transcriptId && (
                      <Link to={`/dashboard/transcript/${file.job.transcriptId}`}>
                        <Button variant="ghost" size="xs" icon={<Eye size={14} />}>View</Button>
                      </Link>
                    )}
                    <Button variant="ghost" size="xs" icon={<Download size={14} />} onClick={() => handleDownload(file)}>
                      Download
                    </Button>
                    <Button
                      variant="ghost"
                      size="xs"
                      icon={<Trash2 size={14} />}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      onClick={() => setDeleteTarget(file)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-4">
          <Button
            variant="ghost"
            size="sm"
            icon={<ChevronLeft size={14} />}
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-400">Page {page} of {data.totalPages}</span>
          <Button
            variant="ghost"
            size="sm"
            iconRight={<ChevronRight size={14} />}
            disabled={page === data.totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}

      {/* Delete modal */}
      <Modal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Delete file"
        description={`"${deleteTarget?.originalName}" and its transcript will be permanently deleted.`}
        size="sm"
      >
        <div className="flex gap-3 mt-2">
          <Button variant="secondary" fullWidth onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button
            variant="danger"
            fullWidth
            loading={deleteMutation.isPending}
            onClick={handleDelete}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  )
}
