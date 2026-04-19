# Particle Sphere Components - Complete Usage Guide

## Quick Start

### Installation
Ensure you have the required dependencies:
```bash
npm install three @react-three/fiber @react-three/drei
```

### Basic Usage

```tsx
'use client';

import { OptimizedParticleSphere } from '@/components/motion/optimized-particle-sphere';

export default function Home() {
  return (
    <main className="w-full h-screen">
      <OptimizedParticleSphere />
    </main>
  );
}
```

---

## Three Component Versions

### 1. **Standard ParticleSphere**
**File:** `components/motion/particle-sphere.tsx`

Best for: Learning, simple integrations, standard performance requirements

```tsx
import { ParticleSphere } from '@/components/motion/particle-sphere';

export default function Demo() {
  return <ParticleSphere />;
}
```

**Pros:**
- Straightforward implementation
- Easy to understand and modify
- Good performance on most devices

**Cons:**
- CPU-based updates
- May struggle on low-end devices with many particles

---

### 2. **OptimizedParticleSphere**
**File:** `components/motion/optimized-particle-sphere.tsx`

Best for: Production, performance-critical applications, high particle counts

```tsx
import { OptimizedParticleSphere } from '@/components/motion/optimized-particle-sphere';

export default function Demo() {
  return <OptimizedParticleSphere />;
}
```

**Pros:**
- GPU-accelerated with shaders
- Exceptional performance
- Adaptive DPR scaling
- Smooth 60 FPS on most devices

**Cons:**
- More complex shader code
- Requires WebGL 2.0 support

---

### 3. **AdvancedParticleSphere**
**File:** `components/motion/advanced-particle-sphere.tsx`

Best for: Highly customizable implementations, different geometries, theme variations

```tsx
import { AdvancedParticleSphere } from '@/components/motion/advanced-particle-sphere';

export default function Demo() {
  return (
    <AdvancedParticleSphere
      type="sphere"
      particleCount={1000}
      colorScheme="ocean"
    />
  );
}
```

**Features:**
- Multiple geometry types: sphere, torus, cube
- 6 built-in color schemes
- Full customization support
- Preset configurations

---

## Configuration Options

### ParticleGroup Props

```tsx
interface ParticleGroupProps {
  particleCount?: number;      // Default: 1000 (or 1200 for optimized)
  sphereRadius?: number;        // Default: 3
  connectionDistance?: number;  // Default: 1.5
}
```

### AdvancedParticleSphere Props

```tsx
interface AdvancedParticleSphereProps {
  type?: 'sphere' | 'torus' | 'cube';           // Default: 'sphere'
  particleCount?: number;                        // Default: 1000
  size?: number;                                 // Default: 3
  connectionDistance?: number;                   // Default: 1.5
  colorScheme?: keyof typeof DEFAULT_COLORS;    // See color schemes below
  animationSpeed?: number;                       // Default: 1 (1.0 = normal speed)
  background?: string;                           // Custom background override
}
```

---

## Color Schemes

Available color schemes in `AdvancedParticleSphere`:

### Default
```tsx
<AdvancedParticleSphere colorScheme="default" />
// Clean white particles on dark background
```

### Neon
```tsx
<AdvancedParticleSphere colorScheme="neon" />
// Bright green particles with high contrast
```

### Ocean
```tsx
<AdvancedParticleSphere colorScheme="ocean" />
// Cyan and blue tones, aquatic feel
```

### Sunset
```tsx
<AdvancedParticleSphere colorScheme="sunset" />
// Orange and warm tones
```

### Cyberpunk
```tsx
<AdvancedParticleSphere colorScheme="cyberpunk" />
// Magenta particles, cyan lines - high contrast future aesthetic
```

### Monochrome
```tsx
<AdvancedParticleSphere colorScheme="monochrome" />
// Grayscale for professional, minimal look
```

---

## Preset Configurations

Quick access to pre-configured particle spheres:

```tsx
import { ParticlePresets } from '@/components/motion/advanced-particle-sphere';

// Default sphere
export default function Home() {
  return <div className="w-full h-screen">{ParticlePresets.defaultSphere()}</div>;
}
```

### Available Presets

```tsx
// High performance for slower devices
ParticlePresets.fastSphere()

// Dense, intense particle network
ParticlePresets.denseSphere()

// Toroidal (donut) ocean-themed structure
ParticlePresets.oceanTorus()

// Neon cube formation
ParticlePresets.neonCube()

// Slow, sunset-themed animation
ParticlePresets.sunsetSphere()

// Minimal, professional appearance
ParticlePresets.minimalSphere()
```

