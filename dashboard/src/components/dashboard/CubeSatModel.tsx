'use client'

import { useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Box } from '@react-three/drei'
import * as THREE from 'three'

interface CubeSatModelProps {
  position?: [number, number, number]
  scale?: number
}

function CubeSat({ position = [2, 0, 0], scale = 0.15 }: CubeSatModelProps) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.5
    }
  })

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Main body */}
      <Box args={[1, 1, 1]}>
        <meshStandardMaterial color="#888888" metalness={0.8} roughness={0.2} />
      </Box>
      
      {/* Left solar panel */}
      <Box position={[-1.5, 0, 0]} args={[2, 0.05, 0.5]}>
        <meshStandardMaterial color="#2244ff" metalness={0.5} roughness={0.3} />
      </Box>
      
      {/* Right solar panel */}
      <Box position={[1.5, 0, 0]} args={[2, 0.05, 0.5]}>
        <meshStandardMaterial color="#2244ff" metalness={0.5} roughness={0.3} />
      </Box>
    </group>
  )
}

export function CubeSatModel(props: CubeSatModelProps) {
  return (
    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(50%, -50%)', width: '200px', height: '200px' }}>
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <CubeSat {...props} />
      </Canvas>
    </div>
  )
}