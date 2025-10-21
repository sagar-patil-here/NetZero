import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ShaderAnimation } from '@/components/ui/shader-animation'

export default function TransitionOverlay({ isActive }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (isActive) {
      setVisible(true)
    } else {
      // Keep visible during transition, let Root.jsx control the timing
      const timer = setTimeout(() => setVisible(false), 300)
      return () => clearTimeout(timer)
    }
  }, [isActive])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[200] bg-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <ShaderAnimation />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
