import { chromium } from 'playwright'
const b = await chromium.launch()
for (const [w,h,tag] of [[390,844,'mobitel'],[1440,900,'desktop']]) {
  const p = await b.newPage({ viewport:{width:w,height:h}, deviceScaleFactor:1 })
  for (const route of ['/','/wines','/story','/visit']) {
    await p.goto('http://localhost:4200'+route, { waitUntil:'networkidle' })
    await p.waitForTimeout(2600)
    await p.evaluate(async ()=>{ const max=document.documentElement.scrollHeight-window.innerHeight
      for(let f=0;f<=1;f+=0.2){ window.scrollTo(0,max*f); await new Promise(r=>setTimeout(r,180)) } })
    await p.waitForTimeout(600)
    const bad = await p.evaluate(()=>[...document.querySelectorAll('main img')]
      .filter(i=>!i.closest('.ed-px'))
      .map(i=>({ src:(i.currentSrc||i.src).split('/').pop(), iw:Math.round(i.getBoundingClientRect().width),
                 pw:Math.round(i.parentElement.getBoundingClientRect().width),
                 cls:(i.className||'').toString().slice(0,52) }))
      .filter(x=>x.pw>0 && x.iw < x.pw*0.96))
    if (bad.length) { console.log(`\n${tag} ${route}`); bad.forEach(x=>console.log(`  ${x.iw}/${x.pw}px  ${x.src}  [${x.cls}]`)) }
  }
  await p.close()
}
await b.close()
