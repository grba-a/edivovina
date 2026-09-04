import type { Metadata } from 'next'
import PageHead from '@/components/PageHead'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Contact — Edivo Vina',
  description: 'Edivo Vina, Janjina and Drače, Pelješac peninsula, Croatia.',
}

/**
 * FORM TEMPLATE. Namjerno bez action/handlera — obrazac se spaja u
 * WordPressu (Breakdance + WP Forms / WooCommerce). Sve je ispravno
 * oznaceno i tipizirano da se polja mapiraju 1:1.
 */
const FIELDS = [
  { name: 'name', label: 'Name', type: 'text', autoComplete: 'name', required: true },
  { name: 'email', label: 'Email', type: 'email', autoComplete: 'email', required: true },
  { name: 'country', label: 'Country', type: 'text', autoComplete: 'country-name', required: false },
] as const

const SUBJECTS = ['Order a bottle', 'Visit the wine bar', 'Trade and distribution', 'Press', 'Something else']

export default function ContactPage() {
  return (
    <>
      <main className="relative z-10">
        <PageHead
          eyebrow="Get in touch"
          title="Write to us, or just call."
          intro="It is a small winery. A phone call usually gets you an answer faster than a form does."
        />

        <section className="px-5 pb-24 md:px-8 md:pb-32">
          <div className="mx-auto grid w-full max-w-[92rem] gap-14 border-t border-ivory/12 pt-12 md:grid-cols-12 md:gap-10 md:pt-16">
            <div className="md:col-span-5">
              <dl className="space-y-8">
                <div>
                  <dt className="data-label mb-3 text-ivory/35">Phone</dt>
                  <dd>
                    <a
                      href="tel:+385916127229"
                      className="inline-block py-2 font-display text-2xl text-ivory transition-colors hover:text-gold"
                    >
                      +385 91 6127 229
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="data-label mb-3 text-ivory/35">Email</dt>
                  <dd>
                    <a
                      href="mailto:info@edivovina.hr"
                      className="inline-block py-2 font-display text-2xl text-ivory transition-colors hover:text-gold"
                    >
                      info@edivovina.hr
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="data-label mb-3 text-ivory/35">Winery</dt>
                  <dd className="text-sm leading-relaxed text-ivory/65">
                    Janjina 62, 20246 Janjina
                    <br />
                    Pelješac, Croatia
                  </dd>
                </div>
                <div>
                  <dt className="data-label mb-3 text-ivory/35">Wine bar</dt>
                  <dd className="text-sm leading-relaxed text-ivory/65">
                    Drače 18, 20246 Drače
                    <br />
                    Pelješac, Croatia
                  </dd>
                </div>
              </dl>
            </div>

            <form className="md:col-span-7" noValidate>
              <div className="grid gap-6 sm:grid-cols-2">
                {FIELDS.map((f) => (
                  <div key={f.name} className={f.name === 'country' ? 'sm:col-span-2' : ''}>
                    {/* Vidljiva oznaka, ne placeholder-only */}
                    <label
                      htmlFor={f.name}
                      className="data-label mb-3 block text-ivory/45"
                      style={{ fontSize: '0.5625rem' }}
                    >
                      {f.label}
                      {f.required && <span className="ml-1 text-gold">*</span>}
                    </label>
                    <input
                      id={f.name}
                      name={f.name}
                      type={f.type}
                      autoComplete={f.autoComplete}
                      required={f.required}
                      className="h-12 w-full border border-ivory/20 bg-transparent px-4 text-base text-ivory outline-none transition-colors placeholder:text-ivory/25 focus:border-gold"
                    />
                  </div>
                ))}

                <div className="sm:col-span-2">
                  <label
                    htmlFor="subject"
                    className="data-label mb-3 block text-ivory/45"
                    style={{ fontSize: '0.5625rem' }}
                  >
                    What about
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    defaultValue={SUBJECTS[0]}
                    className="h-12 w-full border border-ivory/20 bg-abyss px-4 text-base text-ivory outline-none transition-colors focus:border-gold"
                  >
                    {SUBJECTS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="message"
                    className="data-label mb-3 block text-ivory/45"
                    style={{ fontSize: '0.5625rem' }}
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    className="w-full resize-y border border-ivory/20 bg-transparent px-4 py-3 text-base leading-relaxed text-ivory outline-none transition-colors focus:border-gold"
                  />
                  <p className="mt-3 text-xs leading-relaxed text-ivory/35">
                    If you are asking about a specific bottle, tell us which one — the undersea
                    ones are made in small numbers and not all vintages are still here.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                className="data-label mt-9 bg-gold px-7 py-4 text-abyss transition-colors duration-200 hover:bg-ivory"
              >
                Send
              </button>
              <p className="data-label mt-5 text-ivory/25" style={{ fontSize: '0.5rem' }}>
                Form template — to be wired to WordPress
              </p>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
