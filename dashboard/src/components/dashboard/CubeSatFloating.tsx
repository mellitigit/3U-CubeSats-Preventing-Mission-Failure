import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { Box } from '@react-three/drei'

export function CubeSatFloating() {
  const meshRef = useRef<any>(null)

  useFrame(({ clock }) => {
    if (meshRef.current) {
      // Animate position in a circular orbit around the origin
      const t = clock.getElapsedTime()
      const radius = 2.2
      meshRef.current.position.x = radius * Math.cos(t * 0.5)
      meshRef.current.position.z = radius * Math.sin(t * 0.5)
      meshRef.current.position.y = 0.5 * Math.sin(t * 0.8)
      meshRef.current.rotation.y = t * 0.7
      meshRef.current.rotation.x = t * 0.3
    }
  })

  return (
    <Box ref={meshRef} args={[0.2, 0.4, 0.2]}>
      <meshStandardMaterial color="#00eaff" metalness={0.7} roughness={0.3} />
    </Box>
  )
}
