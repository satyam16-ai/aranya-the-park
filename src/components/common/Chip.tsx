import React from 'react';
import { cn } from '../../lib/cn';

interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: 'outline' | 'solid' | 'soft';
}

const tones = {
  outline: 'border border-rule text-fg-muted',
  solid: 'bg-gold-500 text-linen-950 border border-transparent',
  soft: 'bg-fg/[0.06] text-fg border border-transparent',
};

export const Chip: React.FC<ChipProps> = ({ tone = 'outline', className, children, ...rest }) => (
  <span
    className={cn('inline-flex items-center gap-1.5 rounded-xs px-2.5 py-1 t-micro', tones[tone], className)}
    {...rest}
  >
    {children}
  </span>
);
