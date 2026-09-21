import React from 'react';
import { cn } from '../../lib/cn';

interface CardProps extends React.HTMLAttributes<HTMLElement> {
  elevated?: boolean;
  padded?: boolean | 'lg';
  as?: 'div' | 'article' | 'li' | 'section';
}

/** Surface-aware card: reads --card / --card-border from the enclosing section. */
export const Card: React.FC<CardProps> = ({
  elevated = false,
  padded = true,
  as = 'div',
  className,
  children,
  ...rest
}) => {
  const Tag = as as 'div';
  return (
  <Tag
    className={cn(
      'bg-card border border-card-border rounded-sm',
      elevated && 'shadow-md',
      padded === 'lg' ? 'p-8 sm:p-10 lg:p-12' : padded && 'p-6 sm:p-8',
      className
    )}
    {...rest}
  >
    {children}
  </Tag>
  );
};
