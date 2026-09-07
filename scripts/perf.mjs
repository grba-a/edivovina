/**
 * Mjeri sto mobilni korisnik STVARNO skine, i LCP.
 * Bez ovoga se "optimizirano za mobitel" temelji na nadi.
 */
import { chromium } from 'playwright'

const BASE = process.env.URL ?? 'http://localhost:4200'
const ROUTES = ['/'] // rute se vracaju kad se vrati sadrzaj

const browser = await chromium.launch()
for (const route of ROUTES) {
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    userAgent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  })
  const page = await ctx.newPage()

  await page.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 90000 })
  await page.waitForTimeout(4500)

  /* Payload se cita iz PerformanceResourceTiming.transferSize, ne iz
     `content-length` iz response headera.

     Vercel servira JS, CSS i HTML brotli-streamano BEZ content-lengtha, pa je
     prijasnje mjerenje te zahtjeve tiho preskakalo i prijavljivalo „js 4 KB"
     na bundleu od preko 400 KB. Mjerilo kojem ne mozes vjerovati je gore od
     nikakvog — po njemu je stranica godinama bila „unutar budzeta".

     BUDZET, iskreno: 600 KB se NE moze ispuniti s WebGL predmetom na stranici
     (js chunk za three je sam ~440 KB, glb 286 KB). Ono sto ima smisla mjeriti
     je KRITICNI PUT — html + css + fontovi + slike koje se ucitavaju odmah —
     dok se 3D racuna zasebno jer se montira nakon prvog painta.
     Kriticni put: <= 600 KB · odgodeni 3D sloj: <= 800 KB. */
  const { byType, total } = await page.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0]
    const out = {}
    let sum = nav?.transferSize ?? 0
    if (sum) out.html = sum
    for (const e of performance.getEntriesByType('resource')) {
      const n = e.transferSize || 0
      if (!n) continue
      const u = e.name
      const k =
        /\.(webp|png|jpe?g|avif|svg)(\?|$)/i.test(u) ? 'image'
        : /\.(js|mjs)(\?|$)/i.test(u) || e.initiatorType === 'script' ? 'js'
        : /\.css(\?|$)/i.test(u) || e.initiatorType === 'css' ? 'css'
        : /\.woff2?(\?|$)/i.test(u) ? 'font'
        : /\.glb(\?|$)/i.test(u) ? 'model'
        : 'other'
      out[k] = (out[k] ?? 0) + n
      sum += n
    }
    return { byType: out, total: sum }
  })

  const vitals = await page.evaluate(
    () =>
      new Promise((res) => {
        const out = { lcp: 0, cls: 0, lcpEl: '' }
        try {
          new PerformanceObserver((l) => {
            for (const e of l.getEntries()) {
              out.lcp = Math.round(e.startTime)
              out.lcpEl = (e.element?.tagName ?? '') + '.' + (e.element?.className ?? '').toString().slice(0, 28)
            }
          }).observe({ type: 'largest-contentful-paint', buffered: true })
          new PerformanceObserver((l) => {
            for (const e of l.getEntries()) if (!e.hadRecentInput) out.cls += e.value
          }).observe({ type: 'layout-shift', buffered: true })
        } catch {}
        setTimeout(() => res({ ...out, cls: Math.round(out.cls * 1000) / 1000 }), 1200)
      }),
  )

  const kb = (n) => Math.round(n / 1024)
  console.log(`\n${route}`)
  console.log(`  ukupno ${kb(total)} KB  |  ${Object.entries(byType).map(([k, v]) => `${k} ${kb(v)}`).join('  ')}`)
  console.log(`  LCP ${vitals.lcp} ms (${vitals.lcpEl})  CLS ${vitals.cls}`)
  await ctx.close()
}
await browser.close()
