import type { Metadata } from 'next'
import { Suspense } from 'react'
import { QuoteWizard } from '@/components/QuoteWizard'
import { Reveal, SplitText } from '@/components/motion'

export const metadata: Metadata = {
  title: 'Request a quote',
  description: 'Five short steps: tell us about your project and see a planning range as you go. A designer replies within two business days.',
}

export default function QuotePage() {
  return (
    <>
      <section className="page-head" style={{ paddingBottom: 50 }}>
        <div className="wrap">
          <Reveal><span className="label">Request a quote</span></Reveal>
          <SplitText as="h1" className="serif h-1" text="Tell us about your house." />
          <Reveal delay={0.2}><p className="lede">Five short steps. You will see a planning range as you go, and a designer will reply within two business days to book a walkthrough.</p></Reveal>
        </div>
      </section>
      <section className="wrap">
        <Suspense fallback={null}><QuoteWizard /></Suspense>
      </section>
    </>
  )
}