---

## Utility Functions

Located in `lib/particle-sphere-utils.ts`

### Particle Generation

```tsx
import {
  generateSphericalParticles,
  generateCubicParticles,
  generateToroidalParticles,
} from '@/lib/particle-sphere-utils';

// Sphere (uniform distribution on sphere surface)
const positions = generateSphericalParticles(1000, 3);

// Cube (uniform distribution in cubic volume)
const positions = generateCubicParticles(1000, 4);

// Torus (donut shape)
const positions = generateToroidalParticles(1000, 3, 1);
```

### Connection Generation

```tsx
import {
  generateConnections,
  generateOptimizedConnections,
} from '@/lib/particle-sphere-utils';

// Full connection check (slower, complete)
const lines = generateConnections(positions, particleCount, 1.5);

// Optimized check (faster, good enough)
const lines = generateOptimizedConnections(positions, particleCount, 1.5, 50);
```

### Color Utilities

```tsx
import { DEFAULT_COLORS, hslToRgb } from '@/lib/particle-sphere-utils';

// Get a color scheme
const colors = DEFAULT_COLORS.ocean;
console.log(colors.particleColor); // '#00ccff'

// Convert HSL to RGB hex
const color = hslToRgb(200, 1, 0.5); // '#0080ff'
```

### Performance Utilities

```tsx
import {
  PerformanceMonitor,
  calculateMemoryUsage,
} from '@/lib/particle-sphere-utils';

// Track FPS
const monitor = new PerformanceMonitor();
const fps = monitor.update(); // Call in animation loop

// Estimate memory usage
const memUse = calculateMemoryUsage(1000); // '~48 KB'
```

---

## Real-World Examples

### Example 1: Full-Screen Hero Section

```tsx
'use client';

import { OptimizedParticleSphere } from '@/components/motion/optimized-particle-sphere';

export default function Hero() {
  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Background particles */}
      <div className="absolute inset-0">
        <OptimizedParticleSphere />
      </div>

      {/* Content overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center z-10">
          <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
            Welcome to My Portfolio
          </h1>
          <p className="text-xl text-gray-300 drop-shadow-lg">
            Explore my creative work and innovations
          </p>
        </div>
      </div>
    </section>
  );
}
```

### Example 2: Dynamically Switching Themes

```tsx
'use client';

import { useState } from 'react';
import { AdvancedParticleSphere } from '@/components/motion/advanced-particle-sphere';

export default function ThemeSelector() {
  const [theme, setTheme] = useState<'default' | 'ocean' | 'neon'>('default');

  return (
    <div className="w-full h-screen relative">
      {/* Particle sphere with current theme */}
      <div className="absolute inset-0">
        <AdvancedParticleSphere
          colorScheme={theme}
          animationSpeed={1}
        />
      </div>

      {/* Theme controls */}
      <div className="absolute top-4 right-4 z-50 flex gap-2">
        {['default', 'ocean', 'neon'].map((t) => (
          <button
            key={t}
            onClick={() => setTheme(t as any)}
            className={`px-4 py-2 rounded ${
              theme === t
                ? 'bg-white text-black'
                : 'bg-gray-700 text-white'
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}
```

### Example 3: Custom Particle Configuration

```tsx
'use client';

import React, { useState } from 'react';
import { AdvancedParticleSphere } from '@/components/motion/advanced-particle-sphere';

