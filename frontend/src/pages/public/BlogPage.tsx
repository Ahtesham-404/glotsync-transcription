import React from 'react'
import { motion } from 'framer-motion'
import { Tag, Mail, Sparkles } from 'lucide-react'
import { fadeUpProps, fadeUpViewportProps } from '@/lib/motion'

/**
 * Topics we're writing about. These are upcoming guides — we intentionally do
 * not show fabricated publish dates or link to articles that don't exist yet.
 */
const topics = [
  {
    title: 'How AI transcription works: from audio waves to text',
    excerpt: 'A plain-English walkthrough of the speech-to-text pipeline behind GlotSync — capture, audio extraction, and recognition.',
    category: 'Technology',
    gradient: 'from-brand-600/20 to-accent-600/20',
  },
  {
    title: "The journalist's guide to faster interviews",
    excerpt: 'Practical workflows for turning hours of recorded interviews into searchable, quotable text.',
    category: 'Use cases',
    gradient: 'from-accent-600/20 to-brand-600/20',
  },
  {
    title: 'SRT vs VTT: which caption format should you use?',
    excerpt: 'A practical comparison of SubRip and WebVTT, and when to use each for YouTube, Vimeo and web video.',
    category: 'Guides',
    gradient: 'from-amber-600/20 to-orange-600/20',
  },
  {
    title: 'How transcripts improve podcast discoverability',
    excerpt: 'Why publishing transcript pages for every episode helps your audience — and search engines — find you.',
    category: 'SEO',
    gradient: 'from-brand-500/20 to-accent-500/20',
  },
  {
    title: 'AI transcription for legal teams: what to know',
    excerpt: 'Accuracy, confidentiality and workflow considerations when working with recorded proceedings.',
    category: 'Legal',
    gradient: 'from-rose-600/20 to-brand-600/20',
  },
  {
    title: '7 ways to get more accurate transcripts',
    excerpt: 'Microphone choice, noise reduction and file quality all matter. Simple steps to improve your results.',
    category: 'Guides',
    gradient: 'from-accent-600/20 to-brand-500/20',
  },
]

export function BlogPage() {
  return (
    <div className="pt-28 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div className="text-center mb-14" {...fadeUpProps()}>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/25 text-brand-300 text-xs font-medium font-mono uppercase tracking-wider mb-4">
            <Sparkles size={12} /> Resources
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Guides & resources</h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            In-depth guides on transcription, captions and getting the most out of your recordings.
            We're writing these now — here's what's on the way.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((post, i) => (
            <motion.div
              key={post.title}
              className="panel rounded-2xl overflow-hidden hover:border-brand-500/30 transition-colors"
              {...fadeUpViewportProps(i * 0.06)}
            >
              <div className={['h-24 bg-gradient-to-br', post.gradient].join(' ')} />
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center gap-1.5 text-xs text-brand-300 font-medium">
                    <Tag size={11} /> {post.category}
                  </span>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-gray-500 px-2 py-0.5 rounded-full border border-surface-600">
                    Coming soon
                  </span>
                </div>
                <h3 className="font-bold text-gray-100 mb-2 leading-tight">{post.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{post.excerpt}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="panel-raised rounded-3xl p-8 mt-12 text-center"
          {...fadeUpViewportProps()}
        >
          <h2 className="text-2xl font-bold text-white mb-2">Want a guide on something specific?</h2>
          <p className="text-gray-400 mb-5 max-w-lg mx-auto">
            Tell us what you'd find useful, or ask to be notified when we publish.
          </p>
          <a
            href="mailto:hello@glotsync.online"
            className="inline-flex items-center gap-2 text-brand-400 hover:text-brand-300 font-medium transition-colors"
          >
            <Mail size={16} /> hello@glotsync.online
          </a>
        </motion.div>
      </div>
    </div>
  )
}
