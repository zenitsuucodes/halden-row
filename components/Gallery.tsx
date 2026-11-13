'use client'

import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export function Gallery({ slug, title }: { slug: string; title: string }) {
  const shots = [
    { src: `/images/projects/${slug}.webp`, alt: `${title}, the finished space` },
    { src: `/images/projects/${slug}-detail-1.webp`, alt: `${title}, detail` },
    { src: `/images/projects/${slug}-detail-2.webp`, alt: `${title}, second detail` },
  ]
  const [open, setOpen] = useState<number | null>(null)

  useEffect(() => {
    if (open === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null)
      if (e.key === 'ArrowRight') setOpen((o) => (o === null ? o : (o + 1) % shots.length))
      if (e.key === 'ArrowLeft') setOpen((o) => (o === null ? o : (o + shots.length - 1) % shots.length))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, shots.length])

  return (
    <>
      <div className="gallery">
        {shots.map((s, i) => (
          <motion.button
            key={s.src}
            onClick={() => setOpen(i)}
            aria-label={`Open photo ${i + 1} of ${shots.length}`}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{ duration: 0.8, delay: i * 0.08 }}
            style={{ position: 'relative' }}
          >
            <Image src={s.src} alt={s.alt} fill sizes="(max-width: 820px) 100vw, 50vw" style={{ objectFit: 'cover' }} />
          </motion.button>
        ))}
      </div>
      <AnimatePresence>
        {open !== null && (
          <motion.div className="lightbox" role="dialog" aria-modal="true" aria-label={shots[open].alt} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(null)}>
            <motion.img key={shots[open].src} src={shots[open].src} alt={shots[open].alt} initial={{ scale: 0.94, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }} onClick={(e) => e.stopPropagation()} />
            <button className="close" aria-label="Close" onClick={() => setOpen(null)}>×</button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
