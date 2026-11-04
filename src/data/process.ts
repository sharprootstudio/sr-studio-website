import { ProcessStep } from '../types';

export const processSteps: ProcessStep[] = [
  {
    number: '01',
    title: 'Discover',
    subtitle: 'Understanding the Core Vision',
    description: 'We dive deep into your business model, audience dynamics, and market positioning to identify opportunities for tangible value creation.',
    keyActivities: [
      'Comprehensive stakeholder discovery & goals alignment',
      'Target audience research and cognitive empathy mapping',
      'Competitive landscape analysis & differentiation audit',
      'Technical feasibility assessment and architectural scope'
    ]
  },
  {
    number: '02',
    title: 'Strategize',
    subtitle: 'Architecting the Solution',
    description: 'We plan the optimal creative and technological trajectory, defining design systems, technology stacks, and milestone roadmaps.',
    keyActivities: [
      'Information architecture & user journey wireframing',
      'Brand aesthetic direction & moodboard exploration',
      'Tech stack selection & API integration blueprinting',
      'Conversion Rate Optimization (CRO) strategic mapping'
    ]
  },
  {
    number: '03',
    title: 'Create',
    subtitle: 'Design, Engineer & Refine',
    description: 'Where art meets engineering. We craft bespoke visual designs, code high-performance frontends, and configure intelligent AI automations.',
    keyActivities: [
      'High-fidelity interactive UI prototyping in Figma',
      'Production-grade modern web development (React / Vite)',
      'Subtle 3D physics, fluid animations & micro-interactions',
      'Rigorous cross-device testing & performance benchmarking'
    ]
  },
  {
    number: '04',
    title: 'Launch & Grow',
    subtitle: 'Deployment & Continuous Evolution',
    description: 'We deliver your digital experience with flawless execution, zero downtime, and strategic support to accelerate your ongoing growth.',
    keyActivities: [
      'Production deployment with global CDN acceleration',
      'Core Web Vitals verification & SEO / GEO indexation',
      'Analytics, conversion tracking & error monitoring setup',
      'Iterative post-launch refinement and roadmap evolution'
    ]
  }
];

