import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import PageShell from '@/components/page/PageShell'
import PageHead from '@/components/page/PageHead'
import WooLoop from '@/components/shop/WooLoop'
import { station } from '@/data/stations'
import { WINES, byMenuOrder, undersea } from '@/data/wines'
import { CATEGORY_LABEL } from '@/lib/woo'
import { eur } from '@/lib/money'

const S = station('shop')

/** Njihove stvarne Woo kategorije. `wines` je arhiva /wines, pa ostaje van. */
const CATEGORIES = ['undersea'] as const

export function generateStaticParams() {
  return CATEGORIES.map((category) => ({ category }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>
}): Promise<Metadata> {
  const { category } = await params
  const label = CATEGORY_LABEL[category]
  if (!label) return {}
  return {
    title: `${label} — Edivo Vina`,
    description:
      'The wines that spent 700 days on the seabed off Pelješac, around twenty metres down.',
  }
}

/**
 * `/wines/undersea` — Woo product_cat arhiva, ista kao kod njih (breadcrumb
 * Home / Shop / Wines / Undersea, H1 „Undersea", cetiri proizvoda).
 *
 * Cetiri, a ne pet: Eros se zove „Sea Bottle" ali NIJE u njihovoj undersea
 * kategoriji i njegov opis nikad ne tvrdi da je bio pod morem. Vidi wines.ts.
 */
export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category } = await params
  if (!CATEGORIES.includes(category as (typeof CATEGORIES)[number])) notFound()

  const list = byMenuOrder().filter((w) => w.categories.includes(category))
  const prices = list.map((w) => w.price)

  return (
    <PageShell data={S}>
      <PageHead
        data={S}
        side="r"
        lines={['Undersea.', `${list.length} of ten.`]}
        intro="Seven hundred days with no light and no vibration, at twice the pressure of the surface. Each one comes back carrying something different."
        readout={`${eur(Math.min(...prices))} — ${eur(Math.max(...prices))}`}
      />

      <section aria-label="Product catalogue" style={{ paddingBottom: 'var(--sec-y)' }}>
        <div className="ed-in">
          <nav aria-label="Product categories" className="mb-[var(--s-5)] flex gap-[var(--s-4)]">
            <Link
              href="/wines"
              className="data-label inline-flex min-h-11 items-center border-b border-transparent text-ivory/70 hover:text-gold"
            >
              All wines ({WINES.length})
            </Link>
            <span aria-current="page" className="data-label inline-flex min-h-11 items-center border-b border-gold text-gold">
              Undersea ({undersea().length})
            </span>
          </nav>

          <WooLoop wines={list} />
        </div>
      </section>
    </PageShell>
  )
}
