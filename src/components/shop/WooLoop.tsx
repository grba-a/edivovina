'use client'

import { useMemo, useState } from 'react'
import ProductCard from '@/components/shop/ProductCard'
import { ORDERBY, resultCount, sortWines, type Orderby } from '@/lib/woo'
import type { Wine } from '@/data/wines'

/**
 * `woocommerce_before_shop_loop` + loop + `woocommerce_after_shop_loop`, u redu:
 *
 *   .woocommerce-result-count   (prioritet 20)
 *   .woocommerce-ordering       (prioritet 30)
 *   ul.products.columns-3       (loop-start.php)
 *   .woocommerce-pagination     (after_shop_loop, prioritet 10)
 *
 * Sortiranje radi KLIJENTSKI. Woo bi tu napravio reload s `?orderby=`, ali
 * mrtav select u predlosku ne bi rekao nista ni Petru ni developeru — ovako se
 * vidi da svih sest opcija stvarno nesto radi.
 *
 * Zato je ovo jedini klijentski dio shopa; kartice su server-renderirane.
 */
export default function WooLoop({ wines }: { wines: Wine[] }) {
  const [orderby, setOrderby] = useState<Orderby>('menu_order')
  const sorted = useMemo(() => sortWines(wines, orderby), [wines, orderby])

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-[var(--s-4)] border-b border-ivory/14 pb-[var(--s-4)]">
        {/* role="status" je stvarno u `loop/result-count.php` */}
        <p className="woocommerce-result-count data-label-sm text-ivory/60" role="status">
          {resultCount(sorted.length, wines.length)}
        </p>

        {/* Nativni select je na ovoj stranici stajao kao sivi sistemski gumb —
            stock kontrola unutar posvecene forme. `appearance-none` + nacrtan
            chevron; strelica je SVG, ne unicode glif. */}
        <form
          className="woocommerce-ordering relative"
          method="get"
          onSubmit={(e) => e.preventDefault()}
        >
          <label htmlFor="woocommerce-orderby" className="sr-only">
            Shop order
          </label>
          <span
            aria-hidden
            className="pointer-events-none absolute right-[var(--s-3)] top-1/2 -translate-y-1/2 text-gold"
          >
            <svg viewBox="0 0 12 8" className="h-[6px] w-[10px]" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M1 1l5 5 5-5" />
            </svg>
          </span>
          <select
            name="orderby"
            id="woocommerce-orderby"
            className="orderby data-label-sm cursor-pointer appearance-none border border-ivory/25 bg-surface py-[var(--s-3)] pl-[var(--s-4)] pr-[var(--s-8)] text-ivory/85 transition-colors hover:border-gold/60"
            value={orderby}
            onChange={(e) => setOrderby(e.target.value as Orderby)}
          >
            {ORDERBY.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <input type="hidden" name="paged" value="1" />
        </form>
      </div>

      <ul className="products columns-3 mt-[var(--s-7)] grid grid-cols-1 gap-x-[var(--s-6)] gap-y-[var(--s-8)] sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((w) => (
          <ProductCard
            key={w.slug}
            w={w}
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
          />
        ))}
      </ul>

      {/* Deset proizvoda stane na jednu stranicu, pa Woo ovdje ne bi ispisao
          nista. Markup stoji jer ga rebuild treba kad katalog naraste —
          `paginate_links()` s 'type' => 'list'. */}
      {wines.length > 12 && (
        <nav className="woocommerce-pagination mt-[var(--s-8)]" aria-label="Product Pagination">
          <ul className="page-numbers flex gap-[var(--s-2)]">
            <li>
              <span aria-current="page" className="page-numbers current data-label-sm px-[var(--s-3)] py-[var(--s-2)] text-gold">
                1
              </span>
            </li>
          </ul>
        </nav>
      )}
    </>
  )
}
