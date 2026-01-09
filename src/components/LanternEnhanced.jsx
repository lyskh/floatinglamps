/**
 * Enhanced Lantern Component with Advanced Effects
 * Features:
 * - Multiple material layers for bloom effect
 * - Particle-like glow animation
 * - Realistic flame flicker based on Perlin-like noise
 * - Smooth drift animation with sine/cosine waves
 * - Optimized for performance
 */

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';

export default function LanternEnhanced({ position, id, onRemove }) {
  const groupRef = useRef(null);
  const lightRef = useRef(null);
  const glowRef = useRef(null);
  
  const timeOffset = useMemo(() => Math.random() * Math.PI * 2, []);
  const driftOffset = useMemo(() => Math.random() * 2 - 1, []);
  
  // Pseudo-random flicker using sine combination
  const getFlicker = (time) => {
    return 0.8 + 
      Math.sin(time * 3) * 0.1 + 
      Math.sin(time * 7.3) * 0.05 + 
      Math.sin(time * 13.7) * 0.02;
  };

  useFrame(({ clock }) => {
    if (!groupRef.current || !lightRef.current) return;

    const time = clock.getElapsedTime();
    const waveTime = time * 0.5 + timeOffset;

    // Vertical bobbing
    groupRef.current.position.y = 0.5 + Math.sin(waveTime) * 0.35;

    // Horizontal drift pattern
    groupRef.current.position.x = position.x + 
      Math.sin(time * 0.3 + driftOffset) * 2.5 + 
      Math.sin(time * 0.15 + driftOffset) * 1;
      
    groupRef.current.position.z = position.z + 
      Math.cos(time * 0.25 + driftOffset) * 1.8 + 
      Math.cos(time * 0.12 + driftOffset) * 0.8;

    // Subtle rotation
    groupRef.current.rotation.y += 0.0015;
    groupRef.current.rotation.x = Math.sin(time * 0.2) * 0.1;

    // Flickering light
    const flicker = getFlicker(time);
    lightRef.current.intensity = flicker * 2.2;
    
    // Animate glow opacity
    if (glowRef.current && glowRef.current.material) {
      glowRef.current.material.opacity = 0.15 + Math.sin(time * 2) * 0.08;
    }
  });

  return (
    <group ref={groupRef} position={[position.x, 0.5, position.z]}>
      {/* Core lantern body */}
      <mesh>
        <sphereGeometry args={[0.38, 20, 20]} />
        <meshStandardMaterial
          color="#ffcc66"
          emissive="#ffaa22"
          emissiveIntensity={1.8}
          metalness={0.25}
          roughness={0.4}
        />
      </mesh>

      {/* Inner glow */}
      <mesh scale={0.82}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshBasicMaterial color="#ffdd99" transparent opacity={0.7} />
      </mesh>

      {/* Outer bloom layer */}
      <mesh ref={glowRef} scale={1.9}>
        <sphereGeometry args={[0.4, 12, 12]} />
        <meshBasicMaterial
          color="#ffaa22"
          transparent
          opacity={0.18}
          depthWrite={false}
        />
      </mesh>

      {/* Main point light */}
      <pointLight
        ref={lightRef}
        color="#ffcc66"
        intensity={1.8}
        distance={18}
        decay={2}
      />

      {/* Secondary warm light */}
      <pointLight
        color="#ffbb44"
        intensity={0.6}
        distance={10}
        decay={2.2}
      />
    </group>
  );
}
