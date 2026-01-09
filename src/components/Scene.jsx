import React from 'react';
import WaterPlane from './WaterPlane';
import Lantern from './Lantern';

export default function Scene({ lanterns }) {
  return (
    <>
      {/* Lighting setup */}
      <ambientLight intensity={0.6} color="#ffee99" />
      <directionalLight
        position={[15, 20, 12]}
        intensity={0.9}
        color="#ffddbb"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <directionalLight
        position={[-15, 8, -15]}
        intensity={0.4}
        color="#5588ff"
      />

      {/* Environment */}
      <WaterPlane />

      {/* Lanterns */}
      {lanterns.map((position, idx) => (
        <Lantern key={idx} position={position} />
      ))}
    </>
  );
}
