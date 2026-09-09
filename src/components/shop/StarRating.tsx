/**
 * `woocommerce_template_loop_rating()` — renderira se samo kad su recenzije
 * upaljene i proizvod ima ocjenu. Sest od deset njihovih vina nosi 5.00.
 *
 * Broj recenzija NE izmisljam: njihov loop ga ne ispisuje, pa ga nemamo.
 * Woo bi tu napisao „(N)"; WordPress ce ga dati.
 */
export default function StarRating({ rating }: { rating?: number }) {
  if (!rating) return null
  return (
    <div
      className="star-rating flex items-center gap-[2px]"
      role="img"
      aria-label={`Rated ${rating.toFixed(2)} out of 5`}
    >
      {[0, 1, 2, 3, 4].map((i) => (
        <svg
          key={i}
          aria-hidden
          viewBox="0 0 20 20"
          className="h-[0.7rem] w-[0.7rem]"
          fill={i < Math.round(rating) ? 'var(--color-gold)' : 'none'}
          stroke="var(--color-gold)"
          strokeWidth="1.4"
        >
          <path d="M10 1.6l2.6 5.3 5.8.8-4.2 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.6 7.7l5.8-.8z" />
        </svg>
      ))}
    </div>
  )
}
