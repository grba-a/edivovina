import type { Metadata } from 'next'
import PageShell from '@/components/page/PageShell'
import PageOpen from '@/components/page/PageOpen'
import Station from '@/components/station/Station'
import { station } from '@/data/stations'
import { QUOTE } from '@/data/press'

const S = station('seabed')

export const metadata: Metadata = {
  title: 'Contact — Edivo Vina',
  description:
    'Edivo Winery, Janjina 62. Edivo wine bar, Drače 18, Pelješac. +385 91 6127 229 · info@edivovina.hr',
}

const FIND: [string, string][] = [
  ['The winery', 'Janjina 62, 20246 Janjina'],
  ['The wine bar', 'Drače 18, 20246 Drače'],
  ['By car', 'One hour from Dubrovnik'],
  ['By boat', 'Drače has a jetty'],
  ['Coordinates', '42°55′N 17°28′E'],
]

const CHANNELS: [string, string][] = [
  ['Orders & shipping', 'sales@edivovina.hr'],
  ['Visits & tastings', 'info@edivovina.hr'],
  ['Press & wholesale', 'info@edivovina.hr'],
]

const SUBJECTS = ['An order', 'A visit or tasting', 'Wholesale & distribution', 'Press']

/**
 * /contact — 25 m, postaja `seabed`. Otvaranje, pa DVA STUPCA: forma i podaci.
 *
 * Prva verzija je bila najgora na webu: pet praznih uokvirenih pravokutnika,
 * dvije kartice s adresama UZ ruled listu (dva sustava u istom stupcu), forma
 * u trecoj sekciji preko cijele sirine, i ni jedne fotografije na abisu.
 *
 * Forma sada stoji u SOLIDNOM panelu s podvucenim poljima — pet obrubljenih
 * kutija na tamnom citalo se kao skelet, a podvucena polja su i ljepsa i
 * mirnija. Panel je neprozirni `bg-surface`: poluprozirni bi propustio vodu i
 * marine snow kroz sebe.
 *
 * Njihova /contact ima tocno cetiri polja i NISTA drugo u tijelu: bez adrese,
 * bez telefona, bez uvodne recenice. Dodajemo `subject`, jer narudzba, posjet
 * i press nisu isti kupac a sada im svi padnu u istu kutiju. Consent tekst je
 * NJIHOV, verbatim.
 *
 * ONEMOGUCENA je, ne `action="#"` — tako je polje tiho jelo adresu i skakalo
 * na vrh stranice. Spaja se u WordPressu.
 */
