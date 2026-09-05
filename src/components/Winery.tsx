import Frame from '@/components/ui/Frame'
import Station from '@/components/station/Station'
import { STATIONS } from '@/data/stations'

const S = STATIONS[1]

/**
 * 6 METARA — VINARIJA. Amfore nema.
 *
 * Ovdje se cita, pa je ekran cista tipografija i jedan kadar koji PROBIJA
 * lijevi rub. Predmet se vraca tek na dvanaest metara.
 *
 * Brojke su samo one koje su provjerene kroz nezavisne izvore: dubina ide kao
 * „oko dvadeset" jer njihov web sam sebi proturjeci (18–25 m i 14 m), trajanje
 * i temperatura su potvrdeni u vise izvora.
 */
const FIGURES = [
  { n: '≈20', l: 'metara dubine' },
  { n: '700', l: 'dana dolje' },
  { n: '14–16', l: 'stupnjeva, cijele godine' },
]

export default function Winery() {
  return (
    <Station data={S} side="l" style={{ paddingBlock: 'var(--sec-y)' }}>
      <div className="relative z-10 mx-auto w-full max-w-[var(--wrap)] px-5 md:px-8">
        <p className="data-label text-gold">{S.light}</p>

        <h2 id={`${S.id}-h`} className="t-plate mt-[var(--s-5)] max-w-[15ch] text-ivory">
          Prestali smo graditi podrume 2013.
        </h2>

        <div className="mt-[var(--sec-y-tight)] grid gap-[var(--s-8)] md:grid-cols-[1.05fr_.95fr] md:items-start">
          <div>
            <p className="t-body text-ivory/70">
              Prve amfore spuštene su u potonuli ribarski brod kod Janjine. Trebalo je godinu dana
              neuspjelih brtvi prije nego je morska voda ostala vani.
            </p>
            <p className="t-body mt-[var(--s-4)] text-ivory/70">
              Glina je iz Petrinje, kovano ležište iz Siska, kutija od borovine iz Varaždina. Ništa
              iz daleka — kao ni vino.
            </p>

            <dl className="mt-[var(--s-7)] grid grid-cols-3 gap-[var(--s-5)]">
              {FIGURES.map((f) => (
                <div key={f.l}>
                  <dt className="sr-only">{f.l}</dt>
                  <dd>
                    <span className="t-plate tnum block text-ivory" style={{ fontSize: 'clamp(1.6rem, 3.6vw, 2.8rem)' }}>
                      {f.n}
                    </span>
                    <span className="data-label mt-[var(--s-2)] block leading-snug text-ivory/45" style={{ fontSize: '0.5rem' }}>
                      {f.l}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Kadar probija lijevi rub — ne sjedi u kutiji. */}
          <div className="ed-bleed-l">
            <Frame
              name="seabed-pebbles"
              alt="Desetci obraštenih amfora složenih na morskom dnu kod Janjine"
              sizes="(min-width: 768px) 52vw, 100vw"
              ratio={1.5}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </Station>
  )
}
