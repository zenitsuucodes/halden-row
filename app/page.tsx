import Link from 'next/link'
import { Hero } from '@/components/Hero'
import { FeatureProject } from '@/components/FeatureProject'
import { CompareSlider } from '@/components/CompareSlider'
import { ServicesList } from '@/components/ServicesList'
import { ProcessScroll } from '@/components/ProcessScroll'
import { ParallaxImage, Reveal, SplitText } from '@/components/motion'
import { Arrow } from '@/components/icons'
import { commitments, projects } from '@/lib/data'

const featured = ['riverdale-infill', 'carlaw-basement', 'roncesvalles-ensuite'].map((s) => projects.find((p) => p.slug === s)!)
const marquee = ['Kitchens', 'Basements', 'Additions', 'Bathrooms', 'Whole homes', 'Millwork', 'Underpinning', 'Permits']

export default function Home() {
  return (
    <>
      <Hero />

      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[...marquee, ...marquee].map((m, i) => <span key={i}>{m}</span>)}
        </div>
      </div>

      <section className="section">
        <div className="wrap">
          <div className="statement-grid">
            <div>
              <Reveal><span className="label">The studio</span></Reveal>
              <SplitText as="h2" className="serif statement" text="We draw it, price it and build it, with the same team the whole way through." delay={0.1} />
            </div>
            <Reveal delay={0.2}>
              <p className="lede">Most renovations go wrong in the gaps between designer, contractor and trades. We close those gaps. One studio, one fixed price, one person on site who knows your project inside out.</p>
            </Reveal>
          </div>
          <div className="commitments">
            {commitments.map(([t, d], i) => (
              <Reveal key={t} delay={i * 0.06}>
                <strong>{t}</strong>
                <span>{d}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }} aria-labelledby="work-title">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="label">Selected projects</span>
              <SplitText as="h2" className="serif h-1" text="Recent work" />
            </div>
            <Reveal><p>Hover any photo to see the drawing it started as. Every project begins with measured plans, and every plan gets built.</p></Reveal>
          </div>
          <div className="feature-list">
            {featured.map((p, i) => <FeatureProject key={p.slug} project={p} index={i} />)}
          </div>
          <Reveal className="" delay={0.1}>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 90 }}>
              <Link href="/projects" className="btn ghost">All projects <span className="arrow"><Arrow size={12} /></span></Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--paper-2)' }} aria-labelledby="compare-title">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="label">Drawing to built</span>
              <SplitText as="h2" className="serif h-1" text="What we draw is what you get." />
            </div>
            <Reveal><p>Drag across the Beach Hill Residence. The drawing on the left was signed off before demolition started. The photo on the right is the finished room.</p></Reveal>
          </div>
          <Reveal y={60}>
            <CompareSlider slug="beach-hill-home" title="Beach Hill Residence living room" />
          </Reveal>
        </div>
      </section>

      <section className="section dark" aria-labelledby="services-title">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="label">Services</span>
              <SplitText as="h2" className="serif h-1" text="Five kinds of project. One way of working." />
            </div>
            <Reveal><p>Planning ranges include design, permits and construction. Your fixed price comes after drawings, so it reflects your actual house.</p></Reveal>
          </div>
          <ServicesList />
        </div>
      </section>

      <ProcessScroll />

      <section className="cta" aria-labelledby="cta-title">
        <div className="cta-bg"><ParallaxImage src="/images/hero-dusk.webp" alt="" className="" strength={10} /></div>
        <div className="wrap">
          <Reveal><span className="label" style={{ color: 'rgba(243,239,231,.7)' }}>Start with a conversation</span></Reveal>
          <SplitText as="h2" className="serif h-1" text="Tell us about your house." />
          <Reveal delay={0.2}>
            <p className="lede" style={{ color: 'rgba(243,239,231,.8)', margin: '0 0 30px' }}>Five short steps, a planning range on screen as you go, and a reply from a real person within two business days.</p>
            <Link href="/quote" className="btn light">Request a quote <span className="arrow"><Arrow size={12} /></span></Link>
          </Reveal>
        </div>
      </section>
    </>
  )
}
