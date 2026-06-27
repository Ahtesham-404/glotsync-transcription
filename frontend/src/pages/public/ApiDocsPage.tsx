import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Code2, Copy, Check, Key } from 'lucide-react'

function CodeBlock({ code, language = 'bash' }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <div className="relative bg-surface-950 rounded-xl border border-surface-700/50 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-surface-700/50">
        <span className="text-xs text-gray-500 font-mono">{language}</span>
        <button onClick={handleCopy} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors">
          {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="px-4 py-4 overflow-x-auto text-sm font-mono text-gray-300 leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  )
}

const endpoints = [
  {
    method: 'POST',
    path: '/api/upload',
    desc: 'Upload an audio or video file for transcription.',
    auth: true,
    request: `curl -X POST https://api.glotsync.online/api/upload \\
  -H "Authorization: Bearer <FIREBASE_ID_TOKEN>" \\
  -F "file=@/path/to/audio.mp3"`,
    response: `{
  "fileId": "file_abc123",
  "jobId": "job_xyz789",
  "message": "File uploaded and queued for transcription"
}`,
  },
  {
    method: 'GET',
    path: '/api/files',
    desc: 'List all files for the authenticated user.',
    auth: true,
    request: `curl https://api.glotsync.online/api/files \\
  -H "Authorization: Bearer <FIREBASE_ID_TOKEN>"`,
    response: `{
  "items": [
    {
      "id": "file_abc123",
      "originalName": "interview.mp3",
      "sizeBytes": 4500000,
      "createdAt": "2025-06-27T10:00:00Z",
      "job": {
        "status": "completed",
        "transcriptId": "tx_001"
      }
    }
  ],
  "total": 1,
  "page": 1,
  "pageSize": 20
}`,
  },
  {
    method: 'GET',
    path: '/api/transcript/{id}',
    desc: 'Retrieve the transcript for a completed job.',
    auth: true,
    request: `curl https://api.glotsync.online/api/transcript/tx_001 \\
  -H "Authorization: Bearer <FIREBASE_ID_TOKEN>"`,
    response: `{
  "id": "tx_001",
  "jobId": "job_xyz789",
  "text": "Hello, welcome to our podcast...",
  "segments": [
    { "id": 1, "start": 0.0, "end": 3.2, "text": "Hello, welcome to our podcast..." }
  ],
  "language": "en",
  "durationSeconds": 540,
  "wordCount": 1203
}`,
  },
  {
    method: 'GET',
    path: '/api/download/{id}',
    desc: 'Get a signed download URL for a transcript (TXT, SRT, VTT) or original file.',
    auth: true,
    request: `curl "https://api.glotsync.online/api/download/file_abc123?format=srt" \\
  -H "Authorization: Bearer <FIREBASE_ID_TOKEN>"`,
    response: `{
  "downloadUrl": "https://s3.amazonaws.com/...",
  "expiresAt": "2025-06-27T10:15:00Z"
}`,
  },
  {
    method: 'DELETE',
    path: '/api/files/{id}',
    desc: 'Delete a file and its associated transcript.',
    auth: true,
    request: `curl -X DELETE https://api.glotsync.online/api/files/file_abc123 \\
  -H "Authorization: Bearer <FIREBASE_ID_TOKEN>"`,
    response: `{
  "message": "File deleted successfully"
}`,
  },
  {
    method: 'GET',
    path: '/health',
    desc: 'Check API health status.',
    auth: false,
    request: `curl https://api.glotsync.online/health`,
    response: `{
  "status": "healthy",
  "version": "1.0.0",
  "timestamp": "2025-06-27T10:00:00Z",
  "database": "connected",
  "storage": "connected"
}`,
  },
]

const methodColors: Record<string, string> = {
  GET: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  POST: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  DELETE: 'text-red-400 bg-red-500/10 border-red-500/20',
}

export function ApiDocsPage() {
  const [active, setActive] = useState(0)
  const ep = endpoints[active]

  return (
    <div className="pt-24 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div className="mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-3">
            <Code2 size={24} className="text-brand-400" />
            <h1 className="text-4xl font-extrabold text-white">API Reference</h1>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl">
            REST API for programmatic access to GlotSync AI transcription.
            Authenticate using your Firebase ID token.
          </p>
        </motion.div>

        {/* Auth info */}
        <div className="glass rounded-2xl p-5 mb-8 flex items-start gap-3">
          <Key size={18} className="text-brand-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-gray-200 mb-1">Authentication</p>
            <p className="text-sm text-gray-400">
              All endpoints (except <code className="bg-surface-700 px-1 rounded text-xs">/health</code>) require a Bearer token in the Authorization header.
              Obtain your token using <code className="bg-surface-700 px-1 rounded text-xs">firebase.auth().currentUser.getIdToken()</code>.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Endpoint list */}
          <div className="space-y-2">
            {endpoints.map((e, i) => (
              <button
                key={e.path}
                onClick={() => setActive(i)}
                className={['w-full text-left rounded-xl p-3.5 border transition-all duration-150', active === i ? 'border-brand-500/40 bg-brand-500/8' : 'border-surface-600/50 bg-surface-800 hover:border-surface-500'].join(' ')}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className={['text-xs font-mono font-bold px-1.5 py-0.5 rounded border', methodColors[e.method]].join(' ')}>{e.method}</span>
                </div>
                <code className="text-xs text-gray-300 font-mono">{e.path}</code>
              </button>
            ))}
          </div>

          {/* Endpoint detail */}
          <div className="lg:col-span-2 space-y-5">
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <span className={['text-sm font-mono font-bold px-2 py-0.5 rounded border', methodColors[ep.method]].join(' ')}>{ep.method}</span>
                <code className="text-gray-200 font-mono text-sm">{ep.path}</code>
                {ep.auth && (
                  <span className="ml-auto text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">Auth required</span>
                )}
              </div>
              <p className="text-sm text-gray-400">{ep.desc}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Request</p>
              <CodeBlock code={ep.request} language="bash" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Response</p>
              <CodeBlock code={ep.response} language="json" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
