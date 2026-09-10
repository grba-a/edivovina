import { AMPHORA, BOTTLE } from '@/data/silhouettes'

/**
 * ANATOMIJA — dva panela, njihova sekvenca, nas crtez.
 *
 * Ovo je element s dna njihove About stranice, onaj koji se Petru svidio. Kod
 * njih je to TRI prozirna PNG-a nad jednom `sea-bottom-background.jpg`, tri
 * banda po 80vh, staticno: karta obale -> presjek vodenog stupa -> cutaway
 * amfore s tri zlatna callouta.
 *
 * KARTA JE SKINUTA na Petrov zahtjev. Ostaju presjek i cutaway — dva crteza
 * koja govore o predmetu; karta je govorila o mjestu, a to stranica vec kaze
 * tekstom („one hour from Dubrovnik", dvije adrese) i cijela /visit stranica.
 *
 * Prenosimo TEHNIKU (jedan kontinuirani gradijent, prozracni bandovi, zlatna
 * hairline grafika, oznaka tijesno nad brojkom) i mijenjamo IMPLEMENTACIJU:
 *
 *   njihovo                        nase
 *   -------                        ----
 *   tekst zapecen u PNG            zivi <text> — prevodi se, ostaje ostar
 *   amphora-en.png + amphora-hr    jedan crtez, bez jezicnog blizanca
 *   444 px raster                  vektor, ostar na svakom ekranu
 *   `cover` na 80vh kutiji         viewBox, nista se ne kropa
 *
 * Cutaway koristi `silhouettes.ts` — MJERENE siluete iz istih krivulja koje
 * vozi 3D model. Crtez je time dokazano isti predmet koji na naslovnici pada
 * kroz vodu, a `three` ne ulazi u bundle ove stranice.
 *
 * Dijagram nosi VLASTITU skalu 0–25 m i ne dira `--descent`. Figura ima svoj
 * koordinatni sustav; stranica ostaje na svojoj dubini (6 m).
 */

/**
 * Boca UNUTAR amfore.
 *
 * Na pravu visinsku skalu (obje su 300 mm) boca izlazi ispod amforinog siljka,
 * jer amfora zadnjih ~30 jedinica suzava u vrh a boca ima ravno dno — pa je
 * crtez pokazivao bocu koja probija glinu. Dijagram mora prije svega pokazati
 * SADRZAVANJE; mjere od 300 mm stoje u popisu podataka, ne u ovom crtezu.
 */
const B_SCALE = 0.55
const B_Y = 16
const B_X = (100 - 100 * B_SCALE) / 2

const DEPTHS = [0, 6, 12, 18, 25]

