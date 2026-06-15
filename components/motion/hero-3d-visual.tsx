'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = `
  attribute float aScale;
  attribute vec3 aColor;
  attribute float aSeed;
  attribute float aLayer;

  uniform float uTime;
  uniform float uPixelRatio;

  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec3 radial = normalize(position + vec3(0.0001));
    float pulse = sin(uTime * 0.7 + aSeed * 6.2831) * 0.035;
    float ripple = sin(uTime * 0.36 + position.y * 2.9 + aSeed * 3.1) * 0.026;
    vec3 animatedPosition = position + radial * (pulse + ripple * aLayer);

    vec4 mvPosition = modelViewMatrix * vec4(animatedPosition, 1.0);
    float perspective = 118.0 / -mvPosition.z;
    gl_PointSize = clamp(aScale * perspective * uPixelRatio, 2.0, 13.0);
    gl_Position = projectionMatrix * mvPosition;

    float depthFade = smoothstep(8.8, 3.2, -mvPosition.z);
    vAlpha = mix(0.28, 0.88, aLayer) * depthFade;
    vColor = aColor;
  }
`;

const fragmentShader = `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec2 center = gl_PointCoord - vec2(0.5);
    float dist = length(center);

    if (dist > 0.5) discard;

    float core = smoothstep(0.18, 0.0, dist);
    float halo = smoothstep(0.5, 0.16, dist) * 0.55;
    float alpha = (core + halo) * vAlpha;

    if (alpha < 0.01) discard;

    vec3 finalColor = vColor * (1.0 + core * 0.75);
    gl_FragColor = vec4(finalColor, alpha);
  }
