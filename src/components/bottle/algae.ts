import * as THREE from 'three'
import type { SurfacePoint } from './surface'

/**
 * Alge. Instancirane trake koje IZRASTU dok amfora tone i valovito se micu.
 * Rast i valovanje su u shaderu, pa CPU ne dira 90 matrica po frameu.
 */

export function bladeGeometry() {
  // PlaneGeometry je u XY; pivot dizemo na dno u vertex shaderu.
  return new THREE.PlaneGeometry(1, 1, 1, 5)
}

export const algaeVertex = /* glsl */ `
  attribute float aAppear;
  attribute float aPhase;
  uniform float uDescent;
  uniform float uTime;
  varying float vH;

  void main() {
    float grow = smoothstep(aAppear, aAppear + 0.18, uDescent);

    vec3 pos = position;
    pos.y += 0.5;              // pivot na dno trake
    float h = pos.y;
    pos.y *= grow;
    pos.x *= mix(0.6, 1.0, grow);

    // valovanje raste s visinom (h*h) — baza je pricvrscena
    float s = h * h * grow;
    pos.x += sin(uTime * 1.35 + aPhase + h * 2.4) * 0.34 * s;
    pos.z += cos(uTime * 1.05 + aPhase * 1.7) * 0.2 * s;

    vH = h;
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * instanceMatrix * vec4(pos, 1.0);
  }
`

export const algaeFragment = /* glsl */ `
  uniform vec3 uBase;
  uniform vec3 uTip;
  varying float vH;

  void main() {
    vec3 c = mix(uBase, uTip, vH);
    // NE smoothstep(1.04, 0.5, vH): u GLSL-u je rezultat nedefiniran kad je
    // edge0 > edge1 i driver vrati 0 -> sve ode u discard, bez ijedne greske.
    float a = (1.0 - smoothstep(0.55, 1.04, vH)) * 0.94;
    if (a < 0.02) discard;
    gl_FragColor = vec4(c, a);
    #include <colorspace_fragment>
  }
`

export function algaePlacements(points: SurfacePoint[], modelHeight: number) {
  const matrices: THREE.Matrix4[] = []
  const appear = new Float32Array(points.length)
  const phase = new Float32Array(points.length)

  let s = 0x1f123bb5
  const rnd = () => {
    s ^= s << 13; s ^= s >>> 17; s ^= s << 5
    return ((s >>> 0) % 100000) / 100000
  }

  const up = new THREE.Vector3(0, 1, 0)
  points.forEach((sp, i) => {
    const len = modelHeight * (0.055 + rnd() * 0.085)
    const wide = modelHeight * (0.011 + rnd() * 0.018)

    const q = new THREE.Quaternion().setFromUnitVectors(up, sp.nrm)
    q.multiply(new THREE.Quaternion().setFromAxisAngle(up, rnd() * Math.PI * 2))

    matrices.push(new THREE.Matrix4().compose(sp.pos.clone(), q, new THREE.Vector3(wide, len, wide)))
    appear[i] = 0.1 + rnd() * 0.78
    phase[i] = rnd() * Math.PI * 2
  })

  return { matrices, appear, phase }
}
