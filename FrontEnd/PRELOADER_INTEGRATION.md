# Preloader Integration Guide

## Overview

A stunning preloader has been integrated into the CarbonTrack landing page using the **Gooey Text Morphing** component. The preloader features:

- **Gooey text animation** with morphing effects
- **Animated logo** with rotating glow effect
- **Progress bar** with shimmer animation
- **Floating particles** for visual depth
- **Smooth fade-out** transition

## Components Created

### 1. GooeyText Component
**Location**: `/src/components/ui/gooey-text-morphing.jsx`

A reusable component that creates a morphing text effect with a gooey blur animation.

#### Props
- `texts` (array, required): Array of strings to morph between
- `morphTime` (number, default: 1): Duration of morph animation in seconds
- `cooldownTime` (number, default: 0.25): Pause duration between morphs
- `className` (string): Additional classes for container
- `textClassName` (string): Additional classes for text elements

#### Usage Example
```javascript
import { GooeyText } from '@/components/ui/gooey-text-morphing'

<GooeyText
  texts={["Carbon", "Track", "Loading"]}
  morphTime={1}
  cooldownTime={0.5}
  className="font-bold"
  textClassName="text-white"
/>
```

### 2. Preloader Component
**Location**: `/src/components/Preloader.jsx`

The main preloader component that displays during initial page load.

#### Features
- Animated logo with pulsing glow effect
- Gooey text morphing through 4 states: "Carbon" → "Track" → "Loading" → "Experience"
- Progress bar with shimmer effect (0-100%)
- Floating particle background
- Smooth fade-out animation
- Prevents page scrolling during loading

#### Props
- `onLoadComplete` (function, required): Callback function called when loading is complete

## Integration Details

### App.jsx Changes

The preloader is integrated at the root level of the application:

```javascript
import Preloader from './components/Preloader'

function App() {
  const [isLoading, setIsLoading] = useState(true)

  // Prevent scrolling during loading
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [isLoading])

  return (
    <>
      {isLoading && <Preloader onLoadComplete={() => setIsLoading(false)} />}
      <div className="min-h-screen bg-black">
        {/* Rest of the app */}
      </div>
    </>
  )
}
```

### Tailwind Configuration

Updated `tailwind.config.js` with:
- `foreground` color: Used by GooeyText component
- `background` color: For consistent theming

## Customization Options

### 1. Change Loading Duration

Edit `/src/components/Preloader.jsx`:

```javascript
// Change interval timing (line 13)
const interval = setInterval(() => {
  setProgress((prev) => {
    // Adjust progress increment for faster/slower loading
    return prev + Math.random() * 15  // Increase for faster, decrease for slower
  })
}, 200)  // Change interval duration
```

### 2. Modify Text Sequence

Edit the GooeyText texts array:

```javascript
<GooeyText
  texts={["Your", "Custom", "Text", "Here"]}  // Change these words
  morphTime={1}
  cooldownTime={0.5}
/>
```

### 3. Adjust Animation Speed

```javascript
<GooeyText
  texts={["Carbon", "Track", "Loading", "Experience"]}
  morphTime={1.5}        // Slower morph (increase number)
  cooldownTime={0.3}     // Shorter pause between words
/>
```

### 4. Change Logo

Replace the Leaf icon with your custom logo:

```javascript
// In Preloader.jsx
import { YourIcon } from 'lucide-react'

<div className="relative w-20 h-20 bg-gradient-to-br from-primary-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-2xl">
  <YourIcon className="w-10 h-10 text-white" />
</div>
```

### 5. Modify Progress Bar Style

Edit progress bar in `/src/components/Preloader.jsx`:

```javascript
<div className="h-1.5 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
  <motion.div
    className="h-full bg-gradient-to-r from-primary-500 via-primary-400 to-emerald-400 rounded-full"
    // Change gradient colors here
  />
</div>
```

### 6. Adjust Particle Count

Change the number of floating particles:

```javascript
{[...Array(20)].map((_, i) => (  // Change 20 to any number
  <motion.div key={i} ... />
))}
```

## How It Works

### Loading Sequence

1. **Preloader mounts** - Displays with full opacity
2. **Progress simulation** - Increments from 0% to 100%
3. **Text morphing** - Cycles through: Carbon → Track → Loading → Experience
4. **Loading complete** - At 100%, waits 800ms
5. **Fade out** - 500ms fade-out animation
6. **Main app reveals** - Preloader unmounts, main content displays

### Performance

The preloader uses:
- **Framer Motion** - Hardware-accelerated animations
- **SVG filters** - For gooey blur effect
- **RequestAnimationFrame** - Smooth 60fps text morphing
- **Cleanup functions** - Proper animation cancellation on unmount

### Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- SVG filter support required for gooey effect
- RequestAnimationFrame support (all modern browsers)
- CSS backdrop-filter support (95%+ of browsers)

## Troubleshooting

### Issue: Preloader doesn't disappear
**Solution**: Check that `onLoadComplete` callback is being called properly.

### Issue: Text doesn't morph smoothly
**Solution**: 
1. Verify `framer-motion` is installed
2. Check browser console for errors
3. Try increasing `morphTime` value

### Issue: Progress bar doesn't fill
**Solution**: Check the interval logic in `Preloader.jsx` - ensure it reaches 100%.

### Issue: SVG filter not working
**Solution**: Some older browsers don't support SVG filters. The text will still display but without the gooey effect.

## Advanced Customization

### Skip Preloader for Development

Add a condition to skip preloader during development:

```javascript
function App() {
  const [isLoading, setIsLoading] = useState(
    process.env.NODE_ENV === 'production'  // Only show in production
  )
  
  // Rest of the code...
}
```

### Add Real Loading Logic

Replace simulated progress with actual loading:

```javascript
useEffect(() => {
  const loadAssets = async () => {
    try {
      // Load images
      await Promise.all([
        // Your image loading logic
      ])
      
      // Load data
      await fetch('/api/initial-data')
      
      setProgress(100)
      setIsComplete(true)
    } catch (error) {
      console.error('Loading failed:', error)
    }
  }
  
  loadAssets()
}, [])
```

### Persist Preloader State

Show preloader only on first visit:

```javascript
function App() {
  const [isLoading, setIsLoading] = useState(() => {
    const hasVisited = sessionStorage.getItem('hasVisited')
    return !hasVisited
  })

  const handleLoadComplete = () => {
    sessionStorage.setItem('hasVisited', 'true')
    setIsLoading(false)
  }
}
```

## Testing

### Manual Testing
1. Run `npm run dev`
2. Open browser and watch preloader sequence
3. Verify smooth transitions
4. Test on different screen sizes
5. Check browser console for errors

### Performance Testing
1. Open browser DevTools
2. Go to Performance tab
3. Record during preloader
4. Check for smooth 60fps animations
5. Verify no memory leaks after unmount

## Resources

- [Framer Motion Documentation](https://www.framer.com/motion/)
- [SVG Filters Specification](https://www.w3.org/TR/SVG/filters.html)
- [RequestAnimationFrame MDN](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)

## Summary

✅ **Gooey Text Morphing** component created and integrated
✅ **Preloader** component with full loading experience
✅ **App.jsx** updated with loading state management
✅ **Tailwind config** updated with necessary colors
✅ **Smooth animations** with Framer Motion
✅ **Responsive design** works on all devices
✅ **Customizable** - easy to modify all aspects

The preloader creates a premium, professional first impression for your CarbonTrack landing page!
