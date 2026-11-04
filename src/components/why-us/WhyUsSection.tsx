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
    <section className="relative py-24 sm:py-32 bg-[#0C0D10] overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Header */}
        <div className="max-w-3xl mb-16 sm:mb-20">
          <Badge variant="orange" size="sm" className="mb-4">
            Why SR Studio
          </Badge>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-extrabold text-[#F5F1EB] tracking-tight leading-[1.15] mb-6">
            Creativity Meets <br />
            <span className="text-orange-gradient">Technology.</span>
          </h2>
          <p className="text-base sm:text-lg text-[#A5A5A5] leading-relaxed">
            We bridge the gap between creative visual artistry and dependable technology, delivering thoughtful digital solutions built around real business needs.
          </p>
        </div>

        {/* Strength Cards Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {strengths.map((item, idx) => {
            const isWide = idx === 0 || idx === 1;
            return (
              <div
                key={item.title}
                className={`bg-[#24272B]/70 backdrop-blur-md border border-white/10 rounded-3xl p-8 sm:p-9 flex flex-col justify-between hover:border-[#F07835]/40 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group relative overflow-hidden ${
                  isWide ? 'lg:col-span-1' : ''
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-13 h-13 rounded-2xl bg-[#17191C] border border-white/10 flex items-center justify-center group-hover:scale-105 group-hover:border-[#F07835]/50 transition-all duration-300 shadow-md">
                      {item.icon}
                    </div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#FFAD76] bg-[#17191C]/80 px-3 py-1 rounded-full border border-white/5">
                      {item.pill}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-display font-bold text-[#F5F1EB] mb-3 group-hover:text-white transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-[#A5A5A5] text-sm sm:text-base leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-white/5 flex items-center gap-2 text-xs text-[#A5A5A5]">
                  <CheckCircle2 size={15} className="text-[#F07835]" />
                  <span>SR Studio Standard</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
