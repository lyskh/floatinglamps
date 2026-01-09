import React, { useState, useRef, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { OrbitControls } from "@react-three/drei";
import { Fog } from "three";

import WaterPlane from "./components/WaterPlane";
import Lantern from "./components/Lantern";
import AmbientSound from "./components/AmbientSound";
import StarsClouds from "./components/StarsClouds";

// Camera controller for auto-follow and free drift modes
function CameraController({ targetLantern, autoFollow = true }) {
  const { camera } = useThree();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (autoFollow && targetLantern) {
      // Follow the newest lantern smoothly
      const targetPos = targetLantern;
      camera.position.x += (targetPos[0] - 5 - camera.position.x) * 0.02;
      camera.position.z += (targetPos[2] + 8 - camera.position.z) * 0.02;
    } else {
      // Gentle forward drift
      camera.position.z -= 0.01;
      camera.position.x += Math.sin(time * 0.2) * 0.005;
    }
    
    // Vertical bobbing
    camera.position.y = 4 + Math.sin(time * 0.3) * 0.3;
    
    // Look at center with slight offset toward lanterns
    const lookX = autoFollow && targetLantern ? targetLantern[0] - 3 : 0;
    const lookY = autoFollow && targetLantern ? 1 : 0.5;
    const lookZ = autoFollow && targetLantern ? targetLantern[2] - 5 : -10;
    
    camera.lookAt(lookX, lookY, lookZ);
  });

  return null;
}

