import { chromium } from 'playwright'
const b = await chromium.launch()
for (const [w,h,tag] of [[360,780,'360'],[390,844,'390'],[430,932,'430'],[1440,900,'d']]) {
  const p = await b.newPage({ viewport:{width:w,height:h}, deviceScaleFactor:2 })
  await p.goto('http://localhost:4200', { waitUntil:'networkidle' })
  await p.waitForTimeout(3600)
  const m = await p.evaluate(()=>{
    const btns=[...document.querySelectorAll('#surface a')].filter(a=>/buy a bottle|three lives/i.test(a.textContent||''))
    const rects=btns.map(a=>a.getBoundingClientRect())
    const sameRow = rects.length===2 && Math.abs(rects[0].top-rects[1].top)<4
    const hair=[...document.querySelectorAll('#surface *')].find(e=>/scroll to descend/i.test(e.textContent||'') && !e.children.length)
    const imgs=[...document.querySelectorAll('main img')].filter(i=>!i.closest('.ed-px'))
      .map(i=>({w:Math.round(i.getBoundingClientRect().width), parent:Math.round(i.parentElement.getBoundingClientRect().width)}))
    const narrow=imgs.filter(i=>i.parent>0 && i.w < i.parent*0.96).length
    return { sameRow, btnTops:rects.map(r=>Math.round(r.top)), hairVisible: hair? getComputedStyle(hair.closest('div')).display!=='none' : false,
             imgCount:imgs.length, narrow }
  })
  console.log(`  ${tag.padEnd(5)} gumbi u istom redu: ${m.sameRow}  tops ${JSON.stringify(m.btnTops)}  hairline vidljiv: ${m.hairVisible}  slike uze od stupca: ${m.narrow}/${m.imgCount}`)
  await p.screenshot({ path:`.shots/h-${tag}.png` })
  await p.close()
}
await b.close()
