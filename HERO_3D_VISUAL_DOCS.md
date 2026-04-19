# Hero 3D Visual Components - Documentation

## Overview

The Hero 3D Visual system provides playful, interactive 3D geometric structures made from particles, strings, and custom textures. These components are designed to showcase creativity, technical skill, and a unique mindset in your hero section.

---

## Components

### 1. **Hero3DVisual** (Main Component)
**File:** `components/motion/hero-3d-visual.tsx`

Primary geometric shapes - ideal for a striking hero section focal point.

#### Available Geometry Types:

##### **Cube** (default)
```tsx
<Hero3DVisual type="cube" colorScheme="gradient" />
```
- Grid-based particle distribution on cube faces
- Clean, geometric aesthetic
- Best for: Professional, structured look

##### **Octahedron**
```tsx
<Hero3DVisual type="octahedron" colorScheme="purple" />
```
- 8-faced geometric shape
- More organic than cube
- Best for: Tech-forward, dynamic appearance

##### **Icosahedron**
```tsx
<Hero3DVisual type="icosahedron" colorScheme="neon" />
```
- 20-faced complex geometry
- Dense particle distribution
- Best for: Intricate, complex look

---

### 2. **Hero3DVariant** (Extended Geometries)
**File:** `components/motion/hero-3d-variants.tsx`

Alternative, more playful geometric structures.

#### Available Types:

##### **Spiral**
```tsx
<Hero3DVariant type="spiral" colorScheme="rainbow" />
```
- Helix/double helix structure
- Flowing, organic motion
- Best for: DNA-like, biological tech visualization

##### **Torus Knot**
```tsx
<Hero3DVariant type="torus-knot" colorScheme="neon" />
```
- Complex mathematical knot
- Mesmerizing, intricate pattern
- Best for: Advanced mathematical/AI work

##### **Sphere Dense**
```tsx
<Hero3DVariant type="sphere-dense" colorScheme="gradient" />
```
- Particle cloud in spherical form
- Organic, cloud-like appearance
- Best for: Ambient, minimalist look

##### **Fractal**
```tsx
<Hero3DVariant type="fractal" colorScheme="purple" />
```
- Menger sponge-like fractal geometry
- Mathematical, intricate structure
- Best for: Algorithm/AI specialists

---

## Color Schemes

All components support multiple color schemes:

### **Gradient**
```tsx
<Hero3DVisual colorScheme="gradient" />
```
- Smooth color transitions
- Professional, elegant
- Blue-dominant with position-based coloring

### **Neon**
```tsx
<Hero3DVisual colorScheme="neon" />
```
- Bright, saturated colors
- High contrast, energetic
- Cyan to green transitions

### **Purple**
```tsx
<Hero3DVisual colorScheme="purple" />
```
- Purple-to-white glow effect
- Tech-forward, futuristic
- Deep purples with white highlights

### **Soft**
```tsx
<Hero3DVisual colorScheme="soft" />
```
- Pastel, muted tones
- Calming, sophisticated
- Blues, grays, and soft whites

### **Rainbow** (Variants only)
```tsx
<Hero3DVariant colorScheme="rainbow" />
```
- Full spectrum color cycling
- Playful, creative
- HSL color wheel implementation

---

## Interactive Features

All 3D visuals include:
- ✨ **Mouse-following rotation** - Responds to cursor movement
- 🌀 **Floating animation** - Gentle bobbing and drift
- 💫 **Scale pulse** - Breathing effect
- 🎨 **Particle movement** - Individual particle drift
- 🎮 **Playful dynamics** - Dynamic, organic motion

---

## Integration Examples

### Hero Section (Default)
```tsx
import dynamic from "next/dynamic";

const Hero3DVisual = dynamic(
  () => import("@/components/motion/hero-3d-visual").then((mod) => mod.Hero3DVisual),
  { ssr: false }
);

export function HeroSection() {
  return (
    <div>
      <Hero3DVisual type="cube" colorScheme="purple" />
    </div>
  );
}
```

### Custom Interactive Hero
```tsx
'use client';

import { useState } from 'react';
import { Hero3DVisual } from '@/components/motion/hero-3d-visual';

export function InteractiveHero() {
  const [geometry, setGeometry] = useState<'cube' | 'octahedron' | 'icosahedron'>('cube');
  const [colors, setColors] = useState<'gradient' | 'neon' | 'soft' | 'purple'>('gradient');

  return (
    <div className="w-full h-screen relative">
      <div className="absolute inset-0">
        <Hero3DVisual type={geometry} colorScheme={colors} />
      </div>

      <div className="absolute top-4 right-4 z-50 flex gap-2">
        <select
          value={geometry}
          onChange={(e) => setGeometry(e.target.value as any)}
          className="px-4 py-2 rounded bg-white/10 text-white border border-white/20"
        >
          <option value="cube">Cube</option>
          <option value="octahedron">Octahedron</option>
          <option value="icosahedron">Icosahedron</option>
        </select>

        <select
          value={colors}
          onChange={(e) => setColors(e.target.value as any)}
          className="px-4 py-2 rounded bg-white/10 text-white border border-white/20"
        >
          <option value="gradient">Gradient</option>
          <option value="neon">Neon</option>
          <option value="soft">Soft</option>
          <option value="purple">Purple</option>
        </select>
      </div>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center text-white">
          <h1 className="text-5xl font-bold mb-4">Creative Minds Think Different</h1>
          <p className="text-xl text-gray-300">3D Geometric Showcase</p>
        </div>
      </div>
    </div>
  );
}
```

