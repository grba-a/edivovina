'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import DepthGauge from './ui/DepthGauge'

const NAV = [
  { href: '/wines', label: 'Wines' },
  { href: '/story', label: 'Story' },
  { href: '/visit', label: 'Visit' },
  { href: '/contact', label: 'Contact' },
]

/**
 * Trajni sloj: vodeni stupac + nav + dubinomjer.
 *
 * Wordmark je tipografski, ne njihov logo. Edivo-Logo-300px.png je crtan za
 * svijetlu podlogu i na abisu prakticki nestane; tipografski wordmark je
 * bolji od popravljanja datoteke.
 */
export default function Chrome() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // Fragment link koji ne skrola drugi put: jedan delegirani slusac popravi sve.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null
      if (!a) return
      const id = a.getAttribute('href')!.slice(1)
      const el = document.getElementById(id)
      if (!el) return
      e.preventDefault()
      const lenis = (window as unknown as { __lenis?: { scrollTo: (t: HTMLElement) => void } }).__lenis
      if (lenis) lenis.scrollTo(el)
      else el.scrollIntoView({ behavior: 'smooth' })
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  return (
    <>
      <div className="ed-water" aria-hidden />
      <div className="ed-shafts" aria-hidden>
        <div className="ed-shaft" />
        <div className="ed-shaft" />
        <div className="ed-shaft" />
        <div className="ed-shaft" />
      </div>
      <div className="ed-snow" aria-hidden>
        <div className="ed-snow-layer" />
        <div className="ed-snow-layer" />
        <div className="ed-snow-layer" />
      </div>
      <div className="ed-floor" aria-hidden />

      <header className="fixed inset-x-0 top-0 z-40">
        {/* Zastitni gradijent putuje s trakom, ne stoji nad hero filmom */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-28"
          style={{ background: 'linear-gradient(to bottom, rgba(4,25,28,0.62), rgba(4,25,28,0))' }}
        />
        <div className="relative mx-auto flex max-w-[92rem] items-center justify-between px-5 py-4 md:px-8 md:py-5">
          {/* py-2 diže hit area s 28 na 44px — vizualno nevidljivo */}
          <Link href="/" aria-label="Edivo Vina — home" className="flex items-center gap-3 py-2">
            <Image
              src="/brand/edivo-wordmark.png"
              alt="Edivo Vina"
              width={592}
              height={230}
              priority
              className="h-7 w-auto md:h-9"
            />
            <span
              className="data-label hidden border-l border-ivory/20 pl-3 text-ivory/45 sm:inline"
              style={{ fontSize: '0.5rem' }}
            >
              Pelješac
            </span>
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="data-label text-ivory/60 transition-colors duration-200 hover:text-gold"
              >
                {n.label}
              </Link>
            ))}
            <Link
              href="/wines"
              className="data-label border border-gold/45 px-4 py-2 text-gold transition-colors duration-200 hover:bg-gold hover:text-abyss"
            >
              Buy a bottle
            </Link>
          </nav>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="data-label -mr-2 flex h-11 w-11 items-center justify-center text-ivory/80 md:hidden"
          >
            <span className="relative block h-3 w-5">
              <span
                className="absolute left-0 block h-px w-full bg-current transition-transform duration-300"
                style={{ top: open ? '6px' : '0', rotate: open ? '45deg' : '0deg' }}
              />
              <span
                className="absolute left-0 block h-px w-full bg-current transition-transform duration-300"
                style={{ top: open ? '6px' : '11px', rotate: open ? '-45deg' : '0deg' }}
              />
            </span>
          </button>
        </div>

        {open && (
          <div className="relative border-t border-ivory/10 bg-abyss/95 px-5 py-4 md:hidden">
            <nav className="flex flex-col">
              {NAV.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className="data-label border-b border-ivory/8 py-4 text-ivory/75 last:border-0"
                >
                  {n.label}
                </Link>
              ))}
              <Link
                href="/wines"
                onClick={() => setOpen(false)}
                className="data-label mt-4 border border-gold/45 px-4 py-3 text-center text-gold"
              >
                Buy a bottle
              </Link>
            </nav>
          </div>
        )}
      </header>

      {pathname === '/' && <DepthGauge />}
    </>
  )
}
