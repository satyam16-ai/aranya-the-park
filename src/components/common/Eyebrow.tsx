import React from 'react';
import { cn } from '../../lib/cn';

interface EyebrowProps extends React.HTMLAttributes<HTMLSpanElement> {
  align?: 'left' | 'center';
}

/** Small tracked label with a leading gold rule (and a trailing rule when centred). */
export const Eyebrow: React.FC<EyebrowProps> = ({ align = 'left', className, children, ...rest }) => (
  <span className={cn('t-eyebrow', align === 'center' && 't-eyebrow-center', className)} {...rest}>
    {children}
  </span>
);
