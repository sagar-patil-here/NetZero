import React, { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'

export const PixelTransition = ({
  firstContent,
  secondContent,
  gridSize = 7,
  pixelColor = 'currentColor',
  animationStepDuration = 0.3,
  className = '',
  style = {},
  aspectRatio = '100%',
}) => {
  const containerRef = useRef(null)
  const pixelGridRef = useRef(null)
  const activeRef = useRef(null)
  const delayedCallRef = useRef(null)

  const [isActive, setIsActive] = useState(false)
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    setIsTouch(
      'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        (window.matchMedia && window.matchMedia('(pointer: coarse)').matches),
    )
  }, [])

  useEffect(() => {
    const el = pixelGridRef.current
    if (!el) return
    el.innerHTML = ''

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const pixel = document.createElement('div')
        pixel.classList.add('pixelated-image-card__pixel')
        pixel.classList.add('absolute', 'hidden')
        pixel.style.backgroundColor = pixelColor === 'currentColor' ? 'currentColor' : pixelColor
        const size = 100 / gridSize
        pixel.style.width = `${size}%`
        pixel.style.height = `${size}%`
        pixel.style.left = `${col * size}%`
        pixel.style.top = `${row * size}%`
        el.appendChild(pixel)
      }
    }
  }, [gridSize, pixelColor])

  const animatePixels = (activate) => {
    setIsActive(activate)
    const gridEl = pixelGridRef.current
    const activeEl = activeRef.current
    if (!gridEl || !activeEl) return

    const pixels = Array.from(gridEl.querySelectorAll('.pixelated-image-card__pixel'))
    if (!pixels.length) return

    gsap.killTweensOf(pixels)
    if (delayedCallRef.current) delayedCallRef.current.kill()

    gsap.set(pixels, { display: 'none' })

    const totalPixels = pixels.length
    const staggerEach = animationStepDuration / totalPixels

    gsap.to(pixels, {
      display: 'block',
      duration: 0.001,
      stagger: { each: staggerEach, from: 'random' },
    })

    delayedCallRef.current = gsap.delayedCall(animationStepDuration, () => {
      activeEl.style.display = activate ? 'block' : 'none'
    })

    gsap.to(pixels, {
      display: 'none',
      duration: 0.001,
      delay: animationStepDuration,
      stagger: { each: staggerEach, from: 'random' },
    })
  }

  const handleMouseEnter = () => {
    if (!isActive) animatePixels(true)
  }
  const handleMouseLeave = () => {
    if (isActive) animatePixels(false)
  }
  const handleClick = () => {
    animatePixels(!isActive)
  }

  const baseContainerClasses = `
    ${className}
    rounded-[15px]
    w-[300px]
    max-w-full
    relative
    overflow-hidden
    cursor-pointer
  `

  const lightThemeClasses = `bg-neutral-200 text-black border-2 border-black`
  const darkThemeClasses = `bg-neutral-800 text-white border-2 border-white`

  return (
    <div
      ref={containerRef}
      className={`${baseContainerClasses} ${lightThemeClasses} dark:${darkThemeClasses}`}
      style={style}
      onMouseEnter={!isTouch ? handleMouseEnter : undefined}
      onMouseLeave={!isTouch ? handleMouseLeave : undefined}
      onClick={isTouch ? handleClick : undefined}
    >
      <div style={{ paddingTop: aspectRatio }} />
      <div className="absolute inset-0 w-full h-full">{firstContent}</div>
      <div ref={activeRef} className="absolute inset-0 w-full h-full z-[2]" style={{ display: 'none' }}>
        {secondContent}
      </div>
      <div ref={pixelGridRef} className="absolute inset-0 w-full h-full pointer-events-none z-[3]" />
    </div>
  )
}
