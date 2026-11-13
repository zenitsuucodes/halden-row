import type { Metadata } from 'next'
import Link from 'next/link'
import { ParallaxImage, Reveal, SplitText } from '@/components/motion'
import { Arrow } from '@/components/icons'
import { projects, services } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Services',
  description: 'Kitchen, bathroom and basement renovations, whole-home renovations and additions in Toronto, with planning ranges and what is included.',
}

const related: Record<string, string> = { kitchens: 'Kitchens', bathrooms: 'Bathrooms', basements: 'Basements', 'whole-home': 'Whole home', additions: 'Additions' }

export default function ServicesPage() {
  return (
    <>
      <section className="page-head">
        <div className="wrap">
          <Reveal><span className="label">Services</span></Reveal>
          <SplitText as="h1" className="serif h-display" text="Whatever the room, the same way of working." />
          <Reveal delay={0.2}><p className="lede">Design, permits and construction under one contract. Planning ranges below are typical for Toronto houses and include design and project management.</p></Reveal>
        </div>
      </section>
      <section className="wrap" style={{ paddingBottom: 140 }}>
        {services.map((s, i) => {
          const examples = projects.filter((p) => p.type === related[s.key])
          return (
            <article key={s.key} id={s.key} className="svc-block" style={{ scrollMarginTop: 100 }}>
              <Reveal y={60}><ParallaxImage src={s.image} alt={`${s.title} by Halden Row`} className="svc-media" strength={8} sizes="(max-width: 820px) 100vw, 50vw" /></Reveal>
              <div>
                <Reveal><span className="label">{String(i + 1).padStart(2, '0')} · {s.from}</span></Reveal>
                <SplitText as="h2" className="serif h-2" text={s.title} />
                <Reveal delay={0.1}>
                  <p className="serif" style={{ fontSize: 24, lineHeight: 1.25, color: 'var(--ink)' }}>{s.line}</p>
                  <p>{s.detail}</p>
                  {examples.length > 0 && (
                    <p style={{ fontSize: 14 }}>
                      See:{' '}
                      {examples.map((e, k) => (
                        <span key={e.slug}>{k > 0 && ', '}<Link className="text-link" style={{ border: 0 }} href={`/projects/${e.slug}`}>{e.title}</Link></span>
                      ))}
                    </p>
                  )}
                  <Link href={`/quote?type=${s.key === 'whole-home' ? 'whole-home' : s.key.replace(/s$/, '')}`} className="btn ghost" style={{ marginTop: 14 }}>
                    Plan a {s.title.toLowerCase().replace(/s$/, '')} <span className="arrow"><Arrow size={12} /></span>
                  </Link>
                </Reveal>
              </div>
            </article>
          )
        })}
      </section>
    </>
  )
}
