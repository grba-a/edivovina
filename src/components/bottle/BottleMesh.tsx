'use client'

import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { bottleProfile } from './profile'
import { crustVertex, crustFragment } from './crustShader'
import { useDescentRef } from '@/lib/useDescent'

const SHELL = new THREE.Color('#e8d9c6')
const CORAL = new THREE.Color('#c98a70')
const DEEP = new THREE.Color('#0d3a3d')
const ABYSS = new THREE.Color('#04191c')
const SHALLOW = new THREE.Color('#12777a')

const Y_TOP = 1.55
const Y_REST = -2.35

const lerp = (a: number, b: number, t: number) => a + (b - a) * t

export default function BottleMesh({ rich, still }: { rich: boolean; still: boolean }) {
  const p = useDescentRef()
  const group = useRef<THREE.Group>(null)
  const smooth = useRef(0)
  const scene = useThree((s) => s.scene)

  const geometry = useMemo(() => {
    const g = new THREE.LatheGeometry(bottleProfile(), rich ? 96 : 52)
    g.computeVertexNormals()
    g.translate(0, -1.5, 0) // pivot u sredinu boce da rotacija ne baca izvan kadra
    return g
  }, [rich])

  const crustUniforms = useMemo(
    () => ({
      uCrust: { value: 0 },
      uShell: { value: SHELL },
      uCoral: { value: CORAL },
      uWater: { value: DEEP.clone() },
    }),
    [],
  )

  const fogColor = useMemo(() => new THREE.Color(), [])

  useFrame((_, dt) => {
    const target = p.current
    // Bez izgladivanja boca trza na svaki scroll event; s njim pada s inercijom.
    smooth.current = still ? target : lerp(smooth.current, target, Math.min(1, dt * 3.4))
    const d = smooth.current

    if (group.current) {
      // Boca u vodi gotovo odmah dosegne terminalnu brzinu — zato blago
      // ubrzanje (^1.15), ne slobodan pad (^2).
      group.current.position.y = lerp(Y_TOP, Y_REST, Math.pow(d, 1.15))
      group.current.rotation.y = d * Math.PI * 1.55
      // tone uspravno, pa na dnu legne
      const settle = THREE.MathUtils.smoothstep(d, 0.82, 1)
      group.current.rotation.z = Math.sin(d * Math.PI * 1.4) * 0.28 - settle * 1.32
    }

    crustUniforms.uCrust.value = THREE.MathUtils.clamp((d - 0.2) / 0.8, 0, 1)
    fogColor.copy(SHALLOW).lerp(DEEP, Math.min(1, d / 0.38)).lerp(ABYSS, Math.max(0, (d - 0.38) / 0.62))
    crustUniforms.uWater.value = fogColor
    if (scene.fog) (scene.fog as THREE.Fog).color.copy(fogColor)
  })

  return (
    <group ref={group} position={[1.9, Y_TOP, 0]} scale={0.96}>
      {/*
        NE transmission. Dva razloga:
        1. Transmission refraktira SCENU, a voda je CSS div iza canvasa — nema
           sto refraktirati, boca ispadne crna.
        2. Puna vinska boca ionako nije prozirna.
        Ono sto je prodaje je tamno staklo s mokrim sjajem i rub koji hvata
        svjetlo s povrsine. To radi i na mobitelu, bez render targeta.
      */}
      <mesh geometry={geometry}>
        <meshPhysicalMaterial
          color="#08262a"
          roughness={0.16}
          metalness={0.04}
          clearcoat={1}
          clearcoatRoughness={0.05}
          envMapIntensity={2.4}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Etiketa — navy sa zlatnim hairlineom, kao na njihovoj Navis Mysterium
          boci. Daje mjerilo silueti i prva je koju obrastaj prekrije. */}
      <mesh position={[0, -0.44, 0]} scale={1.005}>
        <cylinderGeometry args={[0.379, 0.379, 0.82, rich ? 64 : 36, 1, true]} />
        <meshStandardMaterial color="#0e1c33" roughness={0.66} metalness={0.05} envMapIntensity={0.8} side={THREE.DoubleSide} />
      </mesh>
      {[-0.05, -0.83].map((y) => (
        <mesh key={y} position={[0, y, 0]} scale={1.009}>
          <cylinderGeometry args={[0.379, 0.379, 0.014, rich ? 64 : 36, 1, true]} />
          <meshStandardMaterial color="#d0a060" roughness={0.42} metalness={0.5} envMapIntensity={1.6} side={THREE.DoubleSide} />
        </mesh>
      ))}

      <mesh geometry={geometry} scale={1.012}>
        <shaderMaterial
          vertexShader={crustVertex}
          fragmentShader={crustFragment}
          uniforms={crustUniforms}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}
