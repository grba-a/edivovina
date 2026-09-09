import { eurWoo } from '@/lib/money'

/**
 * Cijena u Woo markupu, do zadnjeg spana — `wc_price()` iz
 * `wc-formatting-functions.php`. `<bdi>` i `translate="no"` su stvarno tamo.
 *
 * `as`: u loopu je `<span class="price">`, na stranici proizvoda `<p class="price">`.
 */
export default function Price({
  value,
  sale,
  as: Tag = 'span',
  className = '',
}: {
  value: number
  sale?: number
  as?: 'span' | 'p'
  className?: string
}) {
  const amount = (n: number) => (
    <span className="woocommerce-Price-amount amount">
      <bdi>
        <span className="woocommerce-Price-currencySymbol" translate="no" dir="auto">
          €
        </span>
        {eurWoo(n).slice(1)}
      </bdi>
    </span>
  )

  if (sale === undefined) {
    return <Tag className={`price ${className}`}>{amount(value)}</Tag>
  }

  /* Sniženje: `aria-hidden` + `screen-reader-text` par je aktualni Woo core —
     stariji tutoriali pokazuju goli <del>/<ins>. */
  return (
    <Tag className={`price ${className}`}>
      <del aria-hidden="true">{amount(value)}</del>
      <span className="screen-reader-text">Original price was: {eurWoo(value)}.</span>
      <ins aria-hidden="true">{amount(sale)}</ins>
      <span className="screen-reader-text">Current price is: {eurWoo(sale)}.</span>
    </Tag>
  )
}
