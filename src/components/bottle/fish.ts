import * as THREE from 'three'

/**
 * Ribe. Plosnate siluete, ne modeli — na 15-20 m riba i JE silueta, pa je to
 * ujedno najtocnije i najjeftinije rjesenje.
 *
 * Plivaju u tri jata na tri dubine. Kretanje, mahanje repom i pojavljivanje su
 * SVE u vertex shaderu: CPU ne dira ni jednu matricu po frameu.
 */

/** 2D silueta ribe: nos desno, rep lijevo. */
export function fishGeometry() {
  const s = new THREE.Shape()
  s.moveTo(0.5, 0)
  s.bezierCurveTo(0.34, 0.15, 0.1, 0.19, -0.16, 0.11)
  s.lineTo(-0.34, 0.05)
  s.lineTo(-0.5, 0.21)
  s.lineTo(-0.44, 0)
  s.lineTo(-0.5, -0.21)
  s.lineTo(-0.34, -0.05)
  s.lineTo(-0.16, -0.11)
  s.bezierCurveTo(0.1, -0.19, 0.34, -0.15, 0.5, 0)
  const g = new THREE.ShapeGeometry(s, 8)
  g.computeBoundingBox()
  return g
}

export const fishVertex = /* glsl */ `
  attribute float aBand;    // --descent na kojem je jato vidljivo
  attribute float aSpeed;   // world unita po sekundi, predznak = smjer
  attribute float aPhase;
  uniform float uTime;
  uniform float uDescent;
  uniform float uSpan;      // sirina kadra, za omotavanje
  varying float vAlpha;
  varying float vX;

  void main() {
    // jato je vidljivo samo oko svoje dubine
    float band = 1.0 - smoothstep(0.0, 0.13, abs(uDescent - aBand));
    vAlpha = band;

    vec3 pos = position;

    // rep mase; jace prema repu (x < 0)
    float tail = smoothstep(0.1, -0.5, pos.x);
    pos.y += sin(uTime * 5.2 + aPhase) * 0.18 * tail;

    // orijentacija po smjeru plivanja
    if (aSpeed < 0.0) pos.x = -pos.x;

    vec4 world = instanceMatrix * vec4(pos, 1.0);

    // putovanje po X s omotavanjem preko kadra
    float travel = uTime * aSpeed + aPhase * 7.0;
    float w = uSpan + 4.0;
    world.x += mod(travel + w * 0.5, w) - w * 0.5;
    // blago valjanje po Y
    world.y += sin(uTime * 0.7 + aPhase * 3.0) * 0.22;

    vX = world.x;
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * world;
  }
`

export const fishFragment = /* glsl */ `
  uniform vec3 uColor;
  varying float vAlpha;
  varying float vX;

  void main() {
    if (vAlpha < 0.02) discard;
    // gase se prema rubovima kadra da ne "iskacu" iz nicega
    float edge = 1.0 - smoothstep(0.62, 1.0, abs(vX) / 7.0);
    gl_FragColor = vec4(uColor, vAlpha * edge * 0.72);
  }
`

export type Shoal = { matrices: THREE.Matrix4[]; band: Float32Array; speed: Float32Array; phase: Float32Array }

/**
 * Tri jata: plitko nekoliko vecih, na pola gusto jato malih, dublje par krupnih
 * silueta. Dublje od toga nema svjetla ni riba.
 */
const SHOALS = [
  { band: 0.28, count: 5, size: [0.42, 0.72], speed: [0.5, 0.95] },
  { band: 0.52, count: 16, size: [0.2, 0.36], speed: [0.7, 1.3] },
  { band: 0.74, count: 3, size: [0.62, 1.0], speed: [0.28, 0.5] },
]

export function fishShoals(): Shoal {
  let s = 0x7a3f11
  const rnd = () => {
    s ^= s << 13; s ^= s >>> 17; s ^= s << 5
    return ((s >>> 0) % 100000) / 100000
  }

  const matrices: THREE.Matrix4[] = []
  const band: number[] = []
  const speed: number[] = []
  const phase: number[] = []

  for (const sh of SHOALS) {
    for (let i = 0; i < sh.count; i++) {
      const sc = sh.size[0] + rnd() * (sh.size[1] - sh.size[0])
      const dir = rnd() < 0.5 ? -1 : 1
      matrices.push(
        new THREE.Matrix4().compose(
          new THREE.Vector3((rnd() - 0.5) * 9, (rnd() - 0.5) * 4.4, -1.5 - rnd() * 3.5),
          new THREE.Quaternion(),
          new THREE.Vector3(sc, sc, sc),
        ),
      )
      band.push(sh.band)
      speed.push(dir * (sh.speed[0] + rnd() * (sh.speed[1] - sh.speed[0])))
      phase.push(rnd() * Math.PI * 2)
    }
  }

  return {
    matrices,
    band: new Float32Array(band),
    speed: new Float32Array(speed),
    phase: new Float32Array(phase),
  }
}
