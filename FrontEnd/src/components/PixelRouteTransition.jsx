import React from 'react'
import { PixelTransition } from '@/components/ui/pixel-transition'

export default function PixelRouteTransition({ isActive }) {
  if (!isActive) return null

  return (
    <div className="fixed inset-0 z-[300] bg-black overflow-hidden">
      {/* Slide down cover to ease-in the transition */}
      <div className="absolute inset-0 animate-[slideDown_0.35s_ease_forwards] bg-black" />
      <div className="w-full h-full absolute inset-0">
        <PixelTransition
          firstContent={<div />}
          secondContent={<div />}
          gridSize={18}
          pixelColor="#0a0a0a"
          animationStepDuration={0.45}
          className="w-full h-full"
          style={{ width: '100%', height: '100%' }}
          aspectRatio="0%"
        />
      </div>
    </div>
  )
}
