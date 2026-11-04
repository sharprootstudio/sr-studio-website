import { Service } from '../types';

export const servicesData: Service[] = [
  {
    id: 'website-development',
    title: 'Website Development',
    tagline: 'High-Performance Digital Flagships',
    description: 'Modern, responsive websites designed to build credibility, elevate your digital presence, and convert visitors into clients.',
    badge: 'Core Engineering',
    iconName: 'Globe',
    fullDetails: [
      'Sub-second load times utilizing modern static generation and server-side rendering architectures.',
      'Bespoke fluid animations and micro-interactions optimized for smooth 60fps performance.',
      'Flawless responsive layouts rigorously tested across mobile, tablet, and ultra-wide displays.',
      'Comprehensive on-page technical SEO, schema structured data, and Core Web Vitals optimization.'
    ],
    deliverables: [
      'Custom React / Next.js Web Application',
      'Content Management Integration',
      'High-Conversion Landing Pages',
      'Technical SEO & Performance Audit Report'
    ],
    technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Vite']
  },
  {
    id: 'ai-solutions-automation',
    title: 'AI Solutions & Automation',
    tagline: 'Intelligent Operational Workflows',
    description: 'AI-powered workflows, intelligent agents, and business process automation to simplify operations and eliminate manual friction.',
    badge: 'Smart Technology',
    iconName: 'Cpu',
    fullDetails: [
      'Automated data pipelines and CRM synchronization eliminating repetitive manual entry.',
      'Custom LLM agent integrations for document summarization, inquiry triaging, and report synthesis.',
      'Operational dashboards that transform raw business metrics into actionable insights.',
      'Secure, privacy-conscious deployment keeping sensitive corporate data strictly contained.'
    ],
    deliverables: [
      'Custom Workflow Automation Pipelines',
      'CRM & System Integration (HubSpot, Make, Zapier)',
      'Intelligent Task Automation & Knowledge Base',
      'Detailed Operational Documentation'
    ],
    technologies: ['Python', 'OpenAI / Anthropic APIs', 'Make', 'Webhooks', 'REST APIs']
  },
  {
    id: 'branding-creative-design',
    title: 'Branding & Creative Design',
    tagline: 'Distinctive Visual Systems',
    description: 'Brand identity, visual systems, and creative assets that help businesses command attention and stand out with authority.',
    badge: 'Identity Suite',
    iconName: 'Palette',
    fullDetails: [
      'Intentional art direction that rejects generic templates in favor of authentic brand differentiation.',
      'Comprehensive multi-tier design systems with cohesive color tokens, typography scales, and component specs.',
      'High-impact visual assets designed for pitch decks, social media, and digital marketing.',
      'Scalable vector logo lockups, stationery, and comprehensive brand guidelines documentation.'
    ],
    deliverables: [
      'Complete Brand Guidelines (PDF & Figma)',
      'Primary, Secondary & Icon Logo Suite',
      'Typography & Color Palette System',
      'Digital Collateral & Marketing Assets'
    ],
    technologies: ['Figma', 'Adobe Illustrator', 'Photoshop', 'Design Tokens', 'Typography Specs']
  },
  {
    id: 'digital-growth-solutions',
    title: 'Digital Growth Solutions',
    tagline: 'Conversion-Focused Experiences',
    description: 'Digital experiences and technology-driven solutions that support long-term business growth and customer engagement.',
    badge: 'Strategic Growth',
    iconName: 'Sparkles',
    fullDetails: [
      'Interactive digital experiences and campaign micro-sites engineered for high engagement.',
      'User journey mapping, cognitive ergonomics, and conversion rate optimization (CRO).',
      'Data-driven design decisions based on real user analytics, heatmaps, and funnel telemetry.',
      'Ongoing technical improvements and performance monitoring to maintain competitive advantage.'
    ],
    deliverables: [
      'Interactive Experience Architecture',
      'Conversion Rate Optimization (CRO) Plan',
      'Analytics & User Journey Tracking Setup',
      'Continuous Technical Guidance'
    ],
    technologies: ['Analytics', 'Heatmaps', 'A/B Testing', 'Modern Web Standards', 'Tailwind CSS']
  }
];
