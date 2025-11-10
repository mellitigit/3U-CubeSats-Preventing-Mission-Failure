'use client'

import { useEffect, useRef } from 'react'

export function AnimatedSpaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Star and nebula particles
    class Star {
      x: number
      y: number
      z: number
      size: number
      brightness: number
      twinkleSpeed: number
      color: string
      
      constructor() {
        this.x = Math.random() * (canvas?.width || 0)
        this.y = Math.random() * (canvas?.height || 0)
        this.z = Math.random() * 1000
        this.size = Math.random() * 3 + 1
        this.brightness = Math.random()
        this.twinkleSpeed = Math.random() * 0.02 + 0.005
        
        // Star colors - blues, whites, and slight pinks/oranges like in the galaxy
        const colors = [
          '#FFFFFF', '#E6F3FF', '#CCE7FF', '#B3DBFF', '#99CFFF',
          '#4A90E2', '#7BB3F0', '#A8C8EC', '#87CEEB', '#B0C4DE',
          '#FFE4B5', '#FFF8DC', '#F0E68C', '#DDA0DD'
        ]
        this.color = colors[Math.floor(Math.random() * colors.length)]
      }

      update() {
        this.brightness += this.twinkleSpeed
        if (this.brightness > 1 || this.brightness < 0.3) {
          this.twinkleSpeed *= -1
        }
        this.brightness = Math.max(0.3, Math.min(1, this.brightness))
      }

      draw() {
        if (!ctx) return
        const alpha = this.brightness
        ctx.save()
        ctx.globalAlpha = alpha
        ctx.fillStyle = this.color
        ctx.shadowBlur = this.size * 2
        ctx.shadowColor = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }
    }

    class NebulaParticle {
      x: number
      y: number
      size: number
      color: string
      alpha: number
      drift: number
      
      constructor() {
        this.x = Math.random() * (canvas?.width || 0)
        this.y = Math.random() * (canvas?.height || 0)
        this.size = Math.random() * 200 + 50
        this.alpha = Math.random() * 0.1 + 0.02
        this.drift = Math.random() * 0.5 + 0.1
        
        // Nebula colors - oranges, blues, and purples like in the galaxy
        const nebulaColors = [
          '#FF6B35', '#F7931E', '#FFB347', '#FF7F50',
          '#4169E1', '#6495ED', '#87CEEB', '#1E90FF',
          '#9370DB', '#8A2BE2', '#BA55D3', '#DDA0DD'
        ]
        this.color = nebulaColors[Math.floor(Math.random() * nebulaColors.length)]
      }

      update() {
        this.x += this.drift * 0.2
        this.y += Math.sin(Date.now() * 0.001 + this.x * 0.01) * 0.1
        
        if (canvas && this.x > canvas.width + this.size) {
          this.x = -this.size
        }
      }

      draw() {
        if (!ctx) return
        ctx.save()
        ctx.globalAlpha = this.alpha
        ctx.fillStyle = this.color
        ctx.filter = 'blur(40px)'
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }
    }

    // Create particles
    const stars: Star[] = []
    const nebulaParticles: NebulaParticle[] = []

    // Create stars
    for (let i = 0; i < 300; i++) {
      stars.push(new Star())
    }

    // Create nebula particles
    for (let i = 0; i < 15; i++) {
      nebulaParticles.push(new NebulaParticle())
    }

    // Animation loop
    const animate = () => {
      // Clear canvas with deep space black
      ctx.fillStyle = '#000510'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Create galaxy band gradient
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.addColorStop(0, 'rgba(70, 130, 180, 0.1)')
      gradient.addColorStop(0.3, 'rgba(255, 140, 0, 0.15)')
      gradient.addColorStop(0.5, 'rgba(255, 69, 0, 0.2)')
      gradient.addColorStop(0.7, 'rgba(255, 140, 0, 0.15)')
      gradient.addColorStop(1, 'rgba(70, 130, 180, 0.1)')

      // Draw galaxy band
      ctx.save()
      ctx.globalAlpha = 0.6
      ctx.fillStyle = gradient
      ctx.transform(1, 0, 0.3, 0.8, 0, canvas.height * 0.3)
      ctx.fillRect(0, 0, canvas.width, canvas.height * 0.4)
      ctx.restore()

      // Update and draw nebula particles
      nebulaParticles.forEach(particle => {
        particle.update()
        particle.draw()
      })

      // Update and draw stars
      stars.forEach(star => {
        star.update()
        star.draw()
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-10"
      style={{ background: 'radial-gradient(ellipse at center, #001122 0%, #000510 100%)' }}
    />
  )
}