import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import PageHero from '@/components/PageHero'
import Footer from '@/components/Footer'
import Frame from '@/components/ui/Frame'
import { WINES, bySlug } from '@/data/wines'

/**
 * PRODUCT TEMPLATE.
 *
 * Ovo je stranica koju Petar mapira na WooCommerce single product. Svaka
 * vrijednost dolazi iz data/wines.ts i ima svoj WooCommerce ekvivalent
 * (vidi komentar na vrhu tog filea). Gumb je NAMJERNO inertan link —
 * kosarica se spaja u WooCommerceu, ne ovdje.
 */

export function generateStaticParams() {
  return WINES.map((w) => ({ slug: w.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const w = bySlug(slug)
  if (!w) return { title: 'Not found — Edivo Vina' }
  return { title: `${w.name} — Edivo Vina`, description: w.shortDescription }
}

const price = (n: number) => '€' + (Number.isInteger(n) ? String(n) : n.toFixed(2).replace('.', ','))

const AGING_LABEL: Record<string, string> = {
  cellar: 'Cellar, Janjina',
  'sea-bottle': 'Seabed, in glass',
  amphora: 'Seabed, in clay',
  set: 'All three',
}

export default async function WinePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const w = bySlug(slug)
  if (!w) notFound()

  const specs: [string, string][] = [
    ['Aged', AGING_LABEL[w.aging]],
    ['Under the sea', w.daysUnderSea > 0 ? `${w.daysUnderSea} days` : 'never'],
    ['Grapes', w.grapes.join(', ')],
    ['Volume', w.volume],
    ...((w.vintage ? [['Vintage', String(w.vintage)]] : []) as [string, string][]),
    ...((w.abv ? [['Alcohol', `${String(w.abv).replace('.', ',')} %`]] : []) as [string, string][]),
    ['Article', w.sku],
  ]

  const others = WINES.filter((x) => x.slug !== w.slug).slice(0, 3)

  return (
    <>
      <main className="relative z-10">
        <PageHero
          eyebrow={`${AGING_LABEL[w.aging]} · ${w.sku}`}
          lines={[w.name]}
          intro={w.shortDescription}
          cta={{ href: '#buy', label: `Take it — ${price(w.price)}` }}
          readout={w.daysUnderSea > 0 ? `${w.daysUnderSea} days · 25 m` : 'cellar aged'}
        />

        <section className="px-5 pb-14 md:px-8 md:pb-24">
          <div className="mx-auto grid w-full max-w-[92rem] gap-12 md:grid-cols-12 md:gap-10">
            <div className="md:col-span-6">
              <Frame
                name={w.image}
                alt={w.name}
                priority
                sizes="(min-width: 768px) 48vw, 100vw"
                ratio="natural"
                className="w-full max-w-[25rem]"
              />
            </div>

            <div className="md:col-span-6 md:pt-2">
              <p className="max-w-[46ch] text-[1.0625rem] leading-[1.75] text-ivory/75">
                {w.description}
              </p>

              <dl className="mt-10 border-t border-ivory/12">
                {specs.map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-6 border-b border-ivory/10 py-4">
                    <dt className="data-label text-ivory/35" style={{ fontSize: '0.5625rem' }}>
                      {k}
                    </dt>
                    <dd className="tnum text-right text-sm text-ivory/85">{v}</dd>
                  </div>
                ))}
              </dl>

              <div id="buy" className="mt-10 flex flex-wrap items-end justify-between gap-6">
                <div>
                  <p className="font-sans tnum text-4xl text-ivory">{price(w.price)}</p>
                  <p className="data-label mt-2 text-ivory/35" style={{ fontSize: '0.5rem' }}>
                    {w.stockStatus === 'instock' ? 'available' : 'sold out'} · VAT included
                  </p>
                </div>
                {/* Kosarica se spaja u WooCommerceu — ovdje je samo predlozak. */}
                <a
                  href="mailto:info@edivovina.hr?subject=Order%20enquiry"
                  className="data-label bg-gold px-7 py-4 text-abyss transition-colors duration-200 hover:bg-ivory"
                >
                  Reserve a bottle
                </a>
              </div>

              <p className="mt-8 max-w-[42ch] text-sm leading-relaxed text-ivory/40">
                Every undersea bottle comes up wearing something different. Shells, coralline, the
                marks of the cage — no two are finished the same way, and we do not clean them off.
              </p>
            </div>
          </div>

          <div className="mx-auto mt-16 w-full max-w-[92rem] border-t border-ivory/12 pt-10">
            <p className="data-label mb-8 text-ivory/35">Also from Edivo</p>
            <ul className="grid gap-x-5 gap-y-10 sm:grid-cols-3">
              {others.map((o) => (
                <li key={o.slug}>
                  <Link href={`/wines/${o.slug}`} className="group block">
                    <Frame
                      name={o.image}
                      alt={o.name}
                      sizes="(min-width: 640px) 30vw, 100vw"
                      ratio="natural"
                      className="w-full transition-opacity duration-300 group-hover:opacity-85"
                    />
                    <div className="mt-4 flex items-start justify-between gap-3">
                      <h3 className="font-display text-lg leading-tight text-ivory">{o.name}</h3>
                      <p className="font-sans tnum shrink-0 text-sm text-ivory/70">{price(o.price)}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
