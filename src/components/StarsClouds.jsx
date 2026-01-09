import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Stars, Cloud } from "@react-three/drei";

/**
 * StarsClouds Component
 * 
 * Creates a magical starfield and drifting clouds around the scene.
 * - Stars: Soft, fadeable starfield using @react-three/drei/Stars
 * - Clouds: Semi-transparent billboards drifting slowly across the sky
 * 
 * Features:
 * - Stars fade in/out gently with sine wave
 * - Multiple cloud layers at different depths for parallax effect
 * - Clouds drift side-to-side and forward with organic motion
 * - Bloom-compatible for ethereal glow
 */
export default function StarsClouds() {
  const cloudsGroupRef = useRef();
  const cloudRefs = useRef([]);

  // Precompute cloud params for consistent randomization per session
  const clouds = useMemo(() => {
    const positions = [
      // Mid-band (lantern-level background)
      [-10, 3, -15],
      [5, 3.4, -10],
      [0, 2.6, -5],
      [8, 3.2, 0],
      [-7, 3.6, 5],
      [12, 3.1, -8],
      [-14, 2.9, -4],
      [6, 3.5, 7],

      // Lower band (just above water, behind lanterns)
      [4, 1.8, -12],
      [-6, 1.6, -9],
      [10, 1.9, -6],
      [-11, 1.7, -3],

      // Higher band (sky depth)
      [0, 6.5, -18],
      [9, 7.0, -14],
      [-9, 6.8, -16],
      [3, 7.2, -20],
    ];

    return positions.map((pos, idx) => {
      return {
        pos,
        opacity: 0.15 + Math.random() * 0.1,
        width: 8 + Math.random() * 4,
        depth: 3 + Math.random() * 2,
        speedX: 0.05 + Math.random() * 0.03,
        speedZ: 0.04 + Math.random() * 0.03,
        drift: 0.6 + Math.random() * 0.4,
        key: idx,
      };
    });
  }, []);

  // Subtle background drift per cloud; keep clouds behind/above lanterns
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    clouds.forEach((cloud, i) => {
      const ref = cloudRefs.current[i];
      if (!ref) return;
      const base = cloud.pos;
      ref.position.x = base[0] + Math.sin(time * cloud.speedX) * cloud.drift;
      ref.position.z = base[2] + Math.cos(time * cloud.speedZ) * cloud.drift;
      ref.position.y = base[1];
    });
  });

  return (
    <group ref={cloudsGroupRef}>
      {/* Starfield - soft background stars that fade in/out */}
      <Stars
        radius={200}
        depth={50}
        count={1000}
        factor={4}
        saturation={0.5}
        fade
        speed={0.1}
      />

      {/* Scattered soft background clouds (behind/above lanterns) */}
      {clouds.map((cloud, idx) => (
        <Cloud
          key={cloud.key}
          ref={(el) => (cloudRefs.current[idx] = el)}
          position={cloud.pos}
          width={cloud.width}
          depth={cloud.depth}
          opacity={cloud.opacity}
          speed={0.001 + Math.random() * 0.002}
          segments={18}
        />
      ))}
    </group>
  );
}
