'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { sampleSurface } from './surface'
import { oysterGeometry, oysterPlacements } from './oyster'
import { bladeGeometry, algaePlacements, algaeVertex, algaeFragment } from './algae'
import { cageBars, seabedBlades, CAGE } from './cage'
import { fishGeometry, fishShoals, fishVertex, fishFragment } from './fish'
import { useDescentRef } from '@/lib/useDescent'
import { getStage } from '@/lib/stage'

const MODEL = '/model/amphora.glb'

/**
 * Proceduralni rast (kamenice + alge koje se pojavljuju s dubinom).
 *
 * Bio je potreban dok je amfora bila proceduralni lathe bez obrastaja. Model iz
 * Higgsfielda dolazi VEC obrastao — pravi, fotografirani obrastaj — pa rast
 * postaje suvisan sloj koji se s njim tuce: kamenice hvataju teal iz
 * environmenta i citaju se kao cyan kristali.
 *
 * false = amfora izgleda tocno kao na fotografiji, cijelim spustom.
 * Spust i dalje stari kroz vodu (teal -> navy), dubinomjer i brojac dana.
 */
const GROWTH = false

/* Boje uzorkovane s klijentovih fotografija amfore */
const CLAY = new THREE.Color('#c08265')
const NAVY = new THREE.Color('#09334e') // Pantone 7463C
const ABYSS = new THREE.Color('#03141f')
const TEAL = new THREE.Color('#12777a')

/** Model je normaliziran na visinu 1,0 s pivotom u centru. */
const MODEL_H = 1
const SCALE = 3

/* Pocetna visina u heru ovisi o kadru:
   desktop je centriran (0,05), a na mobitelu amfora stoji VISE (0,86) jer
   inace sjedne na naslov. Ista formula kao za scale — narrow^2. */
const Y_TOP_WIDE = 0.45
const Y_TOP_NARROW = 1.5
/* Amfora sjedne UNUTAR kaveza: gornja resetka prolazi kroz donji dio tijela,
   kao na fotkama s dna. Izvedeno iz CAGE-a da odnos ostane istinit i kad se
   dimenzije kaveza promijene. */
const Y_REST = CAGE.base + (SCALE * MODEL_H) / 2 - 0.05

/* Hero poza. Nagib je smanjen s -53 na -24 stupnja: gotovo vodoravna amfora
   je zauzimala cijelu sirinu kadra i pokrivala naslov, a trebala bi presjeci
   samo njegov rep — kao boca preko „RELEASE" u referenci. Uspravnija poza je i
   tocnija: predmet koji tone siljkom nadolje vec je krenuo dolje. */
const HERO_TILT = -0.42 // rad, ~ -24 stupnja
const HERO_X = 0
const HERO_SCALE = 1.45
/* Osnovna putanja spusta. Na nju se ZBRAJA koreografija postaje (stage.ts):
   predmet i dalje tone po sredini i sjeda u leziste u centru, ali usput skrece
   i mijenja velicinu ovisno o tome sto se na toj dubini cita.

   Prije je bio samo pad. Sad je pad KROZ stranicu.                         */
const SINK_X = 0
const SINK_SCALE = 1.02

/* Koliko brzo predmet stize na novu poziciju postaje. Sporije od scrolla
   namjerno: skretanje mora izgledati kao otpor vode, ne kao snap. */
const STAGE_EASE = 2.1

const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

/* Scratch objekti na module scopeu — instanca je jedna, a mutiranje useMemo
   vrijednosti React Compiler ispravno prijavljuje kao gresku. */
const _fog = new THREE.Color()
/* Uniform obraštaja. Na module scopeu jer ga cita onBeforeCompile (koji tece
   tokom rendera), a ref procitan u renderu otruje cijeli memo. */
const _crustU = { value: 0 }
const _mat4 = new THREE.Matrix4()
const _scale = new THREE.Vector3()

