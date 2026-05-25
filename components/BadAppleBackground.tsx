// components/BadAppleBackground.tsx
'use client';

import { useEffect, useRef } from 'react';

export default function BadAppleBackground() {
  // Referencia directa al nodo del DOM para evitar problemas de SSR en Next.js
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Manejo dinámico del tamaño de la pantalla
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // 2. Pre-carga del recurso SVG
    const appleImg = new Image();
    appleImg.src = '/apple-white.svg';

    let particlesArray: Particle[] = [];
    const numberOfParticles = 30000;

    // 3. Entidad de Partícula tipada
    class Particle {
      x: number;
      y: number;
      size: number;
      speedY: number;
      opacity: number;
      rotation: number;
      rotationSpeed: number;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.size = Math.random() * 15 + 15; // Tamaño entre 15 y 30px
        this.speedY = Math.random() * 1.4 + 1; // Velocidad de caída
        this.opacity = Math.random() * 0.5 + 0.3; // Transparencia
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5) * 2; // Giro aleatorio
      }

      update() {
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;
        
        // Si la manzana cae por debajo de la pantalla, reaparece arriba
        if (this.y > canvas!.height + this.size) {
          this.y = 0 - this.size;
          this.x = Math.random() * canvas!.width;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.globalAlpha = this.opacity;
        // Movemos el eje central para que rote sobre sí misma
        ctx.translate(this.x + this.size / 2, this.y + this.size / 2);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.drawImage(appleImg, -this.size / 2, -this.size / 2, this.size, this.size);
        ctx.restore();
      }
    }

    const init = () => {
      particlesArray = [];
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
      }
    };

    let animationFrameId: number;
    
    // 4. Bucle de renderizado a 60 FPS nativo
    const animate = () => {
      ctx!.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };

    // Solo iniciamos cuando el SVG esté en memoria
    appleImg.onload = () => {
      init();
      animate();
    };

    // 5. Cleanup de rigor para desmontajes de React (KISS + DRY)
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
    />
  );
}