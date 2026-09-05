import Link from 'next/link'
import Plate from './record/Plate'
import Silhouette from './record/Silhouette'
import ScaleBar from './record/ScaleBar'
import { bySlug } from '@/data/wines'

const eur = (n: number) => '€' + (Number.isInteger(n) ? String(n) : n.toFixed(2).replace('.', ','))

/**
 * Zavrsni zapis. Ista na svakoj podstranici — gdje god korisnik zavrsi citati,
 * ponuda je ista i put je jedan klik.
 *
 * Nije "CTA traka" nego ZAPIS s cijenom i akcijom u zadnjem redu, kao svaki
 * drugi na webu.
 */
export default function CtaBand({
  line = 'One wine, measured three ways.',
  sub = 'Cellar, sea and clay from the same barrel — the only way to see what the depth actually did.',
}: {
  line?: string
  sub?: string
}) {
  const tris = bySlug('navis-mysterium-tris')!

  return (
    <section style={{ paddingBottom: 'var(--sec-y)' }} className="relative z-10 px-5 md:px-8">
      <div className="mx-auto w-full max-w-[92rem]">
        <Plate enter>
          <div
            className="flex items-baseline justify-between gap-[var(--s-3)] border-b border-plate-rule-strong"
            style={{ padding: 'var(--s-3) var(--s-4)' }}
          >
            <span className="t-stamp text-plate-ink/50">Start here</span>
            <span className="t-stamp text-stamp">Batch 1–4000</span>
          </div>

          <div className="flex items-start gap-[var(--s-5)]" style={{ padding: 'var(--s-5) var(--s-4)' }}>
            <div className="hidden w-[14%] shrink-0 justify-center text-plate-ink sm:flex">
              <Silhouette name="amphora" draw className="max-h-[11rem] w-full" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="t-title max-w-[24ch] text-plate-ink">{line}</h2>
              <p className="t-body mt-[var(--s-3)] text-plate-ink/65">{sub}</p>
            </div>
          </div>

          <div
            className="flex items-end justify-between gap-[var(--s-4)] border-t border-plate-rule-strong"
            style={{ padding: 'var(--s-3) var(--s-4)' }}
          >
            <div>
              <ScaleBar />
              <p className="t-stamp mt-[var(--s-2)] text-plate-ink/45">
                {tris.volume} · ships from Janjina
              </p>
            </div>
            <Link href={`/wines/${tris.slug}`} className="pressable flex items-baseline gap-[var(--s-3)]">
              <span className="t-title tnum text-plate-ink">{eur(tris.price)}</span>
              <span className="t-stamp bg-stamp px-[var(--s-4)] py-[var(--s-3)] text-plate">
                Take all three
              </span>
            </Link>
          </div>
        </Plate>
      </div>
    </section>
  )
}
