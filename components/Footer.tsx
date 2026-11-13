import Link from 'next/link'
import { Mark } from './icons'
import { services, studio } from '@/lib/data'

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-top">
          <div>
            <Mark className="brand-mark" />
            <p className="serif" style={{ fontSize: 28, lineHeight: 1.15, margin: '22px 0 0', maxWidth: '16ch' }}>
              {studio.tagline}.
            </p>
          </div>
          <div>
            <h4>Studio</h4>
            <ul>
              <li>{studio.studio}</li>
              <li>{studio.hours}</li>
              <li><a href={`tel:${studio.phoneHref}`}>{studio.phone}</a></li>
            </ul>
          </div>
          <div>
            <h4>Services</h4>
            <ul>
              {services.map((s) => <li key={s.key}><Link href={`/services#${s.key}`}>{s.title}</Link></li>)}
            </ul>
          </div>
          <div>
            <h4>Explore</h4>
            <ul>
              <li><Link href="/projects">Projects</Link></li>
              <li><Link href="/studio">Studio and process</Link></li>
              <li><Link href="/quote">Request a quote</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-word" aria-hidden="true">Halden Row</div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} {studio.fullName}. Licensed and insured in Ontario.</span>
          <a href={studio.credit.href}>{studio.credit.label}</a>
        </div>
      </div>
    </footer>
  )
}
