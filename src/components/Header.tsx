'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const NAV = [
  { href: '#winery', label: 'Vinarija' },
  { href: '#shop', label: 'Boce' },
  { href: '#press', label: 'Pisali su' },
  { href: '#seabed', label: 'Kontakt' },
]

/**
 * Traka je prozirna SAMO na samom vrhu, gdje stoji nad fotografijom povrsine.
 * Cim krene spust postaje solidna — inace tekst stranice prolazi kroz nju.
 * Poluprozirni paneli su na ovoj stranici pogreska: voda i marine snow prolaze
 * kroz njih i sve izgleda prasno.
 *
 * Wordmark je njihov, zlatni na prozirnom — radi na tamnom, sto je ovdje
 * cijela stranica.
 */
export default function Header() {
  const [open, setOpen] = useState(false)
  const [sunk, setSunk] = useState(false)

  useEffect(() => {
    const onScroll = () => setSunk(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* Fragment link koji ne skrola drugi put: jedan delegirani slusac popravi
     sve, jer Lenis drzi svoj scroll i native skok ga rasklopi. */
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null
      if (!a) return
      const el = document.getElementById(a.getAttribute('href')!.slice(1))
      if (!el) return
      e.preventDefault()
      setOpen(false)
      const lenis = (window as unknown as { __lenis?: { scrollTo: (t: HTMLElement) => void } }).__lenis
      if (lenis) lenis.scrollTo(el)
      else el.scrollIntoView({ behavior: 'smooth' })
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-colors duration-300"
      style={sunk ? { background: 'var(--color-abyss)', borderBottom: '1px solid rgba(255,255,255,0.09)' } : undefined}
    >
      {!sunk && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-28"
          style={{ background: 'linear-gradient(to bottom, rgba(3,20,31,0.6), rgba(3,20,31,0))' }}
        />
      )}

      <div className="relative mx-auto flex max-w-[var(--wrap)] items-center justify-between px-5 py-[var(--s-3)] md:px-8 md:py-[var(--s-4)]">
        <Link href="#surface" aria-label="Edivo Vina — na površinu" className="flex items-center gap-[var(--s-3)] py-[var(--s-2)]">
          <Image
            src="/brand/edivo-wordmark.png"
            alt="Edivo Vina"
            width={592}
            height={230}
            priority
            className="h-7 w-auto md:h-9"
          />
          <span className="data-label hidden border-l border-ivory/20 pl-[var(--s-3)] text-ivory/45 sm:inline" style={{ fontSize: '0.5rem' }}>
            Pelješac
          </span>
        </Link>

        <nav className="hidden items-center gap-[var(--s-7)] md:flex">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="data-label text-ivory/60 transition-colors duration-200 hover:text-gold">
              {n.label}
            </a>
          ))}
          <Link
            href="/wines"
            className="data-label pressable border border-gold/45 px-[var(--s-4)] py-[var(--s-2)] text-gold transition-colors duration-200 hover:bg-gold hover:text-abyss"
          >
            Kupi bocu
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? 'Zatvori izbornik' : 'Otvori izbornik'}
          className="-mr-2 flex h-11 w-11 items-center justify-center text-ivory/80 md:hidden"
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
        <div className="relative border-t border-ivory/10 bg-abyss px-5 py-[var(--s-3)] md:hidden">
          <nav className="flex flex-col">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} className="data-label border-b border-ivory/10 py-[var(--s-4)] text-ivory/75 last:border-0">
                {n.label}
              </a>
            ))}
            <Link href="/wines" className="data-label mt-[var(--s-4)] border border-gold/45 px-[var(--s-4)] py-[var(--s-3)] text-center text-gold">
              Kupi bocu
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
