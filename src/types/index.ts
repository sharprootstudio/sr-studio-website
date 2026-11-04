export interface Service {
  id: string;
  title: string;
  tagline: string;
  description: string;
  fullDetails: string[];
  deliverables: string[];
  technologies: string[];
  iconName: string;
  badge: string;
}

export interface Project {
  id: string;
  title: string;
  category: 'Websites' | 'Branding' | 'AI Solutions' | 'Creative Projects';
  tagline: string;
  description: string;
  challenge: string;
  solution: string;
  impact: string;
  tags: string[];
  imageUrl: string;
  aspectRatio?: string;
  isDemo: boolean;
}

export interface ProcessStep {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  keyActivities: string[];
}

export interface NavItem {
  label: string;
  href: string;
}

