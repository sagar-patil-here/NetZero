import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const PageTransition = ({ children, isLoading }) => {
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    if (!isLoading) {
      // Delay content reveal for smooth transition
      const timer = setTimeout(() => {
        setShowContent(true)
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [isLoading])

  return (
    <AnimatePresence mode="wait">
      {!isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showContent ? 1 : 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default PageTransition

