import * as THREE from 'three'
import { amphoraProfile, surfacePoint, AMPHORA_HEIGHT } from './amphora'

/**
 * Kamenica: plitka sferna kapa s nepravilnim rubom. Diskretan oblik, ne noise —
 * na fotografijama su to jasno citljive bijele skoljke, a ne tekstura.
 */
export function oysterGeometry() {
  const g = new THREE.SphereGeometry(1, 14, 7, 0, Math.PI * 2, 0, Math.PI * 0.44)
  const pos = g.attributes.position as THREE.BufferAttribute
  const v = new THREE.Vector3()
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i)
    // nepravilan rub i blago valovita ljuska
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
  tint: THREE.Color
}

const SHELL_WHITE = new THREE.Color('#f0ece2')
const SHELL_BONE = new THREE.Color('#cfc4ae')
const SHELL_GREY = new THREE.Color('#a89a86')

/**
 * Determinististicki raspored — isti na svakom loadu i na SSR-u i na klijentu.
 * Tezinski gore: na fotkama su skoljke gusce na ramenu i grlu, jer je tamo
 * strujanje vece.
 */
export function oysterPlacements(count = 46): Placement[] {
  const prof = amphoraProfile(120)
  const out: Placement[] = []

  // xorshift s fiksnim seedom
  let s = 0x9e3779b9
  const rnd = () => {
    s ^= s << 13; s ^= s >>> 17; s ^= s << 5
    return ((s >>> 0) % 100000) / 100000
  }

  for (let i = 0; i < count; i++) {
    // t^0.72 gura uzorke prema gornjem dijelu
    const t = 0.12 + Math.pow(rnd(), 0.72) * 0.82
    const theta = rnd() * Math.PI * 2
    const { pos, nrm } = surfacePoint(prof, t, theta)

    const size = 0.085 + rnd() * 0.105 + (1 - t) * 0.018
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), nrm)
    // slucajan zavrtaj oko normale da se ljuske ne poravnaju
    q.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), rnd() * Math.PI * 2))
    // nagni je malo, skoljke ne sjede plosno
    q.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), (rnd() - 0.5) * 0.5))

    const r = rnd()
    out.push({
      pos: pos.clone().addScaledVector(nrm, size * 0.16).setY(pos.y - AMPHORA_HEIGHT / 2),
      quat: q,
      // plosnate: prava kamenica je disk prilijepljen na povrsinu
      scale: new THREE.Vector3(size, size * (0.24 + rnd() * 0.22), size * (0.82 + rnd() * 0.36)),
      appearAt: 0.16 + rnd() * 0.74,
      tint: r < 0.62 ? SHELL_WHITE.clone() : r < 0.86 ? SHELL_BONE.clone() : SHELL_GREY.clone(),
    })
  }
  return out
}
