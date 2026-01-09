# 📦 Light Drift v2.0 - Complete Code Reference

This document provides a quick reference to all the code files in the upgraded project.

---

## 📂 File Locations

```
floating-lanterns/
├── src/
│   ├── App.jsx                          ← Main scene & UI
│   ├── main.jsx                         ← React entry point
│   ├── index.css                        ← Global styles
│   ├── App.css                          ← (empty)
│   └── components/
│       ├── WaterPlane.jsx               ← Animated water
│       ├── Lantern.jsx                  ← 3D ethereal lantern
│       └── AmbientSound.jsx             ← Audio handler
├── public/
│   ├── ambient-water.mp3                ← Add your audio
│   └── vite.svg
├── package.json                         ← Dependencies
├── vite.config.js                       ← Vite config
└── index.html                           ← HTML entry point
```

---

## 🎯 Key Changes Summary

### Installed Dependencies
```bash
npm install @react-three/postprocessing
```

### File Updates
✅ **App.jsx** - Complete rewrite with:
   - CameraController with auto-follow
   - EffectComposer with Bloom
   - Interactive UI overlay
   - Sound & camera state management

✅ **Lantern.jsx** - Major upgrade to:
   - Stacked semi-transparent spheres
   - Particle sparkles (@react-three/drei/Sparkles)
   - Spawn animation (scale 0→1)
   - Color variations
   - Improved materials

✅ **AmbientSound.jsx** - Enhanced with:
   - `enabled` prop for UI toggle
   - Better audio state management
   - Smooth play/pause

✅ **WaterPlane.jsx** - Improved:
   - Larger plane (100×100)
   - More segments (128×128)
   - Adjusted wave parameters

✅ **index.css** - Enhanced with:
   - Gradient background
   - Button styling
   - Mobile responsive improvements

---

## 🔍 Code Organization

### Main Components

**App.jsx (329 lines)**
- Canvas setup with postprocessing
- CameraController component
- UI overlay with buttons
- State management (lanterns, audio, camera)
- Lighting system
- Event handlers

**Lantern.jsx (130 lines)**
- Stacked sphere geometry
- Emissive materials with transparency
- Particle sparkles
- Animation system
- Dual PointLights

**WaterPlane.jsx (49 lines)**
- PlaneGeometry (100×100)
- Multi-layer wave animation
- Dynamic position updates
- Material properties

**AmbientSound.jsx (48 lines)**
- Audio loading with fallback
- Play/pause control
- Volume management
- Error handling

---

## 📊 Lines of Code

| File | Lines | Purpose |
|------|-------|---------|
| App.jsx | 329 | Main scene & UI |
| Lantern.jsx | 130 | 3D lantern component |
| WaterPlane.jsx | 49 | Water plane |
| AmbientSound.jsx | 48 | Audio handling |
| **Total** | **556** | **Full application** |

---

## 🎨 Component Hierarchy

```
<App>
  ├── <AmbientSound>
  │   └── Audio element
  │
  ├── <Canvas>
  │   ├── <fog>
  │   ├── <ambientLight> + <directionalLight> + <pointLight>
  │   ├── <WaterPlane>
  │   ├── <Lantern> (×N for each spawned lantern)
  │   │   ├── <mesh> × 4 (spheres)
  │   │   ├── <Sparkles> (particle effect)
  │   │   └── <pointLight> × 2
  │   ├── <EffectComposer>
  │   │   └── <Bloom>
  │   └── <CameraController>
  │
  └── <UI Overlay>
      ├── Title & instructions (top-left)
      ├── Control buttons (top-right)
      ├── Lantern counter (bottom-left)
      └── Credits (bottom-right)
```

---

## 🔗 Import Dependencies

```javascript
// Core React & Three.js
import React, { useState, useRef, Suspense }
import { Canvas, useFrame, useThree }
import { Fog } from "three"

// Post-processing (NEW)
import { EffectComposer, Bloom }

// Drei helpers
import { Sparkles }

// Local components
import WaterPlane from "./components/WaterPlane"
import Lantern from "./components/Lantern"
import AmbientSound from "./components/AmbientSound"
```

---

## 🎮 State Management

### In App.jsx

```javascript
// Lantern positions array
const [lanterns, setLanterns] = useState([])

// Audio enabled state
const [soundEnabled, setSoundEnabled] = useState(true)

// Camera follow state
const [autoFollow, setAutoFollow] = useState(true)

// Refs for audio elements
const audioRef = useRef(null)
const chimeRef = useRef(null)
```

### State Operations

```javascript
// Add lantern
setLanterns([...lanterns, newLantern])

// Clear all lanterns
setLanterns([])

// Toggle sound
setSoundEnabled(!soundEnabled)

// Toggle camera mode
setAutoFollow(!autoFollow)
```

---

## 🎨 Color Constants

### Lantern Colors
```javascript
const colors = [
  "#ffd27f",  // Soft golden
  "#ffe8b3",  // Light peachy
  "#fff4cc",  // Pale cream
  "#ffc069",  // Warm gold
  "#ffb347"   // Peachy orange
]
```

### Lighting Colors
```javascript
// Ambient light
color="#c4a5ff"  // Purple-white

// Directional light
color="#e8c4ff"  // Soft purple

// Fill light
color="#7d9bff"  // Cool blue

// Fog
args={["#0a1e3f", 5, 120]}  // Deep dark blue
```

### UI Colors
```javascript
backgroundColor: "#6d4aff"   // Button active (purple)
backgroundColor: "#333"      // Button inactive
backgroundColor: "#d9534f"   // Reset button (red)
color: "#e8c4ff"             // Text (light purple)
```

---

## 🎬 Animation Parameters

