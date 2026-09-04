// Skida originale iz Edivove medijateke u .cache/raw/ (netaknuti, iz njih se gradira).
// Tolerira 404 — probava plain / -scaled i .jpg / .png varijante za svaki kandidat.
import { mkdir, writeFile, readdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'

const BASE = 'https://www.edivovina.hr/wp-content/uploads/2021/04/'
const OUT = new URL('../.cache/raw/', import.meta.url).pathname

const range = (n, from = 1) => Array.from({ length: n }, (_, i) => i + from)
const SETS = {
  'proizvodnja': range(43),
  'vinarija': range(18),
  'FP': range(73),
  'PONMA': range(15),
  'ispod-mora': range(9),
  'UTS': range(6),
}

const candidates = (set, n) => {
  const stem = `${set}-${n}`
  return [`${stem}.jpg`, `${stem}.png`, `${stem}-scaled.jpg`, `${stem}-scaled.png`]
}

async function grab(set, n) {
  const local = `${set}-${String(n).padStart(2, '0')}`
  for (const ext of ['jpg', 'png']) {
    if (existsSync(`${OUT}${local}.${ext}`)) return { skip: true }
  }
  for (const cand of candidates(set, n)) {
    let res
    try {
      res = await fetch(BASE + cand, { headers: { 'User-Agent': 'Mozilla/5.0' } })
    } catch { continue }
    if (!res.ok) continue
    const buf = Buffer.from(await res.arrayBuffer())
    if (buf.length < 4096) continue
    // WP vrati 200 + HTML soft-404 za nepostojeci media URL. Vjeruj magic bytesima, ne statusu.
    const jpg = buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff
    const png = buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47
    if (!jpg && !png) continue
    const ext = png ? 'png' : 'jpg'
    await writeFile(`${OUT}${local}.${ext}`, buf)
    return { ok: true, bytes: buf.length, from: cand }
  }
  return { miss: true }
}

await mkdir(OUT, { recursive: true })

const jobs = Object.entries(SETS).flatMap(([set, ns]) => ns.map((n) => ({ set, n })))
let ok = 0, miss = 0, skip = 0, bytes = 0
const CONC = 8

async function worker(queue) {
  while (queue.length) {
    const job = queue.shift()
    const r = await grab(job.set, job.n)
    if (r.ok) { ok++; bytes += r.bytes }
    else if (r.skip) skip++
    else { miss++; process.stdout.write(`  miss ${job.set}-${job.n}\n`) }
  }
}

const queue = [...jobs]
await Promise.all(range(CONC).map(() => worker(queue)))

const files = (await readdir(OUT)).filter((f) => /\.(jpg|png)$/i.test(f))
console.log(`\nskinuto ${ok}, preskoceno ${skip}, nema ${miss}`)
console.log(`u .cache/raw/: ${files.length} datoteka, ${(bytes / 1048576).toFixed(1)} MB novo`)
