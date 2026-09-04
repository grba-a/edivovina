'use client'

import { useEffect, useRef } from 'react'

/**
 * Maskirani reveal na scrollu. GSAP ScrollTrigger je ovdje opravdan jer efekt
 * stvarno visi o poziciji ELEMENTA — za razliku od hero introa, koji je na
 * ucitavanju i zato ide u cisti CSS.
 *
 * GSAP dira samo --r; sam clip-path je u descent.css i prenosiv je.
 * Bazno stanje je --r: 1 (vidljivo) pa bez JS-a nista ne ostane skriveno.
 */
export default function Reveal({
  children,
  className = '',
  from = 0.12,
}: {
  children: React.ReactNode
  className?: string
  from?: number
}) {
  const el = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = el.current
    if (!node) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let ctx: { revert: () => void } | null = null
    let cancelled = false

    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([{ gsap }, { ScrollTrigger }]) => {
      if (cancelled) return
      gsap.registerPlugin(ScrollTrigger)
      ctx = gsap.context(() => {
        gsap.fromTo(
          node,
          { '--r': from },
          {
            '--r': 1,
            ease: 'power2.out',
            scrollTrigger: { trigger: node, start: 'top 88%', end: 'top 42%', scrub: 0.6 },
          },
        )
      })
    })

    return () => {
      cancelled = true
      ctx?.revert()
    }
  }, [from])

  return (
    <div ref={el} className={`ed-reveal ${className}`}>
      {children}
    </div>
  )
}
