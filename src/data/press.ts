/**
 * Nagrade i medijske objave.
 *
 * SVE ovdje je provjereno s edivovina.hr ili sa stvarnih clanaka — nista nije
 * izmisljeno. Ono sto NE znamo je oznaceno i ceka potvrdu klijenta:
 * tocne kategorije i godine za Decanter i Sabatinu.
 */

export type Award = { body: string; medal: string; year?: string; note?: string }

export const AWARDS: Award[] = [
  { body: 'Decanter World Wine Awards', medal: 'Silver', note: 'Navis Mysterium' },
  { body: 'America Wine Awards', medal: 'Gold', year: '2021' },
  { body: 'Sabatina', medal: 'Medals', year: '2016 · 2017' },
  { body: 'Worldwide patent', medal: 'Granted', note: 'bottling and casing wine stored under the sea' },
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
