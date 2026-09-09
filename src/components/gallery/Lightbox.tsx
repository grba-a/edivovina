'use client'

import { useCallback, useEffect, useState } from 'react'
import Frame from '@/components/ui/Frame'

/**
 * Galerija + lightbox, bez biblioteke.
 *
 * Grid sa SPANOVIMA, ne CSS `columns`: Breakdance-ov Gallery element se mapira
 * na grid, a multi-column nema svog blizanca. Nekoliko sirih polja daje ritam —
 * sahovnica od jednakih kvadrata cita se kao upload folder.
 *
 * Solidna podloga, nikad poluprozirna: voda i marine snow prolaze kroz
 * prozirne panele i sve izgleda prasno.
 */
export default function Lightbox({
  names,
  caption,
}: {
  names: string[]
  /**
   * STRING, ne funkcija. Funkcije se ne mogu prenijeti iz server komponente u
   * klijentsku („Functions cannot be passed directly to Client Components") —
   * a tsc to ne hvata, pa bi puklo tek u pregledniku.
   */
  caption: string
}) {
  const [open, setOpen] = useState<number | null>(null)

  const close = useCallback(() => setOpen(null), [])
  const step = useCallback(
    (d: number) => setOpen((i) => (i === null ? null : (i + d + names.length) % names.length)),
    [names.length],
  )

  useEffect(() => {
    if (open === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    document.addEventListener('keydown', onKey)
    /* Scroll se zamrzne dok je lightbox otvoren — inace Lenis nastavi voziti
       spust ispod overlaya i voda se mijenja bez veze. */
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, close, step])

  /* Prva plocica u grupi je dvostruko siroka, ostale su kvadrati. Prije je
     uzorak bio `i % 7 === 0 || i % 11 === 5` — dva pravila koja se prekrivaju
     i daju red bez logike. Jedan sirok kadar po grupi je ritam; sahovnica
     jednakih kvadrata cita se kao upload folder. */
  const wide = (i: number) => i === 0

  return (
    <>
      <ul className="grid grid-cols-2 gap-[var(--s-3)] sm:grid-cols-3 lg:grid-cols-4">
        {names.map((n, i) => (
          <li key={n} className={wide(i) ? 'col-span-2 row-span-2' : ''}>
            <button
              type="button"
              onClick={() => setOpen(i)}
              aria-label={`Open image ${i + 1} of ${names.length}: ${caption}`}
              /* `ed-plate` je grade: bez njega su svijetli dnevni kadrovi
                 vristali preko abisa. Natpisa po plocici NEMA — bio je isti
                 tekst osam puta ispod svake fotke u grupi, sto je sum. */
              className="ed-plate pressable group block h-full w-full border border-ivory/12"
            >
              <Frame
                name={n}
                alt={caption}
                sizes={wide(i) ? '(min-width: 1024px) 46vw, 92vw' : '(min-width: 1024px) 23vw, 46vw'}
                ratio={1}
                className="h-full w-full"
              />
            </button>
          </li>
        ))}
      </ul>

      {open !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={caption}
          className="fixed inset-0 z-[60] flex flex-col bg-abyss p-[var(--s-4)] md:p-[var(--s-6)]"
        >
          <div className="flex items-center justify-between gap-[var(--s-4)]">
            <p className="data-label-sm tnum text-ivory/60">
              {open + 1} / {names.length}
            </p>
            <button
              type="button"
              onClick={close}
              className="data-label min-h-11 px-[var(--s-3)] text-ivory/70 hover:text-gold"
            >
              Close ✕
            </button>
          </div>

          <div className="flex min-h-0 flex-1 items-center gap-[var(--s-3)]">
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous"
              className="data-label min-h-11 min-w-11 shrink-0 text-ivory/60 hover:text-gold"
            >
              ←
            </button>
            <div className="flex min-h-0 flex-1 justify-center">
              <Frame
                name={names[open]}
                alt={caption}
                sizes="92vw"
                ratio="natural"
                fit="contain"
                className="max-h-full w-auto"
              />
            </div>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next"
              className="data-label min-h-11 min-w-11 shrink-0 text-ivory/60 hover:text-gold"
            >
              →
            </button>
          </div>

          <p className="data-label-sm mt-[var(--s-3)] text-center text-ivory/60">
            {caption}
          </p>
        </div>
      )}
    </>
  )
}
