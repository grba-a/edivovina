import Link from 'next/link'

/**
 * Hero podstranice — ISTA formula kao na naslovnici, jer je to konstanta koja
 * drzi web zajedno:
 *
 *   zig -> ogroman Libre Baskerville naslov dolje lijevo -> jedna linija
 *   teksta i akcija desno -> hairline s tehnickim citanjem
 *
 * Podstranicki hero ostaje VODA. Ploce pocinju ispod njega, kao na naslovnici,
 * pa amfora prolazi izmedu njih.
 *
 * Razlika prema naslovnici je samo visina: 100svh je brend trenutak koji se ne
 * ponavlja pet puta; ovdje sadrzaj mora poceti prije prvog scrolla.
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
    <section className="relative z-10 flex min-h-[54svh] flex-col px-5 pb-[var(--s-6)] pt-24 md:px-8 md:pt-28">
      <div className="mx-auto w-full max-w-[92rem]">
        <p className="ed-fade t-stamp text-stamp-bright" style={{ animationDelay: '0.12s' }}>
          {eyebrow}
        </p>
      </div>

      <div className="mx-auto mt-auto grid w-full max-w-[92rem] gap-[var(--s-6)] pt-[var(--s-7)] md:grid-cols-12 md:items-end md:gap-[var(--s-7)]">
        <h1 className="t-plate text-ivory md:col-span-7" style={{ fontSize: 'clamp(2.2rem, 6.4vw, 4.6rem)' }}>
          {lines.map((line, i) => (
            <span key={line} className="ed-mask">
              <span className="ed-line" style={{ animationDelay: `${0.18 + i * 0.1}s` }}>
                {line}
              </span>
            </span>
          ))}
        </h1>

        {(intro || cta) && (
          <div className="md:col-span-5 md:pb-[var(--s-1)]">
            {intro && (
              <p
                className="ed-fade t-body max-w-[36ch] text-ivory/70"
                style={{ animationDelay: '0.46s' }}
              >
                {intro}
              </p>
            )}
            {cta && (
              <div className="ed-fade mt-[var(--s-5)]" style={{ animationDelay: '0.6s' }}>
                <Link
                  href={cta.href}
                  className="t-stamp pressable inline-block bg-stamp-bright text-abyss"
                  style={{ padding: 'var(--s-4) var(--s-5)' }}
                >
                  {cta.label}
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      <div
        className="ed-fade mx-auto mt-[var(--s-6)] flex w-full max-w-[92rem] items-center gap-[var(--s-4)] border-t border-ivory/12 pt-[var(--s-3)]"
        style={{ animationDelay: '0.74s' }}
      >
        <span className="t-stamp text-ivory/30">Pelješac, Croatia</span>
        <span aria-hidden className="h-px flex-1 bg-ivory/12" />
        {readout && <span className="t-stamp text-ivory/30">{readout}</span>}
      </div>
    </section>
  )
}
