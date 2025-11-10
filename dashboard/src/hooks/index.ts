// Custom hooks for the CubeSat dashboard

import { useEffect, useState, useCallback, useRef } from 'react'
import type { CubeSatTelemetry } from '@/types'
import {
  getCubeSatTelemetry,
  generateTelemetry,
  startTelemetryUpdates,
  stopTelemetryUpdates,
} from '@/data/cubesatData'
import { TELEMETRY_UPDATE_INTERVAL } from '@/lib/constants'

/**
 * Hook to manage real-time telemetry data
 */
export const useTelemetry = () => {
  const [telemetryData, setTelemetryData] = useState<CubeSatTelemetry>(
    getCubeSatTelemetry()
  )
  const [isLive, setIsLive] = useState(true)

  useEffect(() => {
    if (!isLive) return

    const updateInterval = startTelemetryUpdates((newData) => {
      setTelemetryData(newData)
    })

    return () => {
      stopTelemetryUpdates()
    }
  }, [isLive])

  const toggleLive = useCallback(() => {
    setIsLive((prev) => !prev)
  }, [])

  const refresh = useCallback(() => {
    const newData = generateTelemetry()
    setTelemetryData(newData)
  }, [])

  return {
    telemetryData,
    isLive,
    toggleLive,
    refresh,
  }
}

/**
 * Hook for managing temperature data with memoization
 */
export const useTemperatures = () => {
  const [temperatures, setTemperatures] = useState<number[]>([24, 24, 24, 24])

  useEffect(() => {
    setTemperatures([15, 16, 17, 18].map(() => 24 + Math.round(Math.random() * 5)))
  }, [])

  return temperatures
}

/**
 * Hook for debounced window resize
 */
export const useDebounceResize = (callback: () => void, delay: number = 250) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const handleResize = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = setTimeout(callback, delay)
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [callback, delay])
}

/**
 * Hook for managing canvas animations
 */
export const useCanvasAnimation = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  animate: (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => void
) => {
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let isRunning = true

    const loop = () => {
      if (!isRunning) return
      animate(ctx, canvas)
      animationId = requestAnimationFrame(loop)
    }

    loop()

    return () => {
      isRunning = false
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [canvasRef, animate])
}

/**
 * Hook for performance monitoring (development only)
 */
export const usePerformanceMonitor = (componentName: string) => {
  const renderCount = useRef(0)
  const startTime = useRef(Date.now())

  useEffect(() => {
    renderCount.current += 1
    if (process.env.NODE_ENV === 'development') {
      console.log(
        `[${componentName}] Render #${renderCount.current} at ${Date.now() - startTime.current}ms`
      )
    }
  })
}
