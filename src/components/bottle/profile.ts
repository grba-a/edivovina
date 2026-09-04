import * as THREE from 'three'

/**
 * Profil bordeaux boce za LatheGeometry. 1 unit = 100 mm, ukupno 3,0 = 300 mm,
 * tijelo 75 mm promjera — standardna vinska boca.
 *
 * Ovo je cijeli "3D model": ~30 tocaka umjesto 5-30 MB .glb-a. Kad probamo
 * Blender, mijenja se samo BottleMesh; descent interface ostaje isti.
 */
export function bottleProfile(): THREE.Vector2[] {
  const pts: THREE.Vector2[] = []
  const p = (x: number, y: number) => pts.push(new THREE.Vector2(x, y))

  const R_BODY = 0.375
  const R_NECK = 0.14
  const Y_SHOULDER = 1.72
  const Y_NECK = 2.4

  p(0.002, 0)          // dno (blago >0 da lathe ne napravi degenerirani pol)
  p(R_BODY * 0.72, 0)
  p(R_BODY, 0.07)      // rub dna
  p(R_BODY, Y_SHOULDER)

  // rame: kvadratni bezier od tijela do grla
  const STEPS = 14
  for (let i = 1; i <= STEPS; i++) {
    const t = i / STEPS
    const mt = 1 - t
    // kontrolna tocka drzi rame "punim" umjesto stozastim
    const x = mt * mt * R_BODY + 2 * mt * t * R_BODY * 0.94 + t * t * R_NECK
    const y = mt * mt * Y_SHOULDER + 2 * mt * t * (Y_SHOULDER + 0.46) + t * t * Y_NECK
    p(x, y)
  }

  p(R_NECK, 2.84)      // grlo
  p(R_NECK * 1.16, 2.87)  // prsten ispod usta
  p(R_NECK * 1.16, 2.95)
  p(R_NECK * 0.99, 2.98)
  p(0.002, 3.0)        // zatvori vrh

  return pts
}
