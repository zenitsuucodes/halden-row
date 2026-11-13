import type { Metadata } from 'next'
import { Suspense } from 'react'
import { ProjectBrowser } from '@/components/ProjectBrowser'
import { Reveal, SplitText } from '@/components/motion'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Kitchens, bathrooms, basements, whole-home renovations and additions across Toronto. Filter by project type and see the drawing behind every build.',
}

export default function ProjectsPage() {
  return (
    <>
      <section className="page-head">
        <div className="wrap">
          <Reveal><span className="label">Projects · Toronto</span></Reveal>
          <SplitText as="h1" className="serif h-display" text="Built, not rendered." />
          <Reveal delay={0.2}><p className="lede">Every project here started as a set of measured drawings. Hover a photo to see it, or open a project for the full story.</p></Reveal>
        </div>
      </section>
      <section className="wrap" style={{ paddingBottom: 160 }}>
        <Suspense fallback={null}>
          <ProjectBrowser />
        </Suspense>
      </section>
    </>
  )
}
