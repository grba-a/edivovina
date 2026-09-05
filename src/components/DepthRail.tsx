'use client'

import { useSyncExternalStore } from 'react'
import { subscribeDepth, getDepthM } from '@/lib/stage'
import { STATIONS, MAX_M } from '@/data/stations'

/** „12,5" — europski zarez, rucno. Kroz Intl bi ovisilo o CLDR-u runtimea. */
const m1 = (n: number) => n.toFixed(1).replace('.', ',')

/**
 * TRAKA DUBINE — navigacija, ne ukras.
 *
 * Prije je bio dubinomjer: crtice koje pokazuju gdje si. Sad su to POSTAJE i
 * mogu se kliknuti. Dubina je jedina koordinata koju stranica ima, pa je i
 * jedini razuman izbornik; ista tablica koja vodi amforu (data/stations.ts)
 * ispisuje i ovu traku, pa se ne mogu raziti.
 *
 * Brojac cita IZMJERENU dubinu iz stage.ts, ne sirovi scroll — zato se, kad
 * skrolas na „−12 m", tocka poklopi s oznakom i brojac pokaze 12,0.
 *
 * Skriven ispod 1024px: uz sadrzaj sirine ekrana nema mjesta za bocnu traku, a
 * poluprozirna traka preko teksta je gora od nikakve.
 */
export default function DepthRail() {
  const m = useSyncExternalStore(subscribeDepth, getDepthM, () => 0)
  const active = STATIONS.reduce((best, s, i) => (m >= s.m - 1.6 ? i : best), 0)

  return (
    <nav
      aria-label="Dubina"
      className="pointer-events-none fixed right-[var(--s-5)] top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-[var(--s-3)] lg:flex"
    >
      <p className="t-title tnum text-gold" aria-live="polite">
        −{m1(m)} m
      </p>

      <div className="relative flex">
        <ol className="pointer-events-auto relative mr-[var(--s-3)] w-[9rem] list-none">
          {STATIONS.map((s, i) => (
            <li
              key={s.id}
              className="absolute right-0 -translate-y-1/2"
              style={{ top: `${(s.m / MAX_M) * 100}%` }}
            >
              <a
                href={`#${s.id}`}
                className={`data-label block whitespace-nowrap py-[var(--s-1)] text-right transition-colors duration-200 ${
                  i === active ? 'text-gold' : 'text-ivory/40 hover:text-ivory'
                }`}
                style={{ fontSize: '0.5rem' }}
                aria-current={i === active ? 'true' : undefined}
              >
                −{s.m} m · {s.name}
              </a>
            </li>
          ))}
        </ol>

        <div className="ed-gauge-track" style={{ ['--ed-gauge-h' as string]: '15rem' }}>
          <div className="ed-gauge-fill" />
        </div>
      </div>

      <p className="data-label tnum text-ivory/35" style={{ fontSize: '0.5rem' }}>
        dan {Math.round((m / MAX_M) * 700)} / 700
      </p>
    </nav>
  )
}
