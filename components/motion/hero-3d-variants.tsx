'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = `
  attribute float aScale;
  attribute vec3 aColor;
  varying vec3 vColor;

  void main() {
    vColor = aColor;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aScale * (80.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = `
  varying vec3 vColor;

  void main() {
    vec2 centVec = gl_PointCoord - vec2(0.5, 0.5);
    float dist = length(centVec);
    
    if (dist > 0.5) discard;
    
    float alpha = (1.0 - dist * 2.0) * 0.85;
    gl_FragColor = vec4(vColor, alpha);
  }
`;

// Spiral/Helix geometry
export const generateSpiralParticles = (radius: number, height: number, segments: number) => {
  const particles: THREE.Vector3[] = [];

  for (let i = 0; i < segments; i++) {
    const theta = (i / segments) * Math.PI * 8;
    const y = (i / segments - 0.5) * height;
    const r = radius + Math.sin(theta * 0.5) * 0.3;

    const x = Math.cos(theta) * r;
    const z = Math.sin(theta) * r;

    particles.push(new THREE.Vector3(x, y, z));
  }

  return particles;
};

// Torus knot geometry
export const generateTorusKnotParticles = (segments: number) => {
  const particles: THREE.Vector3[] = [];
  const p = 3, q = 2;
  const scale = 2;

  for (let i = 0; i < segments; i++) {
    const t = (i / segments) * Math.PI * 2;
    const r = Math.cos(q * t) + 2;

    const x = r * Math.cos(p * t) * scale;
    const y = Math.sin(q * t) * scale;
    const z = r * Math.sin(p * t) * scale;

    particles.push(new THREE.Vector3(x, y, z));
  }

  return particles;
};

// Sphere with density variations
export const generateDenseSphereParticles = (radius: number, density: number) => {
  const particles: THREE.Vector3[] = [];

  for (let i = 0; i < density; i++) {
    const phi = Math.random() * Math.PI * 2;
    const theta = Math.acos(Math.random() * 2 - 1);
    const r = radius * (0.8 + Math.random() * 0.2);

    const x = r * Math.sin(theta) * Math.cos(phi);
    const y = r * Math.sin(theta) * Math.sin(phi);
    const z = r * Math.cos(theta);

    particles.push(new THREE.Vector3(x, y, z));
  }

  return particles;
};

// Menger sponge-like fractal
export const generateFractalParticles = (depth: number, scale: number) => {
  const particles: THREE.Vector3[] = [];

  const recursiveAdd = (pos: THREE.Vector3, size: number, currentDepth: number) => {
    if (currentDepth === 0) {
      particles.push(pos.clone());
      return;
    }

    const newSize = size / 3;
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          if (
            (x === 0 && y === 0 && z === 0) ||
            (x === 0 && y === 0) ||
            (x === 0 && z === 0) ||
            (y === 0 && z === 0)
          ) {
            continue;
          }

          const newPos = pos.clone().add(
            new THREE.Vector3(x, y, z).multiplyScalar(newSize)
          );
          recursiveAdd(newPos, newSize, currentDepth - 1);
        }
      }
    }
  };

  recursiveAdd(new THREE.Vector3(0, 0, 0), scale, depth);
  return particles;
};

interface Hero3DVariantProps {
  type?: 'spiral' | 'torus-knot' | 'sphere-dense' | 'fractal';
  colorScheme?: 'gradient' | 'neon' | 'soft' | 'purple' | 'rainbow';
}

