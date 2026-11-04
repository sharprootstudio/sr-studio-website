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
            About SR Studio
          </Badge>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-extrabold text-[#F5F1EB] tracking-tight leading-[1.15] mb-6">
            Ideas Deserve <br />
            <span className="text-orange-gradient">Better Execution.</span>
          </h2>
          <p className="text-lg sm:text-xl text-[#F5F1EB]/90 leading-relaxed font-light max-w-3xl">
            At SR Studio, we bring creativity, technology, and AI together to turn ideas into meaningful digital solutions. Our focus is on creating experiences that are practical, thoughtful, and built around real business needs.
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
              Practical Thinking
            </h3>
            <p className="text-[#A5A5A5] text-sm leading-relaxed">
              We design and engineer digital solutions grounded in real operational objectives, eliminating unnecessary complexity while maximizing user clarity.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-[#24272B]/60 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:border-[#F07835]/40 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
            <div className="w-12 h-12 rounded-xl bg-[#F07835]/15 border border-[#F07835]/30 flex items-center justify-center text-[#F07835] mb-6 group-hover:scale-110 transition-transform">
              <Layers size={24} />
            </div>
            <h3 className="text-xl font-display font-bold text-[#F5F1EB] mb-3">
              Design & Tech Fusion
            </h3>
            <p className="text-[#A5A5A5] text-sm leading-relaxed">
              Modern technology is only as impactful as the design behind it. We combine refined aesthetics with clean, high-performance web engineering.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-[#24272B]/60 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:border-[#F07835]/40 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
            <div className="w-12 h-12 rounded-xl bg-[#F07835]/15 border border-[#F07835]/30 flex items-center justify-center text-[#F07835] mb-6 group-hover:scale-110 transition-transform">
              <Rocket size={24} />
            </div>
            <h3 className="text-xl font-display font-bold text-[#F5F1EB] mb-3">
              Sustainable Growth
            </h3>
            <p className="text-[#A5A5A5] text-sm leading-relaxed">
              True digital presence builds long-term value. We deliver reliable architectures, automated workflows, and digital flagships built to last.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};

