import { chromium } from 'playwright'
const b = await chromium.launch()
for (const [w,h,tag] of [[1440,900,'d'],[390,844,'m']]) {
  const p = await b.newPage({ viewport:{width:w,height:h}, deviceScaleFactor:2 })
  await p.goto('http://localhost:4200', { waitUntil:'networkidle' })
  await p.waitForTimeout(3000)
  await p.evaluate(async ()=>{
    const el=document.getElementById('proof'); if(!el) return
    window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 40)
    await new Promise(r=>setTimeout(r,900))
  })
  await p.waitForTimeout(1100)
  const box = await p.evaluate(()=>{ const el=document.getElementById('proof'); const r=el.getBoundingClientRect(); return {y:Math.max(0,Math.round(r.top)), h:Math.round(Math.min(r.height, window.innerHeight-Math.max(0,r.top)))} })
  await p.screenshot({ path:`.shots/aw-${tag}.png`, clip:{x:0,y:box.y,width:w,height:box.h} })
  await p.close()
}
console.log('ok')
await b.close()
