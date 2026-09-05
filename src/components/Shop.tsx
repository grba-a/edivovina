import Link from 'next/link'
import BottleSlot from '@/components/BottleSlot'
import Station from '@/components/station/Station'
import { STATIONS } from '@/data/stations'
import { WINES, featured } from '@/data/wines'

const S = STATIONS[2]

const eur = (n: number) => '€' + (Number.isInteger(n) ? String(n) : n.toFixed(2).replace('.', ','))

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
  'navis-mysterium-tris': 'Tri boce: podrum, more u staklu, more u glini. Jedini način da se čuje razlika.',
  'navis-mysterium-amphora': '700 dana u zapečaćenoj glini.',
  'navis-mysterium-sea-bottle': '700 dana u staklu, na istom dnu.',
}

export default function Shop() {
  const three = featured()

  return (
    <Station data={S} side="r" style={{ paddingBlock: 'var(--sec-y)' }}>
      <div className="relative z-10 mx-auto w-full max-w-[var(--wrap)] px-5 md:px-8">
        <p className="data-label text-gold">{S.light}</p>

        <div className="mt-[var(--s-5)] flex flex-wrap items-end justify-between gap-[var(--s-4)]">
          <h2 id={`${S.id}-h`} className="t-plate max-w-[16ch] text-ivory">
            Tri koje su bile dolje.
          </h2>
          <p className="data-label text-ivory/40" style={{ fontSize: '0.5rem' }}>
            {WINES.length} vina u ponudi · 4 s dna
          </p>
        </div>

        <ul className="mt-[var(--sec-y-tight)] grid grid-cols-1 gap-[var(--s-6)] sm:grid-cols-3">
          {three.map((w, i) => (
            <li key={w.slug}>
              <Link href={`/wines/${w.slug}`} className="pressable flex flex-col">
                <BottleSlot
                  image={w.image}
                  alt={w.name}
                  priority={i === 0}
                  sizes="(min-width: 640px) 30vw, 92vw"
                />
                <span className="mt-[var(--s-4)] flex items-baseline justify-between gap-[var(--s-3)] border-t border-ivory/16 pt-[var(--s-3)]">
                  <span className="t-title text-ivory">{w.name}</span>
                  <span className="t-title tnum shrink-0 text-ivory">{eur(w.price)}</span>
                </span>
                <span className="t-field mt-[var(--s-2)] block text-ivory/55">{NOTE[w.slug]}</span>
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="/wines"
          /* py-3 digne hit area s 26 na 44 px; rub ostaje na istom mjestu jer
             ga nosi span, ne sam link. */
          className="data-label pressable mt-[var(--s-7)] inline-flex items-center py-[var(--s-3)] text-gold"
        >
          <span className="border-b border-gold/50 pb-[var(--s-2)]">Vidi svih {WINES.length} →</span>
        </Link>
      </div>
    </Station>
  )
}
