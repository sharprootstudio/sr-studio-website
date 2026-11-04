import React from 'react';
import { ArrowRight, Code, PenTool, Cpu, Mail, Sparkles } from 'lucide-react';
import { Button } from '../common/Button';

export const Hero: React.FC = () => {
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
      title: 'AI Automation & Agents',
      tagline: 'Work Smarter. Not Harder.',
      action: () => scrollTo('#services'),
    },
  ];

  return (
    <section
      id="home"
      className="relative min-h-screen pt-28 pb-12 sm:pt-36 sm:pb-16 lg:pt-36 lg:pb-16 flex flex-col justify-between overflow-hidden bg-[#0C0D10]"
    >
      {/* =========================================================================
          HERO BACKGROUND: Full-Bleed 3D Metallic Ribbon Visual Artwork
          Directly matching the reference art direction (media_1793788982318_8452ac44)
          ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
        {/* 3D Ribbon Image positioned seamlessly on the right half */}
        <img
          src="/hero-ribbon.jpg"
          alt="SR Studio 3D Dynamic Ribbon Artwork"
          className="absolute right-0 top-0 sm:top-1/2 sm:-translate-y-1/2 w-full lg:w-[62%] xl:w-[58%] 2xl:w-[52%] h-full object-cover object-[75%_center] lg:object-right opacity-50 sm:opacity-85 lg:opacity-100 transition-opacity duration-700"
          loading="eager"
        />

        {/* Left Dark Vignette: Ensures 100% text contrast & pure dark canvas on the left */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0C0D10] via-[#0C0D10]/95 sm:via-[#0C0D10]/80 md:via-[#0C0D10]/60 to-transparent w-full lg:w-[60%]" />

        {/* Top Vignette: Seamless blend under the floating navbar */}
        <div className="absolute top-0 left-0 right-0 h-28 sm:h-36 bg-gradient-to-b from-[#0C0D10] via-[#0C0D10]/80 to-transparent" />

        {/* Bottom Vignette: Blends into the bottom pillars strip */}
        <div className="absolute bottom-0 left-0 right-0 h-32 sm:h-44 bg-gradient-to-t from-[#0C0D10] via-[#0C0D10]/90 to-transparent" />

        {/* Ambient Warm Orange Atmospheric Glow */}
        <div
          className="absolute top-1/4 right-1/4 w-[400px] lg:w-[650px] h-[400px] lg:h-[650px] bg-radial from-[#F07835]/20 via-[#F07835]/5 to-transparent blur-3xl rounded-full"
          aria-hidden="true"
        />
      </div>

      {/* Main Hero Foreground Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 my-auto">
        
        {/* Hero Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2 sm:pt-6 mb-12 sm:mb-16">
          
          {/* Left Hero Column: Typography & CTAs */}
          <div className="lg:col-span-7 xl:col-span-7 flex flex-col items-start text-left">
            
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#17191C]/90 border border-[#F07835]/40 mb-6 shadow-sm backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#F07835] animate-pulse" />
              <span className="text-[11px] font-semibold uppercase tracking-widest text-[#FFAD76]">
                TURNING VISION INTO VALUE
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-7xl xl:text-8xl font-display font-extrabold tracking-tight text-[#F5F1EB] leading-[1.06] mb-6">
              Turning Vision. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F07835] via-[#FF8C42] to-[#FFAD76]">
                Into Value.
              </span>
            </h1>

            {/* Supporting Paragraph */}
            <p className="text-base sm:text-xl text-[#A5A5A5] leading-relaxed max-w-xl mb-8 font-normal">
              We transform ideas into meaningful digital experiences through creative design, smart technology, and innovative digital solutions.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-8">
              <Button
                variant="primary"
                size="lg"
                icon={<ArrowRight size={18} />}
                onClick={() => scrollTo('#work')}
                className="w-full sm:w-auto text-base font-semibold shadow-[0_4px_25px_rgba(240,120,53,0.45)] hover:shadow-[0_6px_35px_rgba(240,120,53,0.65)]"
              >
                Explore Our Work
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => scrollTo('#contact')}
                className="w-full sm:w-auto text-base bg-[#17191C]/80 border-white/10 hover:border-white/25 hover:bg-[#24272B]"
              >
                Let's Build Something
              </Button>
            </div>

            {/* Direct Email Link Pill */}
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm text-[#A5A5A5] bg-[#121316]/90 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-lg">
              <Mail size={15} className="text-[#F07835]" />
              <span>Direct Inquiries:</span>
              <a
                href="mailto:sharprootstudio@gmail.com"
                className="font-semibold text-[#F5F1EB] hover:text-[#F07835] transition-colors underline decoration-[#F07835]/40 underline-offset-4"
              >
                sharprootstudio@gmail.com
              </a>
            </div>

          </div>

          {/* Right Hero Column: Clear space letting the 3D Ribbon background breathe on desktop */}
          <div className="hidden lg:flex lg:col-span-5 xl:col-span-5 items-center justify-end relative pointer-events-none min-h-[380px]">
            {/* Ambient indicator badge floating gently on desktop */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#121316]/80 backdrop-blur-md border border-white/10 shadow-2xl self-end mb-4">
              <span className="w-2 h-2 rounded-full bg-[#F07835] animate-ping" />
              <span className="text-[11px] font-semibold tracking-wider text-[#F5F1EB] uppercase">
                SR STUDIO • 3D Creative Engineering
              </span>
            </div>
          </div>

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
