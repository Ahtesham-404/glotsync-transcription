import React from 'react'
import { motion } from 'framer-motion'
import { Book, ChevronRight, Upload, FileText, Download, Key, Settings, HelpCircle } from 'lucide-react'

const categories = [
  {
    icon: Upload,
    title: 'Getting Started',
    items: [
      { title: 'Create your account', anchor: '#create-account' },
      { title: 'Uploading your first file', anchor: '#first-upload' },
      { title: 'Supported formats', anchor: '#formats' },
      { title: 'Understanding job states', anchor: '#job-states' },
    ],
  },
  {
    icon: FileText,
    title: 'Transcripts',
    items: [
      { title: 'Viewing your transcript', anchor: '#view-transcript' },
      { title: 'Searching transcripts', anchor: '#search' },
      { title: 'Editing transcripts', anchor: '#editing' },
      { title: 'Timestamps', anchor: '#timestamps' },
    ],
  },
  {
    icon: Download,
    title: 'Exports',
    items: [
      { title: 'Download as TXT', anchor: '#txt' },
      { title: 'Download as SRT', anchor: '#srt' },
      { title: 'Download as VTT', anchor: '#vtt' },
      { title: 'Print transcript', anchor: '#print' },
    ],
  },
  {
    icon: Key,
    title: 'API Reference',
    items: [
      { title: 'Authentication', anchor: '#api-auth' },
      { title: 'Upload endpoint', anchor: '#api-upload' },
      { title: 'Get files', anchor: '#api-files' },
      { title: 'Get transcript', anchor: '#api-transcript' },
    ],
  },
  {
    icon: Settings,
    title: 'Account & Settings',
    items: [
      { title: 'Profile settings', anchor: '#profile' },
      { title: 'Change password', anchor: '#password' },
      { title: 'Notifications', anchor: '#notifications' },
      { title: 'Delete account', anchor: '#delete' },
    ],
  },
  {
    icon: HelpCircle,
    title: 'Troubleshooting',
    items: [
      { title: 'Upload errors', anchor: '#upload-errors' },
      { title: 'Low accuracy tips', anchor: '#accuracy-tips' },
      { title: 'Billing questions', anchor: '#billing' },
      { title: 'Contact support', anchor: '#support' },
    ],
  },
]

export function DocsPage() {
  return (
    <div className="pt-24 pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div className="mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-500/15 border border-brand-500/20 flex items-center justify-center">
              <Book size={20} className="text-brand-400" />
            </div>
            <h1 className="text-4xl font-extrabold text-white">Documentation</h1>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl">
            Everything you need to get the most out of GlotSync AI.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map(({ icon: Icon, title, items }, i) => (
            <motion.div key={title} className="glass rounded-2xl p-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
              <div className="flex items-center gap-2.5 mb-4">
                <Icon size={18} className="text-brand-400" />
                <h2 className="font-semibold text-gray-100">{title}</h2>
              </div>
              <ul className="space-y-2">
                {items.map(({ title: itemTitle, anchor }) => (
                  <li key={anchor}>
                    <a href={anchor} className="flex items-center gap-2 text-sm text-gray-400 hover:text-brand-300 transition-colors py-0.5">
                      <ChevronRight size={13} className="text-gray-600" />
                      {itemTitle}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div className="mt-12 glass rounded-2xl p-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <h2 className="text-xl font-bold text-white mb-6" id="create-account">Getting Started</h2>
          <div className="prose prose-invert prose-sm max-w-none">
            <h3 id="first-upload" className="text-gray-100 font-semibold text-lg mb-3">Uploading your first file</h3>
            <ol className="space-y-2 text-gray-400 text-sm mb-6">
              <li>1. Sign in to your account and navigate to <strong className="text-gray-300">Dashboard → Upload</strong>.</li>
              <li>2. Drag and drop your audio or video file, or click <em>Browse Files</em>.</li>
              <li>3. GlotSync AI will validate your file (format and size) and begin uploading.</li>
              <li>4. You'll see the job progress from <code className="bg-surface-700 px-1 rounded text-xs">Queued</code> → <code className="bg-surface-700 px-1 rounded text-xs">Uploading</code> → <code className="bg-surface-700 px-1 rounded text-xs">Processing</code> → <code className="bg-surface-700 px-1 rounded text-xs">Completed</code>.</li>
              <li>5. Once complete, click <strong className="text-gray-300">View Transcript</strong> to read, search, and download your transcript.</li>
            </ol>
            <h3 id="formats" className="text-gray-100 font-semibold text-lg mb-3">Supported formats</h3>
            <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-400">
              <div className="bg-surface-800 rounded-xl p-4 border border-surface-600/50">
                <p className="font-semibold text-gray-300 mb-2">Audio</p>
                <p>MP3, WAV, AAC, M4A, FLAC, OGG</p>
              </div>
              <div className="bg-surface-800 rounded-xl p-4 border border-surface-600/50">
                <p className="font-semibold text-gray-300 mb-2">Video</p>
                <p>MP4, MOV, AVI, MKV, WEBM</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
