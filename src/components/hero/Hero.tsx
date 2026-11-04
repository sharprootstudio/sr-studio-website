import React, { useEffect, useRef } from 'react';
import { ArrowRight, Code, PenTool, Cpu } from 'lucide-react';
import { Button } from '../common/Button';

export const Hero: React.FC = () => {
  const heroRef = useRef<HTMLElement>(null);

  // High-performance 60fps GPU mouse parallax without React re-renders
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || !window.matchMedia('(pointer: fine)').matches) return;

    let rafId: number;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const onMouseMove = (e: MouseEvent) => {
      const rect = hero.getBoundingClientRect();
      targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    const updateParallax = () => {
      // Smooth lerp damping
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;
      hero.style.setProperty('--mouse-x', currentX.toFixed(4));
      hero.style.setProperty('--mouse-y', currentY.toFixed(4));
      rafId = requestAnimationFrame(updateParallax);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    rafId = requestAnimationFrame(updateParallax);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const scrollTo = (selector: string) => {
    const el = document.querySelector(selector);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const pillars = [
    {
      icon: <Code size={22} className="text-[#F07835]" />,
      title: 'Web Development',
      tagline: 'Build Faster. Grow Bigger.',
      action: () => scrollTo('#services'),
    },
    {
      icon: <PenTool size={22} className="text-[#F07835]" />,
      title: 'Branding & Design',
      tagline: 'Design Beyond Limits.',
      action: () => scrollTo('#services'),
    },
    {
      icon: <Cpu size={22} className="text-[#F07835]" />,
      title: 'AI Automation',
      tagline: 'Work Smarter. Not Harder.',
      action: () => scrollTo('#services'),
    },
  ];

  return (
    <section
      ref={heroRef}
      id="home"
      className="relative min-h-[100svh] min-h-screen pt-20 pb-8 sm:pt-24 sm:pb-10 lg:pt-24 lg:pb-10 flex flex-col justify-between overflow-hidden bg-[#0C0D10]"
    >
      {/* =========================================================================
          HERO BACKGROUND: Full-Bleed Animated 3D Metallic Ribbon Visual Artwork
          Spanning 100% full viewport width and 100% height (100svh minimum)
          Features multi-layered cinematic animations:
          1. 3D ribbon slow organic drift & scale
          2. Gentle orange specular light sweep reflections
          3. Pulsing volumetric orange atmospheric glow
          4. 3D depth floating spheres with realistic radial shading
          5. Subtle interactive mouse-parallax
          ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0 w-full h-full">
        
        {/* Layer 1: Ribbon Image with subtle parallax and continuous organic drift */}
        <div
          className="absolute inset-0 w-full h-full transition-transform duration-300 ease-out"
          style={{
            transform: 'translate3d(calc(var(--mouse-x, 0) * -12px), calc(var(--mouse-y, 0) * -8px), 0)',
          }}
        >
          <div className="w-full h-full animate-ribbon-drift">
            <img
              src="/hero-ribbon.jpg"
              alt="SR Studio 3D Dynamic Metallic Ribbon Artwork"
              className="w-full h-full object-cover object-[84%_center] sm:object-[76%_center] lg:object-[68%_center] xl:object-[64%_center] scale-105"
              loading="eager"
              fetchPriority="high"
            />
          </div>
        </div>

        {/* Layer 2: Gentle Specular Orange Light Sweep Across the Ribbon */}
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden z-[2]"
          style={{
            transform: 'translate3d(calc(var(--mouse-x, 0) * 8px), calc(var(--mouse-y, 0) * 6px), 0)',
          }}
        >
          <div
            className="absolute -inset-[100%] animate-light-sweep opacity-35 mix-blend-screen pointer-events-none"
            style={{
              background:
                'linear-gradient(115deg, transparent 40%, rgba(240,120,53,0.08) 46%, rgba(255,173,118,0.45) 50%, rgba(240,120,53,0.15) 54%, transparent 60%)',
            }}
          />
        </div>

        {/* Layer 3: Pulsing Ambient Warm Orange Atmospheric Glow */}
        <div
          className="absolute top-1/4 right-1/4 w-[380px] lg:w-[620px] h-[380px] lg:h-[620px] rounded-full pointer-events-none z-[1]"
          style={{
            transform: 'translate3d(calc(var(--mouse-x, 0) * -16px), calc(var(--mouse-y, 0) * -12px), 0)',
          }}
        >
          <div
            className="w-full h-full rounded-full animate-glow-pulse blur-3xl"
            style={{
              background: 'radial-gradient(circle, rgba(240,120,53,0.22) 0%, rgba(240,120,53,0.05) 50%, transparent 75%)',
            }}
            aria-hidden="true"
          />
        </div>

        {/* Layer 4: Floating 3D Spheres with depth parallax & specular rim lights */}
        {/* Sphere 1: Matte dark graphite sphere with orange rim light */}
        <div
          className="absolute top-[20%] right-[22%] sm:right-[26%] w-10 h-10 sm:w-14 sm:h-14 rounded-full pointer-events-none z-[3]"
          style={{
            transform: 'translate3d(calc(var(--mouse-x, 0) * 22px), calc(var(--mouse-y, 0) * 18px), 0)',
          }}
        >
          <div
            className="w-full h-full rounded-full animate-sphere-1 shadow-[0_15px_35px_rgba(0,0,0,0.85),inset_-3px_-3px_8px_rgba(240,120,53,0.7),inset_3px_3px_6px_rgba(255,255,255,0.25)]"
            style={{
              background: 'radial-gradient(circle at 35% 35%, #2A2D33 0%, #151618 60%, #0C0D10 100%)',
            }}
          />
        </div>

        {/* Sphere 2: Luminous warm amber floating accent orb */}
        <div
          className="absolute bottom-[32%] right-[10%] sm:right-[15%] w-6 h-6 sm:w-8 sm:h-8 rounded-full pointer-events-none z-[3]"
          style={{
            transform: 'translate3d(calc(var(--mouse-x, 0) * -18px), calc(var(--mouse-y, 0) * -14px), 0)',
          }}
        >
          <div
            className="w-full h-full rounded-full animate-sphere-2 shadow-[0_0_25px_rgba(240,120,53,0.75),inset_-2px_-2px_6px_rgba(212,91,24,0.9),inset_2px_2px_4px_rgba(255,255,255,0.7)]"
            style={{
              background: 'radial-gradient(circle at 35% 30%, #FFB684 0%, #F07835 55%, #A33A0B 100%)',
            }}
          />
        </div>

        {/* Subtle Dark Gradient Overlay: Ensures 100% typography contrast on the left */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0C0D10]/95 via-[#0C0D10]/80 sm:via-[#0C0D10]/60 to-transparent w-full md:w-[70%] lg:w-[55%] z-[4]" />

        {/* Top Vignette: Seamless blend under the floating navbar */}
        <div className="absolute top-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-b from-[#0C0D10]/90 via-[#0C0D10]/40 to-transparent z-[4]" />

        {/* Bottom Vignette: Blends into the bottom pillars strip */}
        <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-36 bg-gradient-to-t from-[#0C0D10] via-[#0C0D10]/70 to-transparent z-[4]" />
      </div>

      {/* Main Hero Foreground Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 mt-2 sm:mt-4 lg:mt-6 mb-auto sm:my-auto">
        
        {/* Hero Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-1 sm:pt-4 mb-8 sm:mb-12">
          
          {/* Left Hero Column: Typography & CTAs */}
          <div className="lg:col-span-7 xl:col-span-7 flex flex-col items-start text-left">
            
            {/* Introductory Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#17191C]/90 border border-[#F07835]/40 mb-4 sm:mb-5 shadow-sm backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#F07835] animate-pulse" />
              <span className="text-[11px] font-semibold uppercase tracking-widest text-[#FFAD76]">
                CREATIVE DIGITAL AGENCY
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-7xl xl:text-8xl font-display font-extrabold tracking-tight text-[#F5F1EB] leading-[1.05] mb-5 sm:mb-6">
              Turning Vision <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F07835] via-[#FF8C42] to-[#FFAD76]">
                Into Value.
              </span>
            </h1>

            {/* Supporting Description */}
            <p className="text-base sm:text-xl text-[#A5A5A5] leading-relaxed max-w-xl mb-7 sm:mb-8 font-normal">
              We combine creativity, technology, and AI to build digital experiences that help businesses grow.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
              <Button
                variant="primary"
                size="lg"
                icon={<ArrowRight size={18} />}
                onClick={() => scrollTo('#contact')}
                className="w-full sm:w-auto text-base font-semibold shadow-[0_4px_25px_rgba(240,120,53,0.45)] hover:shadow-[0_6px_35px_rgba(240,120,53,0.65)]"
              >
                Let's Build Something
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => scrollTo('#work')}
                className="w-full sm:w-auto text-base bg-[#17191C]/80 border-white/10 hover:border-white/25 hover:bg-[#24272B]"
              >
                Explore Our Work
              </Button>
            </div>

          </div>

          {/* Right Hero Column: Clear space letting the full-bleed 3D Animated Artwork shine */}
          <div className="hidden lg:flex lg:col-span-5 xl:col-span-5 items-center justify-end relative pointer-events-none min-h-[300px]" />

        </div>

        {/* =========================================================================
            BOTTOM FEATURE PILLARS: Matching reference layout precisely
            3 columns with orange icons, bold titles, taglines, and vertical dividers
            ========================================================================= */}
        <div className="w-full pt-6 sm:pt-8 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-4 md:divide-x md:divide-white/10 bg-[#121316]/60 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/5 shadow-2xl">
          {pillars.map((item, idx) => (
            <div
              key={item.title}
              onClick={item.action}
              className={`flex items-center gap-4 group cursor-pointer transition-all duration-300 hover:-translate-y-0.5 ${
                idx > 0 ? 'md:pl-6 lg:pl-8' : ''
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-[#17191C] border border-white/10 group-hover:border-[#F07835]/60 flex items-center justify-center flex-shrink-0 shadow-md transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(240,120,53,0.3)]">
                {item.icon}
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-display font-bold text-[#F5F1EB] group-hover:text-[#F07835] transition-colors leading-tight">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#A5A5A5] mt-0.5 font-normal">
                  {item.tagline}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
