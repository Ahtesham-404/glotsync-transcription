import React from 'react'
import { motion } from 'framer-motion'

const sections = [
  {
    title: '1. Acceptance of Terms',
    content: 'By accessing or using GlotSync AI ("Service"), you agree to be bound by these Terms of Service. If you do not agree, do not use the Service.',
  },
  {
    title: '2. Description of Service',
    content: 'GlotSync AI is an AI-powered audio and video transcription platform that allows users to upload media files and receive automated text transcripts. The Service is provided "as is".',
  },
  {
    title: '3. Account Registration',
    content: 'You must provide accurate information when creating an account. You are responsible for maintaining the confidentiality of your credentials and all activity under your account. You must be at least 13 years old to use the Service.',
  },
  {
    title: '4. Acceptable Use',
    content: `You agree not to:
• Upload files containing illegal, harmful, or infringing content
• Attempt to reverse-engineer, scrape, or overload the Service
• Use the Service to process content you do not have rights to
• Attempt to bypass security or rate limits
• Resell access to the Service without written permission`,
  },
  {
    title: '5. Intellectual Property',
    content: 'You retain all ownership of the files you upload and transcripts generated from your content. GlotSync AI retains ownership of the platform, software, and brand. You grant us a limited license to process your files solely for the purpose of providing the Service.',
  },
  {
    title: '6. Payment and Billing',
    content: 'Paid plans are billed in advance on a monthly or annual basis. All fees are non-refundable except as required by law. We reserve the right to modify pricing with 30 days notice. Failure to pay may result in service suspension.',
  },
  {
    title: '7. Limitation of Liability',
    content: 'To the maximum extent permitted by law, GlotSync AI shall not be liable for indirect, incidental, special, or consequential damages. Our total liability shall not exceed the amount you paid us in the 12 months preceding the claim.',
  },
  {
    title: '8. Disclaimer of Warranties',
    content: 'The Service is provided "as is" without warranties of any kind. We do not guarantee 100% accuracy of transcriptions. Transcription quality depends on audio clarity, accents, and background noise.',
  },
  {
    title: '9. Termination',
    content: 'You may delete your account at any time. We may suspend or terminate accounts that violate these terms, with or without notice. Upon termination, your files will be deleted within 30 days.',
  },
  {
    title: '10. Changes to Terms',
    content: 'We may modify these Terms with 14 days advance notice. Continued use after changes constitutes acceptance.',
  },
  {
    title: '11. Governing Law',
    content: 'These Terms are governed by applicable law. Disputes shall be resolved through binding arbitration unless prohibited by local law.',
  },
  {
    title: '12. Contact',
    content: 'For questions about these Terms, email legal@glotsync.online.',
  },
]

export function TermsPage() {
  return (
    <div className="pt-24 pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <motion.div className="mb-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h1 className="text-4xl font-extrabold text-white mb-3">Terms of Service</h1>
          <p className="text-gray-400">Last updated: June 27, 2025</p>
        </motion.div>
        <motion.div className="glass rounded-2xl p-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
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
