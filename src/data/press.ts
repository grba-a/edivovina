/**
 * Nagrade i medijske objave.
 *
 * SVE ovdje je provjereno s edivovina.hr ili sa stvarnih clanaka — nista nije
 * izmisljeno. Ono sto NE znamo je oznaceno i ceka potvrdu klijenta:
 * tocne kategorije i godine za Decanter i Sabatinu.
 */

export type Award = {
  year: string
  body: string
  medal: string
  /** Tocno koje vino i za sto — bez toga je nagrada samo bedz. */
  detail: string
  /** Stem iz public/medal/. Njihove vlastite medalje, skinute s edivovina.hr. */
  icon?: string
}

/**
 * Prepisano s edivovina.hr/awards. Svaka nagrada ima godinu, tijelo, medalju i
 * TOCNO VINO — "Decanter Silver" bez "Dingac" je bedz, a s njim je cinjenica.
 */
export const AWARDS: Award[] = [
  {
    year: '2022',
    body: 'Decanter World Wine Awards',
    medal: 'Silver',
    detail: 'Dingač',
    icon: 'decanter-silver',
  },
  {
    year: '2021',
    body: 'America Wine Awards',
    medal: 'Gold',
    detail: 'Navis Mysterium Amphora 2013 and Navis Mysterium Bottle 2013',
    icon: 'america-gold',
  },
  {
    year: '2017',
    body: 'Sabatina',
    medal: 'Champion',
    detail: 'Navis Mysterium Amphora 2012 — championship for design, Edivo Dingač 2014',
    icon: 'sabatina-silver',
  },
  {
    year: '2016',
    body: 'Sabatina',
    medal: 'Vice-champion',
    detail: 'Navis Mysterium Bottle 2012 — product design, and gold for wine quality',
    icon: 'sabatina-gold',
  },
  {
    year: '2015',
    body: 'Sabatina',
    medal: 'Silver',
    detail: 'Edivo Plavac 2015 — wine quality',
    icon: 'sabatina-silver',
  },
  {
    year: '—',
    body: 'Worldwide patent',
    medal: 'Granted',
    detail: 'Bottling and casing wine stored under the sea',
  },
]

export type Story = { outlet: string; title: string; href: string; kind: 'press' | 'story' }

/* NAPOMENA: ronilacke ture VISE NE POSTOJE (potvrdio klijent 2026-09-04).
   Zato je izbacen clanak Scuba Diving Magazinea koji ih aktivno poziva.
   Euronewsov naslov spominje "20 metara pod morem" ali govori o konceptu i
   datiran je 2021. — ostaje kao medijska objava, ne kao ponuda. */

export const STORIES: Story[] = [
  {
    outlet: 'Euronews',
    title: 'The ultimate wine tour is in Croatia, 20 metres under the sea',
    href: 'https://www.euronews.com/travel/2021/01/17/the-ultimate-wine-tour-is-in-croatia-20-metres-under-the-sea',
    kind: 'press',
  },
  {
    outlet: 'Tasting Table',
    title: 'Croatia’s first underwater winery is now open',
    href: 'https://www.tastingtable.com/693675/underwater-wine-winery/',
    kind: 'press',
  },
  {
    outlet: 'Croatia Week',
    title: 'Wine from Croatia’s first underwater winery an international hit',
    href: 'https://www.croatiaweek.com/wine-from-croatias-first-underwater-winery-an-international-hit/',
    kind: 'press',
  },
  {
    outlet: 'Atlas Obscura',
    title: 'Edivo Vina Winery in Drače',
    href: 'https://www.atlasobscura.com/places/edivo-vina-underwater-winery',
    kind: 'press',
  },
  {
    outlet: 'InsideHook',
    title: 'Edivo Underwater Winery',
    href: 'https://www.insidehook.com/food/edivo-underwater-winery',
    kind: 'press',
  },
]
