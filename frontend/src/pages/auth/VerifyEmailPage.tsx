import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, CheckCircle2, RefreshCw, LogOut } from 'lucide-react'
import { LogoMark } from '@/components/ui/Logo'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/components/ui/Toast'

export function VerifyEmailPage() {
  const { user, sendVerificationEmail, logout } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [sending, setSending] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)

  const handleResend = async () => {
    if (resendCooldown > 0) return
    setSending(true)
    try {
      await sendVerificationEmail()
      toast.success('Verification email sent', 'Check your inbox.')
      setResendCooldown(60)
      const interval = setInterval(() => {
        setResendCooldown((c) => {
          if (c <= 1) {
            clearInterval(interval)
            return 0
          }
          return c - 1
        })
      }, 1000)
    } catch {
      toast.error('Failed to send email', 'Please try again.')
    } finally {
      setSending(false)
    }
  }

  const handleCheckVerification = async () => {
    await user?.reload()
    if (user?.emailVerified) {
      toast.success('Email verified', 'Welcome to GlotSync AI!')
      navigate('/dashboard')
    } else {
      toast.warning("Not yet verified", "Please click the link in your email.")
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md relative"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-6">
            <LogoMark size={40} />
            <span className="font-bold text-xl text-white tracking-tight">
              Glot<span className="gradient-text">Sync</span>
              <span className="text-gray-400 font-normal"> AI</span>
            </span>
          </Link>
        </div>

        <div className="glass rounded-2xl p-8 shadow-2xl text-center">
          <div className="w-16 h-16 rounded-full bg-brand-500/15 border border-brand-500/30 flex items-center justify-center mx-auto mb-5">
            <Mail size={28} className="text-brand-400" />
          </div>

          <h1 className="text-2xl font-bold text-gray-100 mb-2">Verify your email</h1>
          <p className="text-gray-400 text-sm mb-1">
            We sent a verification link to
          </p>
          <p className="text-gray-200 font-medium text-sm mb-6">{user?.email}</p>

          <p className="text-gray-500 text-xs mb-8">
            Click the link in your email to activate your account. Once verified, click the button below to continue.
          </p>

          <div className="space-y-3">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              icon={<CheckCircle2 size={16} />}
              onClick={handleCheckVerification}
            >
              I've verified my email
            </Button>

            <Button
              variant="secondary"
              size="md"
              fullWidth
              loading={sending}
              icon={<RefreshCw size={15} />}
              onClick={handleResend}
              disabled={resendCooldown > 0}
            >
              {resendCooldown > 0
                ? `Resend in ${resendCooldown}s`
                : 'Resend verification email'}
            </Button>

            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 w-full py-2.5 text-sm text-gray-500 hover:text-gray-300 transition-colors"
            >
              <LogOut size={14} />
              Sign out and use a different account
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
