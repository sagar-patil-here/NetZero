import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

export default function Root() {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