export default function ContactPage() {
  const field =
    'w-full border-0 border-b border-ivory/25 bg-transparent px-0 py-[var(--s-3)] text-ivory placeholder:text-ivory/30 transition-colors focus:border-gold disabled:opacity-80'

  return (
    <PageShell data={S}>
      <PageOpen
        data={S}
        side="l"
        title="A phone call is faster."
        lead="The number is a phone and WhatsApp, and somebody actually answers it. The form works too — it just takes longer."
        meta="+385 91 6127 229"
      />

      <Station
        data={S}
        side="r"
        stage={false}
        style={{ paddingTop: 'var(--sec-y-tight)', paddingBottom: 'var(--sec-y)' }}
      >
        <div className="ed-in relative z-10">
          <div className="grid gap-[var(--s-7)] md:grid-cols-[1.05fr_0.95fr] md:items-start md:gap-[var(--s-8)]">
            {/* --- stupac 1: forma --- */}
            <div className="border border-ivory/14 bg-surface p-[var(--s-5)] md:p-[var(--s-6)]">
              <div className="flex flex-wrap items-baseline justify-between gap-[var(--s-3)]">
                <h2 className="t-title text-ivory">Write to us</h2>
                <p className="data-label-sm text-ivory/40">Wired in WordPress</p>
              </div>

              <form className="mt-[var(--s-5)] flex flex-col gap-[var(--s-5)]">
                {[
                  { id: 'c-name', label: 'Name', type: 'text', ph: 'Your name', ac: 'name' },
                  { id: 'c-email', label: 'Email', type: 'email', ph: 'you@email.com', ac: 'email' },
                ].map((f) => (
                  <p key={f.id} className="flex flex-col gap-[var(--s-1)]">
                    <label htmlFor={f.id} className="data-label-sm text-gold/85">
                      {f.label}
                    </label>
                    <input
                      id={f.id}
                      name={f.id.slice(2)}
                      type={f.type}
                      placeholder={f.ph}
                      autoComplete={f.ac}
                      disabled
                      className={field}
                    />
                  </p>
                ))}

                <p className="relative flex flex-col gap-[var(--s-1)]">
                  <label htmlFor="c-subject" className="data-label-sm text-gold/85">
                    What is it about
                  </label>
                  <span
                    aria-hidden
                    className="pointer-events-none absolute bottom-[var(--s-4)] right-0 text-gold/70"
                  >
                    <svg viewBox="0 0 12 8" className="h-[6px] w-[10px]" fill="none" stroke="currentColor" strokeWidth="1.6">
                      <path d="M1 1l5 5 5-5" />
                    </svg>
                  </span>
                  <select
                    id="c-subject"
                    name="subject"
                    disabled
                    className={`${field} appearance-none pr-[var(--s-6)]`}
                  >
                    {SUBJECTS.map((x) => (
                      <option key={x}>{x}</option>
                    ))}
                  </select>
                </p>

                <p className="flex flex-col gap-[var(--s-1)]">
                  <label htmlFor="c-message" className="data-label-sm text-gold/85">
                    Message
                  </label>
                  <textarea
                    id="c-message"
                    name="message"
                    rows={3}
                    placeholder="Which wine, how many, and where to?"
                    disabled
                    className={`${field} resize-none`}
                  />
                </p>

                <p className="flex items-start gap-[var(--s-3)]">
                  <input
                    id="c-consent"
                    name="consent"
                    type="checkbox"
                    disabled
                    className="mt-[3px] h-4 w-4 shrink-0 accent-[var(--color-gold)] disabled:opacity-70"
                  />
                  {/* Njihov consent tekst, verbatim. */}
                  <label htmlFor="c-consent" className="t-field text-ivory/60">
                    I consent to having this website store my submitted information so they can
                    respond to my inquiry.
                  </label>
                </p>

                <button
                  type="submit"
                  disabled
                  className="data-label pressable w-full bg-gold py-[var(--s-4)] text-abyss disabled:opacity-80"
                >
                  Send
                </button>
              </form>
            </div>

            {/* --- stupac 2: gdje smo i komu se pise --- */}
            <div>
              <h2 className="t-plate max-w-[14ch] text-ivory">Where we are.</h2>

              <dl className="mt-[var(--s-5)]">
                {FIND.map(([k, v]) => (
                  <div key={k} className="ed-row">
                    <dt className="data-label shrink-0 text-ivory/60">{k}</dt>
                    <span aria-hidden className="ed-rule" />
                    <dd className="t-field shrink-0 text-ivory/85">{v}</dd>
                  </div>
                ))}
              </dl>

              <dl className="mt-[var(--s-6)]">
                {CHANNELS.map(([label, to]) => (
                  <div key={label} className="ed-row">
                    <dt className="data-label shrink-0 text-gold">{label}</dt>
                    <span aria-hidden className="ed-rule" />
                    <dd className="shrink-0">
                      {/* Negativna margina: prst dobiva 44 px, a red ne naraste
                          — s `min-h-11` je svaki kanal bio 69 px visok i vlas
                          je visjela u praznini iznad maila. */}
                      <a
                        href={`mailto:${to}`}
                        className="t-field -my-[var(--s-3)] inline-flex min-h-11 items-center text-ivory/85 hover:text-gold"
                      >
                        {to}
                      </a>
                    </dd>
                  </div>
                ))}
              </dl>

              {/* Njihov citat o pozivima iz cijelog svijeta — na stranici gdje
                  ih se zove. Najbolje mjesto za tu recenicu na cijelom webu. */}
              <blockquote className="mt-[var(--s-7)] border-t border-ivory/16 pt-[var(--s-6)]">
                <p
                  className="t-plate max-w-[26ch] text-ivory"
                  style={{ fontSize: 'clamp(1.2rem, 2.4vw, 1.7rem)', lineHeight: 1.26 }}
                >
                  {`“${QUOTE.text}”`}
                </p>
                <footer className="data-label-sm mt-[var(--s-4)] text-ivory/55">
                  {QUOTE.who} · {QUOTE.where}
                </footer>
              </blockquote>

              {/* Radno vrijeme NAMJERNO nema — njihov web ga nigdje ne objavljuje. */}
              <p className="t-field mt-[var(--s-6)] max-w-[38ch] text-ivory/55">
                Opening hours are seasonal. Call or message before you set off.
              </p>
            </div>
          </div>
        </div>
      </Station>
    </PageShell>
  )
}
