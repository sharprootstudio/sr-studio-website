import React from 'react';
import { Badge } from './Badge';

interface SectionHeadingProps {
  badge?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  badge,
  title,
  subtitle,
  align = 'center',
  className = '',
}) => {
  const alignClass = align === 'center' ? 'text-center mx-auto items-center' : 'text-left items-start';

  return (
    <div className={`flex flex-col max-w-3xl ${alignClass} mb-12 md:mb-16 ${className}`}>
      {badge && (
        <Badge variant="orange" size="sm" className="mb-4">
          {badge}
        </Badge>
      )}
      <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-extrabold text-[#F5F1EB] tracking-tight leading-[1.15]">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base md:text-lg text-[#A5A5A5] leading-relaxed max-w-2xl">
          {subtitle}
        </p>
      )}
    </div>
  );
};

