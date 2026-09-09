import type { Metadata } from 'next'
import PageShell from '@/components/page/PageShell'
import PageHead from '@/components/page/PageHead'
import { station } from '@/data/stations'
import { QUOTE } from '@/data/press'

const S = station('seabed')

export const metadata: Metadata = {
  title: 'Contact — Edivo Vina',
  description:
    'Edivo Winery, Janjina 62. Edivo wine bar, Drače 18, Pelješac. +385 91 6127 229 · info@edivovina.hr',
}

/** Tri kanala, jer to nisu isti kupci — kod njih svi padaju u istu kutiju. */
const CHANNELS = [
  { label: 'Orders & shipping', to: 'sales@edivovina.hr', note: 'UPS, DPD or DHL. Dispatched within 24 hours.' },
  { label: 'Visits & tastings', to: 'info@edivovina.hr', note: 'The wine bar in Drače, and the cellar itself.' },
  { label: 'Press & wholesale', to: 'info@edivovina.hr', note: 'Images, samples, distribution.' },
]

const SUBJECTS = ['An order', 'A visit or tasting', 'Wholesale & distribution', 'Press']

/**
 * /contact — 25 m, postaja `seabed`. Dno stranice je dno mora.
 *
 * Njihova forma ima tocno cetiri polja (name, email, message, consent) i
 * NISTA drugo u tijelu stranice — bez adrese, bez telefona, bez uvodne
 * recenice. Dodajemo `subject`, jer narudzba, posjet i press nisu isti kupac,
 * a sada im svi padnu u istu kutiju.
 *
 * Consent tekst je NJIHOV, verbatim.
 *
 * Forma je ONEMOGUCENA, ne `action="#"` — tako je polje tiho jelo adresu i
 * skakalo na vrh stranice. Spaja se u WordPressu.
 */
