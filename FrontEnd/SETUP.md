# CarbonTrack Frontend Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- `@radix-ui/react-slot` - Radix UI primitive for button component
- `class-variance-authority` - CVA for component variants
- `clsx` - Utility for constructing className strings
- `tailwind-merge` - Merge Tailwind CSS classes
- `framer-motion` - Animation library (already installed)

### 2. Start Development Server

```bash
npm run dev
```

The application will open at `http://localhost:3000`

## Project Structure

```
src/
├── components/
│   ├── ui/                     # Shadcn-style UI components
│   │   ├── button.jsx          # Button component with variants
│   │   └── background-paths.jsx # Animated background component
│   ├── Hero.jsx                # Hero section using BackgroundPaths
│   ├── Navbar.jsx              # Navigation component
│   ├── Stats.jsx               # Statistics section
│   ├── Features.jsx            # Features showcase
│   ├── CTA.jsx                 # Call-to-action section
│   └── Footer.jsx              # Footer component
├── lib/
│   └── utils.js                # Utility functions (cn helper)
├── App.jsx                     # Main app component
├── main.jsx                    # App entry point
└── index.css                   # Global styles and Tailwind imports
```

## Component Integration Details

### Background Paths Component

The `BackgroundPaths` component creates an animated SVG background with flowing paths. It features:

- **Animated SVG Paths**: Multiple animated paths creating a dynamic background
- **Letter-by-letter Animation**: Title text animates in character by character
- **Dark Mode Support**: Automatically adapts to dark/light themes
- **Customizable Props**:
  - `title`: Main heading text
  - `subtitle`: Optional subtitle text
  - `primaryButtonText`: Text for primary CTA button
  - `secondaryButtonText`: Optional secondary button text
  - `onPrimaryClick`: Handler for primary button
  - `onSecondaryClick`: Handler for secondary button

### Button Component

Shadcn-style button component with variants:

- **Variants**: default, destructive, outline, secondary, ghost, link
- **Sizes**: default, sm, lg, icon
- **Features**: 
  - Support for asChild prop (composition pattern)
  - Full accessibility support
  - Tailwind CSS styling

### Utility Functions

The `cn()` utility in `src/lib/utils.js`:
- Combines `clsx` and `tailwind-merge`
- Intelligently merges Tailwind CSS classes
- Prevents class conflicts

## Path Aliasing

The project uses `@` as an alias for the `src` directory. This is configured in `vite.config.js`:

```javascript
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
  },
}
```

This allows imports like:
```javascript
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
```

## Why /components/ui Folder?

The `/components/ui` folder follows the **shadcn/ui** convention:

1. **Separation of Concerns**: 
   - `/components` - Application-specific components
   - `/components/ui` - Reusable, primitive UI components

2. **Consistency**: Matches popular design system patterns

3. **Scalability**: Easy to add more shadcn components

4. **Maintainability**: Clear distinction between UI primitives and feature components

## Customization

### Tailwind Configuration

The theme can be customized in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: { /* your color scale */ },
      // ... more colors
    }
  }
}
```

### Component Styling

All components use Tailwind CSS and can be customized by:
1. Modifying the component files directly
2. Using the `className` prop to override styles
3. Updating theme in `tailwind.config.js`

## Dark Mode

The project supports dark mode out of the box:

- Uses Tailwind's `dark:` prefix
- BackgroundPaths component automatically adapts
- Can be controlled via system preferences or manually

To enable manual dark mode toggle, add a theme provider or use Tailwind's dark mode class strategy.

## Troubleshooting

### Import Errors

If you see errors like `Cannot find module '@/components/ui/button'`:

1. Ensure dependencies are installed: `npm install`
2. Restart the dev server: `npm run dev`
3. Check that `vite.config.js` has the path alias configured

### Animation Issues

If animations don't work:

1. Verify `framer-motion` is installed
2. Check browser console for errors
3. Ensure component is properly imported

### Styling Issues

If Tailwind classes don't work:

1. Verify `postcss.config.js` exists
2. Check `tailwind.config.js` content paths
3. Ensure `index.css` imports Tailwind directives

## Next Steps

1. **Customize the Hero**: Edit `src/components/Hero.jsx` to change title, subtitle, and button behavior
2. **Add More Components**: Create additional UI components in `/components/ui`
3. **Integrate Backend**: Connect to your CarbonTrack backend API
4. **Add Routing**: Install React Router for multi-page navigation
5. **Deploy**: Build and deploy to your favorite hosting platform

## Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Radix UI Documentation](https://www.radix-ui.com/)
- [Vite Documentation](https://vitejs.dev/)
