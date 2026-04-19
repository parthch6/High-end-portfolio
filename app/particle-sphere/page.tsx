'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamic imports to avoid SSR issues with Three.js
const ParticleSphere = dynamic(
  () => import('@/components/motion/particle-sphere'),
  { ssr: false, loading: () => <div className="w-full h-screen bg-black" /> }
);

const OptimizedParticleSphere = dynamic(
  () => import('@/components/motion/optimized-particle-sphere'),
  { ssr: false, loading: () => <div className="w-full h-screen bg-black" /> }
);

export default function ParticleSphereDemo() {
  const [version, setVersion] = useState<'standard' | 'optimized'>('optimized');

  return (
    <div className="w-full min-h-screen bg-black">
      {/* Control Panel */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent p-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-4">
            3D Particle Sphere
          </h1>
          <p className="text-gray-400 mb-6">
            Interactive particle network with mouse-following rotation and
            floating animation
          </p>

          {/* Version Selector */}
          <div className="flex gap-4">
            <button
              onClick={() => setVersion('standard')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                version === 'standard'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
                  : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
              }`}
            >
              Standard Version
            </button>
            <button
              onClick={() => setVersion('optimized')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                version === 'optimized'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50'
                  : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
              }`}
            >
              Optimized (Shader-based)
            </button>
          </div>
        </div>
      </div>

      {/* Scene */}
      <div className="w-full h-screen">
        {version === 'standard' ? (
          <ParticleSphere />
        ) : (
          <OptimizedParticleSphere />
        )}
      </div>

      {/* Info Panel */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6 pointer-events-none">
        <div className="max-w-2xl mx-auto text-gray-400 text-sm">
          <p className="mb-2">💡 {version === 'optimized' ? '⚡' : '✨'} Version: {version === 'optimized' ? 'GPU-optimized with shaders' : 'Standard Three.js Points'}</p>
          <p>🖱️ Move your mouse to rotate the particle sphere</p>
          <p>🌀 Particles float and connect to nearby particles</p>
        </div>
      </div>
    </div>
  );
}