export default function App() {
  const [lanterns, setLanterns] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [autoFollow, setAutoFollow] = useState(true);
  const [cameraMode, setCameraMode] = useState("auto"); // "auto", "free", or "orbit"
  const [spawnEnabled, setSpawnEnabled] = useState(true);
  const audioRef = useRef(null);
  const chimeRef = useRef(null);

  // Play spawn chime
  const playChime = () => {
    if (!soundEnabled || !chimeRef.current) return;
    
    try {
      chimeRef.current.currentTime = 0;
      chimeRef.current.play().catch(() => {
        // Autoplay might be blocked
      });
    } catch (err) {
      console.warn("Chime play error:", err);
    }
  };

  const handleClick = (e) => {
    // Don't spawn on UI elements
    if (e.target && e.target.tagName !== "CANVAS") return;
    if (!spawnEnabled) return; // User paused spawning
    
    // Limit lanterns for cozy, calm vibe
    if (lanterns.length >= 30) {
      console.log("✨ Sky full of wishes. Clear some lanterns to launch more.");
      return;
    }
    
    // Random position on water (clamped to keep in view)
    const randX = (Math.random() - 0.5) * 50;
    const randZ = (Math.random() - 0.5) * 50;
    const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
    const x = clamp(randX, -12, 12);
    const z = clamp(randZ, -12, 12);
    
    const newLantern = [x, 0.5, z];
    setLanterns([...lanterns, newLantern]);
    
    playChime();
  };

  const resetLanterns = () => {
    setLanterns([]);
  };

  const getNewestLantern = () => lanterns.length > 0 ? lanterns[lanterns.length - 1] : null;

  return (
    <>
      {/* Audio Elements */}
      <audio 
        ref={audioRef}
        style={{ display: "none" }}
      />
      <audio 
        ref={chimeRef}
        style={{ display: "none" }}
      >
        {/* Chime sound - will use Web Audio API if available */}
      </audio>

      {/* Ambient Sound Component */}
      <AmbientSound 
        url="/audio/ambient-water.flac" 
        enabled={soundEnabled}
      />

      {/* Main Canvas */}
      <Canvas
        onClick={handleClick}
        camera={{ position: [0, 4.5, 12], fov: 55, near: 0.1, far: 1000 }}
        style={{ height: "100vh", width: "100vw" }}
      >
        {/* Enhanced gradient fog for atmospheric depth */}
        <fog attach="fog" args={["#0a1e3f", 8, 90]} />

        {/* Lighting */}
        <ambientLight intensity={0.5} color="#c4a5ff" />
        <directionalLight 
          position={[15, 20, 10]} 
          intensity={0.8}
          color="#e8c4ff"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        
        {/* Moonlight with subtle flicker */}
        <pointLight 
          position={[0, 50, -30]} 
          intensity={0.6}
          color="#d4e4ff"
          distance={120}
        />
        
        {/* Cool fill light */}
        <pointLight 
          position={[-30, 15, -30]} 
          intensity={0.4}
          color="#7d9bff"
          distance={100}
        />

        {/* Environment */}
        <WaterPlane />

        {/* Stars and Clouds */}
        <StarsClouds />

        {/* Lanterns */}
        {lanterns.map((pos, idx) => (
          <Lantern 
            key={idx} 
            position={pos}
            onSpawn={() => {
              // Trigger any spawn effects
            }}
          />
        ))}

        {/* Camera System - auto-follow, free drift, or manual orbit */}
        {cameraMode !== "orbit" && (
          <CameraController 
            targetLantern={getNewestLantern()}
            autoFollow={autoFollow}
          />
        )}

        {/* Orbit Controls - only in orbit mode */}
        {cameraMode === "orbit" && (
          <OrbitControls 
            enableDamping={true}
            dampingFactor={0.06}
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={4}
            maxDistance={25}
            minPolarAngle={Math.PI / 8}
            maxPolarAngle={Math.PI / 2.2}
            target={[0, 1.2, 0]}
            screenSpacePanning={false}
            zoomSpeed={0.7}
            rotateSpeed={0.5}
            panSpeed={0.4}
            maxTargetRadius={10}
          />
        )}

        {/* Bloom Effect for ethereal glow */}
        <EffectComposer>
          <Bloom 
            intensity={1.5}
            luminanceThreshold={0.2}
            luminanceSmoothing={0.9}
          />
        </EffectComposer>
      </Canvas>

      {/* UI Overlay */}
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}>
        {/* Top Left - Info */}
        <div style={{
          position: "fixed",
          top: "20px",
          left: "20px",
          color: "#e8c4ff",
          fontFamily: "Arial, sans-serif",
          fontSize: "14px",
          textShadow: "0 0 10px rgba(0, 0, 0, 0.8)",
          pointerEvents: "none",
          zIndex: 10,
        }}>
          <p style={{ margin: "0 0 5px 0" }}>🏮 Light Drift</p>
          <p style={{ margin: "0", fontSize: "12px", opacity: 0.8 }}>
            {lanterns.length === 0 ? "Click to launch a lantern and make a wish" : "Click to place lanterns"}
          </p>
        </div>

        {/* Top Right - Controls */}
        <div style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          display: "flex",
          gap: "10px",
          pointerEvents: "auto",
          zIndex: 10,
        }}>
          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            style={{
              padding: "8px 12px",
              backgroundColor: soundEnabled ? "#6d4aff" : "#333",
              color: "#e8c4ff",
              border: "1px solid #6d4aff",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "12px",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = soundEnabled ? "#7d5aff" : "#444";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = soundEnabled ? "#6d4aff" : "#333";
            }}
          >
            {soundEnabled ? "🔊 Sound" : "🔇 Muted"}
          </button>

          {/* Spawn Toggle */}
          <button
            onClick={() => setSpawnEnabled(!spawnEnabled)}
            style={{
              padding: "8px 12px",
              backgroundColor: spawnEnabled ? "#6d4aff" : "#333",
              color: "#e8c4ff",
              border: "1px solid #6d4aff",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "12px",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = spawnEnabled ? "#7d5aff" : "#444";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = spawnEnabled ? "#6d4aff" : "#333";
            }}
          >
            {spawnEnabled ? "🟢 Spawn On" : "⏸️ Spawn Off"}
          </button>

          {/* Auto-follow Toggle */}
          <button
            onClick={() => setAutoFollow(!autoFollow)}
            disabled={cameraMode === "orbit"}
            style={{
              padding: "8px 12px",
              backgroundColor: autoFollow && cameraMode !== "orbit" ? "#6d4aff" : "#333",
              color: "#e8c4ff",
              border: "1px solid #6d4aff",
              borderRadius: "4px",
              cursor: cameraMode === "orbit" ? "not-allowed" : "pointer",
              fontSize: "12px",
              transition: "all 0.3s",
              opacity: cameraMode === "orbit" ? 0.5 : 1,
            }}
            onMouseEnter={(e) => {
              if (cameraMode !== "orbit") {
                e.target.style.backgroundColor = autoFollow ? "#7d5aff" : "#444";
              }
            }}
            onMouseLeave={(e) => {
              if (cameraMode !== "orbit") {
                e.target.style.backgroundColor = autoFollow ? "#6d4aff" : "#333";
              }
            }}
          >
            {autoFollow ? "📍 Follow" : "📍 Free"}
          </button>

          {/* Orbit Mode Toggle */}
          <button
            onClick={() => setCameraMode(cameraMode === "orbit" ? "auto" : "orbit")}
            style={{
              padding: "8px 12px",
              backgroundColor: cameraMode === "orbit" ? "#6d4aff" : "#333",
              color: "#e8c4ff",
              border: "1px solid #6d4aff",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "12px",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = cameraMode === "orbit" ? "#7d5aff" : "#444";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = cameraMode === "orbit" ? "#6d4aff" : "#333";
            }}
          >
            {cameraMode === "orbit" ? "🎮 Orbit" : "🎮 Manual"}
          </button>

          {/* Reset Button */}
          <button
            onClick={resetLanterns}
            style={{
              padding: "8px 12px",
              backgroundColor: "#d9534f",
              color: "#fff",
              border: "1px solid #c9302c",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "12px",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#c9302c";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#d9534f";
            }}
          >
            ✕ Clear
          </button>
        </div>

        {/* Bottom Left - Lantern Counter */}
        <div style={{
          position: "fixed",
          bottom: "20px",
          left: "20px",
          color: "#e8c4ff",
          fontFamily: "Arial, sans-serif",
          fontSize: "13px",
          textShadow: "0 0 10px rgba(0, 0, 0, 0.8)",
          pointerEvents: "none",
          zIndex: 10,
        }}>
          <p style={{ margin: "0" }}>
            ✨ {lanterns.length} / 30 Lantern{lanterns.length !== 1 ? 's' : ''}
            {lanterns.length === 1 && <span style={{ display: 'block', fontSize: '10px', marginTop: '3px', opacity: 0.7 }}>Your first wish floats skyward...</span>}
          </p>
        </div>

        {/* Bottom Right - Instructions */}
        <div style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          color: "#6d4aff",
          fontFamily: "Arial, sans-serif",
          fontSize: "11px",
          textShadow: "0 0 5px rgba(0, 0, 0, 0.5)",
          pointerEvents: "none",
          zIndex: 10,
          opacity: 0.7,
          textAlign: "right",
        }}>
          <p style={{ margin: "0" }}>Inspired by Sky: Children of the Light</p>
          <p style={{ margin: "5px 0 0 0" }}>A meditation on light and dreams</p>
        </div>
      </div>

      {/* Generate chime sound using Web Audio API */}
      <script>
        {`
          if (window.AudioContext || window.webkitAudioContext) {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            window.playChime = () => {
              const now = audioContext.currentTime;
              const osc = audioContext.createOscillator();
              const gain = audioContext.createGain();
              
              osc.connect(gain);
              gain.connect(audioContext.destination);
              
              osc.frequency.setValueAtTime(1000, now);
              osc.frequency.exponentialRampToValueAtTime(800, now + 0.3);
              
              gain.gain.setValueAtTime(0.3, now);
              gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
              
              osc.start(now);
              osc.stop(now + 0.3);
            };
          }
        `}
      </script>
    </>
  );
}
