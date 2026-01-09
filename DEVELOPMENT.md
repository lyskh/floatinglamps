# Light Drift - Development Guide

## Project Overview

**Light Drift** is a meditative, interactive 3D browser experience built with React, Three.js, and React Three Fiber. Players spawn glowing lanterns on a serene water surface by clicking, watching them drift and bobbing gently on the waves.

## Architecture

### Core Structure

```
src/
├── App.jsx                      # Main React component
├── App.css                      # Global styling
├── index.jsx                    # React entry point
├── components/
│   ├── Scene.jsx               # Three.js scene setup
│   ├── CameraController.jsx    # Camera movement logic
│   ├── WaterPlane.jsx          # Water surface
│   ├── Lantern.jsx             # Basic lantern component
│   ├── LanternEnhanced.jsx     # Advanced lantern with effects
│   └── ParticleSystem.jsx      # Ambient particles
└── utils/
    ├── audioManager.js         # Audio control utilities
    └── performanceMonitor.js   # Performance tracking
```

## Key Features

### 1. Interactive Lantern Placement
- **File**: [src/App.jsx](src/App.jsx)
- Click anywhere on the canvas to spawn a new lantern
- Lanterns are limited to 200 for performance optimization
- Each lantern has unique ID and position

### 2. Lantern Component
- **File**: [src/components/LanternEnhanced.jsx](src/components/LanternEnhanced.jsx)
- Multiple material layers for bloom/glow effect
- PointLight emission with flickering animation
- Sine/cosine wave drifting in X and Z axes
- Vertical bobbing animation
- Pseudo-random flicker simulation using multi-frequency sine waves

