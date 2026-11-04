import { Service } from '../types';

export const servicesData: Service[] = [
  {
    id: 'website-development',
    title: 'Website Development',
    tagline: 'High-Performance Digital Flagships',
    description: 'Modern, responsive, high-performance websites designed to create strong digital experiences and convert visitors into loyal clients.',
    badge: 'Core Specialty',
    iconName: 'Globe',
    fullDetails: [
      'Sub-second load times utilizing modern static generation and server-side rendering architectures.',
      'Bespoke fluid animations and micro-interactions optimized for smooth 60fps performance.',
      'Flawless responsive layouts rigorously tested across mobile, tablet, and ultra-wide displays.',
      'Comprehensive on-page technical SEO, schema structured data, and Core Web Vitals optimization.'
    ],
    deliverables: [
      'Custom React / Next.js Web Application',
      'CMS Integration (Sanity / Strapi / Decap)',
      'E-commerce & Custom Checkout Flows',
      'Technical SEO & Performance Audit Report'
    ],
    technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Vite', 'Framer Motion']
  },
  {
    id: 'branding-creative-design',
    title: 'Branding & Creative Design',
    tagline: 'Distinctive Visual Storytelling',
    description: 'Distinctive brand identities, visual storytelling, and creative assets that help businesses command attention and build lasting authority.',
    badge: 'Identity Suite',
    iconName: 'Palette',
    fullDetails: [
      'Intentional art direction that rejects generic templates in favor of authentic brand differentiation.',
      'Comprehensive multi-tier design systems with cohesive color tokens, typography scales, and component specs.',
      'High-impact visual assets designed for pitch decks, social media, and digital advertising.',
      'Scalable vector logo lockups, stationery, and comprehensive brand guidelines documentation.'
    ],
    deliverables: [
      'Complete Brand Guidelines (PDF & Figma)',
      'Primary, Secondary & Icon Logo Suite',
      'Typography & Color Palette System',
      'Social Media & Marketing Asset Templates'
    ],
    technologies: ['Figma', 'Adobe Illustrator', 'Photoshop', 'Design Tokens', 'Font Metrics']
  },
  {
    id: 'ai-solutions-automation',
    title: 'AI Solutions & Automation',
    tagline: 'Intelligent Operational Workflows',
    description: 'Practical AI-powered solutions, intelligent workflows, and automation pipelines to simplify business operations and reduce manual friction.',
    badge: 'Autonomous Scale',
    iconName: 'Cpu',
    fullDetails: [
      'Automated data pipelines and CRM synchronization eliminating repetitive manual entry.',
      'Custom LLM agent integrations for document summarization, email triaging, and report synthesis.',
      'Predictive analytics dashboards that transform raw operational metrics into actionable insights.',
      'Secure, privacy-conscious deployment keeping sensitive corporate data strictly contained.'
    ],
    deliverables: [
      'Custom Workflow Automation Pipelines',
      'CRM & ERP Integration (HubSpot, Make, Zapier)',
      'Autonomous AI Assistant & Knowledge Base',
      'Detailed API Documentation & Training'
    ],
    technologies: ['Python', 'LangChain', 'FastAPI', 'OpenAI / Anthropic APIs', 'Make', 'Webhook Queues']
  },
  {
    id: 'ai-calling-agents',
    title: 'AI Calling Agents',
    tagline: 'Conversational 24/7 Voice Intelligence',
    description: 'Intelligent voice-based solutions that help businesses manage customer conversations, qualify incoming leads, and answer inquiries 24/7.',
    badge: 'Voice AI Frontier',
    iconName: 'PhoneCall',
    fullDetails: [
      'Ultra-low-latency conversational voice agents that listen, understand context, and speak naturally.',
      'Automated outbound lead follow-up and inbound customer support with zero hold times.',
      'Real-time calendar scheduling, live qualification routing, and instant CRM ticket logging.',
      'Custom voice design tuned to match your brand tone, professionalism, and industry terminology.'
    ],
    deliverables: [
      'Custom Inbound & Outbound Calling Agent',
      'Automated Appointment Booking Integration',
      'Call Recording, Transcription & Sentiment Analysis',
      'Live Escalation Protocol to Human Operators'
    ],
    technologies: ['Voice Synthesizers', 'WebRTC', 'Twilio / Vapi', 'Whisper AI', 'Live CRM Webhooks']
  },
  {
    id: 'digital-experiences',
    title: 'Digital Experiences',
    tagline: 'Immersive Web & Interactive 3D',
    description: 'Creative digital solutions tailored to business goals and customer needs, blending art and engineering to create memorable digital interactions.',
    badge: 'Interactive Art',
    iconName: 'Sparkles',
    fullDetails: [
      'Interactive WebGL and Three.js 3D product showcases that allow clients to explore products in real-time.',
      'Gamified interactive storytelling and micro-sites for product launches and campaigns.',
      'High-conversion landing pages built with behavioral psychology and cognitive UX heuristics.',
      'Cross-platform tactile interfaces that leave a lasting emotional impression on your visitors.'
    ],
    deliverables: [
      'Interactive 3D / WebGL Landing Page',
      'Custom Canvas Shader Effects',
      'Campaign Micro-site Architecture',
      'Interactive Prototype & User Flow Testing'
    ],
    technologies: ['Three.js', 'WebGL', 'GSAP', 'GLSL Shaders', 'Canvas API', 'Tailwind CSS']
  }
];

