import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Menu, X, Leaf } from 'lucide-react'
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button'

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { name: 'Features', href: '#features' },
    { name: 'Analytics', href: '#analytics' },
    { name: 'Integration', href: '#integration' },
    { name: 'Pricing', href: '#pricing' },
  ]

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
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-0"
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

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-carbon-300 hover:text-white transition-colors duration-300 font-medium"
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-4">
            <div onClick={() => console.log('Sign In clicked')}>
              <InteractiveHoverButton
                text="Sign In"
                className="text-sm"
              />
            </div>
            <div onClick={() => console.log('Get Started clicked')}>
              <InteractiveHoverButton
                text="Get Started"
                className="text-sm"
              />
            </div>
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
                <a
                  key={item.name}
                  href={item.href}
                  className="block text-carbon-300 hover:text-white transition-colors duration-300 font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <div className="pt-4 border-t border-white/10 space-y-3">
                <div onClick={() => console.log('Mobile Sign In clicked')}>
                  <InteractiveHoverButton
                    text="Sign In"
                    className="text-sm"
                  />
                </div>
                <div onClick={() => console.log('Mobile Get Started clicked')}>
                  <InteractiveHoverButton
                    text="Get Started"
                    className="text-sm"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  )
}

export default Navbar
