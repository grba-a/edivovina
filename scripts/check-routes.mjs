/**
 * Mehanicka provjera svih ruta na dva viewporta.
 * Ovo hvata ono sto oko promasi: horizontalni scroll, elemente zaglavljene na
 * opacity 0, slike bez dimenzija, 404 na assetima, konzolne greske.
 */
import { chromium } from 'playwright'

const BASE = process.env.URL ?? 'http://localhost:4200'
const ROUTES = ['/', '/wines', '/wines/navis-mysterium-tris', '/story', '/visit', '/gallery', '/contact']
const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
]

const problems = []
const note = (m) => { problems.push(m); console.log('  ! ' + m) }

const browser = await chromium.launch()

for (const vp of VIEWPORTS) {
  console.log(`\n===== ${vp.name} ${vp.width}x${vp.height}`)
  const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } })
  const errors = []
  const bad = []
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()) })
  page.on('pageerror', (e) => errors.push('pageerror: ' + String(e)))
  page.on('response', (r) => { if (r.status() >= 400) bad.push(`${r.status()} ${r.url().replace(BASE, '')}`) })

  for (const route of ROUTES) {
    errors.length = 0
    bad.length = 0
    await page.goto(BASE + route, { waitUntil: 'networkidle' })
    await page.waitForTimeout(1800)
    // do dna pa natrag, da se svi lazy/reveal triggeri opale
    await page.evaluate(async () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      for (const f of [0.25, 0.5, 0.75, 1]) {
        const y = max * f
        window.__lenis ? window.__lenis.scrollTo(y, { immediate: true }) : window.scrollTo(0, y)
        await new Promise((r) => setTimeout(r, 320))
      }
    })
    await page.waitForTimeout(900)

    const m = await page.evaluate(() => {
      const imgs = [...document.querySelectorAll('img')]
      return {
        docW: document.documentElement.scrollWidth,
        winW: window.innerWidth,
        h1: document.querySelectorAll('h1').length,
        imgs: imgs.length,
        noDims: imgs.filter((i) => !i.getAttribute('width') || !i.getAttribute('height')).length,
        broken: imgs.filter((i) => i.complete && i.naturalWidth === 0).length,
        hidden: [...document.querySelectorAll('main *, footer *')].filter((el) => {
          const r = el.getBoundingClientRect()
          if (r.width === 0 || r.height === 0) return false
          if (r.top > window.innerHeight * 0.65 || r.bottom < 0) return false
          return parseFloat(getComputedStyle(el).opacity) < 0.02
        }).length,
        title: document.title,
      }
    })

    const flags = []
    if (m.docW > m.winW + 1) flags.push(`H-SCROLL ${m.docW}>${m.winW}`)
    if (m.h1 !== 1) flags.push(`h1 count ${m.h1}`)
    if (m.noDims) flags.push(`${m.noDims} img bez width/height`)
    if (m.broken) flags.push(`${m.broken} slomljenih img`)
    if (m.hidden) flags.push(`${m.hidden} elem. na opacity 0`)
    if (!m.title || m.title.length < 8) flags.push('nema title')
    const realErr = errors.filter((e) => !/hydrat|DevTools|cz-shortcut/i.test(e))
    if (realErr.length) flags.push(`console: ${realErr[0].slice(0, 110)}`)
    if (bad.length) flags.push(`HTTP: ${bad.slice(0, 3).join(', ')}`)

    console.log(`  ${route.padEnd(34)} ${m.imgs} img  ${flags.length ? '' : 'ok'}`)
    flags.forEach((f) => note(`${vp.name} ${route}: ${f}`))
  }
  await page.close()
}

await browser.close()
console.log(`\n${problems.length ? problems.length + ' PROBLEMA' : 'SVE CISTO'}`)
process.exit(problems.length ? 1 : 0)
