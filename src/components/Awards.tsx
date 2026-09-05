import Image from 'next/image'
import Station from '@/components/station/Station'
import { STATIONS } from '@/data/stations'
import { AWARDS } from '@/data/press'

const S = STATIONS[4]

/**
 * 22 METRA — NAGRADE. Amfora se vraca, mala, uz lijevi rub.
 *
 * Iskrenost je ovdje jaca od uljepsavanja. Najjaca nagrada za KVALITETU VINA
 * je Decanter Silver — i to za Dingac, njihovo nepodmorsko vino. Sve vezano uz
 * Navis Mysterium sa Sabatine je za DIZAJN i pakiranje.
 *
 * To nije slabija nagrada: ovo JE predmet, i nagraden je kao predmet. Ali
 * dizajnerska nagrada predstavljena kao vinska pada na prvi pogled kupca koji
 * zna, a takav kupac je jedini koji plati €382.
 *
 * Medalje su 112 px — koriste se kao zigovi, nikad kao heroji.
 */
export default function Awards() {
  return (
    <Station data={S} side="r" style={{ paddingBlock: 'var(--sec-y)' }}>
      <div className="relative z-10 mx-auto w-full max-w-[var(--wrap)] px-5 md:px-8">
        <p className="data-label text-gold">{S.light}</p>

        <h2 id={`${S.id}-h`} className="t-plate mt-[var(--s-5)] max-w-[18ch] text-ivory">
          Nagrađeni kao predmet.
        </h2>

        <p className="t-body mt-[var(--s-5)] text-ivory/70">
          Sabatina im je dala prvaka <b className="font-normal text-ivory">za dizajn amfore</b>, ne
          za vino u njoj. To nije slabija nagrada — to je točno ono što se prodaje.
        </p>

        <ul className="mt-[var(--s-7)]">
          {AWARDS.map((a) => (
            <li
              key={a.body + a.year + a.detail}
              className="grid grid-cols-[2.5rem_1fr] items-center gap-x-[var(--s-5)] gap-y-[var(--s-1)] border-t border-ivory/16 py-[var(--s-5)] md:grid-cols-[2.5rem_14rem_1fr_auto]"
            >
              {a.icon ? (
                <Image
                  src={`/medal/${a.icon}.webp`}
                  alt=""
                  width={112}
                  height={112}
                  className="h-9 w-9"
                />
              ) : (
                <span aria-hidden />
              )}
              <span className="t-title text-ivory">{a.body}</span>
              <span className="t-field text-ivory/60">
                {a.medal} · {a.detail}
              </span>
              <span className="data-label tnum text-ivory/45" style={{ fontSize: '0.5rem' }}>
                {a.year}
              </span>
            </li>
          ))}
        </ul>

        {/* Svjetski patent je izostavljen namjerno: nema broja prijave ni unosa
            u registru, a „prva na svijetu" ne stoji — baskijski Crusoe Treasure
            je na dnu od 2010. i patent za podmorsko starenje prijavljen je
            2007. „Prva u Hrvatskoj" stoji i potvrdena je u pet izvora. */}
        <p className="t-field mt-[var(--s-6)] max-w-[46ch] text-ivory/40">
          Prva podmorska vinarija u Hrvatskoj. Vino stari i prodaje se u zapečaćenoj glinenoj
          amfori izvađenoj s dna — to nitko drugi ne radi.
        </p>
      </div>
    </Station>
  )
}
