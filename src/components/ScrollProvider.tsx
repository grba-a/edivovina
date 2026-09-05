'use client'

import { useEffect } from 'react'
import { startDescent } from '@/lib/descent'
import { startStage } from '@/lib/stage'

/**
 * Pokretac spusta i Lenis.
 *
 * Lenis je izricito zatrazen i ovdje ima stvarni razlog: bez njega scrub
 * spusta stepenicasto trza na trackpadu. Izoliran je u jednu konstantu —
 * ENABLE_LENIS = false vraca nativan scroll bez ijedne druge izmjene.
 *
 * NAPOMENA za kasnije: kad se vrate podstranice, spust tamo treba stajati na
 * fiksnoj srednjoj vodi (--descent: 0.52). Scroll kroz kontakt ne smije
 * korisnika odvesti na 25 m. Sada postoji samo naslovnica, pa spust ide uvijek.
 */
const ENABLE_LENIS = true

export default function ScrollProvider() {
  useEffect(() => {
    const stopDescent = startDescent()
    const stopStage = startStage()

    const stopAll = () => { stopStage(); stopDescent() }

    if (!ENABLE_LENIS) return stopAll
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return stopAll

    let lenis: { raf: (t: number) => void; destroy: () => void } | null = null
    let frame = 0
    let cancelled = false

    import('lenis').then(({ default: Lenis }) => {
      if (cancelled) return
      const instance = new Lenis({ duration: 1.05, smoothWheel: true, touchMultiplier: 1.6 })
      lenis = instance
      // Playwright skript skrola KROZ ovu instancu; native scrollTo raspara
      // Lenis pa animacija izgleda kao da stoji.
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
      stopAll()
    }
  }, [])

  return null
}
