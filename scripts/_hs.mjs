import { chromium } from 'playwright'
const b = await chromium.launch()
const p = await b.newPage({ viewport:{width:390,height:844} })
await p.goto('http://localhost:4200', { waitUntil:'networkidle' })
await p.waitForTimeout(3000)
const over = await p.evaluate(()=>[...document.querySelectorAll('body *')]
  .map(el=>({ r:el.getBoundingClientRect(), t:el.tagName, c:(el.className||'').toString().slice(0,56) }))
  .filter(x=>x.r.right>391)
  .map(x=>`${Math.round(x.r.right)}px  ${x.t}  [${x.c}]`))
console.log(over.slice(0,10).join('\n') || 'nema prekoracenja')
await b.close()
