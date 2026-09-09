import type { Metadata } from 'next'
import PageShell from '@/components/page/PageShell'
import PageHead from '@/components/page/PageHead'
import Lightbox from '@/components/gallery/Lightbox'
import { station } from '@/data/stations'
import { GALLERY, galleryCount } from '@/data/gallery'

const S = station('awards')

export const metadata: Metadata = {
  title: 'Gallery — Edivo Vina',
  description:
    'The amphorae out of the water, the cellar at 25 metres, the work, and the table in Drače.',
}

/**
 * /gallery — 22 m, postaja `awards`. Najtamnija voda na webu, i to je namjerno:
 * tamna soba je najbolja podloga za fotografije.
 *
 * Grupe i biljeske dolaze iz `gallery.ts`, koji je vec bio napisan i imao NULA
 * importera — pet naslovljenih engleskih sekcija i 52 sluga. Njihova galerija
 * ima 158 slika bez ijedne rijeci teksta; ova ima 52 i svaka zna gdje je.
 */
export default function GalleryPage() {
  return (
    <PageShell data={S}>
      <PageHead
        data={S}
        side="l"
        lines={['Above the wine,', 'and under it.']}
        intro="Nothing staged. The amphorae come up wearing whatever the sea put on them, and that is the whole point."
        readout={`${galleryCount} photographs`}
      />

      {GALLERY.map((g) => (
        <section
          key={g.title}
          aria-labelledby={`g-${g.title.replace(/\s+/g, '-').toLowerCase()}`}
          style={{ paddingBottom: 'var(--sec-y-tight)' }}
        >
          <div className="ed-in">
            <div className="flex flex-wrap items-baseline justify-between gap-[var(--s-3)] border-b border-ivory/16 pb-[var(--s-3)]">
              <h2
                id={`g-${g.title.replace(/\s+/g, '-').toLowerCase()}`}
                className="t-title text-ivory"
              >
                {g.title}
              </h2>
              <p className="data-label-sm text-ivory/55">
                {g.note} · {g.names.length}
              </p>
            </div>

            <div className="mt-[var(--s-5)]">
              <Lightbox names={g.names} caption={g.note} />
            </div>
          </div>
        </section>
      ))}
    </PageShell>
  )
}
