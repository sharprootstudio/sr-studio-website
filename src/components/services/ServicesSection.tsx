import React, { useState } from 'react';
import { Globe, Palette, Cpu, PhoneCall, Sparkles, ArrowRight, Check } from 'lucide-react';
import { SectionHeading } from '../common/SectionHeading';
import { servicesData } from '../../data/services';
import { Service } from '../../types';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

export const ServicesSection: React.FC = () => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const getServiceIcon = (name: string) => {
    switch (name) {
      case 'Globe':
        return <Globe size={28} className="text-[#F07835]" />;
      case 'Palette':
        return <Palette size={28} className="text-[#F07835]" />;
      case 'Cpu':
        return <Cpu size={28} className="text-[#F07835]" />;
      case 'PhoneCall':
        return <PhoneCall size={28} className="text-[#F07835]" />;
      case 'Sparkles':
        return <Sparkles size={28} className="text-[#F07835]" />;
      default:
        return <Sparkles size={28} className="text-[#F07835]" />;
    }
  };

  return (
    <section id="services" className="relative py-28 sm:py-36 bg-[#0C0D10] overflow-hidden border-t border-white/[0.08]">
      {/* Subtle Agent-Valley Inspired Geometric Grid & Atmospheric Glow */}
      <div className="absolute inset-0 bg-agent-grid pointer-events-none opacity-60" />
      <div className="absolute top-1/4 -left-40 w-[500px] h-[500px] bg-[#F07835]/08 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-40 w-[500px] h-[500px] bg-[#F07835]/08 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <SectionHeading
          badge="Our Capabilities"
          title="What We Create."
          subtitle="Engineered for high impact. We design, build, and deploy premium digital systems that elevate your brand and support business growth."
        />

        {/* Services Grid: 4 Core Capabilities in High-Precision Modular Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {servicesData.map((service, index) => {
            return (
              <div
                key={service.id}
                className="premium-card rounded-2xl sm:rounded-3xl p-8 sm:p-10 flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Top Subtle Specular Line on Hover */}
                <div className="absolute top-0 inset-x-8 h-[1px] bg-gradient-to-r from-transparent via-[#F07835]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Radial Glow on Hover */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#F07835]/10 rounded-full blur-3xl group-hover:bg-[#F07835]/25 transition-all duration-500 pointer-events-none" />

                <div>
                  {/* Top Bar: Icon + Number & Badge */}
                  <div className="flex items-center justify-between mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-[#17191C] border border-white/10 flex items-center justify-center text-[#F07835] group-hover:scale-105 group-hover:border-[#F07835]/50 group-hover:shadow-[0_0_25px_rgba(240,120,53,0.25)] transition-all duration-300">
                      {getServiceIcon(service.iconName)}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-medium text-[#FFAD76] bg-[#F07835]/10 border border-[#F07835]/25 px-3 py-1 rounded-full uppercase tracking-wider">
                        {service.badge}
                      </span>
                      <span className="text-sm font-mono text-[#525252] group-hover:text-[#A5A5A5] transition-colors">
                        0{index + 1}
                      </span>
                    </div>
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="text-2xl sm:text-3xl font-display font-bold text-[#F5F1EB] group-hover:text-white transition-colors mb-2">
                    {service.title}
                  </h3>
                  <div className="text-xs font-semibold text-[#FFAD76] uppercase tracking-wider mb-4">
                    {service.tagline}
                  </div>

                  {/* Description */}
                  <p className="text-[#A5A5A5] text-sm leading-relaxed mb-6 font-normal">
                    {service.description}
                  </p>

                  {/* Quick Feature Pillars */}
                  <div className="space-y-2.5 mb-8 pt-4 border-t border-white/5">
                    {service.fullDetails.slice(0, 2).map((detail, dIdx) => (
                      <div key={dIdx} className="flex items-start gap-2.5 text-xs text-[#A5A5A5]">
                        <Check size={14} className="text-[#F07835] flex-shrink-0 mt-0.5" />
                        <span className="line-clamp-2 leading-relaxed">{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Row: Tech Stack Pills + Modal Trigger */}
                <div className="pt-5 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-1.5">
                    {service.technologies.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="text-[11px] font-mono text-[#A5A5A5] bg-[#17191C] px-2.5 py-0.5 rounded-md border border-white/5"
                      >
                        {tech}
                      </span>
                    ))}
                    {service.technologies.length > 3 && (
                      <span className="text-[11px] font-mono text-[#737373] px-1 py-0.5">
                        +{service.technologies.length - 3}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => setSelectedService(service)}
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#F5F1EB] group-hover:text-[#F07835] transition-colors cursor-pointer self-start sm:self-auto"
                  >
                    <span>View Specifications</span>
                    <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Interactive Service Detail Modal */}
      {selectedService && (
        <Modal
          isOpen={!!selectedService}
          onClose={() => setSelectedService(null)}
          title={selectedService.title}
          badge={selectedService.badge}
        >
          <div>
            <div className="text-sm font-medium text-[#FFAD76] mb-3">
              {selectedService.tagline}
            </div>
            <p className="text-[#A5A5A5] text-sm leading-relaxed mb-6">
              {selectedService.description}
            </p>

            <h4 className="text-sm font-bold uppercase tracking-wider text-[#F5F1EB] mb-3">
              Key Capabilities
            </h4>
            <ul className="space-y-2.5 mb-6">
              {selectedService.fullDetails.map((detail, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#A5A5A5]">
                  <Check size={16} className="text-[#F07835] flex-shrink-0 mt-0.5" />
                  <span>{detail}</span>
                </li>
              ))}
            </ul>

            <h4 className="text-sm font-bold uppercase tracking-wider text-[#F5F1EB] mb-3">
              Core Deliverables
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
              {selectedService.deliverables.map((item, idx) => (
                <div key={idx} className="bg-[#17191C] px-3.5 py-2 rounded-xl text-xs text-[#F5F1EB] border border-white/5 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F07835]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <h4 className="text-sm font-bold uppercase tracking-wider text-[#F5F1EB] mb-3">
              Technologies & Frameworks
            </h4>
            <div className="flex flex-wrap gap-2 mb-8">
              {selectedService.technologies.map((tech, idx) => (
                <span
                  key={idx}
                  className="bg-[#2E3339] text-[#A5A5A5] text-xs px-3 py-1 rounded-full border border-white/5"
                >
                  {tech}
                </span>
              ))}
            </div>

            <div className="flex justify-end pt-4 border-t border-white/10">
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  setSelectedService(null);
                  const contactEl = document.querySelector('#contact');
                  if (contactEl) contactEl.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Inquire About This Service
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
};

