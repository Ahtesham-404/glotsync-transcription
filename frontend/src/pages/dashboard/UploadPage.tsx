import React, { useCallback, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload, X, CheckCircle2, AlertCircle, FileAudio, FileVideo,
  RefreshCw, Loader2, Plus,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { JobStatusBadge } from '@/components/ui/Badge'
import { useToast } from '@/components/ui/Toast'
import apiClient from '@/lib/axios'
import type { UploadItem } from '@/types'

const MAX_FILE_SIZE_MB = Number(import.meta.env.VITE_MAX_FILE_SIZE_MB) || 500
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024

const SUPPORTED_MIME_TYPES = new Set([
  'audio/mpeg', 'audio/wav', 'audio/aac', 'audio/m4a', 'audio/x-m4a',
  'audio/flac', 'audio/ogg', 'audio/mp4',
  'video/mp4', 'video/quicktime', 'video/x-msvideo',
  'video/x-matroska', 'video/webm',
])

const SUPPORTED_EXTENSIONS = new Set([
  'mp3', 'wav', 'aac', 'm4a', 'flac', 'ogg',
  'mp4', 'mov', 'avi', 'mkv', 'webm',
])

function getFileType(file: File): 'audio' | 'video' | null {
  if (file.type.startsWith('audio/')) return 'audio'
  if (file.type.startsWith('video/')) return 'video'
  const ext = file.name.split('.').pop()?.toLowerCase() ?? ''
  if (['mp3', 'wav', 'aac', 'm4a', 'flac', 'ogg'].includes(ext)) return 'audio'
  if (['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(ext)) return 'video'
  return null
}

function validateFile(file: File): string | null {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? ''
  if (!SUPPORTED_MIME_TYPES.has(file.type) && !SUPPORTED_EXTENSIONS.has(ext)) {
    return `Unsupported format: .${ext}. Supported: MP3, WAV, AAC, M4A, FLAC, OGG, MP4, MOV, AVI, MKV, WEBM`
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return `File too large. Maximum size is ${MAX_FILE_SIZE_MB} MB.`
  }
  return null
}

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function UploadPage() {
  const { toast } = useToast()
  const [items, setItems] = useState<UploadItem[]>([])
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const addFiles = useCallback((files: FileList | File[]) => {
    const arr = Array.from(files)
    arr.forEach((file) => {
      const error = validateFile(file)
      const id = Math.random().toString(36).slice(2)
      setItems((prev) => [
        ...prev,
        {
          id,
          file,
          status: error ? 'error' : 'pending',
          progress: 0,
          error: error ?? undefined,
        },
      ])
    })
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    if (e.dataTransfer.files.length > 0) addFiles(e.dataTransfer.files)
  }, [addFiles])

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setDragging(true) }
  const handleDragLeave = () => setDragging(false)

  const removeItem = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id))

  const uploadItem = useCallback(async (id: string) => {
    const item = items.find((i) => i.id === id)
    if (!item || item.status === 'uploading' || item.status === 'processing') return

    setItems((prev) =>
      prev.map((i) => i.id === id ? { ...i, status: 'uploading', progress: 0, error: undefined } : i)
    )

    try {
      const formData = new FormData()
      formData.append('file', item.file)

      // Do NOT set Content-Type manually — the axios interceptor strips it for
      // FormData so the browser can add the correct multipart boundary string.
      const { data } = await apiClient.post('/api/upload', formData, {
        // Give uploads up to 10 minutes — large files need time to transfer
        timeout: 600000,
        onUploadProgress: (evt) => {
          if (evt.total) {
            const pct = Math.round((evt.loaded / evt.total) * 90) // up to 90% for upload phase
            setItems((prev) =>
              prev.map((i) => i.id === id ? { ...i, progress: pct } : i)
            )
          }
        },
      })

      setItems((prev) =>
        prev.map((i) =>
          i.id === id
            ? { ...i, status: 'processing', progress: 95, fileId: data.fileId, jobId: data.jobId }
            : i
        )
      )
      toast.info('Uploading complete', `${item.file.name} is queued for transcription.`)
    } catch (err) {
      const axiosErr = err as { response?: { data?: { detail?: string }; status?: number } }
      const msg =
        axiosErr?.response?.data?.detail ??
        (axiosErr?.response?.status === 413
          ? `File too large. Maximum is ${MAX_FILE_SIZE_MB} MB.`
          : axiosErr?.response?.status === 422
          ? 'Unsupported file format.'
          : 'Upload failed. Check your connection and try again.')
      setItems((prev) =>
        prev.map((i) => i.id === id ? { ...i, status: 'error', error: msg, progress: 0 } : i)
      )
      toast.error('Upload failed', msg)
    }
  }, [items, toast])

  const uploadAll = () => {
    items.filter((i) => i.status === 'pending').forEach((i) => uploadItem(i.id))
  }

  const pendingCount = items.filter((i) => i.status === 'pending').length
  const hasItems = items.length > 0

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-100">Upload Files</h1>
        <p className="text-gray-400 text-sm mt-1">
          Supported: MP3, WAV, AAC, M4A, FLAC, OGG, MP4, MOV, AVI, MKV, WEBM. Max {MAX_FILE_SIZE_MB} MB.
        </p>
      </div>

      {/* Drop zone */}
      <motion.div
        className={[
          'relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-200 cursor-pointer',
          dragging
            ? 'border-brand-400 bg-brand-500/10'
            : 'border-surface-600 hover:border-surface-500 hover:bg-surface-800/50',
        ].join(' ')}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        whileHover={{ scale: 1.005 }}
        transition={{ duration: 0.15 }}
        role="button"
        tabIndex={0}
        aria-label="Upload file drop zone"
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".mp3,.wav,.aac,.m4a,.flac,.ogg,.mp4,.mov,.avi,.mkv,.webm"
          className="sr-only"
          onChange={(e) => e.target.files && addFiles(e.target.files)}
        />
        <AnimatePresence>
          {dragging ? (
            <motion.div key="dragging" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="w-16 h-16 rounded-2xl gradient-brand flex items-center justify-center mx-auto mb-4 shadow-xl shadow-brand-900/40">
                <Upload size={28} className="text-white" />
              </div>
              <p className="text-xl font-semibold text-brand-300">Drop files here</p>
            </motion.div>
          ) : (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="w-16 h-16 rounded-2xl bg-surface-700 border border-surface-600 flex items-center justify-center mx-auto mb-4">
                <Upload size={24} className="text-gray-400" />
              </div>
              <p className="text-gray-200 font-semibold text-lg mb-2">
                Drag & drop files here
              </p>
              <p className="text-gray-500 text-sm mb-4">or</p>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-500/15 border border-brand-500/30 text-brand-300 text-sm font-medium">
                <Plus size={15} /> Browse files
              </span>
              <p className="text-xs text-gray-600 mt-4">Max {MAX_FILE_SIZE_MB} MB per file</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* File list */}
      <AnimatePresence>
        {hasItems && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-gray-200">
                {items.length} file{items.length !== 1 ? 's' : ''} queued
              </h2>
              {pendingCount > 0 && (
                <Button variant="primary" size="sm" icon={<Upload size={14} />} onClick={uploadAll}>
                  Upload {pendingCount > 1 ? `All (${pendingCount})` : ''}
                </Button>
              )}
            </div>
            <div className="space-y-3">
              {items.map((item) => {
                const fileType = getFileType(item.file)
                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="glass rounded-xl p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-surface-700 flex items-center justify-center flex-shrink-0">
                        {fileType === 'video'
                          ? <FileVideo size={18} className="text-blue-400" />
                          : <FileAudio size={18} className="text-brand-400" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-200 truncate">{item.file.name}</p>
                        <p className="text-xs text-gray-500">{formatBytes(item.file.size)}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {item.status === 'pending' && (
                          <Button
                            variant="primary"
                            size="xs"
                            icon={<Upload size={12} />}
                            onClick={() => uploadItem(item.id)}
                          >
                            Upload
                          </Button>
                        )}
                        {item.status === 'error' && (
                          <Button
                            variant="outline"
                            size="xs"
                            icon={<RefreshCw size={12} />}
                            onClick={() => uploadItem(item.id)}
                          >
                            Retry
                          </Button>
                        )}
                        {item.status === 'uploading' && (
                          <Loader2 size={16} className="text-brand-400 animate-spin" />
                        )}
                        {item.status === 'processing' && (
                          <Loader2 size={16} className="text-amber-400 animate-spin" />
                        )}
                        {item.status === 'complete' && (
                          <CheckCircle2 size={16} className="text-emerald-400" />
                        )}
                        {(item.status === 'pending' || item.status === 'error') && (
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-1 rounded text-gray-500 hover:text-gray-300 hover:bg-surface-700 transition-colors"
                            aria-label="Remove file"
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                    {(item.status === 'uploading' || item.status === 'processing') && (
                      <ProgressBar value={item.progress} className="mt-3" size="sm" />
                    )}
                    {item.status === 'error' && item.error && (
                      <div className="flex items-start gap-2 mt-2 p-2 rounded-lg bg-red-500/10">
                        <AlertCircle size={13} className="text-red-400 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-red-300">{item.error}</p>
                      </div>
                    )}
                    {item.status === 'processing' && (
                      <p className="text-xs text-amber-400 mt-2 flex items-center gap-1.5">
                        <Loader2 size={11} className="animate-spin" />
                        Transcription in progress...
                      </p>
                    )}
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
