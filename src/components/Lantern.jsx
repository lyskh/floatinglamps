import React, { useRef, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import * as THREE from "three";

export default function Lantern({ position, onSpawn }) {
  const groupRef = useRef();
  const scaleRef = useRef(new THREE.Vector3(0, 0, 0));
  const [spawned, setSpawned] = useState(false);
  
  // Unique animation parameters for each lantern
  const timeOffset = useMemo(() => Math.random() * Math.PI * 2, []);
  const driftSpeed = useMemo(() => 0.3 + Math.random() * 0.4, []);
  const driftRangeX = useMemo(() => 2 + Math.random() * 3, []);
  const driftRangeZ = useMemo(() => 2 + Math.random() * 3, []);
  const bobAmount = useMemo(() => 0.2 + Math.random() * 0.3, []);
  const bobSpeed = useMemo(() => 0.8 + Math.random() * 0.6, []);
  const sizeVariation = useMemo(() => 0.85 + Math.random() * 0.3, []); // Vary lantern sizes
  const flickerSpeed = useMemo(() => 2 + Math.random() * 1.5, []); // Gentle flicker
  const windOffset = useMemo(() => Math.random() * Math.PI * 2, []); // Wind phase offset
  
  // Color variation for lanterns
  const hue = useMemo(() => Math.random() * 0.1 - 0.05, []); // Soft yellow/peach variance
  const mainColor = useMemo(() => {
    const colors = ["#ffd27f", "#ffe8b3", "#fff4cc", "#ffc069", "#ffb347"];
    return colors[Math.floor(Math.random() * colors.length)];
  }, []);

  // Spawn animation - scale up from 0 to 1
  useFrame((state) => {
    if (groupRef.current && scaleRef.current) {
      const elapsed = state.clock.getElapsedTime();
      
      // Spawn animation (first 0.5s)
      if (!spawned && elapsed < 0.5) {
        const spawnProgress = elapsed / 0.5;
        const scaledSize = spawnProgress * sizeVariation;
        scaleRef.current.set(scaledSize, scaledSize, scaledSize);
        groupRef.current.scale.copy(scaleRef.current);
        
        if (spawnProgress >= 0.99) {
          setSpawned(true);
          if (onSpawn) onSpawn();
        }
      } else if (spawned) {
        // Gentle breathing/flicker effect
        const flicker = 1 + Math.sin(elapsed * flickerSpeed) * 0.03;
        const finalScale = sizeVariation * flicker;
        scaleRef.current.set(finalScale, finalScale, finalScale);
        groupRef.current.scale.copy(scaleRef.current);
      }
      
      // Floating motion with wind influence
      const time = elapsed * driftSpeed + timeOffset;
      const windSway = Math.sin(elapsed * 0.4 + windOffset) * 0.3;
      groupRef.current.position.x = position[0] + Math.sin(time) * driftRangeX + windSway;
      groupRef.current.position.z = position[2] + Math.cos(time * 0.7) * driftRangeZ;
      groupRef.current.position.y = position[1] + Math.sin(time * bobSpeed) * bobAmount;
      
      // Gentle rotation with wind tilt
      groupRef.current.rotation.y += 0.003;
      groupRef.current.rotation.z = Math.sin(time * 0.5) * 0.1 + windSway * 0.2;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Ethereal stacked spheres - Sky-like design */}
      
      {/* Lower sphere - largest */}
      <mesh castShadow>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial 
          color={mainColor}
          emissive={mainColor}
          emissiveIntensity={0.6}
          metalness={0.3}
          roughness={0.4}
          transparent={true}
          opacity={0.85}
        />
      </mesh>

      {/* Middle sphere - medium */}
      <mesh castShadow position={[0, 0.3, 0]}>
        <sphereGeometry args={[0.28, 32, 32]} />
        <meshStandardMaterial 
          color={mainColor}
          emissive={mainColor}
          emissiveIntensity={0.7}
          metalness={0.2}
          roughness={0.3}
          transparent={true}
          opacity={0.8}
        />
      </mesh>

      {/* Upper sphere - smallest */}
      <mesh castShadow position={[0, 0.55, 0]}>
        <sphereGeometry args={[0.22, 32, 32]} />
        <meshStandardMaterial 
          color={mainColor}
          emissive={mainColor}
          emissiveIntensity={0.8}
          metalness={0.1}
          roughness={0.2}
          transparent={true}
          opacity={0.9}
        />
      </mesh>

      {/* Central glow core */}
      <mesh position={[0, 0.25, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshBasicMaterial 
          color="#fffacd"
          toneMapped={false}
          transparent={true}
          opacity={0.8}
        />
      </mesh>

      {/* Primary point light - warm glow */}
      <pointLight 
        position={[0, 0.25, 0]}
        intensity={2.5}
        distance={25}
        decay={2}
        color={mainColor}
      />

      {/* Secondary light - softer, wider glow */}
      <pointLight 
        position={[0, 0.25, 0]}
        intensity={1.2}
        distance={50}
        decay={2}
        color="#ffeb99"
      />

      {/* Particle sparkles around lantern */}
      <Sparkles 
        count={8}
        scale={0.8}
        size={1}
        speed={0.4}
        color={mainColor}
      />
    </group>
  );
}
