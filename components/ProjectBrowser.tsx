'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { projects, projectTypes, type ProjectType } from '@/lib/data'

const toParam = (t: string) => t.toLowerCase().replace(/\s+/g, '-')

/** Filterable project grid. The filter lives in the URL, so a filtered view can be shared. */
export function ProjectBrowser() {
  const router = useRouter()
  const params = useSearchParams()
  const param = params.get('type')
  const active = (projectTypes.find((t) => toParam(t) === param) ?? 'All') as ProjectType | 'All'
  const list = active === 'All' ? projects : projects.filter((p) => p.type === active)

  const choose = (t: ProjectType | 'All') => {
    const q = t === 'All' ? '' : `?type=${toParam(t)}`
    router.replace(`/projects${q}`, { scroll: false })
  }

  return (
    <LayoutGroup>
      <div className="filters" role="group" aria-label="Filter projects by type">
        {(['All', ...projectTypes] as const).map((t) => {
          const count = t === 'All' ? projects.length : projects.filter((p) => p.type === t).length
          return (
            <button key={t} className="chip" aria-pressed={active === t} onClick={() => choose(t)}>
              {active === t && <motion.span layoutId="chip-pill" className="pill" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
              <span>{t}<sup>{count}</sup></span>
            </button>
          )
        })}
      </div>
      <p className="visually-hidden" aria-live="polite">{list.length} projects shown</p>
      <motion.div layout className="project-grid">
        <AnimatePresence mode="popLayout">
          {list.map((p, i) => (
            <motion.article
              key={p.slug}
              layout
              className="project-card"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.6, delay: i * 0.04 }}
            >
              <Link href={`/projects/${p.slug}`} className="card-media">
                <Image src={`/images/projects/${p.slug}.webp`} alt={`${p.title}, ${p.neighbourhood}`} fill sizes="(max-width: 820px) 100vw, 50vw" style={{ objectFit: 'cover' }} />
                <Image className="drawing" src={`/images/projects/${p.slug}-drawing.webp`} alt="" fill sizes="(max-width: 820px) 100vw, 50vw" style={{ objectFit: 'cover' }} />
              </Link>
              <div className="card-meta">
                <h3 className="serif"><Link href={`/projects/${p.slug}`}>{p.title}</Link></h3>
                <span>{p.type} · {p.neighbourhood}</span>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>
    </LayoutGroup>
  )
}
