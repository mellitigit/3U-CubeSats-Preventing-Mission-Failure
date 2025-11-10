'use client'

import { useEffect, useRef, forwardRef } from 'react'
import dynamic from 'next/dynamic'
import type GlobeType from 'react-globe.gl'  // Static type import (no runtime cost)

const Globe = dynamic(
  () => import('react-globe.gl'),
  {
    ssr: false,
    loading: () => <div className="h-[500px] w-full bg-gray-900 animate-pulse" />  // Optional: Simple loading placeholder
  }
) as typeof GlobeType  // Type assertion to restore full typing, including props and ref support

interface WorldMapProps {
  className?: string
}

const WorldMapInner = forwardRef<HTMLDivElement, WorldMapProps>(function WorldMap({ className }, ref) {
  const globeRef = useRef<any | null>(null)

  useEffect(() => {
    if (globeRef.current) {
      globeRef.current.controls().autoRotate = true
      globeRef.current.controls().autoRotateSpeed = 0.5
    }
  }, [])

  // Satellite trajectory data
  const trajectoriesData = [{
    startLat: 0,
    startLng: -100,
    endLat: 30,
    endLng: 0,
    color: 'rgba(255, 255, 0, 0.6)',
    dashLength: 1,
    dashGap: 0.5
  }]

  // CubeSat objects data
  const cubeSatData = [{
    lat: 20,
    lng: 40,
    altitude: 0.15,
    color: '#888888'
  }] as Array<{lat: number, lng: number, altitude: number, color: string}>

  return (
    <div
      ref={ref}
      className={`h-[500px] w-full flex items-center justify-center ${className}`}
    >
      <div className="flex items-center justify-center h-[400px] w-[400px] relative">
        <Globe
          ref={globeRef}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
          backgroundColor="rgba(0,0,0,0)"
          arcColor="color"
          arcsData={trajectoriesData}
          arcDashLength="dashLength"
          arcDashGap="dashGap"
          arcDashAnimateTime={1500}
          atmosphereColor="#3a228a"
          atmosphereAltitude={0.25}
          objectsData={cubeSatData}
          objectLat={(d: any) => d.lat}
          objectLng={(d: any) => d.lng}
          objectAltitude={(d: any) => d.altitude}
          objectThreeObject={() => {
            // Create CubeSat geometry
            const group = new (window as any).THREE.Group()
            
            // Main body
            const bodyGeometry = new (window as any).THREE.BoxGeometry(0.02, 0.02, 0.02)
            const bodyMaterial = new (window as any).THREE.MeshLambertMaterial({ color: 0x888888 })
            const body = new (window as any).THREE.Mesh(bodyGeometry, bodyMaterial)
            group.add(body)
            
            // Solar panels
            const panelGeometry = new (window as any).THREE.BoxGeometry(0.04, 0.001, 0.01)
            const panelMaterial = new (window as any).THREE.MeshLambertMaterial({ color: 0x2244ff })
            
            const leftPanel = new (window as any).THREE.Mesh(panelGeometry, panelMaterial)
            leftPanel.position.x = -0.03
            group.add(leftPanel)
            
            const rightPanel = new (window as any).THREE.Mesh(panelGeometry, panelMaterial)
            rightPanel.position.x = 0.03
            group.add(rightPanel)
            
            return group
          }}
        />
      </div>
    </div>
  )
})

export const WorldMap = forwardRef<HTMLDivElement, WorldMapProps>((props, ref) => <WorldMapInner {...props} ref={ref} />)