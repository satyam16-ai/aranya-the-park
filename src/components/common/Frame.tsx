import React from 'react';
import { cn } from '../../lib/cn';

interface FrameProps extends React.HTMLAttributes<HTMLElement> {
  as?: 'div' | 'figure';
}

/** Brochure device: a double gold hairline around imagery or a form. */
export const Frame: React.FC<FrameProps> = ({ as = 'div', className, children, ...rest }) => {
  const Tag = as as 'div';
  return (
    <Tag className={cn('frame', className)} {...rest}>
      {children}
    </Tag>
  );
};
