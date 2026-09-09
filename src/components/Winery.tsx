import Frame from '@/components/ui/Frame'
import Link from 'next/link'
import Station from '@/components/station/Station'
import { station } from '@/data/stations'

const S = station('winery')

/**
 * 6 METARA — VINARIJA. Amfore nema.
 *
 * Ovdje se cita, pa je ekran cista tipografija i jedan kadar koji PROBIJA
 * lijevi rub. Predmet se vraca tek na dvanaest metara.
 *
 * Brojke su samo one koje su provjerene kroz nezavisne izvore: dubina ide kao
 * Dubina je NJIHOVA brojka: /about-us i callout na dnu iste stranice oba pisu
 * „18-25 meters". Prije je ovdje stajalo „≈20" jer se izvori nisu slagali —
 * sad se ne moramo pogadati. Trajanje i temperatura su potvrdeni u vise izvora.
 */
const FIGURES = [
  { n: '18–25', l: 'metres down' },
  { n: '700', l: 'days below' },
  { n: '14–16', l: 'degrees, all year' },
]

export default function Winery() {
  return (
    <Station data={S} side="l" style={{ paddingBlock: 'var(--sec-y)' }}>
      <div className="ed-in relative z-10">
        <p className="data-label text-gold">{S.light}</p>

        <h2 id={`${S.id}-h`} className="t-plate mt-[var(--s-5)] max-w-[15ch] text-ivory">
          We stopped building cellars in 2013.
        </h2>

        <div className="mt-[var(--sec-y-tight)] grid gap-[var(--s-8)] md:grid-cols-[1.05fr_.95fr] md:items-start">
          <div>
            <p className="t-body text-ivory/70">
              The first amphorae went down into a fishing boat that sank more than thirty years
              ago, held under concession. It took a year of failed seals before the sea stayed
              outside.
            </p>
            <p className="t-body mt-[var(--s-4)] text-ivory/70">
              The clay is from Petrinja, the wrought-iron cradle from Sisak, the pinewood box
              from Varaždin. Nothing from far away — and neither is the wine.
            </p>

            <dl className="mt-[var(--s-7)] grid grid-cols-3 gap-[var(--s-5)]">
              {FIGURES.map((f) => (
                <div key={f.l}>
                  <dt className="sr-only">{f.l}</dt>
                  <dd>
                    <span className="t-plate tnum block text-ivory" style={{ fontSize: 'clamp(1.6rem, 3.6vw, 2.8rem)' }}>
                      {f.n}
                    </span>
                    <span className="data-label-sm mt-[var(--s-2)] block leading-snug text-ivory/60">
                      {f.l}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-[var(--s-7)] flex flex-wrap items-center gap-[var(--s-4)]">
              <Link
                href="/about"
                className="data-label pressable border border-gold/45 px-[var(--s-5)] py-[var(--s-4)] text-gold transition-colors duration-200 hover:bg-gold hover:text-abyss"
              >
                How it is made
              </Link>
              <Link
                href="/visit"
                className="data-label inline-flex min-h-11 items-center text-ivory/70 transition-colors duration-200 hover:text-gold"
              >
                Visit us →
              </Link>
            </div>
          </div>

          {/* Kadar probija lijevi rub — ne sjedi u kutiji. */}
          <div className="ed-bleed-l">
            <Frame
              name="seabed-pebbles"
              alt="Dozens of encrusted amphorae resting on the seabed"
              sizes="(min-width: 768px) 52vw, 100vw"
              ratio={1.5}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </Station>
  )
}
