# Preloader Quick Start Guide

## 🚀 Instant Setup

Your CarbonTrack website now has a beautiful preloader! Here's everything you need to know.

## ✅ What's Included

### Components
1. **GooeyText** (`/src/components/ui/gooey-text-morphing.jsx`) - Morphing text animation
2. **Preloader** (`/src/components/Preloader.jsx`) - Complete loading screen

### Files Modified
- ✅ `App.jsx` - Added loading state management
- ✅ `tailwind.config.js` - Added foreground/background colors
- ✅ All dependencies already installed (using existing framer-motion)

## 🎯 How to Run

```bash
# Install dependencies (if not already done)
npm install

# Start the dev server
npm run dev
```

Open `http://localhost:3000` and you'll see:
1. **Preloader** with animated logo and morphing text
2. **Progress bar** filling from 0-100%
3. **Smooth fade-out** to main site

## 🎨 Quick Customizations

### Change the Loading Text

Edit `/src/components/Preloader.jsx` (line 45):

```javascript
<GooeyText
  texts={["Your", "Custom", "Words", "Here"]}  // ← Change this
/>
```

### Adjust Loading Speed

Edit `/src/components/Preloader.jsx` (line 18):

```javascript
return prev + Math.random() * 15  // ← Increase = faster, decrease = slower
```

### Change Logo Icon

Edit `/src/components/Preloader.jsx` (line 33):

```javascript
import { YourIcon } from 'lucide-react'  // ← Choose from lucide-react

<YourIcon className="w-10 h-10 text-white" />  // ← Replace Leaf
```

### Skip Preloader in Development

Edit `/src/App.jsx` (line 11):

```javascript
const [isLoading, setIsLoading] = useState(
  process.env.NODE_ENV === 'production'  // Only show in production
)
```

## 🎭 Animation Sequence

The preloader cycles through:
1. **"Carbon"** (appears for 1 second)
2. **"Track"** (morphs in, stays 1 second)
3. **"Loading"** (morphs in, stays 1 second)
4. **"Experience"** (morphs in, stays 1 second)
5. Repeat...

Meanwhile:
- Progress bar fills 0% → 100%
- Logo pulses and rotates
- Particles float up
- At 100%, everything fades out

## 📊 Current Settings

| Feature | Setting | Location |
|---------|---------|----------|
| Loading duration | ~3-4 seconds | Preloader.jsx line 18 |
| Text morph time | 1 second | Preloader.jsx line 47 |
| Text pause time | 0.5 seconds | Preloader.jsx line 48 |
| Progress interval | 200ms | Preloader.jsx line 21 |
| Fade out duration | 500ms | Preloader.jsx line 16 |

## 🔧 Common Tweaks

### Make Loading Faster
```javascript
// Preloader.jsx line 18
return prev + Math.random() * 30  // Bigger number = faster
```

### Make Loading Slower
```javascript
// Preloader.jsx line 18
return prev + Math.random() * 5   // Smaller number = slower
```

### Longer Text Display
```javascript
// Preloader.jsx line 48
cooldownTime={1.5}  // Text stays longer before morphing
```

### Faster Text Morphing
```javascript
// Preloader.jsx line 47
morphTime={0.5}     // Text morphs faster
```

## 🐛 Troubleshooting

### Preloader doesn't show
- Check that `isLoading` state is true initially in `App.jsx`
- Verify Preloader component is imported correctly

### Text doesn't morph
- Ensure `framer-motion` is installed: `npm install`
- Check browser console for errors
- Try refreshing the page

### Progress bar doesn't fill
- Check the interval logic in Preloader.jsx
- Verify progress reaches 100

### Can't scroll during loading
- This is intentional! Scrolling is disabled during preload
- If you want to enable it, remove lines 13-24 from App.jsx

## 📱 Mobile Optimization

The preloader is fully responsive:
- Logo size: 80px (mobile) → 80px (desktop)
- Text size: 60px (mobile) → 60pt (desktop)
- Progress bar: 256px (mobile) → 384px (desktop)

## 🎨 Color Scheme

Current colors (from CarbonTrack theme):
- Logo gradient: `primary-500` → `emerald-500` (green)
- Progress bar: `primary-500` → `primary-400` → `emerald-400`
- Background: Black with gradient
- Text: White

To change colors, edit `tailwind.config.js`

## 📚 Advanced Usage

See `PRELOADER_INTEGRATION.md` for:
- Real loading logic implementation
- Session storage persistence
- Performance optimization
- Custom animation sequences
- API integration

## ✨ That's It!

Your preloader is ready to go! Just run `npm run dev` and enjoy the smooth loading experience.

For detailed customization options, see `PRELOADER_INTEGRATION.md`.
