import type { Metadata } from 'next'
import Link from 'next/link'
import PageShell from '@/components/page/PageShell'
import PageOpen from '@/components/page/PageOpen'
import Anatomy from '@/components/about/Anatomy'
import Station from '@/components/station/Station'
import Frame from '@/components/ui/Frame'
import { station } from '@/data/stations'

const S = station('winery')

export const metadata: Metadata = {
  title: 'About Us — Edivo Vina',
  description:
    'Drače, one hour from Dubrovnik. First wine in 2011, first amphorae down in late 2013. Plavac from Janjina, clay from Petrinja, wrought iron from Sisak, pinewood from Varaždin.',
}

const CHAIN: [string, string][] = [
  ['Plavac Mali', 'Janjina'],
  ['Clay', 'Petrinja'],
  ['Wrought iron', 'Sisak'],
  ['Pinewood cases', 'Varaždin'],
]

/**
 * /about — 6 m, postaja `winery`.
 *
 * Cetiri poteza: otvaranje, prica uz kadar koji probija rub, njihov citat u
 * punoj velicini, i anatomija. Isti aparat kao naslovnica, nista novo.
 *
 * OSNIVAC SE NE IMENUJE. PRODUCT.md pise „Founded by Ivo Šegović", ali klijentov
 * dosje kaze da je „Edivo" = Edi Bajurin + Ivo Šegović, da njihov vlastiti web
 * ne imenuje nijednog, i da nacin pripisivanja CEKA ODLUKU KLIJENTA. Prva
 * verzija ove stranice tvrdila je jedno ime; to je bila tvrdnja koju nemamo.
 */
export default function AboutPage() {
  return (
    <PageShell data={S}>
      <PageOpen
        data={S}
        side="l"
        title="The sea, not a cellar, finishes the wine."
        lead="Drače is a small village on the Pelješac peninsula, one hour from Dubrovnik. It is where the story begins — and the cellar is not a building."
        meta="First wine 2011 · first amphorae down late 2013"
      />

      <Station data={S} side="r" stage={false} style={{ paddingTop: 'var(--sec-y-tight)', paddingBottom: 'var(--sec-y)' }}>
        <div className="ed-in relative z-10">
          <div className="grid gap-[var(--s-7)] md:grid-cols-[1.05fr_0.95fr] md:items-start md:gap-[var(--s-8)]">
            <div>
              <h2 className="t-plate max-w-[16ch] text-ivory">We stopped building cellars.</h2>
              <p className="t-body mt-[var(--s-5)] text-ivory/72">
                Pelješac is known for wines that travel — Dingač above all, the king of Croatian
                reds. In 2011 we made our first wine and decided it had to be unlike anything else.
                The idea was to sink it.
              </p>
              <p className="t-body mt-[var(--s-4)] text-ivory/72">
                Bottles worked almost immediately; the amphorae did not. The question was whether a
                glass bottle could sit inside clay at all without the sea getting in and taking the
                wine with it. A cork and two layers of rubber answered it. The first amphorae went
                down in late 2013.
              </p>
              <p className="t-body mt-[var(--s-4)] text-ivory/72">
                They rest in an old fishing boat that has been on the seabed for more than thirty
                years, held under concession, locked in wrought-iron cages — around twenty metres
                down, for more than seven hundred days.
              </p>
            </div>

            <div>
              <dl>
                {CHAIN.map(([what, where]) => (
                  <div key={what} className="ed-row">
                    <dt className="data-label shrink-0 text-ivory/60">{what}</dt>
                    <span aria-hidden className="ed-rule" />
                    <dd className="t-field shrink-0 text-ivory/85">{where}</dd>
                  </div>
                ))}
              </dl>
              <p className="t-field mt-[var(--s-4)] max-w-[34ch] text-ivory/60">
                Nothing from far away — and neither is the wine.
              </p>
              {/* Umjerena fotografija u stupcu, uz lanac materijala. */}
              <div className="ed-plate mt-[var(--s-6)] max-w-[24rem]">
                <Frame
                  name="hands-amphora"
                  alt="A bare hand lifting an encrusted amphora, the cork still sealed"
                  sizes="(min-width: 768px) 24rem, 92vw"
                  ratio={3 / 2}
                  position="50% 45%"
                  className="w-full"
                />
              </div>

            </div>
          </div>
        </div>
      </Station>

      {/* Njihov glas, u punoj velicini. Jedina recenica na stranici koja nije nasa. */}
      <section aria-label="In their own words" style={{ paddingBottom: 'var(--sec-y)' }}>
        <div className="ed-in">
          <blockquote className="max-w-[46rem]">
            <p className="t-plate text-ivory" style={{ fontSize: 'clamp(1.5rem, 4vw, 3rem)', lineHeight: 1.2 }}>
              “Everything is pure Croatian product — one with a story that belongs to our land,
              that people will definitely talk about.”
            </p>
            <footer className="data-label-sm mt-[var(--s-5)] text-ivory/55">
              Edivo Vina, in their own words
            </footer>
          </blockquote>
        </div>
      </section>

      <Anatomy />

      <section style={{ paddingBlock: 'var(--sec-y)' }}>
        <div className="ed-in flex flex-wrap items-center gap-[var(--s-5)] border-t border-ivory/16 pt-[var(--s-6)]">
          <p className="t-body max-w-[40ch] text-ivory/72">
            What comes back up is signed by the sea — every vessel differently, because each one
            surfaces wearing its own oysters and coralline.
          </p>
          <Link
            href="/wines"
            className="data-label pressable ml-auto bg-gold px-[var(--s-5)] py-[var(--s-4)] text-abyss transition-colors duration-200 hover:bg-ivory"
          >
            Taste the result — from €17.50
          </Link>
        </div>
      </section>
    </PageShell>
  )
}
