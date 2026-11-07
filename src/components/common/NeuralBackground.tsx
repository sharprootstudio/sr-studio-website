import React, { useEffect, useRef } from 'react';

interface NeuralBackgroundProps {
  className?: string;
  particleCount?: number;
}

export const NeuralBackground: React.FC<NeuralBackgroundProps> = ({
  className = '',
  particleCount = 80,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    // Detect user's reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Mouse coordinates (gentle hover push)
    const mouse = {
      x: -1000,
      y: -1000,
      radius: 140,
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);

    // Setup High-DPI Canvas Sizing
    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.parentElement?.clientHeight || window.innerHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.resetTransform?.();
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 3D Particle Model with depth perception
    class Particle {
      x: number;
      y: number;
      z: number; // Simulated depth layer (0.4 to 1.0)
      vx: number;
      vy: number;
      baseRadius: number;
      isOrange: boolean;
      baseAlpha: number;
      pulsePhase: number;
      pulseSpeed: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.z = Math.random() * 0.6 + 0.4; // 0.4 (far) to 1.0 (near)
        // Gentle, slow drift proportional to depth
        const speed = prefersReducedMotion ? 0 : (0.15 + this.z * 0.15);
        this.vx = (Math.random() - 0.5) * speed;
        this.vy = (Math.random() - 0.5) * speed;
        this.baseRadius = (Math.random() * 1.2 + 0.8) * this.z;
        this.isOrange = Math.random() > 0.55;
        this.baseAlpha = (Math.random() * 0.35 + 0.25) * this.z;
        this.pulsePhase = Math.random() * Math.PI * 2;
        this.pulseSpeed = Math.random() * 0.015 + 0.008;
      }

      update() {
        if (prefersReducedMotion) return;

        this.x += this.vx;
        this.y += this.vy;

        // Wrap around boundaries smoothly
        if (this.x < -10) this.x = width + 10;
        else if (this.x > width + 10) this.x = -10;
        if (this.y < -10) this.y = height + 10;
        else if (this.y > height + 10) this.y = -10;

        // Subtle, restrained mouse deflection
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius && dist > 0) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 0.8;
          this.y -= (dy / dist) * force * 0.8;
        }

        this.pulsePhase += this.pulseSpeed;
      }

      draw() {
        if (!ctx) return;
        const currentAlpha = Math.max(
          0.15,
          Math.min(0.75, this.baseAlpha + Math.sin(this.pulsePhase) * 0.1)
        );

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.baseRadius, 0, Math.PI * 2);

        if (this.isOrange) {
          // Warm metallic orange node matching SR Studio brand
          ctx.fillStyle = `rgba(240, 120, 53, ${currentAlpha})`;
          ctx.shadowColor = '#F07835';
          ctx.shadowBlur = 6 * this.z;
        } else {
          // Muted warm graphite / champagne white node
          ctx.fillStyle = `rgba(245, 241, 235, ${currentAlpha * 0.65})`;
          ctx.shadowColor = '#F5F1EB';
          ctx.shadowBlur = 3 * this.z;
        }
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    // Responsive particle count based on screen area
    const isMobile = width < 768;
    const densityTarget = isMobile ? 42 : Math.min(particleCount, Math.floor((width * height) / 14000));
    const effectiveCount = Math.max(30, densityTarget);

    const particles: Particle[] = [];
    for (let i = 0; i < effectiveCount; i++) {
      particles.push(new Particle());
    }

    // Connect nearby particles with fine, dim lines
    const connect = () => {
      const maxDistance = isMobile ? 125 : 155;

      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            // Distance-based fade
            const proximityFactor = 1 - dist / maxDistance;
            // Depth modulation: only connect if in similar depth plane
            const depthFactor = (particles[a].z + particles[b].z) / 2;
            const opacity = proximityFactor * 0.20 * depthFactor;

            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);

            if (particles[a].isOrange || particles[b].isOrange) {
              ctx.strokeStyle = `rgba(240, 120, 53, ${opacity * 1.4})`;
            } else {
              ctx.strokeStyle = `rgba(230, 225, 220, ${opacity * 0.75})`;
            }
            ctx.lineWidth = 0.75 * depthFactor;
            ctx.stroke();
          }
        }

        // Faint interactive line to mouse cursor
        if (!prefersReducedMotion) {
          const mouseDx = mouse.x - particles[a].x;
          const mouseDy = mouse.y - particles[a].y;
          const mouseDist = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);
          if (mouseDist < mouse.radius && mouseDist > 0) {
            const mouseOpacity = (1 - mouseDist / mouse.radius) * 0.22;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(240, 120, 53, ${mouseOpacity})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }
    };

    // Main 60fps render loop
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      connect();

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [particleCount]);

  return (
    <div className={`w-full h-full relative overflow-hidden pointer-events-none select-none ${className}`}>
      {/* Near-black dark luxury backdrop */}
      <div className="absolute inset-0 bg-[#0C0D10] -z-20" />

      {/* Subtle radial warm orange ambient glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[1100px] h-[550px] bg-gradient-radial from-[#F07835]/08 via-[#F07835]/02 to-transparent blur-3xl rounded-full -z-10 pointer-events-none"
        aria-hidden="true"
      />

      {/* Fine technical coordinate grid overlay */}
      <div
        className="absolute inset-0 bg-agent-grid opacity-40 -z-10"
        aria-hidden="true"
      />

      {/* 3D Animated Constellation Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
      />
    </div>
  );
};
