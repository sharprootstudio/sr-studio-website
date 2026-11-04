import React from 'react';
import { Palette, Cpu, Layers, Users, Sliders, CheckCircle2 } from 'lucide-react';
import { Badge } from '../common/Badge';

export const WhyUsSection: React.FC = () => {
  const strengths = [
    {
      icon: <Palette size={26} className="text-[#F07835]" />,
      title: 'Creative-First Approach',
      description: 'Every project begins with intentional art direction and distinctive visual identity tailored to your brand, deliberately avoiding cookie-cutter templates.',
      pill: 'Authentic Design'
    },
    {
      icon: <Cpu size={26} className="text-[#F07835]" />,
      title: 'Practical AI Integration',
      description: 'We focus on realistic, high-utility AI applications — automated data pipelines, smart task routing, and intelligent workflows that simplify daily operations.',
      pill: 'Useful Automation'
    },
    {
      icon: <Layers size={26} className="text-[#F07835]" />,
      title: 'Modern Technology',
      description: 'Engineered with modern frameworks (React, TypeScript, Tailwind CSS) for sub-second page loads, clean codebases, and maintainable architectures.',
      pill: 'Reliable Stacks'
    },
    {
      icon: <Users size={26} className="text-[#F07835]" />,
      title: 'User-Focused Design',
      description: 'Clear typographic hierarchy, intuitive responsive layouts, and frictionless conversion pathways built with user empathy and accessibility at the core.',
      pill: 'Ergonomic UX'
    },
    {
      icon: <Sliders size={26} className="text-[#F07835]" />,
      title: 'Tailored to Business Needs',
      description: 'No bloated features or forced packages. Every design decision and technical implementation is aligned directly with your actual commercial objectives.',
      pill: 'Bespoke Scope'
    }
  ];

  return (
    <section className="relative py-28 sm:py-36 bg-[#0C0D10] overflow-hidden border-t border-white/[0.08]">
      {/* Background Agent Valley Grid & Center Light Glow */}
      <div className="absolute inset-0 bg-agent-grid pointer-events-none opacity-60" />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[400px] bg-[#F07835]/06 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Header */}
        <div className="max-w-3xl mb-14 sm:mb-16">
          <Badge variant="orange" size="sm" className="mb-4">
            Why SR Studio
          </Badge>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-extrabold text-[#F5F1EB] tracking-tight leading-[1.15] mb-6">
            Creativity Meets <br />
            <span className="text-orange-gradient">Technology.</span>
          </h2>
          <p className="text-base sm:text-lg text-[#A5A5A5] leading-relaxed font-normal">
            We bridge the gap between creative visual artistry and dependable technology, delivering thoughtful digital solutions built around real business needs.
          </p>
        </div>

        {/* Agent Valley Inspired Architectural Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 rounded-2xl bg-[#141619]/90 border border-white/[0.08] backdrop-blur-md mb-12 sm:mb-16 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.08]">
          <div className="p-3 text-center">
            <div className="text-xs font-mono font-bold text-[#FFAD76] uppercase tracking-wider mb-1">
              Sub-Second Speed
            </div>
            <div className="text-xs text-[#A5A5A5]">
              Optimized Core Web Vitals
            </div>
          </div>
          <div className="p-3 text-center">
            <div className="text-xs font-mono font-bold text-[#FFAD76] uppercase tracking-wider mb-1">
              Modern Tech Stacks
            </div>
            <div className="text-xs text-[#A5A5A5]">
              React, TypeScript, Tailwind
            </div>
          </div>
          <div className="p-3 text-center">
            <div className="text-xs font-mono font-bold text-[#FFAD76] uppercase tracking-wider mb-1">
              Direct Partner Craft
            </div>
            <div className="text-xs text-[#A5A5A5]">
              No Account Manager Delays
            </div>
          </div>
          <div className="p-3 text-center">
            <div className="text-xs font-mono font-bold text-[#FFAD76] uppercase tracking-wider mb-1">
              Production Standard
            </div>
            <div className="text-xs text-[#A5A5A5]">
              Built for Scale & Longevity
            </div>
          </div>
        </div>

        {/* Strength Cards Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {strengths.map((item, idx) => {
            return (
              <div
                key={item.title}
                className="premium-card rounded-2xl sm:rounded-3xl p-8 sm:p-9 flex flex-col justify-between group relative overflow-hidden"
              >
                <div className="absolute top-0 inset-x-8 h-[1px] bg-gradient-to-r from-transparent via-[#F07835]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-13 h-13 rounded-2xl bg-[#17191C] border border-white/10 flex items-center justify-center group-hover:scale-105 group-hover:border-[#F07835]/50 group-hover:shadow-[0_0_20px_rgba(240,120,53,0.25)] transition-all duration-300 shadow-md">
                      {item.icon}
                    </div>
                    <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#FFAD76] bg-[#17191C] px-3 py-1 rounded-full border border-white/10">
                      {item.pill}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-display font-bold text-[#F5F1EB] mb-3 group-hover:text-white transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-[#A5A5A5] text-xs sm:text-sm leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between text-xs text-[#A5A5A5]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-[#F07835]" />
                    <span className="font-mono text-[11px] text-[#A5A5A5]">SR Studio Standard</span>
                  </div>
                  <span className="font-mono text-[11px] text-[#525252]">0{idx + 1}</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
