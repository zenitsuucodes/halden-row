'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import { Arrow } from './icons'

const HouseCanvas = dynamic(() => import('./HouseScene'), {
  ssr: false,
  loading: () => <div className="hero-fallback" aria-hidden="true" />,
})

const steps = [
  { n: '01', t: 'Drawn', d: 'Measured drawings before anyone picks up a hammer.' },
  { n: '02', t: 'Built', d: 'Assembled in the order it is built, by one crew.' },
  { n: '03', t: 'Finished', d: 'The materials you chose, installed with care.' },
]

function Step({ i, progress, step }: { i: number; progress: ReturnType<typeof useSpring>; step: (typeof steps)[number] }) {
  const ranges = [[0, 0.12, 0.3, 0.42], [0.3, 0.42, 0.62, 0.72], [0.62, 0.72, 1, 1.01]]
  const [a, b, c, d] = ranges[i]
  const opacity = useTransform(progress, [a, b, c, d], [0.28, 1, 1, i === 2 ? 1 : 0.28])
  const x = useTransform(progress, [a, b], [0, -12])
  return (
    <motion.div className="hero-step" style={{ opacity, x }}>
      <b>{step.n}</b>
      <strong>{step.t}</strong>
      <p>{step.d}</p>
    </motion.div>
  )
}

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion() ?? false
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const raw = useTransform(scrollYProgress, [0, 0.88], [0, 1], { clamp: true })
  const progress = useSpring(raw, { stiffness: 120, damping: 30, mass: 0.4 })

  return (
    <section ref={ref} className="hero" aria-label="Introduction">
      <div className="hero-sticky">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-canvas">
          <HouseCanvas progress={raw} reduced={reduced} />
        </div>

        <div className="hero-progress" aria-hidden="true"><motion.span style={{ scaleX: progress }} /></div>
        <div className="hero-ticks" aria-hidden="true">
          <span>Survey</span><span>Drawings</span><span>Structure</span><span>Envelope</span><span>Finishes</span><span>Handover</span>
        </div>

        <div className="hero-copy">
          <motion.span className="label" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }}>
            <i /> Design-build renovation studio · Toronto
          </motion.span>
          <h1 className="serif h-display">
            {['From first line', 'to last coat.'].map((line, i) => (
              <span key={line} style={{ display: 'block', overflow: 'hidden', paddingBottom: '0.06em' }}>
                <motion.span style={{ display: 'block' }} initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ delay: 0.3 + i * 0.12, duration: 1.1 }}>
                  {i === 1 ? <>to <em className="it">last coat.</em></> : line}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.p className="lede" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.9 }}>
            We design and build kitchens, basements, additions and whole homes, with a fixed price before we start and one site lead until we hand you the keys.
          </motion.p>
          <motion.div className="hero-actions" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85, duration: 0.9 }}>
            <Link href="/quote" className="btn">Request a quote <span className="arrow"><Arrow size={12} /></span></Link>
            <Link href="/projects" className="btn ghost">See our projects <span className="arrow"><Arrow size={12} /></span></Link>
          </motion.div>
        </div>

        <div className="hero-steps" aria-hidden="true">
          {steps.map((s, i) => <Step key={s.n} i={i} step={s} progress={progress} />)}
        </div>

        <div className="scroll-hint" aria-hidden="true"><i /> Scroll to build</div>
      </div>
    </section>
  )
}
