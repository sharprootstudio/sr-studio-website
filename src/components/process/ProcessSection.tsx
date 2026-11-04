import React, { useState } from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { SectionHeading } from '../common/SectionHeading';
import { processSteps } from '../../data/process';

export const ProcessSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);

  return (
    <section id="process" className="relative py-24 sm:py-32 bg-[#0C0D10] overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <SectionHeading
          badge="How We Work"
          title="From First Idea to Final Experience."
          subtitle="A transparent, collaborative four-step journey transforming complex business requirements into elegant digital realities."
        />

        {/* Desktop Interactive Horizontal Timeline Nav */}
        <div className="hidden lg:grid grid-cols-4 gap-4 mb-12">
          {processSteps.map((step, idx) => (
            <button
              key={step.number}
              onClick={() => setActiveStep(idx)}
              className={`text-left p-6 rounded-2xl border transition-all duration-300 cursor-pointer relative overflow-hidden ${
                activeStep === idx
                  ? 'bg-[#24272B] border-[#F07835] shadow-[0_0_25px_rgba(240,120,53,0.15)] -translate-y-1'
                  : 'bg-[#1D2024]/60 border-white/5 hover:border-white/15 opacity-70 hover:opacity-100'
              }`}
            >
              <div className="text-sm font-mono font-bold text-[#F07835] mb-2">
                {step.number}
              </div>
              <div className="text-xl font-display font-bold text-[#F5F1EB] mb-1">
                {step.title}
              </div>
              <div className="text-xs text-[#A5A5A5] line-clamp-1">
                {step.subtitle}
              </div>

              {/* Active Indicator Bar */}
              {activeStep === idx && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#F07835] to-[#FFAD76]" />
              )}
            </button>
          ))}
        </div>

        {/* Active Step Detailed Showcase (Desktop) */}
        <div className="hidden lg:block bg-[#24272B]/80 backdrop-blur-md border border-white/10 rounded-3xl p-10 lg:p-12 mb-8">
          <div className="grid grid-cols-12 gap-8 items-center">
            
            <div className="col-span-5 pr-4 border-r border-white/10">
              <span className="text-5xl font-display font-extrabold text-orange-gradient">
                {processSteps[activeStep].number}
              </span>
              <h3 className="text-3xl font-display font-bold text-[#F5F1EB] mt-2 mb-2">
                {processSteps[activeStep].title}
              </h3>
              <div className="text-sm font-semibold text-[#FFAD76] uppercase tracking-wider mb-4">
                {processSteps[activeStep].subtitle}
              </div>
              <p className="text-[#A5A5A5] text-base leading-relaxed">
                {processSteps[activeStep].description}
              </p>
            </div>

            <div className="col-span-7 pl-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#F5F1EB] mb-4">
                Core Deliverables & Methodologies
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {processSteps[activeStep].keyActivities.map((act, i) => (
                  <div
                    key={i}
                    className="bg-[#17191C]/80 border border-white/5 rounded-xl p-4 flex items-start gap-3"
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
              className="bg-[#24272B]/80 border border-white/10 rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xl font-mono font-bold text-[#F07835]">
                  {step.number}
                </span>
                <h3 className="text-xl font-display font-bold text-[#F5F1EB]">
                  {step.title}
                </h3>
              </div>
              <div className="text-xs font-semibold text-[#FFAD76] uppercase tracking-wider mb-3">
                {step.subtitle}
              </div>
              <p className="text-[#A5A5A5] text-sm leading-relaxed mb-4">
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

