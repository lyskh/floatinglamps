import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function WaterPlane() {
  const meshRef = useRef();
  const initialPositions = useRef(null);
  const clock = useRef(new THREE.Clock());

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(100, 100, 128, 128);
    initialPositions.current = geo.attributes.position.array.slice();
    return geo;
  }, []);

  useFrame(() => {
    if (meshRef.current && initialPositions.current) {
      const time = clock.current.getElapsedTime();
      const positions = meshRef.current.geometry.attributes.position.array;
      const initial = initialPositions.current;
      
      for (let i = 0; i < positions.length; i += 3) {
        const x = initial[i];
        const z = initial[i + 2];
        
        // Multi-layered wave system for organic ripples
        const wave1 = 0.25 * Math.sin(x * 0.25 + time * 0.3) * Math.cos(z * 0.25 + time * 0.3);
        const wave2 = 0.15 * Math.sin(x * 0.4 + time * 0.5) * Math.cos(z * 0.4 + time * 0.4);
        const wave3 = 0.08 * Math.sin((x + z) * 0.3 + time * 0.35);
        
        positions[i + 1] = wave1 + wave2 + wave3;
      }
      
      meshRef.current.geometry.attributes.position.needsUpdate = true;
      meshRef.current.geometry.computeVertexNormals();
    }
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} ref={meshRef} receiveShadow>
      <primitive object={geometry} />
      <meshStandardMaterial 
        color="#0a1e4d" 
        roughness={0.6}
        metalness={0.2}
        envMapIntensity={0.5}
        emissive="#0a2040"
        emissiveIntensity={0.1}
        wireframe={false}
      />
    </mesh>
  );
}
