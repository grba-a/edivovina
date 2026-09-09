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
  kind: 'wine' | 'design'
}

export const AWARDS: Award[] = [
  {
    /* Godina se ne ceka: njihov vlastiti bedz (public/medal/decanter-silver.webp)
       pise „2022 · Decanter World Wine Awards · Silver". Berba je i dalje
       nepoznata i ostaje neizmisljena. */
    year: '2022',
    body: 'Decanter World Wine Awards',
    medal: 'Silver',
    detail: 'Dingač — wine quality',
    icon: 'decanter-silver',
    kind: 'wine',
  },
  {
    year: '2021',
    body: 'America Wine Awards',
    medal: 'Two golds',
    detail: 'Navis Mysterium Amphora 2013 and Navis Mysterium Bottle 2013',
    icon: 'america-gold',
    kind: 'wine',
  },
  {
    year: '2017',
    body: 'Sabatina',
    medal: 'Champion',
    detail: 'Navis Mysterium Amphora 2012 — championship for design',
    icon: 'sabatina-gold',
    kind: 'design',
  },
  {
    year: '2016',
    body: 'Sabatina',
    medal: 'Vice-champion',
    detail: 'Navis Mysterium Bottle 2012 — product design, plus gold for wine quality',
    icon: 'sabatina-silver',
    kind: 'design',
  },
  {
    year: '2015',
    body: 'Sabatina',
    medal: 'Silver',
    detail: 'Edivo Plavac 2015 — wine quality',
    icon: 'sabatina-silver',
    kind: 'wine',
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
    title: 'Travel Detective — Edivo in “Hidden Gems of Dubrovnik”',
    note: 'American public television, fifteen minutes on site.',
    year: '2022',
    href: 'https://www.pbs.org/video/hidden-gems-of-dubrovnik-ekfddp',
  },
  {
    outlet: 'National Geographic Traveller',
    title: 'A Land of Stories',
    note: 'UK print edition, October 2023, pages 98–100.',
    year: '2023',
    href: 'https://www.edivovina.hr/wp-content/uploads/2023/09/A-Land-of-Stories-Nat-Geo-Traveller-Oct-2023.pdf',
  },
  {
    outlet: 'Euronews',
    title: 'The ultimate wine tour is in Croatia, 20 metres under the sea',
    note: 'How the amphorae are reached, and who brings them up.',
    year: '2021',
    href: 'https://www.euronews.com/travel/2021/01/17/the-ultimate-wine-tour-is-in-croatia-20-metres-under-the-sea',
  },
  {
    outlet: 'Forbes',
    title: 'The Underwater Wine Cellars Of Croatia Beneath The Adriatic Sea',
    note: 'Jim Dobson on the underwater cellars of the Adriatic.',
    year: '2020',
    href: 'https://www.forbes.com/sites/jimdobson/2020/06/22/the-underwater-wine-cellars-of-croatia-beneath-the-adriatic-sea/',
  },
  {
    outlet: 'Atlas Obscura',
    title: 'Edivo Vina Winery in Drače',
    note: 'Gastro Obscura, Luke Fater — the concept and how it began.',
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
