'use client'

import Image from 'next/image'
import { animate, motion, useInView, useMotionValue, useTransform } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

/**
 * Drag between the design drawing and the finished room.
 * Uses a real range input underneath, so it works with keyboard and screen readers.
 */
export function CompareSlider({ slug, title, aspect = '16 / 10', portrait = false }: { slug: string; title: string; aspect?: string; portrait?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const pos = useMotionValue(50)
  const [value, setValue] = useState(50)
  const clip = useTransform(pos, (v) => `inset(0 ${100 - v}% 0 0)`)
  const left = useTransform(pos, (v) => `${v}%`)

  // A little "sweep" the first time it scrolls into view, to show it is draggable.
  useEffect(() => {
    if (!inView) return
    const seq = async () => {
      await animate(pos, 78, { duration: 0.9, ease: [0.22, 1, 0.36, 1] })
      await animate(pos, 30, { duration: 1.1, ease: [0.22, 1, 0.36, 1] })
      await animate(pos, 50, { duration: 0.8, ease: [0.22, 1, 0.36, 1] })
    }
    seq()
  }, [inView, pos])

  useEffect(() => pos.on('change', (v) => setValue(Math.round(v))), [pos])

  return (
    <div ref={ref} className="compare" style={{ aspectRatio: portrait ? '4 / 5' : aspect }}>
      <Image src={`/images/projects/${slug}.webp`} alt={`${title}, finished`} fill sizes="(max-width: 820px) 100vw, 70vw" style={{ objectFit: 'cover' }} />
      <motion.div className="top" style={{ clipPath: clip }}>
        <Image src={`/images/projects/${slug}-drawing.webp`} alt={`${title}, design drawing`} fill sizes="(max-width: 820px) 100vw, 70vw" style={{ objectFit: 'cover' }} />
      </motion.div>
      <motion.div className="compare-handle" style={{ left }} aria-hidden="true">
        <div className="compare-knob">
          <svg width="26" height="14" viewBox="0 0 26 14" fill="none"><path d="M7 1L1 7l6 6M19 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" /></svg>
        </div>
      </motion.div>
      <span className="compare-tag l" aria-hidden="true">Drawing</span>
      <span className="compare-tag r" aria-hidden="true">Built</span>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        aria-label={`Compare the design drawing and the finished ${title}`}
        aria-valuetext={`${value}% drawing`}
        onChange={(e) => pos.set(Number(e.target.value))}
      />
    </div>
  )
}
