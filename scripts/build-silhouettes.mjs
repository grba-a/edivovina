/**
 * Mjerene siluete iz ISTIH krivulja koje koristi 3D model.
 *
 * Emitira staticne SVG putanje u src/data/silhouettes.ts, pa `three` ne ulazi u
 * bundle stranice — a crtez je dokazano isti objekt koji pada u pozadini.
 */
import { writeFileSync } from 'node:fs'
import * as THREE from 'three'

/* --- amfora: isti kljucni profil kao src/components/bottle/amphora.ts --- */
const AMPH_KEY = [
  [0.004, 0.0], [0.085, 0.11], [0.19, 0.30], [0.315, 0.60], [0.425, 0.95],
  [0.50, 1.28], [0.54, 1.56], [0.535, 1.84], [0.495, 2.08], [0.415, 2.30],
  [0.315, 2.46], [0.235, 2.57], [0.198, 2.64], [0.192, 2.74], [0.246, 2.80],
  [0.248, 2.855], [0.196, 2.875], [0.185, 2.92], [0.16, 2.98], [0.004, 3.0],
]
const AMPH_HANDLE = [
  [0.2, 2.70], [0.42, 2.67], [0.555, 2.45], [0.53, 2.17], [0.455, 2.02],
]

/* --- boca: bordeaux profil iz src/components/bottle/profile.ts --- */
const R_BODY = 0.375, R_NECK = 0.14, Y_SH = 1.72, Y_NECK = 2.4
const BOTTLE_KEY = (() => {
  const p = [[0.002, 0], [R_BODY * 0.72, 0], [R_BODY, 0.07], [R_BODY, Y_SH]]
  for (let i = 1; i <= 14; i++) {
    const t = i / 14, mt = 1 - t
    p.push([
      mt * mt * R_BODY + 2 * mt * t * R_BODY * 0.94 + t * t * R_NECK,
      mt * mt * Y_SH + 2 * mt * t * (Y_SH + 0.46) + t * t * Y_NECK,
    ])
  }
  p.push([R_NECK, 2.84], [R_NECK * 1.16, 2.87], [R_NECK * 1.16, 2.95], [R_NECK * 0.99, 2.98], [0.002, 3.0])
  return p
})()

const VB = 100 // sirina viewBoxa; visina se izracuna iz odnosa

function smooth(key, segments) {
  const curve = new THREE.SplineCurve(key.map(([x, y]) => new THREE.Vector2(x, y)))
  return curve.getPoints(segments).map((p) => [Math.max(0.002, p.x), p.y])
}

/**
 * Zatvorena silueta: gore desnom stranom, dolje zrcaljenom lijevom.
 * `widest` mora ukljuciti i rucke — one se izbocuju sire od tijela i inace se
 * klipaju na rubu viewBoxa. PAD ostavlja mjesto debljini linije.
 */
const PAD = 3
function outline(points, height, widest) {
  const maxR = widest ?? Math.max(...points.map((p) => p[0]))
  const s = (VB * 0.5 - PAD) / maxR // jedna skala za oba smjera — crtez je mjeren
  const H = height * s
  const X = (r) => (50 + r * s).toFixed(2)
  const Y = (y) => (H - y * s).toFixed(2)
  const sx = s
  const sy = s

  const right = points.map((p, i) => `${i ? 'L' : 'M'}${X(p[0])} ${Y(p[1])}`).join('')
  const left = [...points].reverse().map((p) => `L${X(-p[0])} ${Y(p[1])}`).join('')
  return { d: right + left + 'Z', height: +H.toFixed(2), sx, sy, X, Y }
}

function handlePath(key, o) {
  const curve = new THREE.SplineCurve(key.map(([x, y]) => new THREE.Vector2(x, y)))
  const pts = curve.getPoints(28)
  const r = pts.map((p, i) => `${i ? 'L' : 'M'}${o.X(p.x)} ${o.Y(p.y)}`).join('')
  const l = pts.map((p, i) => `${i ? 'L' : 'M'}${o.X(-p.x)} ${o.Y(p.y)}`).join('')
  return [r, l]
}

const amphPts = smooth(AMPH_KEY, 120)
// rucke idu do 0,555 — sire od tijela (0,54)
const amph = outline(amphPts, 3.0, 0.565)
const [hR, hL] = handlePath(AMPH_HANDLE, amph)

const botPts = smooth(BOTTLE_KEY, 110)
const bot = outline(botPts, 3.0)

const out = `// GENERIRANO — scripts/build-silhouettes.mjs. Ne uredivati rucno.
//
// Mjerene siluete iz ISTIH krivulja koje koristi 3D model
// (src/components/bottle/amphora.ts i profile.ts), pa je crtez na plocici
// dokazano isti objekt koji pada u pozadini. Staticne putanje znace da three
// ne ulazi u bundle stranice.

export type Silhouette = {
  /** viewBox "0 0 w h" */
  viewBox: string
  /** vanjska kontura, fill */
  d: string
  /** dodatne linije, stroke (rucke amfore) */
  lines?: string[]
  /** stvarna visina objekta u mm, za polje zapisa */
  mm: { h: number; d: number }
}

export const AMPHORA: Silhouette = {
  viewBox: '0 0 ${VB} ${amph.height}',
  d: '${amph.d}',
  lines: ['${hR}', '${hL}'],
  mm: { h: 300, d: 108 },
}

export const BOTTLE: Silhouette = {
  viewBox: '0 0 ${VB} ${bot.height}',
  d: '${bot.d}',
  mm: { h: 300, d: 75 },
}

export const SILHOUETTES = { amphora: AMPHORA, bottle: BOTTLE } as const
export type SilhouetteName = keyof typeof SILHOUETTES
`
writeFileSync(new URL('../src/data/silhouettes.ts', import.meta.url).pathname, out)
console.log(`amfora: ${amph.d.length} znakova putanje, viewBox 0 0 ${VB} ${amph.height}`)
console.log(`boca:   ${bot.d.length} znakova putanje, viewBox 0 0 ${VB} ${bot.height}`)
console.log('-> src/data/silhouettes.ts')
