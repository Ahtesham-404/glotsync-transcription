import React from 'react'
import { motion } from 'framer-motion'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  glass?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
  onClick?: () => void
}

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

export function Card({
  children,
  className = '',
  hover = false,
  glass = false,
  padding = 'md',
  onClick,
}: CardProps) {
  const base = [
    'rounded-2xl',
    glass
      ? 'glass'
      : 'bg-surface-800 border border-surface-600/50',
    paddingClasses[padding],
    hover
      ? 'cursor-pointer transition-all duration-200 hover:border-surface-500 hover:shadow-lg hover:shadow-black/20'
      : '',
    className,
  ].join(' ')

  if (hover || onClick) {
    return (
      <motion.div
        className={base}
        onClick={onClick}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.15 }}
      >
        {children}
      </motion.div>
    )
  }

  return <div className={base}>{children}</div>
}

export function CardHeader({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={['mb-4', className].join(' ')}>
      {children}
    </div>
  )
}

export function CardTitle({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <h3 className={['text-lg font-semibold text-gray-100', className].join(' ')}>
      {children}
    </h3>
  )
}

export function CardDescription({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={['text-sm text-gray-400 mt-1', className].join(' ')}>
      {children}
    </p>
  )
}
