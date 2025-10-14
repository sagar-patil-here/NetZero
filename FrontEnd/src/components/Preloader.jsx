import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GooeyText } from '@/components/ui/gooey-text-morphing'

const Preloader = ({ onLoadComplete }) => {
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    // Auto-complete after animation cycles
    const timer = setTimeout(() => {
      setIsComplete(true)
      setTimeout(() => {
        onLoadComplete()
      }, 300) // Quick transition
    }, 2000) // 2 seconds for preloader

    return () => clearTimeout(timer)
  }, [onLoadComplete])

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            scale: 1.05
          }}
          transition={{ 
            duration: 0.6, 
            ease: [0.43, 0.13, 0.23, 0.96]
          }}
          className="fixed inset-0 z-[150] flex items-center justify-center bg-neutral-950 dark:bg-black"
        >
          {/* Gooey Text Animation - Centered */}
          <motion.div 
            className="h-[200px] flex items-center justify-center"
            initial={{ scale: 1 }}
            exit={{ scale: 1.1, opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <GooeyText
              texts={["Carbon", "Track", "Loading", "..."]}
              morphTime={1}
              cooldownTime={0.25}
              className="font-bold"
              textClassName="text-white dark:text-white"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Preloader
