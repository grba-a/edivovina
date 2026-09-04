import type { Metadata } from 'next'
import PageHead from '@/components/PageHead'
import Footer from '@/components/Footer'
import Frame from '@/components/ui/Frame'
import manifest from '@/data/images.json'

export const metadata: Metadata = {
  title: 'Gallery — Edivo Vina',
  description: 'The vineyard, the amphorae, the wreck and what comes back up.',
}

/**
 * Svih 158 gradiranih fotki, grupirano po setu. Redoslijed grupa prati spust:
 * lozа -> amfore -> pod morem -> ono sto se vrati -> posluzivanje.
 */
const GROUPS: { prefix: string; title: string; note: string }[] = [
  { prefix: 'proizvodnja', title: 'The work', note: 'harvest, clay, loading the boat' },
  { prefix: 'ispod-mora', title: 'Down there', note: 'the cellar at 25 metres' },
  { prefix: 'UTS', title: 'Two years on', note: 'what the sea leaves behind' },
  { prefix: 'FP', title: 'The bottles', note: 'above water again' },
  { prefix: 'PONMA', title: 'Served', note: 'the amphora, opened' },
  { prefix: 'vinarija', title: 'Janjina', note: 'the winery' },
]

const IMAGES = manifest as Record<string, { w: number; h: number; widths: number[] }>

export default function GalleryPage() {
  const keys = Object.keys(IMAGES)

  return (
    <>
      <main className="relative z-10">
        <PageHead
          eyebrow={`${keys.length} photographs`}
          title="Everything above the wine, and everything under it."
        />

        <section className="px-5 pb-24 md:px-8 md:pb-32">
          <div className="mx-auto w-full max-w-[92rem]">
            {GROUPS.map((g) => {
              const items = keys.filter((k) => k.startsWith(g.prefix + '-')).sort()
              if (!items.length) return null
              return (
                <div key={g.prefix} className="border-t border-ivory/12 py-12 md:py-16">
                  <div className="mb-8 flex flex-wrap items-baseline gap-4">
                    <h2 className="font-display text-2xl text-ivory md:text-3xl">
                      {g.title}
                    </h2>
                    <span className="data-label text-ivory/30" style={{ fontSize: '0.5rem' }}>
                      {g.note} · {items.length}
                    </span>
                  </div>
                  {/* CSS columns masonry — bez JS-a i bez layout shifta, jer
                      svaka slika nosi svoj width/height iz manifesta. */}
                  <div className="columns-2 gap-3 md:columns-3 md:gap-4 lg:columns-4">
                    {items.map((k) => (
                      <figure key={k} className="mb-3 md:mb-4">
                        <Frame
                          name={k}
                          alt={`Edivo Vina — ${g.title.toLowerCase()}`}
                          sizes="(min-width: 1024px) 24vw, (min-width: 768px) 32vw, 48vw"
                          className="w-full bg-navy/30"
                        />
                      </figure>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
