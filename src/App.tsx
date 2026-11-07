import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Navbar } from './components/common/Navbar';
import { Hero } from './components/hero/Hero';
import { NeuralBackground } from './components/common/NeuralBackground';
import { Introduction } from './components/intro/Introduction';
import { ServicesSection } from './components/services/ServicesSection';
import { WhyUsSection } from './components/why-us/WhyUsSection';
import { PortfolioSection } from './components/work/PortfolioSection';
import { ProcessSection } from './components/process/ProcessSection';
import { ContactSection } from './components/contact/ContactSection';
import { Footer } from './components/common/Footer';
import { AgencyChatbot } from './components/chatbot/AgencyChatbot';
import { RefreshCw } from 'lucide-react';

// Code-split the Admin Console so the public website bundle stays 100% lean
const AdminApp = lazy(() => import('./admin/AdminApp'));

export const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState(() => 
    typeof window !== 'undefined' ? window.location.pathname : '/'
  );

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const isAdminRoute = currentPath.startsWith('/admin');

  // If navigating to /admin, render the lazy-loaded secure admin portal
  if (isAdminRoute) {
    return (
      <Suspense
        fallback={
          <div className="min-h-screen bg-[#0C0D10] text-[#F5F1EB] flex flex-col items-center justify-center p-4">
            <RefreshCw size={28} className="text-[#F07835] animate-spin mb-3" />
            <span className="text-xs font-mono uppercase tracking-widest text-[#FFAD76]">
              Loading SR Studio Admin Console...
            </span>
          </div>
        }
      >
        <AdminApp />
      </Suspense>
    );
  }

  // Otherwise, render the exact public landing page
  return (
    <div className="relative min-h-screen bg-[#0C0D10] text-[#F5F1EB] selection:bg-[#F07835] selection:text-white flex flex-col justify-between overflow-x-hidden">
      {/* 3D Animated Particle Network: Fixed across the entire viewport behind non-home content */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <NeuralBackground />
      </div>

      {/* Top Navbar */}
      <Navbar />

      {/* Main Content Sections: Exact Render Order */}
      <main className="flex-grow relative z-10">
        {/* 1. HOME — 100% untouched Hero section with original 3D ribbon */}
        <Hero />

        {/* 2. SERVICES */}
        <ServicesSection />

        {/* 3. WORK */}
        <PortfolioSection />

        {/* 4. PROCESS */}
        <ProcessSection />

        {/* 5. ABOUT */}
        <Introduction />
        <WhyUsSection />

        {/* 6. CONTACT */}
        <ContactSection />
      </main>

      {/* Section 9: Footer */}
      <Footer />

      {/* Floating Interactive Agency AI Chatbot */}
      <AgencyChatbot />
    </div>
  );
};

export default App;
