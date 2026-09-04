import { chromium } from 'playwright'
const b = await chromium.launch()
const W=Number(process.env.W??1440), H=Number(process.env.H??900)
const p = await b.newPage({ viewport:{width:W,height:H}, deviceScaleFactor:1 })
const route=process.env.R??'/'
await p.goto('http://localhost:4200'+route, { waitUntil:'networkidle' })
await p.waitForTimeout(3200)
// prodji kroz stranicu pa snimi trake
await p.evaluate(async ()=>{
  const max=document.documentElement.scrollHeight-window.innerHeight
  for(let f=0;f<=1.001;f+=0.12){ window.scrollTo(0,max*f); await new Promise(r=>setTimeout(r,200)) }
})
await p.waitForTimeout(600)
const Hh=await p.evaluate(()=>document.documentElement.scrollHeight)
const tag=process.env.TAG??'p'
let i=0
for(let y=0;y<Hh;y+=H){
  await p.evaluate(async yy=>{ window.scrollTo(0,yy); await new Promise(r=>setTimeout(r,400)) }, y)
  await p.waitForTimeout(500)
  await p.screenshot({ path:`.shots/${tag}-${String(i++).padStart(2,'0')}.png` })
}
console.log(route, 'H='+Hh, 'traka='+i)
await b.close()
