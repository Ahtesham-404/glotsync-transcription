import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, X, Zap, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { fadeUpProps, fadeUpViewportProps } from '@/lib/motion'
import type { PricingPlan } from '@/types'

const plans: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Perfect for trying out GlotSync AI.',
    monthlyPrice: 0,
    yearlyPrice: 0,
    cta: 'Get Started Free',
    ctaVariant: 'outline',
    limits: { minutesPerMonth: 30, maxFileSizeMb: 25, storageGb: 0.5, concurrentJobs: 1, retentionDays: 7 },
    features: [
      { text: '30 minutes / month', included: true },
      { text: 'Max 25 MB per file', included: true },
      { text: '0.5 GB storage', included: true },
      { text: 'TXT download', included: true },
      { text: 'SRT / VTT download', included: false },
      { text: 'API access', included: false },
      { text: 'Priority processing', included: false },
      { text: 'Team seats', included: false },
    ],
  },
  {
    id: 'starter',
    name: 'Starter',
    description: 'For individuals and freelancers.',
    monthlyPrice: 12,
    yearlyPrice: 9,
    cta: 'Start Starter',
    ctaVariant: 'secondary',
    limits: { minutesPerMonth: 300, maxFileSizeMb: 200, storageGb: 5, concurrentJobs: 2, retentionDays: 30 },
    features: [
      { text: '300 minutes / month', included: true },
      { text: 'Max 200 MB per file', included: true },
      { text: '5 GB storage', included: true },
      { text: 'TXT download', included: true },
      { text: 'SRT / VTT download', included: true },
      { text: 'API access', included: false },
      { text: 'Priority processing', included: false },
      { text: 'Team seats', included: false },
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For power users and growing teams.',
    monthlyPrice: 39,
    yearlyPrice: 29,
    cta: 'Start Pro',
    ctaVariant: 'primary',
    popular: true,
    limits: { minutesPerMonth: 1200, maxFileSizeMb: 500, storageGb: 25, concurrentJobs: 5, retentionDays: 90 },
    features: [
      { text: '1,200 minutes / month', included: true },
      { text: 'Max 500 MB per file', included: true },
      { text: '25 GB storage', included: true },
      { text: 'TXT download', included: true },
      { text: 'SRT / VTT download', included: true },
      { text: 'API access', included: true },
      { text: 'Priority processing', included: true },
      { text: 'Team seats', included: false },
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For large teams with custom needs.',
    monthlyPrice: null,
    yearlyPrice: null,
    cta: 'Contact Sales',
    ctaVariant: 'outline',
    limits: { minutesPerMonth: null, maxFileSizeMb: 2000, storageGb: null, concurrentJobs: 20, retentionDays: null },
    features: [
      { text: 'Unlimited minutes', included: true },
      { text: 'Max 2 GB per file', included: true },
      { text: 'Unlimited storage', included: true },
      { text: 'TXT download', included: true },
      { text: 'SRT / VTT download', included: true },
      { text: 'API access', included: true },
      { text: 'Priority processing', included: true },
      { text: 'Team seats (unlimited)', included: true },
    ],
  },
]

export function PricingPage() {
  const [yearly, setYearly] = useState(false)
  const navigate = useNavigate()

  return (
    <div className="pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div className="text-center mb-12" {...fadeUpProps()}>
          <h1 className="text-5xl font-extrabold text-white mb-4">Simple, transparent pricing</h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Start free. Scale as you grow. No hidden fees.
          </p>
          {/* Billing toggle */}
          <div className="inline-flex items-center gap-3 mt-8 bg-surface-800 border border-surface-600 rounded-xl p-1">
            <button
              className={['px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200', !yearly ? 'bg-brand-500 text-white shadow' : 'text-gray-400 hover:text-gray-200'].join(' ')}
              onClick={() => setYearly(false)}
            >
              Monthly
            </button>
            <button
              className={['px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200', yearly ? 'bg-brand-500 text-white shadow' : 'text-gray-400 hover:text-gray-200'].join(' ')}
              onClick={() => setYearly(true)}
            >
              Yearly
              <span className="ml-2 text-xs bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded-full">Save 25%</span>
            </button>
          </div>
        </motion.div>

        {/* Plans */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {plans.map((plan, i) => {
            const price = yearly ? plan.yearlyPrice : plan.monthlyPrice
            return (
              <motion.div
                key={plan.id}
                className={['relative rounded-2xl p-6 flex flex-col border transition-all duration-200', plan.popular ? 'border-brand-500/50 bg-brand-500/5 glow' : 'border-surface-600/50 bg-surface-800 hover:border-surface-500'].join(' ')}
                {...fadeUpProps(i * 0.1)}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="gradient-brand text-white text-xs font-bold px-3 py-1 rounded-full shadow">Most Popular</span>
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
                  <p className="text-sm text-gray-400">{plan.description}</p>
                </div>
                <div className="mb-6">
                  {price === null ? (
                    <div>
                      <span className="text-3xl font-extrabold text-white">Custom</span>
                    </div>
                  ) : (
                    <div className="flex items-end gap-1">
                      <span className="text-4xl font-extrabold text-white">${price}</span>
                      <span className="text-gray-400 text-sm mb-1">/mo</span>
                    </div>
                  )}
                  {yearly && price !== null && price > 0 && (
                    <p className="text-xs text-emerald-400 mt-1">Billed ${price * 12}/year</p>
                  )}
                </div>
                <ul className="space-y-3 flex-1 mb-6">
                  {plan.features.map(({ text, included }) => (
                    <li key={text} className={['flex items-start gap-2.5 text-sm', included ? 'text-gray-300' : 'text-gray-600'].join(' ')}>
                      {included
                        ? <Check size={14} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                        : <X size={14} className="text-gray-700 flex-shrink-0 mt-0.5" />}
                      {text}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={plan.ctaVariant as 'primary' | 'secondary' | 'outline'}
                  fullWidth
                  onClick={() => plan.id === 'enterprise' ? navigate('/contact') : navigate('/register')}
                >
                  {plan.cta}
                </Button>
              </motion.div>
            )
          })}
        </div>

        {/* Enterprise banner */}
        <motion.div className="glass rounded-3xl p-8 text-center" {...fadeUpViewportProps()}>
          <Zap size={24} className="text-brand-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">Need a custom plan?</h3>
          <p className="text-gray-400 mb-6 max-w-xl mx-auto">
            Processing thousands of hours a month? We offer volume discounts, dedicated support, SLA guarantees, and on-premise options.
          </p>
          <Button variant="primary" size="lg" iconRight={<ArrowRight size={16} />} onClick={() => navigate('/contact')}>
            Talk to Sales
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
