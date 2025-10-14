# Troubleshooting Guide

## Common Errors and Solutions

### ✅ Fixed Issues

#### 1. Window is not defined
**Error**: `ReferenceError: window is not defined`

**Cause**: Using `window.innerWidth` during initial render

**Solution**: ✅ **FIXED** - Changed to use viewport units (`vw`, `vh`) instead of `window` object

#### 2. Path module issues
**Error**: `__dirname is not defined in ES module scope`

**Cause**: Using CommonJS `__dirname` in ESM module

**Solution**: ✅ **FIXED** - Updated `vite.config.js` to use ES module syntax

---

## Installation Issues

### Issue: npm install fails

```bash
# Solution 1: Clear cache
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

# Solution 2: Use different registry
npm install --registry=https://registry.npmjs.org/

# Solution 3: Check Node version
node --version  # Should be 16.x or higher
```

### Issue: Port 3000 already in use

```bash
# Solution 1: Kill the process
lsof -ti:3000 | xargs kill -9

# Solution 2: Use different port
npm run dev -- --port 3001

# Solution 3: Update vite.config.js
# Change port: 3000 to port: 3001
```

---

## Runtime Errors

### Issue: Cannot find module '@/...'

**Cause**: Path alias not working

**Solution**:
```bash
# 1. Restart dev server
# Press Ctrl+C
npm run dev

# 2. Check jsconfig.json exists
# Should have @ alias configured

# 3. Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

### Issue: Framer Motion errors

**Error**: `Error: Uncaught [TypeError: Cannot read properties of undefined]`

**Solution**:
```bash
# Reinstall framer-motion
npm uninstall framer-motion
npm install framer-motion@10.16.5
```

### Issue: Tailwind classes not applying

**Solution**:
```bash
# 1. Check tailwind.config.js content paths
# Should include: "./src/**/*.{js,jsx}"

# 2. Restart dev server
npm run dev

# 3. Clear browser cache
# Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
```

---

## Component Errors

### Issue: GooeyText not animating

**Possible causes**:
1. Framer Motion not installed
2. SVG filter not supported
3. Browser compatibility

**Solution**:
```javascript
// Check browser console for errors
// Try in Chrome/Firefox/Safari latest versions

// Verify framer-motion is installed
npm list framer-motion
```

### Issue: Preloader doesn't disappear

**Cause**: `onLoadComplete` callback not firing

**Solution**:
```javascript
// In App.jsx, verify:
const handleLoadComplete = () => {
  console.log('Loading complete!') // Add this for debugging
  setIsLoading(false)
}

// Check browser console for the log message
```

### Issue: BackgroundPaths not showing

**Possible causes**:
1. Component not imported correctly
2. Missing props
3. CSS height issue

**Solution**:
```javascript
// Ensure container has height
<div className="min-h-screen">
  <BackgroundPaths title="Test" />
</div>

// Check browser inspector for element presence
```

---

## Build Errors

### Issue: Build fails with "out of memory"

```bash
# Solution: Increase Node memory
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

### Issue: Cannot resolve dependencies

```bash
# Solution: Clean install
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## Development Server Issues

### Issue: Hot reload not working

```bash
# Solution 1: Restart server
# Ctrl+C then npm run dev

# Solution 2: Clear Vite cache
rm -rf node_modules/.vite
npm run dev

# Solution 3: Check file watchers
# On Linux, increase limit:
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

### Issue: Slow dev server

```bash
# Solution 1: Exclude node_modules from antivirus
# Add to exclusion list in your antivirus software

# Solution 2: Use Vite cache
# Already enabled in vite.config.js

# Solution 3: Disable source maps in development
# Add to vite.config.js:
build: {
  sourcemap: false
}
```

---

## Browser Console Errors

### Error: Failed to fetch dynamically imported module

**Cause**: Build output changed, browser cached old version

**Solution**:
```bash
# 1. Clear browser cache
# 2. Hard refresh: Cmd+Shift+R or Ctrl+Shift+R
# 3. Rebuild:
npm run build
npm run preview
```

### Error: ResizeObserver loop limit exceeded

**Cause**: Harmless error from animations

**Solution**: This is safe to ignore. It doesn't affect functionality.

### Error: WebSocket connection failed

