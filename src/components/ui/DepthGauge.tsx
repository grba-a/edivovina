'use client'

import { useDescent } from '@/lib/useDescent'
import { CHAPTERS, chapterAt, depthLabel, daysLabel, MAX_DAYS } from '@/data/chapters'

export default function DepthGauge() {
  const p = useDescent()
  const ch = chapterAt(p)

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed right-5 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-end gap-3 lg:flex"
    >
      <div className="data-label text-ivory/45">{ch.index} / {ch.label}</div>

      <div className="flex gap-3" style={{ height: '13rem' }}>
        <div className="flex flex-col justify-between py-px">
          {CHAPTERS.map((c) => (
            <span
              key={c.id}
              className="data-label leading-none transition-colors duration-300"
              style={{
                fontSize: '0.5rem',
                color: p >= c.p ? 'var(--color-clay)' : 'rgba(232,217,198,0.22)',
              }}
            >
              {c.index}
            </span>
          ))}
        </div>
        <div className="ed-gauge-track">
          <div className="ed-gauge-fill" />
        </div>
      </div>

      <div className="text-right">
        <div className="font-sans tnum text-lg text-gold">{depthLabel(p)}</div>
        <div className="data-label text-ivory/40" style={{ fontSize: '0.5625rem' }}>
          day {daysLabel(p)} / {MAX_DAYS}
        </div>
      </div>
    </div>
  )
}
