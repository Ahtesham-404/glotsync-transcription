import React from 'react'
import { motion } from 'framer-motion'

interface ProgressBarProps {
  value: number // 0–100
  max?: number
  label?: string
  showValue?: boolean
  color?: 'brand' | 'success' | 'warning' | 'error'
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
  className?: string
}

const colorClasses = {
  brand: 'from-brand-600 to-brand-400',
  success: 'from-emerald-600 to-emerald-400',
  warning: 'from-amber-600 to-amber-400',
  error: 'from-red-600 to-red-400',
}

const sizeClasses = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showValue = false,
  color = 'brand',
  size = 'md',
  animated = true,
  className = '',
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  return (
    <div className={className}>
      {(label || showValue) && (
        <div className="flex justify-between mb-1.5">
          {label && <span className="text-sm text-gray-400">{label}</span>}
          {showValue && (
            <span className="text-sm font-medium text-gray-300">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div
        className={[
          'w-full bg-surface-700 rounded-full overflow-hidden',
          sizeClasses[size],
        ].join(' ')}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
      >
        <motion.div
          className={[
            'h-full rounded-full bg-gradient-to-r',
            colorClasses[color],
            animated ? 'transition-all duration-300' : '',
          ].join(' ')}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}