### 3. Water Surface
- **File**: [src/components/WaterPlane.jsx](src/components/WaterPlane.jsx)
- Large plane geometry (60x60 units)
- Metallic material for reflection properties
- Deep blue color (#1a4d5c) with emissive properties

### 4. Camera System
- **File**: [src/components/CameraController.jsx](src/components/CameraController.jsx)
- Smooth forward drift (0.3 units/second)
- Follows lantern centroid position
- Smooth lerp interpolation (2% per frame)
- Maintains 3D positioning for depth perception

### 5. Lighting Setup
- **File**: [src/components/Scene.jsx](src/components/Scene.jsx)
- Ambient lighting: Warm yellow (#ffee99) at 0.5 intensity
- Primary directional light: Warm (#ffddbb) from front-right
- Rim light: Cool blue (#5588ff) from back-left for depth
- Fill light: Subtle warm (#ffaa66) from below
- Fog: Dark blue gradient from 5-100 units depth

### 6. Particle System
- **File**: [src/components/ParticleSystem.jsx](src/components/ParticleSystem.jsx)
- 200 floating particles for atmosphere
- Wrapping boundary system
- Low opacity for subtle effect
- Continuous random movement

### 7. Audio Management
- **File**: [src/utils/audioManager.js](src/utils/audioManager.js)
- Audio manager singleton pattern
- Toggle audio on/off
- Volume control (default 0.3)
- Graceful handling of browser autoplay restrictions

## Animation Systems

### Lantern Drifting
```javascript
// Primary drift (2.5 unit radius)
x = base_x + sin(time * 0.3) * 2.5
z = base_z + cos(time * 0.25) * 1.8

// Secondary drift (subtle, 1 unit)
x += sin(time * 0.15) * 1
z += cos(time * 0.12) * 0.8
```

### Vertical Bobbing
```javascript
y = 0.5 + sin(time * 0.5) * 0.35
```

### Light Flickering
```javascript
intensity = 0.8 + 
  sin(time * 3) * 0.1 + 
  sin(time * 7.3) * 0.05 + 
  sin(time * 13.7) * 0.02
```

## Performance Optimization

### 1. Geometry Optimization
- Water plane: 128x128 segments (tunable for performance)
- Lantern spheres: 16-20 segments (balanced quality)
- Particle count: 200 (constant)

### 2. Material Settings
- Metalness and roughness tuned for visual quality without heavy computation
- Transparent materials use `depthWrite={false}` for efficiency
- Multiple light layers keep individual intensity low

### 3. React Optimization
- useCallback memoization for event handlers
- useRef for non-state animation references
- Efficient lantern removal via state filtering

### 4. Frame-based Animation
- All animations in `useFrame` (frame-independent)
- Particle updates only when needed
- Camera lerp for smooth interpolation

## Color Palette

| Element | Color | Hex | Purpose |
|---------|-------|-----|---------|
| Lantern Core | Golden Yellow | #ffcc66 | Primary glow |
| Lantern Emissive | Warm Orange | #ffaa22 | Light source |
| Lantern Inner | Light Cream | #ffdd99 | Inner light |
| Water | Deep Teal | #1a4d5c | Calm surface |
| Ambient Light | Warm Yellow | #ffee99 | Overall warmth |
| Directional Main | Cream | #ffddbb | Primary light |
| Rim Light | Cool Blue | #5588ff | Depth separation |
| Fill Light | Warm Orange | #ffaa66 | Bottom softness |
| Background Fog | Dark Navy | #0a1929 | Atmospheric depth |

## Customization Guide

### Change Lantern Color
**File**: [src/components/LanternEnhanced.jsx](src/components/LanternEnhanced.jsx#L32)
```javascript
color="#ffcc66"          // Change this
emissive="#ffaa22"       // And this
```

### Adjust Drift Speed
**File**: [src/components/LanternEnhanced.jsx](src/components/LanternEnhanced.jsx#L43)
```javascript
Math.sin(time * 0.3) * 2.5  // Change 0.3 for time multiplier, 2.5 for amplitude
```

### Modify Camera Speed
**File**: [src/components/CameraController.jsx](src/components/CameraController.jsx#L16)
```javascript
targetRef.current.z = 15 - time * 0.3;  // Change 0.3
```

### Adjust Max Lanterns
**File**: [src/App.jsx](src/App.jsx#L11)
```javascript
const maxLanternsRef = useRef(200);  // Change to desired limit
```

### Water Color
**File**: [src/components/WaterPlane.jsx](src/components/WaterPlane.jsx#L16)
```javascript
color="#1a4d5c"  // Change this
```

## Audio Setup

### Adding Custom Audio

1. Obtain a royalty-free ambient sound file (MP3 format)
2. Place it at `public/audio/ambient-water.mp3`
3. The audio will automatically loop when enabled

### Recommended Audio Sources
- Freesound.org - Search "ambient water"
- Zapsplat.com - Royalty-free music library
- Pixabay.com/sounds - Free audio tracks

### Audio Quality Settings
- Format: MP3
- Bitrate: 128-192 kbps (web-optimized)
- Duration: 30-60 seconds (will loop)

## Browser Compatibility

Tested and working on:
- Chrome 90+
- Firefox 88+
- Safari 15+
- Edge 90+

### Known Limitations
- iOS Safari: Autoplay audio requires user interaction
- Some older devices: May need to reduce particle count

## Performance Metrics

### Target Performance
- **FPS**: 60 on mid-range devices
- **Lanterns**: 150-200 simultaneously
- **Memory**: <100MB with 200 lanterns
- **Load Time**: <2 seconds on broadband

### Optimization Tips
1. Reduce `ParticleSystem` count for lower-end devices
2. Lower water plane segments: Change `128` to `64` in WaterPlane.jsx
3. Disable secondary point lights on low-end devices
4. Consider reducing max lantern limit

## Deployment

### Build for Production
```bash
npm run build
```

Outputs to `dist/` directory

### Deployment Platforms
- **Vercel**: Zero-config deployment
- **Netlify**: Drag-and-drop or git integration
- **GitHub Pages**: Static hosting
- **AWS S3 + CloudFront**: Premium CDN

## Future Enhancement Ideas

1. **Mobile Touch Support**: Tap for lantern placement
2. **Sound Effects**: Splash sounds, ambient music variations
3. **Seasonal Themes**: Different water colors, lighting
4. **Lantern Customization**: Color picker for lantern glow
5. **Difficulty Modes**: Waves, wind effects
6. **Lantern Lifespan**: Lanterns fade after time period
7. **Mobile Performance Mode**: Reduced geometry/particles
8. **Sharing**: Screenshot/video recording feature

## Troubleshooting

### Lanterns Not Appearing
- Check Canvas is rendering (check console for errors)
- Verify click coordinates are being calculated
- Ensure Scene component is receiving lanterns prop

### Performance Issues
- Reduce max lanterns in App.jsx
- Disable ParticleSystem in Scene.jsx
- Reduce water plane segments
- Check for GPU bottleneck in DevTools

### Audio Not Playing
- Check file is at `public/audio/ambient-water.mp3`
- Browser may block autoplay - requires user interaction
- Check browser console for CORS errors

### Camera Not Moving
- Verify CameraController is mounted in Scene
- Check camera initial position in App.jsx Canvas
- Verify useFrame is being called

## Code Quality Notes

- **Modular**: Each component is independent and testable
- **Performance-focused**: All animations use useFrame for efficiency
- **Accessible**: UI has proper contrast and readable fonts
- **Responsive**: Mobile-optimized layout
- **Well-commented**: Key algorithms explained in code

## Resources

- [React Three Fiber Docs](https://docs.pmnd.rs/react-three-fiber/)
- [Drei Documentation](https://github.com/pmndrs/drei)
- [Three.js Manual](https://threejs.org/manual/)
- [React Documentation](https://react.dev/)
