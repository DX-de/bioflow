"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Stars } from "@react-three/drei";
import type { Group, Mesh } from "three";

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
          roughness={0.15}
          metalness={0.85}
          transparent
          opacity={0.5}
        />
      </mesh>
    </Float>
  );
}

function ParticleField() {
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.02;
  });

  return (
    <group ref={groupRef}>
      <Stars
        radius={80}
        depth={50}
        count={1200}
        factor={3}
        saturation={0.2}
        fade
        speed={0.4}
      />
    </group>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.35} />
      <pointLight position={[8, 6, 8]} intensity={1.8} color="#8b5cf6" />
      <pointLight position={[-8, -4, 6]} intensity={1.2} color="#ec4899" />
      <pointLight position={[0, -8, 4]} intensity={0.6} color="#06b6d4" />

      <FloatingOrb
        color="#8b5cf6"
        position={[-3.2, 1.4, -2.5]}
        scale={2}
        speed={0.9}
      />
      <FloatingOrb
        color="#ec4899"
        position={[3.5, -0.6, -3.5]}
        scale={1.5}
        speed={-0.7}
        distort={0.55}
      />
      <FloatingOrb
        color="#06b6d4"
        position={[0.8, -2.2, -1.5]}
        scale={1.2}
        speed={1.1}
      />
      <FloatingOrb
        color="#a855f7"
        position={[-1.2, -1.8, -4.5]}
        scale={2.4}
        speed={0.5}
        distort={0.35}
      />
      <FloatingOrb
        color="#6366f1"
        position={[2, 2.5, -5]}
        scale={0.9}
        speed={1.3}
      />

      <ParticleField />
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
