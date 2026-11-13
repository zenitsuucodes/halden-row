'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Arrow, Mark } from './icons'
import { studio } from '@/lib/data'

const links = [
  { href: '/projects', label: 'Projects' },
  { href: '/services', label: 'Services' },
  { href: '/studio', label: 'Studio' },
]

export function Header() {
  const pathname = usePathname()
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)
  const darkTop = pathname.startsWith('/projects/')

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
  }, [open])

  return (
    <>
      <header className={`site-header ${solid ? 'is-solid' : ''} ${darkTop ? 'on-dark' : ''}`}>
        <div className="wrap header-inner">
          <Link href="/" className="brand" aria-label={`${studio.fullName}, home`}>
            <Mark className="brand-mark" />
            <span>Halden Row<small>Renovation Studio</small></span>
          </Link>
          <nav className="nav" aria-label="Main">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="link" aria-current={pathname.startsWith(l.href) ? 'page' : undefined}>
                {l.label}
              </Link>
            ))}
            <a className="link" href={`tel:${studio.phoneHref}`}>{studio.phone}</a>
            <Link href="/quote" className="btn">Request a quote <span className="arrow"><Arrow size={12} /></span></Link>
            <button className="menu-btn" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(true)}><span /></button>
          </nav>
        </div>
      </header>
      <AnimatePresence>
        {open && (
          <motion.div
            className="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.6 }}
          >
            <button className="close" aria-label="Close menu" onClick={() => setOpen(false)}>×</button>
            <nav aria-label="Mobile">
              {[{ href: '/', label: 'Home' }, ...links, { href: '/quote', label: 'Request a quote' }].map((l, i) => (
                <motion.div key={l.href} initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 + i * 0.06, duration: 0.6 }}>
                  <Link href={l.href} className="serif">{l.label}</Link>
                </motion.div>
              ))}
            </nav>
            <div className="meta">
              <a href={`tel:${studio.phoneHref}`}>{studio.phone}</a>
              <span>{studio.hours}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
