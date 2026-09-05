import { SILHOUETTES, type SilhouetteName } from '@/data/silhouettes'

/**
 * Mjerena silueta. Putanje su generirane iz ISTIH krivulja koje koristi 3D
 * model (scripts/build-silhouettes.mjs), pa je crtez na plocici dokazano isti
 * objekt koji pada u pozadini.
 *
 * `draw` iscrta konturu pri ulasku — jedan orkestriran potez po ploci.
 */
export default function Silhouette({
  name,
  className = '',
  draw = false,
  delay = 0,
}: {
  name: SilhouetteName
  className?: string
  draw?: boolean
  delay?: number
}) {
  const s = SILHOUETTES[name]

  return (
    <svg
      viewBox={s.viewBox}
      role="img"
      aria-label={name === 'amphora' ? 'Measured drawing of the amphora' : 'Measured drawing of the bottle'}
      className={`${draw ? 'draw-in' : ''} ${className}`}
      style={draw && delay ? { animationDelay: `${delay}ms` } : undefined}
      preserveAspectRatio="xMidYMax meet"
    >
      <path d={s.d} fill="currentColor" fillOpacity="0.055" stroke="currentColor" strokeWidth="1.1" vectorEffect="non-scaling-stroke" />
      {s.lines?.map((d) => (
        <path key={d.slice(0, 24)} d={d} fill="none" stroke="currentColor" strokeWidth="1.1" vectorEffect="non-scaling-stroke" />
      ))}
    </svg>
  )
}
