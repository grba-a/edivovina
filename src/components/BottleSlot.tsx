import Frame from '@/components/ui/Frame'

/**
 * SLOT ZA BOCU — jedno mjesto kroz koje prolazi svaki prikaz proizvoda.
 *
 * Danas je unutra fotografija. Petar planira izraditi 3D datoteke boca u
 * Higgsfieldu; kad dodu, mijenja se SAMO unutrasnjost ove komponente i
 * raspored ostaje netaknut. Zato nijedna sekcija ne poziva Frame direktno za
 * proizvod.
 *
 * Grade nije ukras: fotke boca su snimljene u ducanu, na toploj svijetloj
 * podlozi. Na dvanaest metara nema tople svjetlosti, pa bi bez ovoga svijetlile
 * kao prozori i katalog bi izgledao zalijepljen s druge stranice. Ista fizika
 * koja vodi paletu vodi i njih.
 */
export default function BottleSlot({
  image,
  alt,
  sizes,
  priority = false,
}: {
  image: string
  alt: string
  sizes: string
  priority?: boolean
}) {
  return (
    <span className="ed-slot">
      <Frame name={image} alt={alt} sizes={sizes} priority={priority} ratio={0.8} className="h-full w-full" />
      <span className="ed-slot-grade" aria-hidden />
    </span>
  )
}
