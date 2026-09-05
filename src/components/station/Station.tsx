import type { Station as Data } from '@/data/stations'

/**
 * POSTAJA — omotac svake sekcije naslovnice.
 *
 * Nosi tri stvari koje drze stranicu zajedno:
 *   data-station  cita ga src/lib/stage.ts da zna gdje smo i sto amfora radi
 *   nadnaslov     recenica o svjetlu na toj dubini — razlog zasto sekcija
 *                 ima bas tu boju, ne ukras
 *   brojka        ogromna dubina u margini; to je koordinata, ista koju
 *                 pokazuje i traka desno
 *
 * Strane se izmjenjuju (l/r) da se ritam ne pretvori u niz jednakih slabova.
 */
export default function Station({
  data,
  side = 'l',
  showDepth = true,
  children,
  className = '',
  style,
}: {
  data: Data
  side?: 'l' | 'r'
  /** Hero je nema: 0,0 m vec stoji u hairlineu, a brojka bi sjela na nav. */
  showDepth?: boolean
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <section
      id={data.id}
      data-station={data.id}
      data-side={side}
      className={`ed-station relative ${className}`}
      style={style}
      aria-labelledby={`${data.id}-h`}
    >
      {showDepth && (
        <span className="ed-depth-no" aria-hidden>
          {data.m}
          <small>m</small>
        </span>
      )}
      {children}
    </section>
  )
}
