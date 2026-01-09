/**
 * Particle system component for subtle ambient particles
 * Creates floating dust/light particles for atmosphere
 */

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';

export default function ParticleSystem() {
  const pointsRef = useRef(null);
  const velocitiesRef = useRef(null);
  const particleCount = 100;

  useMemo(() => {
    const velocities = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      velocities[i] = (Math.random() - 0.5) * 0.01;
      velocities[i + 1] = Math.random() * 0.005;
      velocities[i + 2] = (Math.random() - 0.5) * 0.01;
    }
    velocitiesRef.current = velocities;
  }, [particleCount]);

  // Pre-generate particle positions
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      pos[i] = Math.random() * 40 - 20;
      pos[i + 1] = Math.random() * 15 + 3;
      pos[i + 2] = Math.random() * 30 - 15;
    }
    return pos;
  }, [particleCount]);

  useFrame(() => {
    if (!pointsRef.current || !velocitiesRef.current) return;

    const positions = pointsRef.current.geometry.attributes.position.array;
    const velocities = velocitiesRef.current;

    for (let i = 0; i < positions.length; i += 3) {
      positions[i] += velocities[i];
      positions[i + 1] += velocities[i + 1];
      positions[i + 2] += velocities[i + 2];

      // Wrap around boundaries
      if (positions[i] > 20) positions[i] = -20;
      if (positions[i] < -20) positions[i] = 20;
      if (positions[i + 1] > 18) positions[i + 1] = 3;
      if (positions[i + 2] > 15) positions[i + 2] = -15;
      if (positions[i + 2] < -15) positions[i + 2] = 15;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        color="#ffcc99"
        transparent
        opacity={0.3}
        sizeAttenuation={true}
      />
    </points>
  );
}