export default function Anatomy() {
  return (
    <section aria-labelledby="anatomy-h" className="relative overflow-hidden">
      {/* Jedan kontinuirani gradijent kroz sva tri banda — to je ono sto ih
          spaja u jedan zaron. Kod njih je to jedna JPEG podloga. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(18,119,122,0.28) 0%, rgba(9,51,78,0.55) 42%, rgba(3,20,31,0.9) 100%)',
        }}
      />

      <div className="relative z-10">
        <div className="ed-in" style={{ paddingTop: 'var(--sec-y)' }}>
          <h2 id="anatomy-h" className="t-plate max-w-[22ch] text-ivory">
            Each bottle is unique.
          </h2>
          <p className="t-body mt-[var(--s-4)] text-ivory/70">
            It is the product of great love, effort and time.
          </p>
        </div>

        {/* ---------- 1. PRESJEK VODENOG STUPA ---------- */}
        <figure className="ed-in mt-[var(--sec-y-tight)]">
          <svg
            viewBox="0 0 800 440"
            role="img"
            aria-labelledby="col-t"
            className="h-auto w-full"
          >
            <title id="col-t">
              Cross-section of the water column: an amphora lowered on a line to the seabed at
              around twenty metres
            </title>

            {/* povrsina */}
            <path
              d="M0 34 q40 -9 80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0"
              fill="none"
              stroke="var(--color-ivory)"
              strokeOpacity="0.4"
              strokeWidth="1.5"
            />

            {/* vlastita skala dubine — koordinatni sustav FIGURE, ne stranice */}
            {DEPTHS.map((m) => {
              const y = 34 + (m / 25) * 330
              return (
                <g key={m}>
                  <line
                    x1="46"
                    y1={y}
                    x2="754"
                    y2={y}
                    stroke="var(--color-ivory)"
                    strokeOpacity="0.09"
                    strokeDasharray="2 8"
                  />
                  <text
                    x="36"
                    y={y + 4}
                    textAnchor="end"
                    className="fill-ivory"
                    fillOpacity="0.45"
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: 10,
                      letterSpacing: '0.14em',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {m} m
                  </text>
                </g>
              )
            })}

            {/* dno u tri tonska sloja — njihov crtez ima isto */}
            <path d="M0 392 C150 372 260 386 400 378 C540 370 660 384 800 372 L800 440 L0 440 Z" fill="#0a2532" />
            <path d="M0 410 C160 396 280 406 420 400 C560 394 680 404 800 396 L800 440 L0 440 Z" fill="#072536" />
            <path d="M0 426 C180 416 300 422 440 418 C580 414 700 420 800 416 L800 440 L0 440 Z" fill="#03141f" />

            {/* posidonija + siluete amfora na grebenu */}
            {[70, 130, 600, 660, 720].map((x, i) => (
              <g key={x} stroke="#03141f" strokeWidth="3" fill="none" strokeLinecap="round">
                <path d={`M${x} 392 q -6 -26 2 -44`} />
                <path d={`M${x + 8} 392 q 5 -30 -1 -50`} />
                <path d={`M${x + 16} 392 q 8 -22 3 -38`} />
                {i % 2 === 0 && <circle cx={x + 10} cy={318} r="3" strokeWidth="1.5" strokeOpacity="0.45" />}
                {i % 2 === 0 && <circle cx={x + 16} cy={300} r="4.5" strokeWidth="1.5" strokeOpacity="0.32" />}
              </g>
            ))}
            {[220, 268, 316, 470, 518].map((x) => (
              <g key={x} transform={`translate(${x} 356) scale(0.145)`}>
                <path d={AMPHORA.d} fill="#03141f" />
              </g>
            ))}

            {/* AMFORA NA UZETU — vizualna isplata cijele sekvence */}
            <line x1="400" y1="34" x2="400" y2="250" stroke="var(--color-ivory)" strokeOpacity="0.5" strokeWidth="1.2" />
            <circle cx="400" cy="250" r="4" fill="none" stroke="var(--color-ivory)" strokeOpacity="0.6" strokeWidth="1.4" />
            <g transform="translate(400 254) scale(0.42) translate(-50 0)">
              <path d={AMPHORA.d} fill="var(--color-gold)" />
              {AMPHORA.lines?.map((d, i) => (
                <path key={i} d={d} fill="none" stroke="var(--color-gold)" strokeWidth="4" />
              ))}
            </g>

            {/* pojas u kojem stvarno stoje — NJIHOVA brojka */}
            <g>
              <line x1="612" y1={34 + (18 / 25) * 330} x2="612" y2={34 + (25 / 25) * 330} stroke="var(--color-gold)" strokeWidth="1.4" />
              <text
                x="626"
                y={34 + (21.2 / 25) * 330}
                className="fill-gold"
                style={{ fontFamily: 'var(--font-display)', fontSize: 17 }}
              >
                ≈20 m
              </text>
              <text
                x="626"
                y={34 + (21.2 / 25) * 330 + 18}
                className="fill-ivory"
                fillOpacity="0.6"
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 9.5,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                }}
              >
                for over 700 days
              </text>
            </g>
          </svg>
        </figure>

        {/* ---------- 2. CUTAWAY ---------- */}
        <figure className="ed-in mt-[var(--sec-y)]" style={{ paddingBottom: 'var(--sec-y)' }}>
          <svg
            viewBox="0 0 620 300"
            role="img"
            aria-labelledby="cut-t"
            className="mx-auto h-auto w-full max-w-[42rem]"
          >
            <title id="cut-t">
              Cutaway of the amphora: a 0.75 litre glass bottle inside a clay vessel, sealed with a
              cork and two layers of rubber
            </title>

            <g transform="translate(260 22) scale(1.02)">
              {/* glinena amfora — hairline obris, bez fila */}
              <path
                d={AMPHORA.d}
                fill="none"
                stroke="var(--color-ivory)"
                strokeOpacity="0.85"
                strokeWidth="1.5"
              />
              {AMPHORA.lines?.map((d, i) => (
                <path
                  key={i}
                  d={d}
                  fill="none"
                  stroke="var(--color-ivory)"
                  strokeOpacity="0.85"
                  strokeWidth="1.5"
                />
              ))}

              {/* boca unutra — ista visina, grlo ulazi u grlo */}
              <g transform={`translate(${B_X} ${B_Y}) scale(${B_SCALE})`}>
                <path d={BOTTLE.d} fill="var(--color-ivory)" fillOpacity="0.07" />
                <path
                  d={BOTTLE.d}
                  fill="none"
                  stroke="var(--color-ivory)"
                  strokeOpacity="0.45"
                  strokeWidth="2.2"
                  strokeDasharray="5 5"
                />
              </g>

              {/* cep i dva sloja — zlatni detalj na grlu, kao kod njih */}
              <rect x="42.5" y="2" width="15" height="12" rx="1.5" fill="var(--color-gold)" />
              <line x1="41" y1="16.5" x2="59" y2="16.5" stroke="var(--color-gold)" strokeWidth="2" />
              <line x1="41" y1="20.5" x2="59" y2="20.5" stroke="var(--color-gold)" strokeWidth="2" />
            </g>

            {/* callouti — njihova tri, ali kao zivi tekst */}
            {/* Eksplicitne koordinate: prije su se citale iz `d` stringa preko
                split(' '), i indeksi su bili krivi — cy je dobivao „L392" i
                svaka je stranica bacala `<circle> attribute cy: Expected
                length`. Uhvatio check-routes.mjs, ne oko. */}
            {[
              { px: 310, py: 30, tx: 400, ty: 26, sub: 'cork & two layers of rubber', anchor: 'start' as const },
              { px: 353, py: 150, tx: 444, ty: 146, sub: 'clay amphora', anchor: 'start' as const },
              { px: 300, py: 200, tx: 176, ty: 196, sub: 'glass bottle, 0.75 L', anchor: 'end' as const },
            ].map((c) => (
              <g key={c.sub}>
                <line
                  x1={c.px}
                  y1={c.py}
                  x2={c.anchor === 'start' ? c.tx - 8 : c.tx + 8}
                  y2={c.py}
                  stroke="var(--color-gold)"
                  strokeOpacity="0.6"
                  strokeWidth="1.2"
                />
                <circle cx={c.px} cy={c.py} r="3" fill="var(--color-gold)" />
                <text
                  x={c.tx}
                  y={c.ty}
                  textAnchor={c.anchor}
                  className="fill-gold"
                  style={{ fontFamily: 'var(--font-display)', fontSize: 14 }}
                >
                  {c.sub}
                </text>
              </g>
            ))}
          </svg>

          <figcaption className="ed-in mt-[var(--s-5)] text-center">
            {/* NB: njihov vlastiti crtez pise „two layers of WAX", a tekst na
                istoj stranici „two layers of RUBBER". Drzimo gumu, jer je to
                tekst a ne slika — ali je na listi za klijenta. */}
            <p className="data-label-sm text-ivory/55">
              Stored under the sea at around twenty metres · sealed · never opened until you open it
            </p>
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
