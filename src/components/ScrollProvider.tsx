'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { startDescent } from '@/lib/descent'

/**
 * Lenis je izricito zatrazen i ovdje ima stvarni razlog: bez njega scrub
 * spusta stepenicasto trza na trackpadu. Izoliran je u jednu konstantu —
 * ENABLE_LENIS = false vraca nativan scroll bez ijedne druge izmjene.
 */
const ENABLE_LENIS = true

export default function ScrollProvider() {
  const pathname = usePathname()
  const isHome = pathname === '/'

  useEffect(() => {
    // Na podrutama spust stoji na fiksnoj srednjoj vodi — scroll kroz kontakt
    // ne smije korisnika odvesti na 25 m.
    if (!isHome) {
      document.documentElement.style.setProperty('--descent', '0.52')
    }
    const stopDescent = isHome ? startDescent() : () => {}

    if (!ENABLE_LENIS) return stopDescent
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return stopDescent

    let lenis: { raf: (t: number) => void; destroy: () => void } | null = null
    let frame = 0
    let cancelled = false

    import('lenis').then(({ default: Lenis }) => {
      if (cancelled) return
      const instance = new Lenis({ duration: 1.05, smoothWheel: true, touchMultiplier: 1.6 })
      lenis = instance
      // Playwright skript skrola KROZ ovu instancu; native scrollTo raspara
      // Lenis i ScrollTrigger pa pinnane sekcije izgledaju kao prazan prostor.
      ;(window as unknown as Record<string, unknown>).__lenis = instance
      instance.on('scroll', () => window.dispatchEvent(new Event('lenis-scroll')))
      const loop = (t: number) => {
        instance.raf(t)
        frame = requestAnimationFrame(loop)
      }
      frame = requestAnimationFrame(loop)
    })

    return () => {
      cancelled = true
      if (frame) cancelAnimationFrame(frame)
      lenis?.destroy()
      delete (window as unknown as Record<string, unknown>).__lenis
      stopDescent()
    }
  }, [isHome])

  return null
}
