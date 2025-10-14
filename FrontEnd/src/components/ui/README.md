# UI Components Documentation

This folder contains reusable UI components following the **shadcn/ui** pattern.

## Components

### Button Component

A versatile button component with multiple variants and sizes.

#### Import

```javascript
import { Button } from '@/components/ui/button'
```

#### Usage

```javascript
// Default variant
<Button>Click me</Button>

// With variant
<Button variant="outline">Outline Button</Button>

// With size
<Button size="lg">Large Button</Button>

// With custom styling
<Button className="bg-blue-500 hover:bg-blue-600">
  Custom Button
</Button>

// With icon
<Button>
  <Icon className="mr-2" />
  Button with Icon
</Button>

// As a link (composition pattern)
<Button asChild>
  <a href="/about">Link Button</a>
</Button>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'destructive' \| 'outline' \| 'secondary' \| 'ghost' \| 'link'` | `'default'` | Button style variant |
| `size` | `'default' \| 'sm' \| 'lg' \| 'icon'` | `'default'` | Button size |
| `asChild` | `boolean` | `false` | Render as child component (composition) |
| `className` | `string` | - | Additional CSS classes |

---

### BackgroundPaths Component

An animated background component with floating SVG paths and animated text.

#### Import

```javascript
import { BackgroundPaths } from '@/components/ui/background-paths'
```

#### Basic Usage

```javascript
<BackgroundPaths title="Welcome" />
```

#### Full Example

