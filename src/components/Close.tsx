import Link from 'next/link'

/**
 * ZATVARANJE — ostaje VODA, ne ploca.
 *
 * Ovdje amfora sjeda u varenu armaturu na dnu, pa svijetla ploca bi je
 * prekrila. Zato je ovo jedina sekcija ispod hera bez ploce: samo dno, dvije
 * odluke i nista drugo u kadru.
 */
export default function Close() {
  return (
    <section
      id="close"
      style={{ paddingBlock: 'var(--sec-y)' }}
      className="relative z-10 flex min-h-[62svh] items-end px-5 md:px-8"
    >
      <div className="mx-auto w-full max-w-[92rem]">
        <p className="t-stamp text-stamp-bright">Find 011 · the seabed</p>

        <div className="mt-[var(--s-5)] grid gap-[var(--s-6)] md:grid-cols-12 md:items-end">
          <h2 className="t-plate max-w-[18ch] text-ivory md:col-span-6">
            Open one <span className="italic">yourself.</span>
          </h2>

          <div className="md:col-span-5 md:col-start-8">
            <p className="t-body text-ivory/70">
              Every amphora comes up wearing something different, and we never clean the shells
              off. The bar at Drače pours all three side by side; bottles ship worldwide from the
              winery at Janjina.
            </p>
            <div className="mt-[var(--s-5)] flex flex-wrap gap-[var(--s-3)]">
              <Link
                href="/wines"
                className="t-stamp pressable bg-stamp-bright text-abyss"
                style={{ padding: 'var(--s-4) var(--s-5)' }}
              >
                Buy a bottle
              </Link>
              <Link
                href="/visit"
                data-close-cta
                className="t-stamp pressable border border-ivory/30 text-ivory/85 transition-colors duration-200 hover:border-stamp-bright hover:text-stamp-bright"
                style={{ padding: 'var(--s-4) var(--s-5)' }}
              >
                Taste at Drače
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
