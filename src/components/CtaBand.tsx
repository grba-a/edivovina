import Link from 'next/link'
import { bySlug } from '@/data/wines'

/**
 * Zavrsna prodajna traka. Ista na SVAKOJ podstranici — to je druga konstanta:
 * gdje god korisnik zavrsi citati, ponuda je ista i put je jedan klik.
 *
 * Namjerno bez fotografije i bez druge opcije osim TRIS-a: podstranica nije
 * mjesto za birati, nego za odluciti.
 */
export default function CtaBand({
  line = 'One wine. Three lives.',
  sub = 'Cellar, sea and amphora from the same barrel — the only way to taste what the depth actually did.',
}: {
  line?: string
  sub?: string
}) {
  const tris = bySlug('navis-mysterium-tris')!

  return (
    <section className="relative z-10 px-5 pb-20 md:px-8 md:pb-28">
      <div className="mx-auto w-full max-w-[92rem] border border-gold/30">
        <div className="grid md:grid-cols-12">
          <div className="p-7 md:col-span-8 md:p-12">
            <p className="data-label mb-4 text-gold">Start here</p>
            <h2 className="max-w-[22ch] font-display text-[clamp(1.6rem,3.4vw,2.7rem)] leading-tight text-ivory">
              {line}
            </h2>
            <p className="mt-4 max-w-[46ch] text-[0.9375rem] leading-relaxed text-ivory/60">{sub}</p>
          </div>
          <div className="flex flex-col justify-between gap-6 border-t border-gold/30 bg-surface p-7 md:col-span-4 md:border-l md:border-t-0 md:p-12">
            <div>
              <p className="font-display tnum text-[clamp(1.9rem,3.2vw,2.6rem)] leading-none text-ivory">
                €{tris.price}
              </p>
              <p className="data-label mt-3 text-ivory/35" style={{ fontSize: '0.5rem' }}>
                {tris.volume} · ships from Janjina
              </p>
            </div>
            <Link
              href={`/wines/${tris.slug}`}
              className="data-label block bg-gold px-6 py-4 text-center text-abyss transition-colors duration-200 hover:bg-ivory"
            >
              Take the set
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
