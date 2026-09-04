import Link from 'next/link'

/**
 * Hero podstranice — ISTA formula kao na naslovnici, jer je to konstanta koja
 * drzi web zajedno:
 *
 *   zlatna oznaka -> ogroman Libre Baskerville naslov dolje lijevo
 *   -> jedna linija teksta i CTA desno -> hairline s tehnickim citanjem
 *
 * Razlika je samo visina: naslovnica ima 100svh jer je to brend trenutak,
 * podstranica 56svh jer joj sadrzaj mora poceti prije prvog scrolla. Cijeli
 * ekran po podstranici znaci scroll u beskraj i stranicu koja se ne moze
 * pregledati. Struktura je identicna.
 *
 * SERVER komponenta: naslov mora biti u HTML-u prije JS-a, inace je LCP
 * element paragraf koji ceka bundle.
 */
export default function PageHero({
  eyebrow,
  lines,
  intro,
  cta,
  readout,
}: {
  eyebrow: string
  /** Svaki red se otkriva zasebno, kao na naslovnici. */
  lines: string[]
  intro?: string
  cta?: { href: string; label: string }
  /** Tehnicko citanje u hairlineu — dubina, broj, sto god je istina stranice. */
  readout?: string
}) {
  return (
    <section className="relative z-10 flex min-h-[56svh] flex-col px-5 pb-8 pt-24 md:px-8 md:pb-10 md:pt-28">
      <div className="mx-auto w-full max-w-[92rem]">
        <p className="ed-fade data-label text-gold" style={{ animationDelay: '0.12s' }}>
          {eyebrow}
        </p>
      </div>

      <div className="mx-auto mt-auto grid w-full max-w-[92rem] gap-7 md:grid-cols-12 md:items-end md:gap-10">
        <h1 className="font-display text-[clamp(2.2rem,7vw,5.4rem)] leading-[0.95] tracking-[-0.03em] text-ivory md:col-span-7">
          {lines.map((line, i) => (
            <span key={line} className="ed-mask">
              <span className="ed-line" style={{ animationDelay: `${0.18 + i * 0.1}s` }}>
                {line}
              </span>
            </span>
          ))}
        </h1>

        {(intro || cta) && (
          <div className="md:col-span-5 md:pb-1">
            {intro && (
              <p
                className="ed-fade max-w-[34ch] text-[1.0625rem] leading-[1.65] text-ivory/70"
                style={{ animationDelay: '0.46s' }}
              >
                {intro}
              </p>
            )}
            {cta && (
              <div className="ed-fade mt-6" style={{ animationDelay: '0.6s' }}>
                <Link
                  href={cta.href}
                  className="data-label inline-block bg-gold px-6 py-4 text-abyss transition-colors duration-200 hover:bg-ivory"
                >
                  {cta.label}
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      <div
        className="ed-fade mx-auto mt-7 flex w-full max-w-[92rem] items-center gap-4 border-t border-ivory/12 pt-4"
        style={{ animationDelay: '0.74s' }}
      >
        <span className="data-label text-ivory/30" style={{ fontSize: '0.5rem' }}>
          Pelješac, Croatia
        </span>
        <span aria-hidden className="h-px flex-1 bg-ivory/12" />
        {readout && (
          <span className="data-label tnum text-ivory/30" style={{ fontSize: '0.5rem' }}>
            {readout}
          </span>
        )}
      </div>
    </section>
  )
}
