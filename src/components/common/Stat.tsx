import React from 'react';
import { cn } from '../../lib/cn';

interface StatProps {
  value: string;
  label: string;
  subtext?: string;
  size?: 'sm' | 'md' | 'lg';
  foil?: boolean;
  align?: 'left' | 'center';
  className?: string;
}

const sizes = {
  sm: 'text-[clamp(1.75rem,1rem+1.5vw,2.25rem)]',
  md: 'text-[clamp(2.25rem,1rem+3vw,3.25rem)]',
  lg: 'text-stat',
};

/** Bodoni numeral + tracked label; `foil` renders the value in gold foil (dark surfaces). */
export const Stat: React.FC<StatProps> = ({
  value,
  label,
  subtext,
  size = 'md',
  foil = false,
  align = 'left',
  className,
}) => (
  <div className={cn(align === 'center' && 'text-center', className)}>
    <div
      className={cn(
        'font-display font-normal leading-none tracking-[-0.01em] tabular-nums',
        sizes[size],
        foil ? 't-foil' : 'text-accent-text'
      )}
    >
      {value}
    </div>
    <div className="t-micro mt-3 text-fg">{label}</div>
    {subtext && <div className="t-small mt-1 text-fg-muted">{subtext}</div>}
  </div>
);
