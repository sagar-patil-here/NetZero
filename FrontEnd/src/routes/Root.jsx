import React, { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import PixelRouteTransition from '@/components/PixelRouteTransition'

const pageVariants = {
  initial: { opacity: 0, scale: 0.7, y: 30 },
  in: { opacity: 1, scale: 1, y: 0 },
  out: { opacity: 0, scale: 1.2, y: -30 }
}

const pageTransition = { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }

export default function Root() {
  const location = useLocation()
  const [showOverlay, setShowOverlay] = useState(false)
  const [currentPage, setCurrentPage] = useState(location.pathname)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    // Skip overlay for landing page and root
    if (location.pathname === '/' || location.pathname === '/landing') {
      setCurrentPage(location.pathname)
      setIsTransitioning(false)
      setShowOverlay(false) 
      return
    }

    // Start transition - hide current page and show overlay
    setIsTransitioning(true)
    setShowOverlay(true)

    // After overlay completes, show new page
    const timer = setTimeout(() => {
      setCurrentPage(location.pathname)
      setShowOverlay(false)
      setIsTransitioning(false)
    }, 320) // Match overlay duration exactly

    return () => clearTimeout(timer)
  }, [location.pathname])

  return (
    <div className="min-h-screen bg-black">
      {/* Transition overlay - shows during page changes */}
      <PixelRouteTransition isActive={showOverlay || isTransitioning} />

      {/* Page content - only show when not transitioning */}
      {!isTransitioning && (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="page-transition"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  )
}
