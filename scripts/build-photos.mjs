/**
 * Klijentov PROFESIONALNI materijal (~/Downloads/Edivo) -> public/photo/*.webp
 *
 * Ove fotke NE treba spasavati kao onaj scrapeani set. Grade je zato minimalan:
 * samo toliko da 24 kadra iz cetiri razlicita shoota citaju kao jedan set.
 * BEZ zrna — zrno na 45 MP profesionalnoj fotki je vandalizam.
 *
 * Mobile-first tierovi: 420 je prvi, ne zadnji.
 */
import sharp from 'sharp'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const SRC = path.join(process.env.HOME, 'Downloads/Edivo')
const OUT = new URL('../public/photo/', import.meta.url).pathname
// 390@2x = 780 -> 840; 430@3x = 1290 -> 1600; desktop 1440 -> 1600.
// Bez 840 tiera retina mobitel povuce 1200 i placa dvostruko.
const WIDTHS = [420, 640, 840, 1240, 1600]

/** Semanticka imena — kod se cita, ne dekodira. */
const PICKS = [
  // --- 2024 photoshoot: ritual, obala, brod
  ['Edivo Photoshoot 2024/edivo-100.jpg', 'reveal-shore'],
  ['Edivo Photoshoot 2024/edivo-113.jpg', 'pour-amphora'],
  ['Edivo Photoshoot 2024/edivo-111.jpg', 'pour-glass'],
  ['Edivo Photoshoot 2024/edivo-104.jpg', 'hands-amphora'],
  ['Edivo Photoshoot 2024/edivo-106.jpg', 'hands-amphora-2'],
  ['Edivo Photoshoot 2024/edivo-47.jpg', 'boat-bottle'],
  ['Edivo Photoshoot 2024/edivo-46.jpg', 'boat-bottle-2'],
  ['Edivo Photoshoot 2024/edivo-31.jpg', 'lift-water'],
  ['Edivo Photoshoot 2024/edivo-33.jpg', 'seabed-pebbles'],
  ['Edivo Photoshoot 2024/edivo-37.jpg', 'surface-amphora'],
  ['Edivo Photoshoot 2024/edivo-34.jpg', 'founder'],
  ['Edivo Photoshoot 2024/edivo-103.jpg', 'sunset-glasses'],
  ['Edivo Photoshoot 2024/edivo-22.jpg', 'platter'],
  ['Edivo Photoshoot 2024/edivo-70.jpg', 'jetty'],
  ['Edivo Photoshoot 2024/edivo-86.jpg', 'oyster'],
  ['Edivo Photoshoot 2024/edivo-1.jpg', 'bar-terrace'],
  ['Edivo Photoshoot 2024/edivo-95.jpg', 'bay-bottle'],
  ['Edivo Photoshoot 2024/edivo-66.jpg', 'jetty-2'],
  // --- studijske boce (jedna podloga = konzistentan katalog)
  ['Edivo Bottles/A7I03138.jpg', 'p-amphora'],
  ['Edivo Bottles/A7I03086.jpg', 'p-sea-bottle'],
  ['Edivo Bottles/A7I03117.jpg', 'p-navis'],
  ['Edivo Bottles/A7I03162.jpg', 'p-eros-sea'],
  ['Edivo Bottles/A7I02982.jpg', 'p-cellar'],
  ['Edivo Bottles/A7I03003.jpg', 'p-q-white'],
  ['Edivo Bottles/A7I03024.jpg', 'p-rose'],
  ['Edivo Bottles/A7I03057.jpg', 'p-eros'],
  ['Edivo Bottles/A7I02946.jpg', 'p-plavac'],
  ['Edivo Bottles/A7I03206.jpg', 'p-box'],
  ['Edivo Bottles/A7I02988.jpg', 'p-dingac'],
  ['Edivo Bottles/A7I02951.jpg', 'p-plavac-red'],
]

/* Minimalan grade. Redovi matrice zbrajaju ~1 pa luminancija ostaje. */
const WARM = [
  [1.035, 0.0, -0.01],
  [0.0, 1.0, 0.0],
  [0.0, -0.015, 0.965],
]

await mkdir(OUT, { recursive: true })
const manifest = {}
let done = 0

async function build([rel, name]) {
  const file = path.join(SRC, rel)
  const meta = await sharp(file).rotate().metadata()

  const graded = await sharp(file)
    .rotate()
    .modulate({ saturation: 0.9 })
    .linear(0.97, 4)
    .recomb(WARM)
    .toColourspace('srgb')
    .png()
    .toBuffer()

  const widths = []
  for (const w of WIDTHS) {
    if (w > meta.width * 1.02) continue
    // resize TEK iz gradiranog buffera — sharp inace preuredi lanac
    await sharp(graded)
      .resize({ width: w })
      .webp({ quality: w <= 840 ? 74 : 78, effort: 5 })
      .toFile(path.join(OUT, `${name}-${w}.webp`))
    widths.push(w)
  }
  manifest[name] = { w: meta.width, h: meta.height, widths, src: rel }
  process.stdout.write(`  ${String(++done).padStart(2)}/${PICKS.length} ${name} ${meta.width}x${meta.height} -> ${widths.join(',')}\n`)
}

const queue = [...PICKS]
async function worker() {
  while (queue.length) {
    const job = queue.shift()
    try { await build(job) } catch (e) { console.error(`  FAIL ${job[1]}: ${e.message}`) }
  }
}
await Promise.all([worker(), worker(), worker()])

await writeFile(new URL('../src/data/photos.json', import.meta.url).pathname, JSON.stringify(manifest, null, 1))
console.log(`\n${Object.keys(manifest).length}/${PICKS.length} fotki -> public/photo/, manifest -> src/data/photos.json`)
