import Frame from './ui/Frame'
import { AWARDS, STORIES } from '@/data/press'

/**
 * 05 / PROOF — nagrade I mediji u JEDNOJ traci.
 *
 * Prije su bile dvije sekcije, sto je stranicu produzilo a dokaz razrijedilo.
 * Zbijeno je uvjerljivije: cetiri medalje i pet naslova u jednom kadru.
 */
export default function Proof() {
  return (
    <section id="proof" className="relative z-10 px-5 pb-20 md:px-8 md:pb-32">
      <div className="mx-auto w-full max-w-[92rem]">
        <div className="grid md:grid-cols-12">
          {/* Portret osnivaca drzi lijevu stranu — dokaz je i lice, ne samo medalja */}
          <div className="md:col-span-4">
            <Frame
              name="founder"
              alt="Ivo Šegović on the boat above the underwater cellar"
              sizes="(min-width: 768px) 32vw, 100vw"
              className="aspect-[4/5] w-full bg-navy/40 object-cover md:aspect-auto md:h-full"
              position="50% 30%"
            />
          </div>

          <div className="border-ivory/15 md:col-span-8 md:border-l">
            <div className="p-7 md:p-12">
              <p className="data-label mb-4 text-gold">Judged, not just described</p>
              <h2 className="max-w-[24ch] font-display text-[clamp(1.5rem,3vw,2.4rem)] leading-tight text-ivory">
                The sea is the method. The wine still has to stand up blind.
              </h2>
            </div>

            <ul className="grid border-t border-ivory/15 sm:grid-cols-2">
              {AWARDS.map((a, i) => (
                <li
                  key={a.body}
                  className={`border-ivory/12 p-6 md:p-8 ${i % 2 === 0 ? 'sm:border-r' : ''} ${
                    i < 2 ? 'border-b' : ''
                  }`}
                >
                  <p className="data-label text-gold">{a.medal}</p>
                  <p className="mt-3 font-display text-lg leading-tight text-ivory">{a.body}</p>
                  {(a.year || a.note) && (
                    <p className="mt-2 text-sm text-ivory/40">
                      {[a.year, a.note].filter(Boolean).join(' · ')}
                    </p>
                  )}
                </li>
              ))}
            </ul>

            <div className="border-t border-ivory/15 p-7 md:p-12">
              <p className="data-label mb-6 text-ivory/30" style={{ fontSize: '0.5rem' }}>
                Written about in
              </p>
              <ul className="flex flex-wrap gap-x-8">
                {STORIES.map((s) => (
                  <li key={s.href}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block py-3 font-display text-lg text-ivory/60 transition-colors duration-200 hover:text-gold md:text-xl"
                    >
                      {s.outlet}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
