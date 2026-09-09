/**
 * BLOG — „News & Stories", kao kod njih.
 *
 * Njihova /news-stories je mreza kartica: naslovna slika, naslov, datum,
 * skraceni izvadak, „Read More »". Ovdje je ista forma, ali sadrzaj je
 * kuriran, jer njihov arhiv ima 62 unosa od kojih je gotovo sve PRESLIKAN TUDI
 * TISAK objavljen kao vlastiti post — 51 od 60 prikazanih je prije 2022. Tudi
 * tekst se ne uvozi; linka se na izvor i pise se NASA jedna recenica.
 *
 * `href` je provjeren izvor kod outleta. Njihovi vlastiti permalinkovi
 * (/news/<slug>) postoje u WordPressu i dolaze s migracijom — ovdje ih ne
 * izmisljam, jer pogresan slug je 404.
 *
 * `image` je stem iz public/photo — NASA fotografija, ne screenshot clanka.
 * Datumi su njihovi, s njihovog arhiva.
 */
export type Post = {
  date: string
  /** Prikazni datum — pisemo ga rucno da ne ovisi o CLDR-u runtimea. */
  dateLabel: string
  outlet: string
  title: string
  /** Nasa jedna recenica o tome sto je u clanku. Nikad njihov tekst. */
  excerpt: string
  href: string
  image: string
  featured?: boolean
}

export const POSTS: Post[] = [
  {
    date: '2023-09-12',
    dateLabel: '12 September 2023',
    outlet: 'National Geographic Traveller',
    title: 'A Land of Stories',
    excerpt:
      'Three pages in the UK print edition, October 2023 — the peninsula, the wreck, and what the sea does to a sealed bottle.',
    href: 'https://www.edivovina.hr/wp-content/uploads/2023/09/A-Land-of-Stories-Nat-Geo-Traveller-Oct-2023.pdf',
    image: 'lift-water',
    featured: true,
  },
  {
    date: '2022-06-27',
    dateLabel: '27 June 2022',
    outlet: 'PBS',
    title: 'Travel Detective — Hidden Gems of Dubrovnik',
    excerpt:
      'American public television spent fifteen minutes on site, above the wreck and in the bar at Drače.',
    href: 'https://www.pbs.org/video/hidden-gems-of-dubrovnik-ekfddp',
    /* `jetty` je imao osobu s casom u kadru — „predmet je subjekt, bez lica
       i bez lifestylea". Ovo je amfora koja probija povrsinu. */
    image: 'surface-amphora',
  },
  {
    date: '2021-01-19',
    dateLabel: '19 January 2021',
    outlet: 'Euronews',
    title: 'The ultimate wine tour is in Croatia, 20 metres under the sea',
    excerpt: 'How the amphorae are reached, who brings them up, and what the cages are for.',
    href: 'https://www.euronews.com/travel/2021/01/17/the-ultimate-wine-tour-is-in-croatia-20-metres-under-the-sea',
    image: 'seabed-pebbles',
  },
  {
    date: '2020-06-23',
    dateLabel: '23 June 2020',
    outlet: 'Forbes',
    title: 'The Underwater Wine Cellars Of Croatia Beneath The Adriatic Sea',
    excerpt: 'Jim Dobson on the underwater cellars of the Adriatic, and why the Adriatic suits them.',
    href: 'https://www.forbes.com/sites/jimdobson/2020/06/22/the-underwater-wine-cellars-of-croatia-beneath-the-adriatic-sea/',
    image: 'hands-amphora',
  },
  {
    date: '2020-01-01',
    dateLabel: '2020',
    outlet: 'Atlas Obscura',
    title: 'Edivo Vina Winery in Drače',
    excerpt: 'Gastro Obscura, Luke Fater — the concept, and how it began with a year of failed seals.',
    href: 'https://www.atlasobscura.com/places/edivo-vina-underwater-winery',
    image: 'pour-amphora',
  },
  {
    date: '2024-06-17',
    dateLabel: '17 June 2024',
    outlet: 'Vogue Adria',
    title: 'Underwater Wine Cellars',
    excerpt: 'The object as fashion editorial — the encrustation read as surface, not as damage.',
    href: 'https://www.edivovina.hr/news-stories',
    image: 'boat-bottle',
  },
]

/**
 * Ostatak arhiva, kao dated popis. Naslovi i datumi su njihovi; linka se na
 * njihov arhiv jer permalinkove drzi WordPress.
 */
export const ARCHIVE: { dateLabel: string; outlet: string; title: string }[] = [
  { dateLabel: '8 Nov 2025', outlet: 'Socios por el Mundo', title: 'Jorge y Pancho recorriendo Croacia' },
  { dateLabel: '1 Oct 2024', outlet: 'Engoo', title: 'Croatian Winery Offers Undersea Cellar Tours' },
  { dateLabel: '1 Aug 2023', outlet: 'Feature', title: 'My wine life will never be the same from now on' },
  { dateLabel: '3 Jul 2023', outlet: 'Luxury Living Croatia', title: 'Luxury Living Croatia' },
  { dateLabel: '21 Sep 2022', outlet: 'Feature', title: 'Croatia: A Kingdom of Salt and Sea' },
  { dateLabel: '9 Mar 2022', outlet: 'Feature', title: 'Wine tour on Pelješac: one peninsula, three wineries' },
  { dateLabel: '2 Nov 2021', outlet: 'The Epoch Times', title: 'The Epoch Times' },
  { dateLabel: '30 Aug 2021', outlet: 'Feature', title: 'One of the top 10 things to do in Dubrovnik' },
  { dateLabel: '14 Jun 2021', outlet: 'Feature', title: 'Dive for Wine: Croatia’s Underwater Winery' },
  { dateLabel: '8 Feb 2021', outlet: 'Edivo Vina', title: 'Two gold medals for Edivo wines' },
  { dateLabel: '9 Nov 2020', outlet: 'IWC', title: 'Edivo Wines on the International Wine Challenge' },
  { dateLabel: '2 Mar 2018', outlet: 'CCTV', title: 'Chinese national television documentary on Navis Mysterium' },
]

export const ARCHIVE_HREF = 'https://www.edivovina.hr/news-stories'
