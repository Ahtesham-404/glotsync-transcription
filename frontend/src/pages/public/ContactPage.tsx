import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Mail, MessageSquare, User, CheckCircle2, Send } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { fadeUpProps } from '@/lib/motion'

const schema = z.object({
  name: z.string().min(2, 'Name required'),
  email: z.string().email('Valid email required'),
  subject: z.string().min(1, 'Please select a subject'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
})
type FormValues = z.infer<typeof schema>

export function ContactPage() {
  const [sent, setSent] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (values: FormValues) => {
    // In production this calls a backend endpoint or email service
    await new Promise((r) => setTimeout(r, 1200))
    console.log('Contact form submitted:', values)
    setSent(true)
  }

  return (
    <div className="pt-24 pb-24">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <motion.div className="text-center mb-12" {...fadeUpProps()}>
          <h1 className="text-5xl font-extrabold text-white mb-4">Contact Us</h1>
          <p className="text-gray-400 text-lg">We'd love to hear from you. Send us a message and we'll respond within 24 hours.</p>
        </motion.div>

        <motion.div className="glass rounded-2xl p-8" {...fadeUpProps(0.1)}>
          {sent ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={32} className="text-emerald-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Message sent!</h2>
              <p className="text-gray-400">We'll get back to you at the email you provided within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              <div className="grid sm:grid-cols-2 gap-5">
                <Input
                  label="Your name" type="text" placeholder="Jane Smith"
                  icon={<User size={16} />} error={errors.name?.message} fullWidth required
                  {...register('name')}
                />
                <Input
                  label="Email address" type="email" placeholder="jane@company.com"
                  icon={<Mail size={16} />} error={errors.email?.message} fullWidth required
                  {...register('email')}
                />
              </div>
              <Select
                label="Subject" placeholder="Select a subject" fullWidth required
                options={[
                  { value: 'general', label: 'General Inquiry' },
                  { value: 'sales', label: 'Sales & Pricing' },
                  { value: 'support', label: 'Technical Support' },
                  { value: 'billing', label: 'Billing' },
                  { value: 'partnership', label: 'Partnership' },
                  { value: 'other', label: 'Other' },
                ]}
                error={errors.subject?.message}
                {...register('subject')}
              />
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Message <span className="text-red-400" aria-label="required">*</span>
                </label>
                <textarea
                  rows={5}
                  placeholder="Tell us how we can help..."
                  className={[
                    'block w-full rounded-xl border bg-surface-800 text-gray-100 placeholder-gray-500',
                    'transition-all duration-200 px-4 py-2.5 text-sm resize-none',
                    'focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500',
                    errors.message ? 'border-red-500/70' : 'border-surface-600 hover:border-surface-500',
                  ].join(' ')}
                  {...register('message')}
                />
                {errors.message && (
                  <p className="mt-1.5 text-xs text-red-400">{errors.message.message}</p>
                )}
              </div>
              <Button type="submit" variant="primary" size="lg" fullWidth loading={isSubmitting} icon={<Send size={16} />}>
                Send Message
              </Button>
            </form>
          )}
        </motion.div>

        <motion.div className="mt-8 grid sm:grid-cols-2 gap-4" {...fadeUpProps(0.2)}>
          {[
            { icon: Mail, label: 'Email', value: 'hello@glotsync.online', href: 'mailto:hello@glotsync.online' },
            { icon: MessageSquare, label: 'Support', value: 'support@glotsync.online', href: 'mailto:support@glotsync.online' },
          ].map(({ icon: Icon, label, value, href }) => (
            <div key={label} className="glass rounded-xl p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-brand-500/15 flex items-center justify-center flex-shrink-0">
                <Icon size={16} className="text-brand-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500">{label}</p>
                <a href={href} className="text-sm text-gray-300 hover:text-brand-300 transition-colors">{value}</a>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
