import { useEffect, useRef } from 'react'

export const ParticleField = () => {
  const canvasRef = useRef(null)
  const mouseRef = useRef({ x: -1000, y: -1000 })
  const animRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()

    const onResize = () => resize()
    const onMove = (e) => { mouseRef.current = { x: e.clientX, y: e.clientY } }

    window.addEventListener('resize', onResize)
    window.addEventListener('mousemove', onMove, { passive: true })

    const SPACING = 52
    const BASE_R = 1.2
    const GLOW_DIST = 200
    const SECONDARY_DIST = 350

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const cols = Math.ceil(canvas.width / SPACING) + 1
      const rows = Math.ceil(canvas.height / SPACING) + 1
      const { x: mx, y: my } = mouseRef.current

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const px = i * SPACING
          const py = j * SPACING
          const dx = px - mx
          const dy = py - my
          const dist = Math.sqrt(dx * dx + dy * dy)

          // Primary glow zone
          const t1 = Math.max(0, 1 - dist / GLOW_DIST)
          // Secondary dim zone
          const t2 = Math.max(0, 1 - dist / SECONDARY_DIST) * 0.3

          const alpha = 0.055 + Math.max(t1, t2) * 0.6
          const r = BASE_R + t1 * 2.8

          // Outer halo for dots in primary zone
          if (t1 > 0.05) {
            ctx.beginPath()
            ctx.arc(px, py, r + 3, 0, Math.PI * 2)
            const haloGrad = ctx.createRadialGradient(px, py, r * 0.5, px, py, r + 3)
            haloGrad.addColorStop(0, `rgba(6, 182, 212, ${t1 * 0.25})`)
            haloGrad.addColorStop(1, 'rgba(6, 182, 212, 0)')
            ctx.fillStyle = haloGrad
            ctx.fill()
          }

          // Dot itself
          ctx.beginPath()
          ctx.arc(px, py, r, 0, Math.PI * 2)
          // Near dots get a cyan-to-white tint
          if (t1 > 0.6) {
            ctx.fillStyle = `rgba(180, 240, 255, ${alpha})`
          } else {
            ctx.fillStyle = `rgba(6, 182, 212, ${alpha})`
          }
          ctx.fill()
        }
      }

      animRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousemove', onMove)
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  )
}
