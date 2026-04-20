'use client';

import React, { useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Vertex shader for particles
const vertexShader = `
  attribute float aScale;
  attribute vec3 aColor;
  attribute float aDotType;
  varying vec3 vColor;
  varying float vScale;
  varying float vDotType;

  void main() {
    vColor = aColor;
    vScale = aScale;
    vDotType = aDotType;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aScale * (100.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

// Fragment shader for particles with 2 sizes of dots
const fragmentShader = `
  varying vec3 vColor;
  varying float vScale;
  varying float vDotType;

  void main() {
    vec2 centVec = gl_PointCoord - vec2(0.5, 0.5);
    float dist = length(centVec);
    
    // Large dots (type 1): radius 0.5
    // Small dots (type 0): radius 0.3
    float dotRadius = vDotType > 0.5 ? 0.5 : 0.3;
    
    if (dist > dotRadius) discard;
    
    // Hard-edged dots with smooth anti-aliasing
    float alpha = 1.0;
    float edge = 0.02; // Anti-aliasing edge
    float distFromEdge = dotRadius - dist;
    
    if (distFromEdge < edge) {
      alpha = distFromEdge / edge;
    }
    
    // Slight brightness variation based on dot type
    vec3 finalColor = vColor;
    if (vDotType > 0.5) {
      // Large dots: slightly more saturated
      finalColor = mix(finalColor, vec3(1.0), 0.15);
    } else {
      // Small dots: slightly dimmer for depth
      finalColor *= 0.9;
    }
    
    gl_FragColor = vec4(finalColor, alpha);
  }
`;

// Generate cube geometry
const generateCubeParticles = (divisions: number, size: number) => {
  const particles: THREE.Vector3[] = [];
  const step = size / (divisions - 1);

  // Create grid on cube faces
  for (let face = 0; face < 6; face++) {
    for (let i = 0; i < divisions; i++) {
      for (let j = 0; j < divisions; j++) {
        const x = (i - divisions / 2) * step;
        const y = (j - divisions / 2) * step;
        const z = size / 2;

        let px = x, py = y, pz = z;

        switch (face) {
          case 0: px = z; pz = x; break; // Right
          case 1: px = -z; pz = -x; break; // Left
          case 2: py = z; pz = y; break; // Top
          case 3: py = -z; pz = -y; break; // Bottom
          case 4: break; // Front
          case 5: pz = -z; break; // Back
        }

        particles.push(new THREE.Vector3(px, py, pz));
      }
    }
  }

  return particles;
};

// Generate octahedron geometry
const generateOctahedronParticles = (radius: number, segments: number) => {
  const particles: THREE.Vector3[] = [];

  const phi = (1 + Math.sqrt(5)) / 2;

  // Octahedron vertices
  const vertices = [
    [-1, 1, -1], [1, 1, -1], [1, 1, 1], [-1, 1, 1],
    [-1, -1, -1], [1, -1, -1], [1, -1, 1], [-1, -1, 1],
  ].map(v => new THREE.Vector3(...v).normalize());

  // Sample points on octahedron surface
  for (let i = 0; i < segments; i++) {
    const n = segments;
    for (let j = 0; j < n; j++) {
      const u = i / n;
      const v = j / n;
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;

      const x = Math.sin(phi) * Math.cos(theta);
      const y = Math.cos(phi);
      const z = Math.sin(phi) * Math.sin(theta);

      particles.push(new THREE.Vector3(x, y, z).multiplyScalar(radius));
    }
  }

  return particles;
};

// Generate icosahedron-like geometry
const generateIcosahedronParticles = (radius: number, segments: number) => {
  const particles: THREE.Vector3[] = [];
  const phi = (1 + Math.sqrt(5)) / 2;

  for (let i = 0; i < segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    const radiusVar = radius * (0.8 + Math.sin(i) * 0.2);

    for (let j = 0; j < segments; j++) {
      const phi_angle = (j / segments) * Math.PI;
      const x = radiusVar * Math.sin(phi_angle) * Math.cos(theta);
      const y = radiusVar * Math.sin(phi_angle) * Math.sin(theta);
      const z = radiusVar * Math.cos(phi_angle);

      particles.push(new THREE.Vector3(x, y, z));
    }
  }

  return particles;
};

// Generate smooth sphere geometry using Fibonacci sphere algorithm for uniform distribution
const generateSmoothSphere = (radius: number, numParticles: number) => {
  const particles: THREE.Vector3[] = [];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5)); // Fibonacci angle

  for (let i = 0; i < numParticles; i++) {
    // Y is uniformly distributed between -1 and 1
    const y = 1 - (i / (numParticles - 1)) * 2;
    
    // Radius at this height
    const radiusAtY = Math.sqrt(1 - y * y);
    
    // Fibonacci spiral distribution
    const theta = goldenAngle * i;
    
    const x = Math.cos(theta) * radiusAtY;
    const z = Math.sin(theta) * radiusAtY;

    particles.push(new THREE.Vector3(x * radius, y * radius, z * radius));
  }

  return particles;
};

interface Hero3DVisualProps {
  type?: 'cube' | 'octahedron' | 'icosahedron' | 'smooth-sphere';
  colorScheme?: 'gradient' | 'neon' | 'soft' | 'purple';
}

const Hero3DContent = ({ type = 'cube', colorScheme = 'gradient' }: Hero3DVisualProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const smoothMouseRef = useRef({ x: 0, y: 0 });
  const isInsideRef = useRef(false);

  const { size } = useThree();

  // Generate particles based on type
  const particles = useMemo(() => {
    switch (type) {
      case 'octahedron':
        return generateOctahedronParticles(2.5, 12);
      case 'icosahedron':
        return generateIcosahedronParticles(2.5, 16);
      case 'smooth-sphere':
        return generateSmoothSphere(2.2, 800);
      case 'cube':
      default:
        return generateCubeParticles(8, 3);
    }
  }, [type]);

  // Create typed arrays
  const positions = new Float32Array(particles.length * 3);
  const colors = new Float32Array(particles.length * 3);
  const scales = new Float32Array(particles.length);
  const dotTypes = new Float32Array(particles.length);

  // Set particle data
  particles.forEach((p, i) => {
    positions[i * 3] = p.x;
    positions[i * 3 + 1] = p.y;
    positions[i * 3 + 2] = p.z;

    // Alternate between large (1) and small (0) dots for visual depth
    const isDotLarge = i % 3 === 0 ? 1 : 0;
    dotTypes[i] = isDotLarge;

    // Color based on scheme - with coordination for different dot sizes
    let r = 1, g = 1, b = 1;

    switch (colorScheme) {
      case 'neon':
        r = Math.sin(i * 0.1) * 0.5 + 0.5;
        g = Math.cos(i * 0.1) * 0.5 + 0.5;
        b = isDotLarge ? 1 : 0.7; // Slightly different for small dots
        break;
      case 'purple':
        r = isDotLarge ? 0.7 + Math.sin(i * 0.05) * 0.3 : 0.8 + Math.cos(i * 0.1) * 0.2;
        g = isDotLarge ? 0.4 : 0.6;
        b = 1;
        break;
      case 'soft':
        r = 0.8 + Math.sin(i * 0.08) * 0.2;
        g = 0.7 + Math.cos(i * 0.12) * 0.2;
        b = isDotLarge ? 0.9 : 0.85;
        break;
      case 'gradient':
        r = (p.x + 3) / 6;
        g = (p.y + 3) / 6;
        b = isDotLarge ? 0.8 : 0.85;
        break;
    }

    colors[i * 3] = r;
    colors[i * 3 + 1] = g;
    colors[i * 3 + 2] = b;

    // Particle sizes: larger dots get bigger sizes
    scales[i] = isDotLarge ? (Math.random() * 0.6 + 0.5) : (Math.random() * 0.4 + 0.25);
  });

  // Mouse tracking - only inside canvas
  useEffect(() => {
    const canvas = document.querySelector('[data-hero-3d-canvas]') as HTMLCanvasElement;
    if (!canvas) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Only track if inside canvas bounds
      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        isInsideRef.current = true;
        mouseRef.current.x = (x / rect.width) * 2 - 1;
        mouseRef.current.y = -(y / rect.height) * 2 + 1;
      }
    };

    const handleMouseLeave = () => {
      isInsideRef.current = false;
      mouseRef.current.x = 0;
      mouseRef.current.y = 0;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Animation loop
  useFrame(({ clock }) => {
    if (!groupRef.current || !pointsRef.current) return;

    const time = clock.getElapsedTime();

    // Smooth mouse interpolation with better easing
    const easing = 0.08; // Increased smoothness
    smoothMouseRef.current.x += (mouseRef.current.x - smoothMouseRef.current.x) * easing;
    smoothMouseRef.current.y += (mouseRef.current.y - smoothMouseRef.current.y) * easing;

    // Rotations: time-based + mouse-based with smoother curves
    // When cursor is inside, respond to mouse. Otherwise, gentle continuous rotation
    const timeRotationX = isInsideRef.current ? 0 : Math.sin(time * 0.15) * 0.3;
    const timeRotationY = isInsideRef.current ? 0 : time * 0.12; // Slightly slower for smoothness
    const timeRotationZ = isInsideRef.current ? 0 : Math.sin(time * 0.18) * 0.15;

    // Smooth mouse responsiveness with cubic easing
    const mouseInfluenceX = smoothMouseRef.current.y * 0.4;
    const mouseInfluenceY = smoothMouseRef.current.x * 0.6;

    groupRef.current.rotation.x = timeRotationX + mouseInfluenceX;
    groupRef.current.rotation.y = timeRotationY + mouseInfluenceY;
    groupRef.current.rotation.z = timeRotationZ;

    // Floating movement - smoother wave
    groupRef.current.position.y = Math.sin(time * 0.15) * 0.4;

    // Gentle scale pulse with smoother sine wave
    const scale = 1 + Math.sin(time * 0.3) * 0.06;
    groupRef.current.scale.set(scale, scale, scale);

    // Update particle positions with floating effect - more organic
    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const posArray = posAttr.array as Float32Array;

    for (let i = 0; i < particles.length; i++) {
      posArray[i * 3] = particles[i].x + Math.sin(time * 0.3 + i * 0.02) * 0.08;
      posArray[i * 3 + 1] = particles[i].y + Math.cos(time * 0.25 + i * 0.03) * 0.08;
      posArray[i * 3 + 2] = particles[i].z + Math.sin(time * 0.35 + i * 0.02) * 0.07;
    }

    posAttr.needsUpdate = true;
  });

  return (
    <group ref={groupRef}>
      {/* Particles */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
          <bufferAttribute
            attach="attributes-aScale"
            args={[scales, 1]}
          />
          <bufferAttribute
            attach="attributes-aColor"
            args={[colors, 3]}
          />
          <bufferAttribute
            attach="attributes-aDotType"
            args={[dotTypes, 1]}
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

export const Hero3DVisual = ({ type = 'cube', colorScheme = 'gradient' }: Hero3DVisualProps) => {
  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-950/50 via-slate-900/50 to-slate-950/50">
      <Canvas
        data-hero-3d-canvas
        camera={{
          position: [0, 0, 6],
          fov: 75,
        }}
        className="w-full h-full"
        dpr={[1, 1.5]}
        performance={{ current: 1, min: 0.5, max: 1 }}
      >
        <Hero3DContent type={type} colorScheme={colorScheme} />
      </Canvas>
    </div>
  );
};

export default Hero3DVisual;
