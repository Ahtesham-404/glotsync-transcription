import React, { useState, useMemo, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Search, Copy, Download, Printer, ChevronLeft,
  Clock, FileText, Hash, CheckCheck, AlignLeft, List,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { useToast } from '@/components/ui/Toast'
import { useTranscript, getDownloadUrl } from '@/hooks/useTranscript'
import type { TranscriptSegment } from '@/types'

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${m}:${String(s).padStart(2, '0')}`
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}m ${s}s`
}

function highlight(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'))
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase()
      ? <mark key={i} className="bg-brand-500/30 text-brand-200 rounded">{part}</mark>
      : part
  )
}

export function TranscriptPage() {
  const { id } = useParams<{ id: string }>()
  const { data: transcript, isLoading, isError } = useTranscript(id)
  const { toast } = useToast()
  const [query, setQuery] = useState('')
  const [viewMode, setViewMode] = useState<'text' | 'segments'>('text')
  const [downloading, setDownloading] = useState(false)
  const textRef = useRef<HTMLDivElement>(null)

  const matchCount = useMemo(() => {
    if (!query.trim() || !transcript) return 0
    const re = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
    return (transcript.text.match(re) || []).length
  }, [query, transcript])

  const handleCopy = async () => {
    if (!transcript) return
    await navigator.clipboard.writeText(transcript.text)
    toast.success('Copied', 'Transcript copied to clipboard.')
  }

  const handleDownload = async (format: 'txt' | 'srt' | 'vtt') => {
    if (!transcript) return
    setDownloading(true)
    try {
      const { downloadUrl } = await getDownloadUrl(transcript.fileId, format)
      const a = document.createElement('a')
      a.href = downloadUrl
      a.download = `transcript.${format}`
      a.click()
    } catch {
      toast.error('Download failed')
    } finally {
      setDownloading(false)
    }
  }

  const handlePrint = () => window.print()

  if (isLoading) return (
    <div className="flex justify-center py-24">
      <Spinner size="xl" />
    </div>
  )

  if (isError || !transcript) return (
    <div className="text-center py-24">
      <p className="text-gray-400 mb-4">Transcript not found or still processing.</p>
      <Link to="/dashboard/files"><Button variant="secondary">Back to Files</Button></Link>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3 flex-wrap">
        <Link to="/dashboard/files">
          <Button variant="ghost" size="sm" icon={<ChevronLeft size={14} />}>Files</Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-100 flex-1">Transcript Viewer</h1>
      </div>

      {/* Meta bar */}
      <div className="glass rounded-xl px-5 py-3 flex items-center gap-5 flex-wrap">
        <span className="flex items-center gap-1.5 text-sm text-gray-400">
          <Clock size={13} className="text-brand-400" />
          {formatDuration(transcript.durationSeconds)}
        </span>
        <span className="flex items-center gap-1.5 text-sm text-gray-400">
          <Hash size={13} className="text-brand-400" />
          {transcript.wordCount.toLocaleString()} words
        </span>
        <span className="flex items-center gap-1.5 text-sm text-gray-400">
          <FileText size={13} className="text-brand-400" />
          {transcript.language.toUpperCase()}
        </span>
        <span className="flex items-center gap-1.5 text-sm text-gray-400">
          <List size={13} className="text-brand-400" />
          {transcript.segments.length} segments
        </span>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          <input
            type="search"
            placeholder="Search transcript..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-surface-800 border border-surface-600/50 rounded-xl text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500"
          />
        </div>
        {query && (
          <span className="text-xs text-gray-400 flex-shrink-0">
            {matchCount} match{matchCount !== 1 ? 'es' : ''}
          </span>
        )}
        <div className="flex items-center gap-1 bg-surface-800 border border-surface-600/50 rounded-xl p-1">
          <button
            className={['px-3 py-1.5 rounded-lg text-xs font-medium transition-all', viewMode === 'text' ? 'bg-brand-500 text-white' : 'text-gray-400 hover:text-gray-200'].join(' ')}
            onClick={() => setViewMode('text')}
          >
            <AlignLeft size={12} className="inline mr-1" /> Text
          </button>
          <button
            className={['px-3 py-1.5 rounded-lg text-xs font-medium transition-all', viewMode === 'segments' ? 'bg-brand-500 text-white' : 'text-gray-400 hover:text-gray-200'].join(' ')}
            onClick={() => setViewMode('segments')}
          >
            <List size={12} className="inline mr-1" /> Timestamps
          </button>
        </div>
        <Button variant="ghost" size="sm" icon={<Copy size={14} />} onClick={handleCopy}>Copy</Button>
        <div className="relative group">
          <Button variant="secondary" size="sm" icon={<Download size={14} />} loading={downloading}>
            Download
          </Button>
          <div className="absolute right-0 top-full mt-1 w-36 glass rounded-xl border border-surface-600/50 shadow-xl overflow-hidden opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity z-10">
            {(['txt', 'srt', 'vtt'] as const).map((fmt) => (
              <button
                key={fmt}
                className="block w-full px-4 py-2.5 text-sm text-gray-400 hover:text-gray-200 hover:bg-surface-700/50 text-left transition-colors"
                onClick={() => handleDownload(fmt)}
              >
                Download .{fmt.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        <Button variant="ghost" size="sm" icon={<Printer size={14} />} onClick={handlePrint}>Print</Button>
      </div>

      {/* Transcript content */}
      <div ref={textRef} className="glass rounded-2xl p-6 print:bg-white print:text-black">
        {viewMode === 'text' ? (
          <p className="text-gray-200 leading-relaxed text-sm whitespace-pre-wrap">
            {highlight(transcript.text, query)}
          </p>
        ) : (
          <div className="space-y-4">
            {transcript.segments.map((seg: TranscriptSegment) => (
              <motion.div
                key={seg.id}
                className="flex gap-4 group"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: seg.id * 0.01 }}
              >
                <span className="text-xs font-mono text-brand-400 pt-0.5 flex-shrink-0 w-14 text-right">
                  {formatTime(seg.start)}
                </span>
                <p className="text-sm text-gray-200 leading-relaxed flex-1">
                  {highlight(seg.text, query)}
                </p>
                <span className="text-xs font-mono text-gray-600 pt-0.5 flex-shrink-0">
                  {formatTime(seg.end)}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
