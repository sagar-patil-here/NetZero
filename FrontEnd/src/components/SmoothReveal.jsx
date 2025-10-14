import React from 'react'
import { motion } from 'framer-motion'

const SmoothReveal = ({ 
  children, 
  delay = 0,
  duration = 0.8,
  direction = 'up',
  className = ''
}) => {
  const variants = {
    hidden: {
      opacity: 0,
      y: direction === 'up' ? 40 : direction === 'down' ? -40 : 0,
      x: direction === 'left' ? 40 : direction === 'right' ? -40 : 0,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      transition: {
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1] // Lazarev-style easing
      }
    }
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default SmoothReveal

