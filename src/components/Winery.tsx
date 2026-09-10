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
 * Dubina je „≈20" NAMJERNO, i to je odluka koja se ne mijenja: njihov vlastiti
 * web si protuslovi (About pise 18–25 m, Visit Us pise 14 m), pa se NI JEDNA od
 * te dvije objavljene brojke ne koristi. Kratko sam bio stavio 18–25 jer sam ju
 * nasao na njihovom About-u — to je bilo pogadanje jedne strane spora, ne
 * potvrda. Trajanje i temperatura su potvrdeni u vise izvora.
 */
const FIGURES = [
  { n: '≈20', l: 'metres down' },
  { n: '700', l: 'days below' },
  { n: '14–16', l: 'degrees, all year' },
]

export default function Winery() {
  return (
    <Station data={S} side="l" style={{ paddingBlock: 'var(--sec-y)' }}>
      <div className="ed-in relative z-10">
        <p className="data-label text-gold">{S.light}</p>

        <h2 id={`${S.id}-h`} className="t-plate mt-[var(--s-5)] max-w-[26ch] text-ivory">
          It is the Pelješac peninsula — or as we like to call it, wine paradise.
        </h2>

        <div className="mt-[var(--sec-y-tight)] grid gap-[var(--s-8)] md:grid-cols-[1.05fr_.95fr] md:items-start">
          <div>
            <p className="t-body text-ivory/70">
              On the Adriatic coast, Croatia, there is a place where our story begins. Pelješac is
              the place in Croatia where you can find excellent wines, such as Dingač or Plavac
              Mali, that are famous all over the world.
            </p>
            <p className="t-body mt-[var(--s-4)] text-ivory/70">
              Apart from Pelješac and wines, there is one more gift of nature that is central to
              our story – it is the sea – the deep, crystal blue, Adriatic that holds treasures and
              mysteries. Give us a visit while in Dubrovnik.
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
                Read More
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
