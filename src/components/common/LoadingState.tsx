import React from 'react';
import { cn } from '../../lib/cn';

interface LoadingStateProps {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = { sm: 'w-6 h-6', md: 'w-10 h-10', lg: 'w-14 h-14' };

export const LoadingState: React.FC<LoadingStateProps> = ({ label, size = 'md', className }) => (
  <div className={cn('flex flex-col items-center justify-center gap-4', className)} role="status">
    <span
      className={cn('block border border-gold-400/60 animate-spin-slow', sizes[size])}
      aria-hidden="true"
    />
    {label && <span className="t-micro text-fg-muted">{label}</span>}
    <span className="sr-only">Loading</span>
  </div>
);
