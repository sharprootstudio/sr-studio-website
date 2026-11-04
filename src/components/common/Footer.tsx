import React from 'react';
import { ArrowUp, Github, Linkedin, Twitter, Instagram, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Our Work', href: '#work' },
    { label: 'Process', href: '#process' },
    { label: 'Contact', href: '#contact' },
  ];

  const serviceLinks = [
    { label: 'Website Development', href: '#services' },
    { label: 'Branding & Creative Design', href: '#services' },
    { label: 'AI Solutions & Automation', href: '#services' },
    { label: 'AI Calling Agents', href: '#services' },
    { label: 'Digital Experiences', href: '#services' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#0A0B0D] text-[#A5A5A5] pt-16 pb-12 border-t border-white/5 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-14 border-b border-white/10">
          
          {/* Brand Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <a
              href="#home"
              onClick={(e) => handleLinkClick(e, '#home')}
              className="flex items-center gap-3.5 group inline-flex"
            >
              <div className="h-12 w-12 rounded-xl overflow-hidden bg-[#17191C] border border-[#F07835]/40 p-1 shadow-md transition-transform duration-300 group-hover:scale-105 group-hover:border-[#F07835] flex items-center justify-center flex-shrink-0">
                <img
                  src="/logo.png"
                  alt="SR Studio Official Logo"
                  className="h-full w-full object-contain filter drop-shadow-[0_2px_6px_rgba(240,120,53,0.4)]"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-extrabold text-xl tracking-tight text-[#F5F1EB] group-hover:text-white transition-colors">
                  SR STUDIO
                </span>
                <span className="text-xs tracking-widest text-[#FFAD76] uppercase font-semibold">
                  Sharp Root Studio
                </span>
              </div>
            </a>

            <p className="text-sm text-[#A5A5A5] leading-relaxed max-w-sm">
              <strong className="text-[#FFAD76]">Turning Vision Into Value.</strong> We transform ideas into meaningful digital experiences through creative design, smart technology, and innovative digital solutions.
            </p>

            {/* Direct Email Pill */}
            <div className="flex items-center gap-2.5 pt-1">
              <div className="w-8 h-8 rounded-lg bg-[#F07835]/15 border border-[#F07835]/30 flex items-center justify-center text-[#F07835] flex-shrink-0">
                <Mail size={15} />
              </div>
              <a
                href="mailto:sharprootstudio@gmail.com"
                className="text-xs sm:text-sm font-semibold text-[#F5F1EB] hover:text-[#F07835] transition-colors underline decoration-[#F07835]/30 underline-offset-4"
              >
                sharprootstudio@gmail.com
              </a>
            </div>

            {/* Social Media Links */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://github.com/sharprootstudio"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-[#17191C] border border-white/5 flex items-center justify-center text-[#A5A5A5] hover:text-[#F07835] hover:border-[#F07835]/40 transition-colors"
                aria-label="GitHub"
              >
                <Github size={17} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-[#17191C] border border-white/5 flex items-center justify-center text-[#A5A5A5] hover:text-[#F07835] hover:border-[#F07835]/40 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={17} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-[#17191C] border border-white/5 flex items-center justify-center text-[#A5A5A5] hover:text-[#F07835] hover:border-[#F07835]/40 transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={17} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-[#17191C] border border-white/5 flex items-center justify-center text-[#A5A5A5] hover:text-[#F07835] hover:border-[#F07835]/40 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={17} />
              </a>
            </div>
          </div>

          {/* Quick Navigation (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F5F1EB]">
              Navigation
            </h4>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className="text-sm text-[#A5A5A5] hover:text-[#F07835] transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Column (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F5F1EB]">
              Core Disciplines
            </h4>
            <ul className="space-y-2.5">
              {serviceLinks.map((service) => (
                <li key={service.label}>
                  <a
                    href={service.href}
                    onClick={(e) => handleLinkClick(e, service.href)}
                    className="text-sm text-[#A5A5A5] hover:text-[#F07835] transition-colors"
                  >
                    {service.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#737373]">
          <div>
            © {new Date().getFullYear()} SR STUDIO (Sharp Root Studio). All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 text-[#A5A5A5] hover:text-[#F07835] transition-colors cursor-pointer"
              aria-label="Back to top"
            >
              <span>Back to Top</span>
              <ArrowUp size={14} />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
