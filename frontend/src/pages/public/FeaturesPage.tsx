import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Mic, Video, Search, Download, Globe, Clock, Shield, FileText,
  Zap, CheckCircle2, ArrowRight, BarChart3, Code2, Layers,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { fadeUpProps, fadeUpViewportProps } from '@/lib/motion'

const features = [
  {
    icon: Mic, title: 'Audio Formats',
    bullets: ['MP3, WAV, AAC, M4A', 'FLAC, OGG support', 'Up to 500 MB per file', 'High-fidelity processing'],
  },
  {
    icon: Video, title: 'Video Formats',
    bullets: ['MP4, MOV, AVI, MKV', 'WEBM support', 'Audio extracted automatically', 'No pre-processing needed'],
  },
  {
    icon: Search, title: 'Transcript Search',
    bullets: ['Full-text search', 'Highlight matching terms', 'Jump to timestamp', 'Search across all files'],
  },
  {
    icon: Download, title: 'Export Formats',
    bullets: ['Plain text (TXT)', 'SubRip subtitles (SRT)', 'WebVTT captions (VTT)', 'Print-friendly view'],
  },
  {
    icon: Globe, title: 'Multi-language',
    bullets: ['50+ languages detected', 'Automatic language detection', 'High accuracy across languages', 'English optimized'],
  },
  {
    icon: FileText, title: 'Transcript Editor',
    bullets: ['In-browser editing', 'Word count & duration', 'Timestamp view toggle', 'Copy to clipboard'],
  },
  {
    icon: Shield, title: 'Security',
    bullets: ['Encryption at rest', 'Signed S3 URLs', 'Firebase Authentication', 'HTTPS everywhere'],
  },
  {
    icon: BarChart3, title: 'Dashboard Analytics',
    bullets: ['Usage statistics', 'Storage tracking', 'Activity history', 'Job status tracking'],
  },
  {
    icon: Code2, title: 'API Access',
    bullets: ['REST API', 'Firebase token auth', 'Webhook support (Pro)', 'Full documentation'],
  },
]

export function FeaturesPage() {
  const navigate = useNavigate()
  return (
    <div className="pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div className="text-center mb-16" {...fadeUpProps()}>
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-medium mb-4">
            <Layers size={12} /> Features
          </span>
          <h1 className="text-5xl font-extrabold text-white mb-4">Built for precision and speed</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Every feature designed to make transcription effortless and professional.
          </p>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map(({ icon: Icon, title, bullets }, i) => (
            <motion.div key={title} {...fadeUpViewportProps(i * 0.07)}>
              <Card className="h-full">
                <div className="w-10 h-10 rounded-xl bg-brand-500/15 border border-brand-500/20 flex items-center justify-center mb-4">
                  <Icon size={20} className="text-brand-400" />
                </div>
                <h3 className="font-semibold text-gray-100 mb-3">{title}</h3>
                <ul className="space-y-2">
                  {bullets.map((b) => (
                    <li key={b} className="flex items-center gap-2 text-sm text-gray-400">
                      <CheckCircle2 size={13} className="text-emerald-500 flex-shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          ))}
        </div>
        <motion.div className="text-center" {...fadeUpViewportProps()}>
          <Button size="xl" variant="primary" iconRight={<ArrowRight size={18} />} onClick={() => navigate('/register')}>
            Get Started Free
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
