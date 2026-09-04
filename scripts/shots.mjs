/**
 * Vizualna + MEHANICKA provjera spusta.
 *
 * Lokalni Playwright, ne MCP: MCP zakljuca Chrome profil dok je Browser pane
 * otvoren. I browser-pane screenshot je pouzdan samo na scrollY = 0 — nakon
 * programatskog skrola vraca praznu podlogu iako je DOM ispravan.
 *
 * Skrola KROZ Lenis (window.__lenis). Native window.scrollTo raspara Lenis
 * i ScrollTrigger pa pinnane sekcije izgledaju kao prazan prostor.
 */
import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'

const TARGET = process.env.URL ?? 'http://localhost:4200'
const OUT = new URL('../.shots/', import.meta.url).pathname
const STOPS = [0, 0.14, 0.3, 0.46, 0.62, 0.78, 0.9, 1]
const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
]

await mkdir(OUT, { recursive: true })
const browser = await chromium.launch()
const problems = []
const note = (m) => { problems.push(m); console.log('  ! ' + m) }

for (const vp of VIEWPORTS) {
  const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 1 })
  const errors = []
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()) })
  page.on('pageerror', (e) => errors.push(String(e)))

  await page.goto(TARGET, { waitUntil: 'networkidle' })
  // Slike se jos dekodiraju odmah nakon navigacije; hero ispadne crn.
  await page.waitForTimeout(2500)

  console.log(`\n== ${vp.name} ${vp.width}x${vp.height}`)

  // Skrivena kartica zamrzne rAF -> GSAP/R3F stoje i snimka je crna.
  const vis = await page.evaluate(() => document.visibilityState)
  if (vis !== 'visible') note(`${vp.name}: document.visibilityState = ${vis}`)

  const hasWebGL = await page.evaluate(() => !!document.querySelector('canvas'))
  if (!hasWebGL) note(`${vp.name}: nema canvasa — boca se nije montirala`)

  let prevDescent = -1
  for (const stop of STOPS) {
    await page.evaluate(async (t) => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const y = max * t
      const lenis = window.__lenis
      if (lenis) lenis.scrollTo(y, { immediate: true })
      else window.scrollTo(0, y)
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))
    }, stop)
    await page.waitForTimeout(650)

    const m = await page.evaluate(() => {
      const cs = getComputedStyle(document.documentElement)
      const descent = parseFloat(cs.getPropertyValue('--descent')) || 0
      const gauge = document.querySelector('.ed-gauge-fill')
      const hidden = [...document.querySelectorAll('main *, footer *')].filter((el) => {
        const r = el.getBoundingClientRect()
        if (r.height === 0 || r.width === 0) return false
        // Sve ispod 65% viewporta legitimno jos nije preslo svoj trigger.
        if (r.top > window.innerHeight * 0.65 || r.bottom < 0) return false
        return parseFloat(getComputedStyle(el).opacity) < 0.02
      }).length
      return {
        descent,
        gaugeH: gauge ? getComputedStyle(gauge).height : null,
        hidden,
        docW: document.documentElement.scrollWidth,
        winW: window.innerWidth,
      }
    })

    if (m.descent < prevDescent - 0.001) note(`${vp.name} @${stop}: --descent pao (${prevDescent} -> ${m.descent})`)
    prevDescent = m.descent
    if (Math.abs(m.descent - stop) > 0.06) note(`${vp.name} @${stop}: --descent = ${m.descent.toFixed(3)}`)
    if (m.docW > m.winW + 1) note(`${vp.name} @${stop}: horizontalni scroll ${m.docW} > ${m.winW}`)
    if (m.hidden > 0) note(`${vp.name} @${stop}: ${m.hidden} elem. zaglavljeno na opacity 0 u kadru`)

    await page.screenshot({ path: `${OUT}${vp.name}-${String(Math.round(stop * 100)).padStart(3, '0')}.png` })
    process.stdout.write(`  @${String(stop).padEnd(5)} descent=${m.descent.toFixed(3)} gauge=${m.gaugeH}\n`)
  }

  // h1 ne smije biti razlomljen u previse redova
  const h1 = await page.evaluate(() => {
    const el = document.querySelector('h1')
    if (!el) return null
    const cs = getComputedStyle(el)
    const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.2
    return { lines: Math.round(el.getBoundingClientRect().height / lh), text: el.textContent?.slice(0, 40) }
  })
  if (h1) console.log(`  h1: ${h1.lines} reda`)
  if (h1 && h1.lines > 3) note(`${vp.name}: h1 ima ${h1.lines} reda`)

  const glLost = await page.evaluate(() => {
    const c = document.querySelector('canvas')
    if (!c) return 'nema canvasa'
    const gl = c.getContext('webgl2') || c.getContext('webgl')
    return gl ? (gl.isContextLost() ? 'IZGUBLJEN' : 'ok') : 'nema konteksta'
  })
  console.log(`  webgl: ${glLost}`)
  if (glLost === 'IZGUBLJEN') note(`${vp.name}: WebGL context izgubljen`)

  const real = errors.filter((e) => !/favicon|Download the React DevTools/i.test(e))
  if (real.length) real.slice(0, 5).forEach((e) => note(`${vp.name} console: ${e.slice(0, 140)}`))

  await page.close()
}

await browser.close()
console.log(`\n${problems.length ? problems.length + ' PROBLEMA' : 'cisto'} — snimke u .shots/`)
process.exit(problems.length ? 1 : 0)
