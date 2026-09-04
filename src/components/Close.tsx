import Link from 'next/link'
import Frame from './ui/Frame'
import Parallax from './ui/Parallax'

/**
 * 06 / CLOSE — zadnji kadar i zadnja odluka.
 *
 * Ovdje zavrsava spust: amfora leze na dnu, voda je najtamnija, i ostaju samo
 * dvije stvari koje korisnik moze napraviti. Nista drugo nije u kadru.
 */
export default function Close() {
  return (
    <section id="close" className="relative z-10">
      <div className="relative h-[64svh] min-h-[24rem] md:h-[78svh]">
        <Parallax className="absolute inset-0" amount={6}>
          <Frame
            name="sunset-glasses"
            alt="A glass of Edivo raised against the Adriatic at golden hour"
            sizes="100vw"
            position="58% 46%"
          />
        </Parallax>

        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(3,20,31,0.94) 0%, rgba(3,20,31,0.62) 34%, rgba(3,20,31,0.1) 72%, rgba(3,20,31,0) 100%)',
          }}
        />

        <div className="absolute inset-0 flex items-end px-5 pb-14 md:px-8 md:pb-20">
          <div className="mx-auto w-full max-w-[92rem]">
            <div className="md:grid md:grid-cols-12 md:items-end md:gap-10">
              <div className="md:col-span-7">
                <p className="data-label mb-5 text-gold">09 / The seabed</p>
                <h2 className="max-w-[20ch] font-display text-[clamp(2rem,6vw,4.6rem)] leading-[1] tracking-[-0.02em] text-ivory">
                  Open one <span className="italic text-gold">yourself.</span>
                </h2>
              </div>

              <div className="mt-8 md:col-span-5 md:mt-0">
                <p className="max-w-[38ch] text-[1.0625rem] leading-[1.7] text-ivory/70">
                  The bar at Drače pours all three side by side. Bottles ship worldwide from the
                  winery at Janjina.
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Link
                    href="/wines"
                    className="data-label bg-gold px-6 py-4 text-abyss transition-colors duration-200 hover:bg-ivory"
                  >
                    Buy a bottle
                  </Link>
                  <Link
                    href="/visit"
                    data-close-cta
                    className="data-label border border-ivory/30 px-6 py-4 text-ivory/85 transition-colors duration-200 hover:border-gold hover:text-gold"
                  >
                    Taste at Drače
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
