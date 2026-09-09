import Link from 'next/link'
import BottleSlot from '@/components/BottleSlot'
import Price from '@/components/shop/Price'
import StarRating from '@/components/shop/StarRating'
import { productClass } from '@/lib/woo'
import type { Wine } from '@/data/wines'

/**
 * `content-product.php` — jedna kartica, u Woo redoslijedu.
 *
 * JEDNA STRUKTURNA STVAR koju rebuild mora znati: Woo zatvara link-wrapper na
 * prioritetu 5 hooka `woocommerce_after_shop_loop_item`, a Add to cart je
 * prioritet 10 — dakle gumb je SIBLING linka, ne dijete. Ovdje je isto tako.
 * Ugniježđeni <a> u <a> je i nevalidan HTML.
 *
 * Slika ide kroz `BottleSlot`, nikad kroz `Frame` direktno — to je njegov
 * dokumentirani ugovor, da Petrove 3D boce kasnije mijenjaju jedan fajl.
 */
export default function ProductCard({ w, sizes }: { w: Wine; sizes: string }) {
  return (
    <li className={`${productClass(w)} flex flex-col`}>
      <Link
        href={`/product/${w.slug}`}
        className="woocommerce-LoopProduct-link woocommerce-loop-product__link pressable group flex flex-col"
      >
        <BottleSlot image={w.image} alt={w.name} sizes={sizes} />

        <span className="mt-[var(--s-4)] flex items-baseline justify-between gap-[var(--s-3)] border-t border-ivory/16 pt-[var(--s-3)]">
          <span className="woocommerce-loop-product__title t-title text-ivory">{w.name}</span>
          <Price value={w.price} sale={w.salePrice} className="t-title tnum shrink-0 text-ivory" />
        </span>

        <span className="mt-[var(--s-2)] flex items-center gap-[var(--s-3)]">
          <StarRating rating={w.rating} />
          <span className="data-label-sm text-ivory/50">{w.volume}</span>
        </span>

        <span className="t-field mt-[var(--s-2)] block max-w-[34ch] text-ivory/65">
          {w.shortDescription}
        </span>
      </Link>

      {/* Kosarica se spaja u WooCommerceu, pa je gumb ONEMOGUCEN a ne lazan
          link — isti postupak kao newsletter u footeru. Klase su Woove da ih
          Breakdance rebuild nade. Tiha varijanta, ne zlatna: deset zlatnih
          gumba u gridu tuklo bi se s jedinim pravim CTA-om na stranici
          proizvoda. */}
      <button
        type="button"
        disabled
        aria-label={`Add “${w.name}” to your cart`}
        title="The cart is wired in WooCommerce"
        className="button product_type_simple add_to_cart_button data-label mt-[var(--s-4)] w-full border border-ivory/25 px-[var(--s-4)] py-[var(--s-3)] text-ivory/70 disabled:opacity-60"
      >
        Add to cart
      </button>
    </li>
  )
}
