import Image from 'next/image'

const YEAR_FOUNDED = 2011

export default function Footer() {
  return (
    <footer id="seabed" className="relative z-10 border-t border-ivory/10 px-5 pb-10 pt-16 md:px-8 md:pt-20">
      <div className="mx-auto w-full max-w-[92rem]">
        <div className="grid gap-10 md:grid-cols-4">
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
