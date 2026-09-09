import type { Metadata } from 'next'
import Link from 'next/link'
import PageShell from '@/components/page/PageShell'
import PageOpen from '@/components/page/PageOpen'
import WooLoop from '@/components/shop/WooLoop'
import Station from '@/components/station/Station'
import Frame from '@/components/ui/Frame'
import { station } from '@/data/stations'
import { WINES, undersea, byMenuOrder, bySlug, THE_THREE } from '@/data/wines'
import { eur } from '@/lib/money'

const S = station('shop')

export const metadata: Metadata = {
  title: 'Wines — Edivo Vina',
  description:
    'Ten wines from Janjina on the Pelješac peninsula. Four of them spent 700 days on the seabed.',
}

const PRICES = WINES.map((w) => w.price)
const STEP = ['Cellar', 'Sea, in glass', 'Sea, in clay']

/**
 * /wines — WooCommerce arhiva na 12 m, postaja `shop`.
 *
 * Tri sekcije, i to je sve: otvaranje, argument, katalog.
 *
 * Argument je naslovnicina potpisna kompozicija — proza lijevo, kadar koji
 * probija rub ekrana desno — a nosi CJENOVNU LJESTVICU. Prije su tu stajale
 * tri jednake uokvirene kutije s €39 / €117 / €382 u istoj velicini, bez
 * ijedne fotografije: tri pravokutnika koja tvrde da su jednako vazna, dok je
 * cijela poanta razlika izmedu njih. Ljestvica na vlasovnim linijama pokazuje
 * skok; kartica ga skriva.
 */
export default function WinesPage() {
  const three = THE_THREE.map((slug) => bySlug(slug)!)
  const amphora = three[2]

  return (
    <PageShell data={S}>
      <PageOpen
        data={S}
        side="l"
        title={`${WINES.length} wines. ${undersea().length} went down.`}
        lead="One wine, three lives — the cellar, the sea in glass, the sea in clay. The rest of the list is Pelješac as it has always been."
        meta={`${eur(Math.min(...PRICES))} — ${eur(Math.max(...PRICES))}`}
      />

      {/* Koordinata dubine zivi OVDJE, na prvoj sadrzajnoj sekciji — na
          otvaranju je ulazila pod fiksni header. */}
      <Station data={S} side="r" stage={false} style={{ paddingTop: 'var(--sec-y-tight)', paddingBottom: 'var(--sec-y)' }}>
        <div className="ed-in relative z-10">
          <div className="grid gap-[var(--s-7)] md:grid-cols-[1fr_0.9fr] md:items-end md:gap-[var(--s-8)]">
            <div>
              <h2 className="t-plate max-w-[15ch] text-ivory">Three bottles, one barrel.</h2>
              <p className="t-body mt-[var(--s-5)] text-ivory/72">
                The same wine, the same vintage, the same barrel, split three ways. One stayed in
                the cellar. One went into the sea in glass. One went into clay, then into the sea.
                The only variable is the water.
              </p>
              {/* Umjerena fotografija u stupcu — 26rem, ne kadar preko ekrana. */}
              <div className="ed-plate mt-[var(--s-6)] max-w-[26rem]">
                <Frame
                  name="lift-water"
                  alt="An amphora lifted clear of the sea after two years, still wearing its oysters"
                  sizes="(min-width: 768px) 26rem, 92vw"
                  ratio={3 / 2}
                  position="50% 38%"
                  className="w-full"
                />
              </div>

            </div>

            {/* Ljestvica: skok od kontrole do predmeta u tri reda. Prije su ovdje
                stajale tri jednake uokvirene kutije s cijenama u istoj velicini —
                tri pravokutnika koja tvrde da su jednako vazna, a cijela poanta je
                razlika. */}
            <div>
              <dl>
                {three.map((w, i) => (
                  <div key={w.slug} className="ed-row">
                    <dt className="data-label shrink-0 text-gold">{STEP[i]}</dt>
                    <span aria-hidden className="ed-rule" />
                    <dd className="t-title tnum shrink-0 text-ivory">{eur(w.price)}</dd>
                  </div>
                ))}
              </dl>
              <p className="t-field mt-[var(--s-4)] max-w-[34ch] text-ivory/60">
                Ten times the price of the control, and nothing about the wine was changed.
              </p>
              <Link
                href={`/product/${amphora.slug}`}
                className="data-label pressable mt-[var(--s-5)] inline-block bg-gold px-[var(--s-5)] py-[var(--s-4)] text-abyss transition-colors duration-200 hover:bg-ivory"
              >
                See the amphora — {eur(amphora.price)}
              </Link>
            </div>
          </div>
        </div>
      </Station>

      <section aria-label="Product catalogue" style={{ paddingBottom: 'var(--sec-y)' }}>
        <div className="ed-in">
          <nav aria-label="Product categories" className="mb-[var(--s-4)] flex gap-[var(--s-5)]">
            <span aria-current="page" className="data-label inline-flex min-h-11 items-center border-b border-gold text-gold">
              All wines
            </span>
            <Link
              href="/wines/undersea"
              className="data-label inline-flex min-h-11 items-center border-b border-transparent text-ivory/70 hover:text-gold"
            >
              Undersea ({undersea().length})
            </Link>
          </nav>

          <WooLoop wines={byMenuOrder()} />
        </div>
      </section>
    </PageShell>
  )
}
