import Link from 'next/link'
import Frame from '@/components/ui/Frame'
import Station from '@/components/station/Station'
import { WINES, bySlug } from '@/data/wines'
import { eur } from '@/lib/money'
import { station } from '@/data/stations'

const S = station('surface')

/* Cijene se ne pisu rukom. Prije su ovdje stajale tri zakovane vrijednosti
   (€382 i raspon €17,50 — €536) i svaka je bila jedna izmjena kataloga daleko
   od lazi. */
const AMPHORA = bySlug('navis-mysterium-undersea-amphora')!
const PRICES = WINES.map((w) => w.price)
const CHEAPEST = Math.min(...PRICES)
const DEAREST = Math.max(...PRICES)

/**
 * 0 METARA — POVRSINA. Prvi ekran, puna visina kadra.
 *
 * Stranica pocinje IZNAD mora: prva stvar je fotografija amfore koja probija
 * povrsinu. Cim krene scroll, fotografija se gasi i ista kompozicija se
 * nastavlja pod vodom — nema reza, samo uranjanje.
 *
 * MOBITEL je drugaciji raspored, ne stisnuti desktop:
 *   nadnaslov ide na vrh, naslov i akcije na dno, a sredina kadra ostaje
 *   slobodna da se VIDI kako amfora ulazi u more. Tekuci tekst je sakriven —
 *   na 390px je zauzimao trecinu ekrana i pokrivao tocno taj trenutak.
 *   Glavni gumb je skracen na „Kupi bocu": s cijenom u sebi dva gumba nisu
 *   stala u jedan red.
 *
 * SERVER komponenta: naslov mora biti u HTML-u prije JS-a, inace je LCP
 * element paragraf koji ceka bundle.
 */
export default function Hero() {
  return (
    <Station data={S} side="r" showDepth={false} className="ed-hero">
      {/* Fotografija JE povrsina: gubi se cim krene spust */}
      <div className="ed-surface-shot" aria-hidden>
        <Frame
          name="surface-amphora"
          alt=""
          priority
          sizes="100vw"
          className="h-full w-full"
          /* Gornja trecina kadra na desktopu: brda i otvoreno more. Na uskom
             kadru isti pomak ostavlja fotografiranu amforu u kadru, i to je
             ondje dobro — nema 3D amfore u prvom planu da se s njom tuce. */
          position="50% 15%"
        />
        <span className="ed-surface-scrim" />
      </div>

      <div className="ed-hero-in ed-in relative z-10 flex min-h-svh flex-col pb-[var(--s-8)] pt-[var(--s-10)]">
        <p className="ed-fade data-label text-gold">
          Pelješac · the first underwater winery in Croatia
        </p>

        <div className="ed-hero-main">
          {/* NASLOV IMA IZMJEREN PRORACUN: 919 px na 1440 px.
              3D amfora stoji u desnom stupcu i njen lijevi rub je na 951 px, a
              naslov pocinje na 32 px. Hrvatski „Spustili smo / vino na dno."
              trazio je 669 px i stajao je; prvi engleski prijevod („We lowered
              the wine") trazi 1125 px i amfora mu je pojela rijec „wine".
              Dizajn je zasticen, pa se tekst prilagodava kadru — ne obrnuto.
              Mjereno diffom dva screenshota (canvas vidljiv / skriven), jer
              WebGL canvas ima preserveDrawingBuffer: false i ne da se citati. */}
          <h1 id={`${S.id}-h`} className="t-display text-ivory md:mt-[var(--s-5)]">
            <span className="ed-mask">
              <span className="ed-line">
                We sent wine
              </span>
            </span>{' '}
            <span className="ed-mask">
              <span className="ed-line" style={{ animationDelay: '0.06s' }}>
                to the seabed.
              </span>
            </span>
          </h1>

          {/* Na mobitelu sakriven: pokrivao je trenutak ulaska u more. */}
          <p
            className="ed-fade t-body mt-[var(--s-6)] hidden text-ivory/72 md:block"
            style={{ animationDelay: '0.5s' }}
          >
            Plavac Mali sealed in Petrinja clay, lowered to around twenty metres and left there
            seven hundred days at fourteen degrees. What comes back up is wearing the sea — and we
            do not clean it off.
          </p>

          <div
            className="ed-fade mt-[var(--s-6)] flex gap-[var(--s-3)] md:mt-[var(--s-7)]"
            style={{ animationDelay: '0.62s' }}
          >
{/* Glavni gumb vodi na URANJANJE, ne na cjenik. Prije je obecavao „od
                €17,50" a vodio gdje je najjeftinije €117 — i usput preskakao
                jedinu sekciju u kojoj stranica argumentira svoj proizvod.
                Nosi i cijenu amfore, pa mobitel prvi broj sretne uz predmet, a
                ne hladno dva ekrana nize. */}
            <Link
              href="#dive"
              className="data-label pressable bg-gold px-[var(--s-4)] py-[var(--s-4)] text-abyss md:px-[var(--s-5)]"
            >
              See the amphora — {eur(AMPHORA.price)}
            </Link>
            <Link
              href="/visit"
              className="data-label pressable border border-ivory/28 px-[var(--s-4)] py-[var(--s-4)] text-ivory/88 transition-colors duration-200 hover:border-gold hover:text-gold md:px-[var(--s-5)]"
            >
              Taste it in Drače
            </Link>
          </div>
        </div>

        <div
          className="ed-fade mt-[var(--s-6)] flex items-center gap-[var(--s-4)] border-t border-ivory/14 pt-[var(--s-3)] md:mt-[var(--s-7)]"
          style={{ animationDelay: '0.76s' }}
        >
          <span className="data-label-sm text-ivory/60">
            Scroll and you sink
          </span>
          <span aria-hidden className="h-px flex-1 bg-ivory/14" />
{/* Raspon, ne „0,0 m": dubinu na 0 m nosi velika brojka u margini, a ovaj
              slot je jedina besplatna nekretnina na prvom ekranu. Bez njega je
              mobitel prvi broj na stranici sretao kao €382, bez mjerila. */}
          <span className="data-label-sm tnum text-ivory/85">
            {eur(CHEAPEST)} — {eur(DEAREST)}
          </span>
        </div>
      </div>
    </Station>
  )
}
