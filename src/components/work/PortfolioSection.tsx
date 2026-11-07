import React, { useState } from 'react';
import { ExternalLink, Tag, Sparkles, ArrowUpRight } from 'lucide-react';
import { SectionHeading } from '../common/SectionHeading';
import { portfolioData } from '../../data/portfolio';
import { Project } from '../../types';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

export const PortfolioSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const categories = ['All', 'Websites', 'Branding', 'AI Solutions', 'Creative Projects'];

  const filteredProjects = activeCategory === 'All'
    ? portfolioData
    : portfolioData.filter((p) => p.category === activeCategory);

  return (
    <section id="work" className="relative py-28 sm:py-36 bg-transparent overflow-hidden border-t border-white/[0.08]">
      {/* Background Agent Valley Grid & Center Light Glow */}
      <div className="absolute inset-0 bg-agent-grid pointer-events-none opacity-60" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[#F07835]/06 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <SectionHeading
          badge="Featured Work"
          title="Ideas Into Experiences."
          subtitle="Explore concept projects demonstrating our technical and visual capabilities across modern websites, brand systems, and AI workflows."
        />

        {/* Category Filter Pills: Segmented Tray */}
        <div className="flex justify-center mb-12 sm:mb-16">
          <div className="inline-flex flex-wrap items-center justify-center gap-1.5 p-1.5 rounded-full bg-[#141619]/90 border border-white/10 backdrop-blur-md shadow-xl">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 cursor-pointer ${activeCategory === cat
                    ? 'bg-[#F07835] text-white shadow-[0_2px_18px_rgba(240,120,53,0.45)]'
                    : 'text-[#A5A5A5] hover:text-[#F5F1EB] hover:bg-white/5'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid: Elevated Bento Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="premium-card rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col justify-between group relative"
            >
              {/* Image Preview Container */}
              <div className="relative aspect-[16/10] overflow-hidden bg-[#17191C]">
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />

                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#141619] via-[#141619]/30 to-transparent" />

                {/* Top Left: Concept Badge */}
                <div className="absolute top-3.5 left-3.5">
                  <span className="inline-flex items-center gap-1.5 bg-black/80 backdrop-blur-md border border-white/10 text-[10px] font-semibold uppercase tracking-wider text-[#FFAD76] px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F07835] animate-pulse" />
                    Concept Project
                  </span>
                </div>

                {/* Top Right: Category Tag */}
                <div className="absolute top-3.5 right-3.5">
                  <span className="bg-black/80 backdrop-blur-md text-[11px] font-mono text-[#F5F1EB] px-2.5 py-1 rounded-full border border-white/10">
                    {project.category}
                  </span>
                </div>

                {/* Bottom Right Floating Action Indicator */}
                <div className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-[#17191C]/90 border border-white/10 flex items-center justify-center text-[#F5F1EB] group-hover:border-[#F07835] group-hover:text-[#F07835] group-hover:bg-[#F07835]/15 transition-all duration-300">
                  <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 sm:p-7 flex flex-col flex-grow justify-between">
                <div>
                  <h3 className="text-xl sm:text-2xl font-display font-bold text-[#F5F1EB] group-hover:text-white transition-colors mb-1.5">
                    {project.title}
                  </h3>
                  <div className="text-xs font-semibold text-[#FFAD76] uppercase tracking-wider mb-3">
                    {project.tagline}
                  </div>
                  <p className="text-[#A5A5A5] text-xs sm:text-sm leading-relaxed mb-6 line-clamp-3 font-normal">
                    {project.description}
                  </p>
                </div>

                <div>
                  {/* Technology Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-[#17191C] text-[#A5A5A5] text-[11px] font-mono px-2.5 py-0.5 rounded-md border border-white/5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* View Details CTA */}
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-[#F07835]/15 hover:text-[#FFAD76] border border-white/10 hover:border-[#F07835]/40 text-xs sm:text-sm font-semibold text-[#F5F1EB] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>View Architecture & Specs</span>
                    <ArrowUpRight size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Project Case Details Modal */}
      {selectedProject && (
        <Modal
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
          title={selectedProject.title}
          badge="Demonstration Architecture"
        >
          <div>
            <div className="rounded-xl overflow-hidden aspect-[16/9] mb-6 border border-white/10">
              <img
                src={selectedProject.imageUrl}
                alt={selectedProject.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="text-xs font-semibold text-[#FFAD76] uppercase tracking-wider mb-2">
              {selectedProject.tagline}
            </div>
            <p className="text-[#A5A5A5] text-sm leading-relaxed mb-6">
              {selectedProject.description}
            </p>

            <div className="space-y-4 mb-6">
              <div className="bg-[#17191C] p-4 rounded-xl border border-white/5">
                <div className="text-xs font-bold uppercase tracking-wider text-[#F5F1EB] mb-1">
                  The Challenge
                </div>
                <p className="text-xs sm:text-sm text-[#A5A5A5] leading-relaxed">
                  {selectedProject.challenge}
                </p>
              </div>

              <div className="bg-[#17191C] p-4 rounded-xl border border-white/5">
                <div className="text-xs font-bold uppercase tracking-wider text-[#F07835] mb-1">
                  The SR Studio Solution
                </div>
                <p className="text-xs sm:text-sm text-[#A5A5A5] leading-relaxed">
                  {selectedProject.solution}
                </p>
              </div>

              <div className="bg-[#17191C] p-4 rounded-xl border border-white/5">
                <div className="text-xs font-bold uppercase tracking-wider text-[#FFAD76] mb-1">
                  Architectural Impact
                </div>
                <p className="text-xs sm:text-sm text-[#A5A5A5] leading-relaxed">
                  {selectedProject.impact}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {selectedProject.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-[#2E3339] text-[#A5A5A5] text-xs px-3 py-1 rounded-full border border-white/5"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex justify-end pt-4 border-t border-white/10">
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  setSelectedProject(null);
                  const contactEl = document.querySelector('#contact');
                  if (contactEl) contactEl.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Discuss Similar Project
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
};

