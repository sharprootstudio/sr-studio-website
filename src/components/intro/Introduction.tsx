import React from 'react';
import { Layers, Lightbulb, Rocket, ShieldCheck } from 'lucide-react';
import { Badge } from '../common/Badge';

export const Introduction: React.FC = () => {
  return (
    <section id="about" className="relative py-24 sm:py-32 bg-[#0C0D10] overflow-hidden border-t border-white/5">
      {/* Background oversized decorative watermark typography */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[120px] sm:text-[180px] lg:text-[240px] font-display font-black text-white/[0.015] select-none pointer-events-none tracking-tighter whitespace-nowrap"
        aria-hidden="true"
      >
        SR STUDIO
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Header */}
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-16 sm:mb-20">
          <Badge variant="orange" size="sm" className="mb-4">
            Our Philosophy
          </Badge>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-extrabold text-[#F5F1EB] tracking-tight leading-[1.15] mb-8">
            More Than Just a <br />
            <span className="text-orange-gradient">Digital Agency.</span>
          </h2>
          <p className="text-lg sm:text-2xl text-[#F5F1EB]/90 leading-relaxed font-light">
            “At SR Studio, we believe every great idea deserves a powerful digital presence. We combine creativity, technology, and strategic thinking to help businesses build, grow, and stand out in the digital world.”
          </p>
        </div>

        {/* 3-Column Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          
          {/* Card 1 */}
          <div className="bg-[#24272B]/60 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:border-[#F07835]/40 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
            <div className="w-12 h-12 rounded-xl bg-[#F07835]/15 border border-[#F07835]/30 flex items-center justify-center text-[#F07835] mb-6 group-hover:scale-110 transition-transform">
              <Lightbulb size={24} />
            </div>
            <h3 className="text-xl font-display font-bold text-[#F5F1EB] mb-3">
              Vision Into Execution
            </h3>
            <p className="text-[#A5A5A5] text-sm leading-relaxed">
              We don't deal in vague concepts or uninspired templates. We translate abstract business visions into tangible, measurable digital experiences that engage customers.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-[#24272B]/60 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:border-[#F07835]/40 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
            <div className="w-12 h-12 rounded-xl bg-[#F07835]/15 border border-[#F07835]/30 flex items-center justify-center text-[#F07835] mb-6 group-hover:scale-110 transition-transform">
              <Layers size={24} />
            </div>
            <h3 className="text-xl font-display font-bold text-[#F5F1EB] mb-3">
              Creative & Tech Fusion
            </h3>
            <p className="text-[#A5A5A5] text-sm leading-relaxed">
              Modern engineering is only as strong as the design behind it. We build systems that unify high-end visual elegance with resilient, secure, and modern architectures.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-[#24272B]/60 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:border-[#F07835]/40 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
            <div className="w-12 h-12 rounded-xl bg-[#F07835]/15 border border-[#F07835]/30 flex items-center justify-center text-[#F07835] mb-6 group-hover:scale-110 transition-transform">
              <Rocket size={24} />
            </div>
            <h3 className="text-xl font-display font-bold text-[#F5F1EB] mb-3">
              Long-Term Value
            </h3>
            <p className="text-[#A5A5A5] text-sm leading-relaxed">
              True digital value compounds over time. From organic search presence to autonomous voice AI support, we build infrastructure that scales alongside your ambitions.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};

