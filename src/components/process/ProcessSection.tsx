import React, { useState } from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { SectionHeading } from '../common/SectionHeading';
import { processSteps } from '../../data/process';

export const ProcessSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);

  return (
    <section id="process" className="relative py-28 sm:py-36 bg-[#0C0D10] overflow-hidden border-t border-white/[0.08]">
      {/* Background Agent Valley Grid & Subtle Ambient Glow */}
      <div className="absolute inset-0 bg-agent-grid pointer-events-none opacity-60" />
      <div className="absolute top-1/2 left-1/3 w-[600px] h-[400px] bg-[#F07835]/06 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <SectionHeading
          badge="How We Work"
          title="From First Idea to Final Experience."
          subtitle="A transparent, collaborative four-step journey transforming complex business requirements into elegant digital realities."
        />

        {/* Desktop Interactive Timeline Navigation (Agent Valley Inspired) */}
        <div className="hidden lg:block relative mb-12">
          {/* Horizontal Connection Track */}
          <div className="absolute top-1/2 left-8 right-8 -translate-y-1/2 h-[2px] bg-white/[0.08] z-0" />
          <div
            className="absolute top-1/2 left-8 -translate-y-1/2 h-[2px] timeline-glow-track z-0 transition-all duration-500"
            style={{ width: `${(activeStep / (processSteps.length - 1)) * 92}%` }}
          />

          <div className="grid grid-cols-4 gap-4 relative z-10">
            {processSteps.map((step, idx) => {
              const isActive = activeStep === idx;
              const isPast = activeStep > idx;

              return (
                <button
                  key={step.number}
                  onClick={() => setActiveStep(idx)}
                  className={`text-left p-6 rounded-2xl transition-all duration-300 cursor-pointer relative overflow-hidden ${
                    isActive
                      ? 'bg-[#1D2024] border border-[#F07835] shadow-[0_0_30px_rgba(240,120,53,0.2)] -translate-y-1.5'
                      : 'bg-[#141619]/90 border border-white/5 hover:border-white/20 opacity-80 hover:opacity-100'
                  }`}
                >
                  {/* Top Phase Tag & Dot */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold text-[#FFAD76] uppercase tracking-wider">
                      PHASE {step.number}
                    </span>
                    <span
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        isActive
                          ? 'bg-[#F07835] shadow-[0_0_12px_rgba(240,120,53,0.9)] scale-125'
                          : isPast
                          ? 'bg-[#F07835]/60'
                          : 'bg-white/20'
                      }`}
                    />
                  </div>

                  <div className="text-xl font-display font-bold text-[#F5F1EB] mb-1">
                    {step.title}
                  </div>
                  <div className="text-xs text-[#A5A5A5] line-clamp-1">
                    {step.subtitle}
                  </div>

                  {/* Active Indicator Bar */}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#F07835] via-[#FF8C42] to-[#FFAD76]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Step Detailed Showcase (Desktop) */}
        <div className="hidden lg:block premium-card rounded-3xl p-10 lg:p-12 mb-8 relative overflow-hidden">
          {/* Subtle Top Specular Glow */}
          <div className="absolute top-0 inset-x-12 h-[1px] bg-gradient-to-r from-transparent via-[#F07835]/50 to-transparent" />
          
          <div className="grid grid-cols-12 gap-10 items-center">
            
            {/* Left: Step Overview */}
            <div className="col-span-5 pr-6 border-r border-white/10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F07835]/10 border border-[#F07835]/25 text-xs font-mono text-[#FFAD76] mb-4">
                <span>PHASE {processSteps[activeStep].number}</span>
                <span>•</span>
                <span>STAGE {activeStep + 1} OF 4</span>
              </div>
              <h3 className="text-3xl sm:text-4xl font-display font-bold text-[#F5F1EB] mb-2">
                {processSteps[activeStep].title}
              </h3>
              <div className="text-xs font-semibold text-[#FFAD76] uppercase tracking-wider mb-4">
                {processSteps[activeStep].subtitle}
              </div>
              <p className="text-[#A5A5A5] text-sm leading-relaxed mb-6 font-normal">
                {processSteps[activeStep].description}
              </p>

              {/* Progress Step Jump Buttons */}
              <div className="flex items-center gap-2 pt-2">
                {processSteps.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveStep(i)}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      activeStep === i
                        ? 'w-8 bg-[#F07835] shadow-[0_0_10px_rgba(240,120,53,0.7)]'
                        : 'w-2 bg-white/20 hover:bg-white/40'
                    }`}
                    aria-label={`Jump to step ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Right: Key Deliverables & Methodologies */}
            <div className="col-span-7 pl-2">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#FFAD76] mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F07835]" />
                <span>Core Deliverables & Methodologies</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {processSteps[activeStep].keyActivities.map((act, i) => (
                  <div
                    key={i}
                    className="bg-[#17191C] border border-white/[0.08] hover:border-[#F07835]/40 rounded-xl p-4 flex items-start gap-3 transition-colors duration-200"
                  >
                    <CheckCircle2 size={18} className="text-[#F07835] flex-shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-[#F5F1EB]/90 leading-snug">
                      {act}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Mobile / Tablet Accordion / Stacked View */}
        <div className="lg:hidden space-y-4">
          {processSteps.map((step, idx) => (
            <div
              key={step.number}
              className="premium-card rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-[#FFAD76] uppercase tracking-wider">
                  PHASE {step.number}
                </span>
                <span className="w-2 h-2 rounded-full bg-[#F07835]" />
              </div>
              <h3 className="text-xl font-display font-bold text-[#F5F1EB] mb-1">
                {step.title}
              </h3>
              <div className="text-xs font-semibold text-[#FFAD76] uppercase tracking-wider mb-3">
                {step.subtitle}
              </div>
              <p className="text-[#A5A5A5] text-xs sm:text-sm leading-relaxed mb-4 font-normal">
                {step.description}
              </p>
              <div className="space-y-2 pt-3 border-t border-white/5">
                {step.keyActivities.map((act, aIdx) => (
                  <div key={aIdx} className="flex items-start gap-2 text-xs text-[#A5A5A5]">
                    <CheckCircle2 size={14} className="text-[#F07835] flex-shrink-0 mt-0.5" />
                    <span>{act}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

