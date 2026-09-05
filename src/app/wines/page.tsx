import type { Metadata } from 'next'
import Link from 'next/link'
import PageHero from '@/components/PageHero'
import Footer from '@/components/Footer'
import Frame from '@/components/ui/Frame'
import Reveal from '@/components/ui/Reveal'
import { WINES, bySlug, undersea, cellar, type Wine } from '@/data/wines'

export const metadata: Metadata = {
  title: 'Wines — Edivo Vina',
  description:
    'Plavac Mali and Pošip aged 700 days on the Adriatic seabed, and the cellar wines they are measured against.',
}

const price = (n: number) => '€' + (Number.isInteger(n) ? String(n) : n.toFixed(2).replace('.', ','))

/**
 * Asimetricni katalog.
 *
 * Ne jednaki grid: TRIS ide preko cijele sirine jer je i najskuplji i jedini
 * koji objasnjava ostale. Podmorske boce dobivaju vece kadrove od podrumskih,
 * jer nisu jednako vazne — jednaki grid bi tvrdio da jesu.
 */
/**
 * Kartica u katalogu. NEMA "big" varijante: 2-up grid je davao slike od 845px,
 * 94% laptop ekrana — kupac je vidio jednu bocu po ekranu i nije mogao
 * usporediti. Cetiri u redu je gustoca u kojoj se katalog cita.
 */
function Row({ w }: { w: Wine }) {
  return (
    <li>
      <Link href={`/wines/${w.slug}`} className="group block">
        <Reveal from={0.16}>
          <Frame
            name={w.image}
            alt={w.name}
            sizes="(min-width: 1024px) 23vw, 46vw" 
            ratio="natural"
            className="w-full transition-opacity duration-300 group-hover:opacity-88"
          />
        </Reveal>
        <div className="mt-5 flex items-start justify-between gap-4 border-t border-ivory/12 pt-4">
          <div className="min-w-0">
            <h3 className="font-display text-base leading-tight text-ivory md:text-lg">{w.name}</h3>
            <p className="data-label mt-2 text-gold/70" style={{ fontSize: '0.5rem' }}>
              {w.daysUnderSea > 0 ? `${w.daysUnderSea} days down` : w.grapes.join(' · ')}
            </p>
          </div>
          <p className="tnum shrink-0 text-ivory/80">{price(w.price)}</p>
        </div>
        <p className="mt-3 text-[0.8125rem] leading-relaxed text-ivory/50">{w.shortDescription}</p>
      </Link>
    </li>
  )
}

export default function WinesPage() {
  const tris = bySlug('navis-mysterium-tris')!
  const sea = undersea().filter((w) => w.slug !== tris.slug)
  const land = cellar()

  return (
    <>
      <main className="relative z-10">
        <PageHero
          eyebrow={`${WINES.length} wines`}
          lines={['Four of these have', 'been underwater.']}
          intro="The price is not a scale of quality. It is a scale of how much the sea was involved."
          cta={{ href: '#tris', label: 'Start with the set' }}
          readout={`${WINES.length} wines · 4 undersea`}
        />

        <section className="px-5 pb-14 md:px-8 md:pb-24">
          <div className="mx-auto w-full max-w-[92rem]">
            {/* --- TRIS preko cijele sirine: skuplji je I objasnjava ostale --- */}
            <Link
              id="tris"
              href={`/wines/${tris.slug}`}
              className="group grid border border-gold/30 md:grid-cols-12"
            >
              <div className="p-5 md:col-span-3 md:p-7">
                <Frame
                  name={tris.image}
                  alt={tris.name}
                  priority
                  sizes="(min-width: 768px) 42vw, 100vw"
                  ratio="natural"
                  className="w-full transition-opacity duration-300 group-hover:opacity-90"
                />
              </div>
              <div className="flex flex-col justify-between gap-8 p-7 md:col-span-9 md:p-12">
                <div>
                  <p className="data-label text-gold">Start here</p>
                  <h2 className="mt-4 font-display text-[clamp(1.6rem,3.2vw,2.6rem)] leading-tight text-ivory">
                    {tris.name}
                  </h2>
                  <p className="mt-4 max-w-[46ch] text-[1.0625rem] leading-[1.7] text-ivory/65">
                    {tris.description}
                  </p>
                </div>
                <div className="flex flex-wrap items-end justify-between gap-5">
                  <div>
                    <p className="font-display tnum text-3xl text-ivory">{price(tris.price)}</p>
                    <p className="data-label mt-2 text-ivory/35" style={{ fontSize: '0.5rem' }}>
                      {tris.volume} · pinewood case
                    </p>
                  </div>
                  <span className="data-label bg-gold px-6 py-4 text-abyss transition-colors duration-200 group-hover:bg-ivory">
                    Take the set
                  </span>
                </div>
              </div>
            </Link>

            {/* --- podmorske: veci kadrovi --- */}
            <div className="mt-16 flex flex-wrap items-baseline gap-x-5 gap-y-2 border-t border-ivory/15 pt-8">
              <h2 className="font-display text-xl text-ivory md:text-2xl">Aged at 25 metres</h2>
              <span className="data-label text-gold/60" style={{ fontSize: '0.5rem' }}>
                700 days on the seabed
              </span>
            </div>
            <ul className="mt-10 grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-4">
              {sea.map((w) => (
                <Row key={w.slug} w={w} />
              ))}
            </ul>

            {/* --- podrumske: manji kadrovi, cetiri u redu --- */}
            <div className="mt-16 flex flex-wrap items-baseline gap-x-5 gap-y-2 border-t border-ivory/15 pt-8">
              <h2 className="font-display text-xl text-ivory md:text-2xl">Aged in Janjina</h2>
              <span className="data-label text-ivory/30" style={{ fontSize: '0.5rem' }}>
                the control group
              </span>
            </div>
            {/* Tri u redu, ne cetiri: podrumskih je pet, pa bi u 4-stupcanom
                gridu Rose ostao sam s tri prazna stupca. */}
            <ul className="mt-10 grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-3">
              {land.map((w) => (
                <li key={w.slug}>
                  <Link href={`/wines/${w.slug}`} className="group block">
                    <Reveal from={0.2}>
                      <Frame
                        name={w.image}
                        alt={w.name}
                        sizes="(min-width: 1024px) 22vw, 46vw"
                        ratio="natural"
            className="w-full transition-opacity duration-300 group-hover:opacity-88"
                      />
                    </Reveal>
                    <div className="mt-4 flex items-start justify-between gap-3 border-t border-ivory/12 pt-3">
                      <h3 className="font-display text-base leading-tight text-ivory">{w.name}</h3>
                      <p className="tnum shrink-0 text-sm text-ivory/70">{price(w.price)}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
