import React from 'react'
import { motion } from 'framer-motion'
import {
  Target, Users, ShieldCheck, Gauge, Radio, Database, Server, Lock, Sparkles,
} from 'lucide-react'
import { fadeUpProps, fadeUpViewportProps } from '@/lib/motion'

const values = [
  { icon: Target, title: 'Accuracy you can trust', desc: 'We pair high-quality speech recognition with an editor so you can correct anything before exporting.' },
  { icon: Users, title: 'Built for real work', desc: 'From solo podcasters to legal and research teams, the workflow scales with how you actually work.' },
  { icon: ShieldCheck, title: 'Privacy by default', desc: 'Your files and transcripts are yours. We never sell your data or use it to train models.' },
  { icon: Gauge, title: 'No busywork', desc: 'Upload once and processing runs in the background — no babysitting a progress bar.' },
]

const stack = [
  { icon: Radio, label: 'Amazon Transcribe', desc: 'Managed speech-to-text' },
  { icon: Database, label: 'Amazon S3', desc: 'Encrypted file storage' },
  { icon: Server, label: 'AWS EC2', desc: 'API & processing' },
  { icon: Lock, label: 'AES-256 + TLS', desc: 'Encrypted at rest & in transit' },
]

export function AboutPage() {
  return (
    <div className="pt-28 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div className="text-center mb-14" {...fadeUpProps()}>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/25 text-brand-300 text-xs font-medium font-mono uppercase tracking-wider mb-4">
            <Sparkles size={12} /> About
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">About GlotSync AI</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            We started GlotSync AI because turning recordings into usable text was either too
            expensive, too slow, or too clunky. We wanted a single, focused tool that does it well.
          </p>
        </motion.div>

        {/* Mission */}
        <motion.div className="panel rounded-3xl p-8 mb-8" {...fadeUpProps(0.1)}>
          <h2 className="text-2xl font-bold text-white mb-4">Our mission</h2>
          <p className="text-gray-300 leading-relaxed text-lg">
            Make the spoken word as accessible and searchable as the written word. Every interview,
            lecture, meeting and podcast holds valuable information — GlotSync makes it retrievable.
          </p>
          <p className="text-gray-400 leading-relaxed mt-4">
            We help creators, businesses, educators, journalists, legal professionals and researchers
            upload audio or video and get accurate, searchable, editable transcripts — viewable and
            downloadable as TXT, SRT or VTT.
          </p>
        </motion.div>

        {/* How it's built (reinforces the AWS-native story) */}
        <motion.div className="panel rounded-3xl p-8 mb-8 grid-bg" {...fadeUpProps(0.15)}>
          <h2 className="text-2xl font-bold text-white mb-2">How it's built</h2>
          <p className="text-gray-400 leading-relaxed mb-6 max-w-2xl">
            GlotSync runs on production AWS infrastructure. Uploads are stored securely, audio is
            extracted and normalized, and transcription is handled by Amazon Transcribe — with the
            results delivered back to you in seconds to review and export.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stack.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="rounded-2xl bg-surface-800/60 border border-surface-600 p-4">
                <Icon size={18} className="text-brand-400 mb-2" />
                <p className="text-sm font-semibold text-gray-100 leading-tight">{label}</p>
                <p className="text-xs text-gray-500 mt-1">{desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Values */}
        <div className="grid sm:grid-cols-2 gap-5 mb-12">
          {values.map(({ icon: Icon, title, desc }, i) => (
            <motion.div key={title} className="panel rounded-2xl p-6" {...fadeUpViewportProps(i * 0.08)}>
              <div className="w-10 h-10 rounded-xl bg-brand-500/12 border border-brand-500/20 flex items-center justify-center mb-4">
                <Icon size={20} className="text-brand-400" />
              </div>
              <h3 className="font-semibold text-gray-100 mb-2">{title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Contact */}
        <motion.div className="text-center panel-raised rounded-3xl p-10" {...fadeUpViewportProps()}>
          <h2 className="text-2xl font-bold text-white mb-3">Get in touch</h2>
          <p className="text-gray-400 mb-3">Questions, partnerships or feedback? We'd love to hear from you.</p>
          <a
            href="mailto:hello@glotsync.online"
            className="text-brand-400 hover:text-brand-300 font-medium transition-colors"
          >
            hello@glotsync.online
          </a>
        </motion.div>
      </div>
    </div>
  )
}
