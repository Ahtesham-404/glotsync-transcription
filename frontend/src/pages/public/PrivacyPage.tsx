import React from 'react'
import { motion } from 'framer-motion'

const sections = [
  {
    title: '1. Information We Collect',
    content: `We collect information you provide directly when creating an account (name, email, password hash via Firebase Authentication), uploading files, and using our services.

We automatically collect usage data including: IP address, browser type, pages visited, file metadata (name, size, type), and job processing status. We use cookies and similar technologies for authentication and analytics.`,
  },
  {
    title: '2. How We Use Your Information',
    content: `We use collected information to:
• Provide, operate, and maintain GlotSync AI
• Process audio and video files and generate transcripts
• Send transactional emails (verification, password reset, job completion)
• Improve our services and detect fraudulent activity
• Comply with legal obligations`,
  },
  {
    title: '3. File Storage and Retention',
    content: `Uploaded files and generated transcripts are stored in Amazon S3 with server-side encryption (AES-256). Files are retained according to your plan:
• Free: 7 days
• Starter: 30 days  
• Pro: 90 days
• Enterprise: Custom

You may delete your files at any time from the dashboard.`,
  },
  {
    title: '4. Sharing of Information',
    content: `We do not sell, trade, or rent your personal information to third parties. We may share information with:
• Service providers (AWS for hosting and storage, Firebase/Google for authentication)
• Legal authorities when required by law
• Successors in the event of a merger or acquisition (with prior notice)`,
  },
  {
    title: '5. Your Rights',
    content: `You have the right to:
• Access the personal data we hold about you
• Correct inaccurate data
• Request deletion of your account and associated data
• Export your transcripts at any time
• Opt out of marketing communications

To exercise these rights, email privacy@glotsync.online.`,
  },
  {
    title: '6. Cookies',
    content: `We use essential cookies for authentication session management and analytical cookies (Firebase Analytics) to understand usage patterns. See our Cookie Policy for details. You may manage cookie preferences through your browser settings.`,
  },
  {
    title: '7. Security',
    content: `We implement industry-standard security measures including TLS encryption in transit, AES-256 encryption at rest, Firebase Authentication with secure token management, and regular security reviews. No system is completely secure; we encourage you to use a strong password and enable email verification.`,
  },
  {
    title: '8. Changes to This Policy',
    content: `We may update this Privacy Policy periodically. We will notify you of significant changes via email or a prominent notice on our website at least 14 days before the change takes effect.`,
  },
  {
    title: '9. Contact',
    content: `For privacy-related questions, contact us at privacy@glotsync.online or write to:\nGlotSync AI, glotsync.online`,
  },
]

export function PrivacyPage() {
  return (
    <div className="pt-24 pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <motion.div className="mb-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h1 className="text-4xl font-extrabold text-white mb-3">Privacy Policy</h1>
          <p className="text-gray-400">Last updated: June 27, 2025</p>
        </motion.div>
        <motion.div className="glass rounded-2xl p-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          <p className="text-gray-300 mb-8 leading-relaxed">
            GlotSync AI ("we", "our", or "us") is committed to protecting your privacy. This policy explains how we collect, use, and protect your information when you use glotsync.online.
          </p>
          <div className="space-y-8">
            {sections.map(({ title, content }) => (
              <div key={title}>
                <h2 className="text-lg font-semibold text-gray-100 mb-3">{title}</h2>
                <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-line">{content}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
