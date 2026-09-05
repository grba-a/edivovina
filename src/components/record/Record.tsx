import Link from 'next/link'
import Frame from '@/components/ui/Frame'
import Plate from './Plate'
import Silhouette from './Silhouette'
import Fields, { type Field } from './Fields'
import ScaleBar from './ScaleBar'
import { SILHOUETTES, type SilhouetteName } from '@/data/silhouettes'
import type { Wine } from '@/data/wines'

/**
 * ZAPIS — jedini oblik kartice na cijelom webu.
 *
 * Vino nije artikl u gridu nego katalogizirani artefakt s dubine:
 *
 *   FIND 004                              [ 0412 / 4000 ]   stamp
 *   Navis Mysterium Amphora                                 title
 *   [ mjerena silueta ]  [ prava fotografija ]
 *   H ...... 300 mm    CTX ...... wreck, −25 m              field
 *   |--+--| 10 cm                     €382   TAKE IT →      mjerilo + akcija
 *
 * Cijena i akcija su DIO zapisa, nikad odvojena CTA traka — to je protuotrov
 * za rizik da svijet nalaza cita kao muzej a ne trgovina.
 */

const eur = (n: number) => '€' + (Number.isInteger(n) ? String(n) : n.toFixed(2).replace('.', ','))

const AGING: Record<string, string> = {
  cellar: 'cellar, Janjina',
  'sea-bottle': 'wreck, −25 m',
  amphora: 'wreck, −25 m',
  set: 'all three',
}

/** Broj nalaza je stabilan: izveden iz mjesta u katalogu, ne slucajan. */
export const findNo = (i: number) => String(i + 1).padStart(3, '0')

function silhouetteFor(w: Wine): SilhouetteName {
  return w.aging === 'amphora' ? 'amphora' : 'bottle'
}

/**
 * Polja. `H` i `Ø` idu SAMO kad ih stvarno znamo — za amforu su izmjereni s 3D
 * modela. Izmisljena dimenzija u polju koje izgleda kao mjerni zapis gorja je
 * od praznog polja.
 */
function fieldsFor(w: Wine): Field[] {
  const sil = SILHOUETTES[silhouetteFor(w)]
  const out: Field[] = []
  if (w.aging === 'amphora') {
    out.push(['H', `${sil.mm.h} mm`], ['Ø', `${sil.mm.d} mm`])
  }
  out.push(['VOL', w.volume])
  out.push(['CTX', AGING[w.aging]])
  out.push(['DUR', w.daysUnderSea > 0 ? `${w.daysUnderSea} d` : 'none'])
  if (w.vintage) out.push(['YR', String(w.vintage)])
  return out
}

export default function Record({
  wine,
  index,
  variant = 'compact',
  enter = true,
  delay = 0,
  photoSizes,
}: {
  wine: Wine
  index: number
  variant?: 'compact' | 'lead'
  enter?: boolean
  delay?: number
  photoSizes?: string
}) {
  const lead = variant === 'lead'
  const fields = fieldsFor(wine)

  return (
    <Plate
      as="li"
      enter={enter}
      delay={delay}
      className={`hov-lift group list-none ${lead ? 'md:grid md:grid-cols-12' : ''}`}
    >
      <Link
        href={`/wines/${wine.slug}`}
        className={`pressable flex h-full flex-col ${lead ? 'md:col-span-12' : ''}`}
      >
        {/* --- gornja traka zapisa --- */}
        <div
          className={`flex items-center justify-between border-b border-plate-rule ${
            lead ? 'md:col-span-12' : ''
          }`}
          style={{ padding: 'var(--s-3) var(--s-4)' }}
        >
          <span className="t-stamp text-plate-ink/50">Find {findNo(index)}</span>
          {wine.daysUnderSea > 0 && (
            /* Njihova vrpca kaze "Batch: 1 - 4000" — to je RASPON serije, ne
               serijski broj. "1 / 4000" bi implicirao da je ovo primjerak broj
               jedan; lazna precizija u polju koje izgleda kao mjerni zapis. */
            <span
              className="t-stamp border border-stamp/50 text-stamp"
              style={{ padding: '3px var(--s-2)' }}
            >
              Batch 1–4000
            </span>
          )}
        </div>

        {/* --- naslov --- */}
        <div style={{ padding: 'var(--s-4) var(--s-4) 0' }} className={lead ? 'md:col-span-7' : ''}>
          <h3 className={`${lead ? 't-plate' : 't-title'} text-plate-ink`}>{wine.name}</h3>
          {lead && <p className="t-body mt-[var(--s-4)] text-plate-ink/65">{wine.description}</p>}
        </div>

        {/*
          Fotografija, mjereni crtez i polja u JEDNOM redu — kao u katalogu
          nalaza. Slozeno vertikalno ploca je bila 744 px = 83% ekrana; ovako je
          ispod 45%, a kupac vidi vise zapisa odjednom i moze usporediti.
        */}
        <div
          className={`flex flex-wrap items-start gap-[var(--s-4)] ${lead ? 'md:col-span-7' : ''}`}
          style={{ padding: 'var(--s-4)' }}
        >
          <div className="w-[46%] shrink-0 sm:w-[38%]">
            <Frame
              name={wine.image}
              alt={wine.name}
              sizes={photoSizes ?? '(min-width: 1024px) 10vw, 20vw'}
              ratio="natural"
              className="w-full"
            />
          </div>

          <div className="flex w-[18%] shrink-0 items-start justify-center pt-[var(--s-1)] text-plate-ink sm:w-[16%]">
            <Silhouette
              name={silhouetteFor(wine)}
              draw={enter}
              delay={delay + 120}
              className="max-h-[9rem] w-full"
            />
          </div>

          {/* Polja idu u PUNU sirinu na uskom zapisu: u tri stupca su bila
              pretijesna i vrijednost je prelazila rub (392 > 390 px). */}
          <div className="min-w-0 basis-full sm:flex-1 sm:basis-auto">
            <Fields items={fields} dense={!lead} />
          </div>
        </div>

        {/* --- mjerilo, cijena i akcija: zadnji red ZAPISA, ne zasebna traka --- */}
        <div
          className={`mt-auto flex items-end justify-between gap-[var(--s-3)] border-t border-plate-rule-strong ${
            lead ? 'md:col-span-7' : ''
          }`}
          style={{ padding: 'var(--s-3) var(--s-4)' }}
        >
          <ScaleBar />
          <div className="flex items-baseline gap-[var(--s-3)]">
            <span className="t-title tnum text-plate-ink">{eur(wine.price)}</span>
            <span className="t-stamp bg-stamp px-[var(--s-3)] py-[var(--s-2)] text-plate">
              Take it
            </span>
          </div>
        </div>
      </Link>
    </Plate>
  )
}