### Overlay with Content
```tsx
<div className="relative w-full h-full">
  {/* 3D Background */}
  <div className="absolute inset-0">
    <Hero3DVisual type="octahedron" colorScheme="neon" />
  </div>

  {/* Content Overlay */}
  <div className="relative z-10 container mx-auto px-4 py-20">
    <h1 className="text-5xl font-bold text-white drop-shadow-lg">
      Full-Stack Developer
    </h1>
    <p className="text-xl text-gray-300 mt-4 drop-shadow-lg max-w-2xl">
      I create immersive digital experiences through creative problem-solving
      and innovative technical solutions.
    </p>
  </div>
</div>
```

---

## Customization Guide

### Adjusting Particle Density

In **hero-3d-visual.tsx**:
```tsx
// Change divisions for cube
generateCubeParticles(8, 3)  // 8 = fewer particles, 12 = more dense
generateOctahedronParticles(2.5, 12)  // 12 = segments, increase for more particles
```

In **hero-3d-variants.tsx**:
```tsx
generateSpiralParticles(1.5, 3, 400)  // 400 = particle count
generateTorusKnotParticles(600)  // 600 = segments
```

### Changing Animation Speed

Modify `useFrame` multipliers:
```tsx
groupRef.current.rotation.x = Math.sin(time * 0.25) * 0.4;  // 0.25 = speed
groupRef.current.rotation.y = time * 0.15;  // 0.15 = speed
```

Lower values = slower, higher = faster

### Creating Custom Colors

Add to color scheme switch:
```tsx
case 'custom':
  r = 0.9 + Math.sin(i * 0.02) * 0.1;
  g = 0.2;
  b = 0.7 + Math.cos(i * 0.03) * 0.2;
  break;
```

---

## Performance Optimization

### For Mobile/Low-End Devices
```tsx
<Hero3DVisual 
  type="cube"  // Simpler geometry
  colorScheme="soft"  // Less intense colors
/>
```

### For High-Performance
```tsx
<Hero3DVariant 
  type="torus-knot"  // Complex geometry
  colorScheme="rainbow"  // More colors
/>
```

---

## Use Cases by Type

| Type | Use Case | Best Scheme |
|------|----------|------------|
| **Cube** | General tech portfolio | Gradient, Purple |
| **Octahedron** | Structured, geometric work | Neon, Soft |
| **Icosahedron** | Complex, intricate solutions | Purple, Neon |
| **Spiral** | DNA/biotech, evolution | Rainbow, Gradient |
| **Torus Knot** | Math, algorithms, AI | Neon, Rainbow |
| **Sphere Dense** | Cloud, ambient, minimalist | Soft, Gradient |
| **Fractal** | Fractals, recursion, complexity | Purple, Neon |

---

## Technical Features

- **GPU Acceleration**: Custom vertex/fragment shaders
- **Particle System**: 300-600+ particles per shape
- **Connection Lines**: Procedural line generation between nearby particles
- **Additive Blending**: Glowing, luminescent effect
- **Mouse Tracking**: Real-time rotation based on cursor
- **Smooth Animation**: Multi-axis floating and pulsing motion
- **Performance Scaling**: Adaptive DPR for different displays

---

## Browser Support

- Chrome/Edge: 90+
- Firefox: 88+
- Safari: 14+
- Mobile: iOS 14+, Android 10+

Requires WebGL 2.0 support

---

## Integration Checklist

- [ ] Component is wrapped in `dynamic` with `ssr: false`
- [ ] Running in a `'use client'` component
- [ ] Dependencies installed: `three`, `@react-three/fiber`
- [ ] Container has defined height (h-full, min-h-[value])
- [ ] No conflicting hover/pointer events
- [ ] Performance tested on target devices

---

## Troubleshooting

### Component doesn't render
- Ensure parent component has `'use client'` directive
- Check that container has proper height constraints
- Verify Three.js is installed: `npm list three`

### Janky animation
- Reduce particle count in generation functions
- Use simpler geometry type (cube vs icosahedron)
- Check browser performance monitor (DevTools)

### Colors not appearing
- Verify color scheme name is correct
- Check shader code for color math errors
- Ensure colors are in 0-1 range (not 0-255)

### Mouse interaction not working
- Verify cursor is over the 3D canvas
- Check pointer event listeners are attached
- Ensure component is not covered by z-index issues

---

## Next Steps

1. **Choose a geometry** that matches your brand
2. **Select a color scheme** that represents your style
3. **Integrate into hero section** with content overlay
4. **Test on different devices** for performance
5. **Customize particles/animation** to taste
6. **Lock in favorite combinations** for consistency

The 3D visuals are meant to be eye-catching focal points that demonstrate technical depth and creative thinking—use them to make a strong first impression!
