import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'gold' | 'emerald' | 'subtle';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'gold',
  className = '',
}) => {
  const variantStyles = {
    gold: 'border border-[#C5A880]/50 text-[#DFCA9F] bg-[#0B2019]/80',
    emerald: 'border border-[#1B3B2E] text-[#71C5A5] bg-[#0B2019]/90',
    subtle: 'border border-white/10 text-[#C7CEC9] bg-white/5',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 text-[11px] font-sans font-medium uppercase tracking-[0.15em] backdrop-blur-md ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
