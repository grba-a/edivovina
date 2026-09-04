import Image from 'next/image'
import Link from 'next/link'

const YEAR_FOUNDED = 2011

export default function Footer() {
  return (
    <footer id="seabed" className="relative z-10 border-t border-ivory/10 px-5 pb-10 pt-20 md:px-8 md:pt-28">
      <div className="mx-auto w-full max-w-[92rem]">
        <p className="data-label mb-4 text-gold">09 / The Seabed</p>
        <h2 className="max-w-[22ch] font-display text-[clamp(2.4rem,7vw,5rem)] leading-[0.95] tracking-[-0.02em] text-ivory">
          Open one yourself.
        </h2>
        <p className="mt-6 max-w-[44ch] text-[1.0625rem] leading-[1.7] text-ivory/60">
          The bar at Drače pours all three side by side — cellar, sea, amphora — so you can taste
          what the depth actually did. Bottles ship from the winery at Janjina.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/wines"
            className="data-label bg-gold px-6 py-4 text-abyss transition-colors duration-200 hover:bg-ivory"
          >
            Buy a bottle
          </Link>
          <Link
            href="/visit"
            className="data-label border border-ivory/25 px-6 py-4 text-ivory/80 transition-colors duration-200 hover:border-gold hover:text-gold"
          >
            Taste at Drače
          </Link>
        </div>

        <div className="mt-20 grid gap-10 border-t border-ivory/10 pt-10 md:grid-cols-4">
          <div>
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
          </div>

          <div>
            <p className="data-label mb-4 text-ivory/40">Winery</p>
            <address className="not-italic text-sm leading-relaxed text-ivory/70">
              Janjina 62<br />
              20246 Janjina<br />
              Pelješac, Croatia
            </address>
          </div>

          <div>
            <p className="data-label mb-4 text-ivory/40">Wine bar</p>
            <address className="not-italic text-sm leading-relaxed text-ivory/70">
              Drače 18<br />
              20246 Drače<br />
              Pelješac, Croatia
            </address>
          </div>

          <div>
            <p className="data-label mb-4 text-ivory/40">Contact</p>
            <ul className="text-sm text-ivory/70">
              <li>
                <a href="tel:+385916127229" className="inline-block py-3.5 transition-colors hover:text-gold">
                  +385 91 6127 229
                </a>
              </li>
              <li>
                <a href="mailto:info@edivovina.hr" className="inline-block py-3.5 transition-colors hover:text-gold">
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
