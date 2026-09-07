import Station from '@/components/station/Station'
import { station } from '@/data/stations'
import { MARKS, STORIES, QUOTE } from '@/data/press'

const S = station('press')

/**
 * 18 METARA — PISALI SU. Amfore nema.
 *
 * Dva sloja: marke koje su stvarno pisale, pa kurirani zapisi s linkom van.
 * Tudi tekst se NE prepisuje — svaki zapis nosi nasu jednu recenicu o tome sto
 * je u clanku. Jedina navedena izjava je njihova vlastita.
 *
 * Ovo je dokaz, ne blog. Prazan blog steti vise nego da ga nema.
 */
export default function Press() {
  return (
    <Station data={S} side="l" style={{ paddingBlock: 'var(--sec-y)' }}>
      <div className="ed-in relative z-10">
        <p className="data-label text-gold">{S.light}</p>

        {/* Naslov je bio `sr-only`, pa je vidljivi kupac vidio sest serifnih
            rijeci u nizu i citao ih kao traku partnera. Najjaci tudi dokaz koji
            imaju bio je neoznacen. */}
        <h2 id={`${S.id}-h`} className="t-title mt-[var(--s-5)] text-ivory">
          Pisali su o nama
        </h2>

        <ul className="mt-[var(--s-5)] flex flex-wrap items-baseline gap-x-[var(--s-7)] gap-y-[var(--s-3)]">
          {MARKS.map((m) => (
            <li key={m} className="t-title text-ivory/78">
              {m}
            </li>
          ))}
        </ul>

        {/* max-width ide na <p>, ne na <blockquote>: `ch` se mjeri u fontu
            ELEMENTA na kojem stoji. Na blockquoteu je to Raleway 1rem, pa je
            20ch ispalo 196 px — a sadrzaj je Baskerville 40 px i citat se
            slomio u stupac od jedne rijeci po redu. */}
        <blockquote className="mt-[var(--sec-y-tight)]">
          <p
            className="t-plate max-w-[30ch] text-ivory"
            style={{ fontSize: 'clamp(1.4rem, 3.4vw, 2.5rem)', lineHeight: 1.22 }}
          >
            {`„${QUOTE.text}”`}
          </p>
          <footer className="data-label-sm mt-[var(--s-4)] text-ivory/60">
            {QUOTE.who} · {QUOTE.where}
          </footer>
        </blockquote>

        <ul className="mt-[var(--s-8)]">
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
                <span className="data-label-sm tnum text-ivory/60 md:text-right">
                  {st.year}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </Station>
  )
}
