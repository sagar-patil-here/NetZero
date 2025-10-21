import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, Leaf, LogOut, User } from 'lucide-react'
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button'
import { useAuth } from '../contexts/AuthContext'

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest('.user-menu-container')) {
        setShowUserMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showUserMenu])

  const navItems = [
    { name: 'Features', href: '#features' },
    { name: 'Analytics', href: currentUser ? '/dashboard' : '#analytics' },
    { name: 'Integration', href: '#integration' },
    { name: 'Pricing', href: '#pricing' },
  ]

  const handleNavClick = (href) => {
    if (currentUser && href === '/dashboard') {
      navigate('/dashboard')
    } else if (href.startsWith('#')) {
      // Handle anchor links for landing page sections
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      setShowUserMenu(false)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ 
        duration: 1.2, 
        delay: 0.3,
        ease: [0.25, 0.1, 0.25, 1] // Lazarev-style easing
      }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-black/90 backdrop-blur-xl border-b border-white/10 shadow-lg' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/landing">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-0 cursor-pointer"
            >
              <div className="relative">
                {/* Zero Logo from SVG - Horizontal */}
                <div className="w-16 h-8 flex items-center justify-center">
                  <img
                    src="/number-0-svgrepo-com.svg"
                    alt="NetZero Logo"
                    className="w-full h-full object-contain filter drop-shadow-lg"
                    style={{ filter: 'brightness(0) invert(1)', transform: 'rotate(90deg)' }}
                  />
                </div>
              </div>
              <span className="text-xl font-bold text-white">NetZero</span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.href)}
                className="text-carbon-300 hover:text-white transition-colors duration-300 font-medium"
              >
                {item.name}
              </button>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-4">
            {currentUser ? (
              <div className="relative user-menu-container">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    {currentUser.photoURL ? (
                      <img
                        src={currentUser.photoURL}
                        alt="Profile"
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                  </div>
                  <span className="text-sm font-medium">
                    {currentUser.displayName || currentUser.email}
                  </span>
                </button>
                
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-black/90 backdrop-blur-xl border border-white/10 rounded-lg shadow-lg py-2"
                  >
                    <div className="px-4 py-2 border-b border-white/10">
                      <p className="text-sm text-gray-300">{currentUser.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-sm text-white hover:bg-white/10 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </div>
            ) : (
              <>
                <Link to="/signin">
                  <InteractiveHoverButton
                    text="Sign In"
                    className="text-sm"
                  />
                </Link>
                <button onClick={() => navigate('/signup')}>
                  <InteractiveHoverButton
                    text="Get Started"
                    className="text-sm"
                  />
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-carbon-900/95 backdrop-blur-md border-t border-white/10"
          >
            <div className="px-6 py-4 space-y-4">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    handleNavClick(item.href)
                    setIsMobileMenuOpen(false)
                  }}
                  className="block text-carbon-300 hover:text-white transition-colors duration-300 font-medium w-full text-left"
                >
                  {item.name}
                </button>
              ))}
              <div className="pt-4 border-t border-white/10 space-y-3">
                {currentUser ? (
                  <div className="space-y-3">
                    <div className="px-4 py-2 bg-white/5 rounded-lg">
                      <p className="text-sm text-white font-medium">
                        {currentUser.displayName || 'User'}
                      </p>
                      <p className="text-xs text-gray-400">{currentUser.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        handleLogout()
                        setIsMobileMenuOpen(false)
                      }}
                      className="w-full flex items-center justify-center gap-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 px-4 py-2 rounded-lg transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <>
                    <Link to="/signin" onClick={() => setIsMobileMenuOpen(false)}>
                      <InteractiveHoverButton
                        text="Sign In"
                        className="text-sm"
                      />
                    </Link>
                    <button onClick={() => {
                      navigate('/signup')
                      setIsMobileMenuOpen(false)
                    }}>
                      <InteractiveHoverButton
                        text="Get Started"
                        className="text-sm"
                      />
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  )
}

export default Navbar
