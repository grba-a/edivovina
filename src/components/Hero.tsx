import Link from 'next/link'
import { WINES, bySlug } from '@/data/wines'

/**
 * 01 / SURFACE.
 *
 * SERVER komponenta, namjerno: naslov mora biti u HTML-u prije ikakvog JS-a,
 * inace je LCP element paragraf koji ceka bundle. Reveal je cisti CSS
 * (.ed-mask/.ed-line), stagger kroz inline animationDelay.
 *
 * Visina je tocno 100svh — trazeno izricito. Amfora je centrirana, pa
 * tipografija ide u donji rub i sredina kadra ostaje njoj.
 */
const LINES = ['Two years', 'underwater.']

/** Izvedeno iz kataloga, ne prepisano — cijena u heru ne smije odlutati. */
const eur = (n: number) => '€' + (Number.isInteger(n) ? String(n) : n.toFixed(2).replace('.', ','))
const FROM = eur(Math.min(...WINES.map((w) => w.price)))
const SET = eur(bySlug('navis-mysterium-tris')!.price)

export default function Hero() {
  return (
    <section
      id="surface"
      className="relative z-10 flex h-[100svh] min-h-[34rem] flex-col px-5 pb-10 pt-24 md:px-8 md:pb-12 md:pt-28"
    >
      <div className="mx-auto w-full max-w-[92rem]">
        <p className="ed-fade data-label text-gold" style={{ animationDelay: '0.15s' }}>
          Pelješac, Croatia
        </p>
      </div>

      <div className="mx-auto mt-auto grid w-full max-w-[92rem] gap-7 md:grid-cols-12 md:items-end md:gap-10">
        <h1 className="font-display text-[clamp(2.35rem,8vw,6.4rem)] leading-[0.94] tracking-[-0.03em] text-ivory md:col-span-7">
          {LINES.map((line, i) => (
            <span key={line} className="ed-mask">
              <span className="ed-line" style={{ animationDelay: `${0.2 + i * 0.11}s` }}>
                {line}
              </span>
            </span>
          ))}
        </h1>

        <div className="md:col-span-5 md:pb-1">
          <p
            className="ed-fade max-w-[32ch] text-[1.0625rem] leading-[1.65] text-ivory/70 md:text-[1.1875rem]"
            style={{ animationDelay: '0.5s' }}
          >
            The first underwater winery in the world. Plavac Mali sealed in clay and left on the
            seabed for 700 days.
          </p>
          {/* Gumbi u JEDNOM REDU i na uskom ekranu: flex-wrap ih je lomio u
              stupac, a dva puna gumba jedan pod drugim pojedu pol kadra. */}
          <div className="ed-fade mt-6 flex items-stretch gap-2.5" style={{ animationDelay: '0.64s' }}>
            <Link
              href="/wines"
              className="data-label flex flex-1 items-center justify-center bg-gold px-4 py-4 text-center text-abyss transition-colors duration-200 hover:bg-ivory sm:flex-none sm:px-6"
            >
              Buy a bottle
            </Link>
            <a
              href="#three"
              className="data-label flex flex-1 items-center justify-center border border-ivory/25 px-4 py-4 text-center text-ivory/80 transition-colors duration-200 hover:border-gold hover:text-gold sm:flex-none sm:px-6"
            >
              Three lives
            </a>
          </div>

          {/* Cijena stoji SAMOSTALNO, ne u gumbu: kupac koji trazi dar treba
              red velicine u prvom kadru, a gumb s cijenom nije stao na 390px. */}
          <p
            className="ed-fade data-label mt-4 text-ivory/40"
            style={{ animationDelay: '0.72s', fontSize: '0.5625rem' }}
          >
            From {FROM} · the set {SET}
          </p>
        </div>
      </div>

      {/* Samo desktop: na mobitelu je ovaj red gurao sadrzaj uz gornji rub i
          amforu tiskao izvan kadra. Dubinu na mobitelu ionako pokazuje spust. */}
      <div
        className="ed-fade mx-auto mt-8 hidden w-full max-w-[92rem] items-center gap-4 border-t border-ivory/12 pt-4 md:flex"
        style={{ animationDelay: '0.78s' }}
      >
        <span className="data-label text-ivory/30" style={{ fontSize: '0.5rem' }}>
          Scroll to descend
        </span>
        <span aria-hidden className="h-px flex-1 bg-ivory/12" />
        <span className="data-label tnum text-ivory/30" style={{ fontSize: '0.5rem' }}>
          0,0 m
        </span>
      </div>
    </section>
  )
}
