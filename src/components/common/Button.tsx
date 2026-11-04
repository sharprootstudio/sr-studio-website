import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  iconPosition = 'right',
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#F07835] focus:ring-offset-2 focus:ring-offset-[#17191C] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group';

  const sizeStyles = {
    sm: 'text-xs px-4 py-2 gap-1.5',
    md: 'text-sm px-6 py-3 gap-2',
    lg: 'text-base px-8 py-3.5 gap-2.5',
  };

  const variantStyles = {
    primary: 'bg-[#F07835] text-white hover:bg-[#d96726] shadow-[0_4px_20px_rgba(240,120,53,0.35)] hover:shadow-[0_6px_28px_rgba(240,120,53,0.55)] hover:scale-[1.02] active:scale-[0.98]',
    secondary: 'bg-[#24272B] text-[#F5F1EB] hover:bg-[#2E3339] border border-white/10 hover:border-white/20 hover:scale-[1.02] active:scale-[0.98]',
    outline: 'bg-transparent text-[#F5F1EB] border border-[#F07835]/60 hover:border-[#F07835] hover:bg-[#F07835]/10 hover:text-white',
    ghost: 'bg-transparent text-[#A5A5A5] hover:text-[#F5F1EB] hover:bg-white/5',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {icon && iconPosition === 'left' && (
        <span className="transition-transform duration-300 group-hover:-translate-x-0.5">{icon}</span>
      )}
      <span>{children}</span>
      {icon && iconPosition === 'right' && (
        <span className="transition-transform duration-300 group-hover:translate-x-0.5">{icon}</span>
      )}
    </button>
  );
};

