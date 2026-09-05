import Link from 'next/link'
import Record from './record/Record'
import { WINES, undersea, cellar } from '@/data/wines'

/**
 * KATALOG — vodi stranicu (odluka klijenta: stranica je trgovina).
 *
 * Zapisi su ploce koje plutaju nad vodom; razmak izmedu njih JE voda, pa amfora
 * prolazi izmedu njih. Nema okvira sekcije, nema pozadine — samo naslov u vodi
 * i mreza ploca.
 *
 * Argument koji opravdava €382 ne zivi u zasebnoj sekciji nego u POLJIMA svakog
 * zapisa (CTX −25 m, DUR 700 d), pa putuje s proizvodom.
 */
export default function Catalogue() {
  const sea = undersea()
  const land = cellar()
  const total = WINES.length

  return (
    <section id="catalogue" style={{ paddingBlock: 'var(--sec-y)' }} className="relative z-10 px-5 md:px-8">
      <div className="mx-auto w-full max-w-[92rem]">
        {/* Naslov stoji U VODI, ne na ploci — ploce su za zapise */}
        <div className="flex flex-wrap items-baseline justify-between gap-[var(--s-4)]">
          <h2 className="t-plate text-ivory">The catalogue</h2>
          <p className="t-stamp text-ivory/45">
            {total} finds · {sea.length} raised from −25 m
          </p>
        </div>

        <ul
          className="mt-[var(--s-7)] grid grid-cols-1 gap-[var(--s-5)] sm:grid-cols-2 lg:grid-cols-3"
          style={{ gap: 'var(--s-5)' }}
        >
          {sea.map((w, i) => (
            <Record
              key={w.slug}
              wine={w}
              index={WINES.indexOf(w)}
              enter
              delay={i * 60}
              photoSizes="(min-width: 1024px) 24vw, (min-width: 640px) 38vw, 62vw"
            />
          ))}
        </ul>

        <div className="mt-[var(--sec-y-tight)] flex flex-wrap items-baseline justify-between gap-[var(--s-4)]">
          <h3 className="t-title text-ivory">Never left Janjina</h3>
          <p className="t-stamp text-ivory/40">the control group</p>
        </div>

        <ul className="mt-[var(--s-6)] grid grid-cols-1 gap-[var(--s-5)] sm:grid-cols-2 lg:grid-cols-3">
          {land.map((w, i) => (
            <Record
              key={w.slug}
              wine={w}
              index={WINES.indexOf(w)}
              enter
              delay={i * 50}
              photoSizes="(min-width: 1024px) 24vw, (min-width: 640px) 38vw, 62vw"
            />
          ))}
        </ul>

        <Link
          href="/wines"
          className="t-stamp pressable mt-[var(--s-7)] inline-block border-b border-stamp-bright/45 pb-[var(--s-2)] text-stamp-bright"
        >
          Every find in one list →
        </Link>
      </div>
    </section>
  )
}
