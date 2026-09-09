import type { Metadata } from 'next'
import Link from 'next/link'
import PageShell from '@/components/page/PageShell'
import PageHead from '@/components/page/PageHead'
import WooLoop from '@/components/shop/WooLoop'
import { station } from '@/data/stations'
import { WINES, undersea, byMenuOrder, bySlug, THE_THREE } from '@/data/wines'
import { eur } from '@/lib/money'

const S = station('shop')

export const metadata: Metadata = {
  title: 'Wines — Edivo Vina',
  description:
    'Ten wines from Janjina on the Pelješac peninsula. Four of them spent 700 days on the seabed, 18 to 25 metres down.',
}

const PRICES = WINES.map((w) => w.price)

/**
 * /wines — WooCommerce arhiva na 12 m.
 *
 * Dubina je postaja `shop` s naslovnice, ista na kojoj su tamo tri boce: „na
 * dvanaest metara nestane narancasto". Podstranica je prosirena verzija svoje
 * postaje, pa nista novo ne treba izmisliti.
 *
 * RUTE: arhiva je /wines, kategorija /wines/undersea, a proizvodi /product/[slug]
 * — tocno njihova ziva struktura. Dvorazinski /wines/[slug] bi se zabio u
 * /wines/undersea, koja je njihova stvarna Woo kategorija.
 */
export default function WinesPage() {
  const three = THE_THREE.map((slug) => bySlug(slug)!)

  return (
    <PageShell data={S}>
      <PageHead
        data={S}
        side="r"
        lines={[`${WINES.length} wines.`, `${undersea().length} went down.`]}
        intro="One wine, three lives — the cellar, the sea in glass, the sea in clay. The rest of the list is Pelješac as it has always been."
        readout={`${eur(Math.min(...PRICES))} — ${eur(Math.max(...PRICES))}`}
      />

      {/* TRI — argument prije cjenika. Isti redoslijed u kojem se piju, i tri
          cijene u jednom kadru: bez €39 kontrole €382 nema s cime usporediti. */}
      <section aria-labelledby="three-h" style={{ paddingBlock: 'var(--sec-y-tight)' }}>
        <div className="ed-in">
          <h2 id="three-h" className="t-title text-ivory">
            The same wine, three ways
          </h2>
          <ol className="mt-[var(--s-5)] grid gap-[var(--s-4)] sm:grid-cols-3">
            {three.map((w, i) => (
              <li
                key={w.slug}
                className="flex flex-col border border-ivory/14 bg-surface p-[var(--s-4)]"
              >
                <span className="data-label-sm text-gold">
                  {['Cellar', 'Sea, in glass', 'Sea, in clay'][i]}
                </span>
                <Link
                  href={`/product/${w.slug}`}
                  className="t-title mt-[var(--s-3)] inline-flex min-h-11 items-center text-ivory hover:text-gold"
                >
                  {w.name}
                </Link>
                <span className="t-field mt-auto pt-[var(--s-4)] text-ivory/65">
                  {w.daysUnderSea ? `${w.daysUnderSea} days below` : 'Never left the building'}
                </span>
                <span className="t-title tnum mt-[var(--s-2)] text-ivory">{eur(w.price)}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-label="Product catalogue" style={{ paddingBottom: 'var(--sec-y)' }}>
        <div className="ed-in">
          {/* `woocommerce_archive_description` + kategorije. Njihove dvije Woo
              kategorije, s njihovim H1 imenima. */}
          <nav aria-label="Product categories" className="mb-[var(--s-5)] flex gap-[var(--s-4)]">
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
