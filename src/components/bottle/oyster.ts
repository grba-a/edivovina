import * as THREE from 'three'
import type { SurfacePoint } from './surface'

/**
 * Kamenica: plitka sferna kapa s nepravilnim rubom. Diskretan oblik, ne noise —
 * na fotografijama su to jasno citljive bijele skoljke, a ne tekstura.
 *
 * Ovo je sloj koji nosi RAST: model iz Higgsfielda je zapecen s laganom korom,
 * a dramaticna kolonizacija dolazi odavde jer mijenja SILUETU, sto tekstura
 * ne moze.
 */
export function oysterGeometry() {
  const g = new THREE.SphereGeometry(1, 14, 7, 0, Math.PI * 2, 0, Math.PI * 0.44)
  const pos = g.attributes.position as THREE.BufferAttribute
  const v = new THREE.Vector3()
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i)
    const wob = 1 + Math.sin(Math.atan2(v.z, v.x) * 3.4) * 0.16 + Math.cos(v.y * 9) * 0.06
    v.x *= wob
    v.z *= wob
    v.y *= 0.42
    pos.setXYZ(i, v.x, v.y, v.z)
  }
  g.computeVertexNormals()
  return g
}

export type Placement = {
  pos: THREE.Vector3
  quat: THREE.Quaternion
  scale: THREE.Vector3
  /** --descent na kojem se ova skoljka pojavi. */
  appearAt: number
}

const UP = new THREE.Vector3(0, 1, 0)

/**
 * Deterministicki raspored iz uzorkovanih tocaka povrsine modela.
 * Velicine su relativne na visinu modela, pa rade i ako model zamijenimo.
 */
export function oysterPlacements(points: SurfacePoint[], modelHeight: number): Placement[] {
  let s = 0x9e3779b9
  const rnd = () => {
    s ^= s << 13; s ^= s >>> 17; s ^= s << 5
    return ((s >>> 0) % 100000) / 100000
  }

  return points.map((sp) => {
    // Blizu vrha su skoljke krupnije — tamo je strujanje vece
    const size = modelHeight * (0.028 + rnd() * 0.032 + sp.t * 0.008)

    const q = new THREE.Quaternion().setFromUnitVectors(UP, sp.nrm)
    q.multiply(new THREE.Quaternion().setFromAxisAngle(UP, rnd() * Math.PI * 2))
    q.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), (rnd() - 0.5) * 0.5))

    return {
      pos: sp.pos.clone().addScaledVector(sp.nrm, size * 0.14),
      quat: q,
      // plosnate: prava kamenica je disk prilijepljen na povrsinu
      scale: new THREE.Vector3(size, size * (0.24 + rnd() * 0.22), size * (0.82 + rnd() * 0.36)),
      appearAt: 0.16 + rnd() * 0.72,
    }
  })
}
