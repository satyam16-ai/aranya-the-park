import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  /** Max width variant */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'wide' | 'showcase' | 'full';
  /** Additional className */
  className?: string;
  /** HTML element to render */
  as?: 'div' | 'section' | 'article' | 'aside' | 'header' | 'footer';
}

const widths: Record<string, string> = {
  sm: 'max-w-3xl',
  md: 'max-w-5xl',
  lg: 'max-w-6xl',
  xl: 'max-w-[1152px]',
  wide: 'max-w-7xl',
  showcase: 'max-w-[1600px]',
  full: 'max-w-none',
};

/**
 * Container — constrains content width with consistent horizontal padding.
 * Default `lg` (1152px) for editorial feel. Use `wide` for Gallery.
 */
export const Container: React.FC<ContainerProps> = ({
  children,
  size = 'lg',
  className = '',
  as: Tag = 'div',
}) => {
  return (
    <Tag className={`mx-auto w-full px-5 sm:px-8 lg:px-12 ${widths[size]} ${className}`}>
      {children}
    </Tag>
  );
};
