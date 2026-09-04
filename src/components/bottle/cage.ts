import * as THREE from 'three'

/**
 * Kavez s morskog dna.
 *
 * Na fotkama (`ispod-mora-02/05/07`, `UTS-02`) to je VARENA ARMATURNA MREZA:
 * tanke rdjave sipke, a amfore stoje uspravno i mreza ih drzi oko tijela.
 *
 * Sirina je tocno za JEDNU amforu — kavez je leziste, ne ograda. Amfora je pri
 * scale 3 siroka ~1,25 unita, pa je celija 1,9: dovoljno da upadne, dovoljno
 * tijesno da se cita kao leziste.
 */

export const CAGE = {
  /** Visina donje resetke (morsko dno). */
  base: -3.45,
  /** Visina gornje resetke — prolazi kroz donji dio tijela amfore. */
  mid: -2.35,
  /** Do kamo idu vertikalne sipke. */
  postTop: -1.75,
  /** Sirina celije. Amfora je ~1,25 siroka pri scale 3. */
  cell: 1.9,
  bar: 0.055,
}

export type Bar = { pos: THREE.Vector3; quat: THREE.Quaternion; scale: THREE.Vector3 }

const Z_AXIS = new THREE.Vector3(0, 0, 1)

/**
 * Sipke kao instance jedne kocke. Rotacija ide kroz kvaternion, a duzina kroz
 * scale — jedna geometrija za cijeli kavez.
 */
export function cageBars(): Bar[] {
  const { base, mid, postTop, cell, bar } = CAGE
  const out: Bar[] = []
  const h = cell / 2

  const push = (pos: THREE.Vector3, quat: THREE.Quaternion, scale: THREE.Vector3) =>
    out.push({ pos, quat, scale })

  // Dvije resetke: dno i jedna kroz tijelo amfore. Tri sipke u svakom smjeru —
  // dovoljno da se cita kao varena mreza, a ne kao CAD grid.
  for (const y of [base, mid]) {
    for (const off of [-h, 0, h]) {
      push(new THREE.Vector3(0, y, off), new THREE.Quaternion(), new THREE.Vector3(cell, bar, bar))
      push(new THREE.Vector3(off, y, 0), new THREE.Quaternion(), new THREE.Vector3(bar, bar, cell))
    }
  }

  // cetiri kutna stupa
  for (const sx of [-h, h]) {
    for (const sz of [-h, h]) {
      push(
        new THREE.Vector3(sx, (base + postTop) / 2, sz),
        new THREE.Quaternion(),
        new THREE.Vector3(bar, postTop - base, bar),
      )
    }
  }

  // dva iskrivljena ukruta — varen kavez nije savrsen
  let s = 0x2f6b1c
  const rnd = () => {
    s ^= s << 13; s ^= s >>> 17; s ^= s << 5
    return ((s >>> 0) % 100000) / 100000
  }
  for (let i = 0; i < 2; i++) {
    push(
      new THREE.Vector3((rnd() - 0.5) * cell * 0.5, mid + 0.03 + i * 0.06, (rnd() - 0.5) * cell * 0.5),
      new THREE.Quaternion().setFromAxisAngle(Z_AXIS, (rnd() - 0.5) * 0.42),
      new THREE.Vector3(cell * 1.05, bar * 0.8, bar * 0.8),
    )
  }

  return out
}

/**
 * Morsko dno oko kaveza: posidonija. Ista traka i isti shader kao alge na
 * amfori — jedan geometrijski tip za cijelu vegetaciju.
 */
export function seabedBlades(count = 220) {
  let s = 0x51a3d7
  const rnd = () => {
    s ^= s << 13; s ^= s >>> 17; s ^= s << 5
    return ((s >>> 0) % 100000) / 100000
  }

  const matrices: THREE.Matrix4[] = []
  const appear = new Float32Array(count)
  const phase = new Float32Array(count)
  const up = new THREE.Vector3(0, 1, 0)

  for (let i = 0; i < count; i++) {
    // gusto uz kavez, rjedje prema rubovima kadra
    const r = Math.pow(rnd(), 0.5) * 8
    const a = rnd() * Math.PI * 2
    const x = Math.cos(a) * r
    const z = Math.sin(a) * r * 0.45 - 0.5
    // ne rasti tocno u lezistu
    const inCage = Math.abs(x) < CAGE.cell * 0.55 && Math.abs(z + 0.5) < CAGE.cell * 0.55
    const len = (inCage ? 0.22 : 0.6) + rnd() * 0.85
    const wide = 0.04 + rnd() * 0.06

    const q = new THREE.Quaternion().setFromAxisAngle(up, rnd() * Math.PI * 2)
    q.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), (rnd() - 0.5) * 0.3))

    matrices.push(
      new THREE.Matrix4().compose(
        new THREE.Vector3(x, CAGE.base - 0.04, z),
        q,
        new THREE.Vector3(wide, len, wide),
      ),
    )
    // dno izraste u zadnjoj petini spusta, od centra prema rubovima
    appear[i] = 0.8 + (r / 7) * 0.16
    phase[i] = rnd() * Math.PI * 2
  }

  return { matrices, appear, phase }
}
