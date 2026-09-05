import { chromium } from 'playwright'
const b = await chromium.launch()
const p = await b.newPage({ viewport:{width:1440,height:900}, deviceScaleFactor:2 })
await p.goto('http://localhost:4200', { waitUntil:'networkidle' })
await p.waitForTimeout(3200)
await p.evaluate(async ()=>{ const el=document.getElementById('catalogue')
  window.scrollTo(0, el.getBoundingClientRect().top+window.scrollY-60); await new Promise(r=>setTimeout(r,900)) })
await p.waitForTimeout(900)
const m = await p.evaluate(()=>{
  const li=document.querySelector('#catalogue li')
  const r=li.getBoundingClientRect()
  const svg=li.querySelector('svg')
  const img=li.querySelector('img')
  return { plate:[Math.round(r.width),Math.round(r.height)],
           svg: svg? [Math.round(svg.getBoundingClientRect().width),Math.round(svg.getBoundingClientRect().height)]:null,
           img: img? [Math.round(img.getBoundingClientRect().width),Math.round(img.getBoundingClientRect().height)]:null,
           vh: window.innerHeight }
})
console.log('ploca', m.plate[0]+'x'+m.plate[1], '=', (m.plate[1]/m.vh*100).toFixed(0)+'% ekrana')
console.log('silueta', m.svg?.join('x'), '| fotka', m.img?.join('x'))
const li = await p.$('#catalogue li')
await li.screenshot({ path:'.shots/rec.png' })
await b.close()
