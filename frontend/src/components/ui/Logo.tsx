import React from 'react'

/**
 * GlotSync soundmark — a stylized audio waveform inside a rounded tile.
 * Drawn as SVG bars so it stays crisp at any size and carries the brand
 * gradient. This is a hand-built mark, not a stock icon.
 */
export function LogoMark({
  size = 32,
  className = '',
  animate = false,
}: {
  size?: number
  className?: string
  animate?: boolean
}) {
  // Bar heights describe the waveform silhouette (centered, symmetric-ish).
  const bars = [
    { x: 5, h: 8 },
    { x: 9.5, h: 16 },
    { x: 14, h: 26 },
    { x: 18.5, h: 16 },
    { x: 23, h: 11 },
  ]
  return (
    <span
      className={[
        'inline-flex items-center justify-center rounded-xl gradient-brand shadow-lg shadow-brand-900/40',
        className,
      ].join(' ')}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg
        width={size * 0.72}
        height={size * 0.72}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {bars.map((b, i) => (
          <rect
            key={b.x}
            x={b.x}
            y={16 - b.h / 2}
            width="3"
            height={b.h}
            rx="1.5"
            fill="#1a1715"
            className={animate ? 'eq-bar' : ''}
            style={animate ? { animationDelay: `${i * 0.12}s` } : undefined}
          />
        ))}
      </svg>
    </span>
  )
}

/**
 * Full lock-up: soundmark + "GlotSync AI" wordmark.
 */
export function Logo({
  size = 32,
  className = '',
  withText = true,
}: {
  size?: number
  className?: string
  withText?: boolean
}) {
  return (
    <span className={['flex items-center gap-2.5', className].join(' ')}>
      <LogoMark size={size} />
      {withText && (
        <span className="font-display font-bold text-lg text-white tracking-tight">
          Glot<span className="gradient-text">Sync</span>
          <span className="text-surface-400 font-normal"> AI</span>
        </span>
      )}
    </span>
  )
}
