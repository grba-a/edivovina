import Image from 'next/image'
import Link from 'next/link'
import Station from '@/components/station/Station'
import { station } from '@/data/stations'
import { NAV } from '@/data/nav'

const S = station('seabed')

/**
 * DNO. Konstanta cijelog weba: SADRZAJ je isti na svakoj stranici — adrese,
 * kontakt, drustvene, izbornik, newsletter, copyright.
 *
 * `seabed` je razlika, i Petrova odluka. Na naslovnici je true: footer JE
 * postaja na 25 m, nosi koordinatu, kupovni CTA, `.ed-seabed` ritam i
 * `.ed-cradle-room` rezervu u koju amfora sjeda u leziste. To je nagrada
 * cijelog zarona.
 *
 * Na podstranicama je false: isti sadrzaj, ali bez koordinate, bez CTA-a i bez
 * seabed tretmana — dubina te stranice stoji u NJENOM otvaranju. Uz to
 * `stage={false}` znaci da footer ne ulazi u koreografiju; inace bi bio jedini
 * [data-station] node na stranici i pozornica bi ga citala kao postaju.
 *
 * Radno vrijeme NAMJERNO nema — njihov web ga nigdje ne objavljuje, a lazno
 * vrijeme je gore od nikakvog (vidi PRODUCT.md).
 */
export default function Footer({ seabed = true }: { seabed?: boolean }) {
  return (
    <Station
      data={S}
      as="footer"
      side="l"
      stage={seabed}
      showDepth={seabed}
      className={`mt-auto ${seabed ? 'ed-seabed ed-cradle-room' : ''}`}
      style={seabed ? undefined : { paddingBlock: 'var(--sec-y)' }}
    >
      <div className="ed-in relative z-10">
        <p className="data-label text-gold">{seabed ? S.light : 'Pelješac, Croatia'}</p>

        <h2 id={`${S.id}-h`} className="t-plate mt-[var(--s-5)] max-w-[14ch] text-ivory">
          Open one alone.
        </h2>

        {/* Samo na naslovnici: na podstranici je footer ispod sadrzaja koji je
            i sam imao svoj CTA, pa bi ovo bio treci gumb u istom kadru. */}
        {seabed && (
          <div className="mt-[var(--s-6)] flex flex-wrap items-center gap-[var(--s-4)]">
            <Link
              href="/wines"
              className="data-label pressable bg-gold px-[var(--s-5)] py-[var(--s-4)] text-abyss"
            >
              Visit Shop
            </Link>
            <Link
              href="/contact"
              className="data-label border border-ivory/28 px-[var(--s-5)] py-[var(--s-4)] text-ivory/88 transition-colors duration-200 hover:border-gold hover:text-gold"
            >
              Get in touch
            </Link>
          </div>
        )}

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
            <p className="t-field mt-[var(--s-4)] max-w-[28ch] text-ivory/65">
              An underwater cellar off Janjina, a wine bar in Drače.
            </p>
          </div>

          <div className="md:col-start-2">
            <h3 className="data-label text-gold">Winery</h3>
            <address className="t-field mt-[var(--s-3)] not-italic leading-loose text-ivory/60">
              Janjina 62
              <br />
              20246 Janjina
              <br />
              Pelješac, Croatia
            </address>
          </div>

          <div className="md:col-start-4">
            <h3 className="data-label text-gold">Wine bar</h3>
            <address className="t-field mt-[var(--s-3)] not-italic leading-loose text-ivory/60">
              Drače 18
              <br />
              20246 Drače
              <br />
              Pelješac, Croatia
            </address>
          </div>

          <div className="md:col-start-5">
            <h3 className="data-label text-gold">Stay in touch</h3>
            <address className="t-field mt-[var(--s-3)] not-italic leading-loose text-ivory/60">
              {/* Na edivovina.hr taj broj nije `tel:` nego wa.me — WhatsApp je
                  kanal kojim stvarno odgovaraju. Dajemo oboje: `tel:` zove s
                  mobitela, WhatsApp radi s desktopa. */}
              <a href="tel:+385916127229" className="block py-[var(--s-3)] hover:text-gold">
                +385 91 6127 229
              </a>
              <a
                href="https://wa.me/385916127229"
                target="_blank"
                rel="noreferrer"
                className="block py-[var(--s-3)] hover:text-gold"
              >
                WhatsApp
              </a>
              <a href="mailto:info@edivovina.hr" className="block py-[var(--s-3)] hover:text-gold">
                info@edivovina.hr
              </a>
            </address>
            {/* min-h/min-w umjesto veceg fonta: oznaka ostaje sitna kakva je
                zamisljena, a prst dobiva svojih 44 px. */}
            <div className="data-label-sm mt-[var(--s-2)] flex gap-[var(--s-4)] text-gold">
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

            {/* Predlozak: obrazac se spaja u WordPressu (Breakdance + WooCommerce).
                Do tada je ONEMOGUCEN, ne `action="#"` — tako je polje tiho jelo
                adresu i skakalo na vrh stranice. */}
            <form className="mt-[var(--s-4)] flex gap-[var(--s-2)]">
              <label htmlFor="nl" className="sr-only">
                Email for the newsletter
              </label>
              <input
                id="nl"
                name="email"
                type="email"
                placeholder="you@email.com"
                autoComplete="email"
                disabled
                /* Bez `outline-none`: ono je gasilo globalni :focus-visible i ovo
                   je bio jedini element na stranici bez vidljivog fokusa. */
                className="min-w-0 flex-1 border border-ivory/20 bg-transparent px-[var(--s-3)] py-[var(--s-3)] text-sm text-ivory transition-colors focus:border-gold disabled:opacity-60"
              />
              <button
                type="submit"
                disabled
                className="data-label bg-gold px-[var(--s-4)] text-abyss disabled:opacity-60"
              >
                Sign me up
              </button>
            </form>
          </div>
        </div>

        {/* Izbornik po DUBINI, isti redoslijed kao u headeru i kao sekcije na
            naslovnici: povrsina prvo, dno zadnje. Jedan izvor istine je
            src/data/nav.ts, pa se traka i footer ne mogu razici. */}
        <nav aria-label="Pages" className="mt-[var(--s-8)] border-t border-ivory/14 pt-[var(--s-5)]">
          <ul className="flex flex-wrap gap-x-[var(--s-6)] gap-y-[var(--s-3)]">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  className="data-label inline-flex min-h-11 items-center text-ivory/70 transition-colors duration-200 hover:text-gold"
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-[var(--s-5)] flex items-center gap-[var(--s-4)] border-t border-ivory/14 pt-[var(--s-3)]">
          <span className="data-label-sm text-ivory/60">
            © Edivo Vina
          </span>
          <span aria-hidden className="h-px flex-1 bg-ivory/14" />
          {/* Na naslovnici fragment (Lenis ga glatko odskrola); na podstranici
              prava ruta — `#surface` tamo ne postoji, pa je delegirani listener
              u Headeru pretvarao u mrtav klik. */}
          <Link
            href={seabed ? '#surface' : '/#surface'}
            className="data-label-sm inline-flex min-h-11 items-center text-ivory/60 hover:text-gold"
          >
            Back to the surface ↑
          </Link>
        </div>
      </div>
    </Station>
  )
}