const Hero3DVariantContent = ({ type = 'spiral', colorScheme = 'gradient' }: Hero3DVariantProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const smoothMouseRef = useRef({ x: 0, y: 0 });
  const isInsideRef = useRef(false);

  const { size } = useThree();

  const particles = useMemo(() => {
    switch (type) {
      case 'spiral':
        return generateSpiralParticles(1.5, 3, 400);
      case 'torus-knot':
        return generateTorusKnotParticles(600);
      case 'sphere-dense':
        return generateDenseSphereParticles(2, 600);
      case 'fractal':
        return generateFractalParticles(2, 2);
      default:
        return generateSpiralParticles(1.5, 3, 400);
    }
  }, [type]);

  const positions = new Float32Array(particles.length * 3);
  const colors = new Float32Array(particles.length * 3);
  const scales = new Float32Array(particles.length);

  particles.forEach((p, i) => {
    positions[i * 3] = p.x;
    positions[i * 3 + 1] = p.y;
    positions[i * 3 + 2] = p.z;

    let r = 1, g = 1, b = 1;

    switch (colorScheme) {
      case 'rainbow':
        const hue = (i / particles.length + type.length * 0.1) % 1;
        const sat = 0.8;
        const light = 0.5;
        const c = (1 - Math.abs(2 * light - 1)) * sat;
        const x = c * (1 - Math.abs(((hue * 6) % 2) - 1));
        const m = light - c / 2;

        if (hue < 1 / 6) {
          r = c + m; g = x + m; b = m;
        } else if (hue < 2 / 6) {
          r = x + m; g = c + m; b = m;
        } else if (hue < 3 / 6) {
          r = m; g = c + m; b = x + m;
        } else if (hue < 4 / 6) {
          r = m; g = x + m; b = c + m;
        } else if (hue < 5 / 6) {
          r = x + m; g = m; b = c + m;
        } else {
          r = c + m; g = m; b = x + m;
        }
        break;
      case 'neon':
        r = Math.sin(i * 0.05) * 0.5 + 0.7;
        g = Math.cos(i * 0.08) * 0.5 + 0.7;
        b = Math.sin(i * 0.03 + Math.PI) * 0.5 + 0.7;
        break;
      case 'purple':
        r = 0.8 + Math.sin(i * 0.02) * 0.2;
        g = 0.3 + Math.cos(i * 0.03) * 0.3;
        b = 1;
        break;
      case 'soft':
        r = 0.7 + Math.sin(i * 0.04) * 0.2;
        g = 0.6 + Math.cos(i * 0.05) * 0.3;
        b = 0.85;
        break;
      case 'gradient':
        r = Math.sin(i / particles.length * Math.PI) * 0.5 + 0.5;
        g = Math.cos(i / particles.length * Math.PI) * 0.5 + 0.5;
        b = 0.9;
        break;
    }

    colors[i * 3] = Math.max(0, Math.min(1, r));
    colors[i * 3 + 1] = Math.max(0, Math.min(1, g));
    colors[i * 3 + 2] = Math.max(0, Math.min(1, b));

    scales[i] = Math.random() * 1.4 + 0.5;
  });

  React.useEffect(() => {
    const canvas = document.querySelector('[data-hero-3d-variant-canvas]') as HTMLCanvasElement;
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

  useFrame(({ clock }) => {
    if (!groupRef.current || !pointsRef.current) return;

    const time = clock.getElapsedTime();

    // Smooth mouse interpolation (easing)
    const easing = 0.1;
    smoothMouseRef.current.x += (mouseRef.current.x - smoothMouseRef.current.x) * easing;
    smoothMouseRef.current.y += (mouseRef.current.y - smoothMouseRef.current.y) * easing;

    // When cursor is inside, stop time-based rotation (only mouse control)
    // When outside, continuous Earth-like rotation
    const timeRotationX = isInsideRef.current ? 0 : Math.sin(time * 0.2) * 0.3;
    const timeRotationY = isInsideRef.current ? 0 : time * 0.12; // Continuous rotation around Y-axis
    const timeRotationZ = isInsideRef.current ? 0 : Math.sin(time * 0.15) * 0.25;

    // Playful rotations with mouse influence
    groupRef.current.rotation.x =
      timeRotationX +
      smoothMouseRef.current.y * 0.2;
    groupRef.current.rotation.y = timeRotationY + smoothMouseRef.current.x * 0.3;
    groupRef.current.rotation.z = timeRotationZ;

    // Floating and floating movements
    groupRef.current.position.x = Math.sin(time * 0.15) * 0.15;
    groupRef.current.position.y = Math.cos(time * 0.2) * 0.2;
    groupRef.current.position.z = Math.sin(time * 0.12) * 0.1;

    // Scale pulse
    const scalePulse = 1 + Math.sin(time * 0.6) * 0.08;
    groupRef.current.scale.set(scalePulse, scalePulse, scalePulse);

    // Update particle positions
    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const posArray = posAttr.array as Float32Array;

    for (let i = 0; i < particles.length; i++) {
      posArray[i * 3] = particles[i].x + Math.sin(time * 0.3 + i * 0.01) * 0.03;
      posArray[i * 3 + 1] = particles[i].y + Math.cos(time * 0.4 + i * 0.02) * 0.03;
      posArray[i * 3 + 2] = particles[i].z + Math.sin(time * 0.35 + i * 0.015) * 0.02;
    }

    posAttr.needsUpdate = true;
  });

  return (
    <group ref={groupRef}>
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

export const Hero3DVariant = ({ type = 'spiral', colorScheme = 'gradient' }: Hero3DVariantProps) => {
  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-950/30 via-slate-900/30 to-slate-950/30">
      <Canvas
        data-hero-3d-variant-canvas
        camera={{
          position: [0, 0, 5.5],
          fov: 75,
        }}
        className="w-full h-full"
        dpr={[1, 1.5]}
        performance={{ current: 1, min: 0.5, max: 1 }}
      >
        <Hero3DVariantContent type={type} colorScheme={colorScheme} />
      </Canvas>
    </div>
  );
};

export default Hero3DVariant;
