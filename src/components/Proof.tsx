import Image from 'next/image'
import Plate from './record/Plate'
import Frame from './ui/Frame'
import { AWARDS, STORIES } from '@/data/press'

/**
 * DOKAZ — ploca s palmarèsom.
 *
 * Njihove prave medalje (public/medal/), a uz svaku TOCNO KOJE VINO: "Decanter
 * Silver" bez "Dingac" je bedz, s njim je cinjenica. Godina tabularno lijevo,
 * kao u registru.
 *
 * Izvor medalja je 97 px, pa se prikazuju na 48-64 px da ostanu ostre.
 */
export default function Proof() {
  const [lead, ...rest] = AWARDS

  return (
    <section id="proof" style={{ paddingBottom: 'var(--sec-y)' }} className="relative z-10 px-5 md:px-8">
      <div className="mx-auto grid w-full max-w-[92rem] gap-[var(--s-5)] lg:grid-cols-12">
        {/* --- portret osnivaca: dokaz je i lice, ne samo medalja --- */}
        <Plate enter className="overflow-hidden lg:col-span-4">
          <Frame
            name="founder"
            alt="Ivo Šegović above the underwater cellar off Janjina"
            sizes="(min-width: 1024px) 30vw, 100vw"
            className="aspect-[4/5] w-full object-cover"
            position="50% 28%"
          />
          <div style={{ padding: 'var(--s-4)' }}>
            <p className="t-stamp text-plate-ink/50">Ivo Šegović</p>
            <p className="t-body mt-[var(--s-2)] text-plate-ink/65">
              Made the first Edivo wine in 2011. Sank a crate of it two years later to see what
              would happen.
            </p>
          </div>
        </Plate>

        <Plate enter delay={80} className="lg:col-span-8">
          <div
            className="flex flex-wrap items-baseline justify-between gap-[var(--s-3)] border-b border-plate-rule-strong"
            style={{ padding: 'var(--s-3) var(--s-4)' }}
          >
            <span className="t-stamp text-plate-ink/50">Palmarès · judged blind</span>
            <span className="t-stamp text-plate-ink/40">{AWARDS.length} entries</span>
          </div>

          {/* --- vodeca: najsvjezija i najprepoznatljivija --- */}
          <div
            className="flex items-center gap-[var(--s-4)] border-b border-plate-rule"
            style={{ padding: 'var(--s-5) var(--s-4)' }}
          >
            {lead.icon && (
              <Image
                src={`/medal/${lead.icon}.webp`}
                alt=""
                width={112}
                height={112}
                className="h-16 w-16 shrink-0"
              />
            )}
            <div className="min-w-0">
              <div className="flex flex-wrap items-baseline gap-x-[var(--s-4)]">
                <span className="t-title tnum text-stamp">{lead.year}</span>
                <p className="t-title text-plate-ink">{lead.body}</p>
              </div>
              <p className="t-field mt-[var(--s-2)] text-plate-ink/60">
                <span className="t-stamp text-stamp">{lead.medal}</span>
                <span className="mx-[var(--s-2)] text-plate-ink/25">·</span>
                {lead.detail}
              </p>
            </div>
          </div>

          <ul className="grid sm:grid-cols-2">
            {rest.map((a, i) => (
              <li
                key={a.year + a.body}
                className={`flex items-start gap-[var(--s-3)] border-plate-rule ${
                  i % 2 === 0 ? 'sm:border-r' : ''
                } ${i < rest.length - (rest.length % 2 === 0 ? 2 : 1) ? 'border-b' : ''}`}
                style={{ padding: 'var(--s-4)' }}
              >
                {a.icon ? (
                  <Image
                    src={`/medal/${a.icon}.webp`}
                    alt=""
                    width={112}
                    height={112}
                    className="h-12 w-12 shrink-0"
                  />
                ) : (
                  /* Patent nema medalju — okvir drzi poravnanje s ostalima */
                  <span
                    aria-hidden
                    className="t-stamp flex h-12 w-12 shrink-0 items-center justify-center border border-stamp/40 text-stamp"
                  >
                    PAT
                  </span>
                )}
                <div className="min-w-0">
                  <div className="flex flex-wrap items-baseline gap-x-[var(--s-3)]">
                    <span className="t-field tnum text-plate-ink/50">{a.year}</span>
                    <p className="t-title text-plate-ink" style={{ fontSize: '1.05rem' }}>
                      {a.body}
                    </p>
                  </div>
                  <p className="t-stamp mt-[var(--s-2)] text-stamp">{a.medal}</p>
                  <p className="t-field mt-[var(--s-2)] text-plate-ink/50">{a.detail}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="border-t border-plate-rule-strong" style={{ padding: 'var(--s-4)' }}>
            <p className="t-stamp mb-[var(--s-3)] text-plate-ink/40">Written about in</p>
            <ul className="flex flex-wrap gap-x-[var(--s-6)]">
              {STORIES.map((s) => (
                <li key={s.href}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="t-title inline-block py-[var(--s-3)] text-plate-ink/55 transition-colors duration-200 hover:text-stamp"
                    style={{ fontSize: '1.05rem' }}
                  >
                    {s.outlet}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Plate>
      </div>
    </section>
  )
}
