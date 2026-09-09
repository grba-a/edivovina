/**
 * Katalog. Oblik je namjerno mapiran na WooCommerce polja da se prijenos svede
 * na prepisivanje vrijednosti, ne na preradu strukture.
 *
 *   sku -> _sku              price -> _regular_price    volume/abv/vintage -> pa_* atributi
 *   slug -> post_name        shortDescription -> post_excerpt
 *   description -> post_content                 categories -> product_cat
 *   tags -> product_tag      rating -> _wc_average_rating  menuOrder -> menu_order
 *
 * Cijene su s edivovina.hr (rujan 2026) i sve deset se poklapaju do centa.
 * Cijene degustacija NISU ovdje - one su na winetraveleru u pretkonverzijskim
 * kunama i cekaju potvrdu klijenta.
 *
 * SLUG JE post_name i zato je poravnan s njihovim ZIVIM proizvodima, ne s onim
 * kako bi nama zvucalo bolje. Cetiri su se razlikovala; prikazna imena smo
 * zadrzali svoja gdje su bolja (post_title je u WordPressu trivijalna izmjena,
 * post_name nije).
 *
 * `categories` su njihova stvarna Woo taksonomija, procitana s klasa na
 * li.product. Vazno: kategorija `undersea` ima TOCNO CETIRI proizvoda i Eros
 * NIJE u njoj — sto se poklapa s tim da mu opis nikad ne tvrdi da je bio pod
 * morem. Zato se "s dna" broji iz kategorije, ne iz `daysUnderSea`.
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
  /**
   * _sale_price. Nijedno vino trenutno nije na snizenju i to je istina — polje
   * postoji zato da skeleta podrzava `.onsale` bedz i `<del>/<ins>`, koje svaki
   * pravi Woo shop ima. Ne popunjavati izmisljenim snizenjem.
   */
  salePrice?: number
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
  /** product_cat. Njihova stvarna taksonomija: 'wines' i/ili 'undersea'. */
  categories: string[]
  /** product_tag. Kod njih samo linija Navis Mysterium ih ima. */
  tags: string[]
  /** _wc_average_rating. Samo gdje ga stvarno imaju — sest od deset nosi 5.00. */
  rating?: number
  /** menu_order — njihov stvarni redoslijed u shopu. Drzi "Default sorting". */
  menuOrder: number
  /**
   * post_date. PROVIZORNO: izvedeno iz putanje njihove medijske biblioteke
   * (2021/04 za izvornih sedam, 2026/05 za Navis Q, Eros i Rose). WordPress
   * drzi pravi datum; ovdje stoji samo da "Sort by latest" nije mrtav.
   */
  dateCreated: string
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
    volume: '3 × 0.75 l',
    /* p-box je plava kutija s JEDNOM bocom oznacenom EROS — stoji nad
       „tri boce" i uz najvecu cijenu na stranici. Ispravnog kadra nema u
       public/photo; do njega ide amfora, koja barem pokazuje Navis Mysterium.
       Ceka klijenta: jedna snimka tri boce u kadru. */
    image: 'p-amphora',
    featured: true,
    stockStatus: 'instock',
    categories: ['undersea', 'wines'],
    tags: ['mysterium', 'navis'],
    rating: 5,
    menuOrder: 5,
    dateCreated: '2021-04-01',
  },
  {
    sku: 'NM-AMPH',
    slug: 'navis-mysterium-undersea-amphora',
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
    volume: '0.75 l',
    image: 'p-amphora',
    featured: true,
    stockStatus: 'instock',
    categories: ['wines', 'undersea'],
    tags: ['mysterium', 'navis'],
    rating: 5,
    menuOrder: 1,
    dateCreated: '2021-04-01',
  },
  {
    sku: 'NM-SEA',
    slug: 'navis-mysterium-undersea-bottle',
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
    volume: '0.75 l',
    image: 'p-navis',
    featured: true,
    stockStatus: 'instock',
    categories: ['undersea', 'wines'],
    tags: ['mysterium', 'navis'],
    rating: 5,
    menuOrder: 2,
    dateCreated: '2021-04-01',
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
    volume: '0.75 l',
    image: 'p-sea-bottle',
    stockStatus: 'instock',
    categories: ['wines', 'undersea'],
    tags: [],
    menuOrder: 3,
    dateCreated: '2026-05-01',
  },
  {
    sku: 'EROS-SEA',
    slug: 'eros-sparkling-wine-sea-bottle',
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
    volume: '0.75 l',
    image: 'p-eros-sea',
    stockStatus: 'instock',
    categories: ['wines'],
    tags: [],
    menuOrder: 4,
    dateCreated: '2026-05-01',
  },
  {
    sku: 'NM-REG',
    slug: 'navis-mysterium-regular-bottle',
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
    volume: '0.75 l',
    image: 'p-cellar',
    stockStatus: 'instock',
    categories: ['wines'],
    tags: ['mysterium', 'navis'],
    rating: 5,
    menuOrder: 6,
    dateCreated: '2021-04-01',
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
    volume: '0.75 l',
    image: 'p-dingac',
    stockStatus: 'instock',
    categories: ['wines'],
    tags: [],
    rating: 5,
    menuOrder: 10,
    dateCreated: '2021-04-01',
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
    volume: '0.75 l',
    image: 'p-q-white',
    stockStatus: 'instock',
    categories: ['wines'],
    tags: [],
    rating: 5,
    menuOrder: 7,
    dateCreated: '2021-04-01',
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
    volume: '0.75 l',
    image: 'p-plavac-red',
    stockStatus: 'instock',
    categories: ['wines'],
    tags: [],
    menuOrder: 9,
    dateCreated: '2021-04-01',
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
    volume: '0.75 l',
    image: 'p-rose',
    stockStatus: 'instock',
    categories: ['wines'],
    tags: [],
    menuOrder: 8,
    dateCreated: '2026-05-01',
  },
]

export const bySlug = (slug: string) => WINES.find((w) => w.slug === slug)
export const featured = () => WINES.filter((w) => w.featured)

/**
 * "S dna" po NJIHOVOJ taksonomiji, ne po nasem `daysUnderSea`.
 *
 * Njihova kategorija /wines/undersea ima cetiri proizvoda: Amphora, Undersea
 * Bottle, Navis Q i TRIS. Eros nije u njoj iako se zove "Sea Bottle" — i njegov
 * opis nikad ne tvrdi da je bio pod morem, dok mu nas `daysUnderSea: 700` to
 * pripisuje. Do potvrde klijenta broji se ono sto je provjerljivo.
 */
export const undersea = () => WINES.filter((w) => w.categories.includes('undersea'))
export const cellar = () => WINES.filter((w) => !w.categories.includes('undersea'))

/** Njihov redoslijed u shopu — "Default sorting". */
export const byMenuOrder = () => [...WINES].sort((a, b) => a.menuOrder - b.menuOrder)

/** Tri boce iz TRIS-a, u redu u kojem se piju. */
export const THE_THREE = [
  'navis-mysterium-regular-bottle',
  'navis-mysterium-undersea-bottle',
  'navis-mysterium-undersea-amphora',
] as const
