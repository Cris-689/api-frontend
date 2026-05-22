'use client';

import { useEffect, useState, useMemo } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadFull } from "tsparticles";
import type { Engine, ISourceOptions } from "@tsparticles/engine"; // Tipado estricto añadido

let engineInitialized = false;

export default function BadAppleBackground() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    if (engineInitialized) {
      setInit(true);
      return;
    }

    initParticlesEngine(async (engine: Engine) => {
      await loadFull(engine);
    }).then(() => {
      engineInitialized = true;
      setInit(true);
    });
  }, []);

  const particlesOptions: ISourceOptions = useMemo(() => ({
    fullScreen: { enable: false },
    background: { color: { value: "transparent" } }, // Normalizado al type estándar
    particles: {
      number: { value: 40 },
      color: { value: "#ffffff" },
      shape: {
        type: ["image", "circle"],
        options: {
          image: {
            src: "/apple-white.svg",
            width: 24,
            height: 24,
          },
        },
      },
      opacity: {
        value: { min: 0.5, max: 1 },
      },
      size: {
        value: { min: 15, max: 30 },
      },
      move: {
        enable: true,
        direction: "bottom",
        speed: { min: 2, max: 4 },
        straight: false,
        outModes: { default: "out" },
      },
      rotate: {
        value: { min: 0, max: 360 },
        direction: "random",
        animation: { enable: true, speed: 5 },
      },
    },
    detectRetina: true,
  }), []);

  if (!init) return null;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Particles
        id="tsparticles"
        className="w-full h-full absolute inset-0"
        options={particlesOptions}
      />
    </div>
  );
}