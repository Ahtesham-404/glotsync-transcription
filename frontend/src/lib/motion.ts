/**
 * Shared motion helpers to avoid Framer Motion Variants typing issues.
 * Use these instead of custom variant objects with function values.
 */

export function fadeUpProps(delay = 0) {
  return {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.45, delay, ease: 'easeOut' as const },
  }
}

export function fadeUpViewportProps(delay = 0) {
  return {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.45, delay, ease: 'easeOut' as const },
  }
}
