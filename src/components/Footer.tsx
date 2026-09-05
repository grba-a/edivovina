import Image from 'next/image'
import Link from 'next/link'
import Station from '@/components/station/Station'
import { STATIONS } from '@/data/stations'

const S = STATIONS[5]

/**
 * 25 METARA — DNO. Amfora sjeda u leziste.
 *
 * Footer je i zavrsna postaja i konstanta cijelog weba: identican je na svakoj
 * stranici. Zato je i pisan kao samostalna komponenta, ne kao dio naslovnice.
 *
 * Sadrzaj po Petrovoj odluci: adrese i kontakt, drustvene mreze, newsletter.
 * Radno vrijeme NAMJERNO nema — njihov web ga nigdje ne objavljuje, a lazno
 * vrijeme je gore od nikakvog (vidi PRODUCT.md).
 */
export default function Footer() {
  return (
    <Station data={S} side="l" style={{ paddingBlock: 'var(--sec-y) var(--s-7)' }} className="mt-auto">
      <div className="relative z-10 mx-auto w-full max-w-[var(--wrap)] px-5 md:px-8">
        <p className="data-label text-gold">{S.light}</p>

        <h2 id={`${S.id}-h`} className="t-plate mt-[var(--s-5)] max-w-[14ch] text-ivory">
          Otvori jednu sam.
        </h2>

        {/* Sredina reda ostaje PRAZNA: amfora sjeda u leziste tocno tu, a
            fiksni canvas je uvijek u sredini kadra. Cetiri stupca preko cijele
            sirine znacila su da adresa vinskog bara stoji preko amfore i ne
            cita se. Prazan stupac je jedina stvar koja se ne moze pomaknuti. */}
        <div className="mt-[var(--sec-y-tight)] grid gap-[var(--s-7)] md:grid-cols-[1.1fr_1fr_minmax(var(--s-9),1.1fr)_1fr_1.15fr]">
          <div className="md:col-start-1">
            <Image
              src="/brand/edivo-wordmark.png"
              alt="Edivo Vina"
              width={592}
              height={230}
              className="h-7 w-auto"
            />
            <p className="t-field mt-[var(--s-4)] max-w-[28ch] text-ivory/55">
              Podmorski podrum kod Janjine, vinski bar u Draču.
            </p>
          </div>

          <div className="md:col-start-2">
            <h3 className="data-label text-gold">Vinarija</h3>
            <address className="t-field mt-[var(--s-3)] not-italic leading-loose text-ivory/60">
              Janjina 62
              <br />
              20246 Janjina
              <br />
              Pelješac
            </address>
          </div>

          <div className="md:col-start-4">
            <h3 className="data-label text-gold">Vinski bar</h3>
            <address className="t-field mt-[var(--s-3)] not-italic leading-loose text-ivory/60">
              Drače 18
              <br />
              20246 Drače
              <br />
              Pelješac
            </address>
          </div>

          <div className="md:col-start-5">
            <h3 className="data-label text-gold">Ostanimo u vezi</h3>
            <address className="t-field mt-[var(--s-3)] not-italic leading-loose text-ivory/60">
              <a href="tel:+385916127229" className="block py-[var(--s-3)] hover:text-gold">
                +385 91 6127 229
              </a>
              <a href="mailto:info@edivovina.hr" className="block py-[var(--s-3)] hover:text-gold">
                info@edivovina.hr
              </a>
            </address>
            {/* min-h/min-w umjesto veceg fonta: oznaka ostaje sitna kakva je
                zamisljena, a prst dobiva svojih 44 px. */}
            <div className="data-label mt-[var(--s-2)] flex gap-[var(--s-4)] text-gold" style={{ fontSize: '0.5rem' }}>
              <a
                href="https://www.instagram.com/edivowines/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 min-w-11 items-center"
              >
                Instagram
              </a>
              <a
                href="https://www.facebook.com/edivovina/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 min-w-11 items-center"
              >
                Facebook
              </a>
            </div>

            {/* Predlozak: obrazac se spaja u WordPressu (Breakdance + WooCommerce). */}
            <form className="mt-[var(--s-4)] flex gap-[var(--s-2)]" action="#">
              <label htmlFor="nl" className="sr-only">
                Email za newsletter
              </label>
              <input
                id="nl"
                name="email"
                type="email"
                placeholder="tvoj@mail.com"
                className="min-w-0 flex-1 border border-ivory/20 bg-transparent px-[var(--s-3)] py-[var(--s-3)] text-sm text-ivory outline-none transition-colors focus:border-gold"
              />
              <button type="submit" className="data-label pressable bg-gold px-[var(--s-4)] text-abyss">
                Prijavi me
              </button>
            </form>
          </div>
        </div>

        <div className="mt-[var(--s-8)] flex items-center gap-[var(--s-4)] border-t border-ivory/14 pt-[var(--s-3)]">
          <span className="data-label text-ivory/35" style={{ fontSize: '0.5rem' }}>
            © Edivo Vina
          </span>
          <span aria-hidden className="h-px flex-1 bg-ivory/14" />
          <Link
            href="#surface"
            className="data-label inline-flex min-h-11 items-center text-ivory/35 hover:text-gold"
            style={{ fontSize: '0.5rem' }}
          >
            Natrag na površinu ↑
          </Link>
        </div>
      </div>
    </Station>
  )
}
