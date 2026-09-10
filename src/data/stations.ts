/**
 * POSTAJE — jedini izvor istine o tome sto se dogada na kojoj dubini.
 *
 * Stranica je zaron od povrsine do 25 metara. Svaka sekcija je postaja i sama
 * deklarira svoj odnos prema amfori; amfora ne zna nista o sekcijama.
 *
 * Cita se s dvije strane:
 *   DOM  — traka dubine, brojke u marginama, vidljivost i sloj canvasa
 *   3D   — AmphoraMesh uzima x i scale iz iste tablice
 *
 * Zato promjena koreografije znaci promjenu OVDJE, na jednom mjestu.
 */

/** Kako se predmet ponasa na toj postaji. */
export type Act =
  /** velika, ISPRED sadrzaja — presijeca naslov */
  | 'front'
  /** smanjena, iza sadrzaja — tone pokraj */
  | 'small'
  /** nema je — ekran je cista tipografija */
  | 'hidden'
  /** puna, sjeda u leziste */
  | 'full'

export type Station = {
  id: string
  /** Dubina u metrima. Ovo je i naslov postaje i njezina koordinata. */
  m: number
  /** Kratko ime postaje — cita ga traka dubine. */
  name: string
  /**
   * Jedna recenica o tome sto se na toj dubini dogodi svjetlu. Nije ukras:
   * to je razlog zasto sekcija ima bas tu boju.
   */
  light: string
  act: Act
  /**
   * Horizontalni pomak kao RAZMJER vidljive polusirine kadra: 0 = sredina,
   * 1 = desni rub. Ne world jedinice — one su na 1440 px davale desnu stranu,
   * a na 2000 px istih 1,6 jedinica je vec bila sredina i amfora je sjela na
   * naslov. Razmjer se drzi na svakoj sirini.
   */
  x: number
  /** Mnozitelj velicine amfore u odnosu na osnovni spust. */
  scale: number
  /**
   * Vidljivost na uskom ekranu, ako se razlikuje od pravila.
   *
   * Pravilo je da na mobitelu predmet ide prigusen (0,42) jer tamo nema
   * bocnog prostora i tekst mu lezi preko. Ali postaja koja je NAMJERNO
   * slozena oko predmeta — prazan pojas, tekst iznad i ispod — ne treba to
   * prigusenje; ondje je predmet subjekt i mora se vidjeti.
   */
  oNarrow?: number
}

export const MAX_M = 25

export const STATIONS: Station[] = [
  {
    id: 'surface',
    m: 0,
    name: 'Surface',
    light: 'Every colour is still here',
    act: 'front',
    /* Jedina postaja s pomakom u stranu. Naslov drzi lijevu stranu kadra, pa
       predmet stoji u desnom stupcu i presijeca mu samo rep. Od uranjanja
       nadalje tone po sredini — do samog dna. */
    x: 0.5,
    scale: 0.8,
  },
  {
    /* Trenutak uranjanja. Postoji zato sto se na prijelazu s hera mora VIDJETI
       da je predmet krenuo tonuti: na fotografiji tek udara u vodu, a odmah
       ispod pada kroz sredinu kadra. Bez ove postaje amfora je nestajala na
       vinariji i taj se trenutak nije citao.

       x = 0 i najveca skala na cijelom spustu: ovdje je predmet subjekt, a
       tekst se pomakao u dna kadra da mu ne stoji na putu. */
    id: 'dive',
    m: 3,
    name: 'Immersion',
    /* Jedna tvrdnja o crvenom, na jednoj dubini. Prije je stajala i tu (3 m) i
       u tijelu sekcije (5 m) i na vinariji (6 m) — tri broja za istu stvar. */
    light: 'Red has already gone',
    act: 'front',
    x: 0,
    scale: 1.15,
    /* Mobilni raspored ove sekcije ima prazan pojas za predmet, pa nema sto
       prigusivati — na 0,42 je izgledao kao mrlja u pozadini. */
    oNarrow: 0.92,
  },
  {
    id: 'winery',
    m: 6,
    name: 'The winery',
    light: 'At six metres there is no red left',
    act: 'hidden',
    x: 0,
    scale: 0.8,
  },
  {
    id: 'shop',
    m: 12,
    name: 'The bottles',
    light: 'At twelve metres gold outlasts orange',
    act: 'small',
    /* PO SREDINI. Kratko sam ga pomaknuo u stranu (0,62) jer je iza neprozirnih
       kartica mjerio 0,00–0,05 % ekrana — ali bocni drift od tri metra do dna
       je citao kao nemir. Putanja je jedna: desni stupac u heru, pa sredina do
       dna. Predmet se ovdje vidi u zljebovima iznad i ispod reda kartica. */
    x: 0,
    scale: 0.44,
  },
  {
    id: 'press',
    m: 18,
    name: 'In print',
    light: 'At eighteen metres only blue is left',
    act: 'hidden',
    x: 0,
    scale: 0.5,
  },
  {
    id: 'awards',
    m: 22,
    name: 'Awards',
    light: 'At twenty-two metres there is no light at all',
    act: 'small',
    x: 0,
    scale: 0.46,
  },
  {
    id: 'seabed',
    m: 25,
    name: 'The seabed',
    light: 'Twenty-five metres down, nothing moves',
    act: 'full',
    x: 0,
    scale: 1,
    /* Sjedanje u leziste je nagrada cijelog spusta — na mobitelu se ne prigusuje. */
    oNarrow: 0.9,
  },
]


/**
 * Postaja po ID-u. Komponente MORAJU koristiti ovo, ne STATIONS[n].
 *
 * Indeksi su me vec ugrizli: ubacivanje postaje „uranjanje" na mjesto 1
 * pomaknulo je sve ostalo, pa su dvije komponente crtale istu postaju a
 * `press` i `seabed` se prestali renderirati — bez ijedne greske u konzoli,
 * jer je indeks i dalje bio valjan.
 */
export function station(id: string): Station {
  const s = STATIONS.find((x) => x.id === id)
  if (!s) throw new Error(`stations.ts: nema postaje „${id}"`)
  return s
}

/**
 * Kao `station`, ali vraca null umjesto da puca.
 *
 * Postoji samo za rAF petlje (`stage.ts`): tamo se ID cita iz DOM-a, pa nepoznata
 * vrijednost ne smije baciti gresku sezdeset puta u sekundi. Komponente i dalje
 * MORAJU koristiti `station()`, koje puca glasno i odmah.
 */
export function stationOrNull(id: string | undefined): Station | null {
  if (!id) return null
  return STATIONS.find((x) => x.id === id) ?? null
}

/** Sto koja uloga znaci za vidljivost i sloj. Jedno mjesto, bez iznimaka. */
export const ACT: Record<Act, { o: number; z: number; label: string }> = {
  front: { o: 1, z: 20, label: 'in front of the text' },
  small: { o: 0.55, z: 2, label: 'small, behind the content' },
  hidden: { o: 0, z: 2, label: 'hidden' },
  full: { o: 1, z: 2, label: 'settling into the cradle' },
}

/** „12.5" — engleska tocka, rucno. Kroz Intl bi ovisilo o CLDR-u runtimea. */
export const metres = (p: number) => (p * MAX_M).toFixed(1)
