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

export const getDescent = () => p

const publish = () => {
  raf = 0
  const doc = document.documentElement
  const max = doc.scrollHeight - window.innerHeight
  const next = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
  if (Math.abs(next - p) < 0.0002) return
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
