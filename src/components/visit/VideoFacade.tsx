'use client'

import { useState } from 'react'
import Frame from '@/components/ui/Frame'

/**
 * Video koji NE ucitava YouTube dok ga korisnik ne zatrazi.
 *
 * Ugradjeni iframe vuce ~1 MB tudjeg JS-a i kolacice na svaki pogled stranice.
 * Ovako je do klika samo fotografija, a `youtube-nocookie` se ucita tek na
 * namjeru. Isti postupak kao 3D amfora: tezak sloj se odgadja, ne izbacuje.
 */
export default function VideoFacade({
  id,
  poster,
  title,
}: {
  id: string
  poster: string
  title: string
}) {
  const [live, setLive] = useState(false)

  return (
    <div className="relative aspect-video w-full overflow-hidden border border-ivory/14 bg-surface">
      {live ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      ) : (
        <button
          type="button"
          onClick={() => setLive(true)}
          className="group absolute inset-0 h-full w-full"
          aria-label={`Play video: ${title}`}
        >
          <Frame
            name={poster}
            alt=""
            sizes="(min-width: 768px) 60vw, 92vw"
            ratio={16 / 9}
            className="h-full w-full"
          />
          <span
            aria-hidden
            className="absolute inset-0"
            style={{ background: 'linear-gradient(180deg, rgba(3,20,31,0.15), rgba(3,20,31,0.7))' }}
          />
          <span className="absolute inset-0 flex flex-col items-center justify-center gap-[var(--s-3)]">
            <span className="flex h-16 w-16 items-center justify-center rounded-full border border-gold/70 text-gold transition-colors duration-200 group-hover:bg-gold group-hover:text-abyss">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
            <span className="data-label text-ivory/85">{title}</span>
          </span>
        </button>
      )}
    </div>
  )
}
