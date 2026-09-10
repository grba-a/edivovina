import Link from 'next/link'
import Station from '@/components/station/Station'
import { station } from '@/data/stations'
import { bySlug } from '@/data/wines'
import { eur } from '@/lib/money'

const S = station('dive')

/**
 * 3 METRA — URANJANJE. Jedina sekcija u kojoj je predmet subjekt.
 *
 * Na fotografiji iznad amfora tek udara u vodu; ovdje pada kroz kadar i tekst
 * stoji OKO nje. Sredisnji stupac je namjerno prazan — to nije praznina nego
 * mjesto gdje predmet zivi.
 *
 * DESKTOP: tri stupca, glina lijevo, more desno, amfora izmedu.
 * MOBITEL: nema bocnog prostora, pa ista ideja ide vertikalno — glina gore,
 *   prazan pojas u kojem se predmet vidi, mjere pa more i akcija ispod.
 *
 * OVDJE SE ZATVARA CIJENA. Argument dolazi prije broja, i to je najbolja
 * odluka na stranici — ali broj je dugo stajao sam. Sad uz njega stoji
 * KONTROLA: `NM-REG` je isto vino, ista bacva, ista berba, nikad nije silo,
 * i kosta €39. Bez tog broja €382 nema s cime usporediti; s njim je razlika
 * cinjenica, a ne tvrdnja. Oba dolaze iz kataloga pa ne mogu driftati.
 */
export default function Dive() {
  const amphora = bySlug('navis-mysterium-undersea-amphora')!
  const control = bySlug('navis-mysterium-regular-bottle')!

  const FIELDS: [string, string][] = [
    ['Height', '300 mm'],
    ['Diameter', '108 mm'],
    ['Volume', amphora.volume],
    /* Oskudnost je svojstvo predmeta kao i mjere, pa stoji uz njih. Prije je
       bila fusnota uz gumb, na 8 px i 40 % prozirnosti. */
    ['Batch', '1–4000'],
    ['Vintage', String(amphora.vintage)],
  ]

  return (
    <Station data={S} side="l" className="ed-dive">
      <div className="ed-in relative z-10 flex flex-col pb-[var(--sec-y)] pt-[var(--s-9)] ed-dive-in">
        {/* NASLOV IMA IZMJEREN PRORACUN: 566 px na 1440 px.
            Amfora je na ovoj postaji u SREDINI kadra (x: 0, scale 1,15) i njen
            lijevi rub je na 598 px. Njihova recenica „Our mission is to make top
            quality wines, but also to make them unique." trazila je na tom
            rasponu sest redova naslova, pa stoji u tijelu — a naslov nosi
            njihovu vlastitu kratku frazu. Isti razred kvara kao u heru.
            Mjereno diffom dva screenshota uz ZAMRZNUT snijeg i snopove: bez
            toga diff lovi ambijent koji se krece, ne predmet. */}
        {/* Samo ime postaje: recenica o svjetlu je naslov ove sekcije. */}
        <p className="data-label text-gold">{S.name}</p>

        <h2 id={`${S.id}-h`} className="t-plate mt-[var(--s-5)] max-w-[11ch] text-ivory">
          The Sea Mystery.
        </h2>

        <div className="ed-dive-band mt-[var(--s-8)]">
          <div className="ed-dive-l">
            <p className="data-label text-gold">The mission</p>
            <p className="t-body mt-[var(--s-4)] text-ivory/72">
              Our mission is to make top quality wines, but also to make them unique.
            </p>
            <p className="t-body mt-[var(--s-4)] text-ivory/72">
              To realise our mission statement, we decided to combine the best of what nature gave
              us and to immerse our wine in the sea. We store it in the depths for more than 700
              days.
            </p>
          </div>

          {/* Prazan pojas: ovdje pada amfora. Visina postoji samo na mobitelu,
              gdje predmet mora dobiti svoj prostor po vertikali. */}
          <div className="ed-dive-gap" aria-hidden />

          {/* Mjere stoje ISPOD predmeta na mobitelu, a u lijevom stupcu na
              desktopu (grid-row 2). U lijevom bloku su na 390px tabularne
              brojke lezale preko grla amfore. */}
          <dl className="ed-dive-nums t-field max-w-[18rem]">
            {FIELDS.map(([k, v]) => (
              <div key={k} className="flex items-baseline gap-[var(--s-2)] border-t border-ivory/12 py-[var(--s-2)]">
                <dt className="data-label shrink-0 text-ivory/60">{k}</dt>
                <span aria-hidden className="h-px flex-1 bg-ivory/12" />
                <dd className="tnum shrink-0 text-ivory/80">{v}</dd>
              </div>
            ))}
          </dl>

          <div className="ed-dive-r">
            <p className="data-label text-gold">The result</p>
            <p className="t-body mt-[var(--s-4)] text-ivory/72">
              With the immersion of the first bottle and amphora, we knew that we had made
              something special, something that will contribute to history: the famous wine of
              Pelješac becomes also a sea wine.
            </p>
            <p className="t-body mt-[var(--s-4)] text-ivory/72">
              We called it Navis Mysterium – The Sea Mystery.
            </p>

            <div className="mt-[var(--s-6)]">
              <Link
                href={`/product/${amphora.slug}`}
                className="data-label pressable inline-block bg-gold px-[var(--s-5)] py-[var(--s-4)] text-abyss"
              >
                Take one — {eur(amphora.price)}
              </Link>

              {/* Recenice s brojem, ne tabela. Kao <dl> je `shrink-0` na dugom
                  <dt> razvlacio red i izbacivao cijenu 17 px izvan kadra na
                  360 px — tekst koji se moze lomiti nikad ne smije biti
                  shrink-0. */}
              <p className="t-field mt-[var(--s-4)] max-w-[34ch] text-ivory/65">
                {control.name} — same wine, same barrel, never went down:{' '}
                <b className="tnum font-normal text-ivory/85">{eur(control.price)}</b>
              </p>
              <p className="t-field mt-[var(--s-2)] max-w-[34ch] text-ivory/65">
                Shipped from Janjina by UPS, DPD or DHL, dispatched within 24 hours. Customs
                is paid by the buyer.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Station>
  )
}
