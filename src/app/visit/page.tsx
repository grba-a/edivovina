import type { Metadata } from 'next'
import PageHead from '@/components/PageHead'
import Footer from '@/components/Footer'
import Frame from '@/components/ui/Frame'
import Reveal from '@/components/ui/Reveal'

export const metadata: Metadata = {
  title: 'Visit — Edivo Vina',
  description:
    'The Edivo wine bar at Drače and the winery at Janjina, on the Pelješac peninsula, an hour from Dubrovnik.',
}

/**
 * NAPOMENA: radno vrijeme i cijene degustacija NISU objavljene. Jedini javni
 * podatak je 150/460/795 kn na winetraveleru — to su PRETKONVERZIJSKE kune i
 * odnosile su se dijelom na ronilacke ture koje vise ne postoje. Zato ovdje
 * NEMA cijena ni sati: prodavati netocnu cijenu je gore od ne navesti je.
 */
const PLACES = [
  {
    kind: 'Wine bar',
    name: 'Drače',
    address: ['Drače 18', '20246 Drače', 'Pelješac, Croatia'],
    body: 'This is where all three come out at once — the cellar bottle, the sea bottle and the amphora, poured side by side from the same vintage. Oysters from the bay, pršut, Pelješac cheese.',
    image: 'bar-terrace',
    alt: 'The terrace of the Edivo wine bar at Drače',
    map: 'https://www.google.com/maps/search/?api=1&query=Edivo+Vina+Dra%C4%8De',
  },
  {
    kind: 'Winery',
    name: 'Janjina',
    address: ['Janjina 62', '20246 Janjina', 'Pelješac, Croatia'],
    body: 'Where the fruit comes in and the wine spends its first three months. The amphorae are filled and sealed here before they go down to the wreck.',
    image: 'vinarija-01',
    alt: 'The Edivo winery at Janjina',
    map: 'https://www.google.com/maps/search/?api=1&query=Edivo+Vina+Janjina',
  },
]

export default function VisitPage() {
  return (
    <>
      <main className="relative z-10">
        <PageHead
          eyebrow="Two addresses"
          title="An hour from Dubrovnik, between Ston and Orebić."
          intro="Come to the bar at Drače to taste, or to the winery at Janjina to see where it starts.
          Both are on the Pelješac peninsula. Call ahead — this is a small operation and the season
          decides the hours."
        />

        <section className="px-5 pb-24 md:px-8 md:pb-32">
          <div className="mx-auto w-full max-w-[92rem]">
            {PLACES.map((pl, i) => (
              <div
                key={pl.name}
                className="grid gap-8 border-t border-ivory/12 py-14 md:grid-cols-12 md:gap-10 md:py-20"
              >
                <div className={`md:col-span-6 ${i % 2 ? 'md:order-2' : ''}`}>
                  <Reveal from={0.16}>
                    <Frame
                      name={pl.image}
                      alt={pl.alt}
                      sizes="(min-width: 768px) 48vw, 100vw"
                      className="aspect-[3/2] w-full bg-navy/30 object-cover"
                    />
                  </Reveal>
                </div>
                <div className="md:col-span-5">
                  <p className="data-label text-gold">{pl.kind}</p>
                  <h2 className="mt-4 font-display text-[clamp(2rem,4vw,3.2rem)] leading-tight text-ivory">
                    {pl.name}
                  </h2>
                  <p className="mt-5 max-w-[44ch] text-[1.0625rem] leading-[1.75] text-ivory/70">
                    {pl.body}
                  </p>
                  <address className="mt-8 not-italic text-sm leading-relaxed text-ivory/60">
                    {pl.address.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </address>
                  <div className="mt-7 flex flex-wrap gap-3">
                    <a
                      href="tel:+385916127229"
                      className="data-label bg-gold px-6 py-4 text-abyss transition-colors duration-200 hover:bg-ivory"
                    >
                      +385 91 6127 229
                    </a>
                    <a
                      href={pl.map}
                      target="_blank"
                      rel="noreferrer"
                      className="data-label border border-ivory/25 px-6 py-4 text-ivory/80 transition-colors duration-200 hover:border-gold hover:text-gold"
                    >
                      Open in maps
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
