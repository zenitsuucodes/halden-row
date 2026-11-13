import type { Metadata } from 'next'
import Link from 'next/link'
import { ProcessScroll } from '@/components/ProcessScroll'
import { ParallaxImage, Reveal, SplitText } from '@/components/motion'
import { Arrow } from '@/components/icons'
import { commitments, studio } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Studio and process',
  description: 'How Halden Row works: a walkthrough, measured drawings, a fixed price, one site lead and a two-year workmanship warranty.',
}

const values = [
  ['Drawings first', 'We never price a guess. You see measured plans and 3D views before you see a number.'],
  ['Honest numbers', 'Fixed prices, written change orders, and allowances only where you ask for them.'],
  ['Quiet sites', 'Protected floors, a daily sweep, dust walls and a crew that treats your house like a home.'],
]

export default function StudioPage() {
  return (
    <>
      <section className="page-head">
        <div className="wrap studio-hero">
          <div>
            <Reveal><span className="label">The studio</span></Reveal>
            <SplitText as="h1" className="serif h-display" text="Small studio. Whole houses." />
            <Reveal delay={0.2}><p className="lede">Halden Row is a design-build studio in Leslieville. Our designers and site leads work on the same projects, at the same table, so nothing gets lost between the drawing and the build.</p></Reveal>
          </div>
          <Reveal y={60}><ParallaxImage src="/images/studio-pool.webp" alt="A modern white house with large windows" className="studio-media" strength={10} sizes="(max-width: 820px) 100vw, 45vw" priority /></Reveal>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 60 }}>
        <div className="wrap">
          <div className="values">
            {values.map(([t, d], i) => (
              <Reveal key={t} as="article" delay={i * 0.08}>
                <span className="label">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="serif">{t}</h3>
                <p>{d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <ProcessScroll />

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <SplitText as="h2" className="serif h-1" text="What we promise in writing." />
            <Reveal><p>These are in every Halden Row contract. Visit the studio by appointment, or call {studio.phone}.</p></Reveal>
          </div>
          <div className="commitments">
            {commitments.map(([t, d], i) => (
              <Reveal key={t} delay={i * 0.06}><strong>{t}</strong><span>{d}</span></Reveal>
            ))}
          </div>
          <Reveal><div style={{ marginTop: 60 }}><Link href="/quote" className="btn">Request a quote <span className="arrow"><Arrow size={12} /></span></Link></div></Reveal>
        </div>
      </section>
    </>
  )
}
