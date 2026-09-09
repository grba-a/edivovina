import Image from 'next/image'
import Link from 'next/link'
import Station from '@/components/station/Station'
import { station } from '@/data/stations'
import { AWARDS } from '@/data/press'

const S = station('awards')

/**
 * 22 METRA — NAGRADE, u gridu.
 *
 * Bio je popis u redovima i medalja je u njemu bila 36 px — citala se kao
 * grafika za nabrajanje, ne kao medalja. Ovdje je medalja SUBJEKT celije, a
 * detalj je jedan red ispod nje.
 *
 * Zasto 72 px i ne vise: originali su 97x98 px (skinuti s njihovog weba, veci
 * ne postoje). Iznad ~72 CSS px na retini pocnu mekati. Ako klijent posalje
 * certifikate u punoj velicini, ovo je jedino mjesto koje treba dignuti.
 *
 * Iskrenost ostaje: polje `kind` u press.ts razdvaja nagrade za VINO od onih
 * za DIZAJN. Najjaca za kvalitetu vina je Decanter — i to za Dingac, njihovo
 * nepodmorsko vino. Dizajnerska nagrada predstavljena kao vinska pada na prvi
 * pogled kupca koji zna, a takav je jedini koji plati €382.
 */
export default function Awards() {
  return (
    <Station data={S} side="r" style={{ paddingBlock: 'var(--sec-y)' }}>
      <div className="ed-in relative z-10">
        <p className="data-label text-gold">{S.light}</p>

        {/* Bez `justify-between` zaglavlja s malim blokom desno — to je tocno
            isti aparat koji otvara sekciju Boce, pa su dvije citale kao ista
            ploca. Ovdje naslov stoji sam, a argument ide POD njega, u punoj
            sirini i u tekucem tekstu.

            To je ujedno i najhrabrija linija na stranici — jedini trenutak koji
            kolekcionaru govori kao ravnome — a stajala je na `t-field`, 65 %
            prozirnosti, u desnoj margini. To je postavljanje disclaimera. */}
        <h2 id={`${S.id}-h`} className="t-plate mt-[var(--s-5)] max-w-[18ch] text-ivory">
          Awarded as an object.
        </h2>

        <p className="t-body mt-[var(--s-5)] text-ivory/80">
          Sabatina made them champion <b className="font-normal text-ivory">for the design of the
          amphora</b>, not for the wine inside it. That is not the lesser award — it is exactly
          what is being sold.
        </p>

        <ul className="mt-[var(--sec-y-tight)] grid grid-cols-2 gap-[var(--s-4)] sm:grid-cols-3 lg:grid-cols-5">
          {AWARDS.map((a) => (
            <li
              key={a.body + a.year + a.detail}
              /* Solidna celija, ne poluprozirna: voda i marine snow prolaze
                 kroz prozirne panele i sve izgleda prasno. */
              className="flex flex-col items-start border border-ivory/14 bg-surface p-[var(--s-4)]"
            >
              {a.icon ? (
                <Image
                  src={`/medal/${a.icon}.webp`}
                  alt=""
                  width={112}
                  height={112}
                  className="h-[4.5rem] w-[4.5rem]"
                />
              ) : (
                <span aria-hidden className="h-[4.5rem]" />
              )}

              <p className="data-label-sm mt-[var(--s-4)] text-gold">
                {a.medal}
                <span className="text-ivory/60"> · {a.kind === 'wine' ? 'for the wine' : 'for the design'}</span>
              </p>

              <p className="t-title mt-[var(--s-2)] text-ivory">{a.body}</p>

              <p className="t-field mt-auto pt-[var(--s-3)] text-ivory/65">{a.detail}</p>

              <p className="data-label-sm tnum mt-[var(--s-3)] text-ivory/60">
                {a.year}
              </p>
            </li>
          ))}
        </ul>

        {/* Svjetski patent je izostavljen namjerno: nema broja prijave ni unosa
            u registru, a „prva na svijetu" ne stoji — baskijski Crusoe Treasure
            je na dnu od 2010. i patent za podmorsko starenje prijavljen je
            2007. „Prva u Hrvatskoj" stoji i potvrdena je u pet izvora.

            NB: PRODUCT.md i njihov vlastiti web tvrde „first in the world", a
            njihov YouTube opis to ponavlja. Ne prenosimo — ovdje istrazena
            cinjenica pobjeduje brief, i klijenta se time cuva od tvrdnje koju
            konkurent moze oboriti jednom recenicom. Cijeli web nosi hrvatsku
            verziju, uklj. metadata. */}
        <p className="t-field mt-[var(--s-6)] max-w-[52ch] text-ivory/60">
          The first underwater winery in Croatia. The wine is aged and sold inside a sealed clay
          amphora lifted off the seabed — nobody else does that.
        </p>

        {/* Galerija stoji na istoj dubini (22 m) i pokazuje ono sto medalje
            tvrde — obrastene amfore kakve dodju gore. */}
        <div className="mt-[var(--s-6)] flex flex-wrap items-center gap-[var(--s-4)]">
          <Link
            href="/gallery"
            className="data-label pressable border border-gold/45 px-[var(--s-5)] py-[var(--s-4)] text-gold transition-colors duration-200 hover:bg-gold hover:text-abyss"
          >
            See them come up
          </Link>
          <Link
            href="/news"
            className="data-label inline-flex min-h-11 items-center text-ivory/70 transition-colors duration-200 hover:text-gold"
          >
            News &amp; stories →
          </Link>
        </div>
      </div>
    </Station>
  )
}
