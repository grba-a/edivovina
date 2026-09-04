import photos from '@/data/photos.json'
import images from '@/data/images.json'

type Meta = { w: number; h: number; widths: number[] }
const PRO = photos as Record<string, Meta>
const WEB = images as Record<string, Meta>

/**
 * Jedan ulaz za sve slike.
 *
 * Postoje dva seta: profesionalni shoot iz svibnja 2024 (public/photo, do
 * 1800px) i stariji materijal s njihovog weba (public/img, do 1600px).
 * Komponenta sama pogodi koji je koji po imenu, pa pozivatelj nikad ne mora
 * znati odakle slika dolazi — i zamjena starog kadra novim je promjena imena,
 * ne promjena koda.
 */
export default function Frame({
  name,
  alt,
  sizes,
  className = '',
  priority = false,
  position,
}: {
  name: string
  alt: string
  sizes: string
  className?: string
  priority?: boolean
  position?: string
}) {
  const pro = PRO[name]
  const meta = pro ?? WEB[name]
  const dir = pro ? 'photo' : 'img'

  if (!meta) {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error(`Frame: nema "${name}" ni u photos.json ni u images.json`)
    }
    return null
  }

  const widths = [...meta.widths].sort((a, b) => a - b)

  return (
    /* Namjerno obican <img>, ne next/image: tierovi su vec izgradeni u
       scripts/build-photos.mjs i tocno pogadaju device pixel ratio, pa nam
       Vercelov image optimizer ne treba (i ne placamo ga po zahtjevu). */
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/${dir}/${name}-${widths[widths.length - 1]}.webp`}
      srcSet={widths.map((w) => `/${dir}/${name}-${w}.webp ${w}w`).join(', ')}
      sizes={sizes}
      width={meta.w}
      height={meta.h}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={priority ? 'high' : undefined}
      className={className}
      style={position ? { objectPosition: position } : undefined}
    />
  )
}
