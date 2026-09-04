import Link from 'next/link'
import Frame from './ui/Frame'
import Reveal from './ui/Reveal'
import { bySlug } from '@/data/wines'

/**
 * 03 / THE THREE — prodajni motor stranice.
 *
 * Ne tri jednake kartice: tri stupca s RAZLICITIM vertikalnim odmakom i
 * RAZLICITOM velicinom, jer treci (amfora) je i skuplji i vazniji. Simetrija
 * bi ih izjednacila, a oni nisu jednaki.
 *
 * Ovdje se prodajni put skracuje na jedan potez: razumijes proizvod i kupujes
 * ga u istom kadru, bez odlaska u katalog.
 */
const COLUMNS = [
  {
    slug: 'navis-mysterium-cellar',
    photo: 'p-cellar',
    word: 'Cellar',
    days: '0 days',
    line: 'Two years in Janjina. The wine we would have made anyway.',
    offset: 'md:mt-24',
    span: 'md:col-span-4',
  },
  {
    slug: 'navis-mysterium-sea-bottle',
    photo: 'p-sea-bottle',
    word: 'Sea',
    days: '700 days',
    line: 'Same wine, in glass, on the seabed. Rounder. Longer.',
    offset: 'md:mt-12',
    span: 'md:col-span-4',
  },
  {
    slug: 'navis-mysterium-amphora',
    photo: 'p-amphora',
    word: 'Clay',
    days: '700 days',
    line: 'Same wine, sealed in Petrinja clay. The one that comes up wearing oysters.',
    offset: '',
    span: 'md:col-span-4',
  },
] as const

const price = (n: number) => '€' + (Number.isInteger(n) ? String(n) : n.toFixed(2).replace('.', ','))

export default function TheThree() {
  const tris = bySlug('navis-mysterium-tris')!

  return (
    <section id="three" className="relative z-10 px-5 py-14 md:px-8 md:py-24">
      <div className="mx-auto w-full max-w-[92rem]">
        {/* Naslov je namjerno gurnut desno — lijeva trecina ostaje prazna. */}
        <div className="md:grid md:grid-cols-12">
          <div className="md:col-span-7 md:col-start-5">
            <p className="data-label mb-5 text-gold">One wine, three endings</p>
            <h2 className="font-display text-[clamp(1.9rem,4.6vw,3.6rem)] leading-[1.05] tracking-[-0.02em] text-ivory">
              The only way to taste what the sea{' '}
              <span className="italic text-gold">actually</span> does.
            </h2>
            <p className="mt-6 max-w-[46ch] text-[1.0625rem] leading-[1.75] text-ivory/60">
              Same vintage. Same barrel. Split three ways on the same afternoon. Everything else
              about these bottles is identical, which is the whole point.
            </p>
          </div>
        </div>

        <ol className="mt-14 grid gap-10 md:mt-20 md:grid-cols-12 md:gap-6">
          {COLUMNS.map((c, i) => {
            const w = bySlug(c.slug)!
            return (
              <li key={c.slug} className={`${c.span} ${c.offset}`}>
                <Link href={`/wines/${w.slug}`} className="group block">
                  <Reveal from={0.16}>
                    <Frame
                      name={c.photo}
                      alt={w.name}
                      sizes="(min-width: 768px) 31vw, 100vw"
                      ratio="natural"
                      className="w-full max-w-[21rem] transition-opacity duration-300 group-hover:opacity-88"
                    />
                  </Reveal>

                  <div className="mt-6 flex items-baseline justify-between gap-4 border-t border-ivory/15 pt-5">
                    <span className="data-label text-ivory/30" style={{ fontSize: '0.5rem' }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="data-label tnum text-gold" style={{ fontSize: '0.5rem' }}>
                      {c.days}
                    </span>
                  </div>

                  <h3 className="mt-4 font-display text-[clamp(1.6rem,2.6vw,2.2rem)] leading-none text-ivory">
                    {c.word}
                  </h3>
                  <p className="mt-4 max-w-[30ch] text-[0.9375rem] leading-relaxed text-ivory/55">
                    {c.line}
                  </p>
                  <p className="mt-5 tnum text-ivory/80">{price(w.price)}</p>
                </Link>
              </li>
            )
          })}
        </ol>

        {/* Jedan potez do kupnje. Cijela sekcija vodi ovdje. */}
        <div className="mt-16 border border-gold/30 md:mt-20">
          <div className="grid md:grid-cols-12">
            <div className="p-7 md:col-span-8 md:p-12">
              <p className="data-label mb-4 text-gold">All three, in one box</p>
              <h3 className="font-display text-[clamp(1.5rem,3vw,2.4rem)] leading-tight text-ivory">
                {tris.name}
              </h3>
              <p className="mt-4 max-w-[44ch] text-[0.9375rem] leading-relaxed text-ivory/60">
                Hand-made pinewood case, the iron cradle the amphora hung in, and the three bottles
                in the order they should be opened.
              </p>
            </div>
            <div className="flex flex-col justify-between gap-6 border-t border-gold/30 bg-surface p-7 md:col-span-4 md:border-l md:border-t-0 md:p-12">
              <div>
                <p className="font-display tnum text-[clamp(2rem,3.4vw,2.8rem)] leading-none text-ivory">
                  {price(tris.price)}
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
      </div>
    </section>
  )
}
