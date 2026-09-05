import type { Metadata } from 'next'
import PageHero from '@/components/PageHero'
import CtaBand from '@/components/CtaBand'
import Footer from '@/components/Footer'
import Frame from '@/components/ui/Frame'
import Reveal from '@/components/ui/Reveal'
import { GALLERY, galleryCount } from '@/data/gallery'

export const metadata: Metadata = {
  title: 'Gallery — Edivo Vina',
  description: 'The work, the wreck, and what comes back up.',
}

export default function GalleryPage() {
  return (
    <>
      <main className="relative z-10">
        <PageHero
          eyebrow={`${galleryCount} photographs`}
          lines={['Everything above the wine,', 'and everything under it.']}
          intro="The vineyard, the clay, the wreck at 25 metres, and what comes back up wearing oysters."
          cta={{ href: '/wines', label: 'See the wines' }}
          readout={`${galleryCount} frames`}
        />

        <section className="px-5 pb-14 md:px-8 md:pb-24">
          <div className="mx-auto w-full max-w-[92rem]">
            {GALLERY.map((g) => (
              <div key={g.title} className="border-t border-ivory/12 py-10 md:py-14">
                <div className="mb-7 flex flex-wrap items-baseline gap-4">
                  <h2 className="font-display text-xl text-ivory md:text-2xl">{g.title}</h2>
                  <span className="data-label text-ivory/30" style={{ fontSize: '0.5rem' }}>
                    {g.note} · {g.names.length}
                  </span>
                </div>
                {/* CSS columns masonry — bez JS-a i bez layout shifta, jer svaka
                    slika nosi svoj width/height iz manifesta. */}
                <div className="columns-2 gap-3 md:columns-3 md:gap-4 lg:columns-4">
                  {g.names.map((n) => (
                    <figure key={n} className="mb-3 md:mb-4">
                      <Reveal from={0.3}>
                        <Frame
                          name={n}
                          alt={`Edivo Vina — ${g.title.toLowerCase()}`}
                          sizes="(min-width: 1024px) 24vw, (min-width: 768px) 32vw, 48vw"
                          className="w-full bg-surface"
                        />
                      </Reveal>
                    </figure>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <CtaBand />
      </main>
      <Footer />
    </>
  )
}
