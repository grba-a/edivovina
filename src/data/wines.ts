/**
 * Katalog. Oblik je namjerno mapiran na WooCommerce polja da se prijenos svede
 * na prepisivanje vrijednosti, ne na preradu strukture.
 *
 *   sku -> _sku            price -> _regular_price      volume/abv/vintage -> product attributes
 *   slug -> post_name      shortDescription -> post_excerpt
 *
 * Cijene su s edivovina.hr (rujan 2026). Cijene degustacija NISU ovdje - one su
 * na winetraveleru u pretkonverzijskim kunama i cekaju potvrdu klijenta.
 */

export type Aging = 'cellar' | 'sea-bottle' | 'amphora' | 'set'

export type Wine = {
  sku: string
  slug: string
  name: string
  /** Kratka linija za karticu. Jedna misao, bez pridjeva. */
  shortDescription: string
  /** Dvije-tri recenice za product stranicu. */
  description: string
  price: number
  currency: 'EUR'
  aging: Aging
  /** Dani pod morem. 0 = nikad nije bilo dolje. */
  daysUnderSea: number
  colour: 'red' | 'white' | 'rose' | 'sparkling'
  grapes: string[]
  vintage?: number
  abv?: number
  volume: string
  /** Stem iz public/photo/ (studijske fotke iz "Edivo Bottles"). */
  image: string
  featured?: boolean
  stockStatus: 'instock' | 'outofstock'
}

