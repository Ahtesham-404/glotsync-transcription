import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Zap, ArrowRight, Upload, Search, Download, CheckCircle2,
  Mic, Video, FileText, Globe, Clock, Shield, ChevronDown,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { fadeUpProps, fadeUpViewportProps } from '@/lib/motion'
import { useAuth } from '@/contexts/AuthContext'

const features = [
  { icon: Mic, title: 'Audio Transcription', desc: 'MP3, WAV, AAC, M4A, FLAC, OGG — all processed with high accuracy.' },
  { icon: Video, title: 'Video Transcription', desc: 'MP4, MOV, AVI, MKV, WEBM — extract speech from any video format.' },
  { icon: Search, title: 'Searchable Transcripts', desc: 'Full-text search across all your transcripts instantly.' },
  { icon: Download, title: 'Multiple Export Formats', desc: 'Download as TXT, SRT, or VTT for captions and subtitles.' },
  { icon: Globe, title: 'Multi-language Support', desc: 'Transcribe content in dozens of languages automatically.' },
  { icon: Clock, title: 'Fast Processing', desc: 'Typical transcription in under 2× real-time. Get results quickly.' },
  { icon: Shield, title: 'Secure & Private', desc: 'Files are stored securely in Amazon S3 with encryption at rest.' },
  { icon: FileText, title: 'Transcript Editor', desc: 'Review, edit, and annotate transcripts directly in the browser.' },
]

const steps = [
  { icon: Upload, step: '01', title: 'Upload your file', desc: 'Drag & drop or browse to upload audio or video files up to 500 MB.' },
  { icon: Zap, step: '02', title: 'AI transcribes it', desc: 'Our AI engine processes your file and generates a precise transcript.' },
  { icon: Search, step: '03', title: 'Review & search', desc: 'View your transcript with timestamps, search across content.' },
  { icon: Download, step: '04', title: 'Download & share', desc: 'Export as TXT, SRT, or VTT and use wherever you need it.' },
]

const stats = [
  { value: '99.2%', label: 'Average accuracy' },
  { value: '50+', label: 'Languages supported' },
  { value: '<2min', label: 'Typical turnaround' },
  { value: '10,000+', label: 'Files processed' },
]

const faqs = [
  {
    q: 'What audio and video formats are supported?',
    a: 'GlotSync AI supports MP3, WAV, AAC, M4A, FLAC, OGG for audio and MP4, MOV, AVI, MKV, WEBM for video.',
  },
  {
    q: 'How accurate are the transcriptions?',
    a: 'Our AI achieves over 99% accuracy on clear audio. Background noise, heavy accents, or overlapping speech may reduce accuracy slightly.',
  },
  {
    q: 'Can I edit my transcripts?',
    a: 'Yes. The built-in transcript editor lets you review, correct, and download your final transcript.',
  },
  {
    q: 'Is my data kept private?',
    a: 'Yes. Files are stored in Amazon S3 with encryption at rest and in transit. We never share your data with third parties.',
  },
  {
    q: 'What export formats are available?',
    a: 'You can download transcripts as plain text (TXT), SubRip subtitles (SRT), or WebVTT captions (VTT).',
  },
  {
    q: 'Do you offer a free plan?',
    a: 'Yes. The free plan gives you 30 minutes of transcription per month to get started at no cost.',
  },
]

