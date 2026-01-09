# Light Drift - Troubleshooting Guide

## ✅ Current Status: Working!

Your project is running at `http://localhost:3000` with hot module replacement enabled.

---

## 🔍 Common Issues & Solutions

### Issue 1: White Blank Page / Console Errors

**Symptoms:**
- Page shows white/blank
- Console shows Three.js or React errors
- Lanterns not rendering

**Solutions:**
1. Check browser console (F12 → Console tab)
2. Hard refresh: Ctrl+Shift+R (or Cmd+Shift+R on Mac)
3. Clear browser cache and reload
4. Check that dev server is running: `npm run dev`

### Issue 2: Lanterns Not Appearing When Clicking

**Symptoms:**
- Click on canvas but nothing appears
- Counter doesn't increase
- No visual feedback

**Solutions:**
1. Verify click coordinates: Open console and click
2. Check Canvas is rendering (background should show scene)
3. Verify Scene.jsx is properly importing LanternEnhanced
4. Check for JavaScript errors in console

### Issue 3: Performance Issues / Slow FPS

**Symptoms:**
- Stuttering or choppy animation
- Dropping below 30 FPS
- High memory usage

**Solutions:**
1. **Reduce Lanterns**: Edit `src/App.jsx` line 11
   ```javascript
   const maxLanternsRef = useRef(100);  // Lower from 200
   ```

2. **Disable Particles**: In `src/components/Scene.jsx`, comment out:
   ```javascript
   // <ParticleSystem />
   ```

3. **Lower Water Resolution**: Edit `src/components/WaterPlane.jsx` line 15
   ```javascript
   <planeGeometry args={[60, 60, 64, 64]} />  // From 128, 128
   ```

4. **Check Device**: Run on different device/browser

### Issue 4: Audio Not Playing

**Symptoms:**
- Sound button shows 🔊 but no audio
- Button doesn't toggle properly
- "Autoplay blocked" message in console

**Solutions:**
1. **Add Audio File**: Place MP3 at `public/audio/ambient-water.mp3`
   - Format: MP3
   - Bitrate: 128-192 kbps
   - Duration: 30-60 seconds

2. **Browser Autoplay**: Some browsers block autoplay
   - Audio will play after first user click
   - This is normal behavior (security feature)

3. **Check File Path**: Verify file exists at exactly:
   ```
   public/audio/ambient-water.mp3
   ```

4. **Test Audio Toggle**: Click 🔊 button to enable/disable

### Issue 5: Camera Movement Jumpy

**Symptoms:**
- Camera stutters or jumps
- Jerky motion following lanterns
- Not smooth

