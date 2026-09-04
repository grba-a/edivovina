/**
 * Mjeri sto mobilni korisnik STVARNO skine, i LCP.
 * Bez ovoga se "optimizirano za mobitel" temelji na nadi.
 */
import { chromium } from 'playwright'

const BASE = process.env.URL ?? 'http://localhost:4200'
const ROUTES = ['/', '/wines', '/wines/navis-mysterium-tris', '/story']

const browser = await chromium.launch()
for (const route of ROUTES) {
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    userAgent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  })
  const page = await ctx.newPage()
  const byType = {}
  let total = 0
  page.on('response', async (r) => {
    try {
      const h = r.headers()
      const len = Number(h['content-length'] ?? 0)
      if (!len) return
      const ct = (h['content-type'] ?? '').split(';')[0]
      const k = ct.includes('image') ? 'image' : ct.includes('javascript') ? 'js'
        : ct.includes('css') ? 'css' : ct.includes('font') ? 'font'
        : ct.includes('html') ? 'html' : 'other'
      byType[k] = (byType[k] ?? 0) + len
      total += len
    } catch {}
  })

  await page.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 90000 })
  await page.waitForTimeout(4500)

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
