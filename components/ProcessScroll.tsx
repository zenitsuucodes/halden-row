'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Dimension } from './icons'
import { process } from '@/lib/data'

/** Vertical scroll drives a horizontal track of process steps. */
export function ProcessScroll() {
  const section = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const [distance, setDistance] = useState(0)
  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] })
  const x = useTransform(scrollYProgress, [0.05, 0.95], [0, -distance])
  const bar = useTransform(scrollYProgress, [0.05, 0.95], [0, 1])

  useEffect(() => {
    const measure = () => {
      if (!track.current) return
      setDistance(Math.max(0, track.current.scrollWidth - window.innerWidth))
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  return (
    <section ref={section} className="hscroll" style={{ height: `calc(100svh + ${distance}px)` }} aria-labelledby="process-title">
      <div className="hscroll-sticky">
        <motion.div ref={track} className="hscroll-track" style={{ x }}>
          <div className="step-intro">
            <span className="label">How we work</span>
            <h2 id="process-title" className="serif h-1" style={{ margin: '18px 0 20px' }}>Five steps. <em className="it">No surprises.</em></h2>
            <p className="lede">Every Halden Row project follows the same path, so you always know what happens next and what it costs.</p>
          </div>
          {process.map((s) => (
            <article key={s.n} className="step-card">
              <span className="time">{s.time}</span>
              <h3 className="serif">{s.title}</h3>
              <p>{s.text}</p>
              <Dimension label={`STEP ${s.n}`} width={220} />
              <span className="n" aria-hidden="true">{s.n}</span>
            </article>
          ))}
        </motion.div>
        <div className="wrap" style={{ marginTop: 40 }}>
          <div style={{ height: 1, background: 'var(--line)', position: 'relative' }}>
            <motion.div style={{ position: 'absolute', inset: 0, background: 'var(--ink)', scaleX: bar, transformOrigin: 'left' }} />
          </div>
        </div>
      </div>
    </section>
  )
}
