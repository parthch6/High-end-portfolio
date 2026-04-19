/**
 * Particle Sphere Utilities
 * Helper functions for creating and customizing particle configurations
 */

import * as THREE from 'three';

/**
 * Generate uniformly distributed particles on a sphere
 * @param count - Number of particles
 * @param radius - Sphere radius
 * @returns Float32Array of particle positions
 */
export const generateSphericalParticles = (
  count: number,
  radius: number
): Float32Array => {
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

/**
 * Generate particles in a cube formation
 * @param count - Number of particles
 * @param size - Cube size
 * @returns Float32Array of particle positions
 */
export const generateCubicParticles = (
  count: number,
  size: number
): Float32Array => {
  const positions = new Float32Array(count * 3);
  const halfSize = size / 2;

  for (let i = 0; i < count; i++) {
    positions[i * 3] = Math.random() * size - halfSize;
    positions[i * 3 + 1] = Math.random() * size - halfSize;
    positions[i * 3 + 2] = Math.random() * size - halfSize;
  }

  return positions;
};

/**
 * Generate particles in a toroidal (donut) formation
 * @param count - Number of particles
 * @param majorRadius - Main radius
 * @param minorRadius - Tube radius
 * @returns Float32Array of particle positions
 */
export const generateToroidalParticles = (
  count: number,
  majorRadius: number,
  minorRadius: number
): Float32Array => {
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const phi = Math.random() * Math.PI * 2;
    const theta = Math.random() * Math.PI * 2;

    const x =
      (majorRadius + minorRadius * Math.cos(theta)) * Math.cos(phi);
    const y = minorRadius * Math.sin(theta);
    const z =
      (majorRadius + minorRadius * Math.cos(theta)) * Math.sin(phi);

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
  }

  return positions;
};

/**
 * Generate connection lines between nearby particles
 * @param positions - Particle positions array
 * @param particleCount - Number of particles
 * @param connectionDistance - Maximum distance for connection
 * @returns Float32Array of line positions
 */
