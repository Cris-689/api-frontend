'use client';

import { useEffect, useState, useMemo } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadFull } from "tsparticles";

export default function BadAppleBackground() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadFull(engine);
    })
      .then(() => setIsReady(true))
      .catch((err) => console.error("[PARTICLES_ERROR]", err));
  }, []);

  const options = useMemo(() => ({
    fullScreen: { enable: true, zIndex: -1 },
    background: { color: { value: "transparent" } },
    particles: {
      number: { value: 30 },
      color: { value: "#ffffff" },
      shape: {
        type: ["image", "circle"], 
        options: {
          image: {
            src: "/apple-white.svg",
            width: 32,
            height: 32,
          },
        },
      },
      opacity: { value: { min: 0.3, max: 0.8 } },
      size: { value: { min: 10, max: 20 } },
      move: {
        enable: true,
        direction: "bottom" as const,
        speed: { min: 1, max: 3 },
        outModes: { default: "out" as const },
      },
    },
    detectRetina: true,
  }), []);

  if (!isReady) return null;

  return <Particles id="bad-apple-particles" options={options} />;
}