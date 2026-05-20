'use client';

import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadFull } from "tsparticles";
import type { Engine } from "@tsparticles/engine";

export default function BadAppleBackground() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    // 🔥 FIX 2: Le decimos a TypeScript que 'engine' es exactamente de tipo 'Engine'
    initParticlesEngine(async (engine: Engine) => {
      await loadFull(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  if (!init) return null;

  return (
    <Particles
      id="tsparticles"
      options={{
        fullScreen: {
          enable: true,
          zIndex: -50, 
        },
        background: {
          color: "transparent",
        },
        particles: {
          number: {
            value: 40,
            density: {
              enable: true,
              width: 800,
            },
          },
          shape: {
            type: "image",
            // 🔥 FIX 3: En la v3, la configuración de la imagen va dentro de 'options'
            options: {
              image: {
                src: "/apple-white.svg",
                width: 24,
                height: 24,
              },
            },
          },
          opacity: {
            value: { min: 0.1, max: 0.5 },
          },
          size: {
            value: { min: 10, max: 25 },
          },
          move: {
            enable: true,
            direction: "bottom",
            speed: { min: 1, max: 3 },
            straight: false,
            outModes: {
              default: "out",
            },
          },
          rotate: {
            value: { min: 0, max: 360 },
            direction: "random",
            animation: {
              enable: true,
              speed: 5,
            },
          },
        },
        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: "bubble",
            },
            onClick: {
              enable: true,
              mode: "push",
            },
          },
          modes: {
            bubble: { distance: 200, size: 30, duration: 2, opacity: 0.8 },
            push: { quantity: 4 },
          },
        },
        detectRetina: true,
      }}
      className="pointer-events-none" 
    />
  );
}