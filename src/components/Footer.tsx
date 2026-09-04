import Image from 'next/image'
import Link from 'next/link'

const YEAR_FOUNDED = 2011

/**
 * Footer.
 *
 * Dvije stvari drze raspored:
 *  1. Stupci 6-7 su PRAZNI — tamo amfora sjeda u leziste na dnu spusta.
 *  2. Sve je u vanjskim stupcima i nista ne prelazi u sredinu.
 *
 * Newsletter ima RAZLOG, ne gumb: na njihovoj vrpci stoji "Batch: 1 - 4000",
 * pa je ponuda "javimo kad izade sljedeca serija", a ne "pretplati se".
 * Nacini placanja su tekstualne oznake, ne tude logotipe — trust bez asseta
 * na koje nemamo prava.
 */
const LEGAL = [
  ['Terms & conditions', '/terms'],
  ['Privacy policy', '/privacy'],
  ['Cookie policy', '/cookies'],
  ['Returns & refunds', '/returns'],
  ['Shipping & cancellation', '/shipping'],
] as const

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-ivory/10 px-5 pb-10 pt-14 md:px-8 md:pt-18">
      <div className="mx-auto w-full max-w-[92rem]">
        {/* --- traka povjerenja: prvo sto oko uhvati u footeru --- */}
        <ul className="mb-10 grid gap-px border border-ivory/12 sm:grid-cols-3">
          {[
            ['Ships worldwide', 'from the winery at Janjina'],
            ['Numbered to 4000', 'every batch, on the tag'],
            ['Opened by you', 'we never clean off the shells'],
          ].map(([t, d]) => (
            <li key={t} className="bg-surface px-6 py-5">
              <p className="data-label text-gold" style={{ fontSize: '0.5rem' }}>
                {t}
              </p>
              <p className="mt-2 text-[0.8125rem] leading-relaxed text-ivory/50">{d}</p>
            </li>
          ))}
        </ul>

        <div className="grid grid-cols-2 gap-x-6 gap-y-9 md:grid-cols-12 md:gap-10">
          <div className="col-span-2 md:col-span-3">
            <Image
              src="/brand/edivo-wordmark.png"
              alt="Edivo Vina"
              width={592}
              height={230}
              className="h-9 w-auto"
            />
            <p className="mt-4 max-w-[26ch] text-sm leading-relaxed text-ivory/45">
              The first underwater winery in the world. Making wine on Pelješac since {YEAR_FOUNDED}.
            </p>
            <p className="data-label mt-6 text-ivory/25" style={{ fontSize: '0.5rem' }}>
              Visa · Mastercard · Amex · Discover
            </p>
          </div>

          <div className="md:col-span-2 md:col-start-4">
            <p className="data-label mb-4 text-ivory/40">Winery</p>
            <address className="not-italic text-sm leading-relaxed text-ivory/70">
              Janjina 62
              <br />
              20246 Janjina
              <br />
              Pelješac, Croatia
            </address>
            <p className="data-label mb-4 mt-8 text-ivory/40">Wine bar</p>
            <address className="not-italic text-sm leading-relaxed text-ivory/70">
              Drače 18
              <br />
              20246 Drače
              <br />
              Pelješac, Croatia
            </address>
          </div>

          {/* stupci 6-7 ostaju prazni: tamo je amfora u lezistu */}

          <div className="md:col-span-2 md:col-start-8">
            <p className="data-label mb-4 text-ivory/40">Website</p>
            <ul className="text-sm text-ivory/60">
              {LEGAL.map(([label, href]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="inline-block py-2.5 transition-colors hover:text-gold"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 md:col-span-3 md:col-start-10">
            <p className="data-label mb-4 text-ivory/40">Contact</p>
            <ul className="text-sm text-ivory/70">
              <li>
                <a
                  href="tel:+385916127229"
                  className="inline-block py-3 transition-colors hover:text-gold"
                >
                  +385 91 6127 229
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@edivovina.hr"
                  className="inline-block py-3 transition-colors hover:text-gold"
                >
                  info@edivovina.hr
                </a>
              </li>
              <li className="flex gap-5">
                <a
                  href="https://www.instagram.com/edivowines/"
                  target="_blank"
                  rel="noreferrer"
                  className="data-label inline-block py-3.5 transition-colors hover:text-gold"
                >
                  Instagram
                </a>
                <a
                  href="https://www.facebook.com/edivovina/"
                  target="_blank"
                  rel="noreferrer"
                  className="data-label inline-block py-3.5 transition-colors hover:text-gold"
                >
                  Facebook
                </a>
              </li>
            </ul>

            {/* Razlog, ne gumb. Obrazac se spaja u WordPressu. */}
            <form className="mt-6 border-t border-ivory/12 pt-6" noValidate>
              <label
                htmlFor="nl"
                className="data-label mb-3 block text-ivory/40"
                style={{ fontSize: '0.5625rem' }}
              >
                When the next batch surfaces
              </label>
              <div className="flex">
                <input
                  id="nl"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="name@email.com"
                  className="h-11 min-w-0 flex-1 border border-ivory/20 bg-surface px-3 text-sm text-ivory outline-none transition-colors placeholder:text-ivory/25 focus:border-gold"
                />
                <button
                  type="submit"
                  className="data-label shrink-0 bg-gold px-4 text-abyss transition-colors hover:bg-ivory"
                  style={{ fontSize: '0.5rem' }}
                >
                  Notify me
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-ivory/10 pt-6 text-xs text-ivory/30 md:flex-row md:items-center md:justify-between">
          <p>© {YEAR_FOUNDED}–2026 Edivo Vina d.o.o. Pelješac, Croatia.</p>
          <p className="data-label" style={{ fontSize: '0.5625rem' }}>
            Please enjoy responsibly · 18+
          </p>
        </div>
      </div>
    </footer>
  )
}
