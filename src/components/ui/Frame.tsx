import photos from '@/data/photos.json'
import images from '@/data/images.json'

type Meta = { w: number; h: number; widths: number[] }
const PRO = photos as Record<string, Meta>
const WEB = images as Record<string, Meta>

/**
 * Jedan ulaz za sve slike.
 *
 * Dva seta: profesionalni shoot iz svibnja 2024 (public/photo) i stariji
 * materijal s njihovog weba (public/img). Komponenta pogodi koji je koji po
 * imenu, pa zamjena starog kadra novim je promjena imena, ne koda.
 *
 * KADRIRANJE — dva nacina, oba bez rezanja sadrzaja:
 *
 *   ratio="natural"  okvir preuzme odnos IZVORA iz manifesta, pa `cover` nema
 *                    sto rezati. Za reportazne kadrove. Visinu okvira drzi
 *                    sirina stupca, ne fiksni clamp.
 *
 *   fit="contain"    cijeli objekt u kadru, ostatak je solidna povrsina. Za
 *                    studijske snimke boca: sve su na istoj drvenoj podlozi pa
 *                    letterbox cita kao kataloska plocica, a boci se ne odreze
 *                    grlo — sto se s `cover` na 2:3 izvoru uvijek dogodi.
 */
export default function Frame({
  name,
  alt,
  sizes,
  className = '',
  priority = false,
  position,
  ratio,
  fit = 'cover',
}: {
  name: string
  alt: string
  sizes: string
  className?: string
  priority?: boolean
  position?: string
  /** 'natural' = odnos izvora; broj = w/h. Bez toga okvir odreduje className. */
  ratio?: 'natural' | number
  fit?: 'cover' | 'contain'
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
  const aspect = ratio === 'natural' ? meta.w / meta.h : typeof ratio === 'number' ? ratio : undefined

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
      className={`${fit === 'contain' ? 'object-contain' : 'object-cover'} ${className}`}
      style={{
        ...(aspect ? { aspectRatio: String(aspect) } : null),
        ...(position ? { objectPosition: position } : null),
      }}
    />
  )
}