### Lantern Drift
```javascript
const driftSpeed = 0.3 + Math.random() * 0.4      // [0.3-0.7]
const driftRangeX = 2 + Math.random() * 3         // [2-5]
const driftRangeZ = 2 + Math.random() * 3         // [2-5]
const bobAmount = 0.2 + Math.random() * 0.3       // [0.2-0.5]
const bobSpeed = 0.8 + Math.random() * 0.6        // [0.8-1.4]
```

### Spawn Animation
```javascript
// Scale from 0 to 1 over 0.5 seconds
const spawnProgress = elapsed / 0.5
scale = spawnProgress  // Linear interpolation
```

### Camera Auto-Follow
```javascript
// Smooth interpolation to target
camera.position.x += (targetPos[0] - 5 - camera.position.x) * 0.02
camera.position.z += (targetPos[2] + 8 - camera.position.z) * 0.02
camera.position.y = 4 + Math.sin(time * 0.3) * 0.3
```

---

## 💡 Post-Processing Setup

```javascript
// Effect composer with bloom
<EffectComposer>
  <Bloom 
    intensity={1.5}              // Glow strength
    luminanceThreshold={0.2}     // What glows
    luminanceSmoothing={0.9}     // Smoothness
  />
</EffectComposer>
```

---

## 🎮 Event Handlers

```javascript
// Click to spawn lantern
const handleClick = (e) => {
  const x = (Math.random() - 0.5) * 50
  const z = (Math.random() - 0.5) * 50
  const newLantern = [x, 0.5, z]
  setLanterns([...lanterns, newLantern])
  playChime()
}

// Play spawn chime
const playChime = () => {
  // Web Audio API oscillator
  // 1000Hz → 800Hz frequency sweep
  // 0.3 second duration
}

// Reset scene
const resetLanterns = () => {
  setLanterns([])
}
```

---

## 🔊 Audio Integration

### Ambient Sound
```javascript
// In AmbientSound.jsx
<audio>
  src="/ambient-water.mp3"
  loop
  volume={0.2}
  autoplay
</audio>
```

### Spawn Chime
```javascript
// Web Audio API in App.jsx
const audioContext = new AudioContext()
const osc = audioContext.createOscillator()
const gain = audioContext.createGain()

osc.frequency.setValueAtTime(1000, now)
osc.frequency.exponentialRampToValueAtTime(800, now + 0.3)
gain.gain.setValueAtTime(0.3, now)
gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3)
```

---

## 🌊 Water Animation

```javascript
// Per-vertex wave calculation
const wave1 = 0.25 * sin(x * 0.25 + t * 0.3) * cos(z * 0.25 + t * 0.3)
const wave2 = 0.15 * sin(x * 0.4 + t * 0.5) * cos(z * 0.4 + t * 0.4)
const wave3 = 0.08 * sin((x + z) * 0.3 + t * 0.35)

y = wave1 + wave2 + wave3

// Update frequency
geometry.attributes.position.needsUpdate = true
geometry.computeVertexNormals()
```

---

## 🎯 Performance Optimizations

1. **Memoization**
   ```javascript
   const colors = useMemo(() => [...], [])
   const geometry = useMemo(() => new THREE.PlaneGeometry(...), [])
   ```

2. **Efficient Updates**
   ```javascript
   // Direct array modification
   positions[i + 1] = newValue
   // Mark for update once per frame
   geometry.attributes.position.needsUpdate = true
   ```

3. **Fog Culling**
   ```javascript
   <fog args={["#0a1e3f", 5, 120]} />
   // Objects beyond 120 units auto-hidden
   ```

4. **Particle Optimization**
   ```javascript
   <Sparkles count={8} />
   // Only 8 particles per lantern
   ```

---

## 📱 Responsive Design

```css
@media (max-width: 768px) {
  button {
    padding: 10px 14px;
    font-size: 11px;
  }
  
  canvas {
    touch-action: manipulation;
  }
}
```

---

## 🚀 Build Output

```bash
npm run build
# Creates 'dist/' folder with:
# - Minified JavaScript
# - Optimized assets
# - Production-ready files
```

---

## 📚 File Quick Links

- **Main App**: `src/App.jsx`
- **Lantern Component**: `src/components/Lantern.jsx`
- **Water Component**: `src/components/WaterPlane.jsx`
- **Audio Component**: `src/components/AmbientSound.jsx`
- **Styles**: `src/index.css`
- **Config**: `vite.config.js`, `package.json`

---

## 🎓 Learning Points

This codebase teaches:

✅ React Three Fiber usage
✅ Post-processing effects
✅ Particle systems
✅ Camera interpolation
✅ State management
✅ Component composition
✅ Animation math
✅ Performance optimization

---

## 💬 Code Comments

All components include detailed comments explaining:
- Purpose of each section
- Animation formulas
- Material properties
- Performance considerations
- Customization points

---

## 🔗 Dependencies

```json
{
  "dependencies": {
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "three": "latest",
    "@react-three/fiber": "latest",
    "@react-three/drei": "latest",
    "@react-three/postprocessing": "latest"
  },
  "devDependencies": {
    "vite": "^7.2.4",
    "@vitejs/plugin-react": "^5.1.1",
    "eslint": "^9.39.1"
  }
}
```

---

## 🎬 To Get Started

1. **Navigate to project**
   ```bash
   cd floating-lanterns-1/floating-lanterns
   ```

2. **Install dependencies** (already done)
   ```bash
   npm install
   ```

3. **Start dev server**
   ```bash
   npm run dev
   ```

4. **Open browser**
   ```
   http://localhost:5173
   ```

5. **Click to spawn lanterns!** ✨

---

**That's everything!** 🏮💫

*All components are documented, optimized, and ready for customization.*
