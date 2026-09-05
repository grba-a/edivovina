/**
 * POZORNICA — sto amfora radi na kojoj postaji.
 *
 * `descent.ts` odgovara na pitanje KOLIKO smo duboko. Ovo odgovara na pitanje
 * GDJE smo i sto predmet tamo radi. Dvije stvari, dva modula.
 *
 * Objavljuje se na dva nacina, kao i spust:
 *   1. CSS varijable na <html> -> vidljivost i sloj canvasa, cisti CSS
 *   2. modul-store koji cita AmphoraMesh u useFrameu -> x i scale u 3D-u
 *
 * Zasto se postaje MJERE u DOM-u, a ne racunaju iz fiksnih p vrijednosti:
 * visina sekcije ovisi o sadrzaju, fontu i sirini ekrana. Zakovane granice bi
 * se razisle s onim sto je stvarno na ekranu cim se doda jedna recenica.
 */

import { STATIONS, ACT, MAX_M, type Act } from '@/data/stations'

export type Stage = {
  /** indeks trenutne postaje */
  i: number
  /**
   * Dubina u metrima. NIJE `--descent * 25`.
   *
   * Sirovi scroll-progress i nominalne dubine postaja se razilaze: kad je
   * sekcija „−12 m" u sredini ekrana, scroll je na 0,39 pa bi brojac pokazivao
   * −9,8 m. Citalo se kao kvar, i jest kvar: nadnaslov te sekcije doslovno
   * kaze „na dvanaest metara".
   *
   * Zato je dubina IZMJERENA koordinata: scroll se mapira po dijelovima na
   * nominalne dubine postaja. Kad si na postaji, brojac pokazuje njezinu
   * dubinu — i traka desno i tekst govore isto.
   */
  m: number
  /** uloga koja se upravo cita (ukljucujuci prijelaz prema sljedecoj) */
  act: Act
  /** horizontalni pomak u world unitima */
  x: number
  /** mnozitelj velicine */
  scale: number
}

const state: Stage = { i: 0, m: 0, act: 'front', x: 0, scale: 1 }
let raf = 0
let started = false

export const getStage = (): Stage => state

/* Snapshot se mijenja samo kad se dubina promijeni za >=0,05 m — inace bi
   useSyncExternalStore rerenderirao traku 60x u sekundi. */
let snapshot = 0
const subs = new Set<() => void>()
export const getDepthM = () => snapshot
export function subscribeDepth(cb: () => void) {
  subs.add(cb)
  return () => subs.delete(cb)
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n)

/**
 * Uski ekran nema bocnog prostora: predmet koji je na desktopu ISPRED naslova
 * ovdje bi legao na tekuci tekst. Zato na mobitelu nikad ne ide u prvi plan.
 */
const isNarrow = () => window.innerWidth < 900

const publish = () => {
  raf = 0

  const nodes = document.querySelectorAll<HTMLElement>('[data-station]')
  if (!nodes.length) return

  const mid = window.innerHeight * 0.5
  let i = 0
  let within = 0

  for (let k = 0; k < nodes.length; k++) {
    const r = nodes[k].getBoundingClientRect()
    if (r.top <= mid && r.bottom >= mid) {
      i = k
      within = clamp01((mid - r.top) / Math.max(1, r.height))
      break
    }
    // ispod svih -> zadnja; iznad svih -> prva
    if (r.top > mid) break
    i = k
    within = 1
  }

  /* Sidro postaje = scroll na kojem je ta postaja u sredini ekrana. To je ista
     mjera koju cita i brojac, pa se tocka na traci poklopi s oznakom. */
  const max = document.documentElement.scrollHeight - window.innerHeight
  let m = 0
  if (max > 0) {
    const y = window.scrollY
    let lo = 0
    let hi = nodes.length - 1
    /* Sidro se ograniceva na stvarni doseg scrolla. Zadnja postaja se ne moze
       centrirati — ispod nje nema stranice — pa bi bez clampa dno stranice
       citalo 24,4 m umjesto 25,0. */
    const anchorOf = (el: HTMLElement) =>
      Math.min(max, Math.max(0, el.offsetTop + el.offsetHeight / 2 - window.innerHeight / 2))

    for (let k = 0; k < nodes.length; k++) {
      const anchor = anchorOf(nodes[k])
      if (anchor <= y) lo = k
      if (anchor > y) { hi = k; break }
    }
    if (hi <= lo) hi = Math.min(nodes.length - 1, lo + 1)
    const aLo = anchorOf(nodes[lo])
    const aHi = anchorOf(nodes[hi])
    const span = aHi - aLo
    const f = span > 0 ? clamp01((y - aLo) / span) : lo === 0 ? clamp01(y / Math.max(1, aLo || 1)) : 1
    const mLo = STATIONS[lo]?.m ?? 0
    const mHi = STATIONS[hi]?.m ?? MAX_M
    m = lo === 0 && y < aLo ? lerp(0, mLo, clamp01(aLo > 0 ? y / aLo : 1)) : lerp(mLo, mHi, f)
  }

  const cur = STATIONS[i] ?? STATIONS[0]
  const nxt = STATIONS[Math.min(STATIONS.length - 1, i + 1)]

  /* Mijesanje krece tek u zadnjoj trecini postaje: predmet mirno stoji dok se
     sekcija cita, pa se tek onda priprema za sljedecu. Bez ovoga bi se micao
     cijelo vrijeme i citao kao nemir, ne kao putovanje. */
  const t = clamp01((within - 0.62) / 0.38)

  const a = ACT[cur.act]
  const b = ACT[nxt.act]
  const narrow = isNarrow()

  const o = lerp(a.o, b.o, t) * (narrow ? 0.42 : 1)
  const z = (t > 0.5 ? b.z : a.z) === 20 && !narrow ? 20 : 2

  state.i = i
  state.act = t > 0.5 ? nxt.act : cur.act
  state.x = lerp(cur.x, nxt.x, t) * (narrow ? 0.55 : 1)
  state.scale = lerp(cur.scale, nxt.scale, t)

  state.m = m

  const root = document.documentElement
  root.style.setProperty('--amph-o', o.toFixed(3))
  root.style.setProperty('--amph-z', String(z))
  root.style.setProperty('--station', String(i))
  /* Traka dubine se puni po METRIMA, ne po sirovom scrollu — inace se tocka ne
     poklapa s oznakom postaje na koju si upravo skrolao. */
  root.style.setProperty('--depth-m', m.toFixed(2))

  if (Math.abs(m - snapshot) >= 0.05) {
    snapshot = m
    subs.forEach((cb) => cb())
  }
}

const schedule = () => {
  if (!raf) raf = requestAnimationFrame(publish)
}

export function startStage() {
  if (started) return () => {}
  started = true

  window.addEventListener('scroll', schedule, { passive: true })
  window.addEventListener('resize', schedule, { passive: true })
  window.addEventListener('lenis-scroll', schedule)
  publish()

  return () => {
    started = false
    if (raf) cancelAnimationFrame(raf)
    raf = 0
    window.removeEventListener('scroll', schedule)
    window.removeEventListener('resize', schedule)
    window.removeEventListener('lenis-scroll', schedule)
  }
}
