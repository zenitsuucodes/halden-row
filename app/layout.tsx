import type { Metadata, Viewport } from 'next'
import { Fraunces, Hanken_Grotesk } from 'next/font/google'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { MotionRoot } from '@/components/MotionRoot'
import { studio } from '@/lib/data'
import './globals.css'

const serif = Fraunces({ subsets: ['latin'], variable: '--font-serif', axes: ['opsz', 'SOFT'], style: ['normal', 'italic'] })
const sans = Hanken_Grotesk({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  metadataBase: new URL('https://halden-row.vercel.app'),
  title: { default: 'Halden Row | Renovation Studio, Toronto', template: '%s | Halden Row Renovation Studio' },
  description: 'Design-build renovations for Toronto homes: kitchens, bathrooms, basements, whole-home renovations and additions. Fixed-price contracts and one site lead from start to finish.',
  openGraph: { type: 'website', siteName: studio.fullName, images: ['/og.jpg'] },
  robots: { index: false, follow: false },
  icons: { icon: '/icon.svg' },
}

export const viewport: Viewport = { themeColor: '#f3efe7' }

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'GeneralContractor',
  name: studio.fullName,
  telephone: studio.phone,
  areaServed: 'Toronto, Ontario',
  address: { '@type': 'PostalAddress', addressLocality: 'Toronto', addressRegion: 'ON', addressCountry: 'CA' },
  openingHours: 'Mo-Fr 08:00-17:30',
  knowsAbout: ['Kitchen renovation', 'Bathroom renovation', 'Basement finishing', 'Home additions', 'Whole-home renovation'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-CA" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <a className="skip" href="#main">Skip to content</a>
        <MotionRoot>
          <Header />
          <main id="main">{children}</main>
          <Footer />
        </MotionRoot>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  )
}
