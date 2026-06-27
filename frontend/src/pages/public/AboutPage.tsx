import React from 'react'
import { motion } from 'framer-motion'
import { Zap, Target, Heart, Users } from 'lucide-react'
import { fadeUpProps, fadeUpViewportProps } from '@/lib/motion'

const values = [
  { icon: Target, title: 'Accuracy First', desc: 'We optimize relentlessly for transcription quality because your content matters.' },
  { icon: Users, title: 'Built for Everyone', desc: 'From solo podcasters to enterprise legal teams — GlotSync AI scales with you.' },
  { icon: Heart, title: 'Privacy Respected', desc: 'Your files and transcripts are yours. We never sell your data or use it to train models.' },
  { icon: Zap, title: 'Speed Matters', desc: 'Fast processing and a snappy UI so you spend less time waiting and more time creating.' },
]

export function AboutPage() {
  return (
    <div className="pt-24 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div className="text-center mb-16" {...fadeUpProps()}>
          <h1 className="text-5xl font-extrabold text-white mb-4">About GlotSync AI</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            We built GlotSync AI because transcription tools were either too expensive, too slow, or too clunky. We wanted something different.
          </p>
        </motion.div>

        <motion.div className="glass rounded-3xl p-8 mb-12" {...fadeUpProps(0.1)}>
          <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
          <p className="text-gray-400 leading-relaxed text-lg">
            GlotSync AI enables creators, businesses, educators, journalists, legal professionals, and researchers to upload audio or video and receive highly accurate, searchable transcripts — viewable, editable, and downloadable in seconds.
          </p>
          <p className="text-gray-400 leading-relaxed mt-4">
            We believe the spoken word deserves to be as accessible and searchable as the written word. Every interview, lecture, meeting, and podcast contains valuable information — we make it retrievable.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6 mb-16">
          {values.map(({ icon: Icon, title, desc }, i) => (
            <motion.div key={title} className="glass rounded-2xl p-6" {...fadeUpViewportProps(i * 0.1)}>
              <div className="w-10 h-10 rounded-xl bg-brand-500/15 border border-brand-500/20 flex items-center justify-center mb-4">
                <Icon size={20} className="text-brand-400" />
              </div>
              <h3 className="font-semibold text-gray-100 mb-2">{title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div className="text-center glass rounded-3xl p-10" {...fadeUpViewportProps()}>
          <h2 className="text-2xl font-bold text-white mb-3">Get in touch</h2>
          <p className="text-gray-400 mb-2">
            Questions, partnerships, or feedback?
          </p>
          <a href="mailto:hello@glotsync.online" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
            hello@glotsync.online
          </a>
        </motion.div>
      </div>
    </div>
  )
}