export function HomePage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [openFaq, setOpenFaq] = React.useState<number | null>(null)

  // Logged-in users go to the dashboard; guests go to register
  const ctaPath = user ? '/dashboard' : '/register'
  const ctaLabel = user ? 'Go to Dashboard' : 'Get Started Free'

  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/8 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(97,114,243,0.04),transparent_70%)]" />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center py-24">
          <motion.div {...fadeUpProps(0)}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-medium mb-6">
              <Zap size={12} fill="currentColor" /> AI-Powered Transcription Platform
            </span>
          </motion.div>
          <motion.h1
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-tight tracking-tight mb-6 text-balance"
            {...fadeUpProps(0.1)}
          >
            Transform Audio & Video Into{' '}
            <span className="gradient-text">Accurate Transcripts</span>
          </motion.h1>
          <motion.p
            className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed text-balance"
            {...fadeUpProps(0.2)}
          >
            Upload any audio or video file. Get a searchable, editable transcript in minutes.
            Download as TXT, SRT, or VTT — ready for captions, notes, or research.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            {...fadeUpProps(0.3)}
          >
            <Button size="xl" variant="primary" iconRight={<ArrowRight size={18} />} onClick={() => navigate(ctaPath)}>
              {ctaLabel}
            </Button>
            <Button size="xl" variant="outline" onClick={() => navigate('/pricing')}>
              View Pricing
            </Button>
          </motion.div>
          <motion.div
            className="flex items-center justify-center gap-6 mt-10 flex-wrap"
            {...fadeUpProps(0.4)}
          >
            {['No credit card required', 'Free 30 min/month', 'Cancel anytime'].map((t) => (
              <span key={t} className="flex items-center gap-1.5 text-sm text-gray-500">
                <CheckCircle2 size={14} className="text-emerald-500" /> {t}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-16 border-y border-surface-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map(({ value, label }, i) => (
              <motion.div key={label} className="text-center" {...fadeUpViewportProps(i * 0.1)}>
                <p className="text-3xl font-extrabold gradient-text-blue mb-1">{value}</p>
                <p className="text-sm text-gray-400">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div className="text-center mb-16" {...fadeUpViewportProps()}>
          <h2 className="text-4xl font-bold text-white mb-4">Everything you need to transcribe</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">A complete transcription workflow built for professionals.</p>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map(({ icon: Icon, title, desc }, i) => (
            <motion.div key={title} {...fadeUpViewportProps(i * 0.06)}>
              <Card hover className="h-full">
                <div className="w-10 h-10 rounded-xl bg-brand-500/15 border border-brand-500/20 flex items-center justify-center mb-4">
                  <Icon size={20} className="text-brand-400" />
                </div>
                <h3 className="font-semibold text-gray-100 mb-2">{title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-24 bg-surface-900/50 border-y border-surface-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16" {...fadeUpViewportProps()}>
            <h2 className="text-4xl font-bold text-white mb-4">How it works</h2>
            <p className="text-gray-400 text-lg">From upload to transcript in four simple steps.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map(({ icon: Icon, step, title, desc }, i) => (
              <motion.div key={step} className="relative text-center" {...fadeUpViewportProps(i * 0.1)}>
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[calc(50%+2rem)] right-[-50%] h-px bg-gradient-to-r from-brand-500/30 to-transparent" />
                )}
                <div className="w-16 h-16 rounded-2xl gradient-brand flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-900/30">
                  <Icon size={26} className="text-white" />
                </div>
                <span className="text-xs font-bold text-brand-500 tracking-widest mb-2 block">{step}</span>
                <h3 className="font-semibold text-gray-100 mb-2">{title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-24 max-w-3xl mx-auto px-4 sm:px-6">
        <motion.div className="text-center mb-12" {...fadeUpViewportProps()}>
          <h2 className="text-4xl font-bold text-white mb-4">Frequently asked questions</h2>
        </motion.div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div key={i} className="glass rounded-2xl overflow-hidden" {...fadeUpViewportProps(i * 0.05)}>
              <button
                className="w-full flex items-center justify-between px-6 py-4 text-left"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                aria-expanded={openFaq === i}
              >
                <span className="font-medium text-gray-200">{faq.q}</span>
                <ChevronDown size={16} className={['text-gray-400 flex-shrink-0 ml-4 transition-transform duration-200', openFaq === i ? 'rotate-180' : ''].join(' ')} />
              </button>
              {openFaq === i && (
                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} className="px-6 pb-4">
                  <p className="text-sm text-gray-400 leading-relaxed">{faq.a}</p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div className="glass rounded-3xl p-12 glow-lg" {...fadeUpViewportProps()}>
            <div className="w-16 h-16 rounded-2xl gradient-brand flex items-center justify-center mx-auto mb-6 shadow-xl shadow-brand-900/40">
              <Zap size={28} className="text-white" fill="white" />
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">Start transcribing today</h2>
            <p className="text-gray-400 text-lg mb-8">Join thousands of creators, journalists, and researchers. Free to start — no credit card required.</p>
            <Button size="xl" variant="primary" iconRight={<ArrowRight size={18} />} onClick={() => navigate(ctaPath)}>
              {ctaLabel}
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
