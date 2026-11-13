import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CompareSlider } from '@/components/CompareSlider'
import { Gallery } from '@/components/Gallery'
import { ParallaxImage, Reveal, SplitText } from '@/components/motion'
import { Arrow } from '@/components/icons'
import { projects, type ProjectType } from '@/lib/data'

const quoteType: Record<ProjectType, string> = { Kitchens: 'kitchen', Bathrooms: 'bathroom', Basements: 'basement', 'Whole home': 'whole-home', Additions: 'addition' }

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const p = projects.find((x) => x.slug === slug)
  if (!p) return {}
  return { title: `${p.title}, ${p.neighbourhood}`, description: p.summary, openGraph: { images: [`/images/projects/${p.slug}.webp`] } }
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const index = projects.findIndex((x) => x.slug === slug)
  if (index < 0) notFound()
  const p = projects[index]
  const next = projects[(index + 1) % projects.length]

  return (
    <>
      <section className="detail-hero">
        <div className="bg"><ParallaxImage src={`/images/projects/${p.slug}.webp`} alt={`${p.title}, ${p.neighbourhood}`} strength={8} priority /></div>
        <div className="wrap">
          <Reveal><span className="label">{p.type} · {p.neighbourhood} · {p.year}</span></Reveal>
          <SplitText as="h1" className="serif h-display" text={p.title} />
        </div>
      </section>

      <section className="section">
        <div className="wrap detail-grid">
          <aside className="detail-facts" aria-label="Project facts">
            <dl>
              <div><dt>Neighbourhood</dt><dd>{p.neighbourhood}</dd></div>
              <div><dt>Project type</dt><dd>{p.type}</dd></div>
              <div><dt>Duration</dt><dd>{p.duration}</dd></div>
              <div><dt>Investment</dt><dd>{p.investment}</dd></div>
              <div><dt>Scope</dt><dd><ul>{p.scope.map((s) => <li key={s}>{s}</li>)}</ul></dd></div>
            </dl>
            <div style={{ marginTop: 30 }}>
              <Link href={`/quote?type=${quoteType[p.type]}`} className="btn">
                Plan a similar project <span className="arrow"><Arrow size={12} /></span>
              </Link>
            </div>
          </aside>
          <div className="story">
            <Reveal><p className="serif" style={{ fontSize: 'clamp(26px, 2.6vw, 38px)', lineHeight: 1.2, color: 'var(--ink)' }}>{p.summary}</p></Reveal>
            <Reveal><h2 className="serif">The brief</h2><p>{p.brief}</p></Reveal>
            <Reveal><CompareSlider slug={p.slug} title={p.title} portrait={p.portrait} /></Reveal>
            <Reveal><h2 className="serif">Our approach</h2><p>{p.approach}</p></Reveal>
            <Reveal><h2 className="serif">The result</h2><p>{p.outcome}</p></Reveal>
            <Gallery slug={p.slug} title={p.title} />
          </div>
        </div>
      </section>

      <section className="wrap" style={{ paddingBottom: 120 }}>
        <Link href={`/projects/${next.slug}`} className="next-project">
          <div>
            <span className="label">Next project</span>
            <div className="serif h-1" style={{ marginTop: 12 }}>{next.title}</div>
          </div>
          <span className="btn ghost">Open <span className="arrow"><Arrow size={12} /></span></span>
        </Link>
      </section>
    </>
  )
}
