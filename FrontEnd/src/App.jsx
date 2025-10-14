import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Hero from './components/Hero'
import WhyTrack from './components/WhyTrack'
import Features from './components/Features'
import Stats from './components/Stats'
import CTA from './components/CTA'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import Preloader from './components/Preloader'
import SmoothReveal from './components/SmoothReveal'

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    // Prevent scrolling during loading
    if (isLoading) {
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
    } else {
      document.body.style.overflow = 'unset'
      document.body.style.position = 'unset'
      // Show content after preloader
      setTimeout(() => setShowContent(true), 100)
    }

    return () => {
      document.body.style.overflow = 'unset'
      document.body.style.position = 'unset'
    }
  }, [isLoading])

  const handleLoadComplete = () => {
    setIsLoading(false)
  }

  return (
    <>
      {/* Preloader - Shows first */}
      <AnimatePresence mode="wait">
        {isLoading && (
          <div className="fixed inset-0 z-[150]">
            <Preloader onLoadComplete={handleLoadComplete} />
          </div>
        )}
      </AnimatePresence>

      {/* Main Content - Shows after preloader */}
      <AnimatePresence>
        {!isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: showContent ? 1 : 0 }}
            transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
            className="min-h-screen bg-black relative z-10"
          >
            <Navbar />

            <SmoothReveal>
              <Hero />
            </SmoothReveal>

            <SmoothReveal delay={0.1}>
              <WhyTrack />
            </SmoothReveal>

            <div className="bg-black">
              <SmoothReveal delay={0.2}>
                <Stats />
              </SmoothReveal>

              <SmoothReveal delay={0.1}>
                <Features />
              </SmoothReveal>

              <SmoothReveal delay={0.1}>
                <CTA />
              </SmoothReveal>

              <SmoothReveal delay={0.1}>
                <Footer />
              </SmoothReveal>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default App
