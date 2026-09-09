/**
 * Jedan izvor istine za spust.
 *
 * Objavljuje normalizirani p (0 = povrsina, 1 = dno) na dva nacina:
 *   1. --descent na <html>  -> boja vode, snopovi, snijeg, dno, dubinomjer (CISTI CSS)
 *   2. 'descent' CustomEvent -> WebGL boca i brojke
 *
 * NAMJERNO bez ScrollTriggera: p je puki scroll-progress, a Lenis ga vec izgladi.
 * Zbog toga se ovo prenosi u Breakdance kao jedan Code Block. GSAP ScrollTrigger
 * ostaje samo za section reveale, gdje stvarno treba trigger po elementu.
 */

export type DescentDetail = { p: number }

let p = 0
let raf = 0
let started = false

/**
 * RASPON. Scroll-progress stranice (0..1) mapira se na `base + t * span`.
 *
 * Naslovnica je cijeli zaron: base 0, span 1. Podstranica stoji na SVOJOJ dubini i
 * plovi jos ~2 m — npr. Wines je 12 m, dakle base 0,48 i span 0,08.
 *
 * Bez ovoga je `--descent` bio puki scroll cijelog dokumenta, pa je kratka
 * kontakt stranica stiskala cijelih 25 metara u dva ekrana: toplo svjetlo umre na
 * 0,28, snopovi na 0,87, a dno se otvori na 0,88 — sve unutar jednog flika misa.
 */
let base = 0
let span = 1
/** Prvi publish nakon promjene raspona mora proci kroz prag od 0,0002. */
let dirty = true

export const getDescent = () => p

export function setRange(nextBase: number, nextSpan: number) {
  if (nextBase === base && nextSpan === span) return
  base = nextBase
  span = nextSpan
  dirty = true
  schedule()
}

const publish = () => {
  raf = 0
  const doc = document.documentElement
  const max = doc.scrollHeight - window.innerHeight
  const t = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
  const next = Math.min(1, Math.max(0, base + t * span))
  if (!dirty && Math.abs(next - p) < 0.0002) return
  dirty = false
  p = next
  doc.style.setProperty('--descent', p.toFixed(5))
  window.dispatchEvent(new CustomEvent<DescentDetail>('descent', { detail: { p } }))
}

const schedule = () => {
  if (!raf) raf = requestAnimationFrame(publish)
}

export function startDescent() {
  if (started) return () => {}
  started = true

  window.addEventListener('scroll', schedule, { passive: true })
  window.addEventListener('resize', schedule, { passive: true })
  // Lenis emitira svoj scroll event; oba vode na isti rAF pa se ne dupliciraju.
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
