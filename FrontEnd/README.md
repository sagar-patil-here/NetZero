# CarbonTrack Frontend

A modern, interactive landing page for CarbonTrack - an intelligent carbon emission tracking system.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your site with:
- ✨ **Canvas reveal animation** - Page scales from center like Lazarev.agency ($20k+ effect)
- 🎬 **Three-stage opening** - Preloader → White canvas → Circular reveal from center
- 🎨 Hero section with animated background paths and scroll-triggered text
- 📱 Fully responsive design with professional easing curves
- 🎭 Award-winning agency-quality animations throughout
- 🏆 Premium Lazarev-style smooth transitions and reveals

**New here?** → Read [`START_HERE.md`](./START_HERE.md) for a guided walkthrough!

## Features

### 🎭 Preloader Experience
- **Minimalist Design**: Clean, dark-themed preloader
- **Gooey Text Morphing**: Smooth text transitions with blur effects
- **Pure Dark Background**: Professional black background
- **Centered Animation**: Perfectly centered morphing text
- **Smooth Transitions**: 800ms fade-out animation to main content
- **5-Second Duration**: Quick and elegant loading experience

### 🎨 Landing Page
- **Animated Background Hero**: Beautiful animated SVG paths with letter-by-letter text animation
- **Interactive Navigation**: Sticky navbar with scroll effects
- **Statistics Showcase**: Impressive metrics with icons and animations
- **Feature Highlights**: Detailed breakdown of CarbonTrack capabilities
- **Call-to-Action**: Conversion-focused sections with testimonials
- **Professional Footer**: Complete with links and social media

### 🛠️ Technical Features
- **Responsive Design**: Fully responsive layout that works on all devices
- **Modern UI/UX**: Built with Tailwind CSS and Framer Motion for smooth animations
- **Shadcn-style Components**: Reusable UI components following best practices
- **Component-based Architecture**: Modular React components for easy maintenance
- **Performance Optimized**: Built with Vite for fast development and production builds
- **Dark Mode Ready**: Full support for light and dark themes

## Tech Stack

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library for smooth transitions
- **Shadcn UI Pattern** - Reusable component architecture
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icons

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Navigate to the FrontEnd directory:
   ```bash
   cd FrontEnd
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/
│   ├── ui/                      # Shadcn-style UI components
│   │   ├── button.jsx           # Reusable button component
│   │   └── background-paths.jsx # Animated background component
│   ├── Hero.jsx                 # Hero section with BackgroundPaths
│   ├── Navbar.jsx               # Navigation component
│   ├── Stats.jsx                # Statistics section
│   ├── Features.jsx             # Features showcase
│   ├── CTA.jsx                  # Call-to-action section
│   └── Footer.jsx               # Footer component
├── lib/
│   └── utils.js                 # Utility functions (cn helper)
├── App.jsx                      # Main app component
├── main.jsx                     # App entry point
└── index.css                    # Global styles and Tailwind imports
```

## Key Components

### Hero Component
- Uses the BackgroundPaths component for an animated background
- Letter-by-letter text animation
- Smooth scroll to features section
- Responsive design with mobile optimization

### BackgroundPaths Component (`/components/ui/background-paths.jsx`)
- Animated SVG paths creating dynamic background
- Character-by-character title animation with spring physics
- Customizable props for title, subtitle, and buttons
- Dark mode support with automatic theme adaptation
- Fully responsive and accessible

### Button Component (`/components/ui/button.jsx`)
- Shadcn-style button with multiple variants
- Support for composition pattern with `asChild` prop
- Accessible and keyboard navigable
- Fully customizable with Tailwind classes

### Features Section
- Detailed breakdown of CarbonTrack capabilities
- ERP integration highlights
- Real-time analytics showcase
- API documentation references

### Interactive Elements
- Smooth scroll animations with Framer Motion
- Hover effects and transitions
- Mobile-responsive navigation
- Glass morphism design elements

## Customization

### Colors
The color scheme can be customized in `tailwind.config.js`:
- Primary colors: Green gradient for sustainability theme
- Carbon colors: Dark theme for professional look

### Background Animation
The BackgroundPaths component can be customized in `src/components/ui/background-paths.jsx`:
- Adjust the number of animated paths (default: 36)
- Modify animation duration and timing
- Customize colors and opacity

### Content
All text content and features can be easily modified in their respective component files.

## Deployment

### Build for Production
```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment to any static hosting service.

### Recommended Hosting
- Vercel
- Netlify
- AWS S3 + CloudFront
- GitHub Pages

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📚 Documentation

- **[START_HERE.md](./START_HERE.md)** - Begin here! Quick start guide
- **[SETUP.md](./SETUP.md)** - Detailed setup instructions
- **[PRELOADER_QUICKSTART.md](./PRELOADER_QUICKSTART.md)** - Quick preloader reference
- **[PRELOADER_INTEGRATION.md](./PRELOADER_INTEGRATION.md)** - Complete preloader guide
- **[COMPONENTS_SUMMARY.md](./COMPONENTS_SUMMARY.md)** - All components overview
- **[src/components/ui/README.md](./src/components/ui/README.md)** - UI components documentation

## 🎯 Component Quick Reference

### Preloader
```javascript
import Preloader from './components/Preloader'

<Preloader onLoadComplete={() => setLoading(false)} />
```

### GooeyText
```javascript
import { GooeyText } from '@/components/ui/gooey-text-morphing'

<GooeyText 
  texts={["Carbon", "Track"]} 
  morphTime={1}
  cooldownTime={0.5}
/>
```

### BackgroundPaths
```javascript
import { BackgroundPaths } from '@/components/ui/background-paths'

<BackgroundPaths
  title="Your Title"
  subtitle="Your subtitle"
  primaryButtonText="Get Started"
/>
```

### Button
```javascript
import { Button } from '@/components/ui/button'

<Button variant="default" size="lg">Click me</Button>
```

## License

This project is part of the CarbonTrack system. All rights reserved.
