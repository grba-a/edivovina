import type { Metadata } from 'next'
import PageHead from '@/components/PageHead'
import Footer from '@/components/Footer'
import Frame from '@/components/ui/Frame'
import Reveal from '@/components/ui/Reveal'
import { GALLERY, galleryCount } from '@/data/gallery'

export const metadata: Metadata = {
  title: 'Gallery — Edivo Vina',
  description: 'The vineyard, the amphorae, the wreck and what comes back up.',
}

export default function GalleryPage() {
  return (
    <>
      <main className="relative z-10">
        <PageHead
          eyebrow={`${galleryCount} photographs`}
          title="Everything above the wine, and everything under it."
        />

        <section className="px-5 pb-24 md:px-8 md:pb-32">
          <div className="mx-auto w-full max-w-[92rem]">
            {GALLERY.map((g) => (
              <div key={g.title} className="border-t border-ivory/12 py-12 md:py-16">
                <div className="mb-8 flex flex-wrap items-baseline gap-4">
                  <h2 className="font-display text-2xl text-ivory md:text-3xl">{g.title}</h2>
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
                          className="w-full bg-navy/30"
                        />
                      </Reveal>
                    </figure>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
