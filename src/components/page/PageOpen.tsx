import Link from 'next/link'
import Station from '@/components/station/Station'
import type { Station as Data } from '@/data/stations'

/**
 * OTVARANJE PODSTRANICE — kratak blok naslova. Jedan stupac. To je sve.
 *
 * Tri verzije prije ove nisu radile, i svaki put iz drugog razloga:
 *
 *   v1  56svh visok blok: naslov dolje lijevo, uvod kao siroce u desnom
 *       stupcu, hairline red. Sadrzaj je pocinjao ISPOD prvog kadra.
 *   v2  naslov na PRAZNOM gradijentu, pa fotografija 21:9 preko cijele sirine
 *       ispod. Klijent: hero „ružne i bezsmislene", traka „katastrofa i
 *       prevelika" — 860 px mutnog interijera bez subjekta.
 *   v3  fotografija 1:1 u otvaranju, probija desni rub. Jos uvijek preveliko.
 *
 * Pouka: prazninu nije rjesavala slika, nego KRATKO OTVARANJE. Naslov ne
 * treba scenografiju; treba mu da sadrzaj pocne odmah ispod njega. Fotografija
 * zivi u sadrzajnoj sekciji gdje nesto ILUSTRIRA, u umjerenoj velicini, i
 * nijedna podstranica nema kadar preko cijele sirine.
 *
 * Koordinate dubine nema: `.ed-depth-no` sjedi na `top: 0` svoje postaje, pa
 * je na prvoj sekciji ulazila pod fiksni header — izmjereno, „22m" je lezao
 * preko wordmarka a „12m" preko „NEWS & STORIES". Brojka ide na prvu
 * SADRZAJNU sekciju, tocno kao na naslovnici gdje hero nema brojku.
 */
export default function PageOpen({
  data,
  title,
  lead,
  cta,
  meta,
  side = 'l',
}: {
  data: Data
  title: string
  lead?: string
  cta?: { href: string; label: string }
  /** Kratka mjerena vrijednost — koordinata, raspon, count. */
  meta?: string
  side?: 'l' | 'r'
}) {
  return (
    <Station
      data={data}
      side={side}
      stage={false}
      showDepth={false}
      className="pt-[var(--s-9)] md:pt-[var(--s-10)]"
      style={{ paddingBottom: 'var(--s-6)' }}
    >
      <div className="ed-in relative z-10">
        <p className="ed-fade data-label text-gold">{data.light}</p>

        <h1 id={`${data.id}-h`} className="t-plate mt-[var(--s-4)] max-w-[20ch] text-ivory">
          {title}
        </h1>

        {/* `pretty` da zadnja rijec ne ostane sama u redu — „it." je visio
            kao siroce pod dva puna reda. */}
        {lead && (
          <p className="t-body mt-[var(--s-4)] text-ivory/72" style={{ textWrap: 'pretty' }}>
            {lead}
          </p>
        )}

        {cta && (
          <Link
            href={cta.href}
            className="data-label pressable mt-[var(--s-5)] inline-block bg-gold px-[var(--s-5)] py-[var(--s-4)] text-abyss transition-colors duration-200 hover:bg-ivory"
          >
            {cta.label}
          </Link>
        )}

        {/* Hairline zatvara otvaranje i daje desnoj strani posao — inace je na
            1440 px naslov drzao lijevih 520 px a ostalih 900 stajalo prazno.
            Isti aparat kao red na dnu hera na naslovnici. */}
        <div className="mt-[var(--s-6)] flex items-center gap-[var(--s-4)] border-t border-ivory/14 pt-[var(--s-3)]">
          <span className="data-label-sm text-ivory/55">{data.name}</span>
          <span aria-hidden className="h-px flex-1 bg-ivory/14" />
          <span className="data-label-sm tnum text-ivory/85">
            {meta ?? `${data.m} m`}
          </span>
        </div>
      </div>
    </Station>
  )
}
