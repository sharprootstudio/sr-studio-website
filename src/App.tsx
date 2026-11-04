import React from 'react';
import { Navbar } from './components/common/Navbar';
import { Hero } from './components/hero/Hero';
import { Introduction } from './components/intro/Introduction';
import { ServicesSection } from './components/services/ServicesSection';
import { WhyUsSection } from './components/why-us/WhyUsSection';
import { PortfolioSection } from './components/work/PortfolioSection';
import { ProcessSection } from './components/process/ProcessSection';
import { ContactSection } from './components/contact/ContactSection';
import { Footer } from './components/common/Footer';
import { AgencyChatbot } from './components/chatbot/AgencyChatbot';

export const App: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-[#0C0D10] text-[#F5F1EB] selection:bg-[#F07835] selection:text-white flex flex-col justify-between overflow-x-hidden">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Content Sections: Exact Render Order */}
      <main className="flex-grow">
        {/* 1. HOME */}
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
