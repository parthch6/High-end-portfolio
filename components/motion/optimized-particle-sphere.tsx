'use client';

import React, { useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Optimized particle vertex shader
const particleVertexShader = `
  attribute float aScale;
  varying vec3 vPosition;
  varying float vDistance;

  void main() {
    vPosition = position;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vDistance = length(mvPosition.xyz);
    gl_PointSize = aScale * (150.0 / length(mvPosition.xyz));
    gl_Position = projectionMatrix * mvPosition;
  }
`;

// Optimized particle fragment shader with glow effect
const particleFragmentShader = `
  varying vec3 vPosition;
  varying float vDistance;
  uniform sampler2D textre;

  void main() {
    vec2 centVec = gl_PointCoord - vec2(0.5, 0.5);
    float dist = length(centVec);
    
    if (dist > 0.5) discard;
    
    float alpha = (1.0 - dist * 2.0) * 0.8;
    gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
    gl_FragColor.rgb += vec3(0.5, 0.7, 1.0) * alpha * 0.3;
  }
`;

interface OptimizedParticleSphereProps {
  particleCount?: number;
  sphereRadius?: number;
  connectionDistance?: number;
}

const OptimizedParticleGroup = ({
  particleCount = 1200,
  sphereRadius = 3,
  connectionDistance = 1.5,
}: OptimizedParticleSphereProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef({ x: 0, y: 0 });
  const particlePositionsRef = useRef<Float32Array>(new Float32Array());

  const { size } = useThree();

  // Generate particle positions once
  const particlePositions = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i * 3] = sphereRadius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = sphereRadius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = sphereRadius * Math.cos(phi);
    }

    particlePositionsRef.current = positions;
    return positions;
  }, [particleCount, sphereRadius]);

  // Generate line connections with culling
  const linePositions = useMemo(() => {
    const linePos: number[] = [];

    for (let i = 0; i < particleCount; i++) {
      // Only check nearby particles to reduce computation
      for (let j = i + 1; j < Math.min(i + 50, particleCount); j++) {
        const dx = particlePositions[i * 3] - particlePositions[j * 3];
        const dy =
          particlePositions[i * 3 + 1] - particlePositions[j * 3 + 1];
        const dz =
          particlePositions[i * 3 + 2] - particlePositions[j * 3 + 2];
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (distance < connectionDistance) {
          linePos.push(
            particlePositions[i * 3],
            particlePositions[i * 3 + 1],
            particlePositions[i * 3 + 2],
            particlePositions[j * 3],
            particlePositions[j * 3 + 1],
            particlePositions[j * 3 + 2]
          );
        }
      }
    }

    return new Float32Array(linePos);
  }, [particlePositions, particleCount, connectionDistance]);

  // Scale attributes for particles
  const scales = useMemo(() => {
    const scaleArray = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      scaleArray[i] = Math.random() * 0.8 + 0.4;
    }
    return scaleArray;
  }, [particleCount]);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current.x = (event.clientX / size.width) * 2 - 1;
      mouseRef.current.y = -(event.clientY / size.height) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [size]);

  useFrame(({ clock }) => {
    if (!groupRef.current || !pointsRef.current) return;

    const time = clock.getElapsedTime() * 0.3;

    // Smooth mouse-based rotation with easing
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
    groupRef.current.position.y = Math.sin(time * 0.15) * 0.15;

    // Update particle positions with floating animation
    const positionAttribute = pointsRef.current.geometry.attributes
      .position as THREE.BufferAttribute;
    const positions = positionAttribute.array as Float32Array;

    for (let i = 0; i < particleCount; i++) {
      const baseX = particlePositionsRef.current[i * 3];
      const baseY = particlePositionsRef.current[i * 3 + 1];
      const baseZ = particlePositionsRef.current[i * 3 + 2];

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

    // Update line positions (throttled update)
    if (linesRef.current && Math.random() > 0.7) {
      const linePositionAttribute = linesRef.current.geometry.attributes
        .position as THREE.BufferAttribute;
      const linePositions = linePositionAttribute.array as Float32Array;

      let lineIdx = 0;
      for (let i = 0; i < particleCount && lineIdx < linePositions.length; i++) {
        for (
          let j = i + 1;
          j < Math.min(i + 50, particleCount) && lineIdx < linePositions.length;
          j++
        ) {
          const dx = positions[i * 3] - positions[j * 3];
          const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
          const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (distance < connectionDistance) {
            linePositions[lineIdx++] = positions[i * 3];
            linePositions[lineIdx++] = positions[i * 3 + 1];
            linePositions[lineIdx++] = positions[i * 3 + 2];
            linePositions[lineIdx++] = positions[j * 3];
            linePositions[lineIdx++] = positions[j * 3 + 1];
            linePositions[lineIdx++] = positions[j * 3 + 2];
          }
        }
      }

      linePositionAttribute.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Shader-based particles for better performance */}
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
        <shaderMaterial
          blending={THREE.AdditiveBlending}
          depthTest={true}
          depthWrite={false}
          transparent={true}
          uniforms={{
            textre: { value: null },
          }}
          vertexShader={particleVertexShader}
          fragmentShader={particleFragmentShader}
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
          color="#88ccff"
          transparent
          opacity={0.15}
          fog={false}
          linewidth={0.5}
        />
      </lineSegments>
    </group>
  );
};

const OptimizedParticleScene = () => {
  return (
    <Canvas
      camera={{
        position: [0, 0, 8],
        fov: 75,
      }}
      className="w-full h-full"
      style={{
        background: 'linear-gradient(135deg, #0a0a0f 0%, #1a0a2e 50%, #0a1a2e 100%)',
      }}
      dpr={[1, 1.5]}
      performance={{ current: 1, min: 0.5, max: 1 }}
    >
      <OptimizedParticleGroup
        particleCount={1200}
        sphereRadius={3}
        connectionDistance={1.5}
      />
    </Canvas>
  );
};

export const OptimizedParticleSphere = () => {
  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      <OptimizedParticleScene />
    </div>
  );
};

export default OptimizedParticleSphere;
