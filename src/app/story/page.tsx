import type { Metadata } from 'next'
import PageHead from '@/components/PageHead'
import Footer from '@/components/Footer'
import Frame from '@/components/ui/Frame'
import Reveal from '@/components/ui/Reveal'

export const metadata: Metadata = {
  title: 'The story — Edivo Vina',
  description:
    'How Plavac Mali from Janjina ends up sealed in Petrinja clay at the bottom of the Adriatic for 700 days.',
}

/** Koraci procesa. Brojke su s edivovina.hr i CEKAJU POTVRDU klijenta —
 *  izvori se ne poklapaju (18-25 m vs 20 m vs 14 m; 700 dana vs 18-24 mj). */
const STEPS = [
  {
    n: '01',
    depth: 'above water',
    title: 'The fruit',
    body: 'Plavac Mali off the slopes at Janjina, cut by hand because the ground is too steep for anything else. Dingač, the appellation that made this peninsula, is the next hill over.',
    image: 'proizvodnja-01',
    alt: 'Hands cutting a bunch of Plavac Mali from the vine',
  },
  {
    n: '02',
    depth: 'three months',
    title: 'The cellar',
    body: 'Fermented and rested on land in Janjina for three months. At this point it is already a finished wine — this is the version we keep as the control.',
    image: 'vinarija-05',
    alt: 'Inside the winery at Janjina',
  },
  {
    n: '03',
    depth: 'Petrinja clay',
    title: 'The amphora',
    body: 'The bottle goes inside a clay amphora thrown in Petrinja, corked and sealed with two layers of rubber. It took a year of failures before the seal held out the seawater.',
    image: 'proizvodnja-23',
    alt: 'Rows of unfired clay amphorae drying above the sea',
  },
  {
    n: '04',
    depth: '25 metres',
    title: 'The wreck',
    body: 'Locked in wrought-iron cages made in Sisak and lowered into a fishing boat that sank here thirty years ago. Fourteen degrees, no light, twice the pressure at the surface.',
    image: 'seabed-pebbles',
    alt: 'Amphorae on the pebbled seabed off Pelješac',
  },
  {
    n: '05',
    depth: '700 days',
    title: 'The wait',
    body: 'Nothing happens for two years, which is the whole point. The sea holds a temperature no cellar on this coast can hold in August, and it never once moves the bottle.',
    image: 'hands-amphora',
    alt: 'A shell-encrusted amphora held in two hands after two years underwater',
  },
  {
    n: '06',
    depth: 'back up',
    title: 'The finish',
    body: 'Each one surfaces wearing oysters, coralline and the shape of the cage it hung in. We do not clean them. That crust is the only signature the sea leaves, and no two are alike.',
    image: 'lift-water',
    alt: 'An amphora lifted out of the sea, water still running off the shells',
  },
]

export default function StoryPage() {
  return (
    <>
      <main className="relative z-10">
        <PageHead
          eyebrow="The process"
          title="We stopped building cellars in 2013."
          intro="Ivo Šegović made the first Edivo wine in Janjina in 2011. Two years later he sank a crate of
          it into the Adriatic to see what would happen. Everything below is what came out of that."
        />

        <section className="px-5 pb-24 md:px-8 md:pb-32">
          <div className="mx-auto w-full max-w-[92rem]">
            <ol>
              {STEPS.map((s, i) => (
                <li
                  key={s.n}
                  className="grid gap-8 border-t border-ivory/12 py-14 md:grid-cols-12 md:gap-10 md:py-20"
                >
                  <div className={`md:col-span-5 ${i % 2 ? 'md:order-2' : ''}`}>
                    <Reveal from={0.16}>
                      <Frame
                        name={s.image}
                        alt={s.alt}
                        sizes="(min-width: 768px) 40vw, 100vw"
                        className="aspect-[4/3] w-full bg-navy/30 object-cover"
                      />
                    </Reveal>
                  </div>
                  {/* Eksplicitne klase: Tailwind skenira izvorni tekst i
                      `md:col-start-${...}` nikad ne bi generirao. */}
                  <div className={i % 2 ? 'md:col-span-6 md:col-start-1' : 'md:col-span-6 md:col-start-7'}>
                    <div className="flex items-baseline gap-4">
                      <span className="font-sans text-sm text-gold">{s.n}</span>
                      <span className="data-label text-ivory/30" style={{ fontSize: '0.5rem' }}>
                        {s.depth}
                      </span>
                    </div>
                    <h2 className="mt-4 font-display text-[clamp(1.8rem,3.4vw,2.8rem)] leading-tight text-ivory">
                      {s.title}
                    </h2>
                    <p className="mt-5 max-w-[48ch] text-[1.0625rem] leading-[1.75] text-ivory/70">
                      {s.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