/**
 * Maska obraštaja iz zapecene teksture.
 *
 * Model iz Higgsfielda dolazi VEC obrastao, pa bi bez ovoga amfora bila
 * prekrivena skoljkama vec na vrhu stranice — a cijeli koncept je da obrasta
 * DOK pada. Kora i glina se razdvajaju po saturaciji: kora je nezasiceno
 * bijela (19,4% atlasa), glina je terakota (79,7%).
 *
 * Bonus: crvene i sive tracke gdje su kartonska vrpca i zeljezno leziste
 * dotakli model odbacuju se istim testom i zamjenjuju glinom.
 */
const CRUST_MASK = /* glsl */ `
  vec4 texel = texture2D( map, vMapUv );

  float mx = max(texel.r, max(texel.g, texel.b));
  float mn = min(texel.r, min(texel.g, texel.b));
  float sat = mx - mn;
  float luma = dot(texel.rgb, vec3(0.299, 0.587, 0.114));

  // nezasiceno i svijetlo = kalcificirana kora
  float crust = (1.0 - smoothstep(0.055, 0.17, sat)) * smoothstep(0.46, 0.74, luma);

  // artefakti bakea: jako zasicena crvena (vrpca) i tamna neutralna (leziste)
  float tagRed = smoothstep(0.30, 0.46, sat) * step(texel.b + 0.10, texel.r) * step(0.34, luma);
  float ironGrey = (1.0 - smoothstep(0.05, 0.12, sat)) * (1.0 - smoothstep(0.16, 0.34, luma));
  float artifact = clamp(tagRed + ironGrey, 0.0, 1.0);

  // glina iste svjetline kao piksel koji zamjenjuje — cuva reljef
  vec3 clay = uClay * (0.55 + 0.85 * luma);

  // kora se otkriva postupno; artefakti nikad
  float reveal = crust * uCrust * (1.0 - artifact);
  vec3 base = mix(clay, texel.rgb, max(reveal, (1.0 - crust) * (1.0 - artifact)));

  diffuseColor *= vec4(base, texel.a);
`

