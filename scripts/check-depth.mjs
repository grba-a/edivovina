/**
 * SPUST — mjeri, ne gleda.
 *
 * Tri stvari koje oko ne vidi i koje prolaze i build i tsc:
 *   1. Je li svaka stranica unutar SVOG pojasa dubine (a podstranica nikad na 1.0).
 *   2. Ostaju li --descent / --amph-o ustajali preko CLIENT-SIDE navigacije.
 *      Inline stilovi na <html> prezive route change; ovo je jedini nacin da se
 *      taj kvar uhvati.
 *   3. Pojavljuje li se koordinata dubine tocno jednom po stranici.
 *
 * Skrola KROZ Lenis: nativni scrollTo ga raspara i spust izgleda zamrznut.
 * Browser pane ovo ne moze provjeriti — tamo je document.hidden === true, pa
 * requestAnimationFrame nikad ne otkuca, a cijeli sustav je na rAF-u.
 */
import { chromium } from 'playwright'

const BASE = process.env.URL ?? 'http://localhost:4200'

/** [ruta, ocekivana dubina u metrima ili null za cijeli zaron] */
const PAGES = [
  ['/', null],
  ['/visit', 0],
  ['/about', 6],
  ['/wines', 12],
  ['/wines/undersea', 12],
  ['/product/navis-mysterium-undersea-amphora', 12],
  ['/news', 18],
  ['/gallery', 22],
  ['/contact', 25],
]

const MAX_M = 25
const DRIFT_M = 2
const problems = []
const note = (m) => { problems.push(m); console.log('  ! ' + m) }
const f3 = (n) => (n === null ? 'null' : n.toFixed(3))

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
page.on('pageerror', (e) => note('pageerror: ' + String(e)))

const read = () =>
  page.evaluate(() => {
    const cs = getComputedStyle(document.documentElement)
    const num = (k) => {
      const v = cs.getPropertyValue(k).trim()
      return v === '' ? null : Number(v)
    }
    return {
      d: num('--descent'),
      o: num('--amph-o'),
      z: num('--amph-z'),
      scrollY: Math.round(window.scrollY),
      max: Math.round(document.documentElement.scrollHeight - window.innerHeight),
    }
  })

/** Skrola kroz Lenis ako postoji, pa ceka nekoliko rAF-ova da se publish slegne. */
const scrollTo = async (y) => {
  await page.evaluate((target) => {
    const l = window.__lenis
    if (l) l.scrollTo(target, { immediate: true })
    else window.scrollTo(0, target)
  }, y)
  await page.evaluate(
    () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(r, 60)))),
  )
}

