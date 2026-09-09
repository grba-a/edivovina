import type { Metadata } from 'next'
import PageShell from '@/components/page/PageShell'
import PageHead from '@/components/page/PageHead'
import Anatomy from '@/components/about/Anatomy'
import Frame from '@/components/ui/Frame'
import { station } from '@/data/stations'

const S = station('winery')

export const metadata: Metadata = {
  title: 'About Us — Edivo Vina',
  description:
    'Drače, one hour from Dubrovnik. First wine in 2011, first amphorae down in late 2013. Plavac from Janjina, clay from Petrinja, wrought iron from Sisak, pinewood from Varaždin.',
}

const CHAIN = [
  ['Plavac Mali', 'Janjina'],
  ['Clay', 'Petrinja'],
  ['Wrought iron', 'Sisak'],
  ['Pinewood cases', 'Varaždin'],
]

/**
 * /about — 6 m, postaja `winery`.
 *
 * Tekst je NJIHOV, s /about-us, samo prosloscen kroz nas glas i bez njihovih
 * tipfelera. Pull-quote ide verbatim jer je to njihov glas, ne nas.
 *
 * Sto se NE izgovara: gdje je tocno potonuli brod. Njihov /newsletter kaze
 * „the bay of Mali Ston", PRODUCT.md kaze Zuljana, a naslovnica je dosad
 * govorila Janjina. Tri odgovora na isto pitanje, a stoji u velikoj
 * tipografiji — ceka klijenta. Ovdje stoji samo ono sto svi izvori dijele:
 * potonuli ribarski brod, 30+ godina na dnu, drzan pod koncesijom.
 */
export default function AboutPage() {
  return (
    <PageShell data={S}>
      <PageHead
        data={S}
        side="l"
        lines={['The sea, not a cellar,', 'finishes the wine.']}
        intro="Drače is a small village on the Pelješac peninsula, one hour from Dubrovnik. It is where the story begins."
        cta={{ href: '/wines', label: 'Taste the result — from €17.50' }}
        readout="2011 · first wine"
      />

      <section aria-labelledby="story-h" style={{ paddingBlock: 'var(--sec-y-tight)' }}>
        <div className="ed-in">
          <h2 id="story-h" className="t-plate max-w-[18ch] text-ivory">
            We stopped building cellars.
          </h2>

          <div className="mt-[var(--s-7)] grid gap-[var(--s-7)] md:grid-cols-2 md:gap-[var(--s-8)]">
            <div>
              <p className="t-body text-ivory/72">
                Pelješac is known for its vineyards and for wines that travel — Dingač above all,
                the king of Croatian reds. In 2011 we made our first wine and decided it had to be
                unlike anything else. The idea was to sink it.
              </p>
              <p className="t-body mt-[var(--s-4)] text-ivory/72">
                It took time. Bottles worked almost immediately; the amphorae did not. The question
                was whether a glass bottle could sit inside clay at all without the sea getting in
                and taking the wine with it. A cork and two layers of rubber answered it. The first
                amphorae went down in late 2013.
              </p>
              <p className="t-body mt-[var(--s-4)] text-ivory/72">
                They rest in an old fishing boat that has been on the seabed for more than thirty
                years, held under concession, locked in wrought-iron cages. Eighteen to twenty-five
                metres down, for more than seven hundred days.
              </p>
            </div>

            <div>
              {/* Njihov glas, verbatim — jedina recenica na stranici koja nije nasa. */}
              <blockquote className="border-l border-gold/50 pl-[var(--s-5)]">
                <p className="t-plate max-w-[26ch] text-ivory" style={{ fontSize: 'clamp(1.3rem, 3vw, 2.1rem)', lineHeight: 1.24 }}>
                  “Everything is pure Croatian product — one with a story that belongs to our land,
                  that people will definitely talk about.”
                </p>
                <footer className="data-label-sm mt-[var(--s-4)] text-ivory/55">
                  Edivo Vina, in their own words
                </footer>
              </blockquote>

              <dl className="mt-[var(--s-7)]">
                {CHAIN.map(([what, where]) => (
                  <div
                    key={what}
                    className="flex items-baseline gap-[var(--s-3)] border-t border-ivory/12 py-[var(--s-3)]"
                  >
                    <dt className="data-label text-ivory/60">{what}</dt>
                    <span aria-hidden className="h-px flex-1 bg-ivory/12" />
                    <dd className="t-field text-ivory/85">{where}</dd>
                  </div>
                ))}
              </dl>
              <p className="t-field mt-[var(--s-4)] max-w-[34ch] text-ivory/60">
                Nothing from far away — and neither is the wine.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Kadar probija lijevi rub — ne sjedi u kutiji. */}
      <section aria-label="The amphora out of the water" style={{ paddingBottom: 'var(--sec-y-tight)' }}>
        <div className="ed-in">
          <div className="ed-bleed-l">
            <Frame
              name="lift-water-wide"
              alt="An amphora, encrusted after two years underwater, lifted clear of the sea"
              sizes="100vw"
              ratio={3 / 2}
              className="w-full"
            />
          </div>
        </div>
      </section>

      {/* Element s dna njihove About stranice, rekonstruiran kao zivi SVG. */}
      <Anatomy />

      <section aria-labelledby="founder-h" style={{ paddingBlock: 'var(--sec-y-tight)' }}>
        <div className="ed-in grid gap-[var(--s-7)] md:grid-cols-[0.9fr_1.1fr] md:items-center">
          {/* NE portret osnivaca, iako ga imamo (`founder-wide`): Petrova odluka
              je „predmet je subjekt — bez lica i bez lifestylea". Ime stoji u
              tipografiji, a kadar drzi predmet. Gola ruka daje mjerilo i
              pokazuje obrastanje, sto je jaci argument za €382 od portreta.
              Ako Petar zeli lice, ovdje je jedna zamjena imena. */}
          <Frame
            name="hands-amphora"
            alt="A bare hand lifting an encrusted amphora, the cork still sealed"
            sizes="(min-width: 768px) 42vw, 92vw"
            ratio={4 / 5}
            className="w-full"
          />
          <div>
            <h2 id="founder-h" className="t-plate max-w-[16ch] text-ivory">
              Founded by Ivo Šegović.
            </h2>
            <p className="t-body mt-[var(--s-4)] text-ivory/72">
              First wine in 2011, first submersions across 2013 and 2014, and a year of failed seals
              in between. What comes back up is signed by the sea — every vessel differently,
              because each one surfaces wearing its own oysters and coralline.
            </p>
          </div>
        </div>
      </section>
    </PageShell>
  )
}
