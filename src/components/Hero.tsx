import Link from 'next/link'
import Frame from '@/components/ui/Frame'
import Station from '@/components/station/Station'
import { STATIONS } from '@/data/stations'

const S = STATIONS[0]

/**
 * 0 METARA — POVRSINA.
 *
 * Stranica pocinje IZNAD mora: prva stvar je fotografija amfore koja probija
 * povrsinu, s pelješkim brdima iza. Cim krene scroll, fotografija se gasi i
 * ista kompozicija se nastavlja pod vodom — nema reza, samo uranjanje.
 *
 * Naslov drzi lijevu stranu da amfora ima gdje presjeci njegov rep, a tekuci
 * tekst nikad ne dira.
 *
 * SERVER komponenta: naslov mora biti u HTML-u prije JS-a, inace je LCP
 * element paragraf koji ceka bundle.
 */
export default function Hero() {
  return (
    <Station data={S} side="r" showDepth={false} className="ed-hero flex min-h-[92svh] flex-col justify-end">
      {/* Fotografija JE povrsina: gubi se cim krene spust */}
      <div className="ed-surface-shot" aria-hidden>
        <Frame
          name="surface-amphora"
          alt=""
          priority
          sizes="100vw"
          className="h-full w-full"
          /* Gornja trecina kadra: brda i otvoreno more, bez fotografirane
             amfore. Dvije amfore u istom kadru — jedna na fotki, jedna 3D —
             citale su se kao pogreska, ne kao kompozicija. */
          position="50% 15%"
        />
        <span className="ed-surface-scrim" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[var(--wrap)] px-5 pb-[var(--s-8)] pt-[var(--s-10)] md:px-8">
        <div className="ed-hero-copy">
          <p className="ed-fade data-label text-gold" style={{ animationDelay: '0.12s' }}>
            Pelješac · prva podmorska vinarija u Hrvatskoj
          </p>

          <h1 id={`${S.id}-h`} className="t-display mt-[var(--s-5)] text-ivory">
            <span className="ed-mask">
              <span className="ed-line" style={{ animationDelay: '0.2s' }}>
                Spustili smo
              </span>
            </span>
            <span className="ed-mask">
              <span className="ed-line" style={{ animationDelay: '0.3s' }}>
                vino na dno.
              </span>
            </span>
          </h1>

          <p
            className="ed-fade t-body mt-[var(--s-6)] text-ivory/72"
            style={{ animationDelay: '0.5s' }}
          >
            Plavac Mali zapečaćen u petrinjskoj glini, spušten na oko dvadeset metara i ostavljen
            sedamsto dana na četrnaest stupnjeva. Ono što se vrati gore nosi na sebi more — i to se
            ne čisti.
          </p>

          <div className="ed-fade mt-[var(--s-7)] flex flex-wrap gap-[var(--s-3)]" style={{ animationDelay: '0.62s' }}>
            <Link
              href="#shop"
              className="data-label pressable bg-gold text-abyss"
              style={{ padding: 'var(--s-4) var(--s-5)' }}
            >
              Kupi bocu — od €17,50
            </Link>
            <Link
              href="#seabed"
              className="data-label pressable border border-ivory/28 text-ivory/88 transition-colors duration-200 hover:border-gold hover:text-gold"
              style={{ padding: 'var(--s-4) var(--s-5)' }}
            >
              Kušaj u Draču
            </Link>
          </div>
        </div>

        <div
          className="ed-fade mt-[var(--s-7)] flex items-center gap-[var(--s-4)] border-t border-ivory/14 pt-[var(--s-3)]"
          style={{ animationDelay: '0.76s' }}
        >
          <span className="data-label text-ivory/40" style={{ fontSize: '0.5rem' }}>
            Skrolaj i tonut ćeš
          </span>
          <span aria-hidden className="h-px flex-1 bg-ivory/14" />
          <span className="data-label tnum text-ivory/40" style={{ fontSize: '0.5rem' }}>
            0,0 m
          </span>
        </div>
      </div>
    </Station>
  )
}
