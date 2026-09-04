'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { amphoraProfile, roughenClay, handleGeometry, AMPHORA_HEIGHT } from './amphora'
import { oysterGeometry, oysterPlacements } from './oyster'
import { bladeGeometry, algaePlacements, algaeVertex, algaeFragment } from './algae'
import { crustVertex, crustFragment } from './crustShader'
import { useDescentRef } from '@/lib/useDescent'

/* Boje uzorkovane s klijentovih fotografija amfore */
// Tamnije nego uzorak s fotografije: svijetli env je inace ispere u bez.
const TERRACOTTA = new THREE.Color('#b87052')
const CALCITE = new THREE.Color('#e3ddd0')   // fina bijela kora
const SEDIMENT = new THREE.Color('#a3987f')  // sivo-pjescani nanos

const NAVY = new THREE.Color('#09334e')   // Pantone 7463C
const ABYSS = new THREE.Color('#03141f')
const TEAL = new THREE.Color('#12777a')

const Y_TOP = 0.86
const Y_REST = -2.3

/* Hero poza: amfora lezi dijagonalno, kao na klijentovoj hero fotografiji.
   Pri prvom scrollu se uspravi i potone siljkom nadolje. */
const HERO_TILT = -0.92      // rad, ~ -53 stupnjeva
const HERO_X = 0        // centrirano; hero tipografija je preslozena u kutove
const HERO_SCALE = 1.04
const SINK_X = 1.55
const SINK_SCALE = 0.95

const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

/* Scratch objekti. Na module scopeu jer je instanca jedna, a mutiranje
   useMemo vrijednosti React Compiler ispravno prijavljuje kao gresku. */
const _fog = new THREE.Color()
const _mat4 = new THREE.Matrix4()
const _scale = new THREE.Vector3()

