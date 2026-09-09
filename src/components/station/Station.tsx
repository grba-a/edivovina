import type { Station as Data } from '@/data/stations'

/**
 * POSTAJA — omotac svake sekcije naslovnice.
 *
 * Nosi tri stvari koje drze stranicu zajedno:
 *   data-station  cita ga src/lib/stage.ts da zna gdje smo i sto amfora radi
 *                 (podstranice salju stage={false} i dobivaju data-depth)
 *   nadnaslov     recenica o svjetlu na toj dubini — razlog zasto sekcija
 *                 ima bas tu boju, ne ukras
 *   brojka        ogromna dubina u margini; to je koordinata, ista koju
 *                 pokazuje i traka desno
 *
 * Strane se izmjenjuju (l/r) da se ritam ne pretvori u niz jednakih slabova.
 */
export default function Station({
  data,
  as: Tag = 'section',
  side = 'l',
  showDepth = true,
  stage = true,
  children,
  className = '',
  style,
}: {
  data: Data
  /**
   * Zadnja postaja je DNO stranice, pa se renderira kao <footer> — inace
   * stranica nema `contentinfo` landmark i citac ekrana nema kako preskociti
   * na kontakt.
   */
  as?: 'section' | 'footer'
  side?: 'l' | 'r'
  /** Hero je nema: 0,0 m vec stoji u hairlineu, a brojka bi sjela na nav. */
  showDepth?: boolean
  /**
   * Sudjeluje li sekcija u koreografiji amfore.
   *
   * Naslovnica: da — tamo postaje i jesu koreografija. Podstranice: NE. One stoje
   * na jednoj dubini i ne mount-aju canvas, pa im `data-station` samo unosi
   * lazni node u `stage.ts`. S `false` sekcija dobiva `data-depth` i sav raspored
   * i CSS rade i dalje, a pozornica je ne vidi.
   */
  stage?: boolean
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <Tag
      id={data.id}
      {...(stage ? { 'data-station': data.id } : { 'data-depth': data.m })}
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
    </Tag>
  )
}
