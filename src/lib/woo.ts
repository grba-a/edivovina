/**
 * WooCommerce skeleta — imena, klase i redoslijed onako kako Woo stvarno radi.
 *
 * Ovaj web je PREDLOZAK: shop se kasnije gradi u Breakdance + WooCommerce, pa
 * je svaka klasa ovdje dogovor s onim developerom. Zato su nazivi i redoslijed
 * prepisani iz Woo templatea (`loop/result-count.php`, `loop/orderby.php`,
 * `content-product.php`), a ne izmisljeni.
 *
 * VAZNO za presnimavanje: Breakdance-ov vlastiti "Shop Page" element emitira
 * `bde-` klase, NE Woo klase. Da bi ovo bilo 1:1 mapiranje, rebuild mora
 * koristiti Kadence-ove native Woo template, a Breakdance elemente stavljati
 * OKO loopa (zaglavlja, filteri, banneri). Njihova tema je Kadence, pa je to
 * izvedivo.
 */
import type { Wine } from '@/data/wines'

/** Tocne oznake iz `loop/orderby.php`. Ne skracivati — developer ih trazi. */
export const ORDERBY = [
  { value: 'menu_order', label: 'Default sorting' },
  { value: 'popularity', label: 'Sort by popularity' },
  { value: 'rating', label: 'Sort by average rating' },
  { value: 'date', label: 'Sort by latest' },
  { value: 'price', label: 'Sort by price: low to high' },
  { value: 'price-desc', label: 'Sort by price: high to low' },
] as const

export type Orderby = (typeof ORDERBY)[number]['value']

/**
 * Sortiranje. Tri od sest opcija Woo vozi iz podataka koje predlozak nema
 * (`total_sales`, pravi `post_date`, broj recenzija), pa su ovdje aproksimirane
 * iz onoga sto je provjerljivo — i to je namjerno zapisano, ne sakriveno:
 *
 *   popularity  -> ocjena, pa njihov redoslijed u shopu.
 *                  Woo ovo vozi iz `total_sales`, koji ce dati WordPress.
 *   rating      -> `rating` (stvarno, s njihovog sitea: 5.00 na sest od deset)
 *   date        -> `dateCreated` (provizorno, iz putanje medijske biblioteke)
 */
export function sortWines(list: Wine[], orderby: Orderby): Wine[] {
  const w = [...list]
  switch (orderby) {
    case 'price':
      return w.sort((a, b) => a.price - b.price || a.menuOrder - b.menuOrder)
    case 'price-desc':
      return w.sort((a, b) => b.price - a.price || a.menuOrder - b.menuOrder)
    case 'rating':
      return w.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0) || a.menuOrder - b.menuOrder)
    case 'popularity':
      return w.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0) || a.menuOrder - b.menuOrder)
    case 'date':
      return w.sort((a, b) => b.dateCreated.localeCompare(a.dateCreated) || a.menuOrder - b.menuOrder)
    default:
      return w.sort((a, b) => a.menuOrder - b.menuOrder)
  }
}

/**
 * Tocan tekst iz `loop/result-count.php`. Paginirani oblik („Showing 1–10 of
 * 10 results") pali se SAMO kad `total > per_page` — s deset vina na jednoj
 * stranici Woo ispise „Showing all 10 results".
 */
export function resultCount(shown: number, total: number, perPage = 12) {
  if (total === 1) return 'Showing the single result'
  if (total <= perPage) return `Showing all ${total} results`
  return `Showing 1–${shown} of ${total} results`
}

/** `wc_product_class()` — klase na li.product. post-N daje WordPress. */
export function productClass(w: Wine) {
  return [
    'product',
    'type-product',
    'status-publish',
    w.stockStatus,
    ...w.categories.map((c) => `product_cat-${c}`),
    ...w.tags.map((t) => `product_tag-${t}`),
    'has-post-thumbnail',
    w.featured ? 'featured' : '',
    'taxable',
    'shipping-taxable',
    'purchasable',
    'product-type-simple',
  ]
    .filter(Boolean)
    .join(' ')
}

/** Ljudsko ime kategorije — njihovi H1 na /wines i /wines/undersea. */
export const CATEGORY_LABEL: Record<string, string> = {
  wines: 'Wines',
  undersea: 'Undersea',
}