export default function CustomParticles() {
  const [particleCount, setParticleCount] = useState(1000);
  const [geometry, setGeometry] = useState<'sphere' | 'torus' | 'cube'>('sphere');

  return (
    <div className="w-full h-screen relative">
      {/* Particle sphere */}
      <div className="absolute inset-0">
        <AdvancedParticleSphere
          type={geometry}
          particleCount={particleCount}
          colorScheme="cyberpunk"
        />
      </div>

      {/* Control panel */}
      <div className="absolute left-4 top-4 z-50 bg-black/70 p-6 rounded-lg">
        <h2 className="text-white font-bold mb-4">Configuration</h2>

        <div className="mb-4">
          <label className="block text-white mb-2">
            Particles: {particleCount}
          </label>
          <input
            type="range"
            min="200"
            max="2000"
            step="100"
            value={particleCount}
            onChange={(e) => setParticleCount(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-white mb-2">Geometry</label>
          <select
            value={geometry}
            onChange={(e) => setGeometry(e.target.value as any)}
            className="bg-gray-700 text-white px-3 py-2 rounded w-full"
          >
            <option value="sphere">Sphere</option>
            <option value="torus">Torus</option>
            <option value="cube">Cube</option>
          </select>
        </div>
      </div>
    </div>
  );
}
```

### Example 4: Component Grid Display

```tsx
'use client';

import { ParticlePresets } from '@/components/motion/advanced-particle-sphere';

export default function ParticleGallery() {
  return (
    <div className="w-full min-h-screen bg-black p-8">
      <h1 className="text-4xl font-bold text-white mb-8">
        Particle Sphere Gallery
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="h-96 rounded-lg overflow-hidden border border-gray-700">
          <div className="w-full h-full">
            {ParticlePresets.defaultSphere()}
          </div>
        </div>

        <div className="h-96 rounded-lg overflow-hidden border border-gray-700">
          <div className="w-full h-full">
            {ParticlePresets.oceanTorus()}
          </div>
        </div>

        <div className="h-96 rounded-lg overflow-hidden border border-gray-700">
          <div className="w-full h-full">
            {ParticlePresets.neonCube()}
          </div>
        </div>

        <div className="h-96 rounded-lg overflow-hidden border border-gray-700">
          <div className="w-full h-full">
            {ParticlePresets.denseSphere()}
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## Performance Optimization Tips

### For Low-End Devices

```tsx
// Reduce particle count
<AdvancedParticleSphere particleCount={400} />

// Increase connection distance to reduce line rendering
<AdvancedParticleSphere connectionDistance={2.0} />

// Use monochrome scheme (simpler rendering)
<AdvancedParticleSphere colorScheme="monochrome" />

// Slow animation for smoother feel
<AdvancedParticleSphere animationSpeed={0.5} />
```

### For High-End Devices

```tsx
// Increase particle density
<AdvancedParticleSphere particleCount={2000} />

// Reduce connection distance for dense network
<AdvancedParticleSphere connectionDistance={1.0} />

// Use intensive color schemes
<AdvancedParticleSphere colorScheme="cyberpunk" />

// Speed up animation
<AdvancedParticleSphere animationSpeed={1.5} />
```

---

## Common Issues & Solutions

### Issue: Component doesn't render
**Solution:** Ensure `'use client'` directive is at the top of your file.

### Issue: Particles not animating
**Solution:** Check that `animationSpeed` is not 0. Default is 1.

### Issue: Poor performance on mobile
**Solution:** Use `AdvancedParticleSphere` with reduced `particleCount` (400-600).

### Issue: Particles appear as squares
**Solution:** Ensure Three.js is up to date: `npm install three@latest`

### Issue: Mouse interaction not working
**Solution:** Verify the canvas is in focus and the mouse event listener is attached.

---

## Styling & Responsive Design

### Full-Screen with Responsive Height

```tsx
<div className="w-full h-screen">
  <OptimizedParticleSphere />
</div>
```

### Fixed-Size Container

```tsx
<div className="w-96 h-96 rounded-lg overflow-hidden">
  <AdvancedParticleSphere />
</div>
```

### With Aspect Ratio

```tsx
<div className="w-full aspect-video">
  <AdvancedParticleSphere />
</div>
```

---

## Next Steps

1. **Explore the demo:** Visit `/particle-sphere` to see both versions in action
2. **Customize colors:** Modify the shader code or use `DEFAULT_COLORS`
3. **Integrate components:** Add to your hero sections, landing pages, or portfolios
4. **Optimize further:** Use the utility functions to create custom configurations
5. **Contribute:** Extend the components for your specific needs

---

## API Reference Summary

### Main Components
- `ParticleSphere` - Standard implementation
- `OptimizedParticleSphere` - GPU-optimized with shaders
- `AdvancedParticleSphere` - Highly customizable with presets

### Utility Functions
- `generateSphericalParticles(count, radius)` - Creates sphere geometry
- `generateCubicParticles(count, size)` - Creates cube geometry
- `generateToroidalParticles(count, majorRadius, minorRadius)` - Creates torus
- `generateOptimizedConnections()` - Fast line generation
- `PerformanceMonitor` - Track FPS
- `calculateMemoryUsage()` - Estimate VRAM usage

### Color Schemes
- `default` - Clean white on dark
- `neon` - Bright green
- `ocean` - Cyan/blue
- `sunset` - Orange/warm
- `cyberpunk` - Magenta/cyan
- `monochrome` - Grayscale
