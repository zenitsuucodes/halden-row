'use client'

import Image from 'next/image'
import Link from 'next/link'
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion'
import { useState } from 'react'
import { services } from '@/lib/data'
import { serviceDrawings } from './Drawings'

/** Service rows; on desktop a photo follows the cursor over the hovered row. */
export function ServicesList() {
  const [active, setActive] = useState<number | null>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 26 })
  const sy = useSpring(y, { stiffness: 220, damping: 26 })

  return (
    <div
      className="services-list"
      onPointerMove={(e) => {
        x.set(e.clientX + 30)
        y.set(e.clientY - 180)
      }}
      onPointerLeave={() => setActive(null)}
    >
      {services.map((s, i) => (
        <motion.div
          key={s.key}
          className="service-row"
          onPointerEnter={(e) => e.pointerType === 'mouse' && setActive(i)}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-8% 0px' }}
          transition={{ duration: 0.8, delay: i * 0.05 }}
        >
          <span className="n">{String(i + 1).padStart(2, '0')}</span>
          <Link href={`/services#${s.key}`}><h3 className="serif">{s.title}</h3></Link>
          <div className="service-drawing">{(() => { const D = serviceDrawings[s.key]; return D ? <D /> : null })()}</div>
          <p>{s.line} {s.detail}</p>
          <span className="from">{s.from}</span>
        </motion.div>
      ))}
      <AnimatePresence>
        {active !== null && (
          <motion.div
            className="service-peek"
            style={{ x: sx, y: sy }}
            initial={{ opacity: 0, scale: 0.85, rotate: -4 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.85, rotate: 4 }}
            transition={{ duration: 0.35 }}
            aria-hidden="true"
          >
            <AnimatePresence mode="popLayout">
              <motion.div key={active} style={{ position: 'absolute', inset: 0 }} initial={{ clipPath: 'inset(100% 0 0 0)' }} animate={{ clipPath: 'inset(0% 0 0 0)' }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
                <Image src={services[active].image} alt="" fill sizes="300px" style={{ objectFit: 'cover' }} />
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
