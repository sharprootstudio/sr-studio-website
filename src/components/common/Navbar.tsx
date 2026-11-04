import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import { Button } from './Button';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Services', href: '#services' },
    { label: 'Work', href: '#work' },
    { label: 'About', href: '#about' },
    { label: 'Process', href: '#process' },
    { label: 'Contact', href: '#contact' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0C0D10]/92 backdrop-blur-xl border-b border-white/10 py-2.5 sm:py-3 shadow-lg shadow-black/50'
          : 'bg-transparent py-3 sm:py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Official Metallic Emblem Logo (Clean without subtitle) */}
          <a
            href="#home"
            className="flex items-center gap-3 group"
            onClick={(e) => handleLinkClick(e, '#home')}
          >
            <div className="relative h-10 w-10 sm:h-11 sm:w-11 flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
              <img
                src="/logo-clean.png"
                alt="SR Studio Emblem"
                className="h-full w-full object-contain filter drop-shadow-[0_2px_12px_rgba(240,120,53,0.5)]"
                loading="eager"
              />
            </div>
            <span className="font-display font-extrabold text-lg sm:text-xl tracking-tight text-[#F5F1EB] group-hover:text-white transition-colors leading-none">
              SR STUDIO
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="text-sm font-medium text-[#A5A5A5] hover:text-[#F5F1EB] transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Action CTA Button (Reference Style) */}
          <div className="hidden sm:flex items-center">
            <Button
              size="sm"
              variant="primary"
              icon={<ArrowRight size={15} />}
              onClick={() => {
                const contactEl = document.querySelector('#contact');
                if (contactEl) contactEl.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-full shadow-[0_4px_20px_rgba(240,120,53,0.35)]"
            >
              Let's Talk
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 text-[#F5F1EB] hover:text-[#F07835] bg-[#17191C] border border-white/10 rounded-xl transition-colors cursor-pointer active:scale-95"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[65px] bottom-0 bg-[#0C0D10]/98 backdrop-blur-2xl border-t border-white/10 px-6 pt-6 pb-12 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-top-2 duration-200 z-50">
          <nav className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="px-4 py-3 text-lg font-display font-bold text-[#F5F1EB] hover:bg-[#F07835]/15 hover:text-[#FFAD76] rounded-xl transition-colors flex items-center justify-between"
              >
                <span>{link.label}</span>
                <ArrowRight size={16} className="text-[#A5A5A5]" />
              </a>
            ))}
          </nav>

          <div className="pt-6 border-t border-white/10 space-y-4">
            <Button
              variant="primary"
              size="lg"
              className="w-full text-base font-semibold"
              icon={<ArrowRight size={18} />}
              onClick={() => {
                setMobileMenuOpen(false);
                const contactEl = document.querySelector('#contact');
                if (contactEl) contactEl.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Let's Talk
            </Button>

            <div className="text-center text-xs text-[#A5A5A5]">
              Direct Inquiries: <a href="mailto:sharprootstudio@gmail.com" className="text-[#FFAD76] underline">sharprootstudio@gmail.com</a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