export default function ContactPage() {
  return (
    <PageShell data={S}>
      <PageHead
        data={S}
        side="r"
        lines={['A phone call', 'is faster.']}
        intro="Whatsapp and the phone are the same number, and somebody actually answers it. The form works too — it just takes longer."
        readout="+385 91 6127 229"
      />

      {/* Njihov citat o pozivima iz cijelog svijeta — na stranici gdje ih se zove.
          Najbolje mjesto za tu recenicu na cijelom webu. */}
      <section aria-label="A word from the winery" style={{ paddingBlock: 'var(--sec-y-tight)' }}>
        <div className="ed-in">
          <blockquote>
            <p
              className="t-plate max-w-[28ch] text-ivory"
              style={{ fontSize: 'clamp(1.3rem, 3.2vw, 2.3rem)', lineHeight: 1.24 }}
            >
              {`“${QUOTE.text}”`}
            </p>
            <footer className="data-label-sm mt-[var(--s-4)] text-ivory/60">
              {QUOTE.who} · {QUOTE.where}
            </footer>
          </blockquote>
        </div>
      </section>

      <section aria-labelledby="form-h" style={{ paddingBottom: 'var(--sec-y)' }}>
        <div className="ed-in grid gap-[var(--s-8)] md:grid-cols-[1.05fr_0.95fr]">
          {/* --- forma --- */}
          <div>
            <h2 id="form-h" className="t-title text-ivory">
              Write to us
            </h2>

            <form className="mt-[var(--s-5)] flex flex-col gap-[var(--s-4)]">
              {[
                { id: 'c-name', label: 'Name', type: 'text', autoComplete: 'name' },
                { id: 'c-email', label: 'Email', type: 'email', autoComplete: 'email' },
              ].map((f) => (
                <p key={f.id} className="flex flex-col gap-[var(--s-2)]">
                  <label htmlFor={f.id} className="data-label text-ivory/70">
                    {f.label}
                  </label>
                  <input
                    id={f.id}
                    name={f.id.slice(2)}
                    type={f.type}
                    autoComplete={f.autoComplete}
                    disabled
                    className="border border-ivory/22 bg-transparent px-[var(--s-3)] py-[var(--s-3)] text-ivory transition-colors focus:border-gold disabled:opacity-60"
                  />
                </p>
              ))}

              <p className="flex flex-col gap-[var(--s-2)]">
                <label htmlFor="c-subject" className="data-label text-ivory/70">
                  What is it about
                </label>
                <select
                  id="c-subject"
                  name="subject"
                  disabled
                  className="border border-ivory/22 bg-surface px-[var(--s-3)] py-[var(--s-3)] text-ivory disabled:opacity-60"
                >
                  {SUBJECTS.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </p>

              <p className="flex flex-col gap-[var(--s-2)]">
                <label htmlFor="c-message" className="data-label text-ivory/70">
                  Message
                </label>
                <textarea
                  id="c-message"
                  name="message"
                  rows={4}
                  disabled
                  className="border border-ivory/22 bg-transparent px-[var(--s-3)] py-[var(--s-3)] text-ivory transition-colors focus:border-gold disabled:opacity-60"
                />
              </p>

              <p className="flex items-start gap-[var(--s-3)]">
                <input
                  id="c-consent"
                  name="consent"
                  type="checkbox"
                  disabled
                  className="mt-[3px] h-4 w-4 shrink-0 accent-[var(--color-gold)] disabled:opacity-60"
                />
                {/* Njihov consent tekst, verbatim. */}
                <label htmlFor="c-consent" className="t-field text-ivory/65">
                  I consent to having this website store my submitted information so they can
                  respond to my inquiry.
                </label>
              </p>

              <button
                type="submit"
                disabled
                title="The form is wired in WordPress"
                className="data-label pressable mt-[var(--s-2)] self-start bg-gold px-[var(--s-5)] py-[var(--s-4)] text-abyss disabled:opacity-60"
              >
                Send
              </button>
            </form>
          </div>

          {/* --- kako do njih --- */}
          <div>
            <h2 className="t-title text-ivory">How to find us</h2>

            <div className="mt-[var(--s-5)] grid gap-[var(--s-5)] sm:grid-cols-2">
              <div className="border border-ivory/14 bg-surface p-[var(--s-4)]">
                <h3 className="data-label text-gold">Edivo Winery</h3>
                <address className="t-field mt-[var(--s-3)] not-italic leading-loose text-ivory/70">
                  Janjina 62
                  <br />
                  20246 Janjina
                  <br />
                  Pelješac, Croatia
                </address>
              </div>
              <div className="border border-ivory/14 bg-surface p-[var(--s-4)]">
                <h3 className="data-label text-gold">Edivo wine bar</h3>
                <address className="t-field mt-[var(--s-3)] not-italic leading-loose text-ivory/70">
                  Drače 18
                  <br />
                  20246 Drače
                  <br />
                  Pelješac, Croatia
                </address>
              </div>
            </div>

            <dl className="mt-[var(--s-6)]">
              {[
                ['By car', 'One hour north-west of Dubrovnik along the coast, then onto the peninsula.'],
                ['By boat', 'Drače has a jetty. The wine bar is on the water.'],
                ['Coordinates', '42°55′N 17°28′E'],
              ].map(([k, v]) => (
                <div key={k} className="border-t border-ivory/12 py-[var(--s-3)]">
                  <dt className="data-label text-ivory/60">{k}</dt>
                  <dd className="t-field mt-[var(--s-1)] max-w-[38ch] text-ivory/80">{v}</dd>
                </div>
              ))}
            </dl>

            <ul className="mt-[var(--s-6)]">
              {CHANNELS.map((c) => (
                <li key={c.label} className="border-t border-ivory/12 py-[var(--s-4)]">
                  <p className="data-label text-gold">{c.label}</p>
                  <a
                    href={`mailto:${c.to}`}
                    className="t-field mt-[var(--s-2)] inline-flex min-h-11 items-center text-ivory/85 hover:text-gold"
                  >
                    {c.to}
                  </a>
                  <p className="t-field mt-[var(--s-1)] max-w-[38ch] text-ivory/60">{c.note}</p>
                </li>
              ))}
            </ul>

            {/* Radno vrijeme NAMJERNO nema — njihov web ga nigdje ne objavljuje. */}
            <p className="t-field mt-[var(--s-5)] max-w-[38ch] text-ivory/55">
              Opening hours are seasonal. Call or message before you set off.
            </p>
          </div>
        </div>
      </section>
    </PageShell>
  )
}
