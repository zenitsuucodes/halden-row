'use client'

import { MotionConfig } from 'framer-motion'

/** Respect the visitor's reduced-motion setting everywhere. */
export function MotionRoot({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user" transition={{ ease: [0.22, 1, 0.36, 1] }}>{children}</MotionConfig>
}
