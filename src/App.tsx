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

      {/* Main Content Sections */}
      <main className="flex-grow">
        {/* Section 1 & 2: Clean, High-Impact Hero with Neural Constellation */}
        <Hero />

        {/* Section 3: Introduction */}
        <Introduction />

        {/* Section 4: Our Services */}
        <ServicesSection />

        {/* Section 5: Why Choose SR Studio */}
        <WhyUsSection />

        {/* Section 6: Our Work / Portfolio */}
        <PortfolioSection />

        {/* Section 7: Our Process */}
        <ProcessSection />

        {/* Section 8: Contact & Inquiries */}
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
