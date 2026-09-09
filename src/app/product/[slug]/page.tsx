import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import PageShell from '@/components/page/PageShell'
import Station from '@/components/station/Station'
import BottleSlot from '@/components/BottleSlot'
import Price from '@/components/shop/Price'
import StarRating from '@/components/shop/StarRating'
import ProductCard from '@/components/shop/ProductCard'
import ProductTabs, { type Tab } from '@/components/shop/ProductTabs'
import { station } from '@/data/stations'
import { WINES, bySlug } from '@/data/wines'
import { productClass, CATEGORY_LABEL } from '@/lib/woo'
import type { Wine } from '@/data/wines'

const S = station('shop')

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
  if (!w) return {}
  return {
    title: `${w.name} — Edivo Vina`,
    description: w.shortDescription,
  }
}

/** `single-product/product-attributes.php` — puni tab „Additional information". */
function attributes(w: Wine): [string, string][] {
  const rows: [string, string][] = [
    ['Variety', w.grapes.join(', ')],
    ['Colour', w.colour === 'rose' ? 'Rosé' : w.colour[0].toUpperCase() + w.colour.slice(1)],
    ['Volume', w.volume],
  ]
  if (w.vintage) rows.push(['Vintage', String(w.vintage)])
  if (w.abv) rows.push(['Alcohol', `${w.abv}%`])
  rows.push([
    'Ageing',
    w.daysUnderSea ? `${w.daysUnderSea} days on the seabed, 18–25 m` : 'Cellar in Janjina',
  ])
  return rows
}

/**
 * `/product/[slug]` — WooCommerce single product.
 *
 * Redoslijed je Woov (`content-single-product.php` + hookovi):
 *   gallery | summary (title, rating, price, short description, cart, meta)
 *   -> tabs (Description / Additional information / Reviews)
 *   -> related products
 *
 * NEMA `PageHead`: Woo stavlja `h1.product_title` u summary stupac, a dva h1
 * na stranici su kvar koji `check-routes.mjs` lovi. Signature gramatika je i
 * dalje tu — zlatna oznaka, koordinata dubine u margini, hairline — samo je
 * veliki naslov ondje gdje ga Woo drzi.
 *
 * NB za rebuild: prava Woo galerija nosi inline `style="opacity: 0"` koji
 * FlexSlider gasi nakon inita. Ako skripta ne prodje kroz builder, galerija
 * ostane NEVIDLJIVA — klasicna page-builder + Woo zamka. Ovdje toga namjerno
 * nema; ne nasljeduj ga.
 */