export const generateConnections = (
  positions: Float32Array,
  particleCount: number,
  connectionDistance: number
): Float32Array => {
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

/**
 * Generate optimized connections (only check nearby particles)
 * Recommended for large particle counts
 * @param positions - Particle positions array
 * @param particleCount - Number of particles
 * @param connectionDistance - Maximum distance for connection
 * @param checkRadius - Only check this many neighbors (optimization)
 * @returns Float32Array of line positions
 */
export const generateOptimizedConnections = (
  positions: Float32Array,
  particleCount: number,
  connectionDistance: number,
  checkRadius: number = 50
): Float32Array => {
  const linePositions: number[] = [];

  for (let i = 0; i < particleCount; i++) {
    for (
      let j = i + 1;
      j < Math.min(i + checkRadius, particleCount);
      j++
    ) {
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

/**
 * Generate scale attributes for particles (random sizes)
 * @param count - Number of particles
 * @param minScale - Minimum scale value
 * @param maxScale - Maximum scale value
 * @returns Float32Array of scale values
 */
export const generateScales = (
  count: number,
  minScale: number = 0.4,
  maxScale: number = 1.2
): Float32Array => {
  const scales = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    scales[i] = minScale + Math.random() * (maxScale - minScale);
  }

  return scales;
};

/**
 * Color configuration interface
 */
export interface ColorConfig {
  particleColor?: string;
  particleGlow?: string;
  lineColor?: string;
  backgroundColor?: string;
}

/**
 * Get default color configs
 */
export const DEFAULT_COLORS: { [key: string]: ColorConfig } = {
  default: {
    particleColor: '#ffffff',
    particleGlow: '#ffffff',
    lineColor: '#ffffff',
    backgroundColor: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
  },
  neon: {
    particleColor: '#00ff00',
    particleGlow: '#00ff00',
    lineColor: '#00ff00',
    backgroundColor:
      'linear-gradient(135deg, #000000 0%, #0a0a1a 50%, #1a0a2e 100%)',
  },
  ocean: {
    particleColor: '#00ccff',
    particleGlow: '#0088ff',
    lineColor: '#00ccff',
    backgroundColor:
      'linear-gradient(135deg, #001a33 0%, #003366 50%, #001a4d 100%)',
  },
  sunset: {
    particleColor: '#ff8800',
    particleGlow: '#ff6600',
    lineColor: '#ffaa00',
    backgroundColor:
      'linear-gradient(135deg, #2d0a00 0%, #4d1a00 50%, #3d0a1a 100%)',
  },
  cyberpunk: {
    particleColor: '#ff00ff',
    particleGlow: '#ff00ff',
    lineColor: '#00ffff',
    backgroundColor:
      'linear-gradient(135deg, #0a0010 0%, #1a0a2e 50%, #0a1a2e 100%)',
  },
  monochrome: {
    particleColor: '#cccccc',
    particleGlow: '#999999',
    lineColor: '#888888',
    backgroundColor:
      'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #0a0a0a 100%)',
  },
};

/**
 * Distance calculation helper
 */
export const calculateDistance = (
  x1: number,
  y1: number,
  z1: number,
  x2: number,
  y2: number,
  z2: number
): number => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dz = z2 - z1;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
};

/**
 * Calculate distance squared (faster, useful for comparisons)
 */
export const calculateDistanceSquared = (
  x1: number,
  y1: number,
  z1: number,
  x2: number,
  y2: number,
  z2: number
): number => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dz = z2 - z1;
  return dx * dx + dy * dy + dz * dz;
};

/**
 * Sphere position validator
 */
export const isPointOnSphere = (
  x: number,
  y: number,
  z: number,
  radius: number,
  tolerance: number = 0.1
): boolean => {
  const distance = Math.sqrt(x * x + y * y + z * z);
  return Math.abs(distance - radius) < tolerance;
};

/**
 * Animation state interface
 */
export interface AnimationState {
  rotationX: number;
  rotationY: number;
  rotationZ: number;
  positionY: number;
  time: number;
}

/**
 * Create animation state
 */
export const createAnimationState = (): AnimationState => ({
  rotationX: 0,
  rotationY: 0,
  rotationZ: 0,
  positionY: 0,
  time: 0,
});

/**
 * Easing function - smooth interpolation
 */
export const easeOut = (
  current: number,
  target: number,
  easing: number = 0.05
): number => {
  return current + (target - current) * easing;
};

/**
 * Easing function - exponential
 */
export const easeExpo = (t: number): number => {
  return t === 0 ? 0 : Math.pow(2, 10 * t - 10);
};

/**
 * Easing function - cubic
 */
export const easeCubic = (t: number): number => {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

/**
 * Convert HSL to RGB color
 */
export const hslToRgb = (h: number, s: number, l: number): string => {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0,
    g = 0,
    b = 0;

  if (h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (h < 300) {
    r = x;
    g = 0;
    b = c;
  } else {
    r = c;
    g = 0;
    b = x;
  }

  const toHex = (n: number): string => {
    const hex = Math.round((n + m) * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

/**
 * Performance profiling helper
 */
export class PerformanceMonitor {
  private frames = 0;
  private lastTime = Date.now();
  private fps = 0;

  update(): number {
    this.frames++;
    const now = Date.now();
    const deltaTime = now - this.lastTime;

    if (deltaTime >= 1000) {
      this.fps = (this.frames * 1000) / deltaTime;
      this.frames = 0;
      this.lastTime = now;
    }

    return this.fps;
  }

  getFPS(): number {
    return this.fps;
  }
}

/**
 * Memory calculator (rough estimate)
 */
export const calculateMemoryUsage = (particleCount: number): string => {
  // Each particle: 3 floats (12 bytes) for position
  // Connections: rough estimate ~5 per particle * 6 floats (120 bytes)
  const particleMemory = particleCount * 12;
  const connectionMemory = particleCount * 5 * 24;
  const totalBytes = particleMemory + connectionMemory;

  if (totalBytes > 1024 * 1024) {
    return `${(totalBytes / (1024 * 1024)).toFixed(2)} MB`;
  } else if (totalBytes > 1024) {
    return `${(totalBytes / 1024).toFixed(2)} KB`;
  }
  return `${totalBytes} Bytes`;
};
