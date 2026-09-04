/**
 * Poglavlja spusta. `p` je pocetak poglavlja na normaliziranom scrollu [0,1].
 * Dubina i dani su LINEARNO vezani na p — to je cijela poanta: scroll = dubina = vrijeme.
 *
 * NAPOMENA: MAX_DEPTH i MAX_DAYS cekaju potvrdu klijenta. Izvori se ne poklapaju
 * (18-25 m na njihovom webu, 20 m Euronews, 14 m jedan dive izvor; "700+ dana"
 * vs "18-24 mjeseca"). Do potvrde koristimo njihove vlastite brojke.
 */
export const MAX_DEPTH = 25
export const MAX_DAYS = 700

export type Chapter = {
  id: string
  /** Dvoznamenkasta oznaka u mono traci. */
  index: string
  p: number
  label: string
}

export const CHAPTERS: Chapter[] = [
  { id: 'surface', index: '01', p: 0.0, label: 'Surface' },
  { id: 'reveal', index: '02', p: 0.11, label: 'The reveal' },
  { id: 'three', index: '03', p: 0.3, label: 'Three lives' },
  { id: 'shop', index: '04', p: 0.53, label: 'The bottles' },
  { id: 'proof', index: '05', p: 0.7, label: 'Judged' },
  { id: 'close', index: '06', p: 0.86, label: 'The seabed' },
]

export const chapterAt = (p: number): Chapter => {
  let found = CHAPTERS[0]
  for (const c of CHAPTERS) if (p >= c.p) found = c
  return found
}

/** Europski format, rucno. Kroz Intl bi izgled ovisio o CLDR podacima runtimea. */
export const depthLabel = (p: number) => `${(p * MAX_DEPTH).toFixed(1).replace('.', ',')} m`
export const daysLabel = (p: number) => Math.round(p * MAX_DAYS)
