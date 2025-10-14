import React from 'react'
import { BackgroundPaths } from '@/components/ui/background-paths'
import { CarbonBG } from '@/components/ui/carbon-bg'

const Hero = () => {
  const handleStartTracking = () => {
    // Scroll to features section or navigate to sign up
    const featuresSection = document.getElementById('features')
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleWatchDemo = () => {
    // Handle demo video or tour
    console.log('Watch demo clicked')
  }

  return (
    <div className="relative min-h-screen bg-black">
      {/* Carbon-themed animated background */}
      <CarbonBG />

      {/* Main content overlay */}
      <div className="relative z-10">
        <BackgroundPaths
          title="Carbon Track"
          subtitle="Intelligent emission tracking that integrates seamlessly with your ERP system. Calculate, analyze, and visualize real-time carbon emissions across your entire organization."
          primaryButtonText="Start Tracking"
          secondaryButtonText="Watch Demo"
          onPrimaryClick={handleStartTracking}
          onSecondaryClick={handleWatchDemo}
        />
      </div>
    </div>
  )
}

export default Hero
