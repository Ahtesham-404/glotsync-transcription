import React from 'react'
import { motion } from 'framer-motion'

const cookieTypes = [
  {
    name: 'Essential Cookies',
    required: true,
    desc: 'Required for authentication and core functionality. Cannot be disabled.',
    examples: ['Firebase auth session token', 'CSRF protection', 'User preferences (theme)'],
  },
  {
    name: 'Analytics Cookies',
    required: false,
    desc: 'Help us understand how the service is used so we can improve it.',
    examples: ['Firebase Analytics (page views)', 'Session duration', 'Feature usage events'],
  },
]

export function CookiePolicyPage() {
  return (
    <div className="pt-24 pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <motion.div className="mb-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h1 className="text-4xl font-extrabold text-white mb-3">Cookie Policy</h1>
          <p className="text-gray-400">Last updated: June 27, 2025</p>
        </motion.div>
        <motion.div className="glass rounded-2xl p-8 space-y-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          <div>
            <p className="text-gray-400 leading-relaxed">
              GlotSync AI uses cookies and similar technologies to operate and improve the Service. This policy explains what cookies we use and why.
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-100 mb-4">What are cookies?</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Cookies are small text files stored on your device when you visit a website. They help the site remember your preferences and provide analytics.
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-100 mb-5">Cookies we use</h2>
            <div className="space-y-5">
              {cookieTypes.map(({ name, required, desc, examples }) => (
                <div key={name} className="bg-surface-800 rounded-xl p-5 border border-surface-600/50">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-200">{name}</h3>
                    <span className={['text-xs px-2.5 py-0.5 rounded-full font-medium', required ? 'bg-emerald-500/15 text-emerald-300' : 'bg-surface-700 text-gray-400'].join(' ')}>
                      {required ? 'Required' : 'Optional'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">{desc}</p>
                  <ul className="space-y-1">
                    {examples.map((e) => (
                      <li key={e} className="text-xs text-gray-500">• {e}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-100 mb-3">Managing cookies</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              You can control cookies through your browser settings. Disabling essential cookies will prevent you from logging in. For analytics cookies, you can opt out via your account settings.
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-100 mb-3">Contact</h2>
            <p className="text-gray-400 text-sm">Questions? Email <a href="mailto:privacy@glotsync.online" className="text-brand-400 hover:text-brand-300">privacy@glotsync.online</a></p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
