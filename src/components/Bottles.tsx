import Link from 'next/link'
import Frame from './ui/Frame'
import Reveal from './ui/Reveal'
import { bySlug, WINES } from '@/data/wines'

/**
 * 04 / THE BOTTLES.
 *
 * Asimetricno namjerno: jedan veliki kadar (skuplja boca, 7 stupaca) i tri
 * manja u stupcu pored. Grid 2x2 bi rekao da su cetiri jednako vazne.
 */
const LEAD = { slug: 'navis-mysterium-sea-bottle', photo: 'p-navis' }
const SIDE = [
  { slug: 'navis-q-sea-bottle', photo: 'p-q-white' },
  { slug: 'eros-sparkling-sea-bottle', photo: 'p-eros-sea' },
  { slug: 'dingac-edivo', photo: 'p-plavac' },
] as const

const price = (n: number) => '€' + (Number.isInteger(n) ? String(n) : n.toFixed(2).replace('.', ','))

export default function Bottles() {
  const lead = bySlug(LEAD.slug)!

  return (
    <section id="shop" className="relative z-10 px-5 pb-20 md:px-8 md:pb-32">
      <div className="mx-auto w-full max-w-[92rem]">
        <div className="flex flex-wrap items-end justify-between gap-5 border-t border-ivory/15 pt-10">
          <h2 className="font-display text-[clamp(1.6rem,3.2vw,2.6rem)] leading-tight text-ivory">
            Or start with one bottle.
          </h2>
          <Link
            href="/wines"
            className="data-label inline-block border-b border-gold/40 py-3 text-gold transition-colors duration-200 hover:border-gold"
          >
            All {WINES.length} wines →
          </Link>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-12 md:gap-6">
          <Link href={`/wines/${lead.slug}`} className="group md:col-span-7">
            <Reveal from={0.14}>
              <Frame
                name={LEAD.photo}
                alt={lead.name}
                sizes="(min-width: 768px) 56vw, 100vw"
                className="aspect-[4/5] w-full bg-navy/40 object-cover transition-opacity duration-300 group-hover:opacity-88 md:aspect-[3/4]"
              />
            </Reveal>
            <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="data-label text-gold" style={{ fontSize: '0.5rem' }}>
                  700 days under the sea
                </p>
                <h3 className="mt-3 font-display text-[clamp(1.5rem,2.6vw,2.1rem)] leading-tight text-ivory">
                  {lead.name}
                </h3>
                <p className="mt-3 max-w-[42ch] text-[0.9375rem] leading-relaxed text-ivory/55">
                  {lead.shortDescription}
                </p>
              </div>
              <p className="font-display tnum text-2xl text-ivory/85">{price(lead.price)}</p>
            </div>
          </Link>

          <ul className="md:col-span-5">
            {SIDE.map((s) => {
              const w = bySlug(s.slug)!
              return (
                <li key={s.slug} className="border-b border-ivory/12 first:border-t md:first:border-t-0">
                  <Link
                    href={`/wines/${w.slug}`}
                    className="group flex items-center gap-5 py-5 md:gap-6 md:py-6"
                  >
                    <Frame
                      name={s.photo}
                      alt={w.name}
                      sizes="120px"
                      className="h-24 w-20 shrink-0 bg-navy/40 object-cover transition-opacity duration-300 group-hover:opacity-85 md:h-28 md:w-24"
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="font-display text-lg leading-tight text-ivory">{w.name}</h3>
                      <p className="data-label mt-2 text-ivory/30" style={{ fontSize: '0.5rem' }}>
                        {w.daysUnderSea > 0 ? `${w.daysUnderSea} days down` : 'cellar aged'}
                      </p>
                    </div>
                    <p className="tnum shrink-0 text-ivory/70">{price(w.price)}</p>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
