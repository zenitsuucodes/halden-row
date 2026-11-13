'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion'
import { useRef, useState } from 'react'
import { Arrow } from './icons'
import type { Project } from '@/lib/data'

/**
 * A featured project. Hovering the photo turns the cursor into a lens
 * that reveals the original design drawing underneath.
 */
export function FeatureProject({ project, index }: { project: Project; index: number }) {
  const media = useRef<HTMLAnchorElement>(null)
  const { scrollYProgress } = useScroll({ target: media, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])
  const mx = useMotionValue(-200)
  const my = useMotionValue(-200)
  const sx = useSpring(mx, { stiffness: 300, damping: 30 })
  const sy = useSpring(my, { stiffness: 300, damping: 30 })
  const [hover, setHover] = useState(false)
  const r = useSpring(0, { stiffness: 200, damping: 26 })
  const mask = useTransform([sx, sy, r] as const, ([x, yy, rr]: number[]) => `radial-gradient(circle ${rr}px at ${x}px ${yy}px, #000 98%, transparent 100%)`)

  return (
    <article className="feature">
      <Link
        ref={media}
        href={`/projects/${project.slug}`}
        className="feature-media"
        aria-label={`View ${project.title}`}
        onPointerMove={(e) => {
          const b = e.currentTarget.getBoundingClientRect()
          mx.set(e.clientX - b.left)
          my.set(e.clientY - b.top)
        }}
        onPointerEnter={(e) => {
          if (e.pointerType !== 'mouse') return
          setHover(true)
          r.set(110)
        }}
        onPointerLeave={() => {
          setHover(false)
          r.set(0)
        }}
      >
        <motion.div className="layer" style={{ y }}>
          <Image src={`/images/projects/${project.slug}.webp`} alt={`${project.title}, ${project.neighbourhood}`} fill sizes="(max-width: 1080px) 100vw, 58vw" style={{ objectFit: 'cover' }} />
          <motion.div className="drawing" style={{ WebkitMaskImage: mask, maskImage: mask }}>
            <Image src={`/images/projects/${project.slug}-drawing.webp`} alt="" fill sizes="(max-width: 1080px) 100vw, 58vw" style={{ objectFit: 'cover' }} />
          </motion.div>
        </motion.div>
        <motion.span className="lens" style={{ x: sx, y: sy, opacity: hover ? 1 : 0 }} aria-hidden="true">
          Drawing
        </motion.span>
      </Link>
      <motion.div className="feature-text" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-10% 0px' }} transition={{ duration: 0.9 }}>
        <div className="meta">
          <span className="label">{String(index + 1).padStart(2, '0')} · {project.type}</span>
          <span className="label">{project.neighbourhood}</span>
        </div>
        <h3 className="serif">{project.title}</h3>
        <p>{project.summary}</p>
        <dl className="facts">
          <div><dt>Duration</dt><dd>{project.duration}</dd></div>
          <div><dt>Investment</dt><dd>{project.investment}</dd></div>
        </dl>
        <Link href={`/projects/${project.slug}`} className="text-link">Read the project <Arrow /></Link>
      </motion.div>
    </article>
  )
}
