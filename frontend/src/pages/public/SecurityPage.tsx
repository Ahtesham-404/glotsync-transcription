import React from 'react'
import { motion } from 'framer-motion'
import { Shield, Lock, Server, Key, Eye, AlertTriangle } from 'lucide-react'

const practices = [
  {
    icon: Lock,
    title: 'Transport Security',
    items: ['TLS 1.3 enforced everywhere', 'HSTS headers', 'Secure cookies only', 'Certificate pinning on API'],
  },
  {
    icon: Server,
    title: 'Data Storage',
    items: ['AES-256 encryption at rest', 'Amazon S3 with bucket policies', 'Signed URLs (15 min expiry)', 'No plaintext secrets in code'],
  },
  {
    icon: Key,
    title: 'Authentication',
    items: ['Firebase Authentication', 'JWT token verification', 'Short-lived access tokens', 'Email verification required'],
  },
  {
    icon: Eye,
    title: 'Access Control',
    items: ['Least-privilege IAM roles', 'Per-user file isolation', 'Rate limiting on all endpoints', 'CORS restricted to known origins'],
  },
  {
    icon: Shield,
    title: 'Application Security',
    items: ['Input validation on all endpoints', 'MIME type validation for uploads', 'SQL injection prevention (parameterized queries)', 'XSS protection headers'],
  },
  {
    icon: AlertTriangle,
    title: 'Incident Response',
    items: ['24-hour acknowledgment SLA', 'Structured incident process', 'User notification for data breaches', 'Regular security audits'],
  },
]

export function SecurityPage() {
  return (
    <div className="pt-24 pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
            <Shield size={28} className="text-emerald-400" />
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-4">Security at GlotSync AI</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            We take security seriously. Here's how we protect your data and our infrastructure.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {practices.map(({ icon: Icon, title, items }, i) => (
            <motion.div key={title} className="glass rounded-2xl p-6" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.4 }}>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center mb-4">
                <Icon size={18} className="text-emerald-400" />
              </div>
              <h3 className="font-semibold text-gray-100 mb-3">{title}</h3>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div className="glass rounded-2xl p-8 text-center" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <h2 className="text-2xl font-bold text-white mb-3">Report a vulnerability</h2>
          <p className="text-gray-400 mb-4 max-w-xl mx-auto">
            Found a security issue? Please disclose responsibly. Do not open a public GitHub issue. Email us directly.
          </p>
          <a href="mailto:security@glotsync.online" className="text-brand-400 hover:text-brand-300 font-medium text-lg transition-colors">
            security@glotsync.online
          </a>
          <p className="text-gray-500 text-sm mt-3">We respond within 48 hours and credit responsible disclosures.</p>
        </motion.div>
      </div>
    </div>
  )
}
