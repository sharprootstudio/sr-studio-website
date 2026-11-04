import React from 'react';
import { Compass, Cpu, Target, TrendingUp, ShieldCheck, Zap } from 'lucide-react';
import { Badge } from '../common/Badge';

export const WhyUsSection: React.FC = () => {
  const values = [
    {
      icon: <Compass size={28} className="text-[#F07835]" />,
      title: 'Creative Thinking',
      description: 'We avoid generic clichés. Every design decision, interaction, and visual element is custom-sculpted around your distinct market identity.',
      metric: '100% Bespoke',
      metricLabel: 'Never boilerplate'
    },
    {
      icon: <Cpu size={28} className="text-[#F07835]" />,
      title: 'Smart Technology',
      description: 'Built on high-performance modern stacks with sub-second speeds, automated LLM agents, and clean scalable architectures.',
      metric: '< 400ms',
      metricLabel: 'Voice AI Latency'
    },
    {
      icon: <Target size={28} className="text-[#F07835]" />,
      title: 'Purpose-Driven Design',
      description: 'Aesthetic elegance paired with behavioral psychology. We optimize user pathways so your visitors effortlessly convert into active clients.',
      metric: '99+',
      metricLabel: 'Core Web Vitals'
    },
    {
      icon: <TrendingUp size={28} className="text-[#F07835]" />,
      title: 'Growth-Focused Solutions',
      description: 'From organic search engine dominance to 24/7 autonomous client voice capture, we deliver systems engineered to compound business value.',
      metric: '24 / 7',
      metricLabel: 'Client Engagement'
    }
  ];

  return (
    <section className="relative py-24 sm:py-32 bg-[#0C0D10] overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Header */}
        <div className="max-w-3xl mb-16 sm:mb-20">
          <Badge variant="orange" size="sm" className="mb-4">
            The SR Studio Advantage
          </Badge>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-extrabold text-[#F5F1EB] tracking-tight leading-[1.15] mb-6">
            Creativity Meets <br />
            <span className="text-orange-gradient">Technology.</span>
          </h2>
          <p className="text-base sm:text-lg text-[#A5A5A5] leading-relaxed">
            Most agencies force you to choose between visual beauty and technical muscle. We unify both into a cohesive, high-performance digital engine.
          </p>
        </div>

        {/* Asymmetrical Value Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {values.map((val, idx) => (
            <div
              key={val.title}
              className="bg-[#24272B]/70 backdrop-blur-md border border-white/10 rounded-3xl p-8 sm:p-10 flex flex-col justify-between hover:border-[#F07835]/40 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 text-6xl font-display font-black text-white/[0.03] select-none pointer-events-none">
                0{idx + 1}
              </div>

              <div>
                <div className="w-14 h-14 rounded-2xl bg-[#17191C] border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-[#F07835]/40 transition-all duration-300 shadow-md">
                  {val.icon}
                </div>

                <h3 className="text-2xl font-display font-bold text-[#F5F1EB] mb-3 group-hover:text-white transition-colors">
                  {val.title}
                </h3>
                <p className="text-[#A5A5A5] text-sm sm:text-base leading-relaxed mb-8">
                  {val.description}
                </p>
              </div>

              <div className="pt-6 border-t border-white/10 flex items-baseline justify-between">
                <div>
                  <div className="text-2xl sm:text-3xl font-display font-extrabold text-[#F07835]">
                    {val.metric}
                  </div>
                  <div className="text-xs text-[#A5A5A5] uppercase tracking-wider mt-0.5">
                    {val.metricLabel}
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[#A5A5A5] group-hover:text-[#F07835] group-hover:bg-[#F07835]/10 transition-colors">
                  <Zap size={15} />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

