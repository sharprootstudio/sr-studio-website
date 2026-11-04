import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'orange' | 'charcoal' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'orange',
  size = 'md',
  className = '',
}) => {
  const baseStyles = 'inline-flex items-center font-medium rounded-full tracking-wide';

  const sizeStyles = {
    sm: 'text-[11px] px-2.5 py-0.5 uppercase tracking-wider',
    md: 'text-xs px-3.5 py-1.5',
  };

  const variantStyles = {
    orange: 'bg-[#F07835]/15 text-[#FFAD76] border border-[#F07835]/30',
    charcoal: 'bg-[#24272B] text-[#A5A5A5] border border-white/5',
    outline: 'bg-transparent text-[#F5F1EB] border border-white/15',
  };

  return (
    <span className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
};