export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const w = bySlug(slug)
  if (!w) notFound()

  const related = WINES.filter(
    (x) => x.slug !== w.slug && x.categories.some((c) => w.categories.includes(c)),
  )
    .sort((a, b) => a.menuOrder - b.menuOrder)
    .slice(0, 3)

  const tabs: Tab[] = [
    {
      key: 'description',
      label: 'Description',
      panel: <p className="t-body text-ivory/75">{w.description}</p>,
    },
    {
      key: 'additional_information',
      label: 'Additional information',
      panel: (
        <table className="woocommerce-product-attributes shop_attributes w-full max-w-[34rem]">
          <tbody>
            {attributes(w).map(([k, v]) => (
              <tr
                key={k}
                className={`woocommerce-product-attributes-item woocommerce-product-attributes-item--${k.toLowerCase()}`}
              >
                <th className="woocommerce-product-attributes-item__label data-label border-t border-ivory/12 py-[var(--s-3)] pr-[var(--s-5)] text-left align-top text-ivory/60">
                  {k}
                </th>
                <td className="woocommerce-product-attributes-item__value t-field border-t border-ivory/12 py-[var(--s-3)] text-ivory/85">
                  {v}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ),
    },
    {
      key: 'reviews',
      label: 'Reviews',
      panel: (
        <p className="t-field max-w-[46ch] text-ivory/60">
          {w.rating
            ? `Rated ${w.rating.toFixed(2)} out of 5 on edivovina.hr. Individual reviews are held in WooCommerce.`
            : 'No reviews yet. Reviews are held in WooCommerce.'}
        </p>
      ),
    },
  ]

  return (
    <PageShell data={S}>
      <Station data={S} side="r" stage={false} className="pt-[var(--s-10)]">
        <div className="ed-in relative z-10">
          {/* Breadcrumb je stvarno u Woou (`woocommerce_breadcrumb`, prioritet 20). */}
          <nav aria-label="Breadcrumb" className="data-label-sm text-ivory/55">
            <Link href="/wines" className="inline-flex min-h-11 items-center hover:text-gold">
              Wines
            </Link>
            {w.categories.includes('undersea') && (
              <>
                <span aria-hidden> / </span>
                <Link href="/wines/undersea" className="inline-flex min-h-11 items-center hover:text-gold">
                  Undersea
                </Link>
              </>
            )}
          </nav>

          <p className="ed-fade data-label mt-[var(--s-5)] text-gold" style={{ animationDelay: '0.12s' }}>
            {S.light}
          </p>

          <div id={`product-${w.sku}`} className={productClass(w)}>
            <div className="mt-[var(--s-6)] grid gap-[var(--s-7)] md:grid-cols-2 md:gap-[var(--s-8)]">
              {/* `woocommerce_show_product_images` — jedna slika po proizvodu je
                  sve sto imaju; `--with-images` i data-columns su Woovi. */}
              <div
                className="woocommerce-product-gallery woocommerce-product-gallery--with-images woocommerce-product-gallery--columns-4 images"
                data-columns="4"
              >
                <div className="woocommerce-product-gallery__wrapper">
                  <div className="woocommerce-product-gallery__image">
                    <BottleSlot
                      image={w.image}
                      alt={w.name}
                      sizes="(min-width: 768px) 46vw, 92vw"
                      priority
                    />
                  </div>
                </div>
              </div>

              <div className="summary entry-summary flex flex-col">
                <h1 id={`${S.id}-h`} className="product_title entry-title t-plate text-ivory">
                  {w.name}
                </h1>

                {w.rating && (
                  <div className="woocommerce-product-rating mt-[var(--s-4)] flex items-center gap-[var(--s-3)]">
                    <StarRating rating={w.rating} />
                    <span className="data-label-sm text-ivory/55">
                      Rated {w.rating.toFixed(2)} out of 5
                    </span>
                  </div>
                )}

                <Price
                  as="p"
                  value={w.price}
                  sale={w.salePrice}
                  className="t-plate tnum mt-[var(--s-4)] text-ivory"
                />

                <div className="woocommerce-product-details__short-description t-body mt-[var(--s-5)] text-ivory/75">
                  <p>{w.shortDescription}</p>
                </div>

                {/* `add-to-cart/simple.php`. Kosarica se spaja u WooCommerceu,
                    pa su i polje i gumb ONEMOGUCENI — isti postupak kao
                    newsletter u footeru. Nikad lazan `action="#"`. */}
                <form className="cart mt-[var(--s-6)] flex flex-wrap items-stretch gap-[var(--s-3)]">
                  <div className="quantity">
                    <label htmlFor={`quantity_${w.sku}`} className="screen-reader-text sr-only">
                      {w.name} quantity
                    </label>
                    <input
                      type="number"
                      id={`quantity_${w.sku}`}
                      name="quantity"
                      className="input-text qty text w-[4.5rem] border border-ivory/25 bg-transparent px-[var(--s-3)] py-[var(--s-3)] text-center text-ivory disabled:opacity-60"
                      defaultValue={1}
                      min={1}
                      step={1}
                      disabled
                    />
                  </div>
                  <button
                    type="submit"
                    name="add-to-cart"
                    value={w.sku}
                    disabled
                    title="The cart is wired in WooCommerce"
                    className="single_add_to_cart_button button alt data-label pressable bg-gold px-[var(--s-5)] py-[var(--s-4)] text-abyss disabled:opacity-60"
                  >
                    Add to cart
                  </button>
                </form>

                <p className="t-field mt-[var(--s-4)] max-w-[36ch] text-ivory/60">
                  Shipped from Janjina by UPS, DPD or DHL, dispatched within 24 hours. Customs is
                  paid by the buyer.
                </p>

                {/* `single-product/meta.php` */}
                <div className="product_meta data-label-sm mt-[var(--s-6)] flex flex-wrap gap-x-[var(--s-5)] gap-y-[var(--s-2)] border-t border-ivory/14 pt-[var(--s-4)] text-ivory/55">
                  <span className="sku_wrapper">
                    SKU: <span className="sku text-ivory/80">{w.sku}</span>
                  </span>
                  <span className="posted_in">
                    {w.categories.length > 1 ? 'Categories' : 'Category'}:{' '}
                    {w.categories.map((c, i) => (
                      <span key={c}>
                        {i > 0 && ', '}
                        <Link
                          href={c === 'wines' ? '/wines' : `/wines/${c}`}
                          className="inline-flex min-h-11 items-center text-ivory/80 hover:text-gold"
                        >
                          {CATEGORY_LABEL[c] ?? c}
                        </Link>
                      </span>
                    ))}
                  </span>
                  {w.tags.length > 0 && (
                    <span className="tagged_as">
                      {w.tags.length > 1 ? 'Tags' : 'Tag'}:{' '}
                      <span className="text-ivory/80">{w.tags.join(', ')}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-[var(--sec-y)]">
              <ProductTabs tabs={tabs} />
            </div>

            {related.length > 0 && (
              <section className="related products mt-[var(--sec-y)]" aria-labelledby="related-h">
                <h2 id="related-h" className="t-title text-ivory">
                  Related products
                </h2>
                <ul className="products columns-3 mt-[var(--s-6)] grid grid-cols-1 gap-x-[var(--s-6)] gap-y-[var(--s-8)] sm:grid-cols-2 lg:grid-cols-3">
                  {related.map((r) => (
                    <ProductCard
                      key={r.slug}
                      w={r}
                      sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
                    />
                  ))}
                </ul>
              </section>
            )}
          </div>
        </div>
      </Station>
    </PageShell>
  )
}
