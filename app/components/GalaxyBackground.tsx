'use client';

import { useEffect, useRef } from 'react';

export default function GalaxyBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Configurar tamaño del canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Crear estrellas
    const stars: Array<{
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
      opacity: number;
      fadeDirection: number;
    }> = [];

    const starCount = 200;
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        opacity: Math.random(),
        fadeDirection: Math.random() > 0.5 ? 1 : -1,
      });
    }

    // Crear nebulosas (círculos de gradiente)
    const nebulas: Array<{
      x: number;
      y: number;
      radius: number;
      color: string;
      vx: number;
      vy: number;
    }> = [];

    const nebulaCount = 5;
    const colors = [
      'rgba(138, 43, 226, 0.15)', // Púrpura
      'rgba(75, 0, 130, 0.15)',   // Índigo
      'rgba(72, 61, 139, 0.15)',  // Azul oscuro
      'rgba(147, 51, 234, 0.15)', // Violeta
      'rgba(59, 130, 246, 0.15)', // Azul
    ];

    for (let i = 0; i < nebulaCount; i++) {
      nebulas.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 200 + 100,
        color: colors[i % colors.length],
        vx: (Math.random() - 0.5) * 0.1,
        vy: (Math.random() - 0.5) * 0.1,
      });
    }

    // Animación
    let animationFrameId: number;
    const animate = () => {
      // Fondo oscuro con transparencia para efecto de cola
      ctx.fillStyle = 'rgba(10, 10, 30, 1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Dibujar nebulosas
      nebulas.forEach((nebula) => {
        const gradient = ctx.createRadialGradient(
          nebula.x,
          nebula.y,
          0,
          nebula.x,
          nebula.y,
          nebula.radius
        );
        gradient.addColorStop(0, nebula.color);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = gradient;
        ctx.fillRect(
          nebula.x - nebula.radius,
          nebula.y - nebula.radius,
          nebula.radius * 2,
          nebula.radius * 2
        );

        // Mover nebulosas
        nebula.x += nebula.vx;
        nebula.y += nebula.vy;

        // Rebotar en los bordes
        if (nebula.x < -nebula.radius || nebula.x > canvas.width + nebula.radius) {
          nebula.vx *= -1;
        }
        if (nebula.y < -nebula.radius || nebula.y > canvas.height + nebula.radius) {
          nebula.vy *= -1;
        }
      });

      // Dibujar estrellas
      stars.forEach((star) => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();

        // Mover estrellas
        star.x += star.vx;
        star.y += star.vy;

        // Efecto de parpadeo
        star.opacity += star.fadeDirection * 0.01;
        if (star.opacity <= 0.1 || star.opacity >= 1) {
          star.fadeDirection *= -1;
        }

        // Rebotar en los bordes
        if (star.x < 0 || star.x > canvas.width) {
          star.vx *= -1;
        }
        if (star.y < 0 || star.y > canvas.height) {
          star.vy *= -1;
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10"
      style={{ background: 'linear-gradient(to bottom, #0a0a1e, #1a0a2e, #0a0a1e)' }}
    />
  );
}
