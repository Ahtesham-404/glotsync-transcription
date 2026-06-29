import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight, Upload, Search, Download, Check, CheckCircle2,
  Mic, Video, FileText, Globe2, Clock, ShieldCheck, ChevronDown,
  Lock, Server, Database, KeyRound, Captions, Languages,
  Users, Scale, GraduationCap, Newspaper, Briefcase, Radio,
  Sparkles, Gauge, Pencil,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { fadeUpProps, fadeUpViewportProps } from '@/lib/motion'
import { useAuth } from '@/contexts/AuthContext'

// ── Content data ───────────────────────────────────────────────────────────

const infra = [
  { icon: Radio, label: 'Amazon Transcribe' },
  { icon: Database, label: 'Amazon S3' },
  { icon: Server, label: 'AWS EC2' },
  { icon: Lock, label: 'AES-256 at rest' },
]

const features = [
  { icon: Mic, title: 'Audio transcription', desc: 'MP3, WAV, AAC, M4A, FLAC and OGG — converted to clean, readable text with timestamps.' },
  { icon: Video, title: 'Video transcription', desc: 'MP4, MOV, AVI, MKV and WEBM. We extract the audio track automatically before processing.' },
  { icon: Search, title: 'Searchable archive', desc: 'Full-text search across every transcript you have ever created, in an instant.' },
  { icon: Captions, title: 'Caption-ready exports', desc: 'Download as TXT for notes, or SRT and VTT for subtitles and accessibility.' },
  { icon: Languages, title: 'Multi-language', desc: 'Transcribe spoken content across dozens of languages with automatic detection.' },
  { icon: Pencil, title: 'In-browser editor', desc: 'Review, correct and refine transcripts segment by segment before you export.' },
]

const steps = [
  { icon: Upload, step: '01', title: 'Upload', desc: 'Drag and drop audio or video up to 500 MB, or browse from your device.' },
  { icon: Server, step: '02', title: 'Process', desc: 'We store your file securely in Amazon S3 and run it through Amazon Transcribe.' },
  { icon: Search, step: '03', title: 'Review', desc: 'Read the transcript with timestamps, search the text and make edits in place.' },
  { icon: Download, step: '04', title: 'Export', desc: 'Download TXT, SRT or VTT — ready for captions, articles, notes or research.' },
]

const useCases = [
  { icon: Newspaper, title: 'Journalists', desc: 'Turn recorded interviews into quotable, searchable copy in minutes.' },
  { icon: Video, title: 'Creators', desc: 'Generate captions and show notes for videos and podcasts.' },
  { icon: Scale, title: 'Legal teams', desc: 'Produce written records of depositions, hearings and calls.' },
  { icon: GraduationCap, title: 'Educators', desc: 'Make lectures accessible with accurate, downloadable transcripts.' },
  { icon: Briefcase, title: 'Businesses', desc: 'Document meetings, customer calls and training sessions.' },
  { icon: Users, title: 'Researchers', desc: 'Transcribe field recordings and interviews for analysis.' },
]

const security = [
  { icon: Lock, title: 'Encrypted storage', desc: 'Every file is encrypted at rest in Amazon S3 with AES-256, and in transit over TLS.' },
  { icon: KeyRound, title: 'Authenticated access', desc: 'Firebase authentication and signed, time-limited URLs gate access to your files.' },
  { icon: ShieldCheck, title: 'Private by default', desc: 'Your media and transcripts are yours. We never sell or share your data.' },
]

const capabilities = [
  { value: '11', label: 'Audio & video formats' },
  { value: '3', label: 'Export formats — TXT · SRT · VTT' },
  { value: '500 MB', label: 'Max file size per upload' },
  { value: 'AWS', label: 'Cloud infrastructure' },
]

const faqs = [
  { q: 'What audio and video formats are supported?', a: 'Audio: MP3, WAV, AAC, M4A, FLAC and OGG. Video: MP4, MOV, AVI, MKV and WEBM. For video, we automatically extract the audio track before transcription.' },
  { q: 'How accurate are the transcripts?', a: 'Transcription is powered by Amazon Transcribe, which produces high-accuracy results on clear speech. Background noise, heavy accents or overlapping voices can reduce accuracy, which is why we include an editor so you can refine the output.' },
  { q: 'Can I edit transcripts before exporting?', a: 'Yes. The built-in editor lets you review the transcript with timestamps, correct any errors, and then download the final version.' },
  { q: 'How is my data protected?', a: 'Files are stored in Amazon S3 with AES-256 encryption at rest and TLS in transit. Access is authenticated, and downloads use signed, expiring URLs. We do not share your data with third parties.' },
  { q: 'Which export formats can I download?', a: 'Plain text (TXT) for notes and articles, SubRip (SRT) and WebVTT (VTT) for video captions and subtitles.' },
  { q: 'Is there a free plan?', a: 'Yes. The Free plan includes a monthly allowance so you can try the full workflow before upgrading. No credit card required to start.' },
]

