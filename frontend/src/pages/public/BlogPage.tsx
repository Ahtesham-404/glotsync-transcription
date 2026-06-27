import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Clock, Tag } from 'lucide-react'
import { fadeUpProps, fadeUpViewportProps } from '@/lib/motion'

const posts = [
  {
    slug: 'how-ai-transcription-works',
    title: 'How AI Transcription Works: From Audio Waves to Text',
    excerpt: 'A technical overview of the speech recognition pipeline that powers GlotSync AI, from Fourier transforms to transformer models.',
    category: 'Technology',
    readTime: '8 min',
    date: 'June 20, 2025',
    gradient: 'from-brand-600/20 to-purple-600/20',
  },
  {
    slug: 'journalists-transcription-guide',
    title: 'The Journalist\'s Guide to AI Transcription',
    excerpt: 'How investigative journalists are using GlotSync AI to transcribe hours of interviews in minutes and make them searchable.',
    category: 'Use Cases',
    readTime: '5 min',
    date: 'June 14, 2025',
    gradient: 'from-emerald-600/20 to-teal-600/20',
  },
  {
    slug: 'srt-vs-vtt-captions',
    title: 'SRT vs VTT: Which Caption Format Should You Use?',
    excerpt: 'A practical comparison of SubRip and WebVTT caption formats and when to use each one for YouTube, Vimeo, and web video.',
    category: 'Guides',
    readTime: '4 min',
    date: 'June 5, 2025',
    gradient: 'from-amber-600/20 to-orange-600/20',
  },
  {
    slug: 'podcast-seo-with-transcripts',
    title: 'How Transcripts Supercharge Your Podcast SEO',
    excerpt: 'Publishing transcript pages for every episode can dramatically increase your podcast\'s discoverability in search engines.',
    category: 'SEO',
    readTime: '6 min',
    date: 'May 28, 2025',
    gradient: 'from-sky-600/20 to-blue-600/20',
  },
  {
    slug: 'legal-transcription-compliance',
    title: 'AI Transcription for Legal Teams: What to Know',
    excerpt: 'Considerations for legal professionals using AI transcription, including accuracy, confidentiality, and workflow integration.',
    category: 'Legal',
    readTime: '7 min',
    date: 'May 20, 2025',
    gradient: 'from-red-600/20 to-pink-600/20',
  },
  {
    slug: 'accuracy-tips',
    title: '7 Tips to Get the Most Accurate Transcription',
    excerpt: 'File quality, noise reduction, and microphone selection all affect accuracy. Here\'s how to optimize your recordings.',
    category: 'Guides',
    readTime: '4 min',
    date: 'May 12, 2025',
    gradient: 'from-violet-600/20 to-purple-600/20',
  },
]

export function BlogPage() {
  return (
    <div className="pt-24 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div className="text-center mb-16" {...fadeUpProps()}>
          <h1 className="text-5xl font-extrabold text-white mb-4">Blog</h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Transcription guides, use cases, product updates, and more.
          </p>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <motion.div key={post.slug} className="glass rounded-2xl overflow-hidden hover:border-surface-500 transition-all duration-200 border border-surface-600/50 group" {...fadeUpViewportProps(i * 0.07)}>
              <div className={['h-28 bg-gradient-to-br', post.gradient].join(' ')} />
              <div className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="inline-flex items-center gap-1.5 text-xs text-brand-300 font-medium">
                    <Tag size={11} /> {post.category}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock size={11} /> {post.readTime} read
                  </span>
                </div>
                <h3 className="font-bold text-gray-100 mb-2 leading-tight group-hover:text-brand-300 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-400 mb-4 line-clamp-3 leading-relaxed">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">{post.date}</span>
                  <Link to={`/blog/${post.slug}`} className="flex items-center gap-1 text-xs text-brand-400 hover:text-brand-300 font-medium transition-colors">
                    Read <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
