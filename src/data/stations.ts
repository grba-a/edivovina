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
  /** Horizontalni pomak u world unitima 3D scene. Pozitivno = desno. */
  x: number
  /** Mnozitelj velicine amfore u odnosu na osnovni spust. */
  scale: number
}

export const MAX_M = 25

export const STATIONS: Station[] = [
  {
    id: 'surface',
    m: 0,
    name: 'Površina',
    light: 'Sve boje su još tu',
    act: 'front',
    /* Desno i manje nego osnovna putanja spusta: naslov drzi lijevu stranu, a
       predmet mu presijeca samo rep. Vrijednosti su izmjerene na 1440 px. */
    x: 1.6,
    scale: 0.66,
  },
  {
    id: 'winery',
    m: 6,
    name: 'Vinarija',
    light: 'Na šest metara nestane crveno',
    act: 'hidden',
    x: 1.4,
    scale: 0.8,
  },
  {
    id: 'shop',
    m: 12,
    name: 'Boce',
    light: 'Na dvanaest metara nestane narančasto',
    act: 'small',
    x: 1.9,
    scale: 0.44,
  },
  {
    id: 'press',
    m: 18,
    name: 'Pisali su',
    light: 'Na osamnaest metara ostaje samo plavo',
    act: 'hidden',
    x: 1.5,
    scale: 0.5,
  },
  {
    id: 'awards',
    m: 22,
    name: 'Nagrade',
    light: 'Na dvadeset dva metra svjetla više nema',
    act: 'small',
    x: -1.7,
    scale: 0.46,
  },
  {
    id: 'seabed',
    m: 25,
    name: 'Dno',
    light: 'Ovdje amfora sjeda u ležište',
    act: 'full',
    x: 0,
    scale: 1,
  },
]

/** Sto koja uloga znaci za vidljivost i sloj. Jedno mjesto, bez iznimaka. */
export const ACT: Record<Act, { o: number; z: number; label: string }> = {
  front: { o: 1, z: 20, label: 'ispred teksta' },
  small: { o: 0.55, z: 2, label: 'smanjena, iza sadržaja' },
  hidden: { o: 0, z: 2, label: 'sakrivena' },
  full: { o: 1, z: 2, label: 'sjeda u ležište' },
}

/** „12,5" — europski zarez, rucno. Kroz Intl bi ovisilo o CLDR-u runtimea. */
export const metres = (p: number) => (p * MAX_M).toFixed(1).replace('.', ',')
