# 🏮 Floating Lanterns - Setup & Development Guide

## Quick Start

```bash
cd floating-lanterns
npm run dev
```

The app will start at `http://localhost:5173`

## What's Included

### Core Features ✨
- **Animated Water Plane**: Organic ripple effects with multiple wave layers
- **Floating Lanterns**: 3D golden lanterns with realistic glowing
- **Interactive Spawning**: Click anywhere to create new lanterns
- **Smooth Camera**: Meditative forward drift with gentle movement
- **Atmospheric Lighting**: Warm color palette (#ffcc66, #ffb366) with fog
- **Performance Optimized**: Smooth 60fps animations

### Architecture

```
App.jsx
├── CameraController (smooth camera movement)
├── WaterPlane.jsx (animated rippling water)
├── Lantern.jsx (individual floating lantern)
│   ├── Cylinder body (lantern structure)
│   ├── Sphere glow (inner light)
│   └── PointLights (illumination)
└── AmbientSound.jsx (background audio)
```

## Key Components

### **WaterPlane.jsx**
- 80x80 plane with 64x64 segments
- 3-layer sine wave system for organic ripples
- Clock-based animation for smooth continuous ripples
- Stores initial positions to calculate deformation

### **Lantern.jsx**
- Cylindrical design with golden metallic material
- **Animations**:
  - Sine-wave drifting (X & Z axes)
  - Subtle vertical bobbing (Y axis)
  - Gentle continuous rotation
- **Lighting**:
  - Primary warm glow (#ffcc66) - 2 intensity
  - Secondary softer glow (#ffb366) - 0.8 intensity
  - 20-40 unit distance for light spread
- **Randomization**: Each lantern gets unique drift speed, range, and time offset

### **CameraController**
- Continuous forward movement (-0.02 Z per frame)
- Sinusoidal side-drift (X axis)
- Vertical bobbing (Y axis)
- Auto-lookAt toward water surface

### **AmbientSound.jsx**
- Lazy audio loading on first user interaction
- Looping background audio
- 0.25 volume for subtle ambiance

## Customization Guide

### Change Water Color
**File**: `src/components/WaterPlane.jsx` (line 34)
```jsx
color="#0d1f4d"  // Change this hex value
```

### Adjust Lantern Brightness
**File**: `src/components/Lantern.jsx` (lines 58, 67)
```jsx
<pointLight 
  intensity={2}        // Change brightness (1-5 recommended)
  distance={20}        // Change light spread (10-50 recommended)
  color="#ffcc66"      // Change color
/>
```

### Change Camera Speed
**File**: `src/App.jsx` (lines 14-24)
```jsx
state.camera.position.z -= 0.02;           // Forward speed (0.01-0.05)
state.camera.position.x += Math.sin(...) * 0.01;  // Drift amount (0.005-0.02)
```

### Adjust Spawn Area
**File**: `src/App.jsx` (lines 34-35)
```jsx
const x = (Math.random() - 0.5) * 40;  // Horizontal spread (20-80 recommended)
const z = (Math.random() - 0.5) * 40;  // Depth spread (20-80 recommended)
```

### Fog Effect
**File**: `src/App.jsx` (line 51)
```jsx
<fog attach="fog" args={["#0d1f4d", 10, 100]} />
//                            color  near far
```

## Audio Setup

### Option 1: Use Royalty-Free Audio
1. Visit: [Freesound.org](https://freesound.org), [Zapsplat](https://www.zapsplat.com), or YouTube Audio Library
2. Search for: "ambient water", "gentle wind", "peaceful nature"
3. Download MP3 file
4. Save as `public/ambient-water.mp3`

### Option 2: Silence
Just delete the audio reference, or leave it without a file - the app will still work.

## Performance Tips

1. **Monitor FPS**: Check browser DevTools → Performance tab
2. **Lantern Limit**: Current setup handles 50-100+ lanterns smoothly
3. **Disable Shadows** (if needed):
   - Remove `castShadow` props from lantern meshes
   - Remove shadow directives from lights

## Browser DevTools

### Check Performance
```javascript
// In console:
console.log(window.devicePixelRatio);  // Check device scaling
```

### Three.js Inspector
Install [Three.js Inspector](https://chrome.google.com/webstore/detail/threejs-inspector/nhmfnjhjhfbdaafdmfhjogfcehbhefjo) extension to inspect 3D scene in real-time.

## Common Issues

### Audio Not Playing
- Browser autoplay policy may block it
- Requires user interaction first (click/tap)
- Check browser console for errors

### Low FPS/Stuttering
- Reduce water plane segments: Change `64, 64` to `32, 32` in WaterPlane.jsx
- Disable fog if not needed
- Close other browser tabs

### Lanterns Not Appearing
- Check browser console for errors
- Ensure Three.js is properly loaded (check Network tab)
- Verify click position is being registered

## Build for Production

```bash
npm run build
# Creates optimized build in 'dist/' folder
npm run preview  # Preview production build locally
```

## Project File Structure
```
floating-lanterns/
├── src/
│   ├── components/
│   │   ├── WaterPlane.jsx      (51 lines)
│   │   ├── Lantern.jsx         (94 lines)
│   │   └── AmbientSound.jsx    (32 lines)
│   ├── App.jsx                 (111 lines)
│   ├── App.css                 (empty - use index.css)
│   ├── main.jsx                (React bootstrap)
│   └── index.css               (Global styles)
├── public/
│   ├── ambient-water.mp3       (Add your audio here)
│   └── vite.svg
├── package.json
├── vite.config.js
├── index.html
└── README.md
```

## Dependencies

- **react**: UI framework
- **react-dom**: React rendering
- **three**: 3D graphics engine
- **@react-three/fiber**: React renderer for Three.js
- **@react-three/drei**: Helpful R3F utilities

Install all with:
```bash
npm install
```

## Next Steps / Enhancement Ideas

- Add particle effects (sparkles/fireflies)
- Implement lantern color variations
- Add mouse position tracking for camera focus
- Sound effects on lantern spawn
- Mobile touch optimizations
- VR support with WebXR
- Lantern persistence (localStorage)
- Different scene themes (forest, night sky, etc.)

---

**Happy coding! Create something beautiful with floating lanterns. 🏮✨**
