import React from 'react'
import { motion } from 'framer-motion'
import { WhyTrackSection } from '@/components/ui/why-track-section'

const WhyTrack = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
    >
      <WhyTrackSection />
    </motion.div>
  )
}

export default WhyTrack
