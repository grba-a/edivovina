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

/* VISINE SU OGRANICENE KADROM, ne samo fotografijama.
   Kamera je na z=11 s fov 32, pa je vidljiva visina 2*11*tan(16°) = 6,31
   unita — dno kadra je na y = −3,155. Sa base −3,45 su i donja resetka i dno
   amfore bili ISPOD kadra: na ekranu su ostajala dva narancasta stalka uz
   predmet, a ne leziste. Nagrada cijelog spusta bila je amputirana.
   Sad cijelo leziste stane u kadar; Y_REST u AmphoraMesh se izvodi iz base pa
   prati automatski. */
export const CAGE = {
  /** Visina donje resetke (morsko dno). */
  base: -2.6,
  /** Gornja resetka — prolazi tocno kroz donji dio tijela amfore. */
  mid: -1.95,
  /** Do kamo idu vertikalne sipke. Nisko: ovo je LEZISTE, ne ograda. */
  postTop: -1.7,
  /**
   * Sirina celije. Amfora je ~1,25 siroka pri scale 3.
   *
   * Ovo je bilo 1,5 i kavez je postao NEVIDLJIV: na 1,5 su sipke ostajale
   * tocno iza tijela amfore, pa se s prednje strane nista nije vidjelo.
   * Minimalno ne znaci tjesnije nego SIRE I NIZE — mreza mora izlaziti izvan
   * siluete predmeta da bi se citala, a visinu joj drze kratki stupovi.
   */
  cell: 1.85,
  /** Tanje od prije (0,055): armaturna sipka na ovoj skali je tanka, a gusca
      mreza od tankih sipki cita kao varena mreza — debele su citale kao
      skela. */
  bar: 0.038,
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

  /* Varena mreza nije CAD grid: svaka sipka dobiva sitni pomak i nagib. Bez
     toga se cita kao skela, sa njim kao nesto sto je netko zavario u dvoristu
     i spustio na dno. */
  let s = 0x2f6b1c
  const rnd = () => {
    s ^= s << 13
    s ^= s >>> 17
    s ^= s << 5
    return ((s >>> 0) % 100000) / 100000
  }
  const jig = (k = 1) => (rnd() - 0.5) * 0.03 * k
  const tilt = (k = 1) =>
    new THREE.Quaternion().setFromAxisAngle(Z_AXIS, (rnd() - 0.5) * 0.05 * k)

  /* CETIRI sipke u svakom smjeru po resetki, ne tri. Gusca mreza od tankih
     sipki je i realnija i vizualno laksa — zauzima manje kadra a jasnije se
     cita nego tri debele. Dno je gusce od gornje resetke: ono nosi tezinu. */
  const grid = [-h, -h / 3, h / 3, h]
  for (const y of [base, mid]) {
    const lines = y === base ? grid : [-h, 0, h]
    for (const off of lines) {
      push(new THREE.Vector3(jig(), y + jig(), off + jig()), tilt(), new THREE.Vector3(cell, bar, bar))
      push(new THREE.Vector3(off + jig(), y + jig(), jig()), tilt(), new THREE.Vector3(bar, bar, cell))
    }
  }

  // cetiri kutna stupa — kratki, jer je ovo leziste a ne ograda
  for (const sx of [-h, h]) {
    for (const sz of [-h, h]) {
      push(
        new THREE.Vector3(sx + jig(), (base + postTop) / 2, sz + jig()),
        tilt(0.6),
        new THREE.Vector3(bar, postTop - base, bar),
      )
    }
  }

  /* Dva ukruta preko gornje resetke — varen kavez nije savrsen. Nagib je
     smanjen s 0,42 na 0,12 rad i duzina s 1,05 na 0,92 celije: pri prijasnjim
     vrijednostima su strsili izvan mreze i citali se kao odbacene grane, ne
     kao ukruti. */
  for (let i = 0; i < 2; i++) {
    push(
      new THREE.Vector3((rnd() - 0.5) * cell * 0.3, mid + 0.03 + i * 0.05, (rnd() - 0.5) * cell * 0.3),
      new THREE.Quaternion().setFromAxisAngle(Z_AXIS, (rnd() - 0.5) * 0.12),
      new THREE.Vector3(cell * 0.92, bar * 0.85, bar * 0.85),
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
    /* Krace nego prije (0,6 + 0,85): posidonija je narasla preko lezista i
       prekrila mrezu koju treba vidjeti. Trava ide DO cradlea, ne preko njega. */
    const len = (inCage ? 0.16 : 0.4) + rnd() * 0.5
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
