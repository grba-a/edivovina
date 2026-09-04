'use client'

import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { useState } from 'react'
import * as THREE from 'three'
import AmphoraMesh from './AmphoraMesh'

export default function BottleCanvas() {
  /* Lazy inicijalizatori, ne efekt: komponenta se ucitava s ssr:false pa
     window postoji vec pri prvom renderu. Efekt bi izazvao kaskadni render. */
  const [rich] = useState(() => window.matchMedia('(min-width: 768px)').matches)
  const [still] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)

  return (
    <div aria-hidden className="ed-canvas pointer-events-none fixed inset-0 z-[2]">
      <Canvas
        dpr={rich ? [1, 1.5] : [1, 1]}
        // Mobitel i reduced-motion: crta samo kad se p promijeni (descent event
        // zove invalidate kroz Canvas). Desktop vrti trajni tumble.
        frameloop={rich && !still ? 'always' : 'demand'}
        camera={{ position: [0, 0, 11], fov: 32 }}
        gl={{ antialias: rich, alpha: true, powerPreference: 'high-performance' }}
        onCreated={({ gl, scene, invalidate }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 1.05
          scene.fog = new THREE.Fog('#12777a', 13, 26)
          const on = () => invalidate()
          window.addEventListener('descent', on)
          if (process.env.NODE_ENV !== 'production') {
            ;(window as unknown as Record<string, unknown>).__scene = scene
          }
        }}
      >
        <ambientLight intensity={0.75} color="#9fd6d2" />
        {/* Glavno svjetlo dolazi ODOZGO, s povrsine — to je ono sto boci daje rub */}
        <directionalLight position={[-2, 9, 3]} intensity={2.6} color="#f2fbf7" />
        <directionalLight position={[5, 1, 4]} intensity={0.9} color="#8fd3cd" />
        <directionalLight position={[-4, -3, -4]} intensity={0.4} color="#0d3a3d" />

        {/* Proceduralni env — bez ijednog vanjskog HDR-a s CDN-a */}
        {/* Proceduralni env: nijedan HDR s CDN-a. Svijetla ploca gore je
            povrsina mora i jedini razlog zasto se staklo cita kao staklo. */}
        <Environment resolution={rich ? 256 : 64}>
          <color attach="background" args={['#0d3f43']} />
          <mesh scale={50}>
            <sphereGeometry args={[1, 24, 24]} />
            <meshBasicMaterial color="#12595e" side={THREE.BackSide} />
          </mesh>
          <mesh position={[0, 12, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[26, 26, 1]}>
            <planeGeometry />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <mesh position={[-11, 4, 8]} rotation={[0, 0.6, 0]} scale={[9, 20, 1]}>
            <planeGeometry />
            <meshBasicMaterial color="#dff4ef" />
          </mesh>
          <mesh position={[12, -2, 6]} rotation={[0, -0.7, 0]} scale={[6, 16, 1]}>
            <planeGeometry />
            <meshBasicMaterial color="#5fb3ad" />
          </mesh>
        </Environment>

        <AmphoraMesh rich={rich} still={still} />
      </Canvas>
    </div>
  )
}
