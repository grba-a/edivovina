import type { Metadata } from 'next'
import Link from 'next/link'
import PageShell from '@/components/page/PageShell'
import PageHead from '@/components/page/PageHead'
import { station } from '@/data/stations'
import { MARKS, STORIES, QUOTE, AWARDS } from '@/data/press'

const S = station('press')

export const metadata: Metadata = {
  title: 'News & Stories — Edivo Vina',
  description:
    'PBS, National Geographic Traveller, Euronews, Forbes and Atlas Obscura on the underwater cellar off Pelješac.',
}

/**
 * /news — 18 m, postaja `press`. Prosirena verzija „In the press".
 *
 * KURIRAMO I LINKAMO, ne prepisujemo. Njihova /news-stories hosta ~62 unosa i
 * gotovo sve je preslikan tudi tisak objavljen kao vlastiti post — od 60
 * prikazanih 51 je prije 2022. To je i pravno pitanje i pitanje kvalitete, pa
 * ovdje stoji samo ono sto se dalo potvrditi, s linkom na izvor i NASOM jednom
 * recenicom o tome sto je u clanku. Tudi tekst se ne uvozi.
 */
export default function NewsPage() {
  return (
    <PageShell data={S}>
      <PageHead
        data={S}
        side="l"
        lines={['What others', 'have written.']}
        intro="We link out rather than reprint. Every line below is somebody else’s reporting, in their own place, with one sentence from us about what is in it."
        readout={`${STORIES.length} stories · ${MARKS.length} outlets`}
      />

      <section aria-labelledby="marks-h" style={{ paddingBlock: 'var(--sec-y-tight)' }}>
        <div className="ed-in">
          <h2 id="marks-h" className="data-label text-gold">
            Covered by
          </h2>
          <ul className="mt-[var(--s-5)] flex flex-wrap items-baseline gap-x-[var(--s-7)] gap-y-[var(--s-3)]">
            {MARKS.map((m) => (
              <li key={m} className="t-title text-ivory/78">
                {m}
              </li>
            ))}
          </ul>

          <blockquote className="mt-[var(--sec-y-tight)]">
            <p
              className="t-plate max-w-[30ch] text-ivory"
              style={{ fontSize: 'clamp(1.4rem, 3.4vw, 2.5rem)', lineHeight: 1.22 }}
            >
              {`“${QUOTE.text}”`}
            </p>
            <footer className="data-label-sm mt-[var(--s-4)] text-ivory/60">
              {QUOTE.who} · {QUOTE.where}
            </footer>
          </blockquote>
        </div>
      </section>

      <section aria-labelledby="stories-h" style={{ paddingBottom: 'var(--sec-y)' }}>
        <div className="ed-in">
          <h2 id="stories-h" className="t-title text-ivory">
            Selected coverage
          </h2>
          <ul className="mt-[var(--s-5)]">
            {STORIES.map((st) => (
              <li key={st.href}>
                <a
                  href={st.href}
                  target="_blank"
                  rel="noreferrer"
                  className="grid gap-x-[var(--s-6)] gap-y-[var(--s-2)] border-t border-ivory/16 py-[var(--s-5)] transition-opacity duration-200 hover:opacity-70 md:grid-cols-[15rem_1fr_5rem] md:items-baseline"
                >
                  <span className="data-label text-gold">{st.outlet}</span>
                  <span>
                    <span className="t-title block text-ivory">{st.title}</span>
                    <span className="t-field mt-[var(--s-2)] block text-ivory/65">{st.note}</span>
                  </span>
                  <span className="data-label-sm tnum text-ivory/60 md:text-right">{st.year}</span>
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-[var(--s-8)] flex flex-wrap items-center gap-[var(--s-4)] border-t border-ivory/16 pt-[var(--s-6)]">
            <p className="t-field max-w-[40ch] text-ivory/65">
              {AWARDS.length} medals sit behind this, from Decanter, the America Wine Awards and
              Sabatina — two of them for the object, not the wine.
            </p>
            <Link
              href="/wines"
              className="data-label pressable ml-auto bg-gold px-[var(--s-5)] py-[var(--s-4)] text-abyss"
            >
              See the wines
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  )
}