**Cause**: Dev server not running or port issue

**Solution**:
```bash
# Check if dev server is running
# Restart if needed
npm run dev
```

---

## Styling Issues

### Issue: Colors not showing correctly

**Check**:
1. `tailwind.config.js` has correct color definitions
2. `index.css` imports Tailwind directives
3. PostCSS is configured

**Solution**:
```bash
# Verify tailwind.config.js
# Should have primary and carbon colors

# Check index.css has:
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Issue: Animations janky/slow

**Causes**:
1. Too many elements animating
2. Browser performance
3. GPU acceleration disabled

**Solutions**:
```css
/* Add GPU acceleration */
.animated-element {
  transform: translateZ(0);
  will-change: transform;
}

/* Reduce particle count in Preloader.jsx */
{[...Array(10)].map((_, i) => ( /* Changed from 20 to 10 */
```

---

## Performance Issues

### Issue: High memory usage

**Solutions**:
1. Reduce animation count
2. Optimize images
3. Code split components

```javascript
// Lazy load heavy components
import { lazy, Suspense } from 'react'

const Preloader = lazy(() => import('./components/Preloader'))

<Suspense fallback={<div>Loading...</div>}>
  <Preloader />
</Suspense>
```

### Issue: Slow initial load

**Solutions**:
```bash
# 1. Build and check bundle size
npm run build

# 2. Check for large dependencies
npm list --depth=0

# 3. Optimize build
# Already configured in Vite
```

---

## Module Resolution Errors

### Error: Cannot find module 'clsx'

```bash
# Solution: Install dependencies
npm install clsx tailwind-merge
```

### Error: Cannot find module '@radix-ui/react-slot'

```bash
# Solution: Install Radix UI
npm install @radix-ui/react-slot
```

### Error: Cannot find module 'class-variance-authority'

```bash
# Solution: Install CVA
npm install class-variance-authority
```

---

## Quick Fixes Checklist

When you encounter errors, try these in order:

1. ✅ **Restart dev server**
   ```bash
   # Ctrl+C then
   npm run dev
   ```

2. ✅ **Clear cache**
   ```bash
   rm -rf node_modules/.vite
   npm run dev
   ```

3. ✅ **Reinstall dependencies**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

4. ✅ **Clear browser cache**
   - Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)

5. ✅ **Check browser console**
   - F12 → Console tab
   - Look for error messages

6. ✅ **Check terminal output**
   - Look for error messages in terminal

7. ✅ **Verify Node version**
   ```bash
   node --version  # Should be 16+ or 18+
   ```

---

## Getting Help

### Debug Mode

Add console logs to troubleshoot:

```javascript
// In App.jsx
console.log('App rendering, isLoading:', isLoading)

// In Preloader.jsx
console.log('Preloader progress:', progress)

// In GooeyText component
console.log('Texts:', texts)
```

### Check Component Mounting

```javascript
useEffect(() => {
  console.log('Component mounted!')
  return () => console.log('Component unmounted!')
}, [])
```

### Verify Props

```javascript
console.log('Props received:', { title, subtitle, texts })
```

---

## Still Having Issues?

1. **Check the documentation**:
   - `START_HERE.md`
   - `SETUP.md`
   - `PRELOADER_QUICKSTART.md`

2. **Verify all files exist**:
   - `src/components/Preloader.jsx`
   - `src/components/ui/gooey-text-morphing.jsx`
   - `src/components/ui/button.jsx`
   - `src/lib/utils.js`

3. **Check package.json dependencies**:
   ```bash
   cat package.json | grep dependencies -A 15
   ```

4. **Test individual components**:
   ```javascript
   // Temporarily simplify App.jsx to test
   function App() {
     return <div>Test</div>
   }
   ```

---

## Emergency Reset

If nothing works, start fresh:

```bash
# 1. Backup your work
cp -r src src_backup

# 2. Clean everything
rm -rf node_modules package-lock.json node_modules/.vite

# 3. Reinstall
npm install

# 4. Restart
npm run dev
```

---

## Contact & Support

- Check browser DevTools Console (F12)
- Check terminal output
- Review error messages carefully
- Try the fixes in order
- Don't skip the "Quick Fixes Checklist"

Most issues are resolved by restarting the dev server or clearing cache!
