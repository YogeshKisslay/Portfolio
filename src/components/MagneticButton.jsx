import { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export const MagneticButton = ({ children, strength = 0.38, className = '' }) => {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 200, damping: 14 })
  const springY = useSpring(y, { stiffness: 200, damping: 14 })

  const onMouseMove = (e) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    x.set((e.clientX - cx) * strength)
    y.set((e.clientY - cy) * strength)
  }

  const onMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ x: springX, y: springY, display: 'inline-flex' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
