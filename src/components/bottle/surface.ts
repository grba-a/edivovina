import * as THREE from 'three'

/**
 * Uzorkuje tocke na povrsini STVARNE geometrije modela, s normalama.
 *
 * Prije je raspored kamenica dolazio iz proceduralnog profila. Sad kad je model
 * iz Higgsfielda, profil vise ne opisuje istu formu (odnos visina:sirina je
 * 2,4:1 umjesto 2,78:1), pa bi skoljke lebdjele uz povrsinu. Uzorkovanje samog
 * mesha to rjesava i prezivljava svaku buducu zamjenu modela.
 */
export type SurfacePoint = { pos: THREE.Vector3; nrm: THREE.Vector3; t: number }

/** xorshift s fiksnim seedom — isti raspored na svakom loadu i na SSR-u. */
function rng(seed: number) {
  let s = seed | 0 || 0x9e3779b9
  return () => {
    s ^= s << 13
    s ^= s >>> 17
    s ^= s << 5
    return ((s >>> 0) % 100000) / 100000
  }
}

export function sampleSurface(
  geometry: THREE.BufferGeometry,
  count: number,
  seed: number,
  /** >1 gura uzorke prema vrhu, <1 prema dnu. */
  bias = 1,
): SurfacePoint[] {
  const pos = geometry.attributes.position as THREE.BufferAttribute
  const nrm = geometry.attributes.normal as THREE.BufferAttribute
  if (!pos || !nrm) return []

  geometry.computeBoundingBox()
  const bb = geometry.boundingBox!
  const yMin = bb.min.y
  const ySpan = Math.max(1e-6, bb.max.y - yMin)

  // Vrhovi sortirani po visini, pa uzorak po zeljenoj distribuciji visine
  const order = Array.from({ length: pos.count }, (_, i) => i)
  order.sort((a, b) => pos.getY(a) - pos.getY(b))

  const rnd = rng(seed)
  const out: SurfacePoint[] = []
  const seen = new Set<number>()

  for (let n = 0; n < count * 4 && out.length < count; n++) {
    const u = Math.pow(rnd(), bias)
    const idx = order[Math.min(order.length - 1, Math.floor(u * order.length))]
    if (seen.has(idx)) continue
    seen.add(idx)

    const p = new THREE.Vector3().fromBufferAttribute(pos, idx)
    const nv = new THREE.Vector3().fromBufferAttribute(nrm, idx).normalize()
    // Ne lijepi na plosne dijelove okrenute strogo nagore/nadolje (cep i toe)
    if (Math.abs(nv.y) > 0.93) continue

    out.push({ pos: p, nrm: nv, t: (p.y - yMin) / ySpan })
  }
  return out
}
