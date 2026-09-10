import Link from 'next/link'

import BottleSlot from '@/components/BottleSlot'
import Station from '@/components/station/Station'
import { station } from '@/data/stations'
import { WINES, featured, undersea } from '@/data/wines'
import { eur } from '@/lib/money'

const S = station('shop')

/**
 * 12 METARA — BOCE. Amfora je smanjena i tone pokraj.
 *
 * Vode tri „featured" iz kataloga: TRIS, Amphora i Sea Bottle. Cijene su
 * vidljive odmah — bez toga stranica cita kao muzej, a ovo je trgovina.
 *
 * Tri jednaka stupca. Nejednaki grid bi tvrdio da su razlicito vazne, a sve
 * tri su ista vrsta dokaza; razlikuje ih samo koliko je more bilo ukljuceno.
 */
const NOTE: Record<string, string> = {
  'navis-mysterium-tris':
    'Three bottles: cellar, sea in glass, sea in clay. The only way to hear the difference.',
  'navis-mysterium-undersea-amphora': '700 days in sealed clay.',
  'navis-mysterium-undersea-bottle': '700 days in glass, on the same seabed.',
}

export default function Shop() {
  const three = featured()

  return (
    <Station data={S} side="r" style={{ paddingBlock: 'var(--sec-y)' }}>
      <div className="ed-in relative z-10">
        <p className="data-label text-gold">{S.light}</p>

        <div className="mt-[var(--s-5)] flex flex-wrap items-end justify-between gap-[var(--s-4)]">
          <h2 id={`${S.id}-h`} className="t-plate max-w-[16ch] text-ivory">
            Shop
          </h2>
          <p className="data-label-sm text-ivory/60">
            {WINES.length} wines · {undersea().length} from the seabed
          </p>
        </div>

        <ul className="mt-[var(--sec-y-tight)] grid grid-cols-1 gap-[var(--s-6)] sm:grid-cols-3">
          {three.map((w) => (
            <li key={w.slug}>
              <Link href={`/product/${w.slug}`} className="pressable flex flex-col">
                <BottleSlot
                  image={w.image}
                  alt={w.name}
                  sizes="(min-width: 640px) 30vw, 92vw"
                />
                <span className="mt-[var(--s-4)] flex items-baseline justify-between gap-[var(--s-3)] border-t border-ivory/16 pt-[var(--s-3)]">
                  <span className="t-title text-ivory">{w.name}</span>
                  <span className="t-title tnum shrink-0 text-ivory">{eur(w.price)}</span>
                </span>
                <span className="t-field mt-[var(--s-2)] block text-ivory/65">{NOTE[w.slug]}</span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Grid je najava, ne katalog — deset vina zivi na /wines. */}
        <div className="mt-[var(--s-6)] flex flex-wrap items-center gap-[var(--s-4)]">
          <Link
            href="/wines"
            className="data-label pressable border border-gold/45 px-[var(--s-5)] py-[var(--s-4)] text-gold transition-colors duration-200 hover:bg-gold hover:text-abyss"
          >
            All {WINES.length} wines
          </Link>
          <p className="t-field max-w-[32ch] text-ivory/60">
            Including the €39 bottle that never left the cellar.
          </p>
        </div>
      </div>
    </Station>
  )
}
