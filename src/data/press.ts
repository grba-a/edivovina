/**
 * Nagrade i medijske objave.
 *
 * Sve je provjereno kroz nezavisne izvore, ne samo prepisano s edivovina.hr.
 * Ono sto NE znamo je oznaceno i ceka klijenta.
 *
 * Njihova vlastita /news-stories stranica ima ~60 unosa, ali je oko dvadeset
 * njih ista prica u drugim jezicima (AFP-ov wire iz travnja 2017. i jedan
 * video paket iz rujna 2018.), nekoliko ima krivi datum, a vecina ne navodi
 * ni outlet. Ovdje je kuriran izbor: samo ono sto se dalo potvrditi.
 */

export type Award = {
  year: string
  body: string
  medal: string
  /** Tocno koje vino i za sto — bez toga je nagrada samo bedz. */
  detail: string
  /** Stem iz public/medal/. Njihove vlastite medalje, skinute s edivovina.hr. */
  icon?: string
  /** Za sto je nagrada stvarno dana. Dizajn nije slabija nagrada — ovdje je
      predmet ono sto se prodaje — ali ne smije se predstaviti kao vinska. */
  kind: 'vino' | 'dizajn'
}

export const AWARDS: Award[] = [
  {
    year: 'godina se potvrđuje',
    body: 'Decanter World Wine Awards',
    medal: 'Srebro',
    detail: 'Dingač — kvaliteta vina',
    icon: 'decanter-silver',
    kind: 'vino',
  },
  {
    year: '2021',
    body: 'America Wine Awards',
    medal: 'Dva zlata',
    detail: 'Navis Mysterium Amphora 2013 i Navis Mysterium Bottle 2013',
    icon: 'america-gold',
    kind: 'vino',
  },
  {
    year: '2017',
    body: 'Sabatina',
    medal: 'Prvak',
    detail: 'Navis Mysterium Amphora 2012 — prvenstvo za dizajn',
    icon: 'sabatina-gold',
    kind: 'dizajn',
  },
  {
    year: '2016',
    body: 'Sabatina',
    medal: 'Viceprvak',
    detail: 'Navis Mysterium Bottle 2012 — dizajn proizvoda, uz zlato za kvalitetu',
    icon: 'sabatina-silver',
    kind: 'dizajn',
  },
  {
    year: '2015',
    body: 'Sabatina',
    medal: 'Srebro',
    detail: 'Edivo Plavac 2015 — kvaliteta vina',
    icon: 'sabatina-silver',
    kind: 'vino',
  },
]

/** Marke za traku „pisali su o nama". Samo one koje su potvrdene kao zive. */
export const MARKS = [
  'PBS',
  'Euronews',
  'Forbes',
  'National Geographic Traveller',
  'Atlas Obscura',
  'Vogue Adria',
]

export type Story = {
  outlet: string
  title: string
  /** Jedna recenica o tome sto je u clanku. Nas tekst, ne njihov. */
  note: string
  year: string
  href: string
}

export const STORIES: Story[] = [
  {
    outlet: 'PBS',
    title: 'Travel Detective — prilog o Edivu u „Hidden Gems of Dubrovnik"',
    note: 'Američka javna televizija, petnaest minuta na licu mjesta.',
    year: '2022',
    href: 'https://www.pbs.org/video/hidden-gems-of-dubrovnik-ekfddp',
  },
  {
    outlet: 'National Geographic Traveller',
    title: 'A Land of Stories',
    note: 'Tiskano izdanje UK, listopad 2023., stranice 98–100.',
    year: '2023',
    href: 'https://www.edivovina.hr/wp-content/uploads/2023/09/A-Land-of-Stories-Nat-Geo-Traveller-Oct-2023.pdf',
  },
  {
    outlet: 'Euronews',
    title: 'The ultimate wine tour is in Croatia, 20 metres under the sea',
    note: 'Kako se do amfora uopće dolazi i tko ih vadi.',
    year: '2021',
    href: 'https://www.euronews.com/travel/2021/01/17/the-ultimate-wine-tour-is-in-croatia-20-metres-under-the-sea',
  },
  {
    outlet: 'Forbes',
    title: 'The Underwater Wine Cellars Of Croatia Beneath The Adriatic Sea',
    note: 'Jim Dobson o podmorskim podrumima na Jadranu.',
    year: '2020',
    href: 'https://www.forbes.com/sites/jimdobson/2020/06/22/the-underwater-wine-cellars-of-croatia-beneath-the-adriatic-sea/',
  },
  {
    outlet: 'Atlas Obscura',
    title: 'Edivo Vina Winery in Drače',
    note: 'Gastro Obscura, Luke Fater — koncept i kako je nastao.',
    year: '2020',
    href: 'https://www.atlasobscura.com/places/edivo-vina-underwater-winery',
  },
]

/**
 * Jedna izjava, njihova. Sve ostalo na stranici je nas tekst — tudi clanci se
 * ne prepisuju, samo se na njih linka.
 */
export const QUOTE = {
  text: 'We are getting calls from all corners of the world asking where can they buy our wine.',
  who: 'Ivo Šegović',
  where: 'Croatia Week',
}