**Solutions:**
1. Check FPS (should be 60 consistently)
2. Reduce max lanterns (Performance Issue #2)
3. Verify camera lerp value in `src/components/CameraController.jsx`
   ```javascript
   camera.position.lerp(targetRef.current, 0.02);  // 0.02 = 2% per frame
   ```
4. Check for expensive operations in useFrame hooks

### Issue 6: Lanterns Clipping Through Water

**Symptoms:**
- Lanterns appear below water surface
- Water plane visible through lanterns
- Z-ordering issues

**Solutions:**
1. This is usually visual preference
2. Adjust water plane position in `src/components/WaterPlane.jsx`
3. Adjust lantern starting height in `src/components/LanternEnhanced.jsx` line 31:
   ```javascript
   groupRef.current.position.y = 0.8;  // Increase from 0.5
   ```

### Issue 7: Mobile Touch Doesn't Work

**Symptoms:**
- Tap doesn't place lanterns on mobile
- Only mouse clicks work
- Touch events not detected

**Status:**
- Currently supports mouse clicks
- Mobile touch support can be added

**Add Touch Support:**
Edit `src/App.jsx` in `handleCanvasClick`:
```javascript
const handleCanvasClick = useCallback((event) => {
  if (event.target.tagName === 'CANVAS') {
    // Get coordinates - works for both mouse and touch
    const rect = event.currentTarget.getBoundingClientRect();
    const clientX = event.clientX || event.touches?.[0].clientX;
    const clientY = event.clientY || event.touches?.[0].clientY;
    
    const x = (clientX - rect.left) / rect.width * 2 - 1;
    const y = -(clientY - rect.top) / rect.height * 2 + 1;
    
    // ... rest of code
  }
}, [lanterns.length]);
```

Then add to Canvas:
```jsx
<Canvas
  onPointerDown={handleCanvasClick}  // Use onPointerDown for touch
  // ... other props
>
```

### Issue 8: Colors Look Wrong

**Symptoms:**
- Colors appear different than expected
- Screen looks too dark/bright
- Wrong color palette

**Solutions:**
1. Check monitor settings
2. Adjust ambient light in `src/components/Scene.jsx` line 13:
   ```javascript
   <ambientLight intensity={0.5} color="#ffee99" />  // Adjust intensity
   ```
3. Check fog color: `src/components/Scene.jsx` line 11:
   ```javascript
   <fog attach="fog" args={['#0a1929', 5, 100]} />  // Change color
   ```
4. Different browsers may render slightly differently - this is normal

### Issue 9: Dev Server Won't Start

**Symptoms:**
- `npm run dev` fails with error
- Port 3000 already in use
- EADDRINUSE error

**Solutions:**
1. **Port in use**: Kill process on port 3000
   ```powershell
   # Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   
   # Or use different port in vite.config.js
   ```

2. **Missing dependencies**: Reinstall
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Cache issues**: Clear Vite cache
   ```bash
   rm -rf node_modules/.vite
   npm run dev
   ```

### Issue 10: Build Fails

**Symptoms:**
- `npm run build` shows errors
- Production build won't complete
- dist folder empty

**Solutions:**
1. Check for TypeScript errors: Files should use `.jsx`
2. Verify all imports are correct
3. Check for console errors in dev first
4. Try clearing cache:
   ```bash
   rm -rf node_modules/.vite
   npm run build
   ```

---

## 🔧 Debug Commands

### Check Dependencies
```bash
npm ls
```

### Test Build
```bash
npm run build
npm run preview
```

### Check Port 3000
```powershell
netstat -ano | findstr :3000
```

### Clear All Caches
```bash
rm -rf node_modules/.vite
rm -rf dist
npm install --legacy-peer-deps
npm run dev
```

### Check GPU Usage (Chrome)
1. Open DevTools (F12)
2. Go to Performance tab
3. Record a few seconds
4. Look for GPU usage in timeline

---

## 📊 Performance Debugging

### Enable Performance Stats
Uncomment in `src/components/Scene.jsx`:
```jsx
// <DebugStats lanternCount={lanterns.length} />
```

This shows:
- FPS (frames per second)
- Lantern count
- Memory usage

### Check Frame Rate
1. Open DevTools (F12)
2. Go to Performance tab
3. Record interactions
4. Look for consistent 60fps baseline

### Memory Profiling
1. DevTools → Memory tab
2. Take heap snapshot
3. Add lanterns and take another
4. Compare sizes

---

## 🚀 Optimization Tips

### For Better Performance:

1. **Reduce Particles**
   ```javascript
   const particleCount = 100;  // From 200
   ```

2. **Simpler Water Geometry**
   ```javascript
   <planeGeometry args={[60, 60, 64, 64]} />  // From 128, 128
   ```

3. **Disable Shadows** (in Scene.jsx)
   ```javascript
   // Remove shadow-* props from directionalLight
   ```

4. **Use Simpler Materials**
   ```javascript
   roughness={0.8}  // Increase for less computation
   ```

5. **Limit Lanterns**
   ```javascript
   const maxLanternsRef = useRef(100);  // From 200
   ```

---

## 🌐 Browser DevTools Tips

### Chrome
- F12 or Ctrl+Shift+I
- Console for errors
- Performance tab for FPS
- Memory for memory profiling

### Firefox
- F12 or Ctrl+Shift+I
- Inspector for DOM
- Console for errors
- Performance for recording

### Safari
- Cmd+Option+I
- Develop menu > Enable Web Inspector
- Similar tabs to Chrome

---

## 📝 Log Output Examples

### Normal Operation
```
[vite] hmr update /src/App.jsx
[vite] hmr update /src/components/Scene.jsx
```

### Error Examples
```
Uncaught TypeError: Cannot read properties of undefined (reading 'position')
Uncaught ReferenceError: AudioManager is not defined
```

---

## 🎯 Quick Checklist

Before deploying:
- [ ] Test on Chrome, Firefox, Safari
- [ ] Test on mobile device (or DevTools mobile mode)
- [ ] Check console for errors (F12)
- [ ] Verify FPS is 60+ (Performance tab)
- [ ] Test audio toggle works
- [ ] Test lantern placement works
- [ ] Test clear button works
- [ ] Check responsive design (DevTools)
- [ ] Add audio file (if desired)
- [ ] Test build: `npm run build`

---

## 💬 Need More Help?

1. **Check Error Message**: Copy exact error from console
2. **Check Web**: Search error + "React Three Fiber"
3. **Check Files**: Review relevant component file
4. **Compare with Working Version**: Check all imports match
5. **Ask AI**: Describe symptoms and what you've tried

---

## ✨ You're All Set!

The dev server is running and hot-reloading is active. Make changes and see them instantly reflected in the browser. Good luck! 🚀