`;

type Hero3DType = 'cube' | 'octahedron' | 'icosahedron' | 'smooth-sphere';
type Hero3DColorScheme = 'gradient' | 'neon' | 'soft' | 'purple';

interface Hero3DVisualProps {
  type?: Hero3DType;
  colorScheme?: Hero3DColorScheme;
  reduceMotion?: boolean;
}

type ParticlePayload = {
  positions: Float32Array;
  colors: Float32Array;
  scales: Float32Array;
  seeds: Float32Array;
  layers: Float32Array;
  linePositions: Float32Array;
  lineColors: Float32Array;
};

const colorStops: Record<Hero3DColorScheme, string[]> = {
  gradient: ['#38bdf8', '#818cf8', '#f472b6', '#facc15'],
  neon: ['#22d3ee', '#67e8f9', '#c084fc', '#fb7185'],
  soft: ['#93c5fd', '#c4b5fd', '#f0abfc', '#fde68a'],
  purple: ['#7dd3fc', '#818cf8', '#c084fc', '#f0abfc'],
};

const seededNoise = (value: number) => {
  const x = Math.sin(value * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

const generateCubeParticles = (divisions: number, size: number) => {
  const particles: THREE.Vector3[] = [];
  const step = size / Math.max(1, divisions - 1);
  const half = size / 2;

  for (let face = 0; face < 6; face += 1) {
    for (let i = 0; i < divisions; i += 1) {
      for (let j = 0; j < divisions; j += 1) {
        const x = -half + i * step;
        const y = -half + j * step;
        let px = x;
        let py = y;
        let pz = half;

        switch (face) {
          case 0:
            px = half;
            pz = x;
            break;
          case 1:
            px = -half;
            pz = -x;
            break;
          case 2:
            py = half;
            pz = y;
            break;
          case 3:
            py = -half;
            pz = -y;
            break;
          case 5:
            pz = -half;
            break;
          default:
            break;
        }

        particles.push(new THREE.Vector3(px, py, pz));
      }
    }
  }

  return particles;
};

const generateSmoothSphere = (radius: number, count: number) => {
  const particles: THREE.Vector3[] = [];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < count; i += 1) {
    const y = 1 - (i / Math.max(1, count - 1)) * 2;
    const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = goldenAngle * i;

    particles.push(
      new THREE.Vector3(
        Math.cos(theta) * radiusAtY * radius,
        y * radius,
        Math.sin(theta) * radiusAtY * radius
      )
    );
  }

  return particles;
};

const generateIcosahedronParticles = (radius: number, rings: number) => {
  const particles: THREE.Vector3[] = [];

  for (let i = 0; i < rings; i += 1) {
    const theta = (i / rings) * Math.PI * 2;
    const bandRadius = radius * (0.86 + Math.sin(i * 1.7) * 0.08);

    for (let j = 0; j < rings; j += 1) {
      const phi = (j / Math.max(1, rings - 1)) * Math.PI;
      particles.push(
        new THREE.Vector3(
          bandRadius * Math.sin(phi) * Math.cos(theta),
          bandRadius * Math.cos(phi),
          bandRadius * Math.sin(phi) * Math.sin(theta)
        )
      );
    }
  }

  return particles;
};

const generateOctahedronParticles = (radius: number, rings: number) => {
  const particles: THREE.Vector3[] = [];
  const geometry = new THREE.OctahedronGeometry(radius, 4);
  const source = geometry.attributes.position;

  for (let i = 0; i < source.count; i += 1) {
    const point = new THREE.Vector3().fromBufferAttribute(source, i);
    particles.push(point);
  }

  geometry.dispose();

  return particles.slice(0, rings * rings * 4);
};

const createInteriorParticles = (radius: number, count: number) => {
  const particles: THREE.Vector3[] = [];

  for (let i = 0; i < count; i += 1) {
    const u = seededNoise(i + 31.17);
    const v = seededNoise(i + 74.61);
    const w = seededNoise(i + 123.93);
    const theta = u * Math.PI * 2;
    const phi = Math.acos(v * 2 - 1);
    const distance = radius * Math.pow(w, 0.36) * 0.88;

    particles.push(
      new THREE.Vector3(
        Math.sin(phi) * Math.cos(theta) * distance,
        Math.cos(phi) * distance,
        Math.sin(phi) * Math.sin(theta) * distance
      )
    );
  }

  return particles;
};

const getBaseParticles = (type: Hero3DType) => {
  switch (type) {
    case 'cube':
      return generateCubeParticles(12, 3.55);
    case 'octahedron':
      return generateOctahedronParticles(2.55, 18);
    case 'icosahedron':
      return generateIcosahedronParticles(2.35, 28);
    case 'smooth-sphere':
    default:
      return generateSmoothSphere(2.2, 1180);
  }
};

const lerpPaletteColor = (
  palette: string[],
  amount: number,
  target = new THREE.Color()
) => {
  const clamped = THREE.MathUtils.clamp(amount, 0, 0.999);
  const scaled = clamped * (palette.length - 1);
  const startIndex = Math.floor(scaled);
  const endIndex = Math.min(palette.length - 1, startIndex + 1);
  const mix = scaled - startIndex;

  target.set(palette[startIndex]);
  target.lerp(new THREE.Color(palette[endIndex]), mix);
  return target;
};

const buildParticlePayload = (
  type: Hero3DType,
  colorScheme: Hero3DColorScheme
): ParticlePayload => {
  const shellParticles = getBaseParticles(type);
  const interiorCount = type === 'smooth-sphere' ? 260 : 140;
  const particles = [...shellParticles, ...createInteriorParticles(2.15, interiorCount)];
  const shellCount = shellParticles.length;
  const palette = colorStops[colorScheme];

  const positions = new Float32Array(particles.length * 3);
  const colors = new Float32Array(particles.length * 3);
  const scales = new Float32Array(particles.length);
  const seeds = new Float32Array(particles.length);
  const layers = new Float32Array(particles.length);
  const color = new THREE.Color();

  particles.forEach((particle, index) => {
    const isShell = index < shellCount;
    const seed = seededNoise(index + type.length * 19.7);
    const normalizedY = (particle.y + 2.35) / 4.7;
    const sweep = (Math.atan2(particle.z, particle.x) + Math.PI) / (Math.PI * 2);
    const colorAmount = (normalizedY * 0.52 + sweep * 0.32 + seed * 0.16) % 1;

    lerpPaletteColor(palette, colorAmount, color);
    color.multiplyScalar(isShell ? 1 : 0.72);

    positions[index * 3] = particle.x;
    positions[index * 3 + 1] = particle.y;
    positions[index * 3 + 2] = particle.z;
    colors[index * 3] = color.r;
    colors[index * 3 + 1] = color.g;
    colors[index * 3 + 2] = color.b;
    seeds[index] = seed;
    layers[index] = isShell ? 1 : 0.34;
    scales[index] = isShell
      ? 0.18 + seed * 0.34 + (index % 17 === 0 ? 0.2 : 0)
      : 0.1 + seed * 0.18;
  });

  const segmentCount = Math.min(132, Math.floor(shellCount / 7));
  const linePositions = new Float32Array(segmentCount * 2 * 3);
  const lineColors = new Float32Array(segmentCount * 2 * 3);

  for (let i = 0; i < segmentCount; i += 1) {
    const startIndex = (i * 7) % shellCount;
    const hop = 19 + Math.floor(seededNoise(i + 4.4) * 38);
    const endIndex = (startIndex + hop) % shellCount;
    const start = shellParticles[startIndex];
    const end = shellParticles[endIndex];
    const lineColor = lerpPaletteColor(palette, seededNoise(i + 90.2), color);
    lineColor.multiplyScalar(0.75);

    linePositions.set([start.x, start.y, start.z, end.x, end.y, end.z], i * 6);
    lineColors.set(
      [
        lineColor.r,
        lineColor.g,
        lineColor.b,
        lineColor.r,
        lineColor.g,
        lineColor.b,
      ],
      i * 6
    );
  }

  return {
    positions,
    colors,
    scales,
    seeds,
    layers,
    linePositions,
    lineColors,
  };
};

function OrbitRing({
  radius,
  rotation,
  color,
  opacity,
  speed,
  reduceMotion,
}: {
  radius: number;
  rotation: [number, number, number];
  color: string;
  opacity: number;
  speed: number;
  reduceMotion: boolean;
}) {
  const ringRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!ringRef.current || reduceMotion) return;

    ringRef.current.rotation.z = rotation[2] + clock.getElapsedTime() * speed;
  });

  return (
    <group ref={ringRef} rotation={rotation}>
      <mesh>
        <torusGeometry args={[radius, 0.0075, 8, 180]} />
        <meshBasicMaterial
          blending={THREE.AdditiveBlending}
          color={color}
          depthWrite={false}
          opacity={opacity}
          toneMapped={false}
          transparent
        />
      </mesh>
    </group>
  );
}

function Hero3DContent({
  type = 'smooth-sphere',
  colorScheme = 'purple',
  reduceMotion = false,
}: Hero3DVisualProps) {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const smoothMouseRef = useRef({ x: 0, y: 0 });
  const isInsideRef = useRef(false);
  const { gl, size } = useThree();

  const payload = useMemo(
    () => buildParticlePayload(type, colorScheme),
    [type, colorScheme]
  );

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPixelRatio: { value: 1 },
    }),
    []
  );

  useEffect(() => {
    uniforms.uPixelRatio.value = Math.min(gl.getPixelRatio(), 1.8);
  }, [gl, uniforms]);

  useEffect(() => {
    const canvas = document.querySelector('[data-hero-3d-canvas]') as HTMLCanvasElement;
    if (!canvas) return;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

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
    if (!groupRef.current || !materialRef.current) return;

    const time = clock.getElapsedTime();
    const responsiveScale = size.width < 420 ? 0.76 : size.width < 720 ? 0.9 : 1;

    if (!reduceMotion) {
      uniforms.uTime.value = time;
      smoothMouseRef.current.x += (mouseRef.current.x - smoothMouseRef.current.x) * 0.075;
      smoothMouseRef.current.y += (mouseRef.current.y - smoothMouseRef.current.y) * 0.075;
    } else {
      smoothMouseRef.current.x += (0 - smoothMouseRef.current.x) * 0.15;
      smoothMouseRef.current.y += (0 - smoothMouseRef.current.y) * 0.15;
      uniforms.uTime.value = 0;
    }

    const idleRotationX = reduceMotion || isInsideRef.current ? -0.12 : Math.sin(time * 0.16) * 0.22 - 0.12;
    const idleRotationY = reduceMotion || isInsideRef.current ? 0.36 : time * 0.12 + 0.36;
    const idleRotationZ = reduceMotion || isInsideRef.current ? -0.08 : Math.sin(time * 0.12) * 0.1 - 0.08;

    groupRef.current.rotation.x = idleRotationX + smoothMouseRef.current.y * 0.34;
    groupRef.current.rotation.y = idleRotationY + smoothMouseRef.current.x * 0.48;
    groupRef.current.rotation.z = idleRotationZ;
    groupRef.current.position.y = reduceMotion ? 0 : Math.sin(time * 0.22) * 0.1;

    const pulse = reduceMotion ? 1 : 1 + Math.sin(time * 0.42) * 0.025;
    groupRef.current.scale.setScalar(responsiveScale * pulse);
  });

  return (
    <group ref={groupRef} position={[0.1, 0.02, 0]}>
      <mesh frustumCulled={false}>
        <icosahedronGeometry args={[1.42, 2]} />
        <meshBasicMaterial
          color="#93c5fd"
          depthWrite={false}
          opacity={0.16}
          toneMapped={false}
          transparent
          wireframe
        />
      </mesh>

      <mesh frustumCulled={false} scale={1.035}>
        <sphereGeometry args={[2.25, 64, 64]} />
        <meshBasicMaterial
          blending={THREE.AdditiveBlending}
          color="#38bdf8"
          depthWrite={false}
          opacity={0.035}
          side={THREE.BackSide}
          toneMapped={false}
          transparent
        />
      </mesh>

      <lineSegments frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[payload.linePositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[payload.lineColors, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          opacity={0.28}
          toneMapped={false}
          transparent
          vertexColors
        />
      </lineSegments>

      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[payload.positions, 3]} />
          <bufferAttribute attach="attributes-aScale" args={[payload.scales, 1]} />
          <bufferAttribute attach="attributes-aColor" args={[payload.colors, 3]} />
          <bufferAttribute attach="attributes-aSeed" args={[payload.seeds, 1]} />
          <bufferAttribute attach="attributes-aLayer" args={[payload.layers, 1]} />
        </bufferGeometry>
        <shaderMaterial
          ref={materialRef}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          fragmentShader={fragmentShader}
          transparent
          uniforms={uniforms}
          vertexShader={vertexShader}
        />
      </points>

      <OrbitRing
        color="#7dd3fc"
        opacity={0.44}
        radius={2.72}
        reduceMotion={reduceMotion}
        rotation={[1.08, 0.16, -0.36]}
        speed={0.08}
      />
      <OrbitRing
        color="#c084fc"
        opacity={0.34}
        radius={2.98}
        reduceMotion={reduceMotion}
        rotation={[0.48, 1.08, 0.62]}
        speed={-0.055}
      />
      <OrbitRing
        color="#fde68a"
        opacity={0.2}
        radius={2.47}
        reduceMotion={reduceMotion}
        rotation={[1.42, -0.48, 0.18]}
        speed={0.045}
      />
    </group>
  );
}

export const Hero3DVisual = ({
  type = 'smooth-sphere',
  colorScheme = 'purple',
  reduceMotion = false,
}: Hero3DVisualProps) => {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <div
        className="absolute inset-0 bg-[linear-gradient(135deg,rgba(5,10,20,0.96),rgba(14,22,40,0.78)_48%,rgba(4,8,16,0.98))]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-grid opacity-45 [mask-image:linear-gradient(to_bottom,transparent,black_16%,black_82%,transparent)]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-6 top-[24%] h-px bg-gradient-to-r from-transparent via-cyan-200/35 to-transparent"
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-10 bottom-[22%] h-px bg-gradient-to-r from-transparent via-violet-200/25 to-transparent"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-6 left-5 right-5 top-6 border-y border-white/10"
        aria-hidden="true"
      />
      <Canvas
        data-hero-3d-canvas
        camera={{
          position: [0, 0, 6.2],
          fov: 68,
        }}
        className="relative z-10 h-full w-full"
        dpr={[1, 1.75]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          preserveDrawingBuffer: process.env.NODE_ENV !== 'production',
        }}
        performance={{ current: 1, min: 0.65, max: 1 }}
      >
        <fog attach="fog" args={['#07101f', 5.6, 9.8]} />
        <Hero3DContent
          colorScheme={colorScheme}
          reduceMotion={reduceMotion}
          type={type}
        />
      </Canvas>
    </div>
  );
};

export default Hero3DVisual;
