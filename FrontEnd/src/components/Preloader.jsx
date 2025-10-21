import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GooeyText } from '@/components/ui/gooey-text-morphing'

const Preloader = ({ onLoadComplete }) => {
  const [isComplete, setIsComplete] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Smooth fade-in for preloader
    const fadeInTimer = setTimeout(() => {
      setIsVisible(true)
    }, 200) // Slight delay before showing preloader

    // Auto-complete after animation cycles
    const completeTimer = setTimeout(() => {
      setIsComplete(true)
      setTimeout(() => {
        onLoadComplete()
      }, 500) // Smoother transition
    }, 2500) // 2.5 seconds for preloader

    return () => {
      clearTimeout(fadeInTimer)
      clearTimeout(completeTimer)
    }
  }, [onLoadComplete])

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          exit={{
            opacity: 0,
            scale: 1.05
          }}
          transition={{
            duration: 0.8,
            ease: [0.43, 0.13, 0.23, 0.96]
          }}
          className="fixed inset-0 z-[150] flex items-center justify-center bg-neutral-950 dark:bg-black"
        >
          {/* Gooey Text Animation - Centered */}
          <motion.div
            className="h-[200px] flex items-center justify-center"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{
              scale: isVisible ? 1 : 0.9,
              opacity: isVisible ? 1 : 0
            }}
            exit={{ scale: 1.1, opacity: 0 }}
            transition={{
              duration: 0.8,
              ease: [0.43, 0.13, 0.23, 0.96]
            }}
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
