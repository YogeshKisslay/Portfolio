import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export const CustomCursor = () => {
  const [visible, setVisible] = useState(false)
  const [hovering, setHovering] = useState(false)

  const mouseX = useMotionValue(-200)
  const mouseY = useMotionValue(-200)

  // High stiffness = snappy, no irritating lag
  const x = useSpring(mouseX, { stiffness: 700, damping: 50 })
  const y = useSpring(mouseY, { stiffness: 700, damping: 50 })

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) return

    const onMove = (e) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
      setVisible(true)
    }
    const onLeave = () => setVisible(false)
    const onOver = (e) => setHovering(!!e.target.closest('a, button'))

    window.addEventListener('mousemove', onMove, { passive: true })
    document.documentElement.addEventListener('mouseleave', onLeave)
    window.addEventListener('mouseover', onOver, { passive: true })

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      window.removeEventListener('mouseover', onOver)
    }
  }, [mouseX, mouseY])

  return (
    <div className="hidden md:block">
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{ x, y, translateX: '-50%', translateY: '-50%' }}
      >
        <motion.div
          animate={{
            scale: hovering ? 1.7 : 1,
            opacity: visible ? 1 : 0,
            borderColor: hovering ? 'rgba(6,182,212,0.95)' : 'rgba(6,182,212,0.5)',
            boxShadow: hovering ? '0 0 10px rgba(6,182,212,0.4)' : 'none',
          }}
          transition={{ duration: 0.13 }}
          className="w-6 h-6 rounded-full border border-cyan-400/50"
        />
      </motion.div>
    </div>
  )
}
