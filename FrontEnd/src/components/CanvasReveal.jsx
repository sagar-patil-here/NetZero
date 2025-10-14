import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const CanvasReveal = ({ children, onComplete }) => {
  const [isRevealing, setIsRevealing] = useState(true)

  useEffect(() => {
    // Start reveal after a brief moment
    const timer = setTimeout(() => {
      setIsRevealing(false)
      // Notify parent that reveal is complete
      setTimeout(() => {
        onComplete?.()
      }, 1500) // Match the animation duration
    }, 100)

    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <AnimatePresence mode="wait">
      {isRevealing && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black dark:bg-neutral-950"
          initial={{ scale: 1, opacity: 1 }}
          exit={{ 
            scale: 0,
            opacity: 0,
            clipPath: 'circle(0% at 50% 50%)'
          }}
          transition={{
            duration: 1.5,
            ease: [0.43, 0.13, 0.23, 0.96] // Lazarev's signature easing
          }}
        >
          {/* Optional: Add a subtle logo or loading indicator in center */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 0.6 }}
            className="text-carbon-900"
          >
            {/* Logo placeholder - can be replaced with actual logo */}
            <div className="w-16 h-16 border-4 border-carbon-900 rounded-full animate-pulse" />
          </motion.div>
        </motion.div>
      )}
      
      {/* Content that scales in from center */}
      <motion.div
        initial={{ 
          scale: 0,
          opacity: 0,
          clipPath: 'circle(0% at 50% 50%)'
        }}
        animate={{ 
          scale: isRevealing ? 0 : 1,
          opacity: isRevealing ? 0 : 1,
          clipPath: isRevealing ? 'circle(0% at 50% 50%)' : 'circle(150% at 50% 50%)'
        }}
        transition={{
          duration: 1.5,
          delay: 0.1,
          ease: [0.43, 0.13, 0.23, 0.96]
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

export default CanvasReveal

