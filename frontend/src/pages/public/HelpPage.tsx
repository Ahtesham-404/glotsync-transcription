import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, ChevronDown, MessageSquare, Book } from 'lucide-react'
import { Button } from '@/components/ui/Button'

const faqs = [
  {
    category: 'Upload & Files',
    questions: [
      { q: 'What is the maximum file size?', a: 'Free plan: 25 MB. Starter: 200 MB. Pro: 500 MB. Enterprise: 2 GB.' },
      { q: 'Why did my upload fail?', a: 'Common causes: unsupported format, file too large for your plan, or network timeout. Check the error message and try again.' },
      { q: 'How long are files stored?', a: 'Free: 7 days. Starter: 30 days. Pro: 90 days. Enterprise: custom retention.' },
    ],
  },
  {
    category: 'Transcription',
    questions: [
      { q: 'How accurate is the transcription?', a: 'We achieve 99%+ on clean, clear audio. Noisy backgrounds, heavy accents, or low-quality recordings may reduce accuracy.' },
      { q: 'How long does transcription take?', a: 'Typically less than 2× the file duration. A 10-minute recording usually completes in under 20 minutes.' },
      { q: 'What languages are supported?', a: 'GlotSync AI supports 50+ languages with automatic detection. English has the highest accuracy.' },
    ],
  },
  {
    category: 'Account & Billing',
    questions: [
      { q: 'Can I change my plan?', a: 'Yes. Visit Settings → Billing to upgrade or downgrade at any time. Changes take effect immediately.' },
      { q: 'Are refunds available?', a: 'We offer refunds within 7 days of a charge if you have not used any transcription minutes on that billing cycle.' },
      { q: 'How do I cancel my subscription?', a: 'Go to Settings → Billing → Cancel Subscription. Your plan remains active until the end of the billing period.' },
    ],
  },
]

export function HelpPage() {
  const [query, setQuery] = useState('')
  const [openItem, setOpenItem] = useState<string | null>(null)
  const navigate = useNavigate()

  const filtered = faqs.map((cat) => ({
    ...cat,
    questions: cat.questions.filter(
      (q) =>
        !query ||
        q.q.toLowerCase().includes(query.toLowerCase()) ||
        q.a.toLowerCase().includes(query.toLowerCase())
    ),
  })).filter((cat) => cat.questions.length > 0)

  return (
    <div className="pt-24 pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-extrabold text-white mb-4">Help Center</h1>
          <p className="text-gray-400 mb-8">Find answers to common questions.</p>
          <div className="relative max-w-xl mx-auto">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            <input
              type="search"
              placeholder="Search for help..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 text-sm bg-surface-800 border border-surface-600 rounded-2xl text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all"
            />
          </div>
        </motion.div>

        <div className="space-y-8">
          {filtered.map(({ category, questions }) => (
            <div key={category}>
              <h2 className="text-lg font-semibold text-gray-300 mb-4">{category}</h2>
              <div className="space-y-2">
                {questions.map(({ q, a }) => {
                  const key = `${category}-${q}`
                  const open = openItem === key
                  return (
                    <div key={q} className="glass rounded-xl overflow-hidden">
                      <button
                        className="w-full flex items-center justify-between px-5 py-4 text-left"
                        onClick={() => setOpenItem(open ? null : key)}
                        aria-expanded={open}
                      >
                        <span className="font-medium text-gray-200 text-sm">{q}</span>
                        <ChevronDown size={15} className={['text-gray-500 flex-shrink-0 ml-4 transition-transform duration-200', open ? 'rotate-180' : ''].join(' ')} />
                      </button>
                      {open && (
                        <div className="px-5 pb-4">
                          <p className="text-sm text-gray-400 leading-relaxed">{a}</p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="text-center text-gray-500 py-8">No results found for "{query}".</p>
          )}
        </div>

        <motion.div className="mt-12 glass rounded-2xl p-8 text-center" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <h2 className="text-xl font-bold text-white mb-2">Still need help?</h2>
          <p className="text-gray-400 mb-6">Our support team is here for you.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" icon={<MessageSquare size={16} />} onClick={() => navigate('/contact')}>
              Contact Support
            </Button>
            <Button variant="outline" icon={<Book size={16} />} onClick={() => navigate('/docs')}>
              Read Docs
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
