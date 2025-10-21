import React from 'react'
import { useNavigate } from 'react-router-dom'
import { BackgroundPaths } from '@/components/ui/background-paths'
import { CarbonBG } from '@/components/ui/carbon-bg'
import { useAuth } from '../contexts/AuthContext'

const Hero = () => {
  const navigate = useNavigate()
  const { currentUser } = useAuth()

  const handleStartTracking = () => {
    // If user is logged in, redirect to dashboard
    if (currentUser) {
      navigate('/dashboard')
    } else {
      // If not logged in, go to sign in
      navigate('/signin')
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
