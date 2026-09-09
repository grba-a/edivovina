import type { Metadata } from 'next'
import Link from 'next/link'
import PageShell from '@/components/page/PageShell'
import PageOpen from '@/components/page/PageOpen'
import Station from '@/components/station/Station'
import Frame from '@/components/ui/Frame'
import VideoFacade from '@/components/visit/VideoFacade'
import { station } from '@/data/stations'

const S = station('surface')

export const metadata: Metadata = {
  title: 'Visit Us — Edivo Vina',
  description:
    'The Edivo wine bar in Drače and the underwater cellar off Pelješac, one hour from Dubrovnik.',
}

const STEPS: [string, string][] = [
  ['Arrive', 'Drače, on the water. One hour north-west of Dubrovnik, or in by boat to the jetty.'],
  ['Taste', 'The undersea wines beside their cellar-aged twin, so the difference is a fact and not a claim.'],
  ['See how', 'How the clay is sealed, how the cages are locked, and why it took a year of failed seals.'],
  ['Take it home', 'A sealed amphora in a pinewood box, in the wrought-iron cradle it hung in.'],
]

const PRACTICAL: [string, string][] = [
  ['The winery', 'Janjina 62, 20246 Janjina'],
  ['The wine bar', 'Drače 18, 20246 Drače'],
  ['By car', 'One hour from Dubrovnik along the coast'],
  ['By boat', 'Drače has a jetty; the bar is on the water'],
]

/**
 * /visit — 0 m, postaja `surface`. Jedina stranica IZNAD vode i najsvjetlija
 * na webu, pa ovdje fotografija vodi: puni kadar odmah nakon otvaranja.
 *
 * Njihova /visit-us ima dva naslova: „Wine Bar" ima tekst i taj je prilagodjen,
 * „Underwater Winery" nema NI JEDNU recenicu tijela — samo dvanaest fotki. Taj
 * dio je nas tekst.
 *
 * STO NAMJERNO NE STOJI: cijena po osobi, trajanje, sto je ukljuceno, radno
 * vrijeme, sezona i booking. Provjereno na cijelom njihovom webu — nemaju
 * NIJEDNO od toga, ni formu ni cijenu. Lazna cijena je gore od nikakve.
 *
 * RONILACKE TURE se ne spominju: klijent je potvrdio 2026-09-04 da ih nema.
 */
export default function VisitPage() {
  return (
    <PageShell data={S}>
      <PageOpen
        data={S}
        side="l"
        title="Two addresses, one hour away."
        lead="A wine bar on the water in Drače, and a cellar you cannot walk into — it is around twenty metres under the sea in front of it."
        cta={{ href: '/contact', label: 'Arrange a visit' }}
        meta="42°55′N 17°28′E"
      />

      <Station data={S} side="r" stage={false} style={{ paddingTop: 'var(--sec-y-tight)', paddingBottom: 'var(--sec-y-tight)' }}>
        <div className="ed-in relative z-10">
          <div className="grid gap-[var(--s-7)] md:grid-cols-[1fr_1fr] md:items-start md:gap-[var(--s-8)]">
            <div>
              <h2 className="t-plate max-w-[14ch] text-ivory">The wine bar.</h2>
              <p className="t-body mt-[var(--s-5)] text-ivory/72">
                Navis Mysterium is a limited-edition boutique wine made from native Plavac Mali and
                aged at the bottom of the sea, in glass and in clay. If you want to understand it
                rather than read about it, come to the bar on Pelješac.
              </p>
              <p className="t-body mt-[var(--s-4)] text-ivory/72">
                We pour the undersea wines and walk you through how they are made — including the
                part where the sea decides the finish and we do not clean it off.
              </p>
              <div className="ed-plate mt-[var(--s-6)] max-w-[26rem]">
                <Frame
                  name="bar-terrace"
                  alt="The terrace of the Edivo wine bar, on the water at Drače"
                  sizes="(min-width: 768px) 26rem, 92vw"
                  ratio={3 / 2}
                  position="50% 45%"
                  className="w-full"
                />
              </div>

            </div>

            {/* Numerirani koraci: redoslijed JE informacija — ovo je tijek posjeta. */}
            <ol>
              {STEPS.map(([k, v], i) => (
                <li key={k} className="border-t border-ivory/12 py-[var(--s-4)]">
                  <p className="data-label flex items-baseline gap-[var(--s-3)] text-gold">
                    <span className="tnum text-ivory/35">0{i + 1}</span>
                    {k}
                  </p>
                  <p className="t-field mt-[var(--s-2)] max-w-[42ch] text-ivory/70">{v}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Station>

      <section style={{ paddingBlock: 'var(--sec-y-tight)' }}>
        <div className="ed-in">
          <h2 className="t-plate max-w-[18ch] text-ivory">The cellar you cannot walk into.</h2>
          <div className="mt-[var(--s-6)] grid gap-[var(--s-7)] md:grid-cols-[1.15fr_0.85fr] md:items-start">
            <VideoFacade id="mo3rnW_Wm5s" poster="jetty-2" title="Inside the underwater winery" />
            <div>
              <p className="t-body text-ivory/72">
                It is an old fishing boat that went down more than thirty years ago, held under
                concession, with the amphorae locked inside wrought-iron cages. Nobody walks around
                it. What you see of it from the terrace is the water above it.
              </p>
              <p className="t-field mt-[var(--s-4)] max-w-[36ch] text-ivory/60">
                Diving tours are no longer offered.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section style={{ paddingBottom: 'var(--sec-y)' }}>
        <div className="ed-in">
          {/* Oznaka NAD vrijednoscu, ne u `ed-row`: ove vrijednosti su recenice,
              a `shrink-0` na tekstu koji se moze lomiti je isti trap koji je u
              `Dive.tsx` vec izbacio cijenu 17 px izvan kadra na 360 px. Ovdje
              je davao 362 > 360 u WebKitu. `ed-row` je za MJERENE vrijednosti
              (cijena, koordinata, mjesto), ne za proze. */}
          <dl className="grid gap-x-[var(--s-8)] sm:grid-cols-2 lg:grid-cols-4">
            {PRACTICAL.map(([k, v]) => (
              <div key={k} className="border-t border-ivory/12 py-[var(--s-4)]">
                <dt className="data-label text-ivory/55">{k}</dt>
                <dd className="t-field mt-[var(--s-2)] text-ivory/85">{v}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-[var(--s-7)] flex flex-wrap items-center gap-[var(--s-5)] border-t border-ivory/16 pt-[var(--s-6)]">
            <p className="t-body max-w-[42ch] text-ivory/72">
              Opening hours are seasonal and tastings are arranged rather than booked online.
              Message us and we will tell you when we are pouring.
            </p>
            <Link
              href="/contact"
              className="data-label pressable ml-auto bg-gold px-[var(--s-5)] py-[var(--s-4)] text-abyss transition-colors duration-200 hover:bg-ivory"
            >
              Arrange a visit
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  )
}
