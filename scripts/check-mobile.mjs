/**
 * Mobilna provjera u PRAVOM WebKitu, ne u Chrome emulaciji.
 * Emulacija mijenja viewport i UA ali ne engine, i propusta bugove koje pravi
 * WebKit uhvati (na Lazaretima je tako prosao bug s nevidljivim tekstom).
 *
 * Mobile WebKit ne podrzava mouse.wheel — scroll ide kroz page.evaluate.
 */
import { webkit, devices } from 'playwright'

const BASE = process.env.URL ?? 'http://localhost:4200'
const ROUTES = ['/'] // rute se vracaju kad se vrati sadrzaj
const WIDTHS = [360, 390, 430]

const problems = []
const note = (m) => { problems.push(m); console.log('  ! ' + m) }

const browser = await webkit.launch()

for (const width of WIDTHS) {
  console.log(`\n===== WebKit ${width}px`)
  const ctx = await browser.newContext({
    ...devices['iPhone 13'],
    viewport: { width, height: 844 },
  })
  const page = await ctx.newPage()
  const errors = []
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()) })
  page.on('pageerror', (e) => errors.push('pageerror: ' + String(e)))

  for (const route of ROUTES) {
    errors.length = 0
    await page.goto(BASE + route, { waitUntil: 'load' })
    await page.waitForTimeout(2200)
    await page.evaluate(async () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      for (const f of [0.3, 0.6, 0.9, 1]) {
        window.scrollTo(0, max * f)
        await new Promise((r) => setTimeout(r, 300))
      }
      window.scrollTo(0, 0)
      await new Promise((r) => setTimeout(r, 300))
    })
    await page.waitForTimeout(700)

    const m = await page.evaluate(() => {
      // Filtriraj samo elemente STVARNO u kadru — sve ispod 65% legitimno
      // jos nije preslo svoj trigger i daje lazne pozitivce.
      const invisible = [...document.querySelectorAll('main *, footer *, header *')].filter((el) => {
        const r = el.getBoundingClientRect()
        if (r.width === 0 || r.height === 0) return false
        if (r.top > window.innerHeight * 0.65 || r.bottom < 0) return false
        const cs = getComputedStyle(el)
        return parseFloat(cs.opacity) < 0.02 || cs.visibility === 'hidden'
      }).map((el) => el.tagName + '.' + (el.className || '').toString().slice(0, 40))

      const tooSmall = [...document.querySelectorAll('a, button')].filter((el) => {
        const r = el.getBoundingClientRect()
        return r.width > 0 && r.height > 0 && (r.height < 40 || r.width < 40)
      }).length

      const overflowing = [...document.querySelectorAll('body *')].filter((el) => {
        const r = el.getBoundingClientRect()
        return r.right > window.innerWidth + 2 || r.left < -2
      }).length

      return {
        docW: document.documentElement.scrollWidth,
        winW: window.innerWidth,
        invisible,
        tooSmall,
        overflowing,
        h1: document.querySelector('h1')?.textContent?.slice(0, 24) ?? null,
        canvas: !!document.querySelector('canvas'),
      }
    })

    const flags = []
    if (m.docW > m.winW + 1) flags.push(`H-SCROLL ${m.docW}>${m.winW}`)
    if (m.invisible.length) flags.push(`nevidljivo u kadru: ${m.invisible.slice(0, 3).join(' | ')}`)
    if (m.tooSmall > 0) flags.push(`${m.tooSmall} tap targeta <40px`)
    if (m.overflowing > 0) flags.push(`${m.overflowing} elem. izvan sirine`)
    if (!m.h1) flags.push('nema h1')
    const real = errors.filter((e) => !/hydrat|DevTools/i.test(e))
    if (real.length) flags.push(`console: ${real[0].slice(0, 110)}`)

    console.log(`  ${route.padEnd(32)} ${flags.length ? '' : 'ok'}`)
    flags.forEach((f) => note(`${width} ${route}: ${f}`))
  }
  await ctx.close()
}

await browser.close()
console.log(`\n${problems.length ? problems.length + ' PROBLEMA' : 'WebKit CISTO'}`)
process.exit(problems.length ? 1 : 0)
