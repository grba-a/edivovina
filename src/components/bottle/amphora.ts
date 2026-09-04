import * as THREE from 'three'

/**
 * Profil Edivove amfore, mjeren s klijentovih fotografija.
 *
 * Karakteristike koje je cine prepoznatljivom (i koje vinska boca nema):
 *  - siljasti konicni dno (amforski "toe") — stoji samo u kovanom lezistu
 *  - ovoidno tijelo, najsire na ~48% visine
 *  - uzak vrat i prosireno grlo zavrseno grubim cepom
 *  - bez ruceka
 *
 * Ukupna visina 3.0 = 300 mm zadrzana iz prethodnog modela da kamera i
 * putanja pada ostanu iste.
 */
export const AMPHORA_HEIGHT = 3.0
export const AMPHORA_R_MAX = 0.54

export function amphoraProfile(segments = 84): THREE.Vector2[] {
  const v = (x: number, y: number) => new THREE.Vector2(x, y)

  // Izmjereno s fotografije: odnos visina:sirina ~2,8:1, najsire na ~52%
  // visine, vrat kratak i zdepast, cep grubi knob. Prethodna verzija je bila
  // 3,2:1 i citala se kao badem, ne kao amfora.
  const key = [
    v(0.004, 0.0),   // vrh siljka
    v(0.085, 0.11),
    v(0.19, 0.30),
    v(0.315, 0.60),
    v(0.425, 0.95),
    v(0.50, 1.28),
    v(0.54, 1.56),   // najsire
    v(0.535, 1.84),
    v(0.495, 2.08),
    v(0.415, 2.30),
    v(0.315, 2.46),
    v(0.235, 2.57),
    v(0.198, 2.64),  // vrat, kratak
    v(0.192, 2.74),
    v(0.246, 2.80),  // prosireno grlo
    v(0.248, 2.855),
    v(0.196, 2.875),
    v(0.185, 2.92),  // cep
    v(0.16, 2.98),
    v(0.004, 3.0),
  ]

  const pts = new THREE.SplineCurve(key).getPoints(segments)
  for (const p of pts) p.x = Math.max(0.003, p.x)
  return pts
}

/**
 * Pecena glina nije glatka. Mala CPU deformacija vrhova jednom pri gradnji —
 * bez toga model odaje da je CG.
 */
export function roughenClay(g: THREE.BufferGeometry, amount = 0.0016) {
  const pos = g.attributes.position as THREE.BufferAttribute
  const nrm = g.attributes.normal as THREE.BufferAttribute
  const v = new THREE.Vector3()
  const n = new THREE.Vector3()
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i)
    n.fromBufferAttribute(nrm, i)
    // Cisti sinusi daju PRAVILNA rebra (izgleda kao pinjol). Hash-based
    // vrijednost je neperiodicna i cita se kao glina.
    const h = Math.sin(v.x * 37.3 + v.y * 21.1 + v.z * 53.7) * 43758.5453
    const w = (h - Math.floor(h)) * 2 - 1
    v.addScaledVector(n, w * amount)
    pos.setXYZ(i, v.x, v.y, v.z)
  }
  pos.needsUpdate = true
  g.computeVertexNormals()
  return g
}

/**
 * Rucke. Dvije, s vrata na rame, kao na klijentovoj amfori (na fotografiji je
 * lijeva djelomicno prekrivena kamenicama, a kroz nju je provucena vrpca s
 * crvenom etiketom).
 */
export function handleGeometry(rich: boolean) {
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.2, 2.70, 0),
    new THREE.Vector3(0.42, 2.67, 0),
    new THREE.Vector3(0.555, 2.45, 0),
    new THREE.Vector3(0.53, 2.17, 0),
    new THREE.Vector3(0.455, 2.02, 0),
  ])
  const g = new THREE.TubeGeometry(curve, rich ? 30 : 16, 0.042, rich ? 10 : 6, false)
  g.translate(0, -AMPHORA_HEIGHT / 2, 0)
  return g
}

/**
 * Uzorkuj tocku na povrsini amfore + normalu, za lijepljenje kamenica.
 * `t` je parametar po visini [0,1]; `theta` kut oko osi.
 */
export function surfacePoint(prof: THREE.Vector2[], t: number, theta: number) {
  const i = Math.min(prof.length - 2, Math.max(0, Math.floor(t * (prof.length - 1))))
  const f = t * (prof.length - 1) - i
  const a = prof[i]
  const b = prof[i + 1]
  const r = a.x + (b.x - a.x) * f
  const y = a.y + (b.y - a.y) * f

  // normala profila u 2D (okrenuta tangenta), pa rotirana oko osi
  const tx = b.x - a.x
  const ty = b.y - a.y
  const len = Math.hypot(tx, ty) || 1
  const nr = ty / len
  const ny = -tx / len

  const pos = new THREE.Vector3(Math.cos(theta) * r, y, Math.sin(theta) * r)
  const nrm = new THREE.Vector3(Math.cos(theta) * nr, ny, Math.sin(theta) * nr).normalize()
  return { pos, nrm, r }
}
