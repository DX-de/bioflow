"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import type { Mesh } from "three";

type OrbProps = {
  color: string;
  position: [number, number, number];
  scale: number;
  speed?: number;
  distort?: number;
};

function FloatingOrb({
  color,
  position,
  scale,
  speed = 1,
  distort = 0.45,
}: OrbProps) {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    meshRef.current.rotation.x = t * 0.12 * speed;
    meshRef.current.rotation.y = t * 0.18 * speed;
  });

  return (
    <Float speed={1.8} rotationIntensity={0.35} floatIntensity={1.2}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <icosahedronGeometry args={[1, 5]} />
        <MeshDistortMaterial
          color={color}
          distort={distort}
          speed={2.5}
          roughness={0.2}
          metalness={0.75}
          transparent
          opacity={0.55}
        />
      </mesh>
    </Float>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.85} />
      <pointLight position={[8, 6, 8]} intensity={1.2} color="#2563eb" />
      <pointLight position={[-8, -4, 6]} intensity={0.8} color="#0ea5e9" />
      <pointLight position={[0, -8, 4]} intensity={0.5} color="#60a5fa" />

      <FloatingOrb
        color="#2563eb"
        position={[-3.2, 1.4, -2.5]}
        scale={2}
        speed={0.9}
      />
      <FloatingOrb
        color="#3b82f6"
        position={[3.5, -0.6, -3.5]}
        scale={1.5}
        speed={-0.7}
        distort={0.55}
      />
      <FloatingOrb
        color="#0ea5e9"
        position={[0.8, -2.2, -1.5]}
        scale={1.2}
        speed={1.1}
      />
      <FloatingOrb
        color="#60a5fa"
        position={[-1.2, -1.8, -4.5]}
        scale={2.4}
        speed={0.5}
        distort={0.35}
      />
      <FloatingOrb
        color="#1d4ed8"
        position={[2, 2.5, -5]}
        scale={0.9}
        speed={1.3}
      />
    </>
  );
}

export default function Scene3DCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 42 }}
      dpr={[1, 1.75]}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      }}
      style={{ background: "transparent" }}
    >
      <Scene />
    </Canvas>
  );
}