```javascript
<BackgroundPaths
  title="Carbon Track"
  subtitle="Track your carbon emissions in real-time"
  primaryButtonText="Get Started"
  secondaryButtonText="Learn More"
  onPrimaryClick={() => console.log('Primary clicked')}
  onSecondaryClick={() => console.log('Secondary clicked')}
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | `'Background Paths'` | Main heading text (animates letter by letter) |
| `subtitle` | `string` | - | Optional subtitle text below the title |
| `primaryButtonText` | `string` | `'Discover Excellence'` | Text for primary CTA button |
| `secondaryButtonText` | `string` | - | Optional secondary button text |
| `onPrimaryClick` | `function` | - | Click handler for primary button |
| `onSecondaryClick` | `function` | - | Click handler for secondary button |

#### Features

- **Animated Background**: 36 floating SVG paths with continuous animation
- **Text Animation**: Each letter animates in individually with spring physics
- **Responsive**: Adapts to all screen sizes
- **Dark Mode**: Automatically adapts to light/dark themes
- **Customizable**: All text and behaviors configurable via props

#### Customization

To modify the animation behavior, edit the component file:

```javascript
// Change number of paths (line 5)
const paths = Array.from({ length: 36 }, (_, i) => ({

// Modify animation duration (line 36)
duration: 20 + Math.random() * 10,

// Adjust text animation timing (line 85)
delay: wordIndex * 0.1 + letterIndex * 0.03,
```

---

### GooeyText Component

A morphing text animation component with a gooey blur effect.

#### Import

```javascript
import { GooeyText } from '@/components/ui/gooey-text-morphing'
```

#### Basic Usage

```javascript
<GooeyText texts={["Hello", "World"]} />
```

#### Full Example

```javascript
<GooeyText
  texts={["Carbon", "Track", "Loading", "Experience"]}
  morphTime={1}
  cooldownTime={0.5}
  className="font-bold"
  textClassName="text-white font-extrabold tracking-tight"
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `texts` | `string[]` | required | Array of strings to morph between |
| `morphTime` | `number` | `1` | Duration of morph animation in seconds |
| `cooldownTime` | `number` | `0.25` | Pause duration between morphs in seconds |
| `className` | `string` | - | Additional CSS classes for container |
| `textClassName` | `string` | - | Additional CSS classes for text elements |

#### Features

- **Gooey Blur Effect**: SVG filter creates smooth morphing transitions
- **Automatic Animation**: Cycles through texts automatically
- **Customizable Timing**: Control morph and pause durations
- **Responsive**: Adapts to different screen sizes
- **Performance Optimized**: Uses requestAnimationFrame for smooth 60fps animation

#### How It Works

The component uses:
1. **SVG Filter** (`feColorMatrix`) - Creates the gooey blur effect
2. **RequestAnimationFrame** - Smooth animation loop
3. **Dual Text Refs** - Two overlapping text elements for morphing
4. **Dynamic Opacity/Blur** - Calculated based on animation fraction

#### Technical Notes

- Requires browser support for SVG filters
- Uses `requestAnimationFrame` for optimal performance
- Properly cleans up animation on unmount
- Text elements are absolutely positioned for overlap effect

#### Common Use Cases

1. **Preloader/Loading Screen**
   ```javascript
   <GooeyText texts={["Loading", "Assets", "Ready"]} />
   ```

2. **Hero Section**
   ```javascript
   <GooeyText 
     texts={["Innovate", "Create", "Transform"]}
     morphTime={1.5}
     cooldownTime={1}
   />
   ```

3. **Brand Tagline**
   ```javascript
   <GooeyText 
     texts={["Fast", "Reliable", "Secure"]}
     className="my-8"
   />
   ```

---

### ScrollFloat Component

A scroll-triggered text animation component that animates text character-by-character using GSAP.

#### Import

```javascript
import { ScrollFloat } from '@/components/ui/scroll-float'
```

#### Basic Usage

```javascript
<ScrollFloat textClassName="text-4xl font-bold text-white">
  Your Text Here
</ScrollFloat>
```

#### Full Example

```javascript
<ScrollFloat
  containerClassName="mb-6"
  textClassName="text-5xl font-bold text-white"
  scrollStart="center 80%"
  scrollEnd="center 30%"
  stagger={0.02}
  animationDuration={1}
  ease="back.inOut(2)"
>
  Animated Heading
</ScrollFloat>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `string` | required | Text to animate |
| `scrollContainerRef` | `RefObject` | - | Custom scroll container ref |
| `containerClassName` | `string` | `""` | Container CSS classes |
| `textClassName` | `string` | `""` | Text CSS classes |
| `animationDuration` | `number` | `1` | Animation duration in seconds |
| `ease` | `string` | `"back.inOut(2)"` | GSAP easing function |
| `scrollStart` | `string` | `"center bottom+=50%"` | When animation starts |
| `scrollEnd` | `string` | `"bottom bottom-=40%"` | When animation completes |
| `stagger` | `number` | `0.03` | Delay between characters |

#### Features

- **Character Animation**: Each letter animates individually
- **Scroll-Triggered**: Animations sync with scroll position
- **GSAP-Powered**: Smooth, performant 60fps animations
- **Customizable Timing**: Control duration, easing, and stagger
- **Responsive**: Works on all screen sizes
- **Performance**: GPU-accelerated with proper cleanup

#### How It Works

1. Splits text into individual characters
2. Creates GSAP animation for each character
3. Uses ScrollTrigger to sync with scroll
4. Characters float up with opacity fade
5. Stagger creates wave effect

#### Common Use Cases

1. **Section Headings**
   ```javascript
   <ScrollFloat textClassName="text-6xl font-bold">
     Main Heading
   </ScrollFloat>
   ```

2. **Multi-Line Titles**
   ```javascript
   <ScrollFloat scrollStart="center 80%" scrollEnd="center 30%">
     First Line
   </ScrollFloat>
   <ScrollFloat scrollStart="center 75%" scrollEnd="center 35%">
     Second Line
   </ScrollFloat>
   ```

3. **Gradient Text**
   ```javascript
   <ScrollFloat textClassName="text-5xl font-bold gradient-text">
     Beautiful Text
   </ScrollFloat>
   ```

#### Technical Notes

- Requires GSAP and ScrollTrigger
- Best for short to medium text (< 50 characters)
- Each character is wrapped in a span
- Automatically cleans up ScrollTrigger on unmount
- Uses `willChange` for GPU acceleration

#### GSAP Easing Options

```javascript
ease="power1.inOut"      // Smooth
ease="power2.inOut"      // Medium
ease="back.inOut(2)"     // Overshoot (default)
ease="elastic.out(1, 0.3)" // Elastic
ease="bounce.out"        // Bounce
```

---

## Creating New UI Components

To add a new component to this folder:

1. **Create the component file**:
   ```
   /src/components/ui/your-component.jsx
   ```

2. **Follow the pattern**:
   ```javascript
   import { cn } from '@/lib/utils'
   
   export function YourComponent({ className, ...props }) {
     return (
       <div className={cn("base-classes", className)} {...props}>
         {/* component content */}
       </div>
     )
   }
   ```

3. **Export the component**:
   ```javascript
   export { YourComponent }
   ```

4. **Use it in your app**:
   ```javascript
   import { YourComponent } from '@/components/ui/your-component'
   ```

## Best Practices

1. **Use the `cn()` utility**: Always use the `cn()` function from `@/lib/utils` for combining classes
2. **Forward props**: Use `{...props}` to allow prop spreading
3. **Support className**: Always allow className override
4. **TypeScript alternatives**: For JavaScript projects, add JSDoc comments for better IDE support
5. **Accessibility**: Ensure all components are keyboard navigable and screen reader friendly

## Styling Guidelines

1. **Use Tailwind classes**: Prefer Tailwind utilities over custom CSS
2. **Dark mode**: Use `dark:` prefix for dark mode styles
3. **Responsive**: Use responsive breakpoints (`sm:`, `md:`, `lg:`, etc.)
4. **Hover states**: Add interactive states (`hover:`, `focus:`, etc.)
5. **Transitions**: Use `transition-*` classes for smooth animations

## Dependencies

These components require:
- `@radix-ui/react-slot` - For composition patterns
- `class-variance-authority` - For component variants
- `clsx` - For conditional classes
- `tailwind-merge` - For intelligent class merging
- `framer-motion` - For animations

All dependencies are listed in `package.json`.
