import React from 'react';
import { Layers, Lightbulb, Rocket, ShieldCheck } from 'lucide-react';
import { Badge } from '../common/Badge';

export const Introduction: React.FC = () => {
  return (
    <section id="about" className="relative py-28 sm:py-36 bg-[#0C0D10] overflow-hidden border-t border-white/[0.08]">
      {/* Background Agent Valley Grid & Center Light Glow */}
      <div className="absolute inset-0 bg-agent-grid pointer-events-none opacity-60" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#F07835]/06 rounded-full blur-[140px] pointer-events-none" />

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
          <p className="text-base sm:text-lg text-[#F5F1EB]/85 leading-relaxed font-light max-w-3xl">
            At SR Studio, we bring creativity, technology, and AI together to turn ideas into meaningful digital solutions. Our focus is on creating experiences that are practical, thoughtful, and built around real business needs.
          </p>
        </div>

        {/* 3-Column Editorial Grid: Agent Valley Inspired Modular Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          
          {/* Card 1 */}
          <div className="premium-card rounded-2xl sm:rounded-3xl p-8 relative overflow-hidden group flex flex-col justify-between">
            <div className="absolute top-0 inset-x-6 h-[1px] bg-gradient-to-r from-transparent via-[#F07835]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#17191C] border border-white/10 flex items-center justify-center text-[#F07835] group-hover:scale-105 group-hover:border-[#F07835]/50 group-hover:shadow-[0_0_20px_rgba(240,120,53,0.3)] transition-all duration-300">
                  <Lightbulb size={24} />
                </div>
                <span className="text-[11px] font-mono text-[#FFAD76] uppercase tracking-wider">
                  PILLAR 01
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-display font-bold text-[#F5F1EB] group-hover:text-white transition-colors mb-3">
                Practical Thinking
              </h3>
              <p className="text-[#A5A5A5] text-xs sm:text-sm leading-relaxed font-normal">
                We design and engineer digital solutions grounded in real operational objectives, eliminating unnecessary complexity while maximizing user clarity.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-[#737373] font-mono">
              <span>FOUNDATION</span>
              <span className="text-[#F07835]">•</span>
              <span>UTILITY-FIRST</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="premium-card rounded-2xl sm:rounded-3xl p-8 relative overflow-hidden group flex flex-col justify-between">
            <div className="absolute top-0 inset-x-6 h-[1px] bg-gradient-to-r from-transparent via-[#F07835]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#17191C] border border-white/10 flex items-center justify-center text-[#F07835] group-hover:scale-105 group-hover:border-[#F07835]/50 group-hover:shadow-[0_0_20px_rgba(240,120,53,0.3)] transition-all duration-300">
                  <Layers size={24} />
                </div>
                <span className="text-[11px] font-mono text-[#FFAD76] uppercase tracking-wider">
                  PILLAR 02
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-display font-bold text-[#F5F1EB] group-hover:text-white transition-colors mb-3">
                Design & Tech Fusion
              </h3>
              <p className="text-[#A5A5A5] text-xs sm:text-sm leading-relaxed font-normal">
                Modern technology is only as impactful as the design behind it. We combine refined aesthetics with clean, high-performance web engineering.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-[#737373] font-mono">
              <span>ENGINEERING</span>
              <span className="text-[#F07835]">•</span>
              <span>HIGH AESTHETICS</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="premium-card rounded-2xl sm:rounded-3xl p-8 relative overflow-hidden group flex flex-col justify-between">
            <div className="absolute top-0 inset-x-6 h-[1px] bg-gradient-to-r from-transparent via-[#F07835]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#17191C] border border-white/10 flex items-center justify-center text-[#F07835] group-hover:scale-105 group-hover:border-[#F07835]/50 group-hover:shadow-[0_0_20px_rgba(240,120,53,0.3)] transition-all duration-300">
                  <Rocket size={24} />
                </div>
                <span className="text-[11px] font-mono text-[#FFAD76] uppercase tracking-wider">
                  PILLAR 03
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-display font-bold text-[#F5F1EB] group-hover:text-white transition-colors mb-3">
                Sustainable Growth
              </h3>
              <p className="text-[#A5A5A5] text-xs sm:text-sm leading-relaxed font-normal">
                True digital presence builds long-term value. We deliver reliable architectures, automated workflows, and digital flagships built to last.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-[#737373] font-mono">
              <span>LONGEVITY</span>
              <span className="text-[#F07835]">•</span>
              <span>SCALABLE ARCHITECTURE</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

