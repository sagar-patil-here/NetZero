import React from 'react'
import { motion } from 'framer-motion'
import Hero from './Hero'
import WhyTrack from './WhyTrack'
import Features from './Features'
import Stats from './Stats'
import CTA from './CTA'
import Footer from './Footer'
import SmoothReveal from './SmoothReveal'
import Navbar from './Navbar'

const LandingPage = () => {
  return (
    <>
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
    </>
  )
}

export default LandingPage
