import Link from 'next/link'
import Plate from './record/Plate'
import Silhouette from './record/Silhouette'
import ScaleBar from './record/ScaleBar'
import { bySlug, THE_THREE } from '@/data/wines'

/**
 * TIPOLOGIJA — potpisni uredaj svijeta nalaza.
 *
 * Tri mjerene siluete istog vina, jedna uz drugu: podrum, more u staklu, more u
 * glini. To NIJE ilustracija argumenta, to JE argument — jedini nacin da se
 * vidi sto je more napravilo, i jedino sto opravdava €536.
 *
 * Kako je katalog stavljen prvi, ovo je POTVRDA a ne uvod.
 */
const COLS = [
  { slug: THE_THREE[0], word: 'Cellar', sil: 'bottle' as const, ctx: 'Janjina', dur: '0 d' },
  { slug: THE_THREE[1], word: 'Sea, in glass', sil: 'bottle' as const, ctx: '−25 m', dur: '700 d' },
  { slug: THE_THREE[2], word: 'Sea, in clay', sil: 'amphora' as const, ctx: '−25 m', dur: '700 d' },
]

const eur = (n: number) => '€' + (Number.isInteger(n) ? String(n) : n.toFixed(2).replace('.', ','))

export default function Typology() {
  const tris = bySlug('navis-mysterium-tris')!

  return (
    <section id="typology" style={{ paddingBottom: 'var(--sec-y)' }} className="relative z-10 px-5 md:px-8">
      <div className="mx-auto w-full max-w-[92rem]">
        <Plate enter className="overflow-hidden">
          <div
            className="flex flex-wrap items-baseline justify-between gap-[var(--s-3)] border-b border-plate-rule-strong"
            style={{ padding: 'var(--s-3) var(--s-4)' }}
          >
            <span className="t-stamp text-plate-ink/50">Typology · one vintage, one barrel</span>
            <span className="t-stamp text-plate-ink/40">Plate III</span>
          </div>

          <div style={{ padding: 'var(--s-5) var(--s-4)' }}>
            <h2 className="t-plate max-w-[24ch] text-plate-ink">
              The same wine, measured three ways.
            </h2>
            <p className="t-body mt-[var(--s-4)] text-plate-ink/65">
              Split on the same afternoon from the same barrel. One stayed in the cellar. One went
              down in glass. One went down sealed in clay. Everything else about them is identical,
              which is the only reason the comparison means anything.
            </p>

            {/* --- tri mjerene siluete, na ISTOJ osnovnoj liniji --- */}
            <ul className="mt-[var(--s-7)] grid grid-cols-3 gap-[var(--s-3)] md:gap-[var(--s-6)]">
              {COLS.map((c, i) => {
                const w = bySlug(c.slug)!
                return (
                  <li key={c.slug} className="flex flex-col">
                    <div className="flex h-[9rem] items-end justify-center text-plate-ink md:h-[15rem]">
                      <Silhouette
                        name={c.sil}
                        draw
                        delay={160 + i * 140}
                        className="h-full w-auto"
                      />
                    </div>
                    <div className="mt-[var(--s-4)] border-t border-plate-rule-strong pt-[var(--s-3)]">
                      <p className="t-stamp text-plate-ink/45">{String(i + 1).padStart(2, '0')}</p>
                      <p className="t-title mt-[var(--s-2)] text-plate-ink">{c.word}</p>
                      <dl className="t-field mt-[var(--s-3)] space-y-[var(--s-1)] text-plate-ink/70">
                        <div className="flex justify-between gap-[var(--s-2)]">
                          <dt className="t-stamp text-plate-ink/40">CTX</dt>
                          <dd>{c.ctx}</dd>
                        </div>
                        <div className="flex justify-between gap-[var(--s-2)]">
                          <dt className="t-stamp text-plate-ink/40">DUR</dt>
                          <dd>{c.dur}</dd>
                        </div>
                        <div className="flex justify-between gap-[var(--s-2)]">
                          <dt className="t-stamp text-plate-ink/40">EUR</dt>
                          <dd className="tnum">{eur(w.price)}</dd>
                        </div>
                      </dl>
                    </div>
                  </li>
                )
              })}
            </ul>

            {/* --- cijena i akcija u istom redu kao mjerilo, kao u svakom zapisu --- */}
            <div className="mt-[var(--s-7)] flex flex-wrap items-end justify-between gap-[var(--s-4)] border-t border-plate-rule-strong pt-[var(--s-4)]">
              <div>
                <ScaleBar />
                <p className="t-stamp mt-[var(--s-3)] text-plate-ink/50">
                  {tris.name} · {tris.volume} · pinewood case
                </p>
              </div>
              <Link
                href={`/wines/${tris.slug}`}
                className="pressable flex items-baseline gap-[var(--s-4)]"
              >
                <span className="t-plate tnum text-plate-ink">{eur(tris.price)}</span>
                <span className="t-stamp bg-stamp px-[var(--s-4)] py-[var(--s-3)] text-plate">
                  Take all three
                </span>
              </Link>
            </div>
          </div>
        </Plate>
      </div>
    </section>
  )
}
