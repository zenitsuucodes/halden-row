'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import { useRef } from 'react'

/** Fade-and-rise when scrolled into view. */
export function Reveal({ children, delay = 0, y = 32, className, as = 'div' }: { children: React.ReactNode; delay?: number; y?: number; className?: string; as?: 'div' | 'li' | 'article' | 'section' }) {
  const M = motion[as]
  return (
    <M className={className} initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '0px 0px -12% 0px' }} transition={{ duration: 0.9, delay }}>
      {children}
    </M>
  )
}

/** Words rise one by one, masked. */
export function SplitText({ text, className, as = 'h2', delay = 0 }: { text: string; className?: string; as?: 'h1' | 'h2' | 'p'; delay?: number }) {
  const Tag = as
  const words = text.split(' ')
  return (
    <Tag className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} aria-hidden="true" style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top', paddingBottom: '0.08em', marginBottom: '-0.08em' }}>
          <motion.span style={{ display: 'inline-block' }} initial={{ y: '105%' }} whileInView={{ y: 0 }} viewport={{ once: true, margin: '0px 0px -10% 0px' }} transition={{ duration: 0.85, delay: delay + i * 0.045 }}>
            {w}{i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}

/** Image that drifts against the scroll inside its frame. */
export function ParallaxImage({ src, alt, className, strength = 12, sizes = '100vw', priority = false }: { src: string; alt: string; className?: string; strength?: number; sizes?: string; priority?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [`-${strength}%`, `${strength}%`])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.12, 1.04, 1.12])
  return (
    <div ref={ref} className={className} style={{ position: 'relative', overflow: 'hidden' }}>
      <motion.div style={{ position: 'absolute', inset: `-${strength}% 0`, y, scale }}>
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} style={{ objectFit: 'cover' }} />
      </motion.div>
    </div>
  )
}
