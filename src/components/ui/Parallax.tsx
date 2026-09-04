'use client'

import { useEffect, useRef } from 'react'

/**
 * Blagi parallax na full-bleed kadru. GSAP je ovdje opravdan jer efekt visi o
 * poziciji ELEMENTA. Pise samo --py; sam transform je u CSS-u.
 *
 * Na mobitelu je ISKLJUCEN: matchMedia gasi granu pod 768px. Parallax na
 * fotki od pola ekrana je na mobilnom GPU-u cista cijena bez koristi.
 */
export default function Parallax({
  children,
  className = '',
  amount = 8,
}: {
  children: React.ReactNode
  className?: string
  amount?: number
}) {
  const el = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = el.current
    if (!node) return

    let ctx: { revert: () => void } | null = null
    let cancelled = false

    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([{ gsap }, { ScrollTrigger }]) => {
      if (cancelled) return
      gsap.registerPlugin(ScrollTrigger)
      const mm = gsap.matchMedia()
      mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          node,
          { '--py': `${amount}%` },
          {
            '--py': `${-amount}%`,
            ease: 'none',
            scrollTrigger: { trigger: node, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        )
      })
      ctx = mm
    })

    return () => {
      cancelled = true
      ctx?.revert()
    }
  }, [amount])

  return (
    <div ref={el} className={`ed-px ${className}`}>
      {children}
    </div>
  )
}
