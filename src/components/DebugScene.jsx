import React from 'react';
import { useThree } from '@react-three/fiber';

export default function DebugScene() {
  const { camera, scene } = useThree();

  return (
    <group>
      {/* Simple debug cube in the center */}
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[2, 2, 2]} />
        <meshBasicMaterial color="#ffff00" wireframe />
      </mesh>

      {/* Text showing camera position */}
      <mesh position={[0, 5, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#ff0000" />
      </mesh>
    </group>
  );
}