export default function AmphoraMesh({ rich, still }: { rich: boolean; still: boolean }) {
  const p = useDescentRef()
  const group = useRef<THREE.Group>(null)
  const shells = useRef<THREE.InstancedMesh>(null)
  const algae = useRef<THREE.InstancedMesh>(null)
  const smooth = useRef(0)
  const intro = useRef(0)
  /* Koreografija se izglada zasebno od spusta: skok na novu postaju bi inace
     bio trenutan, a predmet u vodi nema trenutnih poteza. */
  const stageX = useRef(0)
  const stageScale = useRef(1)
  const cage = useRef<THREE.InstancedMesh>(null)
  const seabed = useRef<THREE.InstancedMesh>(null)
  const fish = useRef<THREE.InstancedMesh>(null)
  const fishMat = useRef<THREE.ShaderMaterial>(null)
  const seabedMat = useRef<THREE.ShaderMaterial>(null)
  const torch = useRef<THREE.DirectionalLight>(null)
  const scene = useThree((s) => s.scene)

  const { nodes } = useGLTF(MODEL)

  /** Geometrija i KLON materijala — GLTF je kesiran, original se ne dira. */
  const { geometry, material } = useMemo(() => {
    const mesh = Object.values(nodes).find((n) => (n as THREE.Mesh).isMesh) as THREE.Mesh
    const geo = mesh.geometry
    const mat = (mesh.material as THREE.MeshStandardMaterial).clone()

    mat.roughness = 0.94
    mat.metalness = 0
    mat.envMapIntensity = 1.05
    mat.onBeforeCompile = (shader) => {
      shader.uniforms.uCrust = _crustU
      shader.uniforms.uClay = { value: CLAY }
      shader.fragmentShader = shader.fragmentShader
        .replace('void main() {', 'uniform float uCrust;\nuniform vec3 uClay;\nvoid main() {')
        .replace('#include <map_fragment>', CRUST_MASK)
    }
    mat.needsUpdate = true
    return { geometry: geo, material: mat }
  }, [nodes])

  /* Kamenice i alge sjede na STVARNOJ povrsini modela, ne na proceduralnom
     profilu — inace bi lebdjele uz nju. */
  const shellGeo = useMemo(() => oysterGeometry(), [])
  const shellPlacements = useMemo(
    () => oysterPlacements(sampleSurface(geometry, rich ? 46 : 26, 0x5eed, 0.72), MODEL_H),
    [geometry, rich],
  )

  const bars = useMemo(() => cageBars(), [])
  const barGeo = useMemo(() => new THREE.BoxGeometry(1, 1, 1), [])

  const flora = useMemo(() => seabedBlades(rich ? 220 : 90), [rich])
  const shoals = useMemo(() => fishShoals(), [])

  /**
   * Instancirani atributi se postavljaju NA GEOMETRIJU, u istom memou.
   * Dodavanje atributa u useEffectu ne osvjezi binding programa koji je vec
   * kompajliran bez njih — riba je zbog toga citala aBand kao 0 i cijelo jato
   * se crtalo naslagano u centru, na povrsini.
   */
  const fishGeo = useMemo(() => {
    const g = fishGeometry()
    g.setAttribute('aBand', new THREE.InstancedBufferAttribute(shoals.band, 1))
    g.setAttribute('aSpeed', new THREE.InstancedBufferAttribute(shoals.speed, 1))
    g.setAttribute('aPhase', new THREE.InstancedBufferAttribute(shoals.phase, 1))
    return g
  }, [shoals])

  /* Dno i alge na amfori imaju SVOJU kopiju trake: dijeljena geometrija bi
     znacila da drugi mesh prepise aAppear prvome. */
  const seabedGeo = useMemo(() => {
    const g = bladeGeometry()
    g.setAttribute('aAppear', new THREE.InstancedBufferAttribute(flora.appear, 1))
    g.setAttribute('aPhase', new THREE.InstancedBufferAttribute(flora.phase, 1))
    return g
  }, [flora])
  const fishUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uDescent: { value: 0 },
      uSpan: { value: 10 },
      uColor: { value: new THREE.Color('#06212f') },
    }),
    [],
  )
  const seabedUniforms = useMemo(
    () => ({
      uDescent: { value: 0 },
      uTime: { value: 0 },
      uBase: { value: new THREE.Color('#16341c') },
      uTip: { value: new THREE.Color('#5c8038') },
    }),
    [],
  )

  const algaeData = useMemo(
    () => algaePlacements(sampleSurface(geometry, rich ? 96 : 44, 0xa19ae, 1.45), MODEL_H),
    [geometry, rich],
  )

  const bladeGeo = useMemo(() => {
    const g = bladeGeometry()
    g.setAttribute('aAppear', new THREE.InstancedBufferAttribute(algaeData.appear, 1))
    g.setAttribute('aPhase', new THREE.InstancedBufferAttribute(algaeData.phase, 1))
    return g
  }, [algaeData])
  const algaeUniforms = useMemo(
    () => ({
      uDescent: { value: 0 },
      uTime: { value: 0 },
      uBase: { value: new THREE.Color('#3d5f2a') },
      uTip: { value: new THREE.Color('#9dbf63') },
    }),
    [],
  )
  const algaeMat = useRef<THREE.ShaderMaterial>(null)

  /* Matrice i per-instance atributi postavljaju se JEDNOM. Rast, valovanje i
     plivanje idu u shaderu, pa CPU po frameu ne dira nijednu od ~300 matrica. */
  useEffect(() => {
    const im = algae.current
    if (!im || !GROWTH) return
    algaeData.matrices.forEach((m, i) => im.setMatrixAt(i, m))
    im.instanceMatrix.needsUpdate = true
  }, [algaeData])

  useEffect(() => {
    const im = seabed.current
    if (!im) return
    flora.matrices.forEach((m, i) => im.setMatrixAt(i, m))
    im.instanceMatrix.needsUpdate = true
  }, [flora])

  useEffect(() => {
    const im = fish.current
    if (!im) return
    shoals.matrices.forEach((m, i) => im.setMatrixAt(i, m))
    im.instanceMatrix.needsUpdate = true
  }, [shoals])

  useFrame((state, dt) => {
    const target = p.current
    smooth.current = still ? target : lerp(smooth.current, target, Math.min(1, dt * 3.4))
    const d = smooth.current

    if (intro.current < 1) intro.current = Math.min(1, intro.current + dt / 1.9)
    const io = still ? 1 : easeOut(intro.current)

    if (group.current) {
      const tip = THREE.MathUtils.smoothstep(d, 0.015, 0.19)
      // Amfore u kavezima STOJE. Zato zavrsna poza ide u uspravno, ne u lezece.
      // Postaja Nagrade traje do d 1,0, pa sjedanje mora pocet tek u footeru.
      const settle = THREE.MathUtils.smoothstep(d, 0.93, 1)
      const sink = THREE.MathUtils.smoothstep(d, 0, 0.26)

      // Na uskom viewportu je vidljiva SIRINA mala (na 390x844 svega ~2,9
      // world unita), pa SINK_X od 1,55 padne izvan kadra. Clamp na stvarnu
      // polusirinu umjesto fiksne vrijednosti.
      /* Koreografija postaje. Cita se svaki frame jer se scroll i tako mijenja;
         izglada se prema cilju umjesto da skoci. */
      const st = getStage()
      const k = still ? 1 : Math.min(1, dt * STAGE_EASE)
      stageX.current = lerp(stageX.current, st.x, k)
      stageScale.current = lerp(stageScale.current, st.scale, k)

      const narrow = Math.min(1, state.viewport.width / 4.4)
      // narrow^2 je namjerno: linearni lerp ne moze istovremeno dati vecu
      // amforu na desktopu i ostaviti mobilnu velicinu netaknutom.
      const wide = narrow * narrow
      /* Osnovna putanja + skretanje postaje, ograniceno stvarnom polusirinom
         kadra: na 390 px je vidljiva sirina svega ~2,9 world unita, pa bi
         fiksni pomak izbacio amforu izvan ekrana. */
      const halfW = state.viewport.width * 0.5
      const drift = THREE.MathUtils.clamp(stageX.current, -halfW * 0.62, halfW * 0.62)
      group.current.position.x = lerp(HERO_X, SINK_X, sink) + drift
      // Amfora u vodi gotovo odmah dosegne terminalnu brzinu — blago
      // ubrzanje (^1.15), ne slobodan pad.
      const yTop = lerp(Y_TOP_NARROW, Y_TOP_WIDE, wide)
      group.current.position.y = lerp(yTop, Y_REST, Math.pow(d, 1.15)) + (1 - io) * 0.55
      // desktop (wide=1) -> 1,45 · mobitel (wide~0,44) -> 1,45*0,61 = 0,88
      const sc =
        lerp(HERO_SCALE, SINK_SCALE, sink) *
        lerp(0.9, 1, io) *
        lerp(0.31, 1, wide) *
        stageScale.current
      group.current.scale.setScalar(sc * SCALE)

      group.current.rotation.y = d * Math.PI * 1.5 + (1 - io) * -0.6
      group.current.rotation.z =
        lerp(HERO_TILT, 0, tip) + Math.sin(d * Math.PI * 1.3) * 0.2 * tip * (1 - settle)
      // usporava i poravna se u zadnjoj cetvrtini, kao da sjeda
      group.current.rotation.y = lerp(group.current.rotation.y, Math.PI * 0.12, settle)
    }

    _fog.copy(TEAL).lerp(NAVY, Math.min(1, d / 0.38)).lerp(ABYSS, Math.max(0, (d - 0.38) / 0.62))
    // Bez rasta model pokazuje svoj puni zapeceni obrastaj od prvog kadra.
    _crustU.value = GROWTH ? THREE.MathUtils.clamp((d - 0.12) / 0.78, 0, 1) : 1
    if (GROWTH && algaeMat.current) {
      algaeMat.current.uniforms.uDescent.value = d
      algaeMat.current.uniforms.uTime.value = state.clock.elapsedTime
    }
    if (scene.fog) (scene.fog as THREE.Fog).color.copy(_fog)

    // Na 25 m nema danjeg svjetla. Topla svjetiljka jaca s dubinom — inace
    // amfora posivi u navy magli i prestane biti terakota.
    if (torch.current) torch.current.intensity = THREE.MathUtils.smoothstep(d, 0.3, 0.95) * 2.6

    if (fishMat.current) {
      fishMat.current.uniforms.uTime.value = state.clock.elapsedTime
      fishMat.current.uniforms.uDescent.value = d
      fishMat.current.uniforms.uSpan.value = state.viewport.width
    }
    if (seabedMat.current) {
      seabedMat.current.uniforms.uTime.value = state.clock.elapsedTime
      seabedMat.current.uniforms.uDescent.value = d
    }

    // Kavez izlazi iz mraka na samom dnu spusta
    const cg = cage.current
    if (cg) {
      const show = THREE.MathUtils.smoothstep(d, 0.9, 1)
      cg.visible = show > 0.01
      for (let i = 0; i < bars.length; i++) {
        const b = bars[i]
        _scale.copy(b.scale).multiplyScalar(show)
        _mat4.compose(b.pos, b.quat, _scale)
        cg.setMatrixAt(i, _mat4)
      }
      cg.instanceMatrix.needsUpdate = true
    }

    // Kamenice se pojavljuju JEDNA PO JEDNA dok amfora pada. To je koncept:
    // pad je starenje, a kolonizacija je vidljivi dokaz proteklog vremena.
    const im = GROWTH ? shells.current : null
    if (im) {
      for (let i = 0; i < shellPlacements.length; i++) {
        const pl = shellPlacements[i]
        const grow = THREE.MathUtils.smoothstep(d, pl.appearAt, pl.appearAt + 0.14)
        _scale.copy(pl.scale).multiplyScalar(grow)
        _mat4.compose(pl.pos, pl.quat, _scale)
        im.setMatrixAt(i, _mat4)
      }
      im.instanceMatrix.needsUpdate = true
    }
  })

  return (
    <>
      {/* Baklja — jaca s dubinom */}
      <directionalLight ref={torch} position={[2.4, -1.2, 5]} intensity={0} color="#ffd9a8" />

      {/* Ribe: tri jata na tri dubine. Plosnate siluete — na 15-20 m riba i
          JEST silueta, pa je to i najtocnije i najjeftinije.
          Samo na desktopu: na mobitelu je frameloop 'demand' i ribe bi stajale
          u mjestu, a ukocena riba je losija od nikakve. */}
      {rich && (
      <instancedMesh ref={fish} args={[fishGeo, undefined, shoals.matrices.length]}>
        <shaderMaterial
          ref={fishMat}
          vertexShader={fishVertex}
          fragmentShader={fishFragment}
          uniforms={fishUniforms}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </instancedMesh>
      )}

      {/* Morsko dno: posidonija oko lezista */}
      <instancedMesh ref={seabed} args={[seabedGeo, undefined, flora.matrices.length]}>
        <shaderMaterial
          ref={seabedMat}
          vertexShader={algaeVertex}
          fragmentShader={algaeFragment}
          uniforms={seabedUniforms}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </instancedMesh>

      {/* Kavez: varena armaturna mreza s dna. NIJE dijete amfore — ne smije
          se skalirati i rotirati s njom. */}
      <instancedMesh ref={cage} args={[barGeo, undefined, bars.length]} visible={false}>
        <meshStandardMaterial
          color="#7d4f33"
          roughness={0.95}
          metalness={0.25}
          envMapIntensity={0.5}
        />
      </instancedMesh>

    <group ref={group} position={[HERO_X, Y_TOP_NARROW, 0]} scale={HERO_SCALE * SCALE}>
      <mesh geometry={geometry} material={material} />

      {GROWTH && (
        <>
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

      {/* Kamenice — one nose rast siluete, sto tekstura ne moze */}
      <instancedMesh ref={shells} args={[shellGeo, undefined, shellPlacements.length]}>
        <meshStandardMaterial
          color="#f4efe4"
          roughness={0.88}
          metalness={0}
          envMapIntensity={0.55}
          side={THREE.DoubleSide}
        />
      </instancedMesh>
        </>
      )}
    </group>
    </>
  )
}

useGLTF.preload(MODEL)
