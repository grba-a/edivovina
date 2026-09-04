import type { Metadata } from 'next'
import PageHero from '@/components/PageHero'
import CtaBand from '@/components/CtaBand'
import Footer from '@/components/Footer'
import Frame from '@/components/ui/Frame'
import Parallax from '@/components/ui/Parallax'
import Reveal from '@/components/ui/Reveal'
import CountUp from '@/components/ui/CountUp'

export const metadata: Metadata = {
  title: 'The story — Edivo Vina',
  description:
    'Plavac Mali from Janjina, sealed in Petrinja clay and left in a sunken fishing boat for 700 days.',
}

/**
 * Tri udarca, ne sest koraka.
 *
 * Prijasnja verzija je imala sest opisanih faza i citala se kao brosura.
 * Proces je zanimljiv u tri poteza: iznad vode, 700 dana dolje, i ono sto se
 * vrati. Sve ostalo je detalj koji nikoga ne priblizava kupnji.
 */
const BEATS = [
  {
    n: '01',
    depth: 'above water',
    title: 'Clay, and nothing from far away',
    body: 'Plavac Mali cut by hand on the slopes at Janjina. Three months in the cellar, then into an amphora thrown from Petrinja clay, corked and sealed with two layers of rubber. Iron cradle from Sisak, pinewood case from Varaždin.',
    image: 'jetty-2',
    alt: 'A shell-encrusted Edivo amphora on the stone jetty at Drače',
  },
  {
    n: '02',
    depth: '25 metres',
    title: 'Seven hundred days in a sunken boat',
    body: 'Locked in cages inside a fishing boat that went down here thirty years ago. Fourteen degrees, year round. No light. No vibration. Twice the pressure at the surface. It took a year of failed seals before the seawater stayed out.',
    image: 'seabed-pebbles',
    alt: 'Amphorae resting on the pebbled seabed off Pelješac',
  },
  {
    n: '03',
    depth: 'back up',
    title: 'The sea signs every one differently',
    body: 'Each amphora surfaces wearing oysters, coralline and the shape of the cage it hung in. We do not clean them off. That crust is the only signature the sea leaves, and no two bottles carry the same one.',
    image: 'lift-water',
    alt: 'An amphora lifted from the sea, water still running off the shells',
  },
]

export default function StoryPage() {
  return (
    <>
      <main className="relative z-10">
        <PageHero
          eyebrow="The process"
          lines={['We stopped building', 'cellars in 2013.']}
          intro="Ivo Šegović made the first Edivo wine in 2011. Two years later he sank a crate of it into the Adriatic to see what would happen."
          cta={{ href: '/wines', label: 'Taste the result — from €39' }}
          readout="700 days · 25 m"
        />

        {/* Jedan kadar preko cijele sirine — dokaz prije objasnjenja */}
        <div className="relative h-[42svh] min-h-[16rem] md:h-[54svh]">
          <Parallax className="absolute inset-0">
            <Frame
              name="pour-glass"
              alt="Wine poured from an encrusted Edivo amphora at the water's edge"
              sizes="100vw"
              position="50% 46%"
            />
          </Parallax>
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-2/5"
            style={{ background: 'linear-gradient(to top, rgba(3,20,31,0.9), rgba(3,20,31,0))' }}
          />
        </div>

        <section className="px-5 py-12 md:px-8 md:py-16">
          <div className="mx-auto w-full max-w-[92rem]">
            <dl className="grid grid-cols-3 gap-6 border-y border-ivory/12 py-10 md:gap-10">
              <CountUp to={700} label="days under the sea" />
              <CountUp to={25} label="metres at the wreck" suffix=" m" />
              <CountUp to={2011} label="first vintage" group={false} />
            </dl>

            <ol className="mt-4">
              {BEATS.map((b, i) => (
                <li
                  key={b.n}
                  className="grid gap-7 border-b border-ivory/12 py-10 md:grid-cols-12 md:gap-10 md:py-14"
                >
                  <div className={i % 2 ? 'md:col-span-5 md:order-2 md:col-start-8' : 'md:col-span-5'}>
                    <Reveal from={0.16}>
                      <Frame
                        name={b.image}
                        alt={b.alt}
                        sizes="(min-width: 768px) 40vw, 100vw"
                        ratio="natural"
                        className="w-full max-w-[20rem] bg-surface"
                      />
                    </Reveal>
                  </div>
                  <div className={i % 2 ? 'md:col-span-6 md:order-1 md:col-start-1' : 'md:col-span-6 md:col-start-7'}>
                    <div className="flex items-baseline gap-4">
                      <span className="tnum text-sm text-gold">{b.n}</span>
                      <span className="data-label text-ivory/30" style={{ fontSize: '0.5rem' }}>
                        {b.depth}
                      </span>
                    </div>
                    <h2 className="mt-4 max-w-[26ch] font-display text-[clamp(1.5rem,3vw,2.4rem)] leading-tight text-ivory">
                      {b.title}
                    </h2>
                    <p className="mt-5 max-w-[48ch] text-[1.0625rem] leading-[1.75] text-ivory/65">
                      {b.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <CtaBand />
      </main>
      <Footer />
    </>
  )
}
