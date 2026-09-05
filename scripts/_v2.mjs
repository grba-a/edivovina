import { chromium } from 'playwright'
const b = await chromium.launch()
const W=Number(process.env.W??1440), H=Number(process.env.H??900)
const p = await b.newPage({ viewport:{width:W,height:H}, deviceScaleFactor:1 })
p.on('pageerror', e=>console.log('PAGEERROR:', String(e).slice(0,220)))
p.on('console', m=>{ if(m.type()==='error'&&!/hydrat/i.test(m.text())) console.log('ERR:', m.text().slice(0,220)) })
await p.goto('http://localhost:4200', { waitUntil:'networkidle' })
await p.waitForTimeout(3600)
await p.evaluate(async ()=>{ const max=document.documentElement.scrollHeight-window.innerHeight
  for(let f=0;f<=1.001;f+=0.1){ window.scrollTo(0,max*f); await new Promise(r=>setTimeout(r,220)) } })
await p.waitForTimeout(700)
const Hh=await p.evaluate(()=>document.documentElement.scrollHeight)
console.log('scrollHeight', Hh, '=', (Hh/H).toFixed(1), 'ekrana')
const tag=process.env.TAG??'v2'
let i=0
for(let y=0;y<Hh;y+=H){
  await p.evaluate(async yy=>{ window.scrollTo(0,yy); await new Promise(r=>setTimeout(r,420)) }, y)
  await p.waitForTimeout(520)
  await p.screenshot({ path:`.shots/${tag}-${String(i++).padStart(2,'0')}.png` })
}
console.log('traka', i)
await b.close()
