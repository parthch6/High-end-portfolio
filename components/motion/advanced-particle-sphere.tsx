'use client';

import React, { useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import {
  generateSphericalParticles,
  generateToroidalParticles,
  generateCubicParticles,
  generateOptimizedConnections,
  generateScales,
  DEFAULT_COLORS,
} from '@/lib/particle-sphere-utils';

interface AdvancedParticleGroupProps {
  type?: 'sphere' | 'torus' | 'cube';
  particleCount?: number;
  size?: number;
  connectionDistance?: number;
  colorScheme?: keyof typeof DEFAULT_COLORS;
  animationSpeed?: number;
}

const AdvancedParticleGroup = ({
  type = 'sphere',
  particleCount = 1000,
  size = 3,
  connectionDistance = 1.5,
  colorScheme = 'default',
  animationSpeed = 1,
}: AdvancedParticleGroupProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef({ x: 0, y: 0 });

  const { size: canvasSize } = useThree();

  // Generate particles based on type
  const particlePositions = useMemo(() => {
    switch (type) {
      case 'torus':
        return generateToroidalParticles(particleCount, size, size * 0.3);
      case 'cube':
        return generateCubicParticles(particleCount, size);
      case 'sphere':
      default:
        return generateSphericalParticles(particleCount, size);
    }
  }, [type, particleCount, size]);

  // Generate optimized connections
  const linePositions = useMemo(
    () =>
      generateOptimizedConnections(
        particlePositions,
        particleCount,
        connectionDistance,
        Math.max(20, Math.floor(particleCount / 50))
      ),
    [particlePositions, particleCount, connectionDistance]
  );

  // Generate random scales
  const scales = useMemo(() => generateScales(particleCount), [particleCount]);

  // Get color config
  const colors = DEFAULT_COLORS[colorScheme];

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current.x = (event.clientX / canvasSize.width) * 2 - 1;
      mouseRef.current.y = -(event.clientY / canvasSize.height) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [canvasSize]);

  useFrame(({ clock }) => {
    if (!groupRef.current || !pointsRef.current) return;

    const time = clock.getElapsedTime() * animationSpeed * 0.3;

    // Mouse-based rotation
    targetRotationRef.current.y =
      mouseRef.current.x * 0.4 + Math.sin(time * 0.2) * 0.1;
    targetRotationRef.current.x =
      mouseRef.current.y * 0.2 + Math.cos(time * 0.25) * 0.05;

    groupRef.current.rotation.x +=
      (targetRotationRef.current.x - groupRef.current.rotation.x) * 0.08;
    groupRef.current.rotation.y +=
      (targetRotationRef.current.y - groupRef.current.rotation.y) * 0.08;
    groupRef.current.rotation.z = Math.sin(time * 0.1) * 0.15;

    // Gentle bobbing motion
    groupRef.current.position.y = Math.sin(time * 0.15) * 0.2;

    // Update particle positions
    const positionAttribute = pointsRef.current.geometry.attributes
      .position as THREE.BufferAttribute;
    const positions = positionAttribute.array as Float32Array;

    for (let i = 0; i < particleCount; i++) {
      const baseX = particlePositions[i * 3];
      const baseY = particlePositions[i * 3 + 1];
      const baseZ = particlePositions[i * 3 + 2];

      positions[i * 3] =
        baseX +
        Math.sin(time * 0.5 + i * 0.01) * 0.03 * Math.sin(time * 0.1);
      positions[i * 3 + 1] =
        baseY +
        Math.cos(time * 0.4 + i * 0.01) * 0.03 * Math.sin(time * 0.1);
      positions[i * 3 + 2] =
        baseZ +
        Math.sin(time * 0.45 + i * 0.01) * 0.03 * Math.sin(time * 0.1);
    }

    positionAttribute.needsUpdate = true;
  });

  return (
    <group ref={groupRef}>
      {/* Particles */}
      <points ref={pointsRef} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particlePositions, 3]}
          />
          <bufferAttribute
            attach="attributes-aScale"
            args={[scales, 1]}
          />
        </bufferGeometry>
        <pointsMaterial
          transparent
          color={colors.particleColor}
          size={0.08}
          sizeAttenuation
          fog={false}
        />
      </points>

      {/* Connection lines */}
      <lineSegments ref={linesRef} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color={colors.lineColor}
          transparent
          opacity={0.2}
          fog={false}
          linewidth={0.5}
        />
      </lineSegments>
    </group>
  );
};

interface AdvancedParticleSphereProps {
  type?: 'sphere' | 'torus' | 'cube';
  particleCount?: number;
  size?: number;
  connectionDistance?: number;
  colorScheme?: keyof typeof DEFAULT_COLORS;
  animationSpeed?: number;
  background?: string;
}

export const AdvancedParticleSphere = ({
  type = 'sphere',
  particleCount = 1000,
  size = 3,
  connectionDistance = 1.5,
  colorScheme = 'default',
  animationSpeed = 1,
  background,
}: AdvancedParticleSphereProps) => {
  const colors = DEFAULT_COLORS[colorScheme];
  const bgStyle = background || colors.backgroundColor;

  return (
    <div className="w-full h-full bg-black overflow-hidden rounded-lg">
      <Canvas
        camera={{
          position: [0, 0, 8],
          fov: 75,
        }}
        className="w-full h-full"
        style={{
          background: bgStyle,
        }}
        dpr={[1, 1.5]}
        performance={{ current: 1, min: 0.5, max: 1 }}
      >
        <AdvancedParticleGroup
          type={type}
          particleCount={particleCount}
          size={size}
          connectionDistance={connectionDistance}
          colorScheme={colorScheme}
          animationSpeed={animationSpeed}
        />
      </Canvas>
    </div>
  );
};

// Preset configurations for common use cases

export const ParticlePresets = {
  /**
   * Default sphere configuration
   */
  defaultSphere: () => (
    <AdvancedParticleSphere
      type="sphere"
      particleCount={1200}
      colorScheme="default"
    />
  ),

  /**
   * High-performance preset for slower devices
   */
  fastSphere: () => (
    <AdvancedParticleSphere
      type="sphere"
      particleCount={500}
      connectionDistance={2}
      animationSpeed={0.8}
      colorScheme="monochrome"
    />
  ),

  /**
   * Intense, dense particle network
   */
  denseSphere: () => (
    <AdvancedParticleSphere
      type="sphere"
      particleCount={2000}
      connectionDistance={1.2}
      colorScheme="cyberpunk"
    />
  ),

  /**
   * Ocean-themed toroidal (donut) structure
   */
  oceanTorus: () => (
    <AdvancedParticleSphere
      type="torus"
      particleCount={1500}
      size={4}
      colorScheme="ocean"
    />
  ),

  /**
   * Neon cube structure
   */
  neonCube: () => (
    <AdvancedParticleSphere
      type="cube"
      particleCount={1000}
      size={4}
      connectionDistance={1}
      colorScheme="neon"
    />
  ),

  /**
   * Sunset-themed, slow animation
   */
  sunsetSphere: () => (
    <AdvancedParticleSphere
      type="sphere"
      particleCount={800}
      animationSpeed={0.5}
      colorScheme="sunset"
    />
  ),

  /**
   * Minimal, professional sphere
   */
  minimalSphere: () => (
    <AdvancedParticleSphere
      type="sphere"
      particleCount={600}
      connectionDistance={1.2}
      colorScheme="monochrome"
      animationSpeed={0.7}
    />
  ),
};

export default AdvancedParticleSphere;
