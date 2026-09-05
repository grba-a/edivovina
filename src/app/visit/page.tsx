import type { Metadata } from 'next'
import PageHero from '@/components/PageHero'
import CtaBand from '@/components/CtaBand'
import Footer from '@/components/Footer'
import Frame from '@/components/ui/Frame'
import Reveal from '@/components/ui/Reveal'

export const metadata: Metadata = {
  title: 'Visit — Edivo Vina',
  description:
    'The Edivo wine bar at Drače and the winery at Janjina, an hour from Dubrovnik on the Pelješac peninsula.',
}

/**
 * NAPOMENA: cijene degustacija i radno vrijeme NISU objavljeni. Jedini javni
 * podatak su pretkonverzijske kune s winetravelera, koje su se dijelom
 * odnosile na ronilacke ture koje vise ne postoje. Zato ovdje nema ni cijena
 * ni sati — prodavati netocnu cijenu je gore od ne navesti je.
 */
const PLACES = [
  {
    kind: 'Wine bar',
    name: 'Drače',
    line: 'All three poured side by side — cellar, sea, amphora — from the same barrel. Oysters from the bay in front of you.',
    address: ['Drače 18', '20246 Drače'],
    image: 'bar-terrace-wide',
    alt: 'The terrace of the Edivo wine bar at Drače',
    map: 'https://www.google.com/maps/search/?api=1&query=Edivo+Vina+Dra%C4%8De',
  },
  {
    kind: 'Winery',
    name: 'Janjina',
    line: 'Where the fruit comes in and the amphorae are filled and sealed before they go down to the wreck.',
    address: ['Janjina 62', '20246 Janjina'],
    image: 'founder-wide',
    alt: 'Ivo Šegović above the underwater cellar off Janjina',
    map: 'https://www.google.com/maps/search/?api=1&query=Edivo+Vina+Janjina',
  },
]

export default function VisitPage() {
  return (
    <>
      <main className="relative z-10">
        <PageHero
          eyebrow="Two addresses"
          lines={['An hour from', 'Dubrovnik.']}
          intro="Between Ston and Orebić on the Pelješac peninsula. Call ahead — it is a small operation and the season decides the hours."
          cta={{ href: 'tel:+385916127229', label: '+385 91 6127 229' }}
          readout="42°55′N 17°28′E"
        />

        <section className="px-5 pb-14 md:px-8 md:pb-24">
          <div className="mx-auto grid w-full max-w-[92rem] gap-10 md:grid-cols-2 md:gap-6">
            {PLACES.map((pl) => (
              <div key={pl.name} className="border border-ivory/12">
                <Reveal from={0.16}>
                  <Frame
                    name={pl.image}
                    alt={pl.alt}
                    sizes="(min-width: 768px) 48vw, 100vw"
                    ratio="natural"
                    className="w-full bg-surface"
                  />
                </Reveal>
                <div className="p-6 md:p-9">
                  <p className="data-label text-gold">{pl.kind}</p>
                  <h2 className="mt-3 font-display text-[clamp(1.7rem,3.4vw,2.6rem)] leading-none text-ivory">
                    {pl.name}
                  </h2>
                  <p className="mt-5 max-w-[38ch] text-[0.9375rem] leading-relaxed text-ivory/60">
                    {pl.line}
                  </p>
                  <address className="mt-6 not-italic text-sm leading-relaxed text-ivory/45">
                    {pl.address.map((a) => (
                      <span key={a} className="block">
                        {a}
                      </span>
                    ))}
                  </address>
                  <a
                    href={pl.map}
                    target="_blank"
                    rel="noreferrer"
                    className="data-label mt-6 inline-block border-b border-gold/40 py-3 text-gold transition-colors duration-200 hover:border-gold"
                  >
                    Open in maps →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        <CtaBand
          line="Can’t get to Drače?"
          sub="The set travels. Same three bottles, same order, in a pinewood case shipped from the winery."
        />
      </main>
      <Footer />
    </>
  )
}
