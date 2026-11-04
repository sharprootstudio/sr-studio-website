import React, { useEffect, useRef } from 'react';

interface NeuralBackgroundProps {
  className?: string;
  particleCount?: number;
}

export const NeuralBackground: React.FC<NeuralBackgroundProps> = ({
  className = '',
  particleCount = 75,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    // Mouse coordinates
    const mouse = {
      x: -1000,
      y: -1000,
      radius: 160,
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

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle class
    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      isOrange: boolean;
      alpha: number;
      pulseSpeed: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.45;
        this.vy = (Math.random() - 0.5) * 0.45;
        this.radius = Math.random() * 2.2 + 1.0;
        this.isOrange = Math.random() > 0.45;
        this.alpha = Math.random() * 0.5 + 0.3;
        this.pulseSpeed = Math.random() * 0.02 + 0.01;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Wrap around boundaries
        if (this.x < 0) this.x = width;
        else if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        else if (this.y > height) this.y = 0;

        // Mouse gentle interaction
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 1.5;
          this.y -= (dy / dist) * force * 1.5;
        }

        // Pulse alpha
        this.alpha += Math.sin(Date.now() * this.pulseSpeed * 0.05) * 0.005;
        this.alpha = Math.max(0.2, Math.min(0.85, this.alpha));
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        if (this.isOrange) {
          ctx.fillStyle = `rgba(240, 120, 53, ${this.alpha})`;
          ctx.shadowColor = '#F07835';
          ctx.shadowBlur = 8;
        } else {
          ctx.fillStyle = `rgba(245, 241, 235, ${this.alpha * 0.7})`;
          ctx.shadowColor = '#F5F1EB';
          ctx.shadowBlur = 4;
        }
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      }
    }

    // Initialize particles
    const effectiveCount = Math.min(particleCount, Math.floor((width * height) / 14000));
    const particles: Particle[] = [];
    for (let i = 0; i < effectiveCount; i++) {
      particles.push(new Particle());
    }

    // Connect particles with lines
    const connect = () => {
      const maxDistance = 140;
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const opacity = (1 - dist / maxDistance) * 0.16;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);

            // If either node is orange, draw subtle warm line
            if (particles[a].isOrange || particles[b].isOrange) {
              ctx.strokeStyle = `rgba(240, 120, 53, ${opacity * 1.2})`;
            } else {
              ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.6})`;
            }
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        // Connect to mouse
        const mouseDx = mouse.x - particles[a].x;
        const mouseDy = mouse.y - particles[a].y;
        const mouseDist = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);
        if (mouseDist < mouse.radius) {
          const mouseOpacity = (1 - mouseDist / mouse.radius) * 0.35;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(240, 120, 53, ${mouseOpacity})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    };

    // Render loop
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      connect();

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
    };
  }, [particleCount]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none select-none ${className}`}>
      {/* Subtle Dark Background Vignette */}
      <div className="absolute inset-0 bg-[#0C0D10] -z-20" />
      
      {/* Subtle Radial Orange Ambient Glow like AgentValley */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[1000px] h-[550px] bg-gradient-radial from-[#F07835]/12 via-[#F07835]/3 to-transparent blur-3xl rounded-full -z-10 pointer-events-none"
        aria-hidden="true"
      />

      {/* Subtle Tech Coordinate Grid Pattern */}
      <div
        className="absolute inset-0 bg-grid-pattern opacity-60 -z-10"
        aria-hidden="true"
      />

      {/* Interactive Neural Constellation Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
      />
    </div>
  );
};

