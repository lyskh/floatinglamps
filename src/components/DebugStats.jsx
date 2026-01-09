/**
 * Debug Stats Component - Optional FPS and performance monitoring
 * Enable/disable by commenting out in Scene.jsx
 */

import React, { useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';

let frameCount = 0;
let lastTime = Date.now();
let fps = 0;

export default function DebugStats({ lanternCount }) {
  const [stats, setStats] = useState({ fps: 0, lanterns: 0 });

  useFrame(() => {
    frameCount++;
    const currentTime = Date.now();
    const deltaTime = currentTime - lastTime;

    if (deltaTime >= 1000) {
      fps = frameCount;
      frameCount = 0;
      lastTime = currentTime;
      setStats({ fps, lanterns: lanternCount });
    }
  });

  return (
    <div
      style={{
        position: 'fixed',
        top: '10px',
        left: '10px',
        background: 'rgba(0, 0, 0, 0.8)',
        color: '#0f0',
        fontFamily: 'monospace',
        padding: '10px',
        fontSize: '12px',
        borderRadius: '4px',
        zIndex: 1000,
        pointerEvents: 'none',
      }}
    >
      <div>FPS: {stats.fps}</div>
      <div>Lanterns: {stats.lanterns}</div>
      <div>Memory: {(performance.memory?.usedJSHeapSize / 1048576).toFixed(1)}MB</div>
    </div>
  );
}
