'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Brojka koja se prebroji JEDNOM kad ude u kadar.
 *
 * Tri stvari koje se ovdje tiho pokvare i zato su rijesene eksplicitno:
 *  1. SSR renderira KONACNU brojku, nikad nulu — nula je nula za crawlera,
 *     za citatelja bez JS-a i za cijeli prvi paint.
 *  2. Cormorant nema tabularne znamenke, pa brojka dok raste gura vlastitu
 *     oznaku. Nevidljiva kopija konacnog stringa u istoj grid celiji drzi
 *     kutiju na zavrsnoj sirini.
 *  3. prefers-reduced-motion znaci BEZ pokreta, ne brzi count.
 */
export default function CountUp({
  to,
  label,
  suffix = '',
  group = true,
}: {
  to: number
  label: string
  suffix?: string
  group?: boolean
}) {
  // Europski format, rucno: 1.177 (tocka za tisucice). Kroz Intl bi izgled
  // ovisio o CLDR podacima runtimea. Grupiranje je odluka PO BROJCI — 700 je
  // broj, 2011 je godina i ne smije nikad postati "2.011".
  const fmt = (n: number) =>
    (group && n >= 1000 ? String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.') : String(n)) + suffix

  const final = fmt(to)
  const [shown, setShown] = useState(final)
  const box = useRef<HTMLDivElement>(null)
  const done = useRef(false)

  useEffect(() => {
    const el = box.current
    if (!el || done.current) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || done.current) return
        done.current = true
        io.disconnect()

        const DUR = 1500
        const t0 = performance.now()
        const tick = (now: number) => {
          const p = Math.min(1, (now - t0) / DUR)
          const eased = 1 - Math.pow(1 - p, 3)
          setShown(fmt(Math.round(to * eased)))
          if (p < 1) requestAnimationFrame(tick)
          else setShown(final)
        }
        requestAnimationFrame(tick)
      },
      { threshold: 0.5 },
    )
    io.observe(el)
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [to, final])

  return (
    <div ref={box}>
      {/* Nevidljiva kopija drzi celiju na konacnoj sirini */}
      <div className="grid font-display text-[clamp(2rem,3.6vw,3rem)] leading-none text-gold">
        <span className="invisible col-start-1 row-start-1" aria-hidden>
          {final}
        </span>
        <span className="col-start-1 row-start-1">{shown}</span>
      </div>
      {/* Oznaka ide ISPOD brojke: sa strane bi tri brojke razlicitih sirina
          dale tri neuredna reda. */}
      <dt className="data-label mt-3 block text-ivory/40" style={{ fontSize: '0.5625rem' }}>
        {label}
      </dt>
    </div>
  )
}