for (const [route, m] of PAGES) {
  console.log(`\n===== ${route}   ${m === null ? 'cijeli zaron 0 -> 25 m' : `${m} m -> ${m + DRIFT_M} m`}`)
  await page.goto(BASE + route, { waitUntil: 'networkidle' })
  await scrollTo(0)

  const top = await read()
  const { max } = top
  await scrollTo(max)
  const bottom = await read()
  await scrollTo(Math.round(max / 2))
  const mid = await read()

  console.log(`  visina ${max}px   top d=${f3(top.d)}  mid d=${f3(mid.d)}  dno d=${f3(bottom.d)}`)

  // --- 1. pojas dubine
  if (m === null) {
    if (top.d > 0.001) note(`naslovnica ne pocinje na povrsini: ${f3(top.d)}`)
    if (bottom.d < 0.999) note(`naslovnica ne stize do dna: ${f3(bottom.d)}`)
  } else {
    const lo = m / MAX_M
    const hi = Math.min(1, (m + DRIFT_M) / MAX_M)
    if (Math.abs(top.d - lo) > 0.004) note(`${route} pocinje na ${f3(top.d)}, treba ${f3(lo)} (${m} m)`)
    if (Math.abs(bottom.d - hi) > 0.004) note(`${route} zavrsava na ${f3(bottom.d)}, treba ${f3(hi)}`)
    /* Postaja na dnu (25 m) LEGITIMNO stoji na 1.0 — ispod dna nema nista. */
    if (m < MAX_M && bottom.d >= 0.999) note(`${route} SPUZNULA NA DNO (d=${f3(bottom.d)}) — raspon ne radi`)
  }

  // --- 2. monotonost: dubina samo raste
  if (!(top.d <= mid.d + 0.001 && mid.d <= bottom.d + 0.001)) {
    note(`${route} dubina nije monotona: ${f3(top.d)} -> ${f3(mid.d)} -> ${f3(bottom.d)}`)
  }

  // --- 3. koordinata tocno jednom
  const coords = await page.evaluate(() =>
    [...document.querySelectorAll('.ed-depth-no')].map((e) => e.textContent.trim()),
  )
  const dupes = coords.filter((c, i) => coords.indexOf(c) !== i)
  if (dupes.length) note(`${route} koordinata se ponavlja: ${dupes.join(', ')}`)
  console.log(`  koordinate: ${coords.length ? coords.join(' · ') : '(nema)'}`)

  // --- 4. 3D samo na naslovnici
  const glb = []
  const onResp = (r) => { if (r.url().endsWith('.glb')) glb.push(r.url().split('/').pop()) }
  page.on('response', onResp)
  await page.reload({ waitUntil: 'networkidle' })
  await page.evaluate(() => new Promise((r) => setTimeout(r, 1400))) // canvas je odgodjen
  page.off('response', onResp)
  const wantsGlb = route === '/'
  if (wantsGlb && !glb.length) note('naslovnica nije ucitala .glb')
  if (!wantsGlb && glb.length) note(`${route} ucitava 3D koji joj ne treba: ${glb.join(', ')}`)
  console.log(`  3D: ${glb.length ? glb.join(', ') : 'nema'}${wantsGlb ? ' (treba)' : ' (ne treba)'}`)
}

// --- 5. CLIENT-SIDE NAVIGACIJA: ustajale varijable
if (PAGES.length > 1) {
  console.log('\n===== client-side navigacija (bez reloada)')
  await page.goto(BASE + '/', { waitUntil: 'networkidle' })
  await scrollTo(await page.evaluate(() => document.documentElement.scrollHeight))
  const atBottom = await read()
  console.log(`  naslovnica, dno: d=${f3(atBottom.d)} o=${f3(atBottom.o)}`)

  for (const [route, m] of PAGES.slice(1)) {
    /* Kategorija i proizvod nisu linkani s naslovnice — dodji s /wines. */
    const from = route.startsWith('/wines/') || route.startsWith('/product/') ? '/wines' : '/'
    if (new URL(page.url()).pathname !== from) {
      await page.goto(BASE + from, { waitUntil: 'networkidle' })
    }
    const ok = await page.evaluate(async (r) => {
      const a = [...document.querySelectorAll('a[href]')].find((x) => new URL(x.href).pathname === r)
      if (!a) return false
      a.click()
      return true
    }, route)
    if (!ok) { note(`nema linka na ${route} — ne mogu testirati client-side navigaciju`); continue }
    await page.waitForURL('**' + route, { timeout: 5000 }).catch(() => {})
    await scrollTo(0)
    const s = await read()
    const lo = m / MAX_M
    console.log(`  -> ${route}: d=${f3(s.d)} (treba ${f3(lo)})  o=${f3(s.o)}`)
    if (Math.abs(s.d - lo) > 0.004) note(`USTAJALI --descent nakon navigacije na ${route}: ${f3(s.d)} umjesto ${f3(lo)}`)
    if (s.o !== null && s.o > 0.001) note(`USTAJALI --amph-o na ${route}: ${f3(s.o)} — canvas nije mount-an, mora biti 0`)

  }
}

await browser.close()
console.log(problems.length ? `\n${problems.length} PROBLEMA` : '\nSVE CISTO')
process.exit(problems.length ? 1 : 0)
