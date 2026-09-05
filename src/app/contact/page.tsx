import type { Metadata } from 'next'
import PageHero from '@/components/PageHero'
import CtaBand from '@/components/CtaBand'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Contact — Edivo Vina',
  description: 'Edivo Vina, Janjina and Drače, Pelješac peninsula, Croatia.',
}

/**
 * FORM TEMPLATE — namjerno bez action/handlera. Obrazac se spaja u WordPressu
 * (Breakdance + WP Forms), pa su polja tipizirana i oznacena da se mapiraju 1:1.
 *
 * Skraceno na cetiri polja. Prijasnja verzija je imala sest i citala se kao
 * prijavnica; nikoga ne priblizava kupnji.
 */
const FIELDS = [
  { name: 'name', label: 'Name', type: 'text', autoComplete: 'name', span: '' },
  { name: 'email', label: 'Email', type: 'email', autoComplete: 'email', span: '' },
] as const

const SUBJECTS = ['Order a bottle', 'Visit the wine bar', 'Trade and distribution', 'Press']

export default function ContactPage() {
  return (
    <>
      <main className="relative z-10">
        <PageHero
          eyebrow="Get in touch"
          lines={['A phone call is', 'faster than a form.']}
          intro="It is a small winery on a narrow peninsula. If you want a specific bottle, say which one — the undersea ones are made in small numbers."
          cta={{ href: 'tel:+385916127229', label: '+385 91 6127 229' }}
          readout="info@edivovina.hr"
        />

        <section className="px-5 pb-14 md:px-8 md:pb-24">
          <div className="mx-auto grid w-full max-w-[92rem] gap-12 border-t border-ivory/12 pt-12 md:grid-cols-12 md:gap-8 md:pt-16">
            <div className="md:col-span-4">
              <dl className="space-y-8">
                <div>
                  <dt className="data-label mb-3 text-ivory/35">Email</dt>
                  <dd>
                    <a
                      href="mailto:info@edivovina.hr"
                      className="inline-block py-2 font-display text-xl text-ivory transition-colors hover:text-gold md:text-2xl"
                    >
                      info@edivovina.hr
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="data-label mb-3 text-ivory/35">Winery</dt>
                  <dd className="text-sm leading-relaxed text-ivory/60">
                    Janjina 62, 20246 Janjina
                    <br />
                    Pelješac, Croatia
                  </dd>
                </div>
                <div>
                  <dt className="data-label mb-3 text-ivory/35">Wine bar</dt>
                  <dd className="text-sm leading-relaxed text-ivory/60">
                    Drače 18, 20246 Drače
                    <br />
                    Pelješac, Croatia
                  </dd>
                </div>
              </dl>
            </div>

            <form className="md:col-span-7 md:col-start-6" noValidate>
              <div className="grid gap-6 sm:grid-cols-2">
                {FIELDS.map((f) => (
                  <div key={f.name}>
                    {/* Vidljiva oznaka, ne placeholder-only */}
                    <label
                      htmlFor={f.name}
                      className="data-label mb-3 block text-ivory/45"
                      style={{ fontSize: '0.5625rem' }}
                    >
                      {f.label} <span className="text-gold">*</span>
                    </label>
                    <input
                      id={f.name}
                      name={f.name}
                      type={f.type}
                      autoComplete={f.autoComplete}
                      required
                      className="h-12 w-full border border-ivory/20 bg-surface px-4 text-base text-ivory outline-none transition-colors focus:border-gold"
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
                    className="h-12 w-full border border-ivory/20 bg-surface px-4 text-base text-ivory outline-none transition-colors focus:border-gold"
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
                    rows={5}
                    className="w-full resize-y border border-ivory/20 bg-surface px-4 py-3 text-base leading-relaxed text-ivory outline-none transition-colors focus:border-gold"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="data-label mt-8 bg-gold px-7 py-4 text-abyss transition-colors duration-200 hover:bg-ivory"
              >
                Send
              </button>
              <p className="data-label mt-5 text-ivory/25" style={{ fontSize: '0.5rem' }}>
                Form template — to be wired to WordPress
              </p>
            </form>
          </div>
        </section>

        <CtaBand />
      </main>
      <Footer />
    </>
  )
}
