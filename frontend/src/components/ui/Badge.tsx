import React from 'react'
import type { JobStatus } from '@/types'

type BadgeVariant = 'default' | 'brand' | 'success' | 'warning' | 'error' | 'info'

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  dot?: boolean
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-surface-600 text-gray-300',
  brand: 'bg-brand-500/20 text-brand-300 border border-brand-500/30',
  success: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30',
  warning: 'bg-amber-500/15 text-amber-300 border border-amber-500/30',
  error: 'bg-red-500/15 text-red-300 border border-red-500/30',
  info: 'bg-sky-500/15 text-sky-300 border border-sky-500/30',
}

const dotClasses: Record<BadgeVariant, string> = {
  default: 'bg-gray-400',
  brand: 'bg-brand-400',
  success: 'bg-emerald-400',
  warning: 'bg-amber-400',
  error: 'bg-red-400',
  info: 'bg-sky-400',
}

export function Badge({ variant = 'default', children, dot, className = '' }: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium',
        variantClasses[variant],
        className,
      ].join(' ')}
    >
      {dot && (
        <span
          className={['w-1.5 h-1.5 rounded-full flex-shrink-0', dotClasses[variant]].join(' ')}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  )
}

// Convenience component for job status
export function JobStatusBadge({ status }: { status: JobStatus }) {
  const config: Record<JobStatus, { variant: BadgeVariant; label: string }> = {
    queued: { variant: 'default', label: 'Queued' },
    uploading: { variant: 'info', label: 'Uploading' },
    processing: { variant: 'warning', label: 'Processing' },
    completed: { variant: 'success', label: 'Completed' },
    failed: { variant: 'error', label: 'Failed' },
  }
  const { variant, label } = config[status]
  return (
    <Badge variant={variant} dot>
      {label}
    </Badge>
  )
}
