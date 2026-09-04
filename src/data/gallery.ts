/**
 * Kurirana galerija.
 *
 * Nakon sto je dosao profesionalni shoot (svibanj 2024), stari scrapeani
 * materijal ima smisla samo tamo gdje NEMA zamjene: podvodni kadrovi samog
 * podruma. Sve ostalo iz starog seta je izbaceno — 160 mobilnih fotki jedna do
 * druge citalo se kao upload folder i tezilo 42 MB.
 */
export type Group = { title: string; note: string; names: string[] }

export const GALLERY: Group[] = [
  {
    title: 'What comes back up',
    note: 'the amphora, out of the water',
    names: [
      'lift-water', 'hands-amphora', 'hands-amphora-2', 'surface-amphora',
      'boat-bottle-2', 'boat-bottle', 'pour-amphora', 'pour-glass',
    ],
  },
  {
    title: 'Down there',
    note: 'the cellar at 25 metres — the only set with no replacement',
    names: [
      'seabed-pebbles',
      'ispod-mora-01', 'ispod-mora-02', 'ispod-mora-03', 'ispod-mora-04',
      'ispod-mora-05', 'ispod-mora-06', 'ispod-mora-07', 'ispod-mora-08',
      'ispod-mora-09',
      'UTS-01', 'UTS-02', 'UTS-03', 'UTS-04', 'UTS-05', 'UTS-06',
    ],
  },
  {
    title: 'The work',
    note: 'harvest, clay, the boat',
    names: [
      'proizvodnja-01', 'proizvodnja-05', 'proizvodnja-11', 'proizvodnja-13',
      'proizvodnja-23', 'proizvodnja-33', 'founder',
    ],
  },
  {
    title: 'At the table',
    note: 'Drače, and the water in front of it',
    names: [
      'reveal-shore', 'sunset-glasses', 'jetty', 'jetty-2', 'bay-bottle',
      'platter', 'oyster', 'bar-terrace', 'vinarija-01', 'vinarija-05',
    ],
  },
  {
    title: 'The bottles',
    note: 'the full list',
    names: [
      'p-amphora', 'p-navis', 'p-sea-bottle', 'p-eros-sea', 'p-box',
      'p-cellar', 'p-dingac', 'p-plavac-red', 'p-q-white', 'p-rose', 'p-eros',
    ],
  },
]

export const galleryCount = GALLERY.reduce((n, g) => n + g.names.length, 0)
