# 🏮 Floating Lanterns - Architecture & Component Guide

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────┐
│                    React App                        │
│         (entry point: main.jsx)                     │
└────────────────────┬────────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         │                       │
    ┌────▼─────┐          ┌─────▼────┐
    │ App.jsx  │          │ index.css │
    │ (Main    │          │ (Global  │
    │  Scene)  │          │  Styles) │
    └────┬─────┘          └──────────┘
         │
    ┌────┴───────────────────────┐
    │   <Canvas>                 │
    │   (React Three Fiber)      │
    │                            │
    ├─ <CameraController>        │
    ├─ <Lights>                  │
    │  ├─ ambientLight           │
    │  ├─ directionalLight       │
    │  └─ pointLight (fill)      │
    ├─ <Fog>                     │
    ├─ <WaterPlane>              │
    │  └─ Animated ripples       │
    ├─ <Lantern> ×N             │
    │  ├─ Cylinders              │
    │  ├─ Glow sphere            │
    │  └─ PointLights            │
    └────┬────────────────────────┘
         │
    ┌────▼─────────────────┐
    │ <AmbientSound>       │
    │ (Background audio)   │
    └──────────────────────┘
```

## 📊 Data Flow

```
User Click
    │
    ├─→ handleClick()
    │   │
    │   ├─→ Generate random X, Z position
    │   │
    │   └─→ setLanternPositions([...prev, newLantern])
    │
    └─→ State Update
        │
        ├─→ Re-render <Lantern> components
        │
        └─→ useFrame() updates animations
            │
            ├─→ Camera position updates
            ├─→ Water ripples recalculate
            ├─→ Lanterns drift smoothly
            │
            └─→ New frame rendered (60 FPS)
```

## 🎬 Animation Pipeline

```
Clock Time
   │
   ├─→ WaterPlane.jsx
   │   ├─ Calculates: time * 0.5, time * 0.7, time * 0.4
   │   ├─ Applies to: sin(x * freq + time * speed)
   │   ├─ Updates: geometry.attributes.position
   │   └─ Renders: Rippling water surface
   │
   ├─→ Lantern.jsx (×N)
   │   ├─ Random offset per lantern (time offset)
   │   ├─ Calculates: sin(time * speed + offset) * range
   │   ├─ Applies to: position.x, position.z, position.y
   │   ├─ Updates: group.position (all meshes move together)
   │   ├─ Lights: Cast glow on water (dynamic)
   │   └─ Renders: Glowing, drifting lantern
   │
   └─→ CameraController
       ├─ Calculates: time * 0.3, time * 0.4, time * 0.5
       ├─ Updates: camera.position.x, y, z
       ├─ Sets: camera.lookAt() target
       └─ Result: Smooth meditative camera movement
