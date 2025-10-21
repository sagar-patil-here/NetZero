import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Preloader from './components/Preloader'
import LandingPage from './components/LandingPage'
import Dashboard from './components/Dashboard'
import { useAuth } from './contexts/AuthContext'

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [showContent, setShowContent] = useState(false)
  const [isFirstVisit, setIsFirstVisit] = useState(true)
  const { currentUser, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Check if this is the first visit to the website
    const hasVisited = localStorage.getItem('netzero-visited')
    if (hasVisited) {
      setIsFirstVisit(false)
      setIsLoading(false)
      setShowContent(true)
      return
    }

    // First visit - show preloader
    setIsFirstVisit(true)

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
    // Mark as visited after preloader completes
    localStorage.setItem('netzero-visited', 'true')
    setIsLoading(false)
  }

  // Redirect users based on authentication status
  useEffect(() => {
    if (!loading) {
      if (currentUser) {
        navigate('/dashboard')
      } else {
        navigate('/landing')
      }
    }
  }, [currentUser, loading, navigate])

  return (
    <>
      {/* Preloader - Shows only on first visit */}
      <AnimatePresence mode="wait">
        {isLoading && isFirstVisit && (
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
            <LandingPage />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default App
