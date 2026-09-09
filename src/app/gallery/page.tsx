import type { Metadata } from 'next'
import Link from 'next/link'
import PageShell from '@/components/page/PageShell'
import PageOpen from '@/components/page/PageOpen'
import Station from '@/components/station/Station'
import Lightbox from '@/components/gallery/Lightbox'
import { station } from '@/data/stations'
import { GALLERY, galleryCount } from '@/data/gallery'

const S = station('awards')

export const metadata: Metadata = {
  title: 'Gallery — Edivo Vina',
  description:
    'The amphorae out of the water, the cellar on the seabed, the work, and the table in Drače.',
}

/**
 * /gallery — 22 m, postaja `awards`. Najtamnija voda na webu, i to je
 * namjerno: tamna soba je najbolja podloga za fotografije.
 *
 * Grupe i biljeske dolaze iz `gallery.ts`, koji je bio napisan i imao NULA
 * importera. Njihova galerija ima 158 slika bez ijedne rijeci; ova ima 52 i
 * svaka grupa zna sto pokazuje.
 */
export default function GalleryPage() {
  const [first, ...groups] = GALLERY

  return (
    <PageShell data={S}>
      <PageOpen
        data={S}
        side="l"
        title="Above the wine, and under it."
        lead="Nothing staged. The amphorae come up wearing whatever the sea put on them, and that is the whole point."
        meta={`${galleryCount} photographs`}
      />

      {/* Prva grupa nosi koordinatu dubine. */}
      <Station data={S} side="r" stage={false} style={{ paddingTop: 'var(--sec-y-tight)', paddingBottom: 'var(--sec-y-tight)' }}>
        <div className="ed-in relative z-10">
          <div className="flex flex-wrap items-baseline justify-between gap-[var(--s-3)] border-b border-ivory/16 pb-[var(--s-3)]">
            <h2 className="t-title text-ivory">{first.title}</h2>
            <p className="data-label-sm text-ivory/55">
              {first.note} · {first.names.length}
            </p>
          </div>
          <div className="mt-[var(--s-5)]">
            <Lightbox names={first.names} caption={first.note} />
          </div>
        </div>
      </Station>

      {groups.map((g) => (
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

      <section style={{ paddingBottom: 'var(--sec-y)' }}>
        <div className="ed-in flex flex-wrap items-center gap-[var(--s-5)] border-t border-ivory/16 pt-[var(--s-6)]">
          <p className="t-body max-w-[40ch] text-ivory/72">
            Every amphora surfaces differently, because the sea signs each one on its own.
          </p>
          <Link
            href="/wines"
            className="data-label pressable ml-auto bg-gold px-[var(--s-5)] py-[var(--s-4)] text-abyss transition-colors duration-200 hover:bg-ivory"
          >
            See the wines
          </Link>
        </div>
      </section>
    </PageShell>
  )
}