```

## 🎨 Component Hierarchy

```
App
├── State: lanternPositions (array of [x, y, z])
│
├── Methods:
│   └── handleClick(e): Adds new lantern position to state
│
├── Renders:
│   ├── <AmbientSound> {url}
│   │   └── Creates audio element (listener pattern)
│   │
│   ├── <Canvas>
│   │
│   ├─── <CameraController>
│   │    └── useFrame(): Updates camera position every frame
│   │
│   ├─── <fog>
│   │    └── Linear fog from 10-100 units
│   │
│   ├─── <ambientLight>
│   │    └── Global illumination (warmth)
│   │
│   ├─── <directionalLight>
│   │    └── Sun-like light with shadow map
│   │
│   ├─── <pointLight>
│   │    └── Cool blue fill light for contrast
│   │
│   ├─── <WaterPlane>
│   │    ├── useRef: meshRef (plane mesh)
│   │    ├── useRef: initialPositions (vertex backup)
│   │    ├── useMemo: PlaneGeometry (optimization)
│   │    ├── useFrame(): Ripple animation
│   │    └── Renders: 80×80 plane, 64×64 subdivisions
│   │
│   ├─── {lanternPositions.map((pos) => (
│   │    │  
│   │    └── <Lantern position={pos}>
│   │        ├── useRef: groupRef (position container)
│   │        ├── useMemo: timeOffset, driftSpeed, driftRange
│   │        ├── useFrame(): Smooth drift animation
│   │        │
│   │        └── Renders: <group> containing:
│   │            ├── <mesh> Cylinder (body)
│   │            ├── <mesh> Cylinder (top cap)
│   │            ├── <mesh> Sphere (glow)
│   │            ├── <pointLight> (primary: intensity 2)
│   │            ├── <pointLight> (secondary: intensity 0.8)
│   │            └── <mesh> Cylinder (bottom)
│   │    ))}
│   │
│   └── <div> UI Overlay
│        └── Instructions text
│
└── Background: Dark blue (#0a1625)
```

## 🔄 Lifecycle Flow

### Component Mount
```
App mounts
│
├─→ Create initial state: [[0, 0, 0]] (one lantern)
├─→ Mount <AmbientSound> → Create audio object
├─→ Mount <Canvas> with <CameraController>
└─→ Begin render loop (60 FPS)
```

### Per Frame (60 times per second)
```
useFrame() called
│
├─→ CameraController:
│   └─ Update camera.position based on clock.getElapsedTime()
│
├─→ WaterPlane:
│   ├─ Get clock.getElapsedTime()
│   ├─ For each vertex: Calculate wave1 + wave2 + wave3
│   ├─ Update geometry.attributes.position.array
│   ├─ Mark needsUpdate = true
│   └─ computeVertexNormals()
│
├─→ Each Lantern:
│   ├─ Get time from state.clock.getElapsedTime()
│   ├─ Calculate new position based on:
│   │  ├─ x: baseX + sin(time * speed + offset) * range
│   │  ├─ z: baseZ + cos(time * speed * 0.7 + offset) * range
│   │  └─ y: baseY + sin(time * 1.5 + offset) * 0.3
│   ├─ Update group.position → All child meshes move
│   ├─ Increment group.rotation.y += 0.005
│   └─ PointLights illuminate from new position
│
└─→ Render new frame
```

### On Click
```
User clicks canvas
│
├─→ handleClick(e)
│   ├─ Generate random x = (Math.random() - 0.5) * 40
│   ├─ Generate random z = (Math.random() - 0.5) * 40
│   ├─ Create new position: [x, 0.2, z]
│   │
│   └─→ setLanternPositions([...prev, newPosition])
│
└─→ React re-renders
    │
    ├─→ New <Lantern> component created with new position
    ├─→ useFrame() initialized with random parameters
    ├─→ Animation begins smoothly
    │
    └─→ Canvas updates with new lantern (60 FPS)
```

## 🎮 State Management

```
lanternPositions: Array<[number, number, number]>

Example:
[
  [0, 0.2, 0],           // First lantern
  [15.3, 0.2, -8.7],     // Second lantern (clicked)
  [-12.1, 0.2, 6.4],     // Third lantern (clicked)
  ...more lanterns
]

Each lantern:
  ├─ position[0] = X (horizontal)
  ├─ position[1] = Y (vertical, always ~0.2)
  └─ position[2] = Z (depth)

Rendering:
  lanternPositions.map((pos, idx) => (
    <Lantern key={idx} position={pos} />
  ))

  ✓ React re-renders only when state changes
  ✓ Each Lantern gets unique animation parameters
  ✓ Array index used as key (since static list)
```

## 🔆 Lighting System

```
Scene Lighting Layers:

Layer 1: Ambient Light
├─ Type: ambientLight
├─ Intensity: 0.4
├─ Color: #ffcc99 (warm white)
└─ Effect: Global illumination (all surfaces lit equally)

Layer 2: Directional Light
├─ Type: directionalLight
├─ Position: [10, 15, 10] (from top-right)
├─ Intensity: 0.6
├─ Color: #ffcc99 (warm white)
├─ Shadow Map: 2048×2048
├─ castShadow: true
└─ Effect: Sun-like directional lighting + shadows

Layer 3: Fill Light
├─ Type: pointLight
├─ Position: [-20, 10, -20] (from opposite side)
├─ Intensity: 0.3
├─ Color: #6699ff (cool blue)
├─ Distance: 100 units
└─ Effect: Fill shadows with cool blue for contrast

Layer 4: Lantern Lights
├─ Per Lantern: 2 PointLights
│
├─ Primary Light:
│  ├─ Intensity: 2
│  ├─ Distance: 20 units
│  ├─ Color: #ffcc66 (bright yellow)
│  └─ Effect: Bright local glow
│
└─ Secondary Light:
   ├─ Intensity: 0.8
   ├─ Distance: 40 units
   ├─ Color: #ffb366 (orange)
   └─ Effect: Softer ambient glow
```

## 🌊 Water Animation Math

```
For each vertex in WaterPlane (every frame):

x = vertex.x (from initial position)
z = vertex.z (from initial position)
t = clock.getElapsedTime()

y = wave1 + wave2 + wave3

where:
  wave1 = 0.3 × sin(x × 0.3 + t × 0.5) × cos(z × 0.3 + t × 0.5)
          └─────────────────────────────┬────────────────────────┘
                    Creates circular ripple pattern

  wave2 = 0.2 × sin(x × 0.5 + t × 0.7) × cos(z × 0.5 + t × 0.3)
          └─────────────────────────────┬────────────────────────┘
                    Slightly different frequency

  wave3 = 0.1 × sin((x + z) × 0.4 + t × 0.4)
          └─────────────────────────────┬────────────────────┘
                    Diagonal wave interference

Result:
  ✓ Complex organic-looking ripples
  ✓ No repeating pattern (different frequencies)
  ✓ Smooth continuous motion
  ✓ Looks natural, not artificial
```

## 🏮 Lantern Animation Math

```
For each Lantern (every frame):

Random variables (set once):
  offset = Math.random() × π × 2     [0 to 2π]
  speed = 0.5 + Math.random() × 0.5  [0.5 to 1.0]
  range = 3 + Math.random() × 2      [3 to 5 units]

Per frame:
  t = clock.getElapsedTime()

  position.x = baseX + sin(t × speed + offset) × range
  position.z = baseZ + cos(t × speed × 0.7 + offset) × range
  position.y = baseY + sin(t × 1.5 + offset) × 0.3

  rotation.y += 0.005  (cumulative rotation)

Result:
  ✓ Each lantern drifts in unique pattern
  ✓ Drifting is predictable but looks natural
  ✓ Vertical bobbing adds realism
  ✓ Rotation creates spinning effect
```

## 🎥 Camera Movement Math

```
Per frame:

t = clock.getElapsedTime()

position.x = (previous value) + sin(t × 0.3) × 0.01
position.y = 3 + sin(t × 0.4) × 0.5
position.z = (previous value) - 0.02

lookAt(position.x, 0, position.z - 10)

Result:
  ✓ Continuous forward movement (depth)
  ✓ Gentle side-to-side drift (meditative sway)
  ✓ Vertical bobbing (floating sensation)
  ✓ Always looking toward the water
```

## 📊 Performance Optimization

```
Techniques Applied:

1. Memoization
   useMemo(() => {
     // Geometry created once, reused
     const geo = new THREE.PlaneGeometry(80, 80, 64, 64)
     initialPositions.current = geo.attributes.position.array.slice()
     return geo
   }, [])

2. Efficient Position Updates
   ✓ No geometry cloning
   ✓ Direct array modification: positions[i] = newValue
   ✓ Update flags: geometry.attributes.position.needsUpdate = true

3. Clock References
   ✓ clock.getElapsedTime() calculated once per frame
   ✓ Shared across all components
   ✓ No setTimeout/setInterval loops

4. Fog Culling
   <fog args={["#0d1f4d", 10, 100]} />
   ✓ Objects beyond 100 units don't render
   ✓ Automatically improves performance with distance

5. Shadow Optimization
   shadow-mapSize-width={2048}
   shadow-mapSize-height={2048}
   ✓ High quality but reasonable size
```

## 🎯 Key Design Decisions

| Decision | Why |
|----------|-----|
| **3 Wave Layers** | Creates complexity without calculations |
| **Random Drift Parameters** | Each lantern feels unique |
| **Dual PointLights** | Realistic glow + soft ambiance |
| **Fog Effect** | Atmospheric depth, performance benefit |
| **Group Component** | Clean hierarchy, easy transforms |
| **Clock-based Animation** | Independent of frame rate |
| **State Array** | Simple React pattern, easy to extend |

---

**This architecture is designed for clarity, performance, and extensibility.** 🏮✨
