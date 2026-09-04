import Frame from './ui/Frame'
import Parallax from './ui/Parallax'

/**
 * 02 / THE REVEAL — jedan kadar preko cijele sirine i JEDNA linija teksta.
 *
 * Namjerno asimetricno: fotka je full-bleed, tekst sjedi u lijevoj trecini i
 * ne centrira se. Ovo je jedini segment bez CTA-a — ovdje se ne prodaje,
 * ovdje se zeli.
 */
export default function Reveal2() {
  return (
    <section id="reveal" className="relative z-10">
      <div className="relative h-[86svh] min-h-[30rem] md:h-[104svh]">
        <Parallax className="absolute inset-0">
          <Frame
            name="pour-amphora"
            alt="Wine poured from a shell-encrusted Edivo amphora into a glass at the water's edge"
            sizes="100vw"
            position="52% 42%"
          />
        </Parallax>

        {/* Zastita citljivosti: ploca prema dnu-lijevo, ne uniformni scrim
            preko cijele fotke. Scrim nije zavrtanj — jacanje bi ubilo kadar. */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(100deg, rgba(3,20,31,0.86) 0%, rgba(3,20,31,0.6) 32%, rgba(3,20,31,0.12) 62%, rgba(3,20,31,0) 100%)',
          }}
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-1/3"
          style={{ background: 'linear-gradient(to top, rgba(3,20,31,0.7), rgba(3,20,31,0))' }}
        />

        <div className="absolute inset-0 flex items-end px-5 pb-14 md:px-8 md:pb-24">
          <div className="mx-auto w-full max-w-[92rem]">
            <p className="data-label mb-5 text-gold">The moment it comes back</p>
            <p className="max-w-[15ch] font-display text-[clamp(2.1rem,6.4vw,5.4rem)] leading-[1.02] tracking-[-0.02em] text-ivory md:max-w-[18ch]">
              Two years down.
              <span className="block italic text-gold">Ninety seconds to pour.</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
