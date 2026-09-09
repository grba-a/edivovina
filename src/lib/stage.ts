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

import { ACT, stationOrNull, type Act, type Station } from '@/data/stations'

export type Stage = {
  /** indeks trenutne postaje */
  i: number
  /** uloga koja se upravo cita (ukljucujuci prijelaz prema sljedecoj) */
  act: Act
  /** horizontalni pomak u world unitima */
  x: number
  /** mnozitelj velicine */
  scale: number
}

const state: Stage = { i: 0, act: 'front', x: 0, scale: 1 }
let raf = 0
let started = false

export const getStage = (): Stage => state

const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n)

/**
 * Uski ekran nema bocnog prostora: predmet koji je na desktopu ISPRED naslova
 * ovdje bi legao na tekuci tekst. Zato na mobitelu nikad ne ide u prvi plan.
 *
 * BREAKPOINT_WIDE mora biti ISTI kao prag na kojem `.ed-dive-band` postaje
 * trostupcani (descent.css). Bio je 900 dok je band bio 1000, i u tom prozoru
 * od sto piksela predmet je bio `front` na `z: 20` nad JEDNOSTUPCANIM
 * rasporedom — izmjereno na 960 px: prekrivao je 29 % odlomka o glini i
 * fizicki presijecao dva od tri reda po sredini rijeci.
 */
export const BREAKPOINT_WIDE = 1000
const isNarrow = () => window.innerWidth < BREAKPOINT_WIDE

const publish = () => {
  raf = 0

  /* Postaja se cita IZ ELEMENTA, ne iz rednog broja u STATIONS.
     Indeksiranje po DOM redu je vec jednom razvalilo koreografiju (vidi
     stations.ts), a s podstranicama je bilo jos gore: stranica koja renderira
     samo <Footer/> ima tocno jedan [data-station] node — „seabed" — a
     STATIONS[0] je „surface", pa se footer glumio kao povrsina i mijesao prema
     „dive": front, z 20, scale 1,15. Najagresivnija poza cijelog spusta, na
     kontakt footeru, bez ijedne greske u konzoli. */
  const marks: { el: HTMLElement; st: Station }[] = []
  for (const el of document.querySelectorAll<HTMLElement>('[data-station]')) {
    const st = stationOrNull(el.dataset.station)
    if (st) marks.push({ el, st })
  }

  if (!marks.length) {
    /* Podstranica bez postaja: predmet nema sto glumiti, a canvas ionako nije
       mount-an. Prije se ovdje radio puki `return`, pa je inline vrijednost s
       naslovnice ostajala na <html> preko client-side navigacije. */
    const root = document.documentElement
    root.style.setProperty('--amph-o', '0')
    root.style.setProperty('--amph-z', '2')
    return
  }

  const mid = window.innerHeight * 0.5
  let i = 0
  let within = 0

  for (let k = 0; k < marks.length; k++) {
    const r = marks[k].el.getBoundingClientRect()
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

  const cur = marks[i].st
  const nxt = marks[Math.min(marks.length - 1, i + 1)].st

  /* Mijesanje krece tek u zadnjoj trecini postaje: predmet mirno stoji dok se
     sekcija cita, pa se tek onda priprema za sljedecu. Bez ovoga bi se micao
     cijelo vrijeme i citao kao nemir, ne kao putovanje. */
  const t = clamp01((within - 0.62) / 0.38)

  const a = ACT[cur.act]
  const b = ACT[nxt.act]
  const narrow = isNarrow()

  /* Prigusenje na uskom ekranu je PRAVILO, ne zakon: postaja koja je slozena
     oko predmeta ga pregazi kroz `oNarrow`. Zato se vidljivost racuna po
     postaji pa se onda mijesa — a ne mijesa i onda mnozi. */
  const oFor = (st: typeof cur, act: typeof a) =>
    narrow ? (st.oNarrow ?? act.o * 0.42) : act.o

  const o = lerp(oFor(cur, a), oFor(nxt, b), t)
  const z = (t > 0.5 ? b.z : a.z) === 20 && !narrow ? 20 : 2

  state.i = i
  state.act = t > 0.5 ? nxt.act : cur.act
  state.x = lerp(cur.x, nxt.x, t) * (narrow ? 0.55 : 1)
  state.scale = lerp(cur.scale, nxt.scale, t)

  const root = document.documentElement
  root.style.setProperty('--amph-o', o.toFixed(3))
  root.style.setProperty('--amph-z', String(z))
  root.style.setProperty('--station', String(i))
}

const schedule = () => {
  if (!raf) raf = requestAnimationFrame(publish)
}

/**
 * Prisili ponovni izracun pozornice.
 *
 * Treba na CLIENT-SIDE navigaciji: `publish` visi na scroll/resize eventima, a
 * route change ne emitira ni jedan. Bez ovoga inline `--amph-o` s naslovnice
 * ostaje na <html> preko cijele podstranice — izmjereno: 1.000 na /about,
 * /wines, /news, /gallery i /contact, gdje canvas nije ni mount-an.
 */
export function syncStage() {
  schedule()
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
