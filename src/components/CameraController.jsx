import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';

export default function CameraController({ lanterns }) {
  const { camera } = useThree();
  const targetRef = useRef(new Vector3(0, 8, 15));

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    // Smooth forward drift (capped to avoid camera going too far)
    targetRef.current.z = Math.max(15 - time * 0.15, 5);

    // If lanterns exist, gently follow them
    if (lanterns.length > 0) {
      let centerX = 0;
      let centerZ = 0;
      lanterns.forEach((lantern) => {
        centerX += lantern.x;
        centerZ += lantern.z;
      });
      centerX /= lanterns.length;
      centerZ /= lanterns.length;

      targetRef.current.x = centerX * 0.15;
      targetRef.current.y = 8;
      targetRef.current.z = Math.max(centerZ + 15, 5);
    } else {
      targetRef.current.x = 0;
      targetRef.current.y = 8;
    }

    // Smooth camera movement
    camera.position.lerp(targetRef.current, 0.01);
    
    // Look at the center of the scene (slightly down from camera)
    camera.lookAt(targetRef.current.x, 3, targetRef.current.z - 10);
  });

  return null;
}
