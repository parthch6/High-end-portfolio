'use client';

import React, { useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Vertex shader for particles
const vertexShader = `
  attribute float aScale;
  attribute vec3 aColor;
  varying vec3 vColor;
  varying float vScale;

  void main() {
    vColor = aColor;
    vScale = aScale;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aScale * (100.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

// Fragment shader for particles with clean glow
const fragmentShader = `
  varying vec3 vColor;
  varying float vScale;

  void main() {
    vec2 centVec = gl_PointCoord - vec2(0.5, 0.5);
    float dist = length(centVec);
    
    if (dist > 0.5) discard;
    
    // Smooth quadratic falloff for clean particles
    float fade = 1.0 - dist * dist * 4.0;
    float alpha = fade * 0.65;
    
    vec3 finalColor = vColor;
    
    // Subtle, clean glow only at the core
    if (dist < 0.2) {
      finalColor = mix(finalColor, vec3(1.0), dist * 0.3);
    }
    
    gl_FragColor = vec4(finalColor, alpha);
  }
`;

// Generate central sphere
const generateCentralSphere = (radius: number, numParticles: number) => {
  const particles: THREE.Vector3[] = [];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < numParticles; i++) {
    const y = 1 - (i / (numParticles - 1)) * 2;
    const radiusAtY = Math.sqrt(1 - y * y);
    const theta = goldenAngle * i;
    
    const x = Math.cos(theta) * radiusAtY;
    const z = Math.sin(theta) * radiusAtY;

    particles.push(new THREE.Vector3(x * radius, y * radius, z * radius));
  }

  return particles;
};

// Generate orbital rings
const generateOrbitalRings = (radius: number, segments: number, yOffsets: number[]) => {
  const particles: THREE.Vector3[] = [];

  yOffsets.forEach((yOffset) => {
    for (let i = 0; i < segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = yOffset;

      particles.push(new THREE.Vector3(x, y, z));
    }
  });

  return particles;
};

// Generate orbital nodes (small spheres on orbits)
const generateOrbitalNodes = (radius: number, count: number, yOffset: number) => {
  const particles: THREE.Vector3[] = [];
  const angleStep = (Math.PI * 2) / count;

  for (let i = 0; i < count; i++) {
    const angle = angleStep * i;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const y = yOffset;

    // Create small nodes
    for (let j = 0; j < 12; j++) {
      const nodeAngle = (j / 12) * Math.PI * 2;
      const nodeX = x + Math.cos(nodeAngle) * 0.15;
      const nodeZ = z + Math.sin(nodeAngle) * 0.15;
      particles.push(new THREE.Vector3(nodeX, y, nodeZ));
    }
  }

  return particles;
};

interface Hero3DLogoProps {
  size?: number;
  colorScheme?: 'purple' | 'neon' | 'gradient';
}

const Hero3DLogoContent = ({ size = 3, colorScheme = 'purple' }: Hero3DLogoProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  // Generate particles - central sphere + orbital rings + nodes
  const { particles, particleTypes } = useMemo(() => {
    const centralSphere = generateCentralSphere(0.8, 200);
    const orbitalRings = generateOrbitalRings(1.6, 120, [-0.3, 0, 0.3]);
    const orbitalNodes = generateOrbitalNodes(1.6, 3, 0);

    return {
      particles: [...centralSphere, ...orbitalRings, ...orbitalNodes],
      particleTypes: {
        centralEnd: centralSphere.length,
        orbitalEnd: centralSphere.length + orbitalRings.length,
      },
    };
  }, []);

  // Create typed arrays
  const positions = new Float32Array(particles.length * 3);
  const colors = new Float32Array(particles.length * 3);
  const scales = new Float32Array(particles.length);

  // Set particle data with type-specific colors
  particles.forEach((p, i) => {
    positions[i * 3] = p.x;
    positions[i * 3 + 1] = p.y;
    positions[i * 3 + 2] = p.z;

    let r = 1, g = 1, b = 1;

    // Central sphere - blue to purple gradient
    if (i < particleTypes.centralEnd) {
      if (colorScheme === 'purple') {
        r = 0.5 + Math.sin(i * 0.02) * 0.3;
        g = 0.3 + Math.cos(i * 0.025) * 0.2;
        b = 1;
      } else if (colorScheme === 'neon') {
        r = 0.2;
        g = 0.8;
        b = 1;
      } else {
        r = 0.4 + Math.sin(i * 0.01) * 0.2;
        g = 0.6 + Math.cos(i * 0.015) * 0.2;
        b = 1;
      }
    }
    // Orbital rings - pink to purple
    else {
      if (colorScheme === 'purple') {
        r = 0.9 + Math.sin(i * 0.05) * 0.1;
        g = 0.3 + Math.cos(i * 0.08) * 0.3;
        b = 0.9 + Math.sin(i * 0.04) * 0.1;
      } else if (colorScheme === 'neon') {
        r = 1;
        g = 0.2;
        b = 0.8;
      } else {
        r = 0.8 + Math.sin(i * 0.03) * 0.2;
        g = 0.4 + Math.cos(i * 0.04) * 0.2;
        b = 0.8 + Math.sin(i * 0.05) * 0.2;
      }
    }

    colors[i * 3] = r;
    colors[i * 3 + 1] = g;
    colors[i * 3 + 2] = b;

    // Smaller nodes on orbits
    if (i >= particleTypes.orbitalEnd) {
      scales[i] = Math.random() * 0.5 + 0.2;
    } else {
      scales[i] = Math.random() * 0.8 + 0.4;
    }
  });

  // Animation loop
  useFrame(({ clock }) => {
    if (!groupRef.current || !pointsRef.current) return;

    const time = clock.getElapsedTime();

    // Gentle rotation - atomic/orbital motion
    groupRef.current.rotation.x = Math.sin(time * 0.1) * 0.2;
    groupRef.current.rotation.y = time * 0.3;
    groupRef.current.rotation.z = Math.sin(time * 0.12) * 0.1;

    // Subtle scale pulse
    const scale = 1 + Math.sin(time * 0.25) * 0.03;
    groupRef.current.scale.set(scale, scale, scale);

    // Update particle positions with orbital motion
    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const posArray = posAttr.array as Float32Array;

    particles.forEach((p, i) => {
      const idx = i * 3;
      
      // Add floating effect based on particle type
      if (i < particleTypes.centralEnd) {
        // Central sphere - subtle drift
        posArray[idx] = p.x + Math.sin(time * 0.2 + i * 0.01) * 0.04;
        posArray[idx + 1] = p.y + Math.cos(time * 0.18 + i * 0.015) * 0.04;
        posArray[idx + 2] = p.z + Math.sin(time * 0.22 + i * 0.012) * 0.03;
      } else if (i < particleTypes.orbitalEnd) {
        // Orbital rings - orbital motion
        posArray[idx] = p.x + Math.sin(time * 0.15 + i * 0.005) * 0.05;
        posArray[idx + 1] = p.y;
        posArray[idx + 2] = p.z + Math.cos(time * 0.15 + i * 0.005) * 0.05;
      } else {
        // Nodes - slight pulsing
        posArray[idx] = p.x + Math.sin(time * 0.3 + i) * 0.02;
        posArray[idx + 1] = p.y + Math.cos(time * 0.25 + i) * 0.02;
        posArray[idx + 2] = p.z + Math.sin(time * 0.28 + i) * 0.02;
      }
    });

    posAttr.needsUpdate = true;
  });

  return (
    <group ref={groupRef}>
      {/* Particles */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particles.length}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-aScale"
            count={particles.length}
            array={scales}
            itemSize={1}
          />
          <bufferAttribute
            attach="attributes-aColor"
            count={particles.length}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <shaderMaterial
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          transparent
          uniforms={{}}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
        />
      </points>
    </group>
  );
};

export const Hero3DLogo = ({ size = 3, colorScheme = 'purple' }: Hero3DLogoProps) => {
  return (
    <div className="w-full h-full bg-transparent">
      <Canvas
        camera={{
          position: [0, 0, 4],
          fov: 75,
        }}
        className="w-full h-full"
        dpr={[1, 1.5]}
        performance={{ current: 1, min: 0.5, max: 1 }}
      >
        <Hero3DLogoContent size={size} colorScheme={colorScheme} />
      </Canvas>
    </div>
  );
};

export default Hero3DLogo;
