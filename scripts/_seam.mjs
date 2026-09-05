import { chromium } from 'playwright'
const b = await chromium.launch()
const p = await b.newPage({ viewport:{width:1440,height:900}, deviceScaleFactor:1 })
await p.goto('http://localhost:4200/wines/navis-mysterium-tris', { waitUntil:'networkidle' })
await p.waitForTimeout(2600)
// VIEWPORT snimka na poziciji gdje je agent vidio "sav" (y~900 u full-page snimci)
await p.evaluate(async ()=>{ window.scrollTo(0,700); await new Promise(r=>setTimeout(r,700)) })
await p.waitForTimeout(700)
await p.screenshot({ path:'.shots/seam-viewport.png' })
// i full-page, za usporedbu
await p.evaluate(()=>window.scrollTo(0,0)); await p.waitForTimeout(500)
await p.screenshot({ path:'.shots/seam-fullpage.png', fullPage:true })
const info = await p.evaluate(()=>{
  const w=document.querySelector('.ed-water'); const cs=getComputedStyle(w)
  return { pos:cs.position, descent:getComputedStyle(document.documentElement).getPropertyValue('--descent').trim(),
           before:getComputedStyle(w,'::before').opacity, after:getComputedStyle(w,'::after').opacity }
})
console.log('ed-water:', JSON.stringify(info))
await b.close()