// ── Small building blocks ────────────────────────────────────────────────────

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/25 text-brand-300 text-xs font-medium font-mono uppercase tracking-wider">
      {children}
    </span>
  )
}

function Waveform({ bars = 40, className = '' }: { bars?: number; className?: string }) {
  return (
    <div className={['flex items-end gap-[3px] h-10', className].join(' ')} aria-hidden="true">
      {Array.from({ length: bars }).map((_, i) => {
        const h = 20 + Math.abs(Math.sin(i * 1.3)) * 70 + (i % 3) * 6
        return (
          <span
            key={i}
            className="eq-bar w-[3px] rounded-full bg-gradient-to-t from-brand-600 to-brand-300"
            style={{ height: `${Math.min(h, 100)}%`, animationDelay: `${(i % 8) * 0.09}s` }}
          />
        )
      })}
    </div>
  )
}

/** A realistic product preview: a completed transcript with timestamps + waveform. */
function TranscriptPreview() {
  const lines = [
    { t: '00:00', s: 'Welcome back to the show. Today we are talking about' },
    { t: '00:04', s: 'how small teams ship production software faster.' },
    { t: '00:09', s: 'The key, honestly, is removing friction from the' },
    { t: '00:13', s: 'boring parts so you can focus on the real work.' },
  ]
  return (
    <div className="panel-raised rounded-2xl p-5 shadow-2xl shadow-black/50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="w-8 h-8 rounded-lg bg-brand-500/15 border border-brand-500/25 flex items-center justify-center flex-shrink-0">
            <Video size={15} className="text-brand-400" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-100 truncate">interview-final.mp4</p>
            <p className="text-[11px] text-gray-500 font-mono">12:48 · English</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent-500/15 border border-accent-500/30 text-accent-300 text-[11px] font-medium">
          <CheckCircle2 size={12} /> Completed
        </span>
      </div>

      <div className="rounded-xl bg-surface-950/60 border border-white/5 px-4 py-3 mb-4">
        <Waveform bars={48} />
      </div>

      <div className="space-y-3">
        {lines.map((l) => (
          <div key={l.t} className="flex gap-3">
            <span className="text-[11px] font-mono text-brand-400/80 pt-0.5 flex-shrink-0">{l.t}</span>
            <p className="text-sm text-gray-300 leading-relaxed">{l.s}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 mt-5 pt-4 border-t border-white/5">
        {['TXT', 'SRT', 'VTT'].map((f) => (
          <span key={f} className="px-2.5 py-1 rounded-md bg-surface-700 border border-surface-600 text-[11px] font-mono text-gray-300">
            {f}
          </span>
        ))}
        <span className="ml-auto text-[11px] text-gray-500 font-mono flex items-center gap-1.5">
          <Search size={11} /> searchable
        </span>
      </div>
    </div>
  )
}

function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string
  title: React.ReactNode
  subtitle?: string
}) {
  return (
    <motion.div className="text-center max-w-2xl mx-auto mb-14" {...fadeUpViewportProps()}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="text-3xl sm:text-4xl font-bold text-white mt-4 mb-4">{title}</h2>
      {subtitle && <p className="text-gray-400 text-lg leading-relaxed">{subtitle}</p>}
    </motion.div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export function HomePage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [openFaq, setOpenFaq] = React.useState<number | null>(0)

  const ctaPath = user ? '/dashboard' : '/register'
  const ctaLabel = user ? 'Go to Dashboard' : 'Start transcribing free'

  return (
    <div className="overflow-hidden">
      {/* ── Hero ── */}
      <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-28">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 grid-bg opacity-[0.4]" />
          <div className="absolute -top-20 left-1/4 w-[40rem] h-[40rem] bg-brand-600/10 rounded-full blur-[120px]" />
          <div className="absolute top-40 right-0 w-[32rem] h-[32rem] bg-accent-600/8 rounded-full blur-[120px]" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-surface-950" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-8 items-center">
          <div>
            <motion.div {...fadeUpProps(0)}>
              <Eyebrow><Sparkles size={12} /> Speech-to-text, done right</Eyebrow>
            </motion.div>
            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.05] mt-6 mb-6 text-balance"
              {...fadeUpProps(0.08)}
            >
              Turn audio & video into{' '}
              <span className="gradient-text">accurate, searchable transcripts</span>
            </motion.h1>
            <motion.p
              className="text-lg text-gray-400 max-w-xl mb-8 leading-relaxed"
              {...fadeUpProps(0.16)}
            >
              GlotSync AI transcribes interviews, meetings, lectures and videos — then lets you
              search, edit and export them as TXT, SRT or VTT. Built on AWS, encrypted by default.
            </motion.p>
            <motion.div className="flex flex-col sm:flex-row gap-3" {...fadeUpProps(0.24)}>
              <Button size="xl" variant="primary" iconRight={<ArrowRight size={18} />} onClick={() => navigate(ctaPath)}>
                {ctaLabel}
              </Button>
              <Button size="xl" variant="secondary" onClick={() => navigate('/pricing')}>
                View pricing
              </Button>
            </motion.div>
            <motion.div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-8" {...fadeUpProps(0.32)}>
              {['No credit card required', 'Free monthly allowance', 'Cancel anytime'].map((t) => (
                <span key={t} className="flex items-center gap-1.5 text-sm text-gray-500">
                  <Check size={14} className="text-accent-400" /> {t}
                </span>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24, rotate: -1 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-brand-500/10 blur-3xl rounded-full" />
            <div className="relative">
              <TranscriptPreview />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Infra / trust bar ── */}
      <section className="border-y border-surface-800 bg-surface-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7">
          <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
            <p className="text-xs font-mono uppercase tracking-wider text-gray-500 flex-shrink-0">
              Built on production AWS infrastructure
            </p>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
              {infra.map(({ icon: Icon, label }) => (
                <span key={label} className="flex items-center gap-2 text-sm text-gray-400">
                  <Icon size={16} className="text-brand-400" /> {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Problem → Solution ── */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <motion.div {...fadeUpViewportProps()}>
            <Eyebrow>The problem</Eyebrow>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-4 mb-5">
              Manual transcription is slow, costly and easy to get wrong
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-6">
              Typing out a one-hour recording can take four hours by hand. Outsourcing is expensive
              and slow. And without timestamps or search, finding that one quote means scrubbing
              through audio all over again.
            </p>
            <ul className="space-y-3">
              {[
                'Hours of repetitive typing per recording',
                'No way to search across past recordings',
                'Captions and subtitles built separately, by hand',
              ].map((t) => (
                <li key={t} className="flex items-start gap-3 text-gray-300">
                  <span className="w-5 h-5 rounded-full bg-surface-700 border border-surface-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div className="panel rounded-3xl p-8 grid-bg" {...fadeUpViewportProps(0.1)}>
            <Eyebrow>The solution</Eyebrow>
            <h3 className="text-2xl font-bold text-white mt-4 mb-5">One workflow, start to finish</h3>
            <div className="space-y-4">
              {[
                { icon: Gauge, t: 'Upload once', d: 'Drop a file and walk away — processing happens in the background.' },
                { icon: FileText, t: 'Get structured text', d: 'Timestamped, segmented transcripts you can actually work with.' },
                { icon: Download, t: 'Export anywhere', d: 'TXT, SRT and VTT generated automatically for every job.' },
              ].map(({ icon: Icon, t, d }) => (
                <div key={t} className="flex gap-4 p-3 rounded-xl hover:bg-surface-800/60 transition-colors">
                  <span className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center flex-shrink-0">
                    <Icon size={18} className="text-surface-900" />
                  </span>
                  <div>
                    <p className="font-semibold text-gray-100">{t}</p>
                    <p className="text-sm text-gray-400">{d}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Capability stats (honest, no fabricated traction) ── */}
      <section className="border-y border-surface-800 bg-surface-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {capabilities.map(({ value, label }, i) => (
              <motion.div key={label} className="text-center" {...fadeUpViewportProps(i * 0.08)}>
                <p className="text-3xl sm:text-4xl font-bold gradient-text-blue mb-2 font-display">{value}</p>
                <p className="text-sm text-gray-400 leading-snug">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Features"
          title="Everything you need to transcribe"
          subtitle="A complete, professional transcription workflow — not a one-trick tool."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              className="panel rounded-2xl p-6 hover:border-brand-500/30 transition-colors group"
              {...fadeUpViewportProps(i * 0.05)}
            >
              <div className="w-11 h-11 rounded-xl bg-brand-500/12 border border-brand-500/20 flex items-center justify-center mb-4 group-hover:bg-brand-500/20 transition-colors">
                <Icon size={20} className="text-brand-400" />
              </div>
              <h3 className="font-semibold text-gray-100 mb-2 text-lg">{title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-24 bg-surface-900/40 border-y border-surface-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="How it works"
            title="From recording to transcript in four steps"
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map(({ icon: Icon, step, title, desc }, i) => (
              <motion.div key={step} className="relative panel rounded-2xl p-6" {...fadeUpViewportProps(i * 0.08)}>
                <span className="text-xs font-mono font-bold text-brand-500 tracking-widest">{step}</span>
                <div className="w-12 h-12 rounded-xl bg-surface-800 border border-surface-600 flex items-center justify-center my-4">
                  <Icon size={22} className="text-brand-400" />
                </div>
                <h3 className="font-semibold text-gray-100 mb-2">{title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Use cases ── */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Who it's for"
          title="Made for people who work with the spoken word"
          subtitle="Whatever you record, GlotSync turns it into something you can read, search and reuse."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {useCases.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              className="flex gap-4 panel rounded-2xl p-6"
              {...fadeUpViewportProps(i * 0.05)}
            >
              <span className="w-11 h-11 rounded-xl bg-accent-500/12 border border-accent-500/20 flex items-center justify-center flex-shrink-0">
                <Icon size={20} className="text-accent-400" />
              </span>
              <div>
                <h3 className="font-semibold text-gray-100 mb-1">{title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Security & infrastructure ── */}
      <section className="py-24 bg-surface-900/40 border-y border-surface-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Security & infrastructure"
            title="Your recordings stay private"
            subtitle="GlotSync runs on AWS with encryption, authentication and least-privilege access throughout."
          />
          <div className="grid md:grid-cols-3 gap-5">
            {security.map(({ icon: Icon, title, desc }, i) => (
              <motion.div key={title} className="panel-raised rounded-2xl p-7" {...fadeUpViewportProps(i * 0.08)}>
                <div className="w-11 h-11 rounded-xl bg-brand-500/12 border border-brand-500/20 flex items-center justify-center mb-4">
                  <Icon size={20} className="text-brand-400" />
                </div>
                <h3 className="font-semibold text-gray-100 mb-2 text-lg">{title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Formats ── */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="panel rounded-3xl p-8 sm:p-12 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <Eyebrow><Globe2 size={12} /> Formats</Eyebrow>
            <h2 className="text-3xl font-bold text-white mt-4 mb-4">Bring any file. Leave with the format you need.</h2>
            <p className="text-gray-400 leading-relaxed mb-6">
              GlotSync accepts the formats real recordings actually come in, and gives you back the
              export your tools expect — whether that's a document, subtitles or captions.
            </p>
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <Clock size={16} className="text-brand-400" />
              Processing runs in the background — no need to keep the tab open.
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="rounded-2xl bg-surface-800/60 border border-surface-600 p-5">
              <p className="text-xs font-mono uppercase tracking-wider text-gray-500 mb-3">Input</p>
              <div className="flex flex-wrap gap-2">
                {['MP3', 'WAV', 'AAC', 'M4A', 'FLAC', 'OGG', 'MP4', 'MOV', 'AVI', 'MKV', 'WEBM'].map((f) => (
                  <span key={f} className="px-2.5 py-1 rounded-md bg-surface-900 border border-surface-600 text-xs font-mono text-gray-300">{f}</span>
                ))}
              </div>
            </div>
            <div className="rounded-2xl bg-surface-800/60 border border-surface-600 p-5">
              <p className="text-xs font-mono uppercase tracking-wider text-gray-500 mb-3">Output</p>
              <div className="flex flex-wrap gap-2">
                {['TXT', 'SRT', 'VTT'].map((f) => (
                  <span key={f} className="px-2.5 py-1 rounded-md bg-brand-500/10 border border-brand-500/30 text-xs font-mono text-brand-300">{f}</span>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-4 leading-relaxed">
                TXT for notes & articles · SRT and VTT for video captions and accessibility.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-24 max-w-3xl mx-auto px-4 sm:px-6">
        <SectionHeading eyebrow="FAQ" title="Questions, answered" />
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div key={i} className="panel rounded-2xl overflow-hidden" {...fadeUpViewportProps(i * 0.04)}>
              <button
                className="w-full flex items-center justify-between px-6 py-4 text-left gap-4"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                aria-expanded={openFaq === i}
              >
                <span className="font-medium text-gray-100">{faq.q}</span>
                <ChevronDown
                  size={18}
                  className={['text-brand-400 flex-shrink-0 transition-transform duration-200', openFaq === i ? 'rotate-180' : ''].join(' ')}
                />
              </button>
              {openFaq === i && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-6 pb-5">
                  <p className="text-sm text-gray-400 leading-relaxed">{faq.a}</p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="pb-28 px-4 sm:px-6">
        <motion.div
          className="relative max-w-4xl mx-auto rounded-3xl overflow-hidden panel-raised p-10 sm:p-16 text-center glow-lg"
          {...fadeUpViewportProps()}
        >
          <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-brand-500/20 blur-3xl rounded-full pointer-events-none" />
          <div className="relative">
            <Waveform bars={28} className="justify-center mb-8 max-w-xs mx-auto" />
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Start turning recordings into transcripts
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
              Create a free account and transcribe your first file in minutes. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="xl" variant="primary" iconRight={<ArrowRight size={18} />} onClick={() => navigate(ctaPath)}>
                {ctaLabel}
              </Button>
              <Button size="xl" variant="secondary" onClick={() => navigate('/features')}>
                Explore features
              </Button>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
