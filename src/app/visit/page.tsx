import type { Metadata } from 'next'
import Link from 'next/link'
import PageShell from '@/components/page/PageShell'
import PageHead from '@/components/page/PageHead'
import Frame from '@/components/ui/Frame'
import VideoFacade from '@/components/visit/VideoFacade'
import { station } from '@/data/stations'

const S = station('surface')

export const metadata: Metadata = {
  title: 'Visit Us — Edivo Vina',
  description:
    'The Edivo wine bar in Drače and the underwater cellar off Pelješac, one hour from Dubrovnik.',
}

const STEPS = [
  ['Arrive', 'Drače, on the water. One hour north-west of Dubrovnik, or in by boat to the jetty.'],
  ['Taste', 'The undersea wines beside their cellar-aged twin, so the difference is a fact and not a claim.'],
  ['See how', 'How the clay is sealed, how the cages are locked, and why it took a year of failed seals.'],
  ['Take it home', 'A sealed amphora in a pinewood box, in the wrought-iron cradle it hung in.'],
]

/**
 * /visit — 0 m, postaja `surface`. Jedina stranica IZNAD vode i najsvjetlija
 * na webu; ovdje je fotografija glavni argument.
 *
 * Njihova /visit-us ima dva naslova: „Wine Bar" ima tekst i taj je prilagodjen,
 * a „Underwater Winery" NEMA ni jednu recenicu tijela — samo dvanaest fotki.
 * Taj dio je nas tekst, iz PRODUCT.md.
 *
 * STO OVDJE NAMJERNO NE STOJI, i zato je ova stranica isla zadnja:
 *   cijena po osobi, trajanje, sto je ukljuceno, radno vrijeme, sezona i
 *   booking. Provjerio sam cijeli njihov web — nemaju NIJEDNO od toga, ni
 *   formu ni cijenu, a jedini CTA na toj stranici im je newsletter u footeru.
 *   Lazna cijena je gore od nikakve. Blok je pripremljen i ceka klijenta.
 *
 * RONILACKE TURE se ne spominju: klijent je 2026-09-04 potvrdio da ih nema.
 * Njihov zivi web ih jos nudi na tri mjesta (mobilni nav „Scubadiving tours"
 * koji 301-a na homepage, tekst na /newsletter, naslovi videa) — to njima treba
 * skinuti.
 */
export default function VisitPage() {
  return (
    <PageShell data={S}>
      <PageHead
        data={S}
        side="r"
        lines={['Two addresses,', 'one hour away.']}
        intro="A wine bar on the water in Drače, and a cellar you cannot walk into — it is eighteen to twenty-five metres under the sea in front of it."
        cta={{ href: '/contact', label: 'Arrange a visit' }}
        readout="42°55′N 17°28′E"
      />

      <section aria-label="The bay at Drače" style={{ paddingBottom: 'var(--sec-y-tight)' }}>
        <div className="ed-in">
          <div className="ed-bleed-l">
            <Frame
              name="bar-terrace-wide"
              alt="The terrace of the Edivo wine bar, on the water at Drače"
              sizes="100vw"
              ratio={16 / 10}
              className="w-full"
            />
          </div>
        </div>
      </section>

      <section aria-labelledby="bar-h" style={{ paddingBlock: 'var(--sec-y-tight)' }}>
        <div className="ed-in grid gap-[var(--s-7)] md:grid-cols-[1.05fr_0.95fr] md:gap-[var(--s-8)]">
          <div>
            <h2 id="bar-h" className="t-plate max-w-[16ch] text-ivory">
              The wine bar.
            </h2>
            <p className="t-body mt-[var(--s-5)] text-ivory/72">
              Navis Mysterium is a limited-edition boutique wine made from native Plavac Mali and
              aged at the bottom of the sea, in glass and in clay. If you want to understand it
              rather than read about it, come to the Edivo wine bar on Pelješac.
            </p>
            <p className="t-body mt-[var(--s-4)] text-ivory/72">
              We pour the undersea wines and walk you through how they are made — including the
              part where the sea decides the finish and we do not clean it off.
            </p>
          </div>

          <ol className="mt-[var(--s-2)]">
            {STEPS.map(([k, v], i) => (
              <li key={k} className="border-t border-ivory/14 py-[var(--s-4)]">
                <p className="data-label text-gold">
                  <span className="tnum text-ivory/40">0{i + 1}</span> &nbsp;{k}
                </p>
                <p className="t-field mt-[var(--s-2)] max-w-[40ch] text-ivory/70">{v}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="cellar-h" style={{ paddingBlock: 'var(--sec-y-tight)' }}>
        <div className="ed-in">
          <h2 id="cellar-h" className="t-plate max-w-[20ch] text-ivory">
            The cellar you cannot walk into.
          </h2>
          <div className="mt-[var(--s-6)] grid gap-[var(--s-7)] md:grid-cols-[1.1fr_0.9fr] md:items-start">
            <VideoFacade
              id="mo3rnW_Wm5s"
              poster="jetty-2"
              title="Inside the underwater winery"
            />
            <div>
              <p className="t-body text-ivory/72">
                It is an old fishing boat that went down more than thirty years ago, held under
                concession, with the amphorae locked inside wrought-iron cages. Nobody walks around
                it. What you see of it from the terrace is the water above it.
              </p>
              <p className="t-field mt-[var(--s-4)] max-w-[38ch] text-ivory/60">
                Diving tours are no longer offered.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="prac-h" style={{ paddingBottom: 'var(--sec-y)' }}>
        <div className="ed-in">
          <h2 id="prac-h" className="t-title text-ivory">
            Before you set off
          </h2>
          <div className="mt-[var(--s-5)] grid gap-[var(--s-5)] sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['The winery', 'Janjina 62, 20246 Janjina, Pelješac'],
              ['The wine bar', 'Drače 18, 20246 Drače, Pelješac'],
              ['By car', 'One hour from Dubrovnik along the coast'],
              ['By boat', 'Drače has a jetty; the bar is on the water'],
            ].map(([k, v]) => (
              <div key={k} className="border border-ivory/14 bg-surface p-[var(--s-4)]">
                <p className="data-label text-gold">{k}</p>
                <p className="t-field mt-[var(--s-3)] text-ivory/75">{v}</p>
              </div>
            ))}
          </div>

          {/* Radno vrijeme, cijena i trajanje NAMJERNO nisu izmisljeni. */}
          <div className="mt-[var(--s-6)] flex flex-wrap items-center gap-[var(--s-5)] border-t border-ivory/16 pt-[var(--s-5)]">
            <p className="t-field max-w-[44ch] text-ivory/65">
              Opening hours are seasonal and tastings are arranged rather than booked online.
              Message us and we will tell you when we are pouring.
            </p>
            <Link
              href="/contact"
              className="data-label pressable ml-auto bg-gold px-[var(--s-5)] py-[var(--s-4)] text-abyss"
            >
              Arrange a visit
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  )
}
