'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

/**
 * Lijepljena traka za kupnju — najkraci moguci put do narudzbe.
 *
 * Dva pravila naucena na tesi nacin:
 *  1. Prag "izvan hera" NIJE innerHeight - N. Promatramo sam hero
 *     IntersectionObserverom, jer se innerHeight na mobilnom mijenja kad se
 *     sakrije URL traka.
 *  2. Traka se MORA sakriti kad je zavrsni CTA u kadru, inace mu sjedne na
 *     glavu. Zato drugi observer na [data-close-cta].
 */
export default function BuyBar() {
  const [show, setShow] = useState(false)
  const pastHero = useRef(false)
  const atClose = useRef(false)

  useEffect(() => {
    const hero = document.getElementById('surface')
    const close = document.querySelector('[data-close-cta]')
    if (!hero) return

    const apply = () => setShow(pastHero.current && !atClose.current)

    const io1 = new IntersectionObserver(
      ([e]) => {
        pastHero.current = !e.isIntersecting
        apply()
      },
      { threshold: 0, rootMargin: '-45% 0px 0px 0px' },
    )
    io1.observe(hero)

    let io2: IntersectionObserver | null = null
    if (close) {
      io2 = new IntersectionObserver(
        ([e]) => {
          atClose.current = e.isIntersecting
          apply()
        },
        { threshold: 0, rootMargin: '0px 0px -10% 0px' },
      )
      io2.observe(close)
    }

    return () => {
      io1.disconnect()
      io2?.disconnect()
    }
  }, [])

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-3 pb-3 transition-all duration-[380ms] md:px-5 md:pb-5"
      style={{
        opacity: show ? 1 : 0,
        transform: show ? 'translateY(0)' : 'translateY(120%)',
        paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))',
      }}
      aria-hidden={!show}
    >
      <div className="mx-auto flex w-full max-w-[92rem] items-center gap-3 border border-gold/25 bg-abyss/92 p-2.5 backdrop-blur-[2px] md:gap-6 md:p-3">
        <div className="min-w-0 flex-1 pl-2 md:pl-4">
          <p className="data-label text-gold" style={{ fontSize: '0.5rem' }}>
            One wine, three lives
          </p>
          {/* Cijena je vlastiti element sa shrink-0 — u istom <p> ju truncate
              odreze prvu, a cijena je zadnje sto smije nestati. */}
          <div className="flex items-baseline gap-2">
            <span className="min-w-0 truncate font-display text-sm leading-tight text-ivory md:text-base">
              Navis Mysterium TRIS
            </span>
            <span className="tnum shrink-0 text-sm text-gold md:text-base">€536</span>
          </div>
        </div>
        <Link
          href="/wines/navis-mysterium-tris"
          tabIndex={show ? 0 : -1}
          className="data-label pointer-events-auto shrink-0 bg-gold px-4 py-3.5 text-abyss transition-colors duration-200 hover:bg-ivory md:px-7"
        >
          Take the set
        </Link>
      </div>
    </div>
  )
}
