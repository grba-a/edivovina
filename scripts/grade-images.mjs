// Jedan color grade preko svih 164 fotke -> jedan set, ne upload folder.
// PRAVILO: gradiraj u PUNOJ velicini, resize TEK POSLIJE.
// sharp primjenjuje resize prije composite -> grade().resize() pukne na
// "Image to composite must have same dimensions".
import sharp from 'sharp'
import { readdir, mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const RAW = new URL('../.cache/raw/', import.meta.url).pathname
const OUT = new URL('../public/img/', import.meta.url).pathname
const WIDTHS = [420, 640, 840, 1240, 1600]

// Jedan grade ne znaci jedni parametri. Podvodni setovi trebaju jaci warm i
// cyan-kill da bi USLI U ISTI SET kao suhe fotke. To je balans bijele, ne drugi look.
const PROFILES = {
  'ispod-mora': { sat: 0.80, bright: 1.05, lin: [0.94, 8], wb: [[1.34, -0.08, -0.06], [-0.03, 1.02, -0.05], [-0.02, -0.06, 0.96]] },
  'UTS':        { sat: 0.78, bright: 1.04, lin: [0.94, 8], wb: [[1.30, -0.07, -0.05], [-0.03, 1.02, -0.04], [-0.02, -0.05, 0.95]] },
  'proizvodnja':{ sat: 0.72, bright: 1.02, lin: [0.93, 9], wb: [[1.05, 0.00, -0.01], [0.00, 1.00, 0.00], [0.00, -0.02, 0.95]] },
  'FP':         { sat: 0.72, bright: 1.02, lin: [0.93, 9], wb: [[1.06, 0.00, -0.01], [0.00, 1.00, 0.00], [0.00, -0.02, 0.94]] },
  'PONMA':      { sat: 0.72, bright: 1.02, lin: [0.93, 9], wb: [[1.05, 0.00, 0.00], [0.00, 1.00, 0.00], [0.00, -0.02, 0.95]] },
  'vinarija':   { sat: 0.70, bright: 1.03, lin: [0.93, 9], wb: [[0.99, 0.01, 0.00], [0.00, 1.01, 0.00], [0.01, 0.00, 1.00]] },
}

const setOf = (f) => Object.keys(PROFILES).find((k) => f.startsWith(k + '-')) ?? 'FP'

async function grade(file) {
  const p = PROFILES[setOf(file)]
  const src = sharp(path.join(RAW, file)).rotate()
  const { width, height } = await src.metadata()

  // 1) grade u punoj velicini
  const base = await sharp(path.join(RAW, file))
    .rotate()
    .modulate({ saturation: p.sat, brightness: p.bright })
    .linear(p.lin[0], p.lin[1])   // lift crne + rolloff bijelih = matte film
    .recomb(p.wb)                 // .tint() monokromira; recomb je balans bijele
    .toColourspace('srgb')
    .png()
    .toBuffer()

  // 2) zrno preko cijelog kadra - ujednacuje razlicite godine i ruke
  const grain = await sharp({
    create: { width, height, channels: 3, background: '#808080', noise: { type: 'gaussian', mean: 128, sigma: 7 } },
  }).png().toBuffer()

  const graded = await sharp(base)
    .composite([{ input: grain, blend: 'overlay' }])
    .png()
    .toBuffer()

  // 3) resize TEK SAD, iz gradiranog buffera
  const stem = file.replace(/\.(jpg|jpeg|png)$/i, '')
  const made = []
  for (const w of WIDTHS) {
    if (w > width * 1.05) continue
    await sharp(graded).resize({ width: w }).webp({ quality: 80, effort: 5 }).toFile(path.join(OUT, `${stem}-${w}.webp`))
    made.push(w)
  }
  // Ako najveci tier ne dohvaca 85% originala, izvezi i nativnu sirinu —
  // inace se fotka od 1124px servira na 640 i vidi se da je mekana.
  const top = made.length ? Math.max(...made) : 0
  if (top < width * 0.85) {
    await sharp(graded).resize({ width }).webp({ quality: 80, effort: 5 }).toFile(path.join(OUT, `${stem}-${width}.webp`))
    made.push(width)
  }
  return { stem, width, height, widths: made }
}

await mkdir(OUT, { recursive: true })
const files = (await readdir(RAW)).filter((f) => /\.(jpg|jpeg|png)$/i.test(f)).sort()

const manifest = {}
let done = 0
const CONC = 4
const queue = [...files]
async function worker() {
  while (queue.length) {
    const f = queue.shift()
    try {
      const r = await grade(f)
      manifest[r.stem] = { w: r.width, h: r.height, widths: r.widths }
      if (++done % 20 === 0) process.stdout.write(`  ${done}/${files.length}\n`)
    } catch (e) {
      console.error(`  FAIL ${f}: ${e.message}`)
    }
  }
}
await Promise.all(Array.from({ length: CONC }, worker))

await writeFile(new URL('../src/data/images.json', import.meta.url).pathname, JSON.stringify(manifest, null, 1))
console.log(`\ngradirano ${Object.keys(manifest).length}/${files.length}; manifest -> src/data/images.json`)
