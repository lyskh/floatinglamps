# 🏮 Floating Lanterns - Light Drift

A cozy, meditative 3D browser experience where floating lanterns drift peacefully on a calm, rippling water plane.

## Features

✨ **Visual Experience**
- Serene 3D water plane with organic ripple animations
- Glowing floating lanterns with warm lighting (#ffcc66, #ffb366)
- Smooth atmospheric fog and ambient lighting
- Gentle camera drift creating a meditative viewing experience
- Lanterns cast realistic shadows on water

🎮 **Interaction**
- Click/tap anywhere to spawn new floating lanterns
- Each lantern drifts naturally with unique animation patterns
- Lanterns accumulate peacefully on the screen

🔊 **Audio**
- Ambient water and wind sounds (looping background audio)

⚙️ **Technical**
- Built with React Three Fiber (@react-three/fiber)
- Three.js for 3D rendering
- Performance optimized with memoization
- Modular React component architecture
- Smooth animations with useFrame

## Setup & Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Audio Setup

To add ambient sound:
1. Place an ambient audio file at `public/ambient-water.mp3`
2. Recommended: Royalty-free ambient water/wind sounds from:
   - Freesound.org
   - Zapsplat.com
   - YouTube Audio Library

Alternative audio sources (royalty-free):
- Lofi/ambient backgrounds
- Nature sounds (water, rain, wind)
- Piano ambience

## Project Structure

```
src/
├── components/
│   ├── WaterPlane.jsx      # Animated water with ripples
│   ├── Lantern.jsx         # 3D floating lantern with glow
│   └── AmbientSound.jsx    # Background audio handler
├── App.jsx                 # Main scene & interactions
├── main.jsx                # React entry point
└── index.css               # Global styles
```

## Component Details

### WaterPlane
- 80x80 plane with 64x64 segments for smooth deformation
- Multiple layered sine waves for organic ripples
- Receives shadows from lantern lights
- Dark blue material with metallic properties

### Lantern
- Golden cylindrical design with caps
- PointLights for primary glow + secondary ambient glow
- Drifting animation with randomized speed & range
- Gentle vertical bobbing and rotation
- Casts shadows on water plane

### CameraController (in App.jsx)
- Smooth forward movement through the scene
- Gentle side-to-side drift
- Subtle vertical bobbing
- Auto-focus toward the water plane

## Customization

### Change Water Color
In `WaterPlane.jsx`, modify the `color` prop:
```jsx
color="#0d1f4d"  // Current dark blue
```

### Adjust Lantern Colors
In `Lantern.jsx`, change the emissive colors:
```jsx
color="#ffb366"        // Main lantern glow
emissive="#ff8c00"     // Emission intensity
```

### Camera Speed
In `App.jsx` CameraController, adjust:
```jsx
state.camera.position.z -= 0.02;  // Forward speed
```

### Spawn Area
In `App.jsx` handleClick, modify the range:
```jsx
const x = (Math.random() - 0.5) * 40;  // Horizontal spread
```

## Performance Notes

- Uses memoization for geometries and material properties
- Efficient position/rotation updates via useFrame
- Instanced lighting for multiple lanterns
- Fog culling for distant objects
- Optimized for 60fps on modern browsers

## Browser Support

- Chrome/Edge (Recommended)
- Firefox
- Safari 15+
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

Open source - feel free to modify and use in your portfolio!

---

**Enjoy the peaceful drift of floating lanterns! 🏮✨**