export const WINES: Wine[] = [
  {
    sku: 'NM-TRIS',
    slug: 'navis-mysterium-tris',
    name: 'Navis Mysterium TRIS',
    shortDescription: 'One wine. Three lives. Cellar, sea, amphora — in one box.',
    description:
      'The same vintage, from the same barrel, split three ways. One bottle stayed in the cellar. One went into the sea. One went into clay, then into the sea. Everything else about them is identical, which is the point: nothing else on this list lets you taste what depth actually does.',
    price: 536,
    currency: 'EUR',
    aging: 'set',
    daysUnderSea: 700,
    colour: 'red',
    grapes: ['Plavac Mali'],
    abv: 14.5,
    volume: '3 × 0,75 l',
    image: 'p-box',
    featured: true,
    stockStatus: 'instock',
  },
  {
    sku: 'NM-AMPH',
    slug: 'navis-mysterium-amphora',
    name: 'Navis Mysterium Amphora',
    shortDescription: 'Sealed in Petrinja clay. Opened by you, not by us.',
    description:
      'A bottle inside a clay amphora, corked and sealed with two layers of rubber, left in the wreck for two years. It comes up wearing oysters and coralline — no two are alike, because the sea decides the finish. Arrives in a hand-made pinewood box with the iron cradle it hung in.',
    price: 382,
    currency: 'EUR',
    aging: 'amphora',
    daysUnderSea: 700,
    colour: 'red',
    grapes: ['Plavac Mali'],
    vintage: 2013,
    abv: 14.5,
    volume: '0,75 l',
    image: 'p-amphora',
    featured: true,
    stockStatus: 'instock',
  },
  {
    sku: 'NM-SEA',
    slug: 'navis-mysterium-sea-bottle',
    name: 'Navis Mysterium Sea Bottle',
    shortDescription: 'Plavac Mali that spent 700 days at fourteen degrees.',
    description:
      'Three months on land, then down to the seabed in a locked cage. Plum jam and dried berry over a long, quiet spine of spice. The pressure and the cold do to this wine what no cellar can be built to do.',
    price: 117,
    currency: 'EUR',
    aging: 'sea-bottle',
    daysUnderSea: 700,
    colour: 'red',
    grapes: ['Plavac Mali'],
    abv: 14.5,
    volume: '0,75 l',
    image: 'p-navis',
    featured: true,
    stockStatus: 'instock',
  },
  {
    sku: 'NQ-SEA',
    slug: 'navis-q-sea-bottle',
    name: 'Navis Q Sea Bottle',
    shortDescription: 'Three white grapes, three regions, one seabed.',
    description:
      'Pošip, Rukatac and Chardonnay, off-dry, gold in the glass. Citrus first, then stone fruit, then salt. The only white we send down.',
    price: 117,
    currency: 'EUR',
    aging: 'sea-bottle',
    daysUnderSea: 700,
    colour: 'white',
    grapes: ['Pošip', 'Rukatac', 'Chardonnay'],
    volume: '0,75 l',
    image: 'p-sea-bottle',
    stockStatus: 'instock',
  },
  {
    sku: 'EROS-SEA',
    slug: 'eros-sparkling-sea-bottle',
    name: 'Eros Sparkling Sea Bottle',
    shortDescription: 'Bubbles that held their nerve under two atmospheres.',
    description:
      'Straw yellow, fine and persistent. White flowers, apple, peach, a line of honey at the end. Taking sparkling wine down is the hardest thing we do — the pressure inside has to argue with the pressure outside for two years.',
    price: 110,
    currency: 'EUR',
    aging: 'sea-bottle',
    daysUnderSea: 700,
    colour: 'sparkling',
    grapes: ['Pošip', 'Chardonnay'],
    volume: '0,75 l',
    image: 'p-eros-sea',
    stockStatus: 'instock',
  },
  {
    sku: 'NM-REG',
    slug: 'navis-mysterium-cellar',
    name: 'Navis Mysterium Cellar',
    shortDescription: 'The control. Same wine, never left the building.',
    description:
      'Two years in our cellar in Janjina and nowhere else. Mineral, spiced, dark berry. On its own it is a serious Plavac; beside its two siblings it becomes an argument.',
    price: 39,
    currency: 'EUR',
    aging: 'cellar',
    daysUnderSea: 0,
    colour: 'red',
    grapes: ['Plavac Mali'],
    abv: 14.5,
    volume: '0,75 l',
    image: 'p-cellar',
    stockStatus: 'instock',
  },
  {
    sku: 'DING',
    slug: 'dingac-edivo',
    name: 'Dingač',
    shortDescription: 'The steepest slope in Croatia, picked by hand because nothing else fits.',
    description:
      'Dark fruit, cocoa, smoke. Dingač is the appellation that made Pelješac famous and the reason we started making wine here at all.',
    price: 29,
    currency: 'EUR',
    aging: 'cellar',
    daysUnderSea: 0,
    colour: 'red',
    grapes: ['Plavac Mali'],
    volume: '0,75 l',
    image: 'p-dingac',
    stockStatus: 'instock',
  },
  {
    sku: 'Q-EDIVO',
    slug: 'q-edivo',
    name: 'Q Edivo',
    shortDescription: 'Semi-dry white. Lunch on a boat, essentially.',
    description:
      'Pošip, Rukatac and Chardonnay drawn from three Croatian regions and blended cold. Pear, acacia, a soft finish.',
    price: 22,
    currency: 'EUR',
    aging: 'cellar',
    daysUnderSea: 0,
    colour: 'white',
    grapes: ['Pošip', 'Rukatac', 'Chardonnay'],
    volume: '0,75 l',
    image: 'p-q-white',
    stockStatus: 'instock',
  },
  {
    sku: 'PLAVAC',
    slug: 'plavac-edivo',
    name: 'Plavac',
    shortDescription: 'Janjina, unadorned.',
    description:
      'Dark ruby. Plum, clove, cinnamon. The everyday version of the grape that everything else here is made from.',
    price: 21,
    currency: 'EUR',
    aging: 'cellar',
    daysUnderSea: 0,
    colour: 'red',
    grapes: ['Plavac Mali'],
    volume: '0,75 l',
    image: 'p-plavac-red',
    stockStatus: 'instock',
  },
  {
    sku: 'ROSE',
    slug: 'rose',
    name: 'Rosé',
    shortDescription: 'Deeper than most. Plavac does not do pale.',
    description:
      'Rose petal, strawberry, red currant. Made from the same fruit as the reds, pressed early and left alone.',
    price: 17.5,
    currency: 'EUR',
    aging: 'cellar',
    daysUnderSea: 0,
    colour: 'rose',
    grapes: ['Plavac Mali'],
    volume: '0,75 l',
    image: 'p-rose',
    stockStatus: 'instock',
  },
]

export const bySlug = (slug: string) => WINES.find((w) => w.slug === slug)
export const featured = () => WINES.filter((w) => w.featured)
export const undersea = () => WINES.filter((w) => w.daysUnderSea > 0)
export const cellar = () => WINES.filter((w) => w.daysUnderSea === 0)

/** Tri boce iz TRIS-a, u redu u kojem se piju. */
export const THE_THREE = ['navis-mysterium-cellar', 'navis-mysterium-sea-bottle', 'navis-mysterium-amphora'] as const
