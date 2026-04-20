import type { Metadata } from "next";

import ParticleSphereDemo from "@/components/motion/particle-sphere-demo";

export const metadata: Metadata = {
  title: "3D Particle Sphere Demo",
  description:
    "An interactive 3D particle sphere demo built with React Three Fiber.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ParticleSpherePage() {
  return <ParticleSphereDemo />;
}
