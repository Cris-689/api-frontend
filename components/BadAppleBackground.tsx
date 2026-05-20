'use client';

import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadFull } from "tsparticles";
import type { Engine } from "@tsparticles/engine";

export default function BadAppleBackground() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine: Engine) => {
      await loadFull(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  if (!init) return null;

  return (
    /* 🔥 EL FIX ARQUITECTÓNICO: Un contenedor fixed de Tailwind que fuerza la capa 0 */
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Particles
        id="tsparticles"
        className="w-full h-full absolute inset-0"
        options={{
          // Desactivamos el fullscreen automático que a veces falla en Next.js
          fullScreen: { enable: false }, 
          background: { color: "transparent" },
          particles: {
            number: { value: 40 },
            color: { value: "#ffffff" }, // Forzamos el color blanco
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
              // Subimos la opacidad casi al máximo para que sean innegablemente visibles
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
        }}
      />
    </div>
  );
}