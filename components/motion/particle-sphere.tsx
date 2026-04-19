'use client';

import React, { useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Particle data generation
const generateParticles = (count: number, radius: number) => {
  const positions = new Float32Array(count * 3);
  
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);
    const r = radius;

    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }

  return positions;
};

// Connection line generation
const generateConnections = (
  positions: Float32Array,
  particleCount: number,
  connectionDistance: number
) => {
  const linePositions: number[] = [];

  for (let i = 0; i < particleCount; i++) {
    for (let j = i + 1; j < particleCount; j++) {
      const dx = positions[i * 3] - positions[j * 3];
      const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
      const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
      const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

      if (distance < connectionDistance) {
        linePositions.push(
          positions[i * 3],
          positions[i * 3 + 1],
          positions[i * 3 + 2],
          positions[j * 3],
          positions[j * 3 + 1],
          positions[j * 3 + 2]
        );
      }
    }
  }

  return new Float32Array(linePositions);
};

interface ParticleGroupProps {
  particleCount?: number;
  sphereRadius?: number;
  connectionDistance?: number;
}

const ParticleGroup = ({
  particleCount = 1000,
  sphereRadius = 3,
  connectionDistance = 1.5,
}: ParticleGroupProps) => {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const groupRef = useRef<THREE.Group>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef({ x: 0, y: 0 });

  const { camera, size } = useThree();

  const particlePositions = generateParticles(particleCount, sphereRadius);
  const linePositions = generateConnections(
    particlePositions,
    particleCount,
    connectionDistance
  );

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current.x = (event.clientX / size.width) * 2 - 1;
      mouseRef.current.y = -(event.clientY / size.height) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [size]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;

    const time = clock.getElapsedTime();

    // Mouse-based rotation with easing
    targetRotationRef.current.y = mouseRef.current.x * 0.5;
    targetRotationRef.current.x = mouseRef.current.y * 0.3;

    groupRef.current.rotation.x +=
      (targetRotationRef.current.x - groupRef.current.rotation.x) * 0.05;
    groupRef.current.rotation.y +=
      (targetRotationRef.current.y - groupRef.current.rotation.y) * 0.05;

    // Subtle floating animation
    groupRef.current.rotation.z += 0.0001;
    groupRef.current.position.y = Math.sin(time * 0.2) * 0.2;

    // Animate particles with subtle floating effect
    if (pointsRef.current?.geometry.attributes.position) {
      const positions = pointsRef.current.geometry.attributes
        .position as THREE.BufferAttribute;
      const array = positions.array as Float32Array;

      for (let i = 0; i < array.length; i += 3) {
        const baseX = particlePositions[i];
        const baseY = particlePositions[i + 1];
        const baseZ = particlePositions[i + 2];

        array[i] =
          baseX + Math.sin(time * 0.3 + i) * 0.02 * Math.sin(time * 0.1);
        array[i + 1] =
          baseY + Math.cos(time * 0.25 + i) * 0.02 * Math.sin(time * 0.1);
        array[i + 2] =
          baseZ + Math.sin(time * 0.35 + i) * 0.02 * Math.sin(time * 0.1);
      }

      positions.needsUpdate = true;
    }

    // Update line positions based on particle movement
    if (linesRef.current?.geometry.attributes.position) {
      const positions = linesRef.current.geometry.attributes
        .position as THREE.BufferAttribute;
      const array = positions.array as Float32Array;

      if (pointsRef.current?.geometry.attributes.position) {
        const particlePositions = pointsRef.current.geometry.attributes
          .position as THREE.BufferAttribute;
        const particleArray = particlePositions.array as Float32Array;

        let lineIndex = 0;
        for (let i = 0; i < particleCount && lineIndex < array.length; i++) {
          for (
            let j = i + 1;
            j < particleCount && lineIndex < array.length;
            j++
          ) {
            const dx = particleArray[i * 3] - particleArray[j * 3];
            const dy = particleArray[i * 3 + 1] - particleArray[j * 3 + 1];
            const dz = particleArray[i * 3 + 2] - particleArray[j * 3 + 2];
            const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

            if (distance < connectionDistance) {
              array[lineIndex++] = particleArray[i * 3];
              array[lineIndex++] = particleArray[i * 3 + 1];
              array[lineIndex++] = particleArray[i * 3 + 2];
              array[lineIndex++] = particleArray[j * 3];
              array[lineIndex++] = particleArray[j * 3 + 1];
              array[lineIndex++] = particleArray[j * 3 + 2];
            }
          }
        }
      }

      positions.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Particles */}
      <Points ref={pointsRef} positions={particlePositions}>
        <PointMaterial
          transparent
          color="#ffffff"
          size={0.08}
          sizeAttenuation
          emissive="#ffffff"
          emissiveIntensity={0.5}
          fog={false}
        />
      </Points>

      {/* Connection lines */}
      <lineSegments ref={linesRef} dispose={null}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={linePositions.length / 3}
            array={linePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.2}
          fog={false}
          linewidth={1}
        />
      </lineSegments>
    </group>
  );
};

const ParticleScene = () => {
  return (
    <Canvas
      camera={{
        position: [0, 0, 8],
        fov: 75,
      }}
      className="w-full h-full"
      style={{
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
      }}
    >
      <ParticleGroup
        particleCount={1200}
        sphereRadius={3}
        connectionDistance={1.5}
      />
    </Canvas>
  );
};

export const ParticleSphere = () => {
  return (
    <div className="w-full h-screen bg-gradient-to-br from-black via-[#0a0a1a] to-[#1a0a2e] overflow-hidden">
      <ParticleScene />
    </div>
  );
};

export default ParticleSphere;
