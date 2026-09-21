import React from 'react';
import { cn } from '../../lib/cn';

type ContainerSize = 'prose' | 'content' | 'showcase' | 'wide' | 'full';

interface ContainerProps extends React.HTMLAttributes<HTMLElement> {
  size?: ContainerSize;
  as?: 'div' | 'section' | 'article' | 'aside' | 'header' | 'footer' | 'nav';
}

const widths: Record<ContainerSize, string> = {
  prose: 'max-w-prose',
  content: 'max-w-content',
  showcase: 'max-w-showcase',
  wide: 'max-w-wide',
  full: 'max-w-none',
};

/** Centred, gutter-padded layout container. Default width 1280px. */
export const Container: React.FC<ContainerProps> = ({
  size = 'content',
  as = 'div',
  className,
  children,
  ...rest
}) => {
  const Tag = as as 'div';
  return (
    <Tag className={cn('mx-auto w-full px-5 sm:px-8 lg:px-12', widths[size], className)} {...rest}>
      {children}
    </Tag>
  );
};
