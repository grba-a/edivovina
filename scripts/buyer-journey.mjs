/**
 * Scenarij stvarnog kupca, mjeren a ne procijenjen.
 *
 * "Ana, 34. Vidjela Edivo na Instagramu, treba dar za oca. Budzet nije
 *  problem, vrijeme jest. Dolazi s mobitela, poslije provjeri na laptopu."
 *
 * Mjeri sto joj stoji na putu: koliko ekrana do prve cijene, koliko do gumba
 * za kupnju, koliko slika je vece od pola ekrana, koliko sekcija pojede cijeli
 * ekran. Sve u "ekranima", jer to je jedinica u kojoj kupac misli.
 */
import { chromium } from 'playwright'

const BASE = process.env.URL ?? 'http://localhost:4200'
const DEVICES = [
  { name: 'iPhone', width: 390, height: 844, dpr: 2 },
  { name: 'laptop', width: 1440, height: 900, dpr: 1 },
]
const STEPS = ['/', '/wines', '/wines/navis-mysterium-tris', '/story']

const problems = []
const flag = (m) => { problems.push(m); console.log('    ! ' + m) }

const browser = await chromium.launch()

for (const dev of DEVICES) {
  console.log(`\n===== ${dev.name} ${dev.width}x${dev.height}`)
  const page = await browser.newPage({
    viewport: { width: dev.width, height: dev.height },
    deviceScaleFactor: dev.dpr,
  })

  for (const route of STEPS) {
    await page.goto(BASE + route, { waitUntil: 'networkidle' })
    await page.waitForTimeout(2200)
      ? await page.waitForTimeout(2200) : null
    // prodji kroz stranicu da se lazy slike i reveali opale
    await page.evaluate(async () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      for (let f = 0; f <= 1.001; f += 0.15) {
        window.scrollTo(0, max * f)
        await new Promise((r) => setTimeout(r, 180))
      }
      window.scrollTo(0, 0)
      await new Promise((r) => setTimeout(r, 300))
    })
    await page.waitForTimeout(800)

    const m = await page.evaluate(() => {
      const vh = window.innerHeight
      const docH = document.documentElement.scrollHeight
      const y = (el) => el.getBoundingClientRect().top + window.scrollY

      // prva cijena na stranici (€ pa broj)
      const priceEl = [...document.querySelectorAll('main *, footer *')]
        .filter((el) => !el.children.length && /€\s?\d/.test(el.textContent ?? ''))
        .sort((a, b) => y(a) - y(b))[0]

      // prvi gumb koji vodi u kupnju
      const buyEl = [...document.querySelectorAll('a, button')]
        .filter((el) => /buy|take the set|reserve|take it/i.test(el.textContent ?? ''))
        .sort((a, b) => y(a) - y(b))[0]

      /* Slike unutar .ed-px su NAMJERNI full-bleed kadrovi (dva na naslovnici).
         One smiju biti velike; sve ostalo je kartica i ne smije pojesti ekran. */
      const imgs = [...document.querySelectorAll('main img, footer img')]
        .filter((i) => !i.closest('.ed-px'))
        .map((i) => ({ h: Math.round(i.getBoundingClientRect().height), src: (i.currentSrc || i.src).split('/').pop() }))
        .filter((i) => i.h > 0)

      /* Racuna se samo sekcija VELICINE EKRANA (namjerni full-screen trenutak),
         ne sekcija koja je dugacka jer ima puno sadrzaja. */
      const tallSections = [...document.querySelectorAll('main > section, main > div')]
        .map((s) => Math.round(s.getBoundingClientRect().height))
        .filter((h) => h > vh * 0.9 && h < vh * 1.15).length

      return {
        vh,
        screens: +(docH / vh).toFixed(1),
        priceY: priceEl ? Math.round(y(priceEl)) : null,
        priceText: priceEl?.textContent?.trim().slice(0, 12) ?? null,
        buyY: buyEl ? Math.round(y(buyEl)) : null,
        buyText: buyEl?.textContent?.trim().slice(0, 18) ?? null,
        maxImg: imgs.length ? Math.max(...imgs.map((i) => i.h)) : 0,
        maxImgSrc: imgs.length ? imgs.sort((a, b) => b.h - a.h)[0].src : null,
        oversized: imgs.filter((i) => i.h > vh * 0.62).length,
        tallSections,
        imgCount: imgs.length,
      }
    })

    const scr = (px) => (px == null ? '—' : (px / m.vh).toFixed(1) + ' ekrana')
    console.log(`  ${route}`)
    console.log(`    duzina ${m.screens} ekrana · prva cijena ${scr(m.priceY)} (${m.priceText ?? 'NEMA'}) · prvi buy ${scr(m.buyY)} (${m.buyText ?? 'NEMA'})`)
    console.log(`    najveca slika ${m.maxImg}px = ${(m.maxImg / m.vh * 100).toFixed(0)}% ekrana (${m.maxImgSrc}) · preko 62%: ${m.oversized}/${m.imgCount}`)

    if (m.priceY == null) flag(`${dev.name} ${route}: nema cijene na stranici`)
    else if (m.priceY / m.vh > 2.2) flag(`${dev.name} ${route}: prva cijena na ${scr(m.priceY)}`)
    if (m.buyY == null) flag(`${dev.name} ${route}: nema gumba za kupnju`)
    else if (m.buyY / m.vh > 1.2) flag(`${dev.name} ${route}: prvi buy gumb na ${scr(m.buyY)}`)
    if (m.oversized > 0) flag(`${dev.name} ${route}: ${m.oversized} slika preko 62% ekrana (najveca ${(m.maxImg / m.vh * 100).toFixed(0)}%)`)
    if (m.tallSections > 3) flag(`${dev.name} ${route}: ${m.tallSections} sekcija preko 92% ekrana`)
    if (m.screens > 10) flag(`${dev.name} ${route}: ${m.screens} ekrana duzine`)
  }
  await page.close()
}

await browser.close()
console.log(`\n${problems.length ? problems.length + ' PROBLEMA na kupcevu putu' : 'kupcev put je cist'}`)
process.exit(problems.length ? 1 : 0)
