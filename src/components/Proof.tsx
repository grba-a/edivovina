import Image from 'next/image'
import Frame from './ui/Frame'
import { AWARDS, STORIES } from '@/data/press'

/**
 * 05 / PROOF — nagrade i mediji.
 *
 * Medalje su NJIHOVE, skinute s edivovina.hr (public/medal/*.webp). Sretna
 * okolnost: sredine su im u navyu koji je prakticki Pantone 7463C, pa sjedaju
 * na nasu podlogu bez ijedne izmjene.
 *
 * Njihova verzija je bila bijela traka s medaljama u nizu. Ova je ista
 * struktura u nasem registru: vodeca nagrada velika, ostale u nizu, godina
 * tabularno, i uz svaku TOCNO KOJE VINO — jer "Decanter Silver" bez "Dingac"
 * je bedz, a s njim je cinjenica.
 *
 * Izvor je 97 px, pa se medalje prikazuju na 52-72 px da ostanu ostre.
 */
export default function Proof() {
  const [lead, ...rest] = AWARDS

  return (
    <section id="proof" className="relative z-10 px-5 pb-14 md:px-8 md:pb-24">
      <div className="mx-auto w-full max-w-[92rem]">
        <div className="grid md:grid-cols-12">
          {/* Portret osnivaca drzi lijevu stranu — dokaz je i lice, ne samo medalja */}
          <div className="md:col-span-4">
            <Frame
              name="founder"
              alt="Ivo Šegović on the boat above the underwater cellar"
              sizes="(min-width: 768px) 32vw, 100vw"
              className="aspect-[4/5] w-full bg-surface object-cover md:aspect-auto md:h-full md:max-h-[32rem]"
              position="50% 30%"
            />
          </div>

          <div className="border-ivory/15 md:col-span-8 md:border-l">
            <div className="bg-surface p-7 md:p-12">
              <p className="data-label mb-4 text-gold">Judged, not just described</p>
              <h2 className="max-w-[24ch] font-display text-[clamp(1.5rem,3vw,2.4rem)] leading-tight text-ivory">
                The sea is the method. The wine still has to stand up blind.
              </h2>
            </div>

            {/* --- vodeca nagrada: najsvjezija i najprepoznatljivija --- */}
            <div className="flex items-center gap-6 border-t border-ivory/15 bg-surface p-7 md:gap-8 md:p-12">
              {lead.icon && (
                <Image
                  src={`/medal/${lead.icon}.webp`}
                  alt=""
                  width={112}
                  height={112}
                  className="h-[68px] w-[68px] shrink-0 md:h-[76px] md:w-[76px]"
                />
              )}
              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-4">
                  <span className="tnum font-display text-2xl text-gold md:text-3xl">
                    {lead.year}
                  </span>
                  <p className="font-display text-[clamp(1.1rem,2vw,1.55rem)] leading-tight text-ivory">
                    {lead.body}
                  </p>
                </div>
                <p className="mt-2 text-sm text-ivory/55">
                  <span className="data-label text-gold" style={{ fontSize: '0.5rem' }}>
                    {lead.medal}
                  </span>
                  <span className="mx-2 text-ivory/25">·</span>
                  {lead.detail}
                </p>
              </div>
            </div>

            {/* --- ostale: medalja, godina, tijelo, tocno vino --- */}
            <ul className="grid border-t border-ivory/15 sm:grid-cols-2">
              {rest.map((a, i) => (
                <li
                  key={a.year + a.body}
                  className={`flex items-start gap-4 border-ivory/10 bg-surface p-6 md:gap-5 md:p-8 ${
                    i % 2 === 0 ? 'sm:border-r' : ''
                  } ${i < rest.length - (rest.length % 2 === 0 ? 2 : 1) ? 'border-b' : ''}`}
                >
                  {a.icon ? (
                    <Image
                      src={`/medal/${a.icon}.webp`}
                      alt=""
                      width={112}
                      height={112}
                      className="h-[52px] w-[52px] shrink-0"
                    />
                  ) : (
                    /* Patent nema medalju — okvir drzi poravnanje s ostalima */
                    <span
                      aria-hidden
                      className="data-label flex h-[52px] w-[52px] shrink-0 items-center justify-center border border-gold/30 text-gold/80"
                      style={{ fontSize: '0.4375rem' }}
                    >
                      PAT
                    </span>
                  )}
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-baseline gap-x-3">
                      <span className="tnum text-sm text-ivory/45">{a.year}</span>
                      <p className="font-display text-base leading-tight text-ivory md:text-lg">
                        {a.body}
                      </p>
                    </div>
                    <p className="data-label mt-2 text-gold" style={{ fontSize: '0.5rem' }}>
                      {a.medal}
                    </p>
                    <p className="mt-2 text-[0.8125rem] leading-relaxed text-ivory/45">
                      {a.detail}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-ivory/15 bg-surface p-7 md:p-12">
              <p className="data-label mb-5 text-ivory/30" style={{ fontSize: '0.5rem' }}>
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
