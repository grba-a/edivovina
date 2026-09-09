import Link from 'next/link'
import Station from '@/components/station/Station'
import type { Station as Data } from '@/data/stations'

/**
 * SIGNATURE HEADER — isti aparat na svih sest podstranica.
 *
 * Formula je naslovnicina, jer je to konstanta koja drzi web zajedno:
 *
 *   zlatna oznaka (recenica o svjetlu na toj dubini)
 *   -> ogroman Baskerville naslov, red po red
 *   -> jedna linija teksta i CTA desno
 *   -> hairline s tehnickim citanjem
 *   + ogromna koordinata dubine u margini (nosi ju Station)
 *
 * Razlikuju ih tri stvari, i sve tri su ista stvar: DUBINA. Boja vode na toj
 * dubini, brojka u margini, i recenica o svjetlu. Nista se ne izmislja — svaka
 * podstranica uzima postaju s naslovnice koja pokriva istu temu, pa je
 * podstranica dosl. prosirena verzija svoje postaje.
 *
 * 56svh, ne 100svh: cijeli ekran po podstranici znaci scroll u beskraj i
 * stranicu koja se ne moze pregledati. Naslovnica ima 100svh jer je brend
 * trenutak; podstranici sadrzaj mora poceti prije prvog scrolla.
 *
 * SERVER komponenta: naslov mora biti u HTML-u prije JS-a, inace je LCP
 * element paragraf koji ceka bundle.
 *
 * NB: stara verzija ovoga (PageHero.tsx, commit e141ea8) nosila je dva inline
 * `fontSize: '0.5rem'` na hairlineu — 8 px, tocno kvar koji smo prosle runde
 * cistili. Ovdje hairline ide na `data-label-sm` i nema ni jednog inline fonta.
 */
export default function PageHead({
  data,
  lines,
  intro,
  cta,
  readout,
  side = 'l',
}: {
  data: Data
  /** Svaki red se otkriva zasebno, kao na naslovnici. */
  lines: string[]
  intro?: string
  cta?: { href: string; label: string }
  /** Tehnicko citanje desno u hairlineu — broj, dubina, sto god je istina stranice. */
  readout?: string
  side?: 'l' | 'r'
}) {
  return (
    <Station
      data={data}
      side={side}
      stage={false}
      className="flex min-h-[56svh] flex-col pb-[var(--s-7)] pt-[var(--s-10)]"
    >
      <div className="ed-in relative z-10 flex w-full flex-1 flex-col">
        <p className="ed-fade data-label text-gold" style={{ animationDelay: '0.12s' }}>
          {data.light}
        </p>

        <div className="mt-auto grid gap-[var(--s-6)] md:grid-cols-12 md:items-end md:gap-[var(--s-7)]">
          {/* `t-plate`, ne `t-display`: display je 7rem i stoji u stupcu od 7/12,
              gdje bi svaki naslov dulji od dvije kratke rijeci prelomio red
              unutar `.ed-mask` (overflow: hidden) i klipao se tijekom ulaza.
              Ovo je i ispravna ljestvica — naslovnica je brend trenutak,
              podstranica je stepenicu nize. Nova ad-hoc velicina nije uvedena. */}
          <h1 id={`${data.id}-h`} className="t-plate text-ivory md:col-span-7">
            {lines.map((line, i) => (
              <span key={line} className="ed-mask">
                <span className="ed-line" style={{ animationDelay: `${0.18 + i * 0.1}s` }}>
                  {line}
                </span>
              </span>
            ))}
          </h1>

          {(intro || cta) && (
            <div className="md:col-span-5 md:pb-[var(--s-2)]">
              {intro && (
                <p
                  className="ed-fade t-body max-w-[34ch] text-ivory/72"
                  style={{ animationDelay: '0.46s' }}
                >
                  {intro}
                </p>
              )}
              {cta && (
                <div className="ed-fade mt-[var(--s-5)]" style={{ animationDelay: '0.6s' }}>
                  <Link
                    href={cta.href}
                    className="data-label pressable inline-block bg-gold px-[var(--s-5)] py-[var(--s-4)] text-abyss transition-colors duration-200 hover:bg-ivory"
                  >
                    {cta.label}
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        <div
          className="ed-fade mt-[var(--s-6)] flex items-center gap-[var(--s-4)] border-t border-ivory/14 pt-[var(--s-3)]"
          style={{ animationDelay: '0.74s' }}
        >
          <span className="data-label-sm text-ivory/60">Pelješac, Croatia</span>
          <span aria-hidden className="h-px flex-1 bg-ivory/14" />
          {readout && <span className="data-label-sm tnum text-ivory/85">{readout}</span>}
        </div>
      </div>
    </Station>
  )
}