export default function AmphoraMesh({ rich, still }: { rich: boolean; still: boolean }) {
  const p = useDescentRef()
  const group = useRef<THREE.Group>(null)
  const shells = useRef<THREE.InstancedMesh>(null)
  const smooth = useRef(0)
  const intro = useRef(0)
  const scene = useThree((s) => s.scene)

  const geometry = useMemo(() => {
    const g = new THREE.LatheGeometry(amphoraProfile(rich ? 110 : 64), rich ? 96 : 48)
    g.computeVertexNormals()
    roughenClay(g, rich ? 0.0018 : 0.0014)
    g.translate(0, -AMPHORA_HEIGHT / 2, 0) // pivot u sredinu, da rotacija ne baca izvan kadra
    return g
  }, [rich])

  const handles = useMemo(() => handleGeometry(rich), [rich])
  const shellGeo = useMemo(() => oysterGeometry(), [])
  const placements = useMemo(() => oysterPlacements(rich ? 46 : 26), [rich])

  const algae = useRef<THREE.InstancedMesh>(null)
  const bladeGeo = useMemo(() => bladeGeometry(), [])
  const algaeData = useMemo(() => algaePlacements(rich ? 96 : 44), [rich])
  const algaeUniforms = useMemo(
    () => ({
      uDescent: { value: 0 },
      uTime: { value: 0 },
      // Svjetlije nego sto bi alga bila na suhom: na 20 m i u tamnoj vodi
      // tamnozelena se stopi s podlogom i efekt se izgubi.
      uBase: { value: new THREE.Color('#3d5f2a') },
      uTip: { value: new THREE.Color('#9dbf63') },
    }),
    [],
  )

  // Matrice i per-instance atributi alga postavljaju se JEDNOM; rast i
  // valovanje idu u shaderu, pa CPU ne dira 96 matrica po frameu.
  useEffect(() => {
    const im = algae.current
    if (!im) return
    algaeData.matrices.forEach((m, i) => im.setMatrixAt(i, m))
    im.instanceMatrix.needsUpdate = true
    im.geometry.setAttribute('aAppear', new THREE.InstancedBufferAttribute(algaeData.appear, 1))
    im.geometry.setAttribute('aPhase', new THREE.InstancedBufferAttribute(algaeData.phase, 1))
  }, [algaeData])

  const crustUniforms = useMemo(
    () => ({
      uCrust: { value: 0 },
      uShell: { value: CALCITE },
      uCoral: { value: SEDIMENT },
      uWater: { value: NAVY.clone() },
    }),
    [],
  )

  /* Uniformi se mutiraju KROZ REF na materijal, ne kroz useMemo vrijednost. */
  const crustMat = useRef<THREE.ShaderMaterial>(null)
  const algaeMat = useRef<THREE.ShaderMaterial>(null)

  useFrame((state, dt) => {
    const target = p.current
    smooth.current = still ? target : lerp(smooth.current, target, Math.min(1, dt * 3.4))
    const d = smooth.current

    // Ulazna animacija: amfora se slegne u hero pozu. Kratka i jednokratna.
    if (intro.current < 1) intro.current = Math.min(1, intro.current + dt / 1.9)
    const io = still ? 1 : easeOut(intro.current)

    if (group.current) {
      // 0 = lezi dijagonalno (hero), 1 = uspravno i tone
      const tip = THREE.MathUtils.smoothstep(d, 0.015, 0.19)
      // na dnu ponovno legne
      const settle = THREE.MathUtils.smoothstep(d, 0.84, 1)
      const sink = THREE.MathUtils.smoothstep(d, 0, 0.26)

      // Na uskom viewportu je vidljiva SIRINA mala (na 390x844 svega ~2,9
      // world unita), pa SINK_X od 1,55 padne izvan kadra. Clamp na stvarnu
      // polusirinu umjesto fiksne vrijednosti.
      const halfW = state.viewport.width / 2
      const narrow = Math.min(1, state.viewport.width / 4.4)  // 1 na desktopu, ~0,66 na 390px
      const wantX = lerp(HERO_X, SINK_X, sink)
      const margin = 1.5 * HERO_SCALE * narrow
      group.current.position.x = Math.max(-(halfW - margin), Math.min(halfW - margin, wantX))
      // Amfora u vodi gotovo odmah dosegne terminalnu brzinu — blago
      // ubrzanje (^1.15), ne slobodan pad.
      group.current.position.y = lerp(Y_TOP, Y_REST, Math.pow(d, 1.15)) + (1 - io) * 0.55
      const sc = lerp(HERO_SCALE, SINK_SCALE, sink) * lerp(0.9, 1, io) * lerp(0.58, 1, narrow)
      group.current.scale.setScalar(sc)

      group.current.rotation.y = d * Math.PI * 1.5 + (1 - io) * -0.6
      group.current.rotation.z =
        lerp(HERO_TILT, 0, tip) + Math.sin(d * Math.PI * 1.3) * 0.2 * tip - settle * 1.4
    }

    _fog.copy(TEAL).lerp(NAVY, Math.min(1, d / 0.38)).lerp(ABYSS, Math.max(0, (d - 0.38) / 0.62))

    if (crustMat.current) {
      crustMat.current.uniforms.uCrust.value = THREE.MathUtils.clamp((d - 0.14) / 0.86, 0, 1)
      crustMat.current.uniforms.uWater.value = _fog
    }
    if (algaeMat.current) {
      algaeMat.current.uniforms.uDescent.value = d
      algaeMat.current.uniforms.uTime.value = state.clock.elapsedTime
    }
    if (scene.fog) (scene.fog as THREE.Fog).color.copy(_fog)

    // Kamenice se pojavljuju JEDNA PO JEDNA dok amfora pada. To je koncept:
    // pad je starenje, a kolonizacija je vidljivi dokaz proteklog vremena.
    const im = shells.current
    if (im) {
      for (let i = 0; i < placements.length; i++) {
        const pl = placements[i]
        const grow = THREE.MathUtils.smoothstep(d, pl.appearAt, pl.appearAt + 0.14)
        _scale.copy(pl.scale).multiplyScalar(grow)
        _mat4.compose(pl.pos, pl.quat, _scale)
        im.setMatrixAt(i, _mat4)
      }
      im.instanceMatrix.needsUpdate = true
    }
  })

  return (
    <group ref={group} position={[HERO_X, Y_TOP, 0]} scale={HERO_SCALE}>
      {/* Pecena glina: matirana, bez metalnosti. Nista prozirno — amfora nije staklo. */}
      <mesh geometry={geometry}>
        <meshStandardMaterial
          color={TERRACOTTA}
          roughness={0.92}
          metalness={0}
          envMapIntensity={1.05}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Rucke */}
      {[0, Math.PI].map((rot) => (
        <mesh key={rot} geometry={handles} rotation={[0, rot, 0]}>
          <meshStandardMaterial
            color={TERRACOTTA}
            roughness={0.92}
            metalness={0}
            envMapIntensity={1.05}
          />
        </mesh>
      ))}

      {/* Fina kalcificirana kora — raste s dubinom */}
      <mesh geometry={geometry} scale={1.008}>
        <shaderMaterial
          ref={crustMat}
          vertexShader={crustVertex}
          fragmentShader={crustFragment}
          uniforms={crustUniforms}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Alge — izrastu i valovito se micu dok amfora tone */}
      <instancedMesh ref={algae} args={[bladeGeo, undefined, algaeData.matrices.length]}>
        <shaderMaterial
          ref={algaeMat}
          vertexShader={algaeVertex}
          fragmentShader={algaeFragment}
          uniforms={algaeUniforms}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </instancedMesh>

      {/* Kamenice */}
      <instancedMesh
        ref={shells}
        args={[shellGeo, undefined, placements.length]}
        castShadow={false}
        receiveShadow={false}
      >
        {/* Matirano bijelo, nisko envMapIntensity — s visokim su izlazile
            kao ledene krhotine, a ne kao kamenice. */}
        <meshStandardMaterial
          color="#f4efe4"
          roughness={0.88}
          metalness={0}
          envMapIntensity={0.55}
          side={THREE.DoubleSide}
        />
      </instancedMesh>
    </group>
  )
}
