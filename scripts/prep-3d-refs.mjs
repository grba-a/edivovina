/**
 * Priprema referentnih kadrova za image-to-3D (Higgsfield).
 *
 * Nalazi amforu u kadru po boji pecene gline (terakota je jedina takva povrsina
 * u tim kadrovima), pa reze tijesno oko nje. Tako model dobiva sto vise piksela
 * na sam objekt, a ne na bijeli gliser i more.
 */
import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'

const B = path.join(process.env.HOME, 'Downloads/Edivo/Edivo Bottles')
const P = path.join(process.env.HOME, 'Downloads/Edivo/Edivo Photoshoot 2024')
const OUT = new URL('../higgsfield-input/', import.meta.url).pathname

/**
 * Rucni rez tamo gdje automatika ne moze: u studijskom kadru su drvena bacva i
 * polica ISTE boje kao glina, pa detektor uhvati pola prostorije.
 * [left, top, width, height] u dijelu kadra.
 */
const MANUAL = { '1-front-studio': [0.14, 0.05, 0.62, 0.82] }

const REFS = [
  [path.join(B, 'A7I03134.jpg'), '1-front-studio', 'sprijeda, obje rucke, pecat na cepu (stalak i vrpca su U KADRU)'],
  [path.join(P, 'edivo-42.jpg'), '2-profile-boat', 'puni profil, lezi na gliseru, cista podloga, BEZ stalka'],
  [path.join(P, 'edivo-41.jpg'), '3-profile-boat-b', 'isti profil, druga rotacija'],
  [path.join(P, 'edivo-43.jpg'), '4-profile-boat-c', 'isti profil, treca rotacija'],
  [path.join(P, 'edivo-30.jpg'), '5-threequarter', 'tri cetvrtine, u rukama, bez stalka'],
  [path.join(P, 'edivo-105.jpg'), '6-neck-detail', 'grlo, cep i korijen rucki iz blizine'],
]

/** Terakota: topla, srednje svijetla, R jasno veci od B. */
function isClay(r, g, b) {
  return r > 95 && r < 235 && r - b > 26 && r >= g && g - b > 4
}

async function bbox(file) {
  const W = 220
  const { data, info } = await sharp(file).rotate().resize({ width: W }).raw().toBuffer({ resolveWithObject: true })
  const ch = info.channels
  let minX = 1e9, minY = 1e9, maxX = -1, maxY = -1, hits = 0
  // Grubi filtar suma: uzmi samo piksele koji imaju najmanje 3 susjeda iste vrste
  const mask = new Uint8Array(info.width * info.height)
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const i = (y * info.width + x) * ch
      if (isClay(data[i], data[i + 1], data[i + 2])) mask[y * info.width + x] = 1
    }
  }
  for (let y = 1; y < info.height - 1; y++) {
    for (let x = 1; x < info.width - 1; x++) {
      if (!mask[y * info.width + x]) continue
      let n = 0
      for (const [dx, dy] of [[1,0],[-1,0],[0,1],[0,-1]]) n += mask[(y + dy) * info.width + (x + dx)]
      if (n < 3) continue
      hits++
      if (x < minX) minX = x
      if (x > maxX) maxX = x
      if (y < minY) minY = y
      if (y > maxY) maxY = y
    }
  }
  if (hits < 40) return null
  return { minX: minX / info.width, maxX: maxX / info.width, minY: minY / info.height, maxY: maxY / info.height, hits }
}

await mkdir(OUT, { recursive: true })
for (const [file, name, note] of REFS) {
  const meta = await sharp(file).rotate().metadata()
  let x0, x1, y0, y1
  if (MANUAL[name]) {
    const [l, t, w, h] = MANUAL[name]
    x0 = l * meta.width; y0 = t * meta.height
    x1 = (l + w) * meta.width; y1 = (t + h) * meta.height
  } else {
    const bb = await bbox(file)
    if (!bb) { console.log(`  ${name}: nije nasao glinu, preskacem`); continue }
    // 12% zraka oko objekta — image-to-3D voli malo konteksta, ne nula
    const pad = 0.12
    x0 = Math.max(0, (bb.minX - pad) * meta.width)
    x1 = Math.min(meta.width, (bb.maxX + pad) * meta.width)
    y0 = Math.max(0, (bb.minY - pad) * meta.height)
    y1 = Math.min(meta.height, (bb.maxY + pad) * meta.height)
  }

  await sharp(file)
    .rotate()
    .extract({ left: Math.round(x0), top: Math.round(y0), width: Math.round(x1 - x0), height: Math.round(y1 - y0) })
    .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 94 })
    .toFile(path.join(OUT, `${name}.jpg`))

  const om = await sharp(path.join(OUT, `${name}.jpg`)).metadata()
  console.log(`  ${name}.jpg  ${om.width}x${om.height}  — ${note}`)
}
console.log('\n-> higgsfield-input/')
