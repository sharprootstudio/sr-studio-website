import { ProcessStep } from '../types';

export const processSteps: ProcessStep[] = [
  {
    number: '01',
    title: 'Discover',
    subtitle: 'Understanding the Core Vision',
    description: 'Understand the business, goals, audience, and technical requirements to establish a clear foundation for success.',
    keyActivities: [
      'Comprehensive stakeholder discovery & goals alignment',
      'Target audience research and user need mapping',
      'Competitive landscape analysis & brand positioning',
      'Technical feasibility assessment and project scope'
    ]
  },
  {
    number: '02',
    title: 'Strategize',
    subtitle: 'Architecting the Solution',
    description: 'Plan the right design, technology, and solution through clear roadmaps, wireframes, and architectural specs.',
    keyActivities: [
      'Information architecture & user journey wireframing',
      'Brand aesthetic direction & moodboard exploration',
      'Tech stack selection & API integration blueprinting',
      'Conversion optimization & milestone scheduling'
    ]
  },
  {
    number: '03',
    title: 'Create',
    subtitle: 'Design, Engineer & Refine',
    description: 'Design, develop, test, and refine the experience through iterative craft, modern code, and attention to detail.',
    keyActivities: [
      'High-fidelity interactive UI design and prototyping',
      'Clean modern web engineering (React / TypeScript)',
      'Subtle animations, responsive testing & QA reviews',
      'Core Web Vitals performance benchmarking'
    ]
  },
  {
    number: '04',
    title: 'Deliver',
    subtitle: 'Launch & Agreed Support',
    description: 'Launch the solution and provide agreed support to ensure smooth operation, high performance, and continued success.',
    keyActivities: [
      'Production deployment with global CDN acceleration',
      'SEO verification, metadata & analytics verification',
      'Handover documentation & training walkthrough',
      'Agreed post-launch support and ongoing optimization'
    ]
  }
];
