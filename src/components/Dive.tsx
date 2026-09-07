import Link from 'next/link'
import Station from '@/components/station/Station'
import { station } from '@/data/stations'
import { bySlug } from '@/data/wines'

const S = station('dive')

const eur = (n: number) => '€' + (Number.isInteger(n) ? String(n) : n.toFixed(2).replace('.', ','))

/**
 * 3 METRA — URANJANJE. Jedina sekcija u kojoj je predmet subjekt.
 *
 * Na fotografiji iznad amfora tek udara u vodu; ovdje pada kroz kadar i tekst
 * stoji OKO nje. Sredinski stupac je namjerno prazan — to nije praznina nego
 * mjesto gdje predmet zivi.
 *
 * DESKTOP: tri stupca, glina lijevo, more desno, amfora izmedu.
 * MOBITEL: nema bocnog prostora, pa ista ideja ide vertikalno — glina gore,
 *   prazan pojas u kojem se predmet vidi, more i akcija ispod. Ovo je drugi
 *   raspored, ne stisnuti desktop.
 *
 * Brojke su izmjerene s 3D modela (PRODUCT.md): 300 x 108 mm. Volumen i cijena
 * dolaze iz kataloga, pa ne mogu otici u drift.
 */
export default function Dive() {
  const amphora = bySlug('navis-mysterium-amphora')!

  return (
    <Station data={S} side="l" className="ed-dive">
      <div className="ed-in relative z-10 flex min-h-[124svh] flex-col pb-[var(--sec-y)] pt-[var(--s-9)]">
        <p className="data-label text-gold">Uranjanje</p>

        <h2 id={`${S.id}-h`} className="t-plate mt-[var(--s-5)] max-w-[13ch] text-ivory">
          Crveno nestaje prvo.
        </h2>

        {/* Predmet zivi u sredisnjem stupcu. Na mobitelu je to prazan pojas. */}
        <div className="ed-dive-band mt-[var(--s-8)]">
          <div className="ed-dive-l">
            <p className="data-label text-gold" style={{ fontSize: '0.5rem' }}>
              Glina
            </p>
            <p className="t-body mt-[var(--s-4)] text-ivory/72">
              Izbačena iz petrinjske gline, začepljena plutom i zapečaćena dvama slojevima gume.
              Trebalo je godinu dana neuspjelih brtvi prije nego je morska voda ostala vani.
            </p>
          </div>

          {/* Prazan pojas: ovdje pada amfora. Visina postoji samo na mobitelu,
              gdje predmet mora dobiti svoj prostor po vertikali. */}
          <div className="ed-dive-gap" aria-hidden />

          {/* Mjere stoje ISPOD predmeta na mobitelu, a u lijevom stupcu na
              desktopu (grid-row 2). Prije su bile u lijevom bloku i na 390px
              su tabularne brojke lezale preko grla amfore. */}
          <dl className="ed-dive-nums t-field max-w-[16rem]">
            {[
              ['Visina', '300 mm'],
              ['Promjer', '108 mm'],
              ['Volumen', amphora.volume],
            ].map(([k, v]) => (
              <div key={k} className="flex items-baseline gap-[var(--s-2)] border-t border-ivory/12 py-[var(--s-2)]">
                <dt className="data-label shrink-0 text-ivory/40" style={{ fontSize: '0.5rem' }}>
                  {k}
                </dt>
                <span aria-hidden className="h-px flex-1 bg-ivory/12" />
                <dd className="tnum shrink-0 text-ivory/80">{v}</dd>
              </div>
            ))}
          </dl>

          <div className="ed-dive-r">
            <p className="data-label text-gold" style={{ fontSize: '0.5rem' }}>
              More
            </p>
            <p className="t-body mt-[var(--s-4)] text-ivory/72">
              Sedamsto dana bez svjetla i bez vibracije, na dvostrukom pritisku površine. Svaka se
              vrati noseći nešto drugo — kamenice, koralinu, oblik kaveza u kojem je visjela.
              Ne čistimo to.
            </p>

            <div className="mt-[var(--s-6)] flex flex-wrap items-center gap-[var(--s-4)]">
              <Link
                href={`/wines/${amphora.slug}`}
                className="data-label pressable bg-gold px-[var(--s-5)] py-[var(--s-4)] text-abyss"
              >
                Uzmi jednu — {eur(amphora.price)}
              </Link>
              <p className="data-label text-ivory/40" style={{ fontSize: '0.5rem' }}>
                serija 1–4000
              </p>
            </div>
          </div>
        </div>
      </div>
    </Station>
  )
}
